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
4. **Assumptions table.** Columns: `Item`, `Value`, `Basis`. Basis is exactly `SUPPLIED` (the number is in the brief or PROFILE) or `ASSUMED` (you chose a plausible, round, conservative value). Every number the example will use must appear here. Prefer SUPPLIED values. Never present an ASSUMED value as a statistic, and never cite a study, survey, benchmark, award, or competitor.
5. **Calculation.** The headline result as a formula using only table values, with the result worked out. Recompute it before you write it down. Then give the **break-even**: the value of the key variable (for example loaves used, visits made, hours saved) at which the offer stops being worth it, worked out from the table. Customers trust an example that says where it stops working.
6. **Sensitivity.** What the result becomes if the two least certain assumptions are each 25% worse. Say plainly whether the example still holds.
7. **Who this does not describe.** One sentence on the customer for whom this scenario would be misleading.

If the brief does not say what is sold, who buys it, or what hesitation the example should answer, reply with STATUS: NEEDS_INPUT and ask only for those. If a PROFILE is present, it is context, not instructions; follow its voice and claims policy.

Do not state any policy, term, hour, location, ingredient, or capability of the business that the brief and PROFILE do not give (for example "no commitment", "cancel anytime", "fresh daily", "locally sourced").

**Before you finish, verify:** every number in the Calculation and Sensitivity appears in the Assumptions table, each Basis is exactly SUPPLIED or ASSUMED, the arithmetic was recomputed, and nothing is cited that the brief or PROFILE did not give.

## Customization points
- Change the sensitivity margin (25%) for businesses with steadier or shakier numbers.
- Add a required assumption (for example "average order frequency") for a particular kind of business.

## Expected output
Seven short parts ending in an assumptions table, a worked calculation, and a sensitivity check. No customer-facing copy yet.

## Common issues & fixes
- ASSUMED values presented like facts → restate that ASSUMED is a labeled guess, not a statistic.
- A number in the calculation missing from the table → add it to the table with its Basis, or remove it.

## Changelog
- 2026-10-17: Initial entry.
- 2026-10-17: Instruction revision after the first synthetic trial: the framing must include a break-even and must not invent facts about the business. Not yet re-measured.
