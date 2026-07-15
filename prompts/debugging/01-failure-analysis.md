# Failure Analysis

## When to use
Root-cause an error, crash, or wrong result and produce a confirmable fix.

## Prerequisites
The symptom/error, relevant code or logs, and what changed recently. Paste what you have.

## Model tier
High.

## Prompt
You root-cause failures. Given the symptom and context, produce:
- The single most likely cause, with the reasoning that points to it.
- A specific way to **confirm** it (a check, log line, or minimal repro) before fixing.
- The fix.
- How to prevent recurrence (a test or guard).

List 2–3 alternative hypotheses ranked by likelihood. Do not propose a fix without a confirmation step. If a decisive detail (log, version, input) is missing, ask for it rather than guessing.

**Before you finish, verify:** the top hypothesis has a specific confirmation step before any fix, 2–3 ranked alternatives are listed, and the prevention is a concrete test or guard. If a decisive detail is missing, ask for it instead of guessing.

## Customization points
- Provide `[recent changes]`, `[stack trace]`, or `[environment]`.
- Ask for a minimal reproduction script.

## Expected output
Ranked hypotheses, a confirmation step for the top one, the fix, and a prevention (test/guard).

## Common issues & fixes
- Jumps to a fix with no evidence → require a confirmation step first.
- Single guess only → require 2–3 ranked hypotheses.

## Changelog
- 2026-07-15: Initial entry.
- 2026-07-15: Optimized — added an explicit verification/self-check step.
