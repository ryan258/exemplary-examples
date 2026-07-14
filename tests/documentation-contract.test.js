const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function markdownFiles(directory = root) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git") return [];
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(location);
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
  assert.match(status, /complete/i);
  assert.doesNotMatch(status, /current blockers/i);
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

test("the validated training release retains its run evidence and certification boundary", () => {
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

  assert.match(specification, /initial validated release \*\*EE-TRAINING-2026\.07\*\*/i);
  assert.match(report, /\[x\] Complete and successful/i);
  assert.match(report, /P0\.2 acceptance criteria satisfied:\*\* Yes/i);
  assert.match(report, /does not itself certify Keystone/i);
  assert.match(certification, /\[x\] Not yet/i);
  assert.match(certification, /No new client or external authority is granted/i);
  assert.match(fixture, /Fixture version:\*\* EE-MVQ-01\.1/i);
});
