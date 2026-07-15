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
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { strict as assert } from "node:assert";
import { chat } from "../scripts/llm.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const CARDS_DIR = join(HERE, "cards");

// Pull one "## Section" body out of a card, or null if absent/empty.
function section(body, name) {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((l) => new RegExp(`^##\\s+${name}\\b`, "i").test(l));
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) { end = i; break; }
  }
  return lines.slice(start + 1, end).join("\n").trim() || null;
}

export function loadCards(dir = CARDS_DIR) {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_")) // _TEMPLATE.md etc. are not runnable cards
    .sort()
    .map((f) => {
      const raw = readFileSync(join(dir, f), "utf8");
      const id = basename(f, ".md").replace(/^\d+[-_]/, ""); // drop a leading NN- ordering prefix
      const title = (raw.match(/^#\s+(.+)$/m)?.[1] || id).trim();
      const prompt = section(raw, "Prompt") || raw.trim(); // only ## Prompt is sent; bare files still work
      const tier = section(raw, "Model tier");
      return { file: f, id, title, prompt, tier, raw };
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
      const hit = cards.find((c) => c.id === t) || cards.find((c) => c.id.includes(t));
      if (!hit) throw new Error(`No card matches "${t}". Try --list.`);
      return hit;
    });
}

function parseArgs(argv) {
  const out = { cards: null, idea: null, model: null, list: false, dryRun: false, noEdit: false, selftest: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--list") out.list = true;
    else if (a === "--dry-run") out.dryRun = true;
    else if (a === "--no-edit") out.noEdit = true;
    else if (a === "--selftest") out.selftest = true;
    else if (a === "--help" || a === "-h") out.help = true;
    else if (a === "--cards") out.cards = argv[++i].split(/[,\s]+/).filter(Boolean);
    else if (a === "--idea") out.idea = argv[++i];
    else if (a === "--idea-file") out.idea = readFileSync(argv[++i], "utf8");
    else if (a === "--model") out.model = argv[++i];
  }
  return out;
}

function listCards(cards) {
  console.log("Cards:");
  cards.forEach((c, i) => console.log(`  ${i + 1}. ${c.title}  (${c.id})${c.tier ? `  [${c.tier}]` : ""}`));
}

// Edit phase: open text in $EDITOR and return the edited result.
// ponytail: relies on $EDITOR grabbing the tty; readline is idle during this sync spawn.
function editInEditor(text, label) {
  const editor = process.env.EDITOR || process.env.VISUAL || "vi";
  const file = join(mkdtempSync(join(tmpdir(), "console-")), `${label}.md`);
  writeFileSync(file, text);
  const r = spawnSync(editor, [file], { stdio: "inherit" });
  if (r.error) {
    console.error(`(editor '${editor}' failed: ${r.error.message}; keeping the unedited result)`);
    return text;
  }
  return readFileSync(file, "utf8");
}

const HELP = `Console mode — run an idea through a chain of cards, editing between steps.

  node --env-file=.env console/console.mjs [--cards a,b] [--idea "..."] [--no-edit]
  node console/console.mjs --list | --dry-run | --selftest

Cards live in console/cards/ (one .md per card = its system prompt).`;

function selftest() {
  const cards = loadCards();
  assert.ok(cards.length >= 2, "expected seed cards in console/cards/");
  const chain = resolveChain(["1", cards[1].id], cards);
  assert.equal(chain.length, 2);
  assert.equal(chain[0].file, cards[0].file);
  assert.equal(chain[1].id, cards[1].id);
  assert.throws(() => resolveChain(["definitely-not-a-card"], cards));
  console.log(`selftest ok (${cards.length} cards: ${cards.map((c) => c.id).join(", ")})`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return void console.log(HELP);
  if (args.selftest) return void selftest();

  const cards = loadCards();
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
      const out = await chat({ model, system: card.prompt, prompt: current, env: process.env });
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
