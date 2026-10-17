#!/usr/bin/env node
// Deterministic checks on a finished illustrative example. No model call; same answer every time.
// It tests the rules the cards promise, not whether the example is any good.
//
//   node examples/check.mjs                 # check the most recent saved run
//   node examples/check.mjs --run <id>      # a specific run
//   node examples/check.mjs --out ex.md     # also write the final example with the findings appended
//
// Exit code 1 on any ERROR. WARN means "look at this".
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadRun } from "../console/console.mjs";
import { parseOptions } from "../scripts/llm.mjs";
import { sections } from "../claim-audit/check.mjs";
import { INTERNAL, STRONG, numbers } from "../claim-audit/check.mjs";

export const LABEL = "Illustrative example — not a real customer or result.";
// Praise or typicality that reads as a real-customer claim.
const REAL_CLAIM = /\b(customers like you|most people|most customers|typically|on average|results? (?:vary|may)|case study|testimonial)\b/i;
// Terms and facts a business would have to supply; a model adding them is inventing business policy.
const BUSINESS_FACT = /\b(?:(?:with)?(?:out|no) (?:any )?(?:commitment|obligation|contract|lock-?in)s?|cancel(?:lation)? (?:any ?time|for free)|free (?:trial|delivery|shipping|samples?)|money-back|satisfaction|fresh daily|locally sourced|organic|hand-?made|hand-?crafted|family[- ]owned|since (?:19|20)\d\d)\b/gi;
// A quotation with an attribution, in either order.
const ATTRIBUTED = /["“][^"”\n]{12,}["”]\s*[,—–-]*\s*(?:said|says|says\b|[A-Z][a-z]+\b)|(?:said|says)[^"“\n]{0,30}["“][^"”\n]{12,}["”]/;

export function checkExample(pack, brief = "", profile = "", framing = "") {
  const f = [];
  const add = (level, rule, message) => f.push({ level, rule, message });
  const sec = sections(pack);
  for (const name of ["Final example", "Changes made", "Checks"]) if (!(name in sec)) add("ERROR", "sections", `missing section: ${name}`);
  const text = sec["Final example"] || "";
  if (!text) return f;

  const first = text.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 2).join(" ");
  if (!first.includes(LABEL)) add("ERROR", "label", `the example must start with the exact label line: ${LABEL}`);
  if (!/\b(SUPPLIED|ASSUMED)\b/.test(text)) add("ERROR", "number-basis", "no figure is marked SUPPLIED or ASSUMED");
  if (ATTRIBUTED.test(text)) add("ERROR", "quotation", "the example contains an attributed quotation");
  const real = text.match(REAL_CLAIM);
  if (real) add("ERROR", "real-claim-wording", `wording that reads as a real-customer claim: "${real[0]}"`);
  const leaks = [...new Set((text.match(INTERNAL) || []).map((x) => x.toLowerCase()))];
  if (leaks.length) add("ERROR", "internal-notes", `internal-record phrase(s) in the example: ${leaks.join(", ")}`);

  const source = `${brief}\n${profile}\n${framing}`;
  const had = new Set((source.match(STRONG) || []).map((w) => w.toLowerCase()));
  const strong = [...new Set((text.match(STRONG) || []).map((w) => w.toLowerCase()))].filter((w) => !had.has(w));
  if (strong.length) add("ERROR", "strong-words", `strong wording absent from the brief, profile, and framing: ${strong.join(", ")}`);

  const supplied = source.toLowerCase();
  const invented = [...new Set((text.match(BUSINESS_FACT) || []).map((x) => x.toLowerCase()))].filter((x) => !supplied.includes(x));
  if (invented.length) add("ERROR", "business-facts", `states term(s) about the business that nothing supplied: ${invented.map((x) => `"${x}"`).join(", ")}`);

  const known = numbers(source);
  const novel = [...numbers(text)].filter((n) => !known.has(n));
  if (novel.length) add("WARN", "new-numbers", `number(s) not in the brief, profile, or framing: ${novel.join(", ")}. Fine only if each is arithmetic on the stated figures; check them.`);

  // The card promises these parts; a missing one means the example is not ready to hand out as is.
  const parts = [[/\bHeadline\b/i, "a headline"], [/(?:^|\n)\s*Alt:[\s\S]*\n\s*Alt:/i, "two alternate headlines"], [/what would change this/i, "a 'What would change this' part"], [/next step/i, "a next step"], [/the numbers/i, "a 'The numbers' box"]];
  for (const [re, name] of parts) if (!re.test(text)) add("WARN", "structure", `the example is missing ${name}`);

  if (/\bFail\b/.test(sec.Checks || "")) add("WARN", "challenge-failed", "the challenge step reported a failed check; read the Checks section");
  return f;
}

export const report = (findings) =>
  findings.length ? findings.map((x) => `${x.level} [${x.rule}] ${x.message}`).join("\n")
    : "No automated findings. These checks are mechanical: they cannot judge whether the example is persuasive or fair.";

function main() {
  const { run, out } = parseOptions(process.argv.slice(2), { opts: { "--run": "run", "--out": "out" } });
  const state = loadRun(run);
  const last = state.stages.at(-1);
  if (last.status !== "complete") throw new Error(`Run ${state.id} has not finished (last stage is ${last.status}); resume it first.`);
  const findings = checkExample(last.result, state.brief, state.profile || "", state.stages[0]?.result || "");
  console.log(`Run ${state.id}\n${report(findings)}`);
  if (out) {
    writeFileSync(out, `${last.result}\n\n## Automated checks\n\n${findings.length ? findings.map((x) => `- ${x.level} [${x.rule}] ${x.message}`).join("\n") : report(findings)}\n`);
    console.log(`Wrote ${out}`);
  }
  process.exitCode = findings.some((x) => x.level === "ERROR") ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message || error); process.exit(1); }
}
