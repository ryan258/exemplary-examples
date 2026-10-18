const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function assertFrozenInventory(directory, expected) {
  const files = [];
  const visit = (current, relative = "") => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const name = relative ? `${relative}/${entry.name}` : entry.name;
      const location = path.join(current, entry.name);
      if (entry.isDirectory()) visit(location, name);
      else {
        assert.ok(entry.isFile(), `unexpected non-file in frozen evidence: ${name}`);
        files.push(name);
      }
    }
  };
  visit(directory);
  assert.deepEqual(files.sort(), Object.keys(expected).sort(), "frozen file inventory changed");
  for (const name of files) {
    assert.match(expected[name], /^[0-9a-f]{64}$/, `invalid recorded hash: ${name}`);
    assert.equal(sha256(path.join(directory, name)), expected[name], `frozen content changed: ${name}`);
  }
}

// Tracked and untracked-but-not-ignored Markdown, so tool folders git ignores (like .gitnexus)
// cannot change the result between a laptop and CI. Falls back to walking the tree without git.
function markdownFiles(directory = root) {
  if (directory === root) {
    try {
      const listed = execFileSync("git", ["ls-files", "-co", "--exclude-standard", "--", "*.md"], { cwd: root, encoding: "utf8" });
      return listed.split("\n").filter(Boolean).map((f) => path.join(root, f)).filter((f) => fs.existsSync(f));
    } catch {
      // not a git checkout: walk below
    }
  }
  return walkMarkdown(directory);
}

function walkMarkdown(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git") return [];
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkMarkdown(location);
    return entry.name.endsWith(".md") ? [location] : [];
  });
}

