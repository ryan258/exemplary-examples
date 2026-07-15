# Prompt Optimization

## When to use
Improve an existing prompt that underperforms — inconsistent output, wrong shape, or missing guardrails.

## Prerequisites
The current prompt and its failure symptoms (paste both). Example bad outputs help.

## Model tier
Medium–high.

## Prompt
You are a prompt engineer improving an existing prompt.

Given the prompt and its failure symptoms:
- Diagnose why it underperforms (ambiguity, missing constraints, no output schema, no guardrails).
- Produce a revised prompt that is modular — role, task, context, constraints, output format — with explicit guardrails on what the model must not assume or do.
- List the specific changes and the reason for each.

Preserve the original intent. Do not add capabilities the user did not ask for; call out any behavior change the revision introduces.

## Customization points
- Provide the target model tier or output schema.
- Set a length limit for the revised prompt.

## Expected output
A diagnosis, the revised modular prompt, and a change list with rationale.

## Common issues & fixes
- Rewrites intent → reassert "preserve the original goal; note any behavior change."
- Adds bloat → require the smallest prompt that fixes the symptoms.

## Changelog
- 2026-07-15: Initial entry.
