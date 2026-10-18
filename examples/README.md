# Illustrative examples for small businesses

Make an honest, vivid example a small business can show its customers: a made-up but plausible customer, a short story, and the arithmetic behind it, always labeled as an example and never posing as a real result. This is the project's original joke turned useful: the perfect example, built in the open.

Scope: [`../SCOPE-DECISION-CLAIM-AUDIT.md`](../SCOPE-DECISION-CLAIM-AUDIT.md#amendment-illustrative-examples) (illustrative only: no real customers, no real results).

> Use only public or non-confidential facts (D0/D1). Send them only through the provider row in the [policy register](../operations/AI-DATA-POLICY.md) (OpenRouter, `tencent/hy3`, your own use); its retention terms are unknown. If a small business gives you facts, make sure they are ones it is comfortable being public.

## Make one

1. Write a short brief: what the business sells, who buys it, and **the hesitation the example should answer** ("I'd never use it enough to be worth it"). Add any real facts the business can supply (prices, hours, quantities). Copy [`_samples/brief-01.md`](_samples/brief-01.md).
2. Optional profile: voice and claims policy. Copy [`_samples/profile-01.example.md`](_samples/profile-01.example.md).

```bash
node --env-file=.env console/console.mjs --dir examples --all \
  --profile examples/_samples/profile-01.example.md \
  --idea-file examples/_samples/brief-01.md
node examples/check.mjs --out my-example.md   # written to console/runs/my-example.md (gitignored)
```

About one cent and a minute or two per example on the model used in testing. Preview without cost: add `--dry-run` to the first command.

| Step | Card | What it does |
| --- | --- | --- |
| 1 | `frame-example` | Decides the decision, persona, and table: inputs marked `SUPPLIED` or `ASSUMED`, results marked `DERIVED` with formulas; works out the result, break-even, and sensitivity |
| 2 | `write-example` | Writes the customer-facing example under a fixed label line |
| 3 | `challenge-example` | A skeptical re-read that fixes misleading wording, recomputes figures, and lists a seven-point pass/fail check |

The runner opens your editor between cards. Edit the framing there: the numbers and the break-even are the part to get right before any copy exists.

## What makes it honest

- The first line is always `Illustrative example — not a real customer or result.`
- Every distinct numeric value has a numbers-box entry: `SUPPLIED` from the owner's original brief, answers, or profile; `ASSUMED` as a labeled scenario input; or `DERIVED` with its formula from listed inputs. Include break-even and sensitivity values. A generated framing never turns an assumption into a supplied fact. Nothing is presented as a statistic, and nothing cites a study, survey, award, or competitor.
- The example states its **break-even**: where the offer stops being worth it. Customers trust an example that says so.
- No quotations, testimonials, surnames, or real businesses.
- The model may not add facts about the business that the brief did not give ("no commitment", "cancel anytime", "fresh daily"). In the first test it did exactly that.

## The checker

`check.mjs` runs after the model and gives the same answer every time.

| Level | What it flags |
| --- | --- |
| **ERROR** (exit 1) | Empty/missing/duplicate/unexpected sections, preamble before the first section, or an unclosed fence; missing/duplicate Source notes boundary, malformed/incomplete provenance table, unstructured notes prose, source-table changes against accepted framing, or invalid SUPPLIED quotations/DERIVED working; the exact label absent from the first nonempty customer-facing line; any numeric value without a matching SUPPLIED/ASSUMED/DERIVED numbers-box and provenance entry, a SUPPLIED value absent from the owner brief/answers/profile, or DERIVED line without arithmetic working; an attributed quotation in customer copy; real-customer wording ("most people", "customers like you", "case study"); forbidden strong words ("guaranteed", "best", "leading", "#1") in customer copy even if they appear in the input; business terms the owner did not supply ("without any commitment", "free trial", "locally sourced"); missing/duplicate/unknown challenge checks, a missing outcome/reason, or any Fail |
| **WARN** | Numeric values absent from brief, profile, or framing (only acceptable as a shown recomputation); a missing headline, alternates, "What would change this", numbers heading, or next step; business terms also present in owner text, requiring comparison with the exact affirmative wording because a prohibition is not permission |

A clean result means these mechanical rules held. It does not establish that the example is persuasive or fair, that a supplied value uses the right units or context, that a scenario assumption is sensible, or that the arithmetic is correct. Decimal comparison treats equivalent spellings such as `$7` and `$7.00` alike without floating-point rounding. The checker recognizes formulas; the owner still recomputes them. The model's seven Pass results are its self-check, not independent acceptance.

Use exactly `## Final example`, `## Changes made`, and `## Checks`, with `###` for headings inside them. Inside Final example, finish the customer-facing copy before the exact nested `### Source notes` heading. After that heading, include only the complete `Item`, `Value`, `Basis`, `Source or working` table; no additional customer text or prose. Each Value holds one numeric value with its unit; SUPPLIED working quotes exact owner wording, ASSUMED working explains the scenario choice, and DERIVED working shows its formula. Literal table pipes use `\|`. Simple source number words from zero through ninety-nine can supply their numeric equivalent. Larger quantities, worded fractions/decimals, and ambiguous joined number lists need an explicit numeric owner input: the checker does not promote fragments of "one hundred", "twenty point five", or "one and two" to supplied scalar values. A supported scalar followed by ordinary prose, such as "four and under", remains usable.

The checker scans customer-facing copy for claim wording and validates source notes separately as provenance. Faithful notes quoting "typically", "price sheet", or prohibited source wording do not become customer-facing assertions. Fenced lookalikes of the Source notes heading remain customer text and cannot hide claims. The retained table must match the accepted framing; when the owner edited the writer stage, that stage's accepted notes replace the original framing as the authoritative table. An unedited model revision cannot reset that baseline. Its numbers can support scenario tracing, but its claims cannot approve new business facts.

Each check uses `- Label line present: Pass — reason` (or `Fail`) with its exact card-defined name. The seven model checks concern the customer copy and the validity of its provenance; the owner still checks the evidence and arithmetic.

Exported `--out` names must end in `.md` and use an existing parent directory. Files include a run-ownership marker for the owner's finish command and use atomic replacement with private permissions. File symlinks are rejected; a relative destination's real parent must stay within the run directory. The example and all findings are retained together.

## Known gaps

From three runs on two fictional businesses with one model (`tencent/hy3`), 2026-10-17.

- **Arithmetic held in the recorded runs; provenance was incomplete.** The recorded sums and break-evens were correct (for the bookkeeper, $250 ÷ $90 = 2.78 billable hours). Those runs did not give every output value an explicit basis-marked entry. Current cards/checker require SUPPLIED/ASSUMED inputs and DERIVED outputs with formulas; that strengthened contract has not been measured on fresh model output. Derived values still require the owner's recomputation.
- **It invented a business term once.** The first run told customers to ask about pickup "without any commitment", which the brief never said, and the challenge step passed it. The cards now forbid this and the checker catches the phrasing; the following run did not repeat it. One run is not proof.
- **Persuasion is uneven.** The bookkeeper example (hours freed against a fee) was concrete and strong. The bakery example's whole benefit is $4 a month, and its story was flatter. The tool cannot make a weak offer exciting; it can only make it honest. The assumptions that favor the offer (for example "100% of freed hours get billed") are labeled `ASSUMED` but are optimistic. Read them as the business's call.
- **Structure drifts.** One run dropped the "What would change this" heading and the next-step label. The checker warns.
- **The challenge step is not independent.** It is the same model re-reading its own work, so it missed the invented term the first time. Read the example yourself before it goes to a customer.
- **Not tried on a real business.** Both samples are fictional.

## Samples

`_samples/` holds two fictional briefs (a bakery subscription and a bookkeeping service), one profile, and historical model output. The bakery run contains an invented business term; the bookkeeper run has correct arithmetic but lacks some current per-figure basis entries. Both predate the required retained Source notes table. Their files are preserved unchanged, including the repository-added SYNTHETIC OUTPUT wrapper. Tests strip only that wrapper when checking the model body, retain these legacy failures, and exercise success with a separately hand-authored synthetic example and matching provenance table. These are not fresh model measurements.
