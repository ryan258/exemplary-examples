# Console mode

Run an idea through a chain of **cards** — small brand-asset transformers (brand voice, visual style guide, brand guidelines, …) — editing the result between each step.

## Cards are just files

Each `.md` in [`cards/`](cards/) is one card: its first `# Heading` is the title, and the whole file is the system prompt. **Add a card by dropping a new `.md` here — no code changes.** A leading `NN-` on the filename only controls list order.

## Run

```bash
node --env-file=.env console/console.mjs
```

Pick a chain (e.g. `1,3` or `brand-voice,brand-guidelines`), enter your idea, and the console runs it: **card → edit → card → edit → …**. Between cards, the intermediate result opens in `$EDITOR` (default `vi`) so you can shape it before it feeds the next card. Uses the OpenRouter setup from `.env` (see [`../.env.example`](../.env.example)).

## Flags

| Flag | Meaning |
| --- | --- |
| `--list` | List available cards and exit. |
| `--cards a,b` | Pick the chain non-interactively (indices or ids). |
| `--idea "…"` / `--idea-file path` | Provide the input without a prompt. |
| `--no-edit` | Skip the between-card edit phase (auto-chain). |
| `--dry-run` | Print the plan without calling the model. |
| `--model <slug>` | Override `OPENROUTER_MODEL` for this run. |
| `--selftest` | Offline check of card loading and chain resolution (no key/network). |

Example, fully non-interactive:

```bash
node --env-file=.env console/console.mjs --cards brand-voice,visual-style-guide --idea "a members-only notebook" --no-edit
```
