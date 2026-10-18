#!/usr/bin/env node
// Short owner commands. Only audit, example, and resume can dispatch model requests.
import { existsSync, readdirSync, statSync, readFileSync, unlinkSync, lstatSync } from "node:fs";
import { dirname, join, resolve, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { loadRun, usageLine } from "../console/console.mjs";
import { parseOptions } from "./llm.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const RUNS = join(ROOT, "console/runs");
const HELP = `Exemplary Examples — short owner commands (run from any directory)

  node scripts/ee.mjs list                         list saved runs, no requests
  node scripts/ee.mjs status [id]                  inspect latest or named run
  node scripts/ee.mjs show [id]                    show its accepted final result
  node scripts/ee.mjs audit <draft> [profile]       four-card audit of your own D0/D1 text
  node scripts/ee.mjs example <brief> [profile]     three-card illustrative example
  node scripts/ee.mjs resume [id] [answer]          continue saved work
  node scripts/ee.mjs check [id] [output.md]        check/export without model calls
  node scripts/ee.mjs finish <id>                  delete that run and its named exports
  node scripts/ee.mjs preview                      run local Hugo server

Use "latest" in place of an id. audit/example skip the editor; add --edit to edit between
cards, or --dry-run to preview without credentials or requests. Existing .env is loaded only
for audit/example/resume. Only the registered model is accepted. Other people's drafts,
D2/D3 data, hosting, and publication remain outside scope. See docs/START.md.`;

function workflow(state) {
  const id = state.stages.at(-1)?.id;
  if (id === "safe-rewrite") return "claim-audit";
  if (id === "challenge-example") return "examples";
  throw new Error(`Run ${state.id} is not a Claim Audit or Illustrative Examples pack.`);
}

export function runSummary(state) {
  const i = state.stages.findIndex((s, index) => s.status !== "complete" || (!state.noEdit && s.output && !s.edited && !s.editSkipped && index < state.stages.length - 1 && !state.stages.slice(index + 1).some((next) => next.input != null || next.status !== "pending")));
  const s = state.stages[i < 0 ? state.stages.length - 1 : i];
  const next = !s ? "no stages" : i < 0 ? "complete; check and review" : `${i + 1}/${state.stages.length} ${s.id || s.file || "stage"}: ${s.status}`;
  const uncertain = s?.attempts?.some((a) => a.status === "in_flight") ? "\nPrevious request outcome/charge unknown; resume retries the unfinished stage." : "";
  return `${state.id} — ${next}${s?.note ? `\n${s.note}` : ""}${uncertain}`;
}

export function listRuns(runsDir = RUNS) {
  if (!existsSync(runsDir)) return [];
  return readdirSync(runsDir).filter((f) => f.endsWith(".json") && /^[\w.-]+\.json$/.test(f))
    .map((f) => ({ id: basename(f, ".json"), time: statSync(join(runsDir, f)).mtimeMs }))
    .sort((a, b) => b.time - a.time || b.id.localeCompare(a.id));
}

// Delete only explicit local records and regular exports carrying that exact run marker.
// Visit real nested directories, never symlink files/directories, and keep unrelated contents.
export function finishRun(id, runsDir = RUNS) {
  if (!id || id === "latest") throw new Error("finish needs the explicit run id shown by list; latest is not a deletion target.");
  const state = loadRun(id, runsDir);
  const record = join(runsDir, `${state.id}.json`);
  if (!lstatSync(record).isFile()) throw new Error(`Refusing to delete a non-regular run file: ${record}`);
  const files = [];
  const marker = `<!-- EE run: ${state.id} -->\n`;
  const collect = (directory) => {
    for (const name of readdirSync(directory)) {
      const file = join(directory, name);
      const info = lstatSync(file);
      if (info.isDirectory()) collect(file);
      else if (info.isFile() && extname(name).toLowerCase() === ".md" && readFileSync(file, "utf8").startsWith(marker)) files.push(file);
    }
  };
  collect(runsDir);
  // Keep the record until exports are removed, so a failed cleanup remains resumable.
  files.push(record);
  for (const file of files) {
    if (!lstatSync(file).isFile()) throw new Error(`Refusing to delete a non-regular run file: ${file}`);
  }
  files.forEach((file) => unlinkSync(file));
  return files;
}

// Building a command is pure: tests can inspect dispatch without starting a provider, browser, or server.
export function commandFor(argv, { root = ROOT, state, cwd = process.cwd() } = {}) {
  const { rest, dryRun, edit } = parseOptions(argv, { flags: { "--dry-run": "dryRun", "--edit": "edit" }, positional: true });
  const [action, ...values] = rest;
  const envArgs = existsSync(join(root, ".env")) ? [`--env-file=${join(root, ".env")}`] : [];
  const caller = join(root, "console/console.mjs");
  if (action === "audit" || action === "example") {
    if (!values[0] || values.length > 2) throw new Error(`${action} needs an input file and optionally one profile file.`);
    return { command: process.execPath, args: [...envArgs, caller, "--dir", join(root, action === "audit" ? "claim-audit" : "examples"), "--all", "--idea-file", resolve(cwd, values[0]),
      ...(values[1] ? ["--profile", resolve(cwd, values[1])] : []), ...(!edit ? ["--no-edit"] : []), ...(dryRun ? ["--dry-run"] : [])], cwd: root };
  }
  if (edit) throw new Error("--edit is for audit/example; resume preserves the saved editing policy.");
  if (action === "resume") {
    if (values.length > 2) throw new Error("resume takes an optional id and one quoted answer.");
    return { command: process.execPath, args: [...envArgs, caller, ...(values[0] && values[0] !== "latest" ? ["--run", values[0]] : ["--resume"]), ...(values[1] ? ["--answer", values[1]] : []), ...(dryRun ? ["--dry-run"] : [])], cwd: root };
  }
  if (dryRun) throw new Error("--dry-run is for audit, example, or resume.");
  if (action === "check") {
    if (!state || values.length > 2) throw new Error("check takes an optional run id and output name.");
    return { command: process.execPath, args: [join(root, workflow(state), "check.mjs"), "--run", state.id, ...(values[1] ? ["--out", values[1]] : [])], cwd: root };
  }
  if (action === "preview" && !values.length) return { command: "hugo", args: ["server", "--source", root, "--bind", "127.0.0.1"], cwd: root };
  throw new Error(`Unknown command "${action || ""}". Use --help.`);
}

function main() {
  const argv = process.argv.slice(2);
  if (!argv.length || ["--help", "-h"].includes(argv[0])) return void console.log(HELP);
  const [action, id] = argv;
  if (["list", "status", "show", "finish"].includes(action)) {
    if (argv.length > (action === "list" ? 1 : 2)) throw new Error(`${action} received unexpected arguments.`);
    if (action === "list") {
      const runs = listRuns();
      if (!runs.length) console.log("No saved runs. Start with audit <draft> or example <brief>.");
      for (const r of runs) { try { console.log(runSummary(loadRun(r.id))); } catch (e) { console.error(e.message); process.exitCode = 1; } }
      return;
    }
    if (action === "finish") return void console.log(`Deleted ${finishRun(id).length} local file(s). Absolute exports outside console/runs/ must be removed separately.`);
    if ((!id || id === "latest") && !listRuns().length) return void console.log("No saved runs. Start with audit <draft> or example <brief>.");
    const state = loadRun(id === "latest" ? undefined : id);
    console.log(runSummary(state));
    if (action === "show") console.log(state.stages.at(-1)?.result || "No accepted final result yet.");
    const usage = usageLine(state);
    if (usage) console.log(usage);
    return;
  }
  const state = action === "check" ? loadRun(id === "latest" ? undefined : id) : undefined;
  const plan = commandFor(argv, { state });
  const result = spawnSync(plan.command, plan.args, { cwd: plan.cwd, stdio: "inherit" });
  if (result.error) throw new Error(`${plan.command} could not start: ${result.error.message}`);
  process.exitCode = result.status ?? 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
