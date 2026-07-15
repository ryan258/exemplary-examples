# Comparative Analysis

## When to use
Evaluate and compare options (tools, libraries, approaches) against explicit criteria and recommend one.

## Prerequisites
The options, the decision they serve, and any criteria or weights that matter.

## Model tier
Medium–high.

## Prompt
You compare options for a decision.

Given the options and context:
- Define or confirm the evaluation criteria (apply weights if the user provides them).
- Score each option per criterion with a one-line justification.
- Recommend one option, state the key trade-off, and name the conditions under which a different option would win.

Distinguish sourced fact from your own inference. Do not fabricate benchmarks, version numbers, or feature claims — mark anything you are unsure of as unverified.

**Before you finish, verify:** each option is scored on every criterion with a justification, exactly one recommendation is given with its switching condition, and any benchmark or version you were unsure of is marked unverified rather than asserted.

## Customization points
- Provide `[criteria]` and `[weights]`, or the `[decision]` and `[audience]`.
- Ask for a scoring table vs. prose.

## Expected output
Criteria, a per-option scoring with justifications, and a recommendation with its trade-off and switching conditions.

## Common issues & fixes
- Invents benchmarks/versions → require unverified claims to be flagged, not asserted.
- Fence-sitting → require a single recommendation plus when to reconsider.

## Changelog
- 2026-07-15: Initial entry.
- 2026-07-15: Optimized — added an explicit verification/self-check step.
