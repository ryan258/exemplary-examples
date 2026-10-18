const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const library = import(path.join(root, "console/console.mjs"));

function fixture() {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "ee-exports-")));
  const runs = path.join(dir, "console/runs");
  fs.mkdirSync(runs, { recursive: true });
  return { dir, runs, close: () => fs.rmSync(dir, { recursive: true, force: true }) };
}

test("exports reject Markdown symlinks to saved runs, including dangling and absolute destinations", async () => {
  const { writePack } = await library;
  const f = fixture();
  try {
    const record = path.join(f.runs, "saved.json");
    fs.writeFileSync(record, '{"saved":"intact"}');
    const linked = path.join(f.runs, "alias.md");
    fs.symlinkSync(record, linked);
    for (const out of ["alias.md", linked]) assert.throws(() => writePack(out, "replacement", f.runs), /not a symlink/);
    fs.symlinkSync(path.join(f.runs, "missing.json"), path.join(f.runs, "dangling.md"));
    assert.throws(() => writePack("dangling.md", "replacement", f.runs), /not a symlink/);
    assert.equal(fs.readFileSync(record, "utf8"), '{"saved":"intact"}');
    assert.equal(fs.existsSync(path.join(f.runs, "missing.json")), false);
    assert.ok(fs.lstatSync(linked).isSymbolicLink());
  } finally { f.close(); }
});

test("relative exports cannot escape through directory symlinks while explicit absolute paths work", async () => {
  const { outPath, writePack } = await library;
  const f = fixture();
  try {
    const outside = path.join(f.dir, "outside");
    fs.mkdirSync(outside);
    fs.symlinkSync(outside, path.join(f.runs, "linked"), "dir");
    assert.throws(() => writePack("linked/pack.md", "private text", f.runs), /leaves/);
    assert.equal(fs.existsSync(path.join(outside, "pack.md")), false);
    assert.equal(writePack(path.join(outside, "pack.md"), "explicit export", f.runs), path.join(outside, "pack.md"));
    assert.equal(fs.readFileSync(path.join(outside, "pack.md"), "utf8"), "explicit export");
    for (const out of ["../pack.md", "a/../../pack.md"]) assert.throws(() => outPath(out, f.runs), /leaves/);
    assert.equal(writePack("..notes.md", "valid local name", f.runs), path.join(f.runs, "..notes.md"));
    fs.mkdirSync(path.join(f.runs, "nested"));
    fs.symlinkSync(path.join(f.runs, "nested"), path.join(f.runs, "inside"), "dir");
    writePack("inside/pack.md", "local nested export", f.runs);
    assert.equal(fs.readFileSync(path.join(f.runs, "nested/pack.md"), "utf8"), "local nested export");
  } finally { f.close(); }
});

test("atomic private exports preserve saved hard links and previous content after a failed write", async () => {
  const { writePack } = await library;
  const f = fixture();
  try {
    const record = path.join(f.runs, "saved.json");
    const exported = path.join(f.runs, "pack.md");
    fs.writeFileSync(record, '{"saved":"intact"}', { mode: 0o644 });
    fs.linkSync(record, exported);
    writePack("pack.md", "new pack", f.runs);
    assert.equal(fs.readFileSync(record, "utf8"), '{"saved":"intact"}');
    assert.equal(fs.readFileSync(exported, "utf8"), "new pack");
    assert.equal(fs.statSync(exported).mode & 0o777, 0o600);
    assert.notEqual(fs.statSync(record).ino, fs.statSync(exported).ino);
    assert.throws(() => writePack("pack.md", {}, f.runs), /data.*argument/i);
    assert.equal(fs.readFileSync(exported, "utf8"), "new pack");
    assert.deepEqual(fs.readdirSync(f.runs).sort(), ["pack.md", "saved.json"]);
    fs.mkdirSync(path.join(f.runs, "directory.md"));
    assert.throws(() => writePack("directory.md", "no", f.runs), /not a symlink or directory/);
  } finally { f.close(); }
});

test("both checker CLIs reject empty runs with a recovery message and route exports through the safe writer", async () => {
  const f = fixture();
  try {
    for (const relative of ["console/console.mjs", "scripts/llm.mjs", "scripts/pack-checks.mjs", "claim-audit/check.mjs", "examples/check.mjs"]) {
      fs.mkdirSync(path.dirname(path.join(f.dir, relative)), { recursive: true });
      fs.copyFileSync(path.join(root, relative), path.join(f.dir, relative));
    }
    fs.writeFileSync(path.join(f.runs, "empty.json"), JSON.stringify({ version: 1, id: "empty", brief: "Synthetic brief", stages: [] }));
    for (const [checker, last] of [["claim-audit", "safe-rewrite"], ["examples", "challenge-example"]]) {
      const cli = path.join(f.dir, checker, "check.mjs");
      let result = spawnSync(process.execPath, [cli, "--run", "empty"], { encoding: "utf8" });
      assert.equal(result.status, 1, result.stdout + result.stderr);
      assert.match(result.stderr, /has no stages.*no .* pack to check/);
      assert.doesNotMatch(result.stderr, /TypeError|Cannot read/);
      const state = { version: 1, id: "complete", brief: "Synthetic brief", stages: [{ id: last, status: "complete", result: "Synthetic invalid pack" }] };
      const record = path.join(f.runs, "complete.json");
      fs.writeFileSync(record, JSON.stringify(state));
      const alias = path.join(f.runs, "alias.md");
      fs.symlinkSync(record, alias);
      result = spawnSync(process.execPath, [cli, "--run", "complete", "--out", "alias.md"], { encoding: "utf8" });
      assert.equal(result.status, 1, result.stdout + result.stderr);
      assert.match(result.stderr, /not a symlink/);
      assert.deepEqual(JSON.parse(fs.readFileSync(record, "utf8")), state);
      fs.unlinkSync(alias);
    }
  } finally { f.close(); }
});
