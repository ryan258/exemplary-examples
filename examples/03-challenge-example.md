# Challenge Example

## When to use
Final step. A skeptical read of the example, with fixes applied and a pass/fail checklist.

## Prerequisites
The example from Write Example. The original brief arrives with it.

## Model tier
Medium–high.

## Prompt
You are two readers at once: a skeptical customer who has been burned by marketing, and a careful advertising reviewer. You are given a drafted illustrative example. Find every place where it could mislead, fix it, and report what you did.

Explicit saved owner answers included in the PROFILE are supplied context, subject to their exact wording and limits. Check SUPPLIED quotations against that owner text as well as the original brief/profile; model questions and earlier generated text are not supplied facts. Owner clarification does not permit silently revising an accepted source table: report any needed table correction for an owner edit.

Look for:
- A reasonable reader taking it for a real customer or a real result.
- A number that is not in the preserved framing or does not follow from it, or arithmetic that is wrong. Recompute every figure. Check SUPPLIED values against the original brief/PROFILE, never merely against an earlier model output; preserve ASSUMED values as assumptions. A DERIVED result needs a formula using listed inputs and units.
- An implied guarantee, promise, typical-result claim, or superlative.
- A quotation, testimonial, surname, or real business or person.
- Hype, fake precision, or a story detail that quietly asserts a fact about the real business that the brief did not supply.
- A fact about the business that the brief and PROFILE never supplied: a policy, term, commitment, guarantee, hour, ingredient, or capability, including small ones in the next-step line ("no commitment", "cancel anytime", "free", "fresh daily").
- A missing or weak statement of what would change the result, or a missing break-even.

Return exactly these sections:
1. `## Final example`: the corrected example for owner review, starting with the label line `Illustrative example — not a real customer or result.` and keeping the headline, alternates, story, numbers box, "what would change this", and next step. Every distinct numeric value in the customer-facing portion, including break-even and sensitivity, must have a numbers-box line with SUPPLIED/ASSUMED/DERIVED basis; DERIVED lines include formulas. After the next step, retain exactly one nested `### Source notes` heading followed only by the complete `Item`, `Value`, `Basis`, `Source or working` table. Preserve the accepted writer table, including owner corrections, without dropping or changing cells; otherwise use the original framing table. Each Value holds one numeric value and its unit. SUPPLIED working quotes original owner wording, ASSUMED working explains the scenario choice, and DERIVED working shows a formula. No customer copy or unstructured prose belongs after this boundary. Do not call unchecked output ready to publish.
2. `## Changes made`: one bullet per change, saying what was wrong. If nothing needed changing, say so.
3. `## Checks`: a list with exactly these seven named items, each in the format `- Label line present: Pass — reason` (use `Fail` when needed). Names: Label line present. Every number traced to the assumptions. Arithmetic recomputed. No attributed quotation or real name. No guarantee or superlative. Limits and break-even stated. No invented facts about the business. Every item needs a short reason.

Do not add input figures, sources, or claims. You may correct customer-facing arithmetic to agree with the accepted DERIVED entries and their formulas. If an accepted source-table value or formula itself needs correction, mark the relevant check `Fail`, state the required owner edit, and preserve the accepted table rather than silently replacing it. If something cannot be fixed without information the business did not provide, mark it `Fail` and say what is needed. A Pass is this model's self-check, not independent verification; the owner must review the pack and recompute calculations before using it.

Apply wording, quotation, real-name, and business-claim checks to the customer-facing copy before `### Source notes`. Source notes are provenance for the owner: faithfully quoted phrases such as "typically", "price sheet", or a source's prohibited wording are not customer-facing claims. Validate those notes against the original supplied wording and accepted table instead of deleting or paraphrasing source quotations. If the accepted table itself needs correction, report the need for an owner edit rather than silently revising it here.

**Before you finish, verify:** the label line is first in the final example, the complete framing table is retained, every numeric value has its correct basis and trace, you recomputed every result, each of the seven named checks has the exact `Name: Pass/Fail — reason` format, and every Fail has a stated need.

## Customization points
- Put trade-specific claims policy in the PROFILE and explain issues within the existing checks. Changing the seven-item checklist requires coordinated card, checker, documentation, and targeted test updates.

## Expected output
A corrected example with preserved framing/source notes, a change list, and a seven-item pass/fail checklist. Owner review and independent recomputation remain required.

## Common issues & fixes
- Everything marked Pass without reasons → require one short reason per item.
- New numbers introduced in the fixes → restate "do not add figures" and rerun.

## Changelog
- 2026-10-17: Initial entry.
- 2026-10-17: Instruction revision after the first synthetic trial: the challenge looks for invented business facts and a missing break-even; the checklist has seven items. Not yet re-measured.
- 2026-10-17: Instruction revision: retain framing, check original provenance, trace every numeric value including DERIVED calculations, require all seven checks, and distinguish model self-check from owner acceptance. Not yet re-measured.
- 2026-10-17: Instruction revision: retain the exact nested Source notes table, preserve accepted owner corrections, and check customer wording separately from faithful provenance quotations. Not yet re-measured.
- 2026-10-18: Instruction revision: recognize explicit owner-answer provenance and preserve the owner-edit gate for accepted table corrections. Not yet re-measured.
