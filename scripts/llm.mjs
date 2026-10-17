#!/usr/bin/env node
// Minimal OpenRouter chat caller — no dependencies (Node 18+ global fetch, native --env-file).
//
// Usage:
//   node --env-file=.env scripts/llm.mjs "your prompt"
//   echo "your prompt" | node --env-file=.env scripts/llm.mjs
//   node --env-file=.env scripts/llm.mjs --model anthropic/claude-3.5-sonnet --system "Be terse." "hi"
//   node scripts/llm.mjs --selftest   # offline check; no key or network needed
//
// Env: OPENROUTER_API_KEY (required), OPENROUTER_MODEL (default model),
//      OPENROUTER_BASE_URL, OPENROUTER_APP_URL, OPENROUTER_APP_NAME, OPENROUTER_TIMEOUT_MS (all optional;
//      the timeout defaults to 300000).
import { strict as assert } from "node:assert";
import { fileURLToPath } from "node:url";

// Models with a row in the approved-tool register (operations/AI-DATA-POLICY.md). A test keeps this
// in step with that row. ":free" variants are different routes and are not covered.
export const REGISTERED_MODELS = ["tencent/hy3"];

export function assertRegisteredModel(model, allow = false) {
  if (allow || REGISTERED_MODELS.includes(model)) return;
  throw new Error(`Model "${model}" has no row in the AI-DATA-POLICY register (approved: ${REGISTERED_MODELS.join(", ")}; ":free" variants are not covered). Use an approved model, or add --allow-unregistered-model for synthetic text only.`);
}

export function buildPayload(model, prompt, system) {
  const messages = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });
  return { model, messages };
}

export function buildHeaders(env) {
  const headers = {
    Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
  };
  if (env.OPENROUTER_APP_URL) headers["HTTP-Referer"] = env.OPENROUTER_APP_URL;
  if (env.OPENROUTER_APP_NAME) headers["X-Title"] = env.OPENROUTER_APP_NAME;
  return headers;
}

// finish_reason values that mean the text is cut short — never a usable result.
const INCOMPLETE = new Set(["length", "content_filter", "error"]);

// Some providers return content as a list of parts ({type:"text", text}) instead of a string.
export function textOf(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map((p) => (typeof p === "string" ? p : p?.text ?? "")).join("");
  return "";
}

// Reusable one-shot chat call. Returns the assistant content; throws on error.
export async function chat({ model, system, prompt, env = process.env, onUsage }) {
  const base = env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: buildHeaders(env),
    body: JSON.stringify(buildPayload(model, prompt, system)),
    // ponytail: one flat deadline; per-step budgets if long jobs ever need them.
    // 300s: the long final stage of a Claim Audit timed out at the old 120s default.
    signal: AbortSignal.timeout(Number(env.OPENROUTER_TIMEOUT_MS) || 300000),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status} ${res.statusText}: ${await res.text()}`);
  const json = await res.json();
  if (json.usage && onUsage) onUsage(json.usage);
  const choice = json.choices?.[0];
  const content = textOf(choice?.message?.content);
  if (!content.trim()) throw new Error(`Empty or unexpected response: ${JSON.stringify(json)}`);
  // ponytail: blocklist, not allowlist — providers invent their own success words.
  if (INCOMPLETE.has(choice.finish_reason)) {
    throw new Error(`Response incomplete (finish_reason: ${choice.finish_reason}). Partial output kept out of the chain:\n${content}`);
  }
  return content;
}

// Strict option parser shared by this CLI and the console. Unknown options, missing values, and
// an option swallowing the next option all throw before anything reaches a provider.
// `--opt=value` may carry a leading dash; a bare `--` ends options so a prompt may start with "-".
export function parseOptions(argv, { flags = {}, opts = {}, positional = false }) {
  const out = {};
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--") { rest.push(...argv.slice(i + 1)); break; }
    // Own keys only: "constructor" or "toString" is prompt text, not an inherited flag.
    if (Object.hasOwn(flags, a)) { out[flags[a]] = true; continue; }
    if (!a.startsWith("-") || a === "-") { rest.push(a); continue; }
    const eq = a.indexOf("=");
    const name = eq === -1 ? a : a.slice(0, eq);
    const key = Object.hasOwn(opts, name) ? opts[name] : undefined;
    if (!key) throw new Error(`Unknown option "${name}". Try --help.${positional ? ' For prompt text starting with "-", put it after --.' : ""}`);
    const value = eq === -1 ? argv[++i] : a.slice(eq + 1);
    if (value === undefined || value === "" || (eq === -1 && value.startsWith("-"))) {
      throw new Error(`${name} needs a value. For a value starting with "-", use ${name}=<value>.`);
    }
    out[key] = value;
  }
  if (rest.length && !positional) throw new Error(`Unexpected argument "${rest[0]}". Try --help.`);
  return { ...out, rest };
}

export function parseArgs(argv) {
  const { rest, ...out } = parseOptions(argv, {
    flags: { "--selftest": "selftest", "--help": "help", "-h": "help", "--allow-unregistered-model": "allowUnregistered" },
    opts: { "--model": "model", "--system": "system" },
    positional: true,
  });
  return { model: null, system: null, selftest: false, help: false, allowUnregistered: false, ...out, prompt: rest.length ? rest.join(" ") : null };
}

async function readStdin() {
  if (process.stdin.isTTY) return "";
  let data = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) data += chunk;
  return data.trim();
}

const HELP = `Call an OpenRouter model.

  node --env-file=.env scripts/llm.mjs [--model <slug>] [--system <text>] [--] "your prompt"
  echo "prompt" | node --env-file=.env scripts/llm.mjs
  node scripts/llm.mjs --selftest

