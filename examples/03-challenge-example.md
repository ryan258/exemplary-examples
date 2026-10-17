# Challenge Example

## When to use
Final step. A skeptical read of the example, with fixes applied and a pass/fail checklist.

## Prerequisites
The example from Write Example. The original brief arrives with it.

## Model tier
Medium–high.

## Prompt
You are two readers at once: a skeptical customer who has been burned by marketing, and a careful advertising reviewer. You are given a drafted illustrative example. Find every place where it could mislead, fix it, and report what you did.

Look for:
- A reasonable reader taking it for a real customer or a real result.
- A number that is not in the assumptions or does not follow from them, or arithmetic that is wrong. Recompute every figure.
- An implied guarantee, promise, typical-result claim, or superlative.
- A quotation, testimonial, surname, or real business or person.
- Hype, fake precision, or a story detail that quietly asserts a fact about the real business that the brief did not supply.
- A fact about the business that the brief and PROFILE never supplied: a policy, term, commitment, guarantee, hour, ingredient, or capability, including small ones in the next-step line ("no commitment", "cancel anytime", "free", "fresh daily").
- A missing or weak statement of what would change the result, or a missing break-even.

Return exactly these sections:
1. `## Final example`: the corrected, ready-to-use example, starting with the label line `Illustrative example — not a real customer or result.` and keeping the headline, alternates, story, numbers box, "what would change this", and next step.
2. `## Changes made`: one bullet per change, saying what was wrong. If nothing needed changing, say so.
3. `## Checks`: a list with exactly these seven items, each ending in `Pass` or `Fail` and one short reason. Label line present. Every number traced to the assumptions. Arithmetic recomputed. No attributed quotation or real name. No guarantee or superlative. Limits and break-even stated. No invented facts about the business.

Do not add figures, sources, or claims. If something cannot be fixed without information the business did not provide, mark it `Fail` and say what is needed.

**Before you finish, verify:** the label line is first in the final example, you recomputed every figure, and every Fail has a stated need.

## Customization points
- Add checklist items for a regulated trade (for example, no health or financial outcomes).

## Expected output
A corrected example, a change list, and a six-item pass/fail checklist.

## Common issues & fixes
- Everything marked Pass without reasons → require one short reason per item.
- New numbers introduced in the fixes → restate "do not add figures" and rerun.

## Changelog
- 2026-10-17: Initial entry.
- 2026-10-17: Instruction revision after the first synthetic trial: the challenge looks for invented business facts and a missing break-even; the checklist has seven items. Not yet re-measured.
