# Classify Claims

## When to use
Second step of a Claim Audit. Place each extracted claim in one of the six truth classes, or mark it unplaced.

## Prerequisites
The claim table from Extract Claims. The original draft arrives with it as the original brief. A `--profile` that lists client-provided facts makes classification more accurate.

## Model tier
Medium.

## Prompt
You classify claims by where they come from, using this six-class standard:

- **Sourced fact**: the draft itself names a retrievable source (publisher or author, title or dataset, and date).
- **Client-provided fact**: stated in the PROFILE as supplied by the client, or attributed in the draft to a named client-side owner.
- **Calculation**: the draft shows its inputs and formula, so it can be recomputed.
- **Inference**: a conclusion the draft supports with stated facts and reasoning.
- **Modeled scenario**: a projection whose assumptions and method are stated.
- **Satirical fiction**: only if the draft marks it as fiction. Rare in marketing.
- **UNPLACED**: none of the above. The claim gives no provenance, so it is not yet a claim anyone can defend.

Rules:
- Classify from what the draft and PROFILE actually say. Never assume a source exists because a claim sounds plausible, and never supply a source, URL, study, or figure.
- A class says where a claim comes from, not whether it is true. Do not state or imply that any claim is verified.
- For an implied claim, preserve its quoted source span and separate `Implied meaning` (if present); explain in `Why` that the interpretation is implied, and classify that interpretation without inventing detail.
- A named source is only a lead until someone opens it. Say so in the rationale when you place a claim as Sourced fact.
- Recompute any arithmetic the draft shows. If it does not add up, class it Calculation and say the arithmetic fails and why.
- A testimonial is Client-provided fact only if the draft or PROFILE gives the speaker's full name, organization, and role, and the PROFILE says written permission is on file. Anything less, such as a first name only, "a leading retailer", or no permission recorded, is UNPLACED; say which of those is missing. Even then it covers only what the speaker said, not the result they report.
- If a fact in the PROFILE contradicts a claim, class the claim UNPLACED and quote the PROFILE fact in `Why`.
- When two classes fit, choose the weaker one and say why.

Return the full table from the previous step with two columns added: `Class` (exactly one label above) and `Why` (one sentence). Keep every row and every earlier column unchanged, and keep the numbering.

**Before you finish, verify:** every row from the previous table is present, each has exactly one class, no source was invented, and every UNPLACED row says what provenance is missing.

## Customization points
- Add channel-specific rules in the PROFILE (for example "never class a health claim above UNPLACED without a named study").

## Expected output
The previous table plus `Class` and `Why` on every row. UNPLACED is expected and not a failure.

## Common issues & fixes
- Plausible-sounding claims classed as Sourced fact → restate that only a source named in the draft counts.
- Arithmetic glossed over → ask for the recomputation to be shown in `Why`.

## Changelog
- 2026-10-17: Initial entry.
- 2026-10-17: Instruction revision after one synthetic trial: a testimonial needs full name, organization, role, and recorded permission. Not yet re-measured.
- 2026-10-17: Instruction revision: preserve the exact source span and separate interpretation of implied claims through classification. Not yet re-measured.
