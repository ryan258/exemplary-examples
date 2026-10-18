const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const load = () => import(path.join(root, "scripts/ee.mjs"));

test("the setup template selects a registered model", async () => {
  const { REGISTERED_MODELS } = await import(path.join(root, "scripts/llm.mjs"));
  const model = fs.readFileSync(path.join(root, ".env.example"), "utf8").match(/^OPENROUTER_MODEL=(.+)$/m)?.[1];
  assert.ok(REGISTERED_MODELS.includes(model), "copying .env.example must not start with an unregistered model");
});

test("short owner commands dispatch explicit files, preserve resume policy and never override model registration", async () => {
  const { commandFor } = await load();
  const opts = { root: "/tmp/ee-command-contract", cwd: "/tmp/input" };
  const audit = commandFor(["audit", "draft.md", "profile.md", "--dry-run"], opts);
  assert.ok(audit.args.includes("/tmp/input/draft.md"));
  assert.ok(audit.args.includes("/tmp/input/profile.md"));
  assert.ok(audit.args.includes("--no-edit") && audit.args.includes("--dry-run"));
  assert.ok(audit.args.includes("/tmp/ee-command-contract/claim-audit"));
  assert.ok(commandFor(["example", "brief.md", "--edit"], opts).args.includes("/tmp/ee-command-contract/examples"));
  assert.ok(!commandFor(["example", "brief.md", "--edit"], opts).args.includes("--no-edit"));
  const resume = commandFor(["resume", "run-1", "Annual plan"], opts);
  assert.deepEqual(resume.args.slice(-4), ["--run", "run-1", "--answer", "Annual plan"]);
  assert.ok(!resume.args.includes("--no-edit"));
  assert.throws(() => commandFor(["audit", "draft.md", "--allow-unregistered-model"], opts), /Unknown option/);
  assert.throws(() => commandFor(["preview", "--dry-run"], opts), /dry-run/);
  assert.throws(() => commandFor(["audit"], opts), /input file/);
  assert.throws(() => commandFor(["resume", "a", "b", "c"], opts), /optional id/);
  const check = commandFor(["check", "latest", "pack.md"], { ...opts, state: { id: "run-1", stages: [{ id: "challenge-example" }] } });
  assert.deepEqual(check.args.slice(-4), ["--run", "run-1", "--out", "pack.md"]);
});

test("finish deletes only the explicitly named run and marked local exports", async () => {
  const { finishRun, listRuns, runSummary } = await load();
  const { newRun, saveRun } = await import(path.join(root, "console/console.mjs"));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ee-finish-"));
  try {
    const state = newRun({ dir: root, model: "m", brief: "x", chain: [], id: "one" });
    saveRun(state, dir);
    saveRun({ ...state, id: "two" }, dir);
    fs.writeFileSync(path.join(dir, "one.md"), "<!-- EE run: one -->\nPack");
    fs.writeFileSync(path.join(dir, "unrelated.md"), "Do not delete");
    fs.writeFileSync(path.join(dir, "two.md"), "<!-- EE run: two -->\nOther pack");
    fs.symlinkSync(path.join(dir, "unrelated.md"), path.join(dir, "link.md"));
    assert.equal(listRuns(dir).length, 2);
    assert.match(runSummary(state), /no stages/);
    assert.match(runSummary({ id: "uncertain", noEdit: true, stages: [{ id: "a", status: "pending", attempts: [{ status: "in_flight" }] }] }), /outcome\/charge unknown; resume retries/);
    assert.throws(() => finishRun("latest", dir), /explicit run id/);
    assert.throws(() => finishRun("../one", dir), /Invalid run id/);
    assert.equal(finishRun("one", dir).length, 2);
    assert.deepEqual(fs.readdirSync(dir).sort(), ["link.md", "two.json", "two.md", "unrelated.md"]);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test("owner status and show handle first use offline from another directory", () => {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "ee-first-use-")));
  try {
    for (const folder of ["scripts", "console"]) fs.mkdirSync(path.join(dir, folder));
    for (const file of ["scripts/ee.mjs", "scripts/llm.mjs", "console/console.mjs"]) fs.copyFileSync(path.join(root, file), path.join(dir, file));
    for (const action of ["status", "show", "list"]) {
      const result = spawnSync(process.execPath, [path.join(dir, "scripts/ee.mjs"), action], { cwd: os.tmpdir(), env: { PATH: process.env.PATH }, encoding: "utf8", timeout: 3000 });
      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /No saved runs/);
    }
    assert.equal(fs.existsSync(path.join(dir, "console/runs")), false, "inspection must not create state");
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test("finish removes nested marked exports while preserving unrelated files and symlink subtrees", async () => {
  const { finishRun } = await load();
  const { newRun, saveRun } = await import(path.join(root, "console/console.mjs"));
  const runs = fs.mkdtempSync(path.join(os.tmpdir(), "ee-finish-nested-"));
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), "ee-finish-outside-"));
  try {
    saveRun(newRun({ dir: root, model: "m", brief: "x", chain: [], id: "one" }), runs);
    saveRun(newRun({ dir: root, model: "m", brief: "x", chain: [], id: "two" }), runs);
    const nested = path.join(runs, "nested", "deeper");
    fs.mkdirSync(nested, { recursive: true });
    fs.writeFileSync(path.join(nested, "one.md"), "<!-- EE run: one -->\nPrivate export");
    fs.writeFileSync(path.join(nested, "upper.MD"), "<!-- EE run: one -->\nUppercase Markdown export");
    fs.writeFileSync(path.join(nested, "two.md"), "<!-- EE run: two -->\nOther run");
    fs.writeFileSync(path.join(nested, "unmarked.md"), "Keep this file");
    const external = path.join(outside, "one.md");
    fs.writeFileSync(external, "<!-- EE run: one -->\nOutside export");
    fs.symlinkSync(outside, path.join(runs, "external"), "dir");
    fs.symlinkSync(external, path.join(nested, "linked.md"));

    assert.equal(finishRun("one", runs).length, 3);
    for (const file of ["one.json", "nested/deeper/one.md", "nested/deeper/upper.MD"]) assert.equal(fs.existsSync(path.join(runs, file)), false);
    assert.equal(fs.existsSync(path.join(runs, "two.json")), true);
    assert.equal(fs.readFileSync(path.join(nested, "two.md"), "utf8"), "<!-- EE run: two -->\nOther run");
    assert.equal(fs.readFileSync(path.join(nested, "unmarked.md"), "utf8"), "Keep this file");
    assert.equal(fs.readFileSync(external, "utf8"), "<!-- EE run: one -->\nOutside export");
    assert.ok(fs.lstatSync(path.join(runs, "external")).isSymbolicLink());
    assert.ok(fs.lstatSync(path.join(nested, "linked.md")).isSymbolicLink());
  } finally {
    fs.rmSync(runs, { recursive: true, force: true });
    fs.rmSync(outside, { recursive: true, force: true });
  }
});
