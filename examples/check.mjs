#!/usr/bin/env node
// Deterministic checks on a finished illustrative example. No model call; same answer every time.
// It tests the rules the cards promise, not whether the example is any good.
//
//   node examples/check.mjs                 # check the most recent saved run
//   node examples/check.mjs --run <id>      # a specific run
//   node examples/check.mjs --out ex.md     # also write the final example with the findings appended
//                                           # (a relative name lands in console/runs/, which git ignores)
//
// Exit code 1 on any ERROR. WARN means "look at this".
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadRun, outPath, ownerContext } from "../console/console.mjs";
import { parseOptions } from "../scripts/llm.mjs";
import { INTERNAL, STRONG, numbers, sourceNumbers, checkedSections, plain, normalized, parseTable, splitSourceNotes } from "../scripts/pack-checks.mjs";

export const LABEL = "Illustrative example — not a real customer or result.";
// Praise or typicality that reads as a real-customer claim.
const REAL_CLAIM = /\b(customers like you|most people|most customers|typically|on average|results? (?:vary|may)|case study|testimonial)\b/i;
// Terms and facts a business would have to supply; a model adding them is inventing business policy.
const BUSINESS_FACT = /\b(?:(?:with)?(?:out|no) (?:any )?(?:commitment|obligation|contract|lock-?in)s?|cancel(?:lation)? (?:any ?time|for free)|free (?:trial|delivery|shipping|samples?)|money-back|satisfaction|fresh daily|locally sourced|organic|hand-?made|hand-?crafted|family[- ]owned|since (?:19|20)\d\d)\b/gi;
// A quotation with an attribution, in either order.
const ATTRIBUTED = /["“][^"”\n]{12,}["”]\s*[,—–-]*\s*(?:said|says|says\b|[A-Z][a-z]+\b)|(?:said|says)[^"“\n]{0,30}["“][^"”\n]{12,}["”]/;
export const CHECK_ITEMS = ["Label line present", "Every number traced to the assumptions", "Arithmetic recomputed", "No attributed quotation or real name", "No guarantee or superlative", "Limits and break-even stated", "No invented facts about the business"];
const NOTE_COLUMNS = ["Item", "Value", "Basis", "Source or working"];
const hasFormula = (text) => text.includes("=") && /[\d)][ \t]*[+\-*/×÷−][ \t]*[($\d]/.test(text);

export function authoritativeFraming(stages) {
  const writer = stages.find((stage) => stage.id === "write-example");
  if (writer?.edited === true) {
    const accepted = splitSourceNotes(writer.result);
    return accepted.count === 1 ? accepted.notes : "";
  }
  return stages.find((stage) => stage.id === "frame-example")?.result || "";
}

function sourceTable(text, add, label, tableOnly = false) {
  const parsed = parseTable(text);
  if (!parsed.rows.length || JSON.stringify(parsed.header) !== JSON.stringify(NOTE_COLUMNS)) add("ERROR", "source-notes", `${label} needs the Item, Value, Basis, Source or working table`);
  for (const issue of parsed.issues) add("ERROR", "source-notes", `${label}: ${issue}`);
  if (tableOnly && text.split(/\r?\n/).some((line) => line.trim() && !line.trim().startsWith("|"))) add("ERROR", "source-notes", `${label} must contain only its provenance table; customer copy belongs before ### Source notes`);
  return parsed;
}

export function checkExample(pack, brief = "", profile = "", framing = "") {
  const f = [];
  const add = (level, rule, message) => f.push({ level, rule, message });
  const sec = checkedSections(pack, ["Final example", "Changes made", "Checks"], add);
  const body = splitSourceNotes(sec["Final example"] || "");
  const text = body.copy;
  if (body.count !== 1) add("ERROR", "source-notes", "Final example needs exactly one unfenced ### Source notes heading after the customer-facing copy");
  const retained = sourceTable(body.notes, add, "retained source notes", true);
  if (framing) {
    const expected = sourceTable(framing, add, "accepted framing");
    const values = (rows) => rows.map((row) => NOTE_COLUMNS.map((column) => normalized(row[column] || "")));
    if (JSON.stringify(values(expected.rows)) !== JSON.stringify(values(retained.rows))) add("ERROR", "source-notes", "retained table differs from the accepted framing table; preserve accepted owner corrections and all provenance cells");
  }

  const first = text.split("\n").find((line) => line.trim())?.trim();
  if (first !== LABEL) add("ERROR", "label", `the example must start with the exact label line: ${LABEL}`);
  if (ATTRIBUTED.test(text)) add("ERROR", "quotation", "the example contains an attributed quotation");
  const real = text.match(REAL_CLAIM);
  if (real) add("ERROR", "real-claim-wording", `wording that reads as a real-customer claim: "${real[0]}"`);
  const leaks = [...new Set((text.match(INTERNAL) || []).map((x) => x.toLowerCase()))];
  if (leaks.length) add("ERROR", "internal-notes", `internal-record phrase(s) in the example: ${leaks.join(", ")}`);

  // Framing is model output, not evidence that the owner supplied a policy or
  // claim. Strong words are forbidden by the example card even when supplied.
  const source = `${brief}\n${profile}`;
  const strong = [...new Set((text.match(STRONG) || []).map((w) => w.toLowerCase()))];
  if (strong.length) add("ERROR", "strong-words", `the example contains forbidden strong wording: ${strong.join(", ")}`);

  const supplied = source.toLowerCase();
  const terms = [...new Set((text.match(BUSINESS_FACT) || []).map((x) => x.toLowerCase()))];
  const invented = terms.filter((term) => !supplied.includes(term));
  if (invented.length) add("ERROR", "business-facts", `states term(s) about the business that nothing supplied: ${invented.map((x) => `"${x}"`).join(", ")}`);
  const present = terms.filter((term) => supplied.includes(term));
  if (present.length) add("WARN", "business-facts-review", `compare exact affirmative owner wording for ${present.join(", ")}; a phrase appearing in supplied text, including a prohibition, is not permission to claim it`);

  // Every numeric value must have its own stated basis in the numbers box.
  // Derived results require a visible formula; arithmetic itself is still a
  // human check. Values elsewhere in framing cannot approve business facts.
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => /^\s*(?:#{3,6}\s+)?(?:\*\*)?The numbers\b/i.test(line));
  const following = start < 0 ? [] : lines.slice(start + 1);
  const end = following.findIndex((line) => /what would change this|^\s*(?:\*\*)?Next step\b/i.test(line));
  const box = end < 0 ? following : following.slice(0, end);
  const bases = new Set();
  const ownerNumbers = sourceNumbers(source);
  const noteBases = new Map();
  for (const [index, row] of retained.rows.entries()) {
    for (const column of NOTE_COLUMNS) if (!/[\p{L}\p{N}]/u.test(row[column] || "")) add("ERROR", "source-notes", `source row ${index + 1} has empty ${column}`);
    if (!["SUPPLIED", "ASSUMED", "DERIVED"].includes(row.Basis)) add("ERROR", "source-notes", `source row ${index + 1} has invalid Basis`);
    const values = numbers(row.Value || "");
    if (values.size !== 1) add("ERROR", "source-notes", `source row ${index + 1} needs one numeric value in Value`);
    for (const value of values) {
      const bases = noteBases.get(value) || new Set();
      bases.add(row.Basis);
      noteBases.set(value, bases);
      if (row.Basis === "SUPPLIED" && !ownerNumbers.has(value)) add("ERROR", "source-notes", `source value ${value} is marked SUPPLIED but absent from owner input`);
    }
    if (row.Basis === "SUPPLIED") {
      const quotes = [...(row["Source or working"] || "").matchAll(/["“]([^"”]+)["”]/g)].map((match) => match[1]);
      if (!quotes.length || quotes.some((quote) => !normalized(source).includes(normalized(quote))) || [...values].some((value) => !sourceNumbers(quotes.join("\n")).has(value))) add("ERROR", "source-notes", `source row ${index + 1} must quote original owner wording containing its supplied value`);
    }
    if (row.Basis === "DERIVED" && !hasFormula(row["Source or working"] || "")) add("ERROR", "source-notes", `source row ${index + 1} needs DERIVED arithmetic working`);
  }
  for (const line of box) {
    const basis = line.match(/\b(SUPPLIED|ASSUMED|DERIVED)\b/);
    if (!basis) continue;
    const values = numbers(line.slice(0, basis.index));
    if (!values.size) add("ERROR", "number-basis", `basis line has no numeric value before ${basis[0]}: ${line.trim()}`);
    for (const value of values) {
      bases.add(value);
      if (!noteBases.get(value)?.has(basis[0])) add("ERROR", "number-basis", `${value} ${basis[0]} has no matching retained provenance entry`);
      if (basis[0] === "SUPPLIED" && !ownerNumbers.has(value)) add("ERROR", "number-basis", `${value} is marked SUPPLIED but is absent from the owner-supplied brief/profile`);
    }
    if (basis[0] === "DERIVED" && !hasFormula(line)) add("ERROR", "number-basis", `DERIVED value needs an explicit arithmetic formula: ${line.trim()}`);
  }
  const unmarked = [...numbers(text)].filter((value) => !bases.has(value));
  if (!bases.size || unmarked.length) add("ERROR", "number-basis", `every figure needs a numbers-box entry marked SUPPLIED, ASSUMED, or DERIVED with a formula; missing: ${unmarked.join(", ") || "all entries"}`);
  const known = numbers(`${source}\n${framing}`);
  const novel = [...numbers(text)].filter((n) => !known.has(n));
  if (novel.length) add("WARN", "new-numbers", `number(s) not in the brief, profile, or framing: ${novel.join(", ")}. Fine only if each is arithmetic on the stated figures; check them.`);

  // The card promises these parts; a missing one means the example is not ready to hand out as is.
  const parts = [[/\bHeadline\b/i, "a headline"], [/(?:^|\n)\s*Alt:[\s\S]*\n\s*Alt:/i, "two alternate headlines"], [/what would change this/i, "a 'What would change this' part"], [/next step/i, "a next step"], [/the numbers/i, "a 'The numbers' box"]];
  for (const [re, name] of parts) if (!re.test(text)) add("WARN", "structure", `the example is missing ${name}`);

  const seen = new Set();
  for (const line of (sec.Checks || "").split(/\r?\n/).filter((line) => line.trim())) {
    const bullet = line.match(/^\s*[-*]\s+(.+)$/)?.[1];
    const item = bullet && plain(bullet).match(/^(.+?):\s*(Pass|Fail)\s*[-—–:]\s*(.+)$/);
    if (!item || !CHECK_ITEMS.includes(item[1]) || seen.has(item[1])) {
      add("ERROR", "checklist", `expected one named check with Pass/Fail and a reason: ${line.trim()}`);
      continue;
    }
    seen.add(item[1]);
    if (item[2] === "Fail") add("ERROR", "challenge-failed", `${item[1]} failed: ${item[3]}`);
  }
  for (const name of CHECK_ITEMS) if (!seen.has(name)) add("ERROR", "checklist", `missing named check: ${name}`);
  return f;
}

export const report = (findings) =>
  findings.length ? findings.map((x) => `${x.level} [${x.rule}] ${x.message}`).join("\n")
    : "No automated findings. These checks are mechanical: they cannot judge whether the example is persuasive or fair.";

function main() {
  const { run, out, help } = parseOptions(process.argv.slice(2), {
    flags: { "--help": "help", "-h": "help" },
    opts: { "--run": "run", "--out": "out" },
  });
  if (help) {
    console.log(`Check an Illustrative Examples run.

  node examples/check.mjs [--run <id>] [--out pack.md]
  node examples/check.mjs --help

Validates the final challenge-example deliverable of a saved Illustrative
Examples run against its framing, brief, and numeric rules.`);
    return;
  }
  const state = loadRun(run);
  const last = state.stages.at(-1);
  if (last.status !== "complete") throw new Error(`Run ${state.id} has not finished (last stage is ${last.status}); resume it first.`);
  if (last.id !== "challenge-example") throw new Error(`Run ${state.id} ends with "${last.id}", not "challenge-example", so it is not an Illustrative Examples run. Pass --run <id> for an examples run.`);
  const framing = authoritativeFraming(state.stages);
  if (state.stages.find((stage) => stage.id === "write-example")?.edited === true && !framing) throw new Error("The accepted writer edit has no ### Source notes table; restore its provenance before checking the final example.");
  const findings = checkExample(last.result, ownerContext(state), state.profile || "", framing);
  console.log(`Run ${state.id}\n${report(findings)}`);
  if (out) {
    const file = outPath(out);
    writeFileSync(file, `<!-- EE run: ${state.id} -->\n${last.result}\n\n## Automated checks\n\n${findings.length ? findings.map((x) => `- ${x.level} [${x.rule}] ${x.message}`).join("\n") : report(findings)}\n`, { mode: 0o600 });
    console.log(`Wrote ${file}`);
  }
  process.exitCode = findings.some((x) => x.level === "ERROR") ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message || error); process.exit(1); }
}
