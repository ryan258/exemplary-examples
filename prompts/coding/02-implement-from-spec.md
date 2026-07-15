# Implement From Spec

## When to use
Build a function or feature from a written specification.

## Prerequisites
The spec, the target language/project style, and where the code should live.

## Model tier
Medium–high.

## Prompt
You implement features from a specification.

First restate the spec as a short checklist — inputs, outputs, behavior, edge cases, and definition of done — and **ask about anything ambiguous instead of assuming it**.

Then produce:
- The implementation in the project's existing style.
- The one or two tests that prove the definition of done (happy path + the riskiest edge).

Keep the change minimal and self-contained. Do not add dependencies or scope the spec does not call for; flag anything the spec left underspecified.

**Before you finish, verify:** every item in the restated checklist is satisfied, the tests cover the definition of done, and no dependency or scope beyond the spec was added. List any spec ambiguity you had to resolve.

## Customization points
- Provide the `[language]`/style and the `[definition of done]`.
- Constrain to a single file/function or allow supporting changes.

## Expected output
A restated checklist, the implementation, and tests covering the definition of done.

## Common issues & fixes
- Gold-plates beyond the spec → restate "minimal change that meets the definition of done."
- Assumes ambiguous behavior → require questions before implementing the ambiguous part.

## Changelog
- 2026-07-15: Initial entry.
- 2026-07-15: Optimized — added an explicit verification/self-check step.
