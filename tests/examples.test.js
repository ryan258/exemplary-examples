const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const lib = path.join(root, "examples");
// Strip the repository's historical-output metadata, not the recorded model body.
const read = (...p) => fs.readFileSync(path.join(lib, ...p), "utf8").replace(/^SYNTHETIC OUTPUT:[^\n]*\n\n/, "");
const load = (f) => import(path.join(root, f));

test("the examples library has three cards in a fixed order, each with a self-check", async () => {
  const { loadCards } = await load("console/console.mjs");
  const cards = loadCards(lib);
  assert.deepEqual(cards.map((c) => c.id), ["frame-example", "write-example", "challenge-example"]);
  for (const c of cards) assert.match(c.prompt, /Before you finish, verify:/, c.id);
});

test("the cards carry the honesty rules that keep an example from posing as a real result", async () => {
  const { loadCards } = await load("console/console.mjs");
  const [frame, write, challenge] = loadCards(lib).map((c) => c.prompt);
  assert.match(frame, /exactly `SUPPLIED`/);
  assert.match(frame, /Never present an ASSUMED value as a statistic/);
  assert.match(frame, /break-even/);
  assert.match(frame, /Do not state any policy, term, hour/);
  assert.match(write, /Illustrative example — not a real customer or result\./);
  assert.match(write, /No quotation attributed to anyone/);
  assert.match(write, /first states the break-even/);
  assert.match(challenge, /two readers at once/);
  assert.match(challenge, /exactly these seven named items/);
  assert.match(challenge, /A fact about the business that the brief and PROFILE never supplied/);
  for (const prompt of [frame, write, challenge]) assert.match(prompt, /DERIVED/);
  assert.match(frame, /original brief or PROFILE/);
  assert.match(write, /Never change an ASSUMED input to SUPPLIED/);
  assert.match(write, /Preserve every row and cell/);
  assert.match(write, /exact nested heading `### Source notes`/);
  assert.match(write, /followed only by the complete framing table/);
  assert.match(challenge, /faithfully quoted phrases/);
  assert.match(challenge, /preserve the accepted table rather than silently replacing it/);
  assert.match(challenge, /not independent verification/);
  for (const prompt of [frame, write, challenge]) assert.match(prompt, /saved owner answers/);
  assert.match(frame, /Each Value holds one numeric value and its unit/);
  assert.match(frame, /split ranges or multiple values into separately labeled rows/);
  assert.match(frame, /Escape a literal pipe inside a cell/);
});

