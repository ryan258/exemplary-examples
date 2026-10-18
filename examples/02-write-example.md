# Write Example

## When to use
Second step. Turns the framing into the customer-facing illustrative example in the business's voice.

## Prerequisites
The framing from Frame Example. The original brief arrives with it.

## Model tier
Medium–high.

## Prompt
You write the customer-facing illustrative example from the framing you are given. The business will show this to its own customers, so it must be vivid and specific, and it must never be mistakable for a real customer or a real result.

Output, in this order:

1. **The label line**, as the first line of the example, exactly: `Illustrative example — not a real customer or result.`
2. **Headline.** Specific and in plain words. No superlatives. Then two alternate headlines on separate lines marked `Alt:`.
3. **The story.** 120 to 180 words about the fictional persona. Make it specific with ordinary, non-numeric detail (a place, a routine, an object, a small frustration) so it feels lived-in. It may use a number only if that number is in the framing's assumptions table.
4. **The numbers.** A box under the story, one line per distinct numeric value used anywhere in the customer-facing example: what it is, its value, and `SUPPLIED`, `ASSUMED`, or `DERIVED` exactly as in the framing. A SUPPLIED line identifies its original brief/PROFILE source; an ASSUMED line says it is a chosen scenario input; a DERIVED line shows its formula from listed inputs. Include the headline result, break-even, and every sensitivity value here.
5. **What would change this.** Two bullets in plain language. The first states the break-even from the framing: the point at which the offer stops being worth it. The second comes from the sensitivity.
6. **Next step.** One sentence inviting the customer to ask or try. It promises nothing.
7. **Source notes.** After the next step, use the exact nested heading `### Source notes`, followed only by the complete framing table with columns `Item`, `Value`, `Basis`, `Source or working`. Preserve every row and cell. Each Value contains one numeric value with its unit; SUPPLIED working quotes exact original owner wording, ASSUMED working explains the scenario choice, and DERIVED working shows a formula. Do not put customer-facing copy or other prose after this boundary. These notes are provenance for the owner, not customer-facing assertions; faithful source quotations may retain wording banned from the example itself.

Rules:
- Explicit saved owner answers included in the PROFILE are supplied owner context. They may support SUPPLIED values when quoted faithfully with the owner's stated limits. Model questions and earlier generated text do not become supplied facts.
- Use only numbers from the framing's table, and show their arithmetic. Add no new input figures. A calculated result is allowed only as a DERIVED entry with its formula and units; add that entry before using it in prose. Never change an ASSUMED input to SUPPLIED: only the original brief or PROFILE can supply a fact.
- No quotation attributed to anyone, no testimonial, no surname, and no real business, brand, or person named.
- No "customers like you", "most people", "typically", typical-result claims such as "results vary" or "results may", "proven", "guaranteed", "best", "leading", or "#1". You may describe a transparent hypothetical calculation as a result; do not imply observed or typical customer outcomes.
- State no policy, term, hour, location, ingredient, or capability of the business that the brief and PROFILE do not give. Words like "no commitment", "cancel anytime", "free", "fresh daily", or "locally sourced" are facts about the business; use them only if supplied.
- Write in the voice given in the PROFILE, if any. Follow its claims policy.
- Do not make the example sound more certain than its assumptions allow.
- The quotation, naming, strong-word, and business-copy restrictions above apply to the customer-facing portion before `### Source notes`. Validate the notes as provenance instead of editing quoted source wording to sound like marketing copy. Owner edits to this accepted table may correct earlier framing; downstream steps must retain those accepted corrections.

**Before you finish, verify:** the first line is the label line exactly, every numeric value in the story and limits has its own basis-marked numbers-box entry, supplied facts trace to the original brief/PROFILE, calculated results show formulas, the full framing table survives in source notes, no quotation is attributed, no forbidden word appears, and no fact about the business appears that the brief or PROFILE did not supply.

## Customization points
- Change the word range of the story, or ask for a second format (for example a three-line social caption).
- Keep the exact label line. Changing it requires a new scope decision and coordinated card, checker, documentation, and test updates.

## Expected output
A label line, a headline with two alternates, a short story, a fully traced numbers box, two "what would change this" bullets, one next-step line, and the preserved framing table as source notes.

## Common issues & fixes
- Story reads like a testimonial → remove any quoted speech and first-person praise.
- Numbers drift from the table → rerun with "use only the table's numbers".
- Label softened ("example") → require the exact label line.

## Changelog
- 2026-10-17: Initial entry.
- 2026-10-17: Instruction revision after the first synthetic trial: the first "what would change this" bullet is the break-even, and no unsupplied business terms (the trial invented "without any commitment"). Not yet re-measured.
- 2026-10-17: Instruction revision: preserve framing/provenance, give every final numeric value a SUPPLIED/ASSUMED/DERIVED entry, allow reproducible derived results, and keep the scope-required label fixed. Not yet re-measured.
- 2026-10-17: Instruction revision: require the fixed nested Source notes boundary and complete provenance-only table, distinguish quoted source wording from customer copy, and preserve accepted owner corrections. Not yet re-measured.
- 2026-10-18: Instruction revision: treat explicit owner answers as attributed supplied context without promoting model questions or generated text to facts. Not yet re-measured.
