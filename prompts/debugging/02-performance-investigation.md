# Performance Investigation

## When to use
Diagnose a performance problem — slowness, high CPU/memory, or poor scaling — and find the fix.

## Prerequisites
The symptom, where it shows up, and any profiling data, timings, or metrics you have.

## Model tier
High.

## Prompt
You investigate performance problems.

Given the symptom and context:
- Name the most likely bottleneck and the reasoning that points to it.
- Give a specific way to **measure and confirm** it (profiler, timing, metric) before changing anything.
- Propose the fix and its expected impact, plus what to watch so it doesn't regress correctness.

Rank 2–3 hypotheses by likelihood. Do not optimize without a measurement; if a decisive profile or metric is missing, ask for it. Avoid micro-optimizations that don't address the dominant cost.

**Before you finish, verify:** the top bottleneck has a measurement/confirmation step before the fix, hypotheses are ranked, and the fix targets the dominant cost rather than a micro-optimization. Ask for the missing profile or metric if it is decisive.

## Customization points
- Provide `[profile/metrics]`, `[data size]`, or `[latency target]`.
- Scope to CPU, memory, I/O, or scaling.

## Expected output
Ranked hypotheses, a confirmation/measurement step for the top one, the fix with expected impact, and a regression watch.

## Common issues & fixes
- Guesses a fix with no measurement → require a confirmation step first.
- Chases micro-optimizations → refocus on the dominant cost.

## Changelog
- 2026-07-15: Initial entry.
- 2026-07-15: Optimized — added an explicit verification/self-check step.