test("the sample is fictional and carries the facts the checks rely on", () => {
  const brief = read("_samples", "brief-01.md");
  const profile = read("_samples", "profile-01.example.md");
  assert.match(brief, /^SYNTHETIC SAMPLE/);
  assert.match(profile, /^SYNTHETIC EXAMPLE/);
  assert.match(brief, /\$7/);
  assert.match(brief, /\$24/);
  assert.doesNotMatch(brief + profile, /@|https?:\/\//);
});

const FRAMING = [
  "| Item | Value | Basis | Source or working |",
  "|---|---|---|---|",
  '| Single loaf | $7 | SUPPLIED | Brief: "sourdough loaf for $7" |',
  '| Subscription | $24 | SUPPLIED | Brief: "four loaves a month for $24" |',
  "| Loaves used | 4 loaves | ASSUMED | Chosen scenario input: she uses all four. |",
  "| Four single loaves | $28 | DERIVED | 4 × $7 = $28 |",
].join("\n");

async function pack(finalExample, extra = {}, notes = FRAMING) {
  const { CHECK_ITEMS } = await load("examples/check.mjs");
  const sections = { "Final example": `${finalExample}\n\n### Source notes\n${notes}`, "Changes made": "- none", Checks: CHECK_ITEMS.map((name) => `- ${name}: Pass — checked against the supplied example.`).join("\n"), ...extra };
  return Object.entries(sections).map(([k, v]) => `## ${k}\n${v}`).join("\n\n");
}
const GOOD = [
  "Illustrative example — not a real customer or result.",
  "",
  "Headline: Mara's Saturday loaves",
  "Alt: Four loaves, one Saturday",
  "Alt: A bread plan that fits a week",
  "",
  "Mara picks up four loaves for $24 each Saturday.",
  "",
  "The numbers",
  "- Single loaf: $7 — SUPPLIED",
  "- Subscription: $24 — SUPPLIED",
  "- Loaves used: 4 — ASSUMED she would buy all four",
  "- Four loaves bought singly: $28 — DERIVED — 4 × $7 = $28",
  "",
  "What would change this",
  "- Below four loaves a month it costs more.",
  "",
  "Next step: ask the bakery about Saturday pickup.",
].join("\n");

test("the checker passes a well-formed example and flags what each rule is for", async () => {
  const { checkExample, LABEL } = await load("examples/check.mjs");
  const brief = read("_samples", "brief-01.md");
  const profile = read("_samples", "profile-01.example.md");
  const run = async (text, extra) => checkExample(await pack(text, extra), brief, profile, "");
  assert.deepEqual((await run(GOOD)).filter((f) => f.level === "ERROR"), []);
  const rules = async (text, extra) => (await run(text, extra)).map((f) => f.rule);
  assert.ok((await rules(GOOD.replace(LABEL, "An example."))).includes("label"));
  assert.ok((await rules(GOOD.replace(/ — SUPPLIED| — ASSUMED[^\n]*/g, ""))).includes("number-basis"));
  assert.ok((await rules(`${GOOD}\n"I never waste a loaf now," said Mara.`)).includes("quotation"));
  assert.ok((await rules(`${GOOD}\nMost people use all four.`)).includes("real-claim-wording"));
  assert.ok((await rules(`${GOOD}\nIt is the best bread, guaranteed.`)).includes("strong-words"));
  assert.ok((await rules(`${GOOD}\nCancel anytime.`)).includes("business-facts"));
  assert.ok((await rules(`${GOOD}\nPick up on Saturday.`)).every((r) => r !== "business-facts"));
  assert.ok((await rules(`${GOOD}\nIt saves $99.`)).includes("new-numbers"));
  assert.ok((await rules(GOOD, { Checks: "- Arithmetic recomputed: Fail — unclear" })).includes("challenge-failed"));
  const bare = checkExample("## Final example\nx", "", "", "");
  assert.ok(bare.some((f) => f.rule === "sections"));
});

test("missing editorial parts warn, while missing numeric provenance is an error", async () => {
  const { checkExample, LABEL } = await load("examples/check.mjs");
  const thin = await pack(`${LABEL}\n\nA story with $7 SUPPLIED.`);
  const found = checkExample(thin, read("_samples", "brief-01.md"), "", "");
  assert.ok(found.some((f) => f.level === "ERROR" && f.rule === "number-basis"));
  assert.ok(found.filter((f) => f.rule === "structure").length >= 4);
});

test("historical output retains correct arithmetic but fails the strengthened per-figure basis rule", async () => {
  const { checkExample } = await load("examples/check.mjs");
  const found = checkExample(read("_samples", "example-pack-02.md"), read("_samples", "brief-02.md"), "", "");
  assert.deepEqual([...new Set(found.filter((f) => f.level === "ERROR").map((f) => f.rule))], ["source-notes", "number-basis"]);
  assert.ok(found.some((f) => f.rule === "new-numbers" && /2\.78/.test(f.message)), "the 2.78-hour break-even is derived, so it is flagged for a human to recompute");
  // 250 / 90 = 2.78 and (5 x 1 x 90) - 250 = 200: the arithmetic in the recorded example is right.
  assert.equal((250 / 90).toFixed(2), "2.78");
  assert.equal(5 * 1 * 90 - 250, 200);
});

test("the recorded model example that invented a business term fails the checker", async () => {
  const { checkExample } = await load("examples/check.mjs");
  const found = checkExample(read("_samples", "example-pack-01-invented-term.md"), read("_samples", "brief-01.md"), read("_samples", "profile-01.example.md"), "");
  const invented = found.find((f) => f.rule === "business-facts");
  assert.ok(invented, "the invented term must be caught");
  assert.match(invented.message, /without any commitment/);
});

test("framing never approves invented business terms or forbidden strong wording", async () => {
  const { checkExample } = await load("examples/check.mjs");
  const run = async (text, framing = "", brief = read("_samples", "brief-01.md")) => checkExample(await pack(text), brief, read("_samples", "profile-01.example.md"), framing);
  const invented = await run(`${GOOD}\nCancel anytime.`, "Policy: Cancel anytime.");
  assert.ok(invented.some((f) => f.rule === "business-facts"));
  const strong = await run(`${GOOD}\nThe best bread.`, "The best bread.", `${read("_samples", "brief-01.md")}\nThe best bread.`);
  assert.ok(strong.some((f) => f.rule === "strong-words"));
  const prohibited = await run(`${GOOD}\nCancel anytime.`, "", `${read("_samples", "brief-01.md")}\nDo not promise cancel anytime.`);
  assert.ok(prohibited.some((f) => f.level === "WARN" && f.rule === "business-facts-review"));
});

test("empty, duplicated, unexpected, or fenced headings cannot hide unchecked final copy", async () => {
  const { checkExample, LABEL } = await load("examples/check.mjs");
  const brief = read("_samples", "brief-01.md");
  const run = (text) => checkExample(text, brief, read("_samples", "profile-01.example.md"));
  const empty = run("## Final example\n\n## Changes made\n\n## Checks\n");
  assert.ok(empty.some((f) => f.level === "ERROR" && f.rule === "sections"));
  assert.ok(empty.some((f) => f.rule === "label"));
  const secondLine = run(await pack(GOOD.replace(LABEL, `Customer success result\n${LABEL}`)));
  assert.ok(secondLine.some((f) => f.rule === "label"));
  const duplicate = run(`## Final example\nCancel anytime.\n\n${await pack(GOOD)}`);
  assert.ok(duplicate.some((f) => f.rule === "sections"));
  assert.ok(duplicate.some((f) => f.rule === "business-facts"));
  const unexpected = run(await pack(`${GOOD}\n## Offer\nCancel anytime.`));
  assert.ok(unexpected.some((f) => f.rule === "sections"));
  assert.ok(run(`Unchecked introductory claim.\n\n${await pack(GOOD)}`).some((f) => /before the first/.test(f.message)));
  const fenced = run(await pack(`${GOOD}\n\n~~~md\n## Changes made\nCancel anytime.\n~~~`));
  assert.ok(fenced.some((f) => f.rule === "business-facts"));
  assert.ok(!fenced.some((f) => f.rule === "sections"));
});

test("retained source notes are required, complete, and scoped separately from customer claims", async () => {
  const { checkExample } = await load("examples/check.mjs");
  const original = read("_samples", "brief-01.md");
  const profile = read("_samples", "profile-01.example.md");
  const run = (text, framing = FRAMING, brief = original) => checkExample(text, brief, profile, framing);
  const valid = await pack(GOOD);
  assert.deepEqual(run(valid).filter((f) => f.level === "ERROR"), []);
  assert.ok(run(valid.replace(/### Source notes[\s\S]*?(?=\n## Changes made)/, "")).some((f) => f.rule === "source-notes"));
  assert.ok(run(await pack(GOOD, {}, FRAMING.replace("Chosen scenario input", "An unaccepted replacement"))).some((f) => f.rule === "source-notes" && /differs/.test(f.message)));
  assert.ok(run(await pack(GOOD, {}, `${FRAMING}\nCancel anytime.`)).some((f) => f.rule === "source-notes" && /only its provenance table/.test(f.message)));
  assert.ok(run(await pack(`${GOOD}\n\n### Source notes\n${FRAMING}`)).some((f) => f.rule === "source-notes"));
  const fenced = run(await pack(`${GOOD}\n\n~~~md\n### Source notes\nCancel anytime.\n~~~`));
  assert.ok(fenced.some((f) => f.rule === "business-facts"));
  const quote = "The price sheet says we typically charge $7, with no guarantee.";
  const quotedNotes = FRAMING.replace('Brief: "sourdough loaf for $7"', `Brief: "${quote}"`);
  const quoted = run(await pack(GOOD, {}, quotedNotes), quotedNotes, `${original}\n${quote}`);
  assert.deepEqual(quoted.filter((f) => f.level === "ERROR"), [], "faithful provenance is not customer-facing marketing");
  assert.ok(!quoted.some((f) => ["internal-notes", "strong-words", "real-claim-wording"].includes(f.rule)));
  const words = FRAMING.replace("4 loaves | ASSUMED | Chosen scenario input: she uses all four.", '4 loaves | SUPPLIED | Brief: "four loaves a month for $24"');
  const suppliedWords = run(await pack(GOOD.replace("4 — ASSUMED she would buy all four", "4 — SUPPLIED"), {}, words), words);
  assert.deepEqual(suppliedWords.filter((f) => f.level === "ERROR"), [], "four in original owner wording supplies numeric 4");
});

test("accepted owner edits to writer provenance supersede the initial framing", async () => {
  const { checkExample, authoritativeFraming } = await load("examples/check.mjs");
  const corrected = FRAMING.replace("Chosen scenario input: she uses all four.", "Owner-confirmed scenario choice: she uses all four.");
  const stages = [
    { id: "frame-example", result: FRAMING, edited: true },
    { id: "write-example", result: `${GOOD}\n\n### Source notes\n${corrected}`, edited: true },
    { id: "challenge-example", result: "final", edited: false },
  ];
  assert.equal(authoritativeFraming(stages), corrected);
  const run = async (notes) => checkExample(await pack(GOOD, {}, notes), read("_samples", "brief-01.md"), read("_samples", "profile-01.example.md"), authoritativeFraming(stages));
  assert.deepEqual((await run(corrected)).filter((f) => f.level === "ERROR"), []);
  assert.ok((await run(FRAMING)).some((f) => f.rule === "source-notes" && /differs/.test(f.message)));
  stages[1].edited = false;
  assert.equal(authoritativeFraming(stages), FRAMING);
  assert.ok((await run(corrected)).some((f) => f.rule === "source-notes" && /differs/.test(f.message)));
});

test("each figure has a traceable basis and derived results show their formula", async () => {
  const { checkExample } = await load("examples/check.mjs");
  const run = async (text, framing = "") => checkExample(await pack(text), read("_samples", "brief-01.md"), read("_samples", "profile-01.example.md"), framing);
  assert.ok((await run(`${GOOD}\nSave $99.`)).some((f) => f.rule === "number-basis" && /99/.test(f.message)));
  assert.ok((await run(GOOD.replace("$24 — SUPPLIED", "$24"))).some((f) => f.rule === "number-basis" && /24/.test(f.message)));
  const laundered = GOOD.replace("$24 — SUPPLIED", "$99 — SUPPLIED");
  assert.ok((await run(laundered, "$99 SUPPLIED")).some((f) => f.rule === "number-basis" && /absent/.test(f.message)));
  assert.ok((await run(GOOD.replace(" — DERIVED — 4 × $7 = $28", " — DERIVED"))).some((f) => /explicit arithmetic formula/.test(f.message)));
});

test("equivalent decimal spellings retain provenance, while larger written fragments cannot supply figures", async () => {
  const { checkExample, LABEL } = await load("examples/check.mjs");
  const decimalNotes = FRAMING.replace("| $7 |", "| $7.00 |");
  const decimalPack = await pack(GOOD.replaceAll("$7", "$7.00"), {}, decimalNotes);
  assert.deepEqual(checkExample(decimalPack, read("_samples", "brief-01.md"), read("_samples", "profile-01.example.md"), decimalNotes).filter((f) => f.level === "ERROR"), []);
  for (const [value, quote] of [["1", "There are one hundred jobs."], ["20", "There are twenty thousand jobs."], ["5", "The quantity is twenty point five."]]) {
    const notes = `| Item | Value | Basis | Source or working |\n|---|---|---|---|\n| Quantity | ${value} jobs | SUPPLIED | Brief: "${quote}" |`;
    const text = `${LABEL}\nHeadline: A quantity\nAlt: Quantity\nAlt: Another quantity\nThe numbers\n- Quantity: ${value} — SUPPLIED\nWhat would change this\n- A different workload.\nNext step: Ask about the workload.`;
    const found = checkExample(await pack(text, {}, notes), quote, "", notes);
    assert.ok(found.some((f) => f.rule === "source-notes" && /absent from owner input/.test(f.message)), quote);
  }
});

test("the challenge has exactly seven named outcomes with reasons and Fail blocks readiness", async () => {
  const { checkExample } = await load("examples/check.mjs");
  const valid = await pack(GOOD);
  const run = (text) => checkExample(text, read("_samples", "brief-01.md"), read("_samples", "profile-01.example.md"));
  assert.ok(!run(valid).some((f) => f.level === "ERROR"));
  assert.ok(run(valid.replace(/^- Arithmetic recomputed:[^\n]*\n/m, "")).some((f) => f.rule === "checklist"));
  assert.ok(run(valid.replace("Arithmetic recomputed: Pass — checked against the supplied example.", "Arithmetic recomputed: Pass")).some((f) => f.rule === "checklist"));
  assert.ok(run(valid.replace("Arithmetic recomputed: Pass", "Arithmetic recomputed: Fail")).some((f) => f.level === "ERROR" && f.rule === "challenge-failed"));
  assert.ok(run(`${valid}\n- Arithmetic recomputed: Pass — repeated.`).some((f) => f.rule === "checklist"));
  assert.ok(run(valid.replace("Limits and break-even stated", "Limits stated")).some((f) => f.rule === "checklist"));
});

test("the examples chain runs three cards in order with the profile, and its checker CLI reads the saved run", async () => {
  const { spawnSync, execFile } = require("node:child_process");
  const os = require("node:os");
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "ee-examples-")));
  try {
    for (const d of ["console/runs", "scripts", "claim-audit", "examples"]) fs.mkdirSync(path.join(dir, d), { recursive: true });
    for (const f of ["console/console.mjs", "scripts/llm.mjs", "scripts/pack-checks.mjs", "claim-audit/check.mjs", "examples/check.mjs"]) fs.copyFileSync(path.join(root, f), path.join(dir, f));
    const preload = path.join(dir, "provider.mjs");
    const replies = [
      `STATUS: COMPLETE\nFraming: $7 SUPPLIED, $24 SUPPLIED, 4 loaves.\n\n${FRAMING}`,
      "STATUS: COMPLETE\nExample draft.",
      `STATUS: COMPLETE\n${await pack(GOOD)}`,
    ];
    fs.writeFileSync(preload, `
import { appendFileSync } from "node:fs";
const replies = ${JSON.stringify(replies)};
globalThis.fetch = async (_u, o) => { appendFileSync(${JSON.stringify(path.join(dir, "calls.jsonl"))}, o.body + "\\n");
  return { ok: true, json: async () => ({ usage: { total_tokens: 1 }, choices: [{ finish_reason: "stop", message: { content: replies.shift() } }] }) }; };
`);
    const env = { PATH: process.env.PATH, OPENROUTER_API_KEY: "offline", OPENROUTER_MODEL: "tencent/hy3" };
    let r = spawnSync(process.execPath, ["--import", preload, path.join(dir, "console/console.mjs"), "--dir", lib, "--all", "--no-edit",
      "--profile", path.join(lib, "_samples", "profile-01.example.md"), "--idea-file", path.join(lib, "_samples", "brief-01.md")], { env, encoding: "utf8", input: "\n" });
    assert.equal(r.status, 0, r.stderr);
    const calls = fs.readFileSync(path.join(dir, "calls.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
    assert.equal(calls.length, 3);
    assert.ok(calls.every((c) => /PROFILE \(context supplied by the user/.test(c.messages[0].content)));
    assert.match(calls[1].messages[1].content, /PREVIOUS STEP OUTPUT:\nFraming: \$7 SUPPLIED/);
    r = spawnSync(process.execPath, [path.join(dir, "examples/check.mjs")], { env, encoding: "utf8" });
    assert.equal(r.status, 0, r.stdout + r.stderr);
    r = spawnSync(process.execPath, [path.join(dir, "examples/check.mjs"), "--help"], { env, encoding: "utf8" });
    assert.equal(r.status, 0);
    assert.match(r.stdout, /Check an Illustrative Examples run/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
