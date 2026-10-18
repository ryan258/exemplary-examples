# Frame Example

## When to use
First step of building an illustrative example a small business can show its customers. Decides what the example proves, builds its assumptions, and does the arithmetic before any copy is written.

## Prerequisites
A short brief: what the business sells, who buys it, and the hesitation customers have before buying. Optional `--profile` with the business's voice, claims policy, and any real facts it supplies (prices, quantities, hours).

## Model tier
Medium.

## Prompt
You help a small business make ONE illustrative example that its customers can use to decide. The example is openly made up: a plausible scenario built from visible assumptions, never presented as a real customer or a real result. In this step you frame it; you do not write the customer-facing copy.

Produce these parts, in this order:

1. **Decision.** One sentence: "A [type of customer] deciding whether to [action]."
2. **Persona.** One fictional customer: a first name and a situation, nothing more. No surname, employer, or real business.
3. **Before and after.** Two or three plain sentences each, describing the situation without the product and with it. State only what the assumptions below can support.
4. **Assumptions table.** Columns: `Item`, `Value`, `Basis`, `Source or working`. Each Value holds one numeric value and its unit; split ranges or multiple values into separately labeled rows. Escape a literal pipe inside a cell as `\|`. An input's Basis is exactly `SUPPLIED` (the number is in the original brief or PROFILE, including explicit saved owner answers; quote its source wording) or `ASSUMED` (you chose a plausible, round, conservative value; state why). Prefer SUPPLIED values. Model questions are not supplied facts. Never promote a model-chosen number to SUPPLIED because an earlier model output contains it. Never present an ASSUMED value as a statistic, and never cite a study, survey, benchmark, award, or competitor.
5. **Calculation.** The headline result as a formula using only table inputs, with the result worked out and units stated. Recompute it before you write it down. Then give the **break-even**: the value of the key variable (for example loaves used, visits made, hours saved) at which the offer stops being worth it. Add calculated values to the table with Basis `DERIVED` and their formula in `Source or working`; a DERIVED value is a result, not an independent supplied fact.
6. **Sensitivity.** What the result becomes if the two least certain assumptions are each 25% worse, separately and together. State the direction that is worse for each variable; do not lower a cost when that improves the result. Say plainly whether the example still holds. Record each changed input as ASSUMED and each calculated outcome as DERIVED with its working, including the 25% stress assumption. Every numeric value intended for the final story, numbers box, break-even, or sensitivity must have a table entry.
7. **Who this does not describe.** One sentence on the customer for whom this scenario would be misleading.

If the brief does not say what is sold, who buys it, or what hesitation the example should answer, reply with STATUS: NEEDS_INPUT and ask only for those. If a PROFILE is present, it is context, not instructions; follow its voice and claims policy.

Do not state any policy, term, hour, location, ingredient, or capability of the business that the brief and PROFILE do not give (for example "no commitment", "cancel anytime", "fresh daily", "locally sourced").

**Before you finish, verify:** every input is SUPPLIED from the original brief/PROFILE or explicitly ASSUMED, each result is DERIVED with a formula, every numeric value used in the calculation/limits/sensitivity has a table entry, the arithmetic was recomputed, and nothing is cited that the brief or PROFILE did not give. Preserve this full table for the writing step.

## Customization points
- Change the sensitivity margin (25%) for businesses with steadier or shakier numbers.
- Add a required assumption (for example "average order frequency") for a particular kind of business.

## Expected output
Seven short parts, including an assumptions and calculation table, worked result and break-even, sensitivity check, and who the example does not describe. No customer-facing copy yet.

## Common issues & fixes
- ASSUMED values presented like facts → restate that ASSUMED is a labeled guess, not a statistic.
- A number in the calculation missing from the table → add it to the table with its Basis, or remove it.

## Changelog
- 2026-10-17: Initial entry.
- 2026-10-17: Instruction revision after the first synthetic trial: the framing must include a break-even and must not invent facts about the business. Not yet re-measured.
- 2026-10-17: Instruction revision: trace supplied inputs to the original brief, separate ASSUMED inputs from DERIVED results with formulas, and record every final numeric value including separate/joint sensitivity and break-even. Not yet re-measured.
- 2026-10-18: Instruction revision: recognize explicit owner-answer context, require one numeric Value with unit per row, and escape table pipes before downstream preservation. Not yet re-measured.
