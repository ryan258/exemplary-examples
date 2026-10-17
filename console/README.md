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

## Editing between cards

The editor is `$EDITOR` (then `$VISUAL`, then `vi`). It must block until you close the file. For `code`, `cursor`, `windsurf`, `zed`, `subl`, and `mate` the runner adds the wait flag itself; for any other GUI editor set it yourself (for example `EDITOR="code --wait"`). If the editor hands back the text unchanged, the runner asks before continuing, because the next card is a paid call. An empty result is refused. The temporary draft is deleted after a successful edit and kept only when the edit fails.

## Usage and cost

When a run finishes or stops for input (not when a request fails), the runner prints one line to stderr with total prompt and completion tokens, plus the provider-reported cost when the provider sends one. Each stage records its own `usage` in the saved run. A call has a 300-second deadline by default (`OPENROUTER_TIMEOUT_MS` overrides it); a stage that times out is marked failed and `--resume` retries only that stage.

## Saved runs and stage outcomes

Every completed request is written atomically to `console/runs/<id>.json` (gitignored): the brief, each stage's input and output, your edits, and what happens next. The runner appends a short response-format contract to each card's prompt, and a reply is accepted only if its first line is exactly one of:

- `STATUS: COMPLETE` — the deliverable follows and moves on to the next card.
- `STATUS: NEEDS_INPUT` — the run stops and shows the questions. `--resume` asks for your answer (or takes `--answer`) and re-runs **the same stage** with the questions and answers appended.
- `STATUS: BLOCKED` — the run stops with the reason; `--resume` retries the stage.

A provider error, or a reply with no valid status line, marks the stage `failed`, keeps the raw reply, and stops. Nothing is retried automatically, so a failed run never silently spends twice. Exit code `2` means the run stopped for input or a block.

```bash
node --env-file=.env console/console.mjs --resume
```

Resume preserves the run's editing policy and the exact stage input, including answers to clarifying questions. Completed stages whose edit was skipped stay accepted; they are not reopened when downstream work resumes. Inputs are saved before dispatch, so an interrupted request can be retried with the same context. Run IDs include a random suffix, and plain `--resume` selects the most recently saved run.

Each stage records a hash of the card prompt it started with. If a card file changed since the run began, `--resume` warns and unfinished stages use the current text. Run ids may contain only letters, digits, `_`, `.`, and `-`.

`--resume --dry-run` (or `--run <id> --dry-run`) previews the chain without credentials, provider requests, editing, or changes to the saved record.

Unknown flags, a flag missing its value, or a flag that would swallow the next flag are errors in both this command and `scripts/llm.mjs`; nothing is sent to a provider. Use `--opt=<value>` for a value starting with `-`.

## Quality bar & ownership

Before a card enters the library: it has worked for its task a few times, its output is consistent enough to reuse, someone else could run it from the listed prerequisites, and its failure modes are written into "Common issues & fixes." The repository owner maintains the library — reviewing new cards, merging duplicates, and retiring stale ones. `node --test tests/*.test.js` enforces the format on every runnable card.

## Flags

| Flag | Meaning |
| --- | --- |
| `--dir <path>` | Run a different card library (default `console/cards`), e.g. `--dir prompts`. |
| `--list` | List cards (with model tier) and exit. |
| `--cards a,b` | Pick the chain non-interactively (indices or ids). |
| `--all` | Run every card in the library, in order (not with `--cards`). |
| `--profile <file>` | Add brand/audience context to every card as labeled data; saved with the run. |
| `--idea "…"` / `--idea-file path` | Provide the input without a prompt. |
| `--no-edit` | Skip the between-card edit phase. |
| `--dry-run` | Print the plan without calling the model. |
| `--model <slug>` | Override `OPENROUTER_MODEL` for this run. |
| `--resume` | Continue the most recent saved run at the first unfinished stage. |
| `--run <id>` | Resume a specific saved run (ids are the file names in `console/runs/`). |
| `--answer "…"` | With `--resume`, answer a pending question without a prompt. |
| `--selftest` | Offline check of card loading, argument parsing, and the stage protocol. |

Example, fully non-interactive:

```bash
node --env-file=.env console/console.mjs --cards brand-voice,visual-style-guide --idea "a members-only notebook" --no-edit
```