test("all relative Markdown links resolve", () => {
  const broken = [];

  for (const file of markdownFiles()) {
    const source = fs.readFileSync(file, "utf8");
    const links = [...source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map((match) => match[1]);

    for (const link of links) {
      if (/^(?:https?:|mailto:|#)/i.test(link)) continue;
      const target = decodeURIComponent(link.split("#")[0]);
      if (!target) continue;
      const resolved = path.resolve(path.dirname(file), target);
      if (!fs.existsSync(resolved)) broken.push(`${path.relative(root, file)} -> ${link}`);
    }
  }

  assert.deepEqual(broken, []);
});

test("governing documents define the completed Local Edition scope", () => {
  const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
  const roadmap = fs.readFileSync(path.join(root, "ROADMAP.md"), "utf8");
  const status = fs.readFileSync(path.join(root, "STATUS.md"), "utf8");
  const charter = fs.readFileSync(path.join(root, "operations", "AI-STAFF-CHARTER.md"), "utf8");

  for (const document of [readme, roadmap, status]) {
    assert.match(document, /Local Edition/i);
    assert.match(document, /local-only|local project/i);
  }
  assert.match(readme, /AI staff agents?/i);
  assert.match(readme, /simulation/i);
  // A truthful blocked or in-progress status must be allowed to ship; only the
  // scope boundary above is a contract. Status wording is not.
  assert.match(charter, /Accountable Principal/i);
  for (const id of ["EE-01", "EE-02", "EE-03", "EE-04", "EE-05", "EE-06", "EE-07", "EE-08", "EE-09", "EE-10"]) {
    assert.match(charter, new RegExp(id));
  }
});

test("Local Edition has no automatic publishing or inquiry mechanism", () => {
  assert.equal(fs.existsSync(path.join(root, ".github", "workflows", "deploy.yml")), false);
  assert.equal(fs.existsSync(path.join(root, "assets", "inquiry.mjs")), false);
  assert.equal(fs.existsSync(path.join(root, "tests", "inquiry.test.js")), false);
});

test("qualification records bind authorization to an agent configuration", () => {
  const record = fs.readFileSync(
    path.join(root, "training", "templates", "CERTIFICATION-RECORD.md"),
    "utf8",
  );
  const runPlan = fs.readFileSync(
    path.join(root, "training", "dry-runs", "P0.2-RUN-PLAN.md"),
    "utf8",
  );

  for (const field of ["Runtime and model", "System/role instructions", "Tools and permissions", "Context/memory sources"]) {
    assert.match(record, new RegExp(field));
  }
  assert.match(runPlan, /separate, fresh agent sessions/i);
  assert.match(runPlan, /does not certify Keystone by itself/i);
});

test("the minimum viable qualification run has an executable, isolated fixture", () => {
  const fixtureRoot = path.join(
    root,
    "training",
    "dry-runs",
    "fixtures",
    "EE-MVQ-01",
  );
  const candidate = fs.readFileSync(path.join(fixtureRoot, "01-CANDIDATE-PACKET.md"), "utf8");
  const facilitator = fs.readFileSync(path.join(fixtureRoot, "02-FACILITATOR-PACKET.md"), "utf8");
  const assessor = fs.readFileSync(path.join(fixtureRoot, "03-ASSESSOR-KEY.md"), "utf8");

  assert.match(candidate, /Candidate-visible/i);
  for (let competency = 1; competency <= 10; competency += 1) {
    assert.match(candidate, new RegExp(`C${competency}(?:\\D|$)`));
  }
  assert.doesNotMatch(candidate, /Hidden fact/i);
  assert.doesNotMatch(candidate, /board is deciding whether to authorize a four-week/i);
  assert.match(candidate, /Do not read `SIMULATION-PACKS\.md`/i);
  assert.match(facilitator, /Facilitator-only/i);
  assert.match(facilitator, /release gate/i);
  assert.match(assessor, /Assessor-only/i);
  assert.match(assessor, /planted defects/i);

  for (const template of [
    "ASSESSOR-SCORE-TEMPLATE.md",
    "CALIBRATION-TEMPLATE.md",
    "DRY-RUN-REPORT-TEMPLATE.md",
  ]) {
    assert.ok(fs.existsSync(path.join(root, "training", "dry-runs", template)), template);
  }
});

test("the authored training release retains its bounded run evidence and certification boundary", () => {
  const runRoot = path.join(root, "training", "dry-runs", "2026-07-13-ee-mvq-01-r1");
  const requiredRecords = [
    "00-RUN-MANIFEST.md",
    "01-CANDIDATE-BRIEF.md",
    "02-CANDIDATE-OUTPUT.md",
    "03-FACILITATOR-OBSERVATION.md",
    "04-VERITY-SCORE.md",
    "05-COUNTERPOINT-SCORE.md",
    "06-CALIBRATION.md",
    "07-CERTIFICATION-RECORD.md",
    "08-DRY-RUN-REPORT.md",
  ];

  for (const record of requiredRecords) {
    assert.ok(fs.existsSync(path.join(runRoot, record)), record);
  }

  const specification = fs.readFileSync(
    path.join(root, "training", "01_foundations", "TRAINING-SYSTEM-SPEC.md"),
    "utf8",
  );
  const report = fs.readFileSync(path.join(runRoot, "08-DRY-RUN-REPORT.md"), "utf8");
  const certification = fs.readFileSync(path.join(runRoot, "07-CERTIFICATION-RECORD.md"), "utf8");
  const fixture = fs.readFileSync(
    path.join(root, "training", "dry-runs", "fixtures", "EE-MVQ-01", "README.md"),
    "utf8",
  );

  assert.match(specification, /initial authored release \*\*EE-TRAINING-2026\.07\*\*/i);
  assert.match(specification, /one minimum viable composite synthetic route was demonstrated/i);
  assert.match(specification, /Full-system validation.+remain unproved/i);
  assert.doesNotMatch(specification, /This release validates the training system/i);
  assert.match(report, /\[x\] Complete and successful/i);
  assert.match(report, /P0\.2 acceptance criteria satisfied:\*\* Yes/i);
  assert.match(report, /does not itself certify Keystone/i);
  assert.match(certification, /\[x\] Not yet/i);
  assert.match(certification, /No new client or external authority is granted/i);
  assert.match(fixture, /Fixture version:\*\* EE-MVQ-01\.1/i);
});

test("the frozen run's recorded hashes still match its files", () => {
  const runRoot = path.join(root, "training", "dry-runs", "2026-07-13-ee-mvq-01-r1");
  const manifest = fs.readFileSync(path.join(runRoot, "00-RUN-MANIFEST.md"), "utf8");
  // The run's own fixture/ copy is the one it executed, and it is what the manifest
  // hashes describe. The reusable fixtures/EE-MVQ-01/ tree has since moved to v01.1
  // and is deliberately not compared here.
  const runFixture = path.join(runRoot, "fixture");

  const expected = new Map([
    [path.join(runFixture, "01-CANDIDATE-PACKET.md"), /Candidate packet SHA-256:\*\* `([0-9a-f]{64})`/],
    [path.join(runFixture, "02-FACILITATOR-PACKET.md"), /Facilitator packet SHA-256:\*\* `([0-9a-f]{64})`/],
    [path.join(runFixture, "03-ASSESSOR-KEY.md"), /Assessor key SHA-256:\*\* `([0-9a-f]{64})`/],
  ]);
  for (const record of [
    "02-CANDIDATE-OUTPUT.md",
    "04-VERITY-SCORE.md",
    "05-COUNTERPOINT-SCORE.md",
    "06-CALIBRATION.md",
    "07-CERTIFICATION-RECORD.md",
    "08-DRY-RUN-REPORT.md",
  ]) {
    expected.set(path.join(runRoot, record), new RegExp(`${record}\`; SHA-256 \`([0-9a-f]{64})`));
  }

  const mismatched = [];
  for (const [file, pattern] of expected) {
    const recorded = manifest.match(pattern);
    assert.ok(recorded, `no hash recorded in the manifest for ${path.basename(file)}`);
    const actual = sha256(file);
    if (actual !== recorded[1]) mismatched.push(`${path.relative(root, file)}: ${recorded[1]} -> ${actual}`);
  }
  assert.deepEqual(mismatched, [], "frozen evidence no longer matches its manifest");
});

test("the complete external frozen inventory covers every file including the historical manifest", () => {
  const runDirectory = "training/dry-runs/2026-07-13-ee-mvq-01-r1";
  const inventory = JSON.parse(fs.readFileSync(path.join(root, `${runDirectory}.sha256.json`), "utf8"));
  assert.equal(inventory.schemaVersion, 1);
  assert.equal(inventory.runDirectory, runDirectory);
  assert.match(inventory.baselineCommit, /^[0-9a-f]{40}$/);
  for (const file of ["00-RUN-MANIFEST.md", "01-CANDIDATE-BRIEF.md", "03-FACILITATOR-OBSERVATION.md", "fixture/README.md"]) {
    assert.ok(inventory.files[file], `complete inventory must include ${file}`);
  }
  assertFrozenInventory(path.join(root, runDirectory), inventory.files);
});

test("frozen inventory detects changed, missing, added and non-regular files", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ee-frozen-inventory-"));
  try {
    fs.mkdirSync(path.join(temporary, "fixture"));
    fs.writeFileSync(path.join(temporary, "record.md"), "frozen record\n");
    fs.writeFileSync(path.join(temporary, "fixture", "key.md"), "frozen key\n");
    const expected = {
      "record.md": sha256(path.join(temporary, "record.md")),
      "fixture/key.md": sha256(path.join(temporary, "fixture", "key.md")),
    };
    assertFrozenInventory(temporary, expected);
    fs.writeFileSync(path.join(temporary, "record.md"), "changed\n");
    assert.throws(() => assertFrozenInventory(temporary, expected), /frozen content changed/);
    fs.writeFileSync(path.join(temporary, "record.md"), "frozen record\n");
    fs.unlinkSync(path.join(temporary, "fixture", "key.md"));
    assert.throws(() => assertFrozenInventory(temporary, expected), /frozen file inventory changed/);
    fs.writeFileSync(path.join(temporary, "fixture", "key.md"), "frozen key\n");
    fs.writeFileSync(path.join(temporary, "extra.md"), "unexpected\n");
    assert.throws(() => assertFrozenInventory(temporary, expected), /frozen file inventory changed/);
    fs.unlinkSync(path.join(temporary, "extra.md"));
    fs.symlinkSync(path.join(temporary, "record.md"), path.join(temporary, "alias.md"));
    assert.throws(() => assertFrozenInventory(temporary, expected), /unexpected non-file/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("owner entry points agree on scope, provenance and unmeasured model usefulness", () => {
  for (const file of ["README.md", "STATUS.md", "LOCAL-EDITION.md", "docs/START.md"]) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    assert.match(source, /Claim Audit/);
    assert.match(source, /Illustrative Examples/i);
    assert.match(source, /owner|your own/i);
  }
  const course = fs.readFileSync(path.join(root, "training/02_instruction/COURSE-MODULES.md"), "utf8");
  assert.match(course, /This is provenance, not proof/);
  assert.match(course, /Record verification separately/);
  assert.doesNotMatch(course, /A \*\*sourced fact\*\* is externally retrievable and verified/);
  const start = fs.readFileSync(path.join(root, "docs/START.md"), "utf8");
  assert.match(start, /real-asset usefulness is still unmeasured/);
  assert.match(start, /Anyone else's drafts/);
  assert.match(start, /ee finish RUN_ID/);
});

test("the accepted Claim Audit extension is bounded and reflected in the governing documents", () => {
  const read = (...p) => fs.readFileSync(path.join(root, ...p), "utf8");
  const decision = read("SCOPE-DECISION-CLAIM-AUDIT.md");
  const policy = read("operations", "AI-DATA-POLICY.md");

  assert.match(decision, /\*\*Status:\*\* Accepted/);
  assert.match(decision, /Approved by: .+2026-10-17/);
  // The exclusions that must survive the extension.
  for (const kept of [/Public hosting, deployment, payments/i, /Paid client work/i, /Confidential \(D2\) or restricted \(D3\)/i]) {
    assert.match(decision, kept);
  }
  for (const doc of ["LOCAL-EDITION.md", "README.md", "STATUS.md"]) {
    assert.match(read(doc), /SCOPE-DECISION-CLAIM-AUDIT\.md/, `${doc} must point to the accepted decision`);
  }
  // Accepting the scope does not approve a tool: real drafts stay blocked until the register has a row.
  assert.match(policy, /Claim Audit extension/);
  // Accepting the scope is not approval, so the register must name exactly what was approved and what is unknown.
  const row = policy.split("\n").find((l) => l.startsWith("| OpenRouter"));
  assert.ok(row, "the register has the owner's OpenRouter row");
  assert.match(row, /`tencent\/hy3`/);
  assert.match(row, /\| D1 \|/);
  assert.match(row, /not verified/i);
  assert.match(row, /unknown/i);
  assert.doesNotMatch(policy, /None approved yet/);
  assert.match(policy, /The row above is the only approval\. It covers D0 and D1 only/);
  assert.match(policy, /free-tier models are not covered/);
});
