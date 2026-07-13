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

test("governing documents use the disclosed AI-staff operating model", () => {
  const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
  const roadmap = fs.readFileSync(path.join(root, "ROADMAP.md"), "utf8");
  const status = fs.readFileSync(path.join(root, "STATUS.md"), "utf8");
  const charter = fs.readFileSync(path.join(root, "operations", "AI-STAFF-CHARTER.md"), "utf8");

  for (const document of [readme, roadmap, status, charter]) {
    assert.match(document, /AI staff agents?/i);
    assert.match(document, /Accountable Principal/i);
  }
  assert.doesNotMatch(status, /requires named humans with authority/i);
  for (const id of ["EE-01", "EE-02", "EE-03", "EE-04", "EE-05", "EE-06", "EE-07", "EE-08", "EE-09", "EE-10"]) {
    assert.match(charter, new RegExp(id));
  }
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

