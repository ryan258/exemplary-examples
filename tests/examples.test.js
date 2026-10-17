const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const lib = path.join(root, "examples");
const read = (...p) => fs.readFileSync(path.join(lib, ...p), "utf8");
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
  assert.match(challenge, /exactly these seven items/);
  assert.match(challenge, /A fact about the business that the brief and PROFILE never supplied/);
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

async function pack(finalExample, extra = {}) {
  const sections = { "Final example": finalExample, "Changes made": "- none", Checks: "- Label line present: Pass", ...extra };
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
  "- Four loaves bought singly: 4 × $7 = $28 — ASSUMED that she would buy all four",
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

test("a missing part is a warning, not an error", async () => {
  const { checkExample, LABEL } = await load("examples/check.mjs");
  const thin = await pack(`${LABEL}\n\nA story with $7 SUPPLIED.`);
  const found = checkExample(thin, read("_samples", "brief-01.md"), "", "");
  assert.deepEqual(found.filter((f) => f.level === "ERROR"), []);
  assert.ok(found.filter((f) => f.rule === "structure").length >= 4);
});

test("a recorded model example with real arithmetic passes the error checks and only asks to look at derived numbers", async () => {
  const { checkExample } = await load("examples/check.mjs");
  const found = checkExample(read("_samples", "example-pack-02.md"), read("_samples", "brief-02.md"), "", "");
  assert.deepEqual(found.filter((f) => f.level === "ERROR"), []);
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

test("the examples chain runs three cards in order with the profile, and its checker CLI reads the saved run", async () => {
  const { spawnSync, execFile } = require("node:child_process");
  const os = require("node:os");
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "ee-examples-")));
  try {
    for (const d of ["console/runs", "scripts", "claim-audit", "examples"]) fs.mkdirSync(path.join(dir, d), { recursive: true });
    for (const f of ["console/console.mjs", "scripts/llm.mjs", "claim-audit/check.mjs", "examples/check.mjs"]) fs.copyFileSync(path.join(root, f), path.join(dir, f));
    const preload = path.join(dir, "provider.mjs");
    const replies = [
      "STATUS: COMPLETE\nFraming: $7 SUPPLIED, $24 SUPPLIED, 4 loaves.",
      "STATUS: COMPLETE\nExample draft.",
      `STATUS: COMPLETE\n${await pack(GOOD)}`,
    ];
    fs.writeFileSync(preload, `
import { appendFileSync } from "node:fs";
const replies = ${JSON.stringify(replies)};
globalThis.fetch = async (_u, o) => { appendFileSync(${JSON.stringify(path.join(dir, "calls.jsonl"))}, o.body + "\\n");
  return { ok: true, json: async () => ({ usage: { total_tokens: 1 }, choices: [{ finish_reason: "stop", message: { content: replies.shift() } }] }) }; };
`);
    const env = { PATH: process.env.PATH, OPENROUTER_API_KEY: "offline", OPENROUTER_MODEL: "fixture/model" };
    let r = spawnSync(process.execPath, ["--import", preload, path.join(dir, "console/console.mjs"), "--dir", lib, "--all", "--no-edit",
      "--profile", path.join(lib, "_samples", "profile-01.example.md"), "--idea-file", path.join(lib, "_samples", "brief-01.md")], { env, encoding: "utf8", input: "\n" });
    assert.equal(r.status, 0, r.stderr);
    const calls = fs.readFileSync(path.join(dir, "calls.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
    assert.equal(calls.length, 3);
    assert.ok(calls.every((c) => /PROFILE \(context supplied by the user/.test(c.messages[0].content)));
    assert.match(calls[1].messages[1].content, /PREVIOUS STEP OUTPUT:\nFraming: \$7 SUPPLIED/);
    r = spawnSync(process.execPath, [path.join(dir, "examples/check.mjs")], { env, encoding: "utf8" });
    assert.equal(r.status, 0, r.stdout + r.stderr);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
