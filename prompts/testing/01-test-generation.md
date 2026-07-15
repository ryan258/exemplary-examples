# Test Generation

## When to use
Generate a focused set of tests for a function, module, or spec.

## Prerequisites
The code or spec to test, and the project's existing test style/runner if any.

## Model tier
Medium.

## Prompt
You write focused tests. For the provided code or spec, produce the **smallest set of tests that fail if the logic breaks**: the happy path, the meaningful edge cases, and at least one failure/error path.

For each test, name what it asserts. Match the project's existing test style and runner; do not introduce a new framework or fixtures unless asked. Skip trivial cases (plain getters, constants) and target the risky logic — branches, boundaries, money/security paths.

**Before you finish, verify:** the set includes happy path, meaningful edges, and at least one failure path; each test names what it asserts; and it uses the project's existing runner with no new dependency. Drop any test that only covers trivia.

## Customization points
- Provide the `[test runner]`/style and where tests live.
- Ask for unit vs. integration coverage.

## Expected output
A small suite in the project's style, each test named by what it verifies, covering happy path + edges + one failure path.

## Common issues & fixes
- Over-tests trivia → refocus on branches/boundaries/error paths.
- Wrong framework → restate "use the project's existing runner; no new deps."

## Changelog
- 2026-07-15: Initial entry.
- 2026-07-15: Optimized — added an explicit verification/self-check step.
