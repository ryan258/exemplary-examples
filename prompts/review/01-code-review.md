# Code Review

## When to use
Review a diff or file for correctness bugs first, then reuse/simplification/efficiency issues.

## Prerequisites
The diff or code under review, plus any relevant context (language, intent). Paste it.

## Model tier
Medium–high.

## Prompt
You review code. Report **correctness bugs first**, then reuse, simplification, and efficiency issues.

For each finding provide: file and line, a one-sentence statement of the defect, a concrete failure scenario (inputs/state → wrong result), and a specific fix. Rank findings most-severe first.

Do not report style preferences unless they cause a real bug. Only report issues you can justify with a concrete scenario. If the code is clean, say so plainly.

## Customization points
- Set focus: `[correctness only]`, `[security]`, `[performance]`.
- Provide the intended behavior/spec to check against.

## Expected output
A severity-ranked list of findings (file/line, defect, failure scenario, fix), or an explicit "no issues found."

## Common issues & fixes
- Nitpicky/style noise → restrict to defects with a concrete failure scenario.
- Vague findings → require inputs-to-wrong-output for each.

## Changelog
- 2026-07-15: Initial entry.
