# Safe Rewrite and Evidence Pack

## When to use
Final step of a Claim Audit. Produce a safer version of the draft and assemble the evidence pack.

## Prerequisites
The table from Evidence Needs. The original draft arrives as the original brief.

## Model tier
Medium–high.

## Prompt
You finish a Claim Audit by producing the evidence pack. Every figure, name, and source in your output must already appear in the draft or the PROFILE.

Rewrite rules, applied per claim:
- Keep every sentence of the original. Rewrite it or bracket the unsupported phrase inside it; never delete a sentence, replace a sentence with a bare placeholder, or leave a sentence without its subject.
- Bracket an unsupported phrase in place using `[UNVERIFIED: "<original phrase>"; needs <evidence>]`, so the reader sees the claim and what it still needs.
- The rewritten draft must read as publishable copy. Source notes, owners, and file names stay in the register and tasks, never in the copy. When you substitute a PROFILE fact, state the figure and its date plainly (for example "212 paying accounts as of 2026-09-30") and nothing more.
- Keep sentences separate: do not merge two original sentences into one.
- A claim the table marks as supportable as written stays as written.
- When the PROFILE holds a client-provided fact on the same point, rewrite the claim to state that fact in the PROFILE's own numbers and wording, and name its owner in the register. Do this before using a placeholder. Never state a PROFILE fact that does not address the claim.
- A claim whose arithmetic fails is restated with the recomputed figure from the draft's own stated inputs, and words that depend on a comparison the draft never supports (for example "save", "faster", "better") are removed or bracketed.
- A forecast or promise becomes a conditional statement or a clearly labeled modeled scenario only if the draft states assumptions; otherwise bracket the phrase.
- A testimonial the PROFILE fully supports (full name, organization, role, and written permission recorded) stays exactly as written, with no bracket. Any other testimonial keeps its quoted words and gets `[UNVERIFIED: testimonial; needs <what is missing>]` after the sentence, separated by a space; its removal is never silent.
- A claim that breaks a PROFILE claims policy (for example a medical or treatment claim) is rewritten with the forbidden term and the outcome it asserts removed, keeping the subject and what the draft says the product is or does. Add nothing the draft or PROFILE does not already say. If nothing allowed remains, bracket the sentence and name the policy.
- The copy never contains internal-record phrases such as "on file", "per the PROFILE", "supplied copy", file names, or owner names, and never states what the company lacks (for example "no awards are on file"). A claim with no honest replacement is bracketed or removed, not answered with a sentence about missing evidence.
- Never invent a replacement number, source, customer, or quote. Do not improve claims that need evidence by making them sound more specific.
- Keep the author's voice and the PROFILE's tone where the claims allow.

Return exactly these sections:
1. `## Summary`: counts by class and by Priority, and a one-line verdict on how much of the draft is supported by what was supplied. Say "client-supplied" for PROFILE facts. Never call any claim verified, confirmed, or defensible as it stands; nothing has been checked by a person yet.
2. `## Claim register`: the full table from the previous step plus a `Safe rewrite` column.
3. `## Open verification tasks`: High priority first, one line each with the Check-by action.
4. `## Rewritten draft`: the complete draft with the rewrites and placeholders applied.
5. `## Limits`: one short paragraph stating that classification is a model's reading of the draft, untrusted until a person checks each item, and that this is not legal or compliance advice.

**Before you finish, verify:** each section is present, the register keeps every row, every sentence of the original draft appears in the rewritten draft (rewritten or bracketed), the rewritten draft contains no number, source, or name absent from the draft and PROFILE, and every bracket has a matching task.

## Customization points
- Reorder or add pack sections (for example a "Reviewer sign-off" line) here.

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
