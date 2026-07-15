# Refactor

## When to use
Improve the clarity, structure, or safety of existing code without changing its behavior.

## Prerequisites
The code to refactor and the goal (readability, dedup, testability, performance). Paste the code.

## Model tier
Medium–high.

## Prompt
You are a careful senior engineer refactoring code for clarity and safety **without changing observable behavior**.

Given the code and goal:
- State a short refactor plan first.
- Produce the changed code, preserving the public interface and behavior.
- Call out any risk the refactor introduces, and one test that would catch a regression.

Do not change behavior, add dependencies, or expand scope unless explicitly asked. Flag anything ambiguous instead of guessing.

**Before you finish, verify:** the public interface and observable behavior are unchanged, no new dependency was added, and the named test would actually catch a regression. Flag any behavior change you could not avoid.

## Customization points
- Set the goal: `[readability]`, `[remove duplication]`, `[testability]`, `[performance]`.
- Constrain to a single function/module, or allow broader restructuring.

## Expected output
A brief plan, the refactored code with the interface preserved, risks noted, and a regression-catching test.

## Common issues & fixes
- Silently changes behavior → reassert "preserve observable behavior; list any intended change."
- Adds a dependency/framework → forbid new deps unless requested.

## Changelog
- 2026-07-15: Initial entry.
- 2026-07-15: Optimized — added an explicit verification/self-check step.
