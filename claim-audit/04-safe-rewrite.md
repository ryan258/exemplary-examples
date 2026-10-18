# Safe Rewrite and Evidence Pack

## When to use
Final step of a Claim Audit. Produce a safer version of the draft and assemble the evidence pack.

## Prerequisites
The table from Evidence Needs. The original draft arrives as the original brief.

## Model tier
Medium–high.

## Prompt
You finish a Claim Audit by producing the evidence pack. Every input figure, name, and source in your output must already appear in the draft or the PROFILE. A new calculated result is allowed only when you show its formula, stated inputs, and units in the register; label it as a recomputation, never as a supplied fact.

The PROFILE may include explicit saved owner answers. Those answers count as supplied context for corrections, with attribution and the owner's stated limits; model questions do not count as facts. The original draft remains the source for `Claim (verbatim)` and sentence retention. Do not quote supplemental answers as if they appeared in the original draft.

Rewrite rules, applied per claim:
- Keep every sentence of the original. Rewrite it or bracket the unsupported phrase inside it; never delete a sentence, replace a sentence with a bare placeholder, or leave a sentence without its subject.
- Bracket an unsupported phrase in place using `[UNVERIFIED: "<original phrase>"; needs <evidence>]`, so the reader sees the claim and what it still needs.
- The rewritten draft is a review draft. Keep its ordinary prose readable, with unresolved phrases visibly bracketed; it is not publishable until a person resolves every bracket and completes verification. Source notes, owners, and file names stay in the register and tasks, never in the copy. When you substitute a PROFILE fact, state the figure and its date plainly (for example "212 paying accounts as of 2026-09-30") and nothing more.
- Keep sentences separate: do not merge two original sentences into one.
- A claim the table marks as supportable as written stays as written.
- When the PROFILE holds a client-provided fact on the same point, rewrite the claim to state that fact in the PROFILE's own numbers and wording, and name its owner in the register. Do this before using a placeholder. Never state a PROFILE fact that does not address the claim.
- A claim whose arithmetic fails is restated with the recomputed figure from the draft's own stated inputs, and words that depend on a comparison the draft never supports (for example "save", "faster", "better") are removed or bracketed.
- A forecast or promise becomes a conditional statement or a clearly labeled modeled scenario only if the draft states assumptions; otherwise bracket the phrase.
- A testimonial the PROFILE fully supports (full name, organization, role, and written permission recorded) stays exactly as written, with no bracket. Any other testimonial keeps its quoted words and gets `[UNVERIFIED: testimonial; needs <what is missing>]` after the sentence, separated by a space; its removal is never silent.
- A claim that breaks a PROFILE claims policy (for example a medical or treatment claim) is rewritten with the forbidden term and the outcome it asserts removed, keeping the subject and what the draft says the product is or does. Add nothing the draft or PROFILE does not already say. If nothing allowed remains, bracket the sentence and name the policy.
- The copy never contains internal-record phrases such as "on file", "per the PROFILE", "supplied copy", file names, or owner names, and never states what the company lacks (for example "no awards are on file"). Remove unsupported wording only within a sentence that retains its subject and allowed meaning. If no honest sentence remains, retain the original sentence with an appropriate bracket; never silently delete it or replace it with a statement about missing evidence.
- Never invent a replacement number, source, customer, or quote. Do not improve claims that need evidence by making them sound more specific.
- Keep the author's voice and the PROFILE's tone where the claims allow.

Return exactly these sections:
1. `## Summary`: counts by class and by Priority; counts for every nonzero Risk flag (zero counts optional), and a one-line verdict on how much of the draft is supported by what was supplied. Use the labels `profile-contradiction`, `policy-conflict`, `unsupported-comparison`, `unverified-result`, and `permission-missing` exactly. Surface every flagged claim, even if its Priority is Medium or Low, by writing `Claim N` with its register ID (for example `Flagged: Claim 2 (profile-contradiction); Claim 7 (policy-conflict)`), never a bare number. Say "client-supplied" for PROFILE facts. Never call any claim verified, confirmed, or defensible as it stands; nothing has been checked by a person yet.
   Format flag counts as `Risk flags: profile-contradiction=2; policy-conflict=1; ...`; if no row is flagged, use `Risk flags: none` instead. Flags count rows, so a row with two flags contributes to both counts.
2. `## Claim register`: the full table from the previous step plus a `Safe rewrite` column.
3. `## Open verification tasks`: one Markdown bullet per claim, High priority first, no blank lines or prose paragraphs between them. Start each bullet with `- Claim N` using its register ID and include that row's exact Check-by action. Include all flagged rows regardless of Priority, name their flags, and give every bracketed phrase a task tied to its claim. Do not invent task IDs absent from the register.
4. `## Rewritten draft`: the complete draft with the rewrites and placeholders applied.
5. `## Limits`: one short paragraph stating that classification is a model's reading of the draft, untrusted until independently verified by a person checking each item, and that this is not legal or compliance advice. State that Priority is relative work order, not approval or an absolute safety rating.

**Before you finish, verify:** each section is present, the register keeps every row and exact source span, every original sentence has a corresponding rewritten or bracketed sentence, every input figure/source/name comes from the draft or PROFILE, every new calculated result has reproducible working in the register, and every bracket has a matching task.

## Customization points
- Keep the five section headings and required columns fixed. A different schema requires a coordinated change to all cards, checker, documentation, and targeted tests; reviewer notes can be added inside the existing Limits section.

## Expected output
A five-section Markdown evidence pack. Placeholders and open tasks are expected, not defects.

## Common issues & fixes
- Rewrite adds a fresh statistic → restate that nothing may be introduced and rerun, or delete it in the editor.
- Placeholders missing from the tasks list → ask for one task per bracket.
- Sentences dropped or reduced to a bare placeholder → restate "keep every sentence" and rerun.

## Changelog
- 2026-10-17: Initial entry.
- 2026-10-17: Instruction revision after one synthetic trial: keep every sentence, bracket phrases in place, substitute PROFILE facts, drop unsupported comparison words. Not yet re-measured.
- 2026-10-17: Instruction revision after a second synthetic trial: no source notes in copy, sentences stay separate, verdict says client-supplied and never verified. Not yet re-measured.
- 2026-10-17: Instruction revision after a third synthetic trial: fully supported testimonials are not bracketed, forbidden claims are rewritten compliantly where possible, internal-record phrases are banned from copy. Not yet re-measured.
- 2026-10-17: Instruction revision: allow reproducible derived results, preserve each original sentence without contradictory deletion rules, label unresolved copy as a review draft, and retain the fixed pack contract. Not yet re-measured.
- 2026-10-18: Instruction revision: allow attributed owner-answer facts as supplied corrections while preserving the original draft's quotation and sentence boundaries. Not yet re-measured.
- 2026-10-18: Instruction revision after a synthetic run the checker failed: tasks are `- Claim N` bullets, and the summary names flagged claims as `Claim N`, matching what the checker parses. Not yet re-measured.
