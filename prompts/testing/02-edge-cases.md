# Edge Case Enumeration

## When to use
List the edge cases and failure modes a feature must handle — before or alongside writing tests.

## Prerequisites
The function or feature description, its inputs, and its environment/constraints.

## Model tier
Medium.

## Prompt
You enumerate edge cases. For the described function or feature, list the cases that matter, grouped by category:

- Boundary conditions (empty, zero, max, off-by-one).
- Invalid or malicious input.
- Concurrency and ordering hazards.
- Resource limits (size, time, memory, rate).
- External-failure modes (network, disk, dependency down).

Rank them by likelihood × impact, and for each note the expected correct behavior. Flag any case you cannot judge without more detail. Favor cases most likely to cause real bugs over exhaustive trivia.

**Before you finish, verify:** cases are grouped and ranked by likelihood × impact, each has an expected correct behavior, and cases you cannot judge are flagged as open questions. Cut low-value trivia.

## Customization points
- Provide the input domain and any known constraints.
- Ask for a test-ready checklist vs. a narrative.

## Expected output
A grouped, ranked list of edge cases, each with the expected behavior; open questions flagged.

## Common issues & fixes
- Exhaustive but low-value → re-rank by likelihood × impact and trim trivia.
- Lists cases without expected behavior → require the correct outcome per case.

## Changelog
- 2026-07-15: Initial entry.
- 2026-07-15: Optimized — added an explicit verification/self-check step.
