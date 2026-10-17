const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const library = path.join(root, "claim-audit");
const read = (...p) => fs.readFileSync(path.join(library, ...p), "utf8");

test("the Claim Audit library has four cards in a fixed order", async () => {
  const { loadCards } = await import(path.join(root, "console", "console.mjs"));
  const cards = loadCards(library);
  assert.deepEqual(cards.map((c) => c.id), ["extract-claims", "classify-claims", "evidence-needs", "safe-rewrite"]);
  for (const card of cards) {
    assert.match(card.prompt, /Before you finish, verify:/, `${card.id} must self-check`);
  }
});

test("no Claim Audit card lets the model supply a source, figure, or name", async () => {
  const { loadCards } = await import(path.join(root, "console", "console.mjs"));
  const [extract, classify, evidence, rewrite] = loadCards(library).map((c) => c.prompt);
  assert.match(extract, /Do not supply sources, figures, or names/);
  assert.match(classify, /never supply a source, URL, study, or figure/i);
  assert.match(evidence, /Never supply, guess, or imply a source/);
  assert.match(rewrite, /Never invent a replacement number, source, customer, or quote/);
  assert.match(classify, /only a source named in the draft counts|names a retrievable source/i);
});

test("the samples are clearly synthetic and carry the planted defects", () => {
  const draft = read("_samples", "synthetic-draft-01.md");
  const profile = read("_samples", "profile.example.md");
  assert.match(draft, /^SYNTHETIC SAMPLE/);
  assert.match(profile, /^SYNTHETIC EXAMPLE/);
  assert.match(draft, /10,000 marketing teams/); // contradicts the 212 accounts in the profile
  assert.match(profile, /212 paying accounts/);
  assert.match(draft, /\$14,400 per year \(5 seats × \$2,400\)/); // 5 × 2,400 is 12,000
  assert.notEqual(5 * 2400, 14400);
  assert.match(draft, /Jordan, CMO/); // testimonial with no permission on file
  assert.match(draft, /will double your pipeline/); // forecast stated as a promise
  assert.doesNotMatch(draft + profile, /@|https?:\/\//, "samples must not carry real contacts or links");
});

test("the trial-driven rules are present in the cards", async () => {
  const { loadCards } = await import(path.join(root, "console", "console.mjs"));
  const [extract, classify, evidence, rewrite] = loadCards(library).map((c) => c.prompt);
  assert.match(extract, /never carry "\(implied\)"/);
  assert.match(classify, /full name, organization, and role/);
  assert.match(evidence, /at most one third of the rows/);
  assert.match(rewrite, /Keep every sentence of the original/);
  assert.match(rewrite, /state that fact in the PROFILE's own numbers/);
  assert.match(rewrite, /every sentence of the original draft appears/);
});

test("the second-trial rules are present in the cards", async () => {
  const { loadCards } = await import(path.join(root, "console", "console.mjs"));
  const [extract, , evidence, rewrite] = loadCards(library).map((c) => c.prompt);
  assert.match(extract, /Never give it its own row/);
  assert.match(extract, /Never add a second row that repeats the quoted words/);
  assert.match(evidence, /is never Low/);
  assert.match(rewrite, /Source notes, owners, and file names stay in the register/);
  assert.match(rewrite, /Never call any claim verified/);
});

test("the second sample carries its planted defects and its supported controls", () => {
  const draft = read("_samples", "synthetic-draft-02.md");
  const profile = read("_samples", "profile-02.example.md");
  assert.match(draft, /^SYNTHETIC SAMPLE/);
  assert.match(profile, /^SYNTHETIC EXAMPLE/);
  assert.doesNotMatch(draft + profile, /@|https?:\/\//);
  // Planted defects.
  assert.match(draft, /clinically proven to cure insomnia/); // forbidden by the profile's claims policy
  assert.match(draft, /5\.2 hours to 7\.4 hours/); // before/after with no sample size or method
  assert.match(draft, /Golden Pillow Award/); // profile: no awards on file
  assert.match(draft, /nearly 1 in 2/); // profile's supplied report says 27%
  assert.match(profile, /27% of surveyed adults/);
  assert.match(draft, /60% saving on our \$89/); // (89 - 49) / 89 is about 45%
  assert.ok(Math.abs((89 - 49) / 89 - 0.6) > 0.1);
  assert.match(draft, /60-day money-back/); // profile: refunds within 30 days
  assert.match(profile, /refunds within 30 days/);
  // Controls: these are supported and must not be flagged as problems.
  assert.match(draft, /14,300 active members/);
  assert.match(profile, /14,300 active members/);
  assert.match(draft, /Priya Raman, Operations Director at Fernhill Logistics/);
  assert.match(profile, /written permission on file/);
});

test("the third-trial rules are present in the rewrite card", async () => {
  const { loadCards } = await import(path.join(root, "console", "console.mjs"));
  const rewrite = loadCards(library)[3].prompt;
  assert.match(rewrite, /fully supports .* stays exactly as written, with no bracket/);
  assert.match(rewrite, /forbidden term and the outcome it asserts removed/);
  assert.match(rewrite, /never states what the company lacks/);
});

// ---- Deterministic pack checker ----------------------------------------------------------
const checker = () => import(path.join(root, "claim-audit", "check.mjs"));
const sample = (name) => read("_samples", name);
const levels = (findings, level) => findings.filter((f) => f.level === level).map((f) => f.rule);

test("the checker passes the recorded packs for errors and flags only what a person should look at", async () => {
  const { checkPack } = await checker();
  const one = checkPack(sample("example-pack-01.md"), sample("synthetic-draft-01.md"), sample("profile.example.md"));
  const two = checkPack(sample("example-pack-02.md"), sample("synthetic-draft-02.md"), sample("profile-02.example.md"));
  assert.deepEqual(levels(one, "ERROR"), []);
  assert.deepEqual(levels(two, "ERROR"), []);
  // Pack 1 replaced the "save $14,400" offer with a different sentence; pack 2 recomputed 44.9%.
  assert.ok(one.some((f) => f.rule === "sentence-kept" && /save \$14,400/.test(f.message)));
  assert.ok(two.some((f) => f.rule === "new-numbers" && /44\.9/.test(f.message)));
});

test("the checker catches internal notes in the copy, including the recorded leaky pack", async () => {
  const { checkPack } = await checker();
  const found = checkPack(sample("example-pack-02-leaky.md"), sample("synthetic-draft-02.md"), sample("profile-02.example.md"));
  const leak = found.find((f) => f.rule === "internal-notes");
  assert.ok(leak, "the leaky pack must fail");
  assert.match(leak.message, /supplied copy/);
  assert.match(leak.message, /on file/);
});

test("the checker enforces the card contracts on a damaged pack", async () => {
  const { checkPack } = await checker();
  const draft = sample("synthetic-draft-02.md");
  const profile = sample("profile-02.example.md");
  const good = sample("example-pack-02.md");
  const broken = (from, to) => { assert.ok(good.includes(from), `fixture lost "${from}"`); return checkPack(good.replace(from, to), draft, profile); };
  // Wrong summary count.
  assert.ok(broken("UNPLACED: 5", "UNPLACED: 9").some((f) => f.rule === "summary-counts"));
  // A forecast rated Low.
  const lowPromise = good.replace(/(\| forecast-or-promise \| UNPLACED \|.*\| )High( \|)/, "$1Low$2");
  assert.ok(checkPack(lowPromise, draft, profile).some((f) => f.rule === "never-low"));
  // Invalid class, missing section, over-claiming verdict, strong word absent from the sources.
  assert.ok(broken("Client-provided fact | PROFILE lists", "Obviously true | PROFILE lists").some((f) => f.rule === "class"));
  assert.ok(checkPack(good.replace("## Limits", "## Notes"), draft, profile).some((f) => f.rule === "sections"));
  assert.ok(broken("nothing has been checked by a person yet", "all claims are verified").some((f) => f.rule === "verdict-wording"));
  assert.ok(broken("## Rewritten draft\n", "## Rewritten draft\nOur certified, best-in-class plan.\n").some((f) => f.rule === "new-strong-words"));
  // A High-priority cap breach.
  const allHigh = good.replace(/\| (Medium|Low) \| `/g, "| High | `");
  assert.ok(checkPack(allHigh, draft, profile).some((f) => f.rule === "high-cap"));
});

test("the checker CLI reads a saved run, writes the pack with findings, and fails on errors", async () => {
  const { spawnSync } = require("node:child_process");
  const os = require("node:os");
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "ee-check-")));
  try {
    fs.mkdirSync(path.join(dir, "console", "runs"), { recursive: true });
    fs.mkdirSync(path.join(dir, "scripts"));
    fs.mkdirSync(path.join(dir, "claim-audit"));
    for (const f of ["console/console.mjs", "scripts/llm.mjs", "claim-audit/check.mjs"]) fs.copyFileSync(path.join(root, f), path.join(dir, f));
    const save = (id, pack) => fs.writeFileSync(path.join(dir, "console", "runs", `${id}.json`), JSON.stringify({
      version: 1, id, brief: sample("synthetic-draft-02.md"), profile: sample("profile-02.example.md"),
      stages: [{ id: "safe-rewrite", status: "complete", result: pack }],
    }));
    save("clean", sample("example-pack-02.md"));
    const out = path.join(dir, "pack.md");
    let r = spawnSync(process.execPath, [path.join(dir, "claim-audit/check.mjs"), "--run", "clean", "--out", out], { encoding: "utf8" });
    assert.equal(r.status, 0, r.stderr + r.stdout);
    assert.match(fs.readFileSync(out, "utf8"), /## Automated checks[\s\S]*WARN \[new-numbers\]/);
    save("leaky", sample("example-pack-02-leaky.md"));
    r = spawnSync(process.execPath, [path.join(dir, "claim-audit/check.mjs"), "--run", "leaky"], { encoding: "utf8" });
    assert.equal(r.status, 1);
    assert.match(r.stdout, /ERROR \[internal-notes\]/);
    fs.writeFileSync(path.join(dir, "console", "runs", "half.json"), JSON.stringify({ version: 1, id: "half", brief: "x", stages: [{ status: "failed" }] }));
    r = spawnSync(process.execPath, [path.join(dir, "claim-audit/check.mjs"), "--run", "half"], { encoding: "utf8" });
    assert.equal(r.status, 1);
    assert.match(r.stderr, /has not finished/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("the evidence card requires a baseline for every comparison", async () => {
  const { loadCards } = await import(path.join(root, "console", "console.mjs"));
  const evidence = loadCards(library)[2].prompt;
  assert.match(evidence, /exact baseline it is measured against/);
  assert.match(evidence, /not like for like/);
});

test("each checker refuses a run that came from the other library instead of reporting nonsense", () => {
  const { spawnSync } = require("node:child_process");
  const os = require("node:os");
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "ee-wronglib-")));
  try {
    for (const d of ["console/runs", "scripts", "claim-audit", "examples"]) fs.mkdirSync(path.join(dir, d), { recursive: true });
    for (const f of ["console/console.mjs", "scripts/llm.mjs", "claim-audit/check.mjs", "examples/check.mjs"]) fs.copyFileSync(path.join(root, f), path.join(dir, f));
    const save = (id, last) => fs.writeFileSync(path.join(dir, "console", "runs", `${id}.json`), JSON.stringify({
      version: 1, id, brief: "x", stages: [{ id: last, status: "complete", result: "## Summary\nx" }],
    }));
    save("an-example", "challenge-example");
    save("an-audit", "safe-rewrite");
    let r = spawnSync(process.execPath, [path.join(dir, "claim-audit/check.mjs"), "--run", "an-example"], { encoding: "utf8" });
    assert.equal(r.status, 1);
    assert.match(r.stderr, /not a Claim Audit pack/);
    r = spawnSync(process.execPath, [path.join(dir, "examples/check.mjs"), "--run", "an-audit"], { encoding: "utf8" });
    assert.equal(r.status, 1);
    assert.match(r.stderr, /not an Illustrative Examples run/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