Only models in the AI-DATA-POLICY register are sent (":free" variants are not). For synthetic text
only, add --allow-unregistered-model.

Unknown options and options missing a value are errors. Use --opt=<value> for a value starting
with "-", and -- before a prompt that starts with "-".

Env: OPENROUTER_API_KEY (required), OPENROUTER_MODEL, OPENROUTER_BASE_URL,
     OPENROUTER_APP_URL, OPENROUTER_APP_NAME, OPENROUTER_TIMEOUT_MS (default 300000).`;

function selftest() {
  const p = buildPayload("m", "hi", "sys");
  assert.equal(p.model, "m");
  assert.equal(p.messages.length, 2);
  assert.equal(p.messages[0].role, "system");
  assert.equal(p.messages[1].content, "hi");
  const p2 = buildPayload("m", "hi", null);
  assert.equal(p2.messages.length, 1);
  assert.equal(p2.messages[0].role, "user");
  const h = buildHeaders({ OPENROUTER_API_KEY: "k", OPENROUTER_APP_NAME: "x" });
  assert.equal(h.Authorization, "Bearer k");
  assert.equal(h["X-Title"], "x");
  assert.equal(buildHeaders({ OPENROUTER_API_KEY: "k" })["HTTP-Referer"], undefined);
  assert.throws(() => parseArgs(["--modle", "m", "hi"]), /Unknown option "--modle"/);
  assert.throws(() => parseArgs(["--model"]), /needs a value/);
  assert.throws(() => parseArgs(["--model", "--system", "x"]), /--model needs a value/);
  assert.equal(parseArgs(["--model=a=b", "--", "--not-a-flag", "hi"]).prompt, "--not-a-flag hi");
  assert.equal(parseArgs(["constructor", "toString"]).prompt, "constructor toString");
  assert.throws(() => parseArgs(["--constructor", "x"]), /Unknown option/);
  assert.equal(textOf([{ type: "text", text: "a" }, { type: "text", text: "b" }]), "ab");
  assert.equal(textOf(null), "");
  assertRegisteredModel("tencent/hy3");
  assert.throws(() => assertRegisteredModel("tencent/hy3:free"), /no row in the AI-DATA-POLICY register/);
  assert.throws(() => assertRegisteredModel("openai/gpt-4o-mini"), /no row/);
  assertRegisteredModel("openai/gpt-4o-mini", true);
  console.log("selftest ok");
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
  if (args.help) return void console.log(HELP);
  if (args.selftest) return void selftest();

  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    console.error('Missing OPENROUTER_API_KEY. Run: node --env-file=.env scripts/llm.mjs "prompt"');
    process.exit(1);
  }
  const model = args.model || process.env.OPENROUTER_MODEL;
  if (!model) {
    console.error("No model. Set OPENROUTER_MODEL in .env or pass --model <slug>.");
    process.exit(1);
  }
  try {
    assertRegisteredModel(model, args.allowUnregistered);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
  const prompt = args.prompt || (await readStdin());
  if (!prompt) {
    console.error("No prompt. Pass it as an argument or on stdin.");
    process.exit(1);
  }

  try {
    const content = await chat({ model, system: args.system, prompt, env: process.env });
    process.stdout.write(content + "\n");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

// Run the CLI only when executed directly, not when imported (e.g. by the console).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  });
}
