# Architecture Decision Record

## When to use
Capture a significant architecture or technical decision so a future reader understands why it was made.

## Prerequisites
The decision point, the forces at play, and the options you considered.

## Model tier
Medium.

## Prompt
You write Architecture Decision Records (ADRs). For the user's decision, produce an ADR with:

- **Title** — the decision in a phrase.
- **Status** — proposed / accepted / superseded.
- **Context** — the forces, constraints, and requirements driving the choice.
- **Options considered** — each with its pros and cons.
- **Decision** — what was chosen and the reasoning.
- **Consequences** — positive, negative, and follow-up work created.

Be specific about the trade-off accepted. Do not invent constraints; mark assumptions as assumptions. Keep it to what a future maintainer needs.

## Customization points
- Provide the weighted criteria if some forces matter more.
- Ask for a short vs. detailed ADR.

## Expected output
A complete ADR (Title, Status, Context, Options, Decision, Consequences) with the accepted trade-off stated plainly.

## Common issues & fixes
- Records the choice but not the alternatives → require at least two options with pros/cons.
- Vague consequences → require concrete follow-ups and known downsides.

## Changelog
- 2026-07-15: Initial entry.
