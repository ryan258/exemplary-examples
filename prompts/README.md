# Prompt library — AI engineering

A general, reusable system-prompt library for technical work, organized by task type. It runs on the same card+chain engine as the brand [console](../console/README.md); it's just a different library directory.

## Run

```bash
node --env-file=.env console/console.mjs --dir prompts            # interactive
node console/console.mjs --dir prompts --list                     # browse by category
node --env-file=.env console/console.mjs --dir prompts \
  --cards system-design,code-review --idea "…" --no-edit          # chain non-interactively
```

Pick a chain, give it an idea/input, and the console runs it card → edit → card. Uses the OpenRouter setup from [`../.env.example`](../.env.example).

## Categories

Folders are task types (stable on purpose — don't add narrow, personal, or model-named folders):

| Category | Cards |
| --- | --- |
| `architecture/` | System Design · Architecture Decision Record |
| `agent-workflows/` | Multi-Agent Orchestration · Prompt Optimization |
| `coding/` | Refactor · Implement From Spec |
| `review/` | Code Review · Security Review |
| `research/` | Research Synthesis · Comparative Analysis |
| `testing/` | Test Generation · Edge Case Enumeration |
| `debugging/` | Failure Analysis · Performance Investigation |

## Card format, quality bar, ownership

Every card uses the standard entry format (only the `## Prompt` section is sent to the model). See the format, the template ([`../console/cards/_TEMPLATE.md`](../console/cards/_TEMPLATE.md)), the quality bar, and ownership in the [console README](../console/README.md#card-format). `node --test tests/*.test.js` enforces the format on every card here too.

Add a card by dropping a standard-format `.md` into the right category folder. Chain cards across categories freely — e.g. `system-design` → edit → `code-review`.
