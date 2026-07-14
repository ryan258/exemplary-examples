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
//      OPENROUTER_BASE_URL, OPENROUTER_APP_URL, OPENROUTER_APP_NAME (all optional).
import { strict as assert } from "node:assert";

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

function parseArgs(argv) {
  const out = { model: null, system: null, prompt: null, selftest: false, help: false };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--selftest") out.selftest = true;
    else if (a === "--help" || a === "-h") out.help = true;
    else if (a === "--model") out.model = argv[++i];
    else if (a === "--system") out.system = argv[++i];
    else rest.push(a);
  }
  if (rest.length) out.prompt = rest.join(" ");
  return out;
}

async function readStdin() {
  if (process.stdin.isTTY) return "";
  let data = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) data += chunk;
  return data.trim();
}

const HELP = `Call an OpenRouter model.

  node --env-file=.env scripts/llm.mjs [--model <slug>] [--system <text>] "your prompt"
  echo "prompt" | node --env-file=.env scripts/llm.mjs
  node scripts/llm.mjs --selftest

Env: OPENROUTER_API_KEY (required), OPENROUTER_MODEL, OPENROUTER_BASE_URL,
     OPENROUTER_APP_URL, OPENROUTER_APP_NAME.`;

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
  console.log("selftest ok");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
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
  const prompt = args.prompt || (await readStdin());
  if (!prompt) {
    console.error("No prompt. Pass it as an argument or on stdin.");
    process.exit(1);
  }

  const base = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: buildHeaders(process.env),
    body: JSON.stringify(buildPayload(model, prompt, args.system)),
  });
  if (!res.ok) {
    console.error(`OpenRouter ${res.status} ${res.statusText}: ${await res.text()}`);
    process.exit(1);
  }
  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (content == null) {
    console.error(`Unexpected response: ${JSON.stringify(json)}`);
    process.exit(1);
  }
  process.stdout.write(content + "\n");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
