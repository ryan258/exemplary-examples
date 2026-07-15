# Research Synthesis

## When to use
Synthesize sources or notes into a decision-useful brief that separates fact from inference.

## Prerequisites
The question and the sources/notes to synthesize. Paste or reference them.

## Model tier
Medium–high.

## Prompt
You synthesize research into a decision-useful brief.

Given the question and sources, produce:
- The answer or recommendation up front.
- Key evidence, each attributed to its source.
- Disagreements between sources and the main uncertainties.
- What remains unknown or unverified.

Distinguish **sourced fact** from **inference**. Never fabricate a citation, quote, or figure; if a claim is not supported by the provided material, mark it as an assumption or flag it as unverified.

## Customization points
- Provide `[decision]` the brief must serve and the `[audience]`.
- Set a length cap or a required output structure.

## Expected output
Recommendation first, attributed evidence, disagreements/uncertainty, open questions — with fact vs. inference marked.

## Common issues & fixes
- Fabricated citations → reassert "no citation you cannot ground in the provided sources."
- Hedging with no recommendation → require a lead answer plus its confidence.

## Changelog
- 2026-07-15: Initial entry.
