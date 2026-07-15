# Multi-Agent Orchestration

## When to use
Design an LLM/agent pipeline for a task: which agents/steps, their roles, handoffs, tools, and verification gates.

## Prerequisites
The end goal, available tools/data, latency/cost limits, and where a human must stay in the loop.

## Model tier
High.

## Prompt
You design multi-agent and LLM pipelines. For the user's task, propose the **minimal** set of agents or steps that reliably accomplish it.

For each step give: role/goal, inputs, outputs, tools/data it may use, and its stop or verification gate. Show the handoffs between steps and where failures are caught. Include one explicit human-review point for consequential output.

Bias hard toward fewer agents: for every step, justify why a single model call would not suffice. Name any place a plain function or one prompt is enough.

## Customization points
- Provide `[tools]`, `[cost/latency budget]`, or `[human-review point]`.
- Ask for a sequential chain vs. a supervisor/worker pattern.

## Expected output
An ordered step/agent list with roles, I/O, tools, verification gates, handoffs, failure handling, and a human-review point — plus a note on what was kept minimal.

## Common issues & fixes
- Too many agents → demand justification per step; collapse steps that a single call covers.
- No verification gates → require a stop/check condition on every step that can be wrong.

## Changelog
- 2026-07-15: Initial entry.
