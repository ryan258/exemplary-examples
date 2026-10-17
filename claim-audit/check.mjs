#!/usr/bin/env node
// Deterministic checks on a finished Claim Audit pack. The model's output varies run to run; these
// checks do not. They test the pack against the cards' own rules and against the draft and profile,
// and flag what a person should look at. They cannot tell whether a claim is TRUE.
//
// Usage:
//   node claim-audit/check.mjs                      # check the most recent saved run
//   node claim-audit/check.mjs --run <id>           # a specific run in console/runs/
//   node claim-audit/check.mjs --out pack.md        # also write the pack with the findings appended
//
// Exit code 1 when any ERROR is found (the pack breaks a card rule); WARN means "look at this".
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadRun } from "../console/console.mjs";
import { parseOptions } from "../scripts/llm.mjs";

const SECTIONS = ["Summary", "Claim register", "Open verification tasks", "Rewritten draft", "Limits"];
const COLUMNS = ["#", "Claim (verbatim)", "Kind", "Class", "Why", "Evidence needed", "Cannot support", "Check by", "Priority", "Safe rewrite"];
const KINDS = ["statistic", "comparison-or-ranking", "cause-and-effect", "testimonial-or-endorsement", "forecast-or-promise", "factual-description", "price-or-offer"];
const CLASSES = ["Sourced fact", "Client-provided fact", "Calculation", "Inference", "Modeled scenario", "Satirical fiction", "UNPLACED"];
const CHECKS = ["open-source", "recompute", "ask-owner", "get-permission", "remove-or-reframe"];
const PRIORITIES = ["High", "Medium", "Low"];
// Internal-record vocabulary that must stay in the register, never in publishable copy.
export const INTERNAL = /\b(on file|per the profile|supplied copy|billing export|membership export|price sheet|client-provided|client-supplied)\b|\bowner:/gi;
// Words that make a claim stronger. If the rewrite uses one, the draft or profile must already have it.
export const STRONG = /\b(guarantee[ds]?|proven|clinically|cures?|cured|best|awards?|winner|certified|risk-free|leading)\b|#1/gi;
const STOP = new Set("that this with from have your their will been were which about into than then them they what when where would could also each more most only over such very like just".split(" "));

