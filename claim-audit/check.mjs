#!/usr/bin/env node
// Deterministic checks on a finished Claim Audit pack. The model's output varies run to run; these
// checks do not. They test the pack against the cards' own rules and against the draft and profile,
// and flag what a person should look at. They cannot tell whether a claim is TRUE.
//
// Usage:
//   node claim-audit/check.mjs                      # check the most recent saved run
//   node claim-audit/check.mjs --run <id>           # a specific run in console/runs/
//   node claim-audit/check.mjs --out pack.md        # also write the pack with the findings appended
//                                                   # (a relative name lands in console/runs/, which git ignores)
//
// Exit code 1 when any ERROR is found (the pack breaks a card rule); WARN means "look at this".
import { fileURLToPath } from "node:url";
import { loadRun, writePack, ownerContext } from "../console/console.mjs";
import { parseOptions } from "../scripts/llm.mjs";
import { INTERNAL, STRONG, normalized, numbers, sections, checkedSections, parseTable } from "../scripts/pack-checks.mjs";
export { INTERNAL, STRONG, numbers, sections } from "../scripts/pack-checks.mjs";

const SECTIONS = ["Summary", "Claim register", "Open verification tasks", "Rewritten draft", "Limits"];
const COLUMNS = ["#", "Claim (verbatim)", "Kind", "Class", "Why", "Evidence needed", "Cannot support", "Check by", "Priority", "Risk flags", "Safe rewrite"];
const KINDS = ["statistic", "comparison-or-ranking", "cause-and-effect", "testimonial-or-endorsement", "forecast-or-promise", "factual-description", "price-or-offer"];
const CLASSES = ["Sourced fact", "Client-provided fact", "Calculation", "Inference", "Modeled scenario", "Satirical fiction", "UNPLACED"];
const CHECKS = ["open-source", "recompute", "ask-owner", "get-permission", "remove-or-reframe"];
const PRIORITIES = ["High", "Medium", "Low"];
export const RISK_FLAGS = ["profile-contradiction", "policy-conflict", "unsupported-comparison", "unverified-result", "permission-missing"];
const STOP = new Set("that this with from have your their will been were which about into than then them they what when where would could also each more most only over such very like just".split(" "));

const words = (s) => new Set((s.toLowerCase().match(/[a-z]{4,}/g) || []).filter((w) => !STOP.has(w)));
export const registerRows = (text) => parseTable(text);

// The last owner edit is an accepted replacement for older intermediate work.
// Unedited later stages must still preserve that baseline and one another.
export function authoritativeRegisters(stages) {
  const previous = stages.slice(0, -1).filter((stage) => stage.status === "complete");
  const edited = previous.findLastIndex((stage) => stage.edited === true);
  return previous.slice(edited < 0 ? 0 : edited).map((stage) => stage.result);
}

