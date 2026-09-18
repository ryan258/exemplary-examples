#!/usr/bin/env node
// Console mode — run an idea through a chain of "cards", editing between each step.
// A card is just a prompt file in console/cards/ (drop a .md there to add one; no code).
//
// Usage:
//   node --env-file=.env console/console.mjs                       # interactive
//   node --env-file=.env console/console.mjs --cards brand-voice,visual-style-guide --idea "a canvas tote"
//   node console/console.mjs --list
//   node console/console.mjs --dry-run --cards 1,2 --idea "x"      # show the plan, no model calls
//   node console/console.mjs --selftest                            # offline logic check
//
// Env: OPENROUTER_API_KEY, OPENROUTER_MODEL (see ../.env.example). Editor: $EDITOR (default vi).
import { readFileSync, readdirSync, writeFileSync, mkdtempSync } from "node:fs";
import { join, dirname, basename, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { strict as assert } from "node:assert";
import { chat } from "../scripts/llm.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const CARDS_DIR = join(HERE, "cards");

// Pull one "## Section" body out of a card, or null if absent/empty.
// Headings inside fenced code blocks are content, not boundaries.
export function section(body, name) {
  const lines = body.split(/\r?\n/);
  const heads = [];
  let fence = null;
  lines.forEach((l, i) => {
    const f = l.match(/^\s*(`{3,}|~{3,})/);
    if (f) {
      const char = f[1][0], len = f[1].length;
      // A shorter run of the same character is content inside a longer fence, not a close.
      if (!fence) fence = { char, len };
      else if (char === fence.char && len >= fence.len) fence = null;
      return;
    }
    if (!fence && /^##\s+/.test(l)) heads.push(i);
  });
  const start = heads.find((i) => new RegExp(`^##\\s+${name}\\b`, "i").test(lines[i]));
  if (start === undefined) return null;
  const end = heads.find((i) => i > start) ?? lines.length;
  return lines.slice(start + 1, end).join("\n").trim() || null;
}

// Collect card files recursively; skip _template/hidden files and folders.
function walkCards(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.name.startsWith("_") || e.name.startsWith(".")) return [];
    const p = join(dir, e.name);
    if (e.isDirectory()) return walkCards(p);
    return e.name.endsWith(".md") && e.name.toLowerCase() !== "readme.md" ? [p] : [];
  });
}

export function loadCards(dir = CARDS_DIR) {
  return walkCards(dir)
    .sort()
    .map((p) => {
      const raw = readFileSync(p, "utf8");
      const rel = relative(dir, p);
      const parts = rel.split(sep);
      const category = parts.length > 1 ? parts[parts.length - 2] : null; // parent folder = category
      const id = basename(p, ".md").replace(/^\d+[-_]/, ""); // drop a leading NN- ordering prefix
      const title = (raw.match(/^#\s+(.+)$/m)?.[1] || id).trim();
      const prompt = section(raw, "Prompt");
      if (!prompt) throw new Error(`Card ${rel} has no usable "## Prompt" section.`);
      const tier = section(raw, "Model tier");
      return { file: rel, id, category, title, prompt, tier, raw };
    });
}

// Resolve chain tokens (1-based indices or id substrings) to an ordered card list.
export function resolveChain(tokens, cards) {
  return tokens
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => {
      const n = Number(t);
      if (Number.isInteger(n) && n >= 1 && n <= cards.length) return cards[n - 1];
      const exact = cards.filter((c) => c.id === t);
      if (exact.length === 1) return exact[0];
      const hits = exact.length ? exact : cards.filter((c) => c.id.includes(t));
      if (!hits.length) throw new Error(`No card matches "${t}". Try --list.`);
      if (hits.length > 1) throw new Error(`"${t}" matches ${hits.map((c) => c.id).join(", ")}. Be specific.`);
      return hits[0];
    });
}

const FLAGS = { "--list": "list", "--dry-run": "dryRun", "--no-edit": "noEdit", "--selftest": "selftest", "--help": "help", "-h": "help" };
const OPTS = { "--dir": "dir", "--cards": "cards", "--idea": "idea", "--idea-file": "ideaFile", "--model": "model" };

export function parseArgs(argv) {
  const out = { cards: null, idea: null, model: null, dir: null, list: false, dryRun: false, noEdit: false, selftest: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (FLAGS[a]) { out[FLAGS[a]] = true; continue; }
    const [name, ...inlineParts] = a.split("=");
    const inline = a.includes("=") ? inlineParts.join("=") : null;
    const key = OPTS[name];
    if (!key) throw new Error(`Unknown option "${name}". Try --help.`);
    // Only --opt=value may carry a leading dash; a bare dashed token is the next option.
    const value = inline ?? argv[++i];
    if (value === undefined || (inline === null && value.startsWith("-"))) {
      throw new Error(`${name} needs a value. For a value starting with "-", use ${name}=<value>.`);
    }
    if (key === "cards") out.cards = value.split(/[,\s]+/).filter(Boolean);
    else if (key === "ideaFile") out.idea = readFileSync(value, "utf8");
    else out[key] = value;
  }
  if (out.cards && !out.cards.length) throw new Error("--cards was empty.");
  return out;
}

function listCards(cards) {
  console.log("Cards:");
  let cat;
  cards.forEach((c, i) => {
    if (c.category && c.category !== cat) { cat = c.category; console.log(`  ${cat}/`); }
    console.log(`  ${i + 1}. ${c.title}  (${c.id})${c.tier ? `  [${c.tier}]` : ""}`);
  });
}

// Edit phase: open text in $EDITOR and return the edited result.
// ponytail: relies on $EDITOR grabbing the tty; readline is idle during this sync spawn.
function editInEditor(text, label) {
  const [editor, ...editorArgs] = (process.env.EDITOR || process.env.VISUAL || "vi").split(/\s+/);
  const file = join(mkdtempSync(join(tmpdir(), "console-")), `${label}.md`);
  writeFileSync(file, text);
  const r = spawnSync(editor, [...editorArgs, file], { stdio: "inherit" });
  // Never advance on an edit that did not happen — the next step is a paid call.
  if (r.error) throw new Error(`Editor '${editor}' failed: ${r.error.message}. Result kept at ${file}`);
  if (r.status !== 0) throw new Error(`Editor '${editor}' exited ${r.status ?? r.signal}. Result kept at ${file}`);
  return readFileSync(file, "utf8");
}

const HELP = `Console mode — run an idea through a chain of cards, editing between steps.

  node --env-file=.env console/console.mjs [--dir <path>] [--cards a,b] [--idea "..."] [--no-edit]
  node console/console.mjs --list | --dry-run | --selftest

Cards live in console/cards/ by default; --dir runs another library (e.g. --dir prompts).
One .md per card; only its "## Prompt" section is sent to the model.`;

function selftest() {
  const cards = loadCards();
  assert.ok(cards.length >= 2, "expected seed cards in console/cards/");
  const chain = resolveChain(["1", cards[1].id], cards);
  assert.equal(chain.length, 2);
  assert.equal(chain[0].file, cards[0].file);
  assert.equal(chain[1].id, cards[1].id);
  assert.throws(() => resolveChain(["definitely-not-a-card"], cards));
  assert.throws(() => parseArgs(["--modle", "x"]), /Unknown option/);
  assert.throws(() => parseArgs(["--cards"]), /needs a value/);
  assert.throws(() => parseArgs(["--cards", "--idea"]), /needs a value/);
  assert.throws(() => parseArgs(["--model", "--modle", "--idea", "t"]), /--model needs a value/);
  assert.equal(parseArgs(["--idea=-dash-led text"]).idea, "-dash-led text");
  assert.equal(parseArgs(["--model=a/b=c"]).model, "a/b=c");
  const nested = "## Prompt\nreal\n\n````md\n```js\nx\n```\n## Still Inside\n````\ntail\n\n## Model tier\nsmall";
  assert.match(section(nested, "Prompt"), /## Still Inside[\s\S]*tail$/);
  assert.equal(section(nested, "Model tier"), "small");
  assert.equal(parseArgs(["--dry-run", "--idea", "x"]).idea, "x");
  const fenced = "## Prompt\nreal\n\n```md\n## Not A Heading\n```\nstill real\n\n## Model tier\nsmall";
  assert.equal(section(fenced, "Prompt"), "real\n\n```md\n## Not A Heading\n```\nstill real");
  assert.equal(section(fenced, "Model tier"), "small");
  assert.equal(section("## Prompt\n\n## Other\nx", "Prompt"), null);
  console.log(`selftest ok (${cards.length} cards: ${cards.map((c) => c.id).join(", ")})`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return void console.log(HELP);
  if (args.selftest) return void selftest();

  const cards = loadCards(args.dir ? resolve(args.dir) : CARDS_DIR);
  if (args.list || cards.length === 0) return void listCards(cards);

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    let tokens = args.cards;
    if (!tokens) {
      listCards(cards);
      tokens = (await rl.question("\nChain (e.g. 1,3,2 or names): ")).split(/[,\s]+/);
    }
    const chain = resolveChain(tokens, cards);
    if (!chain.length) throw new Error("Empty chain.");

    let current = args.idea;
    if (current == null) current = await rl.question("Idea to run through the chain: ");
    if (!current.trim()) throw new Error("No idea provided.");
    const brief = current;
    if (!args.dryRun && !process.env.OPENROUTER_API_KEY) {
      throw new Error("Missing OPENROUTER_API_KEY. Run with --env-file=.env, or use --dry-run.");
    }

    for (let i = 0; i < chain.length; i++) {
      const card = chain[i];
      const last = i === chain.length - 1;
      console.log(`\n=== [${i + 1}/${chain.length}] ${card.title} ===`);
      if (args.dryRun) {
        console.log(`(dry run) would run the current text through "${card.id}"`);
        continue;
      }
      const model = args.model || process.env.OPENROUTER_MODEL;
      if (!model) throw new Error("No model. Set OPENROUTER_MODEL in .env or pass --model <slug>.");
      // R3: later cards judge against the original brief, not just the previous output.
      const input = i === 0 ? current : `ORIGINAL BRIEF:\n${brief}\n\nPREVIOUS STEP OUTPUT:\n${current}`;
      const out = await chat({ model, system: card.prompt, prompt: input, env: process.env });
      console.log(`\n${out}\n`);

      if (!last && !args.noEdit) {
        await rl.question("Press Enter to edit this result before the next card… ");
        current = editInEditor(out, card.id);
      } else {
        current = out;
      }
    }
    if (!args.dryRun) console.log(`\n=== Final ===\n\n${current}`);
  } finally {
    rl.close();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  });
}
