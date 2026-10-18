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
  assert.match(extract, /exact triggering words in `Claim \(verbatim\)`/);
  assert.match(extract, /separate `Implied meaning` column/);
  assert.match(classify, /full name, organization, and role/);
  assert.match(evidence, /at most one third of the rows/);
  assert.match(rewrite, /Keep every sentence of the original/);
  assert.match(rewrite, /state that fact in the PROFILE's own numbers/);
  assert.match(rewrite, /every original sentence has a corresponding rewritten or bracketed sentence/);
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
// SYNTHETIC OUTPUT is repository metadata, outside the recorded model body.
const sample = (name) => read("_samples", name).replace(/^SYNTHETIC OUTPUT:[^\n]*\n\n/, "");
// Test-only structural derivative: no new claim assessment is asserted here.
// Historical files stay untouched; the separate legacy test below pins their gaps.
const currentPack = (name) => sample(name).replace("## Summary\n", "## Summary\nRisk flags: none\n").split("\n").map((line) => {
  if (line.startsWith("| # |")) return line.replace("| Priority |", "| Priority | Risk flags |");
  if (/^\|---/.test(line)) return `${line}---|`;
  return line.replace(/\| (High|Medium|Low) \|/, "| $1 | none |");
}).join("\n");
const levels = (findings, level) => findings.filter((f) => f.level === level).map((f) => f.rule);

test("current-contract structural derivatives retain the recorded rewrite warnings", async () => {
  const { checkPack } = await checker();
  const one = checkPack(currentPack("example-pack-01.md"), sample("synthetic-draft-01.md"), sample("profile.example.md"));
  const two = checkPack(currentPack("example-pack-02.md"), sample("synthetic-draft-02.md"), sample("profile-02.example.md"));
  assert.deepEqual(levels(one, "ERROR"), []);
  assert.deepEqual(levels(two, "ERROR"), []);
  // Pack 1 replaced the "save $14,400" offer with a different sentence; pack 2 recomputed 44.9%.
  assert.ok(one.some((f) => f.rule === "sentence-kept" && /save \$14,400/.test(f.message)));
  assert.ok(two.some((f) => f.rule === "new-numbers" && /44\.9/.test(f.message)));
});

test("the checker catches internal notes in the copy, including the recorded leaky pack", async () => {
  const { checkPack } = await checker();
  const found = checkPack(currentPack("example-pack-02-leaky.md"), sample("synthetic-draft-02.md"), sample("profile-02.example.md"));
  const leak = found.find((f) => f.rule === "internal-notes");
  assert.ok(leak, "the leaky pack must fail");
  assert.match(leak.message, /supplied copy/);
  assert.match(leak.message, /on file/);
});

test("the checker enforces the card contracts on a damaged pack", async () => {
  const { checkPack } = await checker();
  const draft = sample("synthetic-draft-02.md");
  const profile = sample("profile-02.example.md");
  const good = currentPack("example-pack-02.md");
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
  const allHigh = good.replace(/\| (Medium|Low) \| none \|/g, "| High | none |");
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
    for (const f of ["console/console.mjs", "scripts/llm.mjs", "scripts/pack-checks.mjs", "claim-audit/check.mjs"]) fs.copyFileSync(path.join(root, f), path.join(dir, f));
    const save = (id, pack) => fs.writeFileSync(path.join(dir, "console", "runs", `${id}.json`), JSON.stringify({
      version: 1, id, brief: sample("synthetic-draft-02.md"), profile: sample("profile-02.example.md"),
      stages: [{ id: "safe-rewrite", status: "complete", result: pack }],
    }));
    save("clean", currentPack("example-pack-02.md"));
    const out = path.join(dir, "pack.md");
    let r = spawnSync(process.execPath, [path.join(dir, "claim-audit/check.mjs"), "--run", "clean", "--out", out], { encoding: "utf8" });
    assert.equal(r.status, 0, r.stderr + r.stdout);
    assert.match(fs.readFileSync(out, "utf8"), /^<!-- EE run: clean -->\n[\s\S]*## Automated checks[\s\S]*WARN \[new-numbers\]/);
    save("leaky", currentPack("example-pack-02-leaky.md"));
    r = spawnSync(process.execPath, [path.join(dir, "claim-audit/check.mjs"), "--run", "leaky"], { encoding: "utf8" });
    assert.equal(r.status, 1);
    assert.match(r.stdout, /ERROR \[internal-notes\]/);
    fs.writeFileSync(path.join(dir, "console", "runs", "half.json"), JSON.stringify({ version: 1, id: "half", brief: "x", stages: [{ status: "failed" }] }));
    r = spawnSync(process.execPath, [path.join(dir, "claim-audit/check.mjs"), "--run", "half"], { encoding: "utf8" });
    assert.equal(r.status, 1);
    assert.match(r.stderr, /has not finished/);
    r = spawnSync(process.execPath, [path.join(dir, "claim-audit/check.mjs"), "--help"], { encoding: "utf8" });
    assert.equal(r.status, 0);
    assert.match(r.stdout, /Check a Claim Audit run/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("the rewrite card asks for the task and summary formats the checker parses", async () => {
  const { loadCards } = await import(path.join(root, "console", "console.mjs"));
  const { checkPack } = await checker();
  const rewrite = loadCards(library)[3].prompt;
  assert.match(rewrite, /one Markdown bullet per claim/);
  assert.match(rewrite, /Start each bullet with `- Claim N`/);
  assert.match(rewrite, /by writing `Claim N` with its register ID/);
  // The failed 2026-10-18 run wrote tasks as paragraphs; the checker must keep rejecting that shape.
  const good = currentPack("example-pack-02.md");
  const paragraphs = good.replace(/^- ((?:High|Medium|Low) #\d+)/gm, "\n$1");
  assert.notEqual(paragraphs, good);
  assert.ok(checkPack(paragraphs, sample("synthetic-draft-02.md"), sample("profile-02.example.md")).some((f) => f.rule === "tasks" && /has no referenced verification task/.test(f.message)));
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
    for (const f of ["console/console.mjs", "scripts/llm.mjs", "scripts/pack-checks.mjs", "claim-audit/check.mjs", "examples/check.mjs"]) fs.copyFileSync(path.join(root, f), path.join(dir, f));
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

test("required pack content, register identity, and referenced tasks cannot silently disappear", async () => {
  const { checkPack } = await checker();
  const good = currentPack("example-pack-02.md");
  const run = (pack, context) => checkPack(pack, sample("synthetic-draft-02.md"), sample("profile-02.example.md"), context);
  for (const name of ["Summary", "Open verification tasks", "Rewritten draft", "Limits"]) {
    const empty = good.replace(new RegExp(`(## ${name}\\n)[\\s\\S]*?(?=\\n## |$)`), "$1\n");
    assert.ok(run(empty).some((f) => f.level === "ERROR" && f.rule === "sections"), name);
  }
  const blankCells = good.split("\n").map((line) => {
    if (!/^\| \d+ \|/.test(line)) return line;
    const cells = line.split("|");
    for (const index of [1, 2, 5, 6, 7, 11]) cells[index] = " ";
    return cells.join("|");
  }).join("\n");
  assert.ok(run(blankCells).some((f) => f.rule === "empty-cell"));
  assert.ok(run(good.replace(/\| 2 \|/, "| 1 |")).some((f) => f.rule === "row-id"));
  assert.ok(run(good.replace("Mossgrove's guided program is clinically proven to cure insomnia.", "A completely invented claim.")).some((f) => f.rule === "verbatim"));
  const previous = good.match(/## Claim register\n([\s\S]*?)\n## Open verification tasks/)[1];
  const dropped = good.split("\n").filter((line) => !/^\| 8 \|/.test(line)).join("\n");
  assert.ok(run(dropped, { priorRegisters: [previous] }).some((f) => f.rule === "row-preservation"));
  assert.ok(run(good.replace("factual-description | UNPLACED", "factual-description | Inference"), { priorRegisters: [previous] }).some((f) => f.rule === "row-preservation"));
  assert.ok(run(good.replace("factual-description | UNPLACED", "statistic | UNPLACED"), { priorRegisters: [previous] }).some((f) => f.rule === "row-preservation"));
  const noTask = good.replace(/^- Medium #2[^\n]*\n/m, "");
  assert.ok(run(noTask).some((f) => f.rule === "tasks" && /claim 2/.test(f.message)));
  assert.ok(run(noTask).some((f) => f.rule === "bracket-task"));
});

test("pack boundaries retain fenced text and reject duplicate or unexpected headings", async () => {
  const { checkPack } = await checker();
  const good = currentPack("example-pack-02.md");
  const run = (pack) => checkPack(pack, sample("synthetic-draft-02.md"), sample("profile-02.example.md"));
  const duplicate = `## Rewritten draft\nBilling export is on file.\n\n${good}`;
  assert.ok(run(duplicate).some((f) => f.rule === "sections" && /duplicate/.test(f.message)));
  assert.ok(run(duplicate).some((f) => f.rule === "internal-notes"));
  const unexpected = good.replace("## Rewritten draft\n", "## Rewritten draft\n\n## Offer\nBilling export is on file.\n");
  assert.ok(run(unexpected).some((f) => f.level === "ERROR" && /unexpected section: Offer/.test(f.message)));
  const fenced = good.replace("## Rewritten draft\n", "## Rewritten draft\n````md\n```\n## Limits\nBilling export is on file.\n```\n````\n");
  assert.ok(run(fenced).some((f) => f.rule === "internal-notes"));
  assert.ok(!run(fenced).some((f) => f.rule === "sections"), "a fenced heading is body content");
  assert.ok(run(`${good}\n~~~\n`).some((f) => /unclosed/.test(f.message)));
  assert.ok(run(`Unchecked introductory claim.\n\n${good}`).some((f) => /before the first/.test(f.message)));
});

test("historical audit bodies lack the new uncapped risk flags without rewriting the evidence", async () => {
  const { checkPack } = await checker();
  const found = checkPack(sample("example-pack-02.md"), sample("synthetic-draft-02.md"), sample("profile-02.example.md"));
  assert.ok(found.some((f) => f.rule === "columns" && /Risk flags/.test(f.message)));
});

test("risk flags remain visible outside the High cap and are counted and assigned tasks", async () => {
  const { checkPack } = await checker();
  const good = currentPack("example-pack-02.md");
  const run = (pack) => checkPack(pack, sample("synthetic-draft-02.md"), sample("profile-02.example.md"));
  const flagged = good.replaceAll("| none |", "| policy-conflict |")
    .replace("Risk flags: none", "Risk flags: policy-conflict=8\nFlagged claims: #1 #2 #3 #4 #5 #6 #7 #8")
    .replace(/(^- (?:High|Medium|Low) #\d+[^\n]*)/gm, "$1 Risk flags: policy-conflict.");
  assert.deepEqual(run(flagged).filter((f) => f.level === "ERROR"), []);
  assert.ok(run(flagged).some((f) => f.rule === "risk-flags-review" && /policy-conflict=8/.test(f.message)));
  assert.ok(run(flagged.replace("policy-conflict=8", "policy-conflict=2")).some((f) => f.level === "ERROR" && f.rule === "risk-flags"));
  assert.ok(run(flagged.replace("| policy-conflict |", "| arbitrary | ")).some((f) => f.level === "ERROR" && f.rule === "risk-flags"));
  assert.ok(run(flagged.replace(/^- Medium #1[^\n]*\n/m, "")).some((f) => f.rule === "tasks" && /claim 1/.test(f.message)));
  assert.ok(run(flagged.replace("Flagged claims: #1", "Flagged claims:")).some((f) => f.rule === "risk-flags" && /claim 1/.test(f.message)));
});

test("accepted owner table corrections reset older history but later unattended drift still fails", async () => {
  const { checkPack, authoritativeRegisters } = await checker();
  const original = currentPack("example-pack-02.md");
  const corrected = original.replace("factual-description | UNPLACED", "factual-description | Inference").replace("UNPLACED: 5", "UNPLACED: 4; Inference: 1");
  const table = (pack) => pack.match(/## Claim register\n([\s\S]*?)\n## Open verification tasks/)[1];
  const stages = [
    { id: "extract-claims", status: "complete", edited: false, result: table(original) },
    { id: "classify-claims", status: "complete", edited: true, result: table(corrected) },
    { id: "evidence-needs", status: "complete", edited: false, result: table(corrected) },
    { id: "safe-rewrite", status: "complete", edited: false, result: corrected },
  ];
  const run = (pack) => checkPack(pack, sample("synthetic-draft-02.md"), sample("profile-02.example.md"), { priorRegisters: authoritativeRegisters(stages) });
  assert.equal(authoritativeRegisters(stages).length, 2, "history starts at the last accepted owner edit");
  assert.deepEqual(run(corrected).filter((f) => f.level === "ERROR"), []);
  assert.ok(run(original).some((f) => f.rule === "row-preservation"));
  stages[1].edited = false;
  assert.equal(authoritativeRegisters(stages).length, 3);
  assert.ok(run(corrected).some((f) => f.rule === "row-preservation"), "model changes do not reset accepted history");
});

test("revised cards pin exact quoted spans, uncapped flags, and reproducible review drafts", async () => {
  const { loadCards } = await import(path.join(root, "console", "console.mjs"));
  const [extract, classify, evidence, rewrite] = loadCards(library).map((c) => c.prompt);
  assert.match(extract, /Escape any literal pipe/);
  assert.match(classify, /Implied meaning/);
  for (const flag of ["profile-contradiction", "policy-conflict", "unsupported-comparison", "unverified-result", "permission-missing"]) assert.ok(evidence.includes(flag));
  assert.match(evidence, /There is no quota/);
  assert.match(evidence, /not an absolute risk or safety rating/);
  assert.match(rewrite, /review draft/);
  assert.match(rewrite, /formula, stated inputs, and units/);
  assert.match(rewrite, /never silently delete it/);
  assert.match(rewrite, /Start each bullet with `- Claim N`/);
  assert.match(rewrite, /Risk flags: none/);
  for (const prompt of [extract, classify, evidence, rewrite]) assert.match(prompt, /owner answers/);
  assert.match(extract, /must still quote the original draft itself/);
  assert.match(rewrite, /Do not quote supplemental answers as if they appeared in the original draft/);
});

test("numeric comparison preserves exact decimal values without spelling or precision artifacts", async () => {
  const { numbers, numberValues } = await import(path.join(root, "scripts", "pack-checks.mjs"));
  assert.deepEqual([...numbers("$7 $7.00 007.000 $.50 $0.500 9007199254740993.00")], ["7", "0.5", "9007199254740993"]);
  assert.equal(numberValues("A fee of $7.00.")[0].text, "$7.00", "the original displayed spelling remains available");
  assert.deepEqual([...numbers("0.00010 0.0001 100.01 100.010")], ["0.0001", "100.01"]);
});

test("written source quantities never supply unsupported fragments or absorb prose conjunctions", async () => {
  const { sourceNumbers } = await import(path.join(root, "scripts", "pack-checks.mjs"));
  for (const phrase of ["one hundred dollars", "twenty thousand jobs", "one hundred and twenty-three", "twenty point five", "one half", "one and a quarter", "two dozen", "one and two"]) assert.deepEqual([...sourceNumbers(phrase)], [], phrase);
  assert.deepEqual([...sourceNumbers("four and under; twenty-three and available; forty two loaves; zero fees")], ["4", "23", "42", "0"]);
  assert.deepEqual([...sourceNumbers("One hundred (100) jobs")], ["100"], "explicit owner digits remain usable");
});

function singleClaimPack(claim, copy = claim) {
  return `## Summary\nUNPLACED: 1. Low: 1.\nRisk flags: none\n## Claim register\n| # | Claim (verbatim) | Kind | Class | Why | Evidence needed | Cannot support | Check by | Priority | Risk flags | Safe rewrite |\n|---|---|---|---|---|---|---|---|---|---|---|\n| 1 | ${claim} | factual-description | UNPLACED | Missing support. | Ask the owner. | Broader claims. | ask-owner | Low | none | Check owner wording. |\n## Open verification tasks\n- Claim 1: ask-owner for evidence.\n## Rewritten draft\n${copy}\n## Limits\nUntrusted model reading, not legal or compliance advice.`;
}

test("verbatim source and preservation checks retain literal arithmetic and code-span content", async () => {
  const { checkPack } = await checker();
  const { plain, normalized, parseTable } = await import(path.join(root, "scripts", "pack-checks.mjs"));
  assert.equal(plain("**2*3**"), "2*3");
  assert.equal(plain("`*literal*`"), "*literal*");
  assert.equal(plain("**`*literal*`**"), "*literal*");
  assert.equal(plain("\\*literal\\*"), "*literal*");
  assert.notEqual(normalized("2*3 dollars"), normalized("23 dollars"));
  const draft = "The price is 2*3 dollars.";
  const original = singleClaimPack(draft);
  const changed = singleClaimPack("The price is 23 dollars.", draft);
  assert.deepEqual(checkPack(singleClaimPack(`**${draft}**`, draft), draft).filter((f) => f.level === "ERROR"), []);
  const prior = parseTable(original.split("## Claim register\n")[1].split("## Open verification tasks")[0]);
  assert.equal(prior.rows[0]["Claim (verbatim)"], draft);
  const previous = original.split("## Claim register\n")[1].split("## Open verification tasks")[0];
  const found = checkPack(changed, draft, "", { priorRegisters: [previous] });
  assert.ok(found.some((f) => f.rule === "verbatim"));
  assert.ok(found.some((f) => f.rule === "row-preservation"));
});

test("UNVERIFIED annotations balance outer brackets while preserving brackets in quoted source", async () => {
  const { checkPack } = await checker();
  const draft = "Top [premium] flour is guaranteed.";
  const bracket = `[UNVERIFIED: "${draft}"; needs [supporting evidence]]`;
  const valid = checkPack(singleClaimPack(draft, bracket), draft);
  assert.deepEqual(valid.filter((f) => f.level === "ERROR"), []);
  assert.ok(!valid.some((f) => f.rule === "strong-wording-review"), "a complete bracket is excluded from active copy as a whole");
  for (const bad of [bracket.slice(0, -1), `[UNVERIFIED: "${draft}"; needs evidence`, `[UNVERIFIED: "${draft}; needs evidence]`]) assert.ok(checkPack(singleClaimPack(draft, bad), draft).some((f) => f.rule === "bracket-task" && /not closed/.test(f.message)));
  const literal = "Top [premium flour.";
  assert.deepEqual(checkPack(singleClaimPack(literal, `[UNVERIFIED: "${literal}"; needs evidence]`), literal).filter((f) => f.level === "ERROR"), [], "literal unmatched source brackets inside a quote do not close the annotation");
});

test("claim tables preserve escaped pipes and reject malformed delimiters", async () => {
  const { registerRows } = await checker();
  const header = "| # | Claim (verbatim) | Kind |";
  const row = "| 1 | Pick A \\| B, then \\\\ | factual-description |";
  const parsed = registerRows(`${header}\n|---|---|---|\n${row}`);
  assert.deepEqual(parsed.issues, []);
  assert.equal(parsed.rows[0]["Claim (verbatim)"], "Pick A | B, then \\");
  assert.equal(parsed.rows[0].Kind, "factual-description");
  assert.ok(registerRows(`${header}\n${row}`).issues.some((issue) => /separator/.test(issue)));
  assert.ok(registerRows(`${header}\n|---|---|---|\n|1|too|many|cells|`).issues.some((issue) => /4 cells/.test(issue)));
  assert.ok(registerRows("| # | # |\n|---|---|\n|1|2|").issues.some((issue) => /duplicate column/.test(issue)));
});
