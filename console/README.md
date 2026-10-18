# Console mode

Run an idea through a chain of **cards** — small, reusable brand-asset prompts (brand voice, visual style guide, brand guidelines, …) — editing the result between each step.

## Run

```bash
node --env-file=.env console/console.mjs
```

Pick a chain (e.g. `1,3` or `brand-voice,brand-guidelines`), enter your idea, and the console runs it: **card → edit → card → edit → …**. Between cards the intermediate result opens in `$EDITOR` (default `vi`). Uses the OpenRouter setup from `.env` (see [`../.env.example`](../.env.example)).

For lower-input owner workflows, start at [`../docs/START.md`](../docs/START.md). `node scripts/ee.mjs audit draft.md` and `example brief.md` run the registered workflows without opening an editor; add `--edit` when you want between-card review. `list`, `status`, `show`, and `check` inspect saved work without model calls. `resume` preserves the editing policy of the saved run. These commands load an existing root `.env` only for an explicitly requested audit, example, or resume.

Real owner drafts are approved only for Claim Audit and Illustrative Examples, D0/D1, through the one [policy register row](../operations/AI-DATA-POLICY.md#approved-tool-register). General engineering and brand libraries use synthetic or deliberately public input under current scope. No card gives this text-only runner tools, retrieval, source verification, or code execution.

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

Whenever a run finishes, stops for input, or fails after dispatch, the runner prints a usage line to stderr. Totals include every recorded request attempt, including clarification exchanges and failed/malformed replies, plus provider-reported cost when available. Missing usage or cost is labeled partial; it is never presented as a complete zero-cost total. Legacy records contain only the last usage per stage, so their overwritten retries cannot be recovered and the summary says so. Each stage's `usage` remains the latest-attempt value for compatibility. A call has a 300-second deadline by default (`OPENROUTER_TIMEOUT_MS` overrides it); a stage that times out is marked failed and `--resume` retries only that stage.

## Saved runs and stage outcomes

Every request attempt is checkpointed atomically to `console/runs/<id>.json` (gitignored) before dispatch and after its outcome: original brief/profile, questions and owner answers, exact system/user messages, requested model, card/system hashes, timestamps, raw reply, usage, accepted edits, and next stage. A request still in flight when interrupted is marked interrupted when retried; its unreported usage stays unknown. The runner appends a short response-format contract to each card's prompt, and a reply is accepted only if its first line is exactly one of these (bold or backtick marks and letter case are forgiven; extra words or a code fence are not):

- `STATUS: COMPLETE` — the deliverable follows and moves on to the next card.
- `STATUS: NEEDS_INPUT` — the run stops and shows the questions. `--resume` asks for your answer (or takes `--answer`) and re-runs **the same stage** with the questions and answers appended.
- `STATUS: BLOCKED` — the run stops with the reason; `--resume` retries the stage.

A provider error, or a reply with no valid status line, marks the stage `failed`, keeps the raw reply, and stops. Nothing is retried automatically, so a failed run never silently spends twice. Exit code `2` means the run stopped for input or a block.

```bash
node --env-file=.env console/console.mjs --resume
```

Resume preserves the run's editing policy and the exact stage input, including answers to clarifying questions. Resolved questions and answers also accompany every later card. Owner answers are additionally labeled as supplied PROFILE context so cards' source rules recognize them; generated questions remain question context and never become evidence. Checkers use the same owner-only source boundary. Completed stages whose edit was skipped stay accepted; they are not reopened when downstream work resumes. Inputs are saved before dispatch, so an interrupted request can be retried with the same context. Run IDs include a random suffix, and plain `--resume` selects the most recently saved run.

Each stage keeps its initial prompt hash and the hash/model most recently used; each attempt preserves its own exact messages and hashes. If a card file changed since the last recorded instructions, `--resume` warns and unfinished stages use the current text. Changing `--model` affects new attempts; earlier requested models remain in history. These records identify the requested model, not OpenRouter's resolved upstream provider. Run ids may contain only letters, digits, `_`, `.`, and `-`. Existing version-1 records remain readable; malformed records produce a recovery message instead of a generic exception.

Run records and exports contain plaintext drafts and full request history. Delete completed data using `node scripts/ee.mjs finish <explicit-id>` after keeping any approved result you need. It removes that JSON record and marked Markdown exports in `console/runs/`; absolute exports outside that directory require separate cleanup. It refuses `latest` as a deletion target. See [`../docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) for the local data flow and [`../operations/AI-DATA-POLICY.md`](../operations/AI-DATA-POLICY.md) for retention limits.

Checker exports require a `.md` filename. A `.json` export would collide with saved-run discovery and could overwrite the record needed for resumption, so it is refused. Relative paths stay within `console/runs/`, including when a parent directory is a symlink; an absolute path explicitly selects another directory. The selected parent directory must already exist. Symlink destinations are refused, and exports replace regular files atomically with private permissions, preserving any other file hard-linked to an old export. A failed write leaves the previous export intact.

`--resume --dry-run` (or `--run <id> --dry-run`) previews the chain without credentials, provider requests, editing, or changes to the saved record.

Unknown flags, a flag missing its value, or a flag that would swallow the next flag are errors in both this command and `scripts/llm.mjs`; nothing is sent to a provider. Use `--opt=<value>` for a value starting with `-`.

## Quality bar & ownership

Before a card enters the library: it has worked for its task a few times, its output is consistent enough to reuse, someone else could run it from the listed prerequisites, and its failure modes are written into "Common issues & fixes." The repository owner maintains the library — reviewing new cards, merging duplicates, and retiring stale ones. `node --test tests/*.test.js` enforces the format on every runnable card.

## Flags

| Flag | Meaning |
| --- | --- |
| `--dir <path>` | Run a different card library (default `console/cards`), e.g. `--dir prompts`. |
| `--allow-unregistered-model` | Send a model with no row in the [policy register](../operations/AI-DATA-POLICY.md). Without it, anything but `tencent/hy3` (including `:free` variants) is refused before a request or run record. Synthetic text only. |
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