const plain = (s) => s.replace(/[*`]/g, "").trim();
const words = (s) => new Set((s.toLowerCase().match(/[a-z]{4,}/g) || []).filter((w) => !STOP.has(w)));
export const numbers = (s) => new Set((s.match(/\$?\d[\d,]*(?:\.\d+)?/g) || []).map((n) => n.replace(/[$,]/g, "").replace(/\.$/, "")));

// Split a pack into its "## " sections by exact heading.
export function sections(pack) {
  const out = {};
  let name = null;
  for (const line of pack.split(/\r?\n/)) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) { name = h[1]; out[name] = []; } else if (name) out[name].push(line);
  }
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.join("\n").trim()]));
}

export function registerRows(text) {
  const lines = text.split("\n").filter((l) => l.trim().startsWith("|"));
  const cells = (l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => plain(c));
  const [head, , ...body] = lines;
  const header = head ? cells(head) : [];
  return { header, rows: body.map((l) => Object.fromEntries(cells(l).map((c, i) => [header[i] ?? `col${i}`, c]))) };
}

export function checkPack(pack, draft, profile = "") {
  const f = [];
  const add = (level, rule, message) => f.push({ level, rule, message });
  const sec = sections(pack);
  const missing = SECTIONS.filter((s) => !(s in sec));
  if (missing.length) add("ERROR", "sections", `missing section(s): ${missing.join(", ")}`);
  const { header, rows } = registerRows(sec["Claim register"] || "");
  const lack = COLUMNS.filter((c) => !header.includes(c));
  if (lack.length) add("ERROR", "columns", `register is missing column(s): ${lack.join(", ")}`);
  if (!rows.length) add("ERROR", "rows", "the claim register has no rows");

  for (const r of rows) {
    const id = `row ${r["#"]}`;
    if (!KINDS.includes(r.Kind)) add("ERROR", "kind", `${id}: Kind "${r.Kind}" is not an allowed value`);
    if (!CLASSES.includes(r.Class)) add("ERROR", "class", `${id}: Class "${r.Class}" is not one of the six classes or UNPLACED`);
    if (!CHECKS.includes(r["Check by"])) add("ERROR", "check-by", `${id}: Check by "${r["Check by"]}" is not an allowed value`);
    if (!PRIORITIES.includes(r.Priority)) add("ERROR", "priority", `${id}: Priority "${r.Priority}" is not High, Medium, or Low`);
    if (r.Priority === "Low" && /^(forecast-or-promise|testimonial-or-endorsement)$/.test(r.Kind)) add("ERROR", "never-low", `${id}: a ${r.Kind} claim is rated Low`);
  }

  const cap = Math.ceil(rows.length / 3);
  const high = rows.filter((r) => r.Priority === "High").length;
  if (rows.length && high > cap) add("ERROR", "high-cap", `${high} rows are High; the cap is ${cap} (one third of ${rows.length}, rounded up)`);

  // Summary counts must match the table, when the summary states them.
  const summary = sec.Summary || "";
  const tally = (key, label) => rows.filter((r) => r[key] === label).length;
  for (const [key, labels] of [["Class", CLASSES], ["Priority", PRIORITIES]]) {
    for (const label of labels) {
      const said = summary.match(new RegExp(`${label}\\D{0,3}(\\d+)`, "i"));
      if (said && Number(said[1]) !== tally(key, label)) add("ERROR", "summary-counts", `summary says ${label} ${said[1]}, the table has ${tally(key, label)}`);
    }
  }
  const overclaim = summary.match(/(?<!un|not |nor )\b(verified|confirmed|certified|defensible)\b/i);
  if (overclaim) add("WARN", "verdict-wording", `summary uses "${overclaim[0]}"; nothing has been checked by a person yet`);

  // Publishable copy rules.
  const copy = sec["Rewritten draft"] || "";
  const leaks = [...new Set((copy.match(INTERNAL) || []).map((x) => x.toLowerCase()))];
  if (leaks.length) add("ERROR", "internal-notes", `rewritten draft contains internal-record phrase(s): ${leaks.map((x) => `"${x}"`).join(", ")}`);

  const source = `${draft}\n${profile}`;
  const known = numbers(source);
  const novel = [...numbers(copy)].filter((n) => !known.has(n));
  if (novel.length) add("WARN", "new-numbers", `rewritten draft has number(s) not in the draft or profile: ${novel.join(", ")}. Fine only if each is a recomputation from the draft's own stated inputs.`);

  const had = new Set((source.match(STRONG) || []).map((w) => w.toLowerCase()));
  const strong = [...new Set((copy.match(STRONG) || []).map((w) => w.toLowerCase()))].filter((w) => !had.has(w));
  if (strong.length) add("ERROR", "new-strong-words", `rewritten draft uses strong wording absent from the draft and profile: ${strong.join(", ")}`);

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
  const { run, out } = parseOptions(process.argv.slice(2), { opts: { "--run": "run", "--out": "out" } });
  const state = loadRun(run);
  const last = state.stages.at(-1);
  if (last.status !== "complete") throw new Error(`Run ${state.id} has not finished (last stage is ${last.status}); resume it first.`);
  const findings = checkPack(last.result, state.brief, state.profile || "");
  const text = report(findings);
  console.log(`Run ${state.id}\n${text}`);
  if (out) {
    writeFileSync(out, `${last.result}\n\n## Automated checks\n\n${findings.length ? findings.map((x) => `- ${x.level} [${x.rule}] ${x.message}`).join("\n") : text}\n`);
    console.log(`Wrote ${out}`);
  }
  process.exitCode = findings.some((x) => x.level === "ERROR") ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message || error); process.exit(1); }
}
