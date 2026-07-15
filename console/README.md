# Console mode

Run an idea through a chain of **cards** — small, reusable brand-asset prompts (brand voice, visual style guide, brand guidelines, …) — editing the result between each step.

## Run

```bash
node --env-file=.env console/console.mjs
```

Pick a chain (e.g. `1,3` or `brand-voice,brand-guidelines`), enter your idea, and the console runs it: **card → edit → card → edit → …**. Between cards the intermediate result opens in `$EDITOR` (default `vi`). Uses the OpenRouter setup from `.env` (see [`../.env.example`](../.env.example)).

## Card format

Each card is one `.md` file in [`cards/`](cards/) using a standard entry format. Only the **`## Prompt`** section is sent to the model; every other section is human-facing documentation and is enforced by the test suite. Copy [`cards/_TEMPLATE.md`](cards/_TEMPLATE.md) to start a new card:

- `# Title`
- `## When to use` — required
- `## Prerequisites`
- `## Model tier` — small / medium / high (shown in `--list`)
- `## Prompt` — required; the system prompt (keep it modular: role, task, constraints, output)
- `## Customization points`
- `## Expected output` — required
- `## Common issues & fixes`
- `## Changelog` — required; date + what changed and why

Files beginning with `_` (like the template) are ignored by the console. A leading `NN-` on the filename only controls list order. Cards may also be grouped into category subfolders (the console recurses and shows the folder as a category).

## Other libraries

This engine also drives the general AI-engineering prompt library in [`../prompts`](../prompts) — run it with `--dir prompts` (see [`../prompts/README.md`](../prompts/README.md)).

## Quality bar & ownership

Before a card enters the library: it has worked for its task a few times, its output is consistent enough to reuse, someone else could run it from the listed prerequisites, and its failure modes are written into "Common issues & fixes." The repository owner maintains the library — reviewing new cards, merging duplicates, and retiring stale ones. `node --test tests/*.test.js` enforces the format on every runnable card.

## Flags

| Flag | Meaning |
| --- | --- |
| `--dir <path>` | Run a different card library (default `console/cards`), e.g. `--dir prompts`. |
| `--list` | List cards (with model tier) and exit. |
| `--cards a,b` | Pick the chain non-interactively (indices or ids). |
| `--idea "…"` / `--idea-file path` | Provide the input without a prompt. |
| `--no-edit` | Skip the between-card edit phase. |
| `--dry-run` | Print the plan without calling the model. |
| `--model <slug>` | Override `OPENROUTER_MODEL` for this run. |
| `--selftest` | Offline check of card loading and chain resolution. |

Example, fully non-interactive:

```bash
node --env-file=.env console/console.mjs --cards brand-voice,visual-style-guide --idea "a members-only notebook" --no-edit
```
