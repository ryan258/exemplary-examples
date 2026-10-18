# Evidence Needs

## When to use
Third step of a Claim Audit. For each classified claim, state the evidence still required and what the claim cannot support.

## Prerequisites
The classified table from Classify Claims.

## Model tier
Medium.

## Prompt
You turn a classified claim table into a verification worklist. This is not legal or compliance advice; it names the evidence a careful reviewer would ask for.

For every row, add:
- `Evidence needed`: the specific thing to obtain (for example "open the cited survey, confirm the 61% figure, population, and date", "recompute from the stated inputs", "written permission and the exact quote from the named speaker", "the data behind 'leading competitor' and which competitor").
- `Cannot support`: what the claim would still not justify even if checked (for example a causal claim from a correlation, a global claim from one segment).
- `Check by`: exactly one of open-source, recompute, ask-owner, get-permission, remove-or-reframe.
- `Priority`: High, Medium, or Low, ranked against the other rows. High is for the most exposed claims only and may cover at most one third of the rows, rounded up. Rank in this order: a claim that contradicts a PROFILE fact, then an unsourced number, ranking, or comparison readers will repeat, then a guarantee or forecast, then a testimonial. Medium is for claims with a lead that only needs checking (a named source, arithmetic to recompute). Low is only for harmless description. A guarantee, promise, forecast, or testimonial is never Low, even when the High slots are full; rate it Medium at least, and High if it breaks a PROFILE claims policy and a slot is free. If every row looks High, you have not ranked.
- Priority orders work within this draft; it is not an absolute risk or safety rating. Do not describe Medium or Low as safe or approved. Describe any serious unresolved harm or policy breach explicitly in `Evidence needed`, regardless of its priority slot.
- `Risk flags`: exactly `none`, or one or more comma-separated values from `profile-contradiction`, `policy-conflict`, `unsupported-comparison`, `unverified-result`, `permission-missing`. Flag a contradictory supplied fact, a breach of the supplied claims policy, a comparison lacking a sound baseline/support, an unverified claimed result, or missing testimonial permission respectively. These are observable reasons for attention, not verified conclusions or legal risk ratings. There is no quota: flag every applicable row, regardless of Priority. Never combine `none` with another flag.

Rules:
- Never supply, guess, or imply a source, figure, study, competitor, or customer. Describe the evidence to find, not its content.
- For any claim about a saving, discount, improvement, speed-up, or "more", "less", "faster", "better", state in `Evidence needed` the exact baseline it is measured against, and whether both sides cover the same period, unit, and scope. A 14-day price set against a monthly price is not like for like. If the draft names no baseline, say that, and put what the comparison cannot support in `Cannot support`.
- Keep every row, every earlier column, and the numbering unchanged.
- If a PROFILE lists claims policy or restricted topics, apply it and name it in `Evidence needed`.
- Apply explicit saved owner answers included in the PROFILE as supplied context, with attribution and any limits stated by the owner. Model questions are not facts. Owner clarification may identify evidence or a contradiction, but it must not silently replace the original quoted claim or an earlier accepted assessment.

Return the full table with the five new columns.

**Before you finish, verify:** every row has all five new columns, no `Check by` or Risk flag is outside its allowed list, flagged rows are not hidden by the High quota, and nothing in `Evidence needed` asserts a fact the draft did not.

## Customization points
- Add regulated-topic reminders to the PROFILE rather than to this prompt.

## Expected output
The previous table plus `Evidence needed`, `Cannot support`, `Check by`, `Priority`, and uncapped `Risk flags` on every row.

## Common issues & fixes
- Vague evidence ("find support") → require the specific document, field, or permission to obtain.
- Everything marked High → reserve High for claims readers will rely on or repeat.

## Changelog
- 2026-10-17: Initial entry.
- 2026-10-17: Instruction revision after one synthetic trial: High priority capped at one third of rows, with a ranking order. Not yet re-measured.
- 2026-10-17: Instruction revision after a second synthetic trial: guarantees, promises, forecasts, and testimonials are never Low. Not yet re-measured.
- 2026-10-17: Instruction revision after the third synthetic trial: comparisons must name their baseline and say whether both sides are like for like. Not yet re-measured.
- 2026-10-17: Instruction revision: distinguish relative work priority from risk, add uncapped observable Risk flags, and keep the High cap from hiding flagged rows. Not yet re-measured.
- 2026-10-18: Instruction revision: apply attributed owner-answer context while preserving original quotations and earlier accepted assessments. Not yet re-measured.