// Find the outer annotation boundary, ignoring literal brackets inside its
// quoted source phrase and balancing any nested brackets in the needs text.
function unverifiedAnnotations(text) {
  const annotations = [], issues = [];
  const start = /\[UNVERIFIED:/gi;
  let match;
  while ((match = start.exec(text))) {
    let depth = 1, quote = null, end = null;
    for (let i = start.lastIndex; i < text.length; i++) {
      const char = text[i];
      if (char === "\\" && /[\\\[\]"“”]/.test(text[i + 1] || "")) { i++; continue; }
      if (quote) {
        if (char === quote) quote = null;
        continue;
      }
      if (char === '"' || char === "“") quote = char === "“" ? "”" : '"';
      else if (char === "[") depth++;
      else if (char === "]" && --depth === 0) { end = i + 1; break; }
    }
    if (end == null) { issues.push("an UNVERIFIED annotation is not closed (including its quoted phrase)"); break; }
    annotations.push({ start: match.index, end, raw: text.slice(match.index, end), content: text.slice(start.lastIndex, end - 1).trim() });
    start.lastIndex = end;
  }
  return { annotations, issues };
}

export function checkPack(pack, draft, profile = "", { priorRegisters = [], supplied = draft } = {}) {
  const f = [];
  const add = (level, rule, message) => f.push({ level, rule, message });
  const sec = checkedSections(pack, SECTIONS, add);
  const { header, rows, issues } = registerRows(sec["Claim register"] || "");
  for (const issue of issues) add("ERROR", "table", issue);
  const lack = COLUMNS.filter((c) => !header.includes(c));
  if (lack.length) add("ERROR", "columns", `register is missing column(s): ${lack.join(", ")}`);
  if (!rows.length) add("ERROR", "rows", "the claim register has no rows");

  const ids = new Set();
  const flagsById = new Map();
  for (const [index, r] of rows.entries()) {
    const id = `row ${r["#"]}`;
    for (const column of COLUMNS) if (!/[\p{L}\p{N}]/u.test(r[column] || "")) add("ERROR", "empty-cell", `${id}: ${column} is empty`);
    if (!/^[1-9]\d*$/.test(r["#"]) || Number(r["#"]) !== index + 1 || ids.has(r["#"])) add("ERROR", "row-id", `${id}: IDs must be unique and numbered 1 through ${rows.length} in order`);
    ids.add(r["#"]);
    if (r["Claim (verbatim)"] && !normalized(draft).includes(normalized(r["Claim (verbatim)"]))) add("ERROR", "verbatim", `${id}: Claim (verbatim) is not an exact span of the draft`);
    if (!KINDS.includes(r.Kind)) add("ERROR", "kind", `${id}: Kind "${r.Kind}" is not an allowed value`);
    if (!CLASSES.includes(r.Class)) add("ERROR", "class", `${id}: Class "${r.Class}" is not one of the six classes or UNPLACED`);
    if (!CHECKS.includes(r["Check by"])) add("ERROR", "check-by", `${id}: Check by "${r["Check by"]}" is not an allowed value`);
    if (!PRIORITIES.includes(r.Priority)) add("ERROR", "priority", `${id}: Priority "${r.Priority}" is not High, Medium, or Low`);
    if (r.Priority === "Low" && /^(forecast-or-promise|testimonial-or-endorsement)$/.test(r.Kind)) add("ERROR", "never-low", `${id}: a ${r.Kind} claim is rated Low`);
    const flags = (r["Risk flags"] || "").split(",").map((flag) => flag.trim());
    if (flags.length === 1 && flags[0] === "none") flagsById.set(r["#"], []);
    else if (flags.some((flag) => !RISK_FLAGS.includes(flag)) || new Set(flags).size !== flags.length) add("ERROR", "risk-flags", `${id}: Risk flags must be none or unique comma-separated allowed flags`);
    else flagsById.set(r["#"], flags);
  }

  // Compare accepted earlier tables when a saved chain supplies them. The model
  // may add columns, but must not silently rewrite any accepted earlier cells.
  for (const [index, previous] of priorRegisters.entries()) {
    const prior = registerRows(sections(previous)["Claim register"] || previous);
    if (prior.issues.length || !prior.rows.length || !prior.header.includes("Claim (verbatim)")) {
      add("ERROR", "row-preservation", `earlier table ${index + 1} is malformed; row preservation cannot be checked`);
      continue;
    }
    const missingColumns = prior.header.filter((column) => !header.includes(column));
    const priorValues = prior.rows.map((row) => prior.header.map((column) => normalized(row[column] || "")));
    const finalValues = rows.map((row) => prior.header.map((column) => normalized(row[column] || "")));
    if (missingColumns.length || JSON.stringify(priorValues) !== JSON.stringify(finalValues)) add("ERROR", "row-preservation", `the final register changed or omitted accepted earlier table ${index + 1} rows/columns (including IDs, quoted claims, and prior assessments)`);
  }

  const tasks = (sec["Open verification tasks"] || "").split(/\r?\n/).filter((line) => /^\s*[-*]\s+/.test(line));
  const taskIds = new Set();
  for (const task of tasks) {
    const ref = task.match(/^\s*[-*]\s+(?:(?:High|Medium|Low)\s+)?(?:#|Claim\s+)(\d+)\b/i)?.[1];
    if (!ref) add("ERROR", "tasks", `task must start with its own claim reference (#N or Claim N): ${task}`);
    else {
      if (!ids.has(ref)) add("ERROR", "tasks", `task refers to absent claim ${ref}`);
      if (taskIds.has(ref)) add("ERROR", "tasks", `claim ${ref} has duplicate task lines`);
      taskIds.add(ref);
      const row = rows.find((r) => r["#"] === ref);
      if (row && !task.includes(row["Check by"])) add("ERROR", "tasks", `claim ${ref} task must include its ${row["Check by"]} action`);
      for (const flag of flagsById.get(ref) || []) if (!task.includes(flag)) add("ERROR", "tasks", `claim ${ref} task must name its ${flag} flag`);
    }
    if (!CHECKS.some((action) => task.includes(action))) add("ERROR", "tasks", `task needs a Check-by action: ${task}`);
  }
  for (const id of ids) if (!taskIds.has(id)) add("ERROR", "tasks", `claim ${id} has no referenced verification task`);

  const cap = Math.ceil(rows.length / 3);
  const high = rows.filter((r) => r.Priority === "High").length;
  if (rows.length && high > cap) add("ERROR", "high-cap", `${high} rows are High; the cap is ${cap} (one third of ${rows.length}, rounded up)`);

  // Summary counts must match the table, when the summary states them.
  const summary = sec.Summary || "";
  const tally = (key, label) => rows.filter((r) => r[key] === label).length;
  for (const [key, labels] of [["Class", CLASSES], ["Priority", PRIORITIES]]) {
    for (const label of labels) {
      const said = summary.match(new RegExp(`\\b${label}\\s*(?::|=)?\\s*(\\d+)`, "i"));
      if (!said && tally(key, label)) add("ERROR", "summary-counts", `summary is missing the count for ${label}`);
      if (said && Number(said[1]) !== tally(key, label)) add("ERROR", "summary-counts", `summary says ${label} ${said[1]}, the table has ${tally(key, label)}`);
    }
  }
  const flagCounts = new Map(RISK_FLAGS.map((flag) => [flag, [...flagsById.values()].filter((flags) => flags.includes(flag)).length]));
  const flagSummary = summary.match(/Risk flags:\s*([^\n.]*)/i)?.[1] || "";
  const flagged = [...flagCounts.entries()].filter(([, count]) => count);
  if (flagSummary.trim() && !/^none\s*$/i.test(flagSummary.trim())) {
    const entries = flagSummary.trim().split(/\s*;\s*/);
    const names = entries.map((entry) => entry.match(/^([a-z-]+)\s*=\s*\d+$/i)?.[1]);
    if (names.some((name) => !RISK_FLAGS.includes(name)) || new Set(names).size !== names.length) add("ERROR", "risk-flags", "summary Risk flags must contain unique allowed flag=count entries separated by semicolons");
  }
  if (!flagged.length && !/^none\s*$/i.test(flagSummary.trim())) add("ERROR", "risk-flags", "summary must state Risk flags: none when no rows have risk flags");
  for (const [flag, count] of flagCounts) {
    const said = flagSummary.match(new RegExp(`(?:^|[;\\s])${flag}\\s*=\\s*(\\d+)\\b`, "i"));
    if ((count && !said) || (said && Number(said[1]) !== count)) add("ERROR", "risk-flags", `summary count for ${flag} must be ${count}`);
  }
  if (flagged.length) add("WARN", "risk-flags-review", `uncapped model-observed risk flags: ${flagged.map(([flag, count]) => `${flag}=${count}`).join("; ")}; inspect every flagged row regardless of Priority`);
  for (const [id, flags] of flagsById) if (flags.length && !new RegExp(`(?:#|\\bClaim\\s+)${id}\\b`, "i").test(summary)) add("ERROR", "risk-flags", `summary must surface flagged claim ${id} by #N or Claim N`);
  const overclaim = summary.match(/(?<!un|not |nor )\b(verified|confirmed|certified|defensible)\b/i);
  if (overclaim) add("WARN", "verdict-wording", `summary uses "${overclaim[0]}"; nothing has been checked by a person yet`);

  // Publishable copy rules.
  const copy = sec["Rewritten draft"] || "";
  const leaks = [...new Set((copy.match(INTERNAL) || []).map((x) => x.toLowerCase()))];
  if (leaks.length) add("ERROR", "internal-notes", `rewritten draft contains internal-record phrase(s): ${leaks.map((x) => `"${x}"`).join(", ")}`);

  const source = `${supplied}\n${profile}`;
  const known = numbers(source);
  const novel = [...numbers(copy)].filter((n) => !known.has(n));
  if (novel.length) add("WARN", "new-numbers", `rewritten draft has number(s) not in the draft or profile: ${novel.join(", ")}. Fine only if each is a recomputation from the draft's own stated inputs.`);

  const had = new Set((source.match(STRONG) || []).map((w) => w.toLowerCase()));
  const strong = [...new Set((copy.match(STRONG) || []).map((w) => w.toLowerCase()))].filter((w) => !had.has(w));
  if (strong.length) add("ERROR", "new-strong-words", `rewritten draft uses strong wording absent from the draft and profile: ${strong.join(", ")}`);
  const { annotations, issues: annotationIssues } = unverifiedAnnotations(copy);
  for (const issue of annotationIssues) add("ERROR", "bracket-task", issue);
  let activeCopy = "", offset = 0;
  for (const annotation of annotations) {
    activeCopy += copy.slice(offset, annotation.start);
    offset = annotation.end;
  }
  activeCopy += copy.slice(offset);
  if (STRONG.test(activeCopy)) add("WARN", "strong-wording-review", "strong wording remains outside an UNVERIFIED annotation; compare the exact claim with its evidence, even if the same word appeared elsewhere in the supplied text");
  STRONG.lastIndex = 0;

  for (const annotation of annotations) {
    const key = (annotation.content.match(/^["“]((?:\\.|[^"”])*)["”]/)?.[1] || annotation.content.split(";")[0]).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
    const matching = rows.filter((r) => [r["Claim (verbatim)"], r["Safe rewrite"]].some((cell) => (cell || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").includes(key)));
    if (!key || !matching.some((r) => taskIds.has(r["#"]))) add("ERROR", "bracket-task", `UNVERIFIED annotation has no matching register row and referenced task: ${annotation.raw}`);
  }

  // Every sentence of the draft should still be visible in the rewrite, rewritten or quoted in a bracket.
  const copyWords = words(copy);
  const sentences = draft.split("\n").filter((l) => !/^\s*SYNTHETIC/i.test(l)).join("\n").replace(/^#+\s*/gm, "").split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
  for (const s of sentences) {
    const w = words(s);
    if (w.size < 3) continue;
    const kept = [...w].filter((x) => copyWords.has(x)).length / w.size;
    if (kept < 0.5) add("WARN", "sentence-kept", `may be dropped or replaced in the rewrite: "${s.slice(0, 90)}"`);
  }
  return f;
}

export function report(findings) {
  if (!findings.length) return "No automated findings. This does not mean the pack is right; it means these mechanical checks passed.";
  return findings.map((x) => `${x.level} [${x.rule}] ${x.message}`).join("\n");
}

function main() {
  const { run, out, help } = parseOptions(process.argv.slice(2), {
    flags: { "--help": "help", "-h": "help" },
    opts: { "--run": "run", "--out": "out" },
  });
  if (help) {
    console.log(`Check a Claim Audit run.

  node claim-audit/check.mjs [--run <id>] [--out pack.md]
  node claim-audit/check.mjs --help

Validates the final safe-rewrite pack of a saved Claim Audit run against
its mechanical rules, draft, and supplied context.`);
    return;
  }
  const state = loadRun(run);
  const last = state.stages.at(-1);
  if (!last) throw new Error(`Run ${state.id} has no stages, so it has no Claim Audit pack to check.`);
  if (last.status !== "complete") throw new Error(`Run ${state.id} has not finished (last stage is ${last.status}); resume it first.`);
  if (last.id !== "safe-rewrite") throw new Error(`Run ${state.id} ends with "${last.id}", not "safe-rewrite", so it is not a Claim Audit pack. Pass --run <id> for a Claim Audit run.`);
  const findings = checkPack(last.result, state.brief, state.profile || "", { supplied: ownerContext(state), priorRegisters: authoritativeRegisters(state.stages) });
  const text = report(findings);
  console.log(`Run ${state.id}\n${text}`);
  if (out) {
    const file = writePack(out, `<!-- EE run: ${state.id} -->\n${last.result}\n\n## Automated checks\n\n${findings.length ? findings.map((x) => `- ${x.level} [${x.rule}] ${x.message}`).join("\n") : text}\n`);
    console.log(`Wrote ${file}`);
  }
  process.exitCode = findings.some((x) => x.level === "ERROR") ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message || error); process.exit(1); }
}
