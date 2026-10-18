# Full copy-and-paste guide to getting the most out of this tool

Every block below is meant to be copied whole and pasted into a terminal. Blocks run from the repository root unless they say otherwise. Read the one line above each block first: it says whether the block is free or makes a paid model call.

For the short version, see [Start or return](START.md). For the reasoning behind the method, see the [101 guide](101-to-gain-insight-and-profit-with-exemplary-examples.md). This guide is the long, literal one.

**Ground rules that every block respects:**

- Real drafts go only through Claim Audit or Illustrative Examples, only your own non-confidential D0/D1 text, only through OpenRouter with `tencent/hy3`. The approval is the register row in [`AI-DATA-POLICY.md`](../operations/AI-DATA-POLICY.md). Provider retention is unknown, so paste only text you would be comfortable seeing public.
- Anyone else's drafts, real customer results, and D2/D3 material stay out. The technical prompt library and brand cards take public or synthetic text only.
- Run records under `console/runs/` hold plaintext. Keep your own drafts outside the repository and never stage run records.
- A clean checker result proves a mechanical contract held. It does not prove a claim is true.

---

## 0. One-time setup

Free. Confirms the tools are present and moves into the repository:

```bash
cd /Users/ryanjohnson/Projects/nonsense/exemplary-examples
node --version   # needs v20.6 or newer
hugo version     # only needed for the local site
```

Free. Creates `.env` from the example without overwriting an existing one, then opens it:

```bash
cp -n .env.example .env
${EDITOR:-vi} .env
```

Inside `.env`, set these two lines and save. Get a key at <https://openrouter.ai/keys>:

```text
OPENROUTER_API_KEY=sk-or-...your key...
OPENROUTER_MODEL=tencent/hy3
```

Free. A short `ee` command for this shell session:

```bash
alias ee="node $PWD/scripts/ee.mjs"
ee --help
```

Optional and free. Makes `ee` permanent. Nothing in the project edits your shell configuration for you; this line does, so run it only if you want that:

```bash
echo "alias ee='node /Users/ryanjohnson/Projects/nonsense/exemplary-examples/scripts/ee.mjs'" >> ~/.zshrc
```

Optional and free. A private working folder outside the repository for your own drafts, briefs, and profiles:

```bash
mkdir -p ~/ee-work && chmod 700 ~/ee-work
```

Optional. If you want to edit between cards in VS Code (or `cursor`, `zed`, `subl`, `windsurf`, `mate`), the runner adds the wait flag itself:

```bash
export EDITOR=code
```

For any other GUI editor, include its wait flag, for example `export EDITOR="myeditor --wait"`.

---

## 1. Confirm everything works

Free. No model call, no key needed:

```bash
node console/console.mjs --selftest
node scripts/llm.mjs --selftest
node --test tests/*.test.js
ee status
ee list
```

Expect both selftests to report success and the test suite to pass. `ee list` says "No saved runs" on a fresh checkout.

---

## 2. Rehearse on the fictional samples

Do this once before your own material. It shows the full loop on text that is invented on purpose.

Free. Prints the four-card Claim Audit plan and the three-card Examples plan:

```bash
ee audit claim-audit/_samples/synthetic-draft-01.md claim-audit/_samples/profile.example.md --dry-run
ee example examples/_samples/brief-01.md examples/_samples/profile-01.example.md --dry-run
```

**Paid.** A Claim Audit of the fictional Larkspur draft:

```bash
ee audit claim-audit/_samples/synthetic-draft-01.md claim-audit/_samples/profile.example.md
```

**Paid.** An illustrative example for the fictional Hollis Street Bakery. In testing this cost about one cent and took a minute or two:

```bash
ee example examples/_samples/brief-01.md examples/_samples/profile-01.example.md
```

Free. Inspect and check what came back:

```bash
ee list
ee show latest
ee check latest
```

Then skip to [section 7](#7-review-before-you-use-anything) and practice the review on the sample output.

---

## 3. Audit your own draft (Claim Audit)

Claim Audit takes marketing or business copy and returns every claim classified under the six-class standard, the evidence each one still needs, and a safer rewrite with `[UNVERIFIED: …]` annotations where support is missing.

Free. Creates a draft file to paste your copy into:

```bash
cat > ~/ee-work/draft.md <<'EOF'
# Paste your own D0/D1 draft below this line, then delete this line.

EOF
${EDITOR:-vi} ~/ee-work/draft.md
```

Optional and free. A profile gives the cards your context. It cannot approve new data or change a card's rules. Facts listed under "Facts supplied by the client" can be classed as Client-provided fact; anything else cannot:

```bash
cat > ~/ee-work/profile.md <<'EOF'
Brand: 
Audience: 
Voice: 
Claims policy: 

Facts supplied by the client (class: client-provided fact):
- <fact> (source: <document or system>, owner: <who keeps it>)
EOF
${EDITOR:-vi} ~/ee-work/profile.md
```

Free. Preview the plan:

```bash
ee audit ~/ee-work/draft.md ~/ee-work/profile.md --dry-run
```

**Paid.** Run it unattended:

```bash
ee audit ~/ee-work/draft.md ~/ee-work/profile.md
```

**Paid.** Or run it with a pause in your editor between cards. This is worth the extra minute: fixing a misquoted claim or a wrong class after card 1 stops the error from carrying through cards 2–4:

```bash
ee audit ~/ee-work/draft.md ~/ee-work/profile.md --edit
```

Drop the profile path from any of these if you have no profile.

---

## 4. Make an illustrative example (Illustrative Examples)

Illustrative Examples produces an openly labeled, assumption-based example for a small business. It never uses real customer results or invented statistics, and every output keeps the line `Illustrative example — not a real customer or result.`

Free. Creates a brief. Write the business, the offer, who buys, and the one hesitation the example has to answer:

```bash
cat > ~/ee-work/brief.md <<'EOF'
<Business> is <what it is>. It sells <product> for <price>. It is launching <offer>.

Who buys: <who, and how they buy today>.

The hesitation we need the example to answer: "<the objection, in the customer's words>"
EOF
${EDITOR:-vi} ~/ee-work/brief.md
```

Optional and free. A profile with voice, claims policy, and supplied facts. Every number the example uses must come from here or the brief, or be explicitly marked ASSUMED:

```bash
cat > ~/ee-work/example-profile.md <<'EOF'
Voice: 
Claims policy: no guarantees; no named real businesses or people; no testimonials.

Facts supplied by the business:
- 
EOF
${EDITOR:-vi} ~/ee-work/example-profile.md
```

Free, then **paid**:

```bash
ee example ~/ee-work/brief.md ~/ee-work/example-profile.md --dry-run
ee example ~/ee-work/brief.md ~/ee-work/example-profile.md
```

Add `--edit` to the paid line to review between the frame, write, and challenge cards.

---

## 5. When a run stops

Each card must open its reply with a `STATUS:` line. A run stops (exit code `2`) when a card asks a question or reports it is blocked, and fails when a reply has no valid status line or the provider errors. Nothing retries automatically.

Free. See where it stopped and why:

```bash
ee status latest
ee show latest
```

**Paid.** Answer a pending question and continue the same stage:

```bash
ee resume latest "your short answer here"
```

**Paid.** Continue a named run, for example after a timeout or a `BLOCKED` stage you have fixed the cause of:

```bash
ee list
ee resume RUN_ID
```

Free. Preview what a resume would send, without credentials or changes to the record:

```bash
ee resume latest --dry-run
```

A stage whose request may have reached the provider before an interruption can be billed again when resumed. `ee status` says so when the outcome is unknown.

---

## 6. Check and export

Free. Runs the matching mechanical checker on a finished run:

```bash
ee check latest
```

Free. Checks and saves the pack to `console/runs/pack.md` (gitignored, private permissions, marked so `finish` can remove it):

```bash
ee check latest pack.md
```

Use a different `.md` name per run, for example `ee check RUN_ID launch-page-audit.md`. A relative name always lands inside `console/runs/`. An absolute path writes elsewhere, and `finish` will not clean it up.

`ERROR` findings (exit `1`) mean the pack broke a card rule: fix it with `--edit` on a fresh run or by hand before using it. `WARN` findings are things to look at, such as a number in the rewrite that you never supplied.

---

## 7. Review before you use anything

Copy this checklist into your notes for each pack:

```text
Pack: RUN_ID
[ ] Read the whole claim register, not just the High priorities
[ ] Inspected every row with a Risk flag, whatever its Priority
[ ] Opened the source for every Sourced fact myself
[ ] Recomputed every Calculation outside the model
[ ] For every Inference: wrote what would have to be true, and checked it
[ ] Resolved or removed every [UNVERIFIED: ...] annotation
[ ] Checker WARN lines reviewed and explained
[ ] Example only: label line present; every number SUPPLIED, ASSUMED, or DERIVED with a formula
[ ] Example only: framing and source notes kept with the example
[ ] Anything still unverified is labeled unverified in the final copy
```

A pack that still contains `[UNVERIFIED: …]` is not publishable copy. The model's own Pass checklist is a self-check, not independent verification. Priority orders the work within one draft; it is not a safety rating.

Optional. To record whether the tool was useful on a real asset, fill in the [evaluation worksheet](EVALUATION.md). It starts empty on purpose.

---

## 8. Finish and clean up

When you have copied out what you want to keep, delete the run and its marked exports. Free, and permanent for that run:

```bash
ee list
ee finish RUN_ID
```

`finish` needs the explicit id; it refuses `latest`. It does not touch your files in `~/ee-work/` or exports written to an absolute path. Remove those yourself when done:

```bash
ls ~/ee-work
```

Free. Confirms nothing private is about to enter Git:

```bash
git status --short
```

`console/runs/` and `.env` should never appear in that list.

---

## 9. Browse the local site

Free. Starts Hugo on loopback only; open <http://localhost:1313/> yourself and stop with Ctrl+C:

```bash
ee preview
```

Owner start page: <http://localhost:1313/start/>. Do not serve the repository root with any other static server: that exposes `.env` and `.git/`.

---

## 10. The technical prompt library (public or synthetic text only)

Fourteen cards for engineering work. The runner has no tools: a card named "Code Review" reviews the text you give it and cannot open a repository or run tests.

Free. List the cards and preview a chain:

```bash
node console/console.mjs --dir prompts --list
node console/console.mjs --dir prompts --dry-run --cards system-design,code-review --idea "a rate limiter for a public API"
```

**Paid.** One card on a file:

```bash
node --env-file=.env console/console.mjs --dir prompts --cards code-review --idea-file /path/to/public-or-synthetic.diff
```

**Paid.** Chains worth trying. Each opens your editor between cards; add `--no-edit` to run unattended:

```bash
node --env-file=.env console/console.mjs --dir prompts --cards system-design,code-review --idea "a rate limiter for a public API"
```

```bash
node --env-file=.env console/console.mjs --dir prompts --cards failure-analysis,implement-from-spec --idea-file /path/to/public-bug-report.md
```

```bash
node --env-file=.env console/console.mjs --dir prompts --cards edge-cases,test-generation --idea-file /path/to/public-function.js
```

```bash
node --env-file=.env console/console.mjs --dir prompts --cards comparative-analysis,adr --idea "SQLite versus flat JSON files for a single-user local tool"
```

```bash
node --env-file=.env console/console.mjs --dir prompts --cards prompt-optimization --idea-file /path/to/your-prompt.md
```

Use `--idea="-text"` when the input starts with a dash. Ambiguous card names are refused rather than guessed, so `--cards review` fails; use `code-review` or `security-review`.

---

## 11. The brand cards (synthetic or public text only)

Free, then **paid**:

```bash
node console/console.mjs --list
node console/console.mjs --dry-run --cards brand-voice,visual-style-guide,brand-guidelines --idea "a members-only notebook"
node --env-file=.env console/console.mjs --cards brand-voice,visual-style-guide,brand-guidelines --idea "a members-only notebook"
```

**Paid.** Interactive mode, which asks for the chain and the idea:

```bash
node --env-file=.env console/console.mjs
```

---

## 12. Write your own card

Free. Copies the template into a new category folder in the technical library:

```bash
mkdir -p prompts/writing
cp console/cards/_TEMPLATE.md prompts/writing/01-plain-summary.md
${EDITOR:-vi} prompts/writing/01-plain-summary.md
```

Only the `## Prompt` section is sent to the model. `## When to use`, `## Expected output`, and `## Changelog` are also required. The card id is the filename without its `NN-` prefix, so this one is `plain-summary`.

Free. Confirms the new card loads and passes the format contract:

```bash
node console/console.mjs --dir prompts --list
node console/console.mjs --dir prompts --dry-run --cards plain-summary --idea "test"
node --test tests/cards-contract.test.js
```

A good card asks for a shaped output, says what to do when there is nothing to report, requires evidence per finding, and ends with a self-check. When you later change a card, edit one at a time and log it in its Changelog as an "instruction revision". Write "optimized" only when you measured something.

---

## 13. Maintainer checks

Free. The full offline suite plus the runner selftest:

```bash
node --test tests/*.test.js
node console/console.mjs --selftest
```

Free. Focused checks after a narrow change:

```bash
node --test tests/documentation-contract.test.js
node --test tests/claim-audit.test.js
node --test tests/examples.test.js
node --test tests/cards-contract.test.js
```

Optional and free. A real-browser audit; needs Playwright and a browser already installed, and downloads nothing:

```bash
node scripts/audit-site.cjs
```

None of these make model calls, so they prove rules and plumbing, not model judgment. Do not edit anything in `training/dry-runs/2026-07-13-ee-mvq-01-r1/`; it is hash-checked.

---

## 14. Troubleshooting

| You see | Do this |
| --- | --- |
| `zsh: command not found: ee` | Run the alias block in [section 0](#0-one-time-setup) again; aliases last one shell session. |
| A missing-key error before any request | Set `OPENROUTER_API_KEY` in `.env` at the repository root. |
| A model refused before any request | Set `OPENROUTER_MODEL=tencent/hy3` in `.env`. No other model is registered for real drafts. |
| `Unknown option "--…"` | A typo; nothing was sent. Run `ee --help` or `node console/console.mjs --help`. |
| `"review" matches code-review, security-review` | Use the exact card id from `--list`. |
| Run stopped with questions (exit `2`) | `ee resume latest "your answer"` |
| A stage failed or timed out | `ee status latest`, then `ee resume latest`. For slow models raise `OPENROUTER_TIMEOUT_MS` in `.env`. |
| Editor returns immediately and the runner asks to continue | Your GUI editor is not blocking. Set `EDITOR` with its wait flag. |
| `Run … is not a Claim Audit or Illustrative Examples pack` | `ee check` only checks those two workflows. Other runs: `ee show RUN_ID`. |
| Export refused | The name must end in `.md`, its folder must exist, and it cannot be a symlink. |
| `hugo` not found on `ee preview` | Install Hugo, or read the Markdown directly in an editor. |

---

## 15. Daily cheat sheet

```bash
ee status                         # where things stand (free)
ee list                           # saved runs (free)
ee show latest                    # latest result (free)
ee audit ~/ee-work/draft.md       # Claim Audit (paid)
ee example ~/ee-work/brief.md     # Illustrative example (paid)
ee resume latest "answer"         # continue a stopped run (paid)
ee check latest pack.md           # check and export (free)
ee finish RUN_ID                  # delete run and marked exports (free, permanent)
ee preview                        # local site at http://localhost:1313/ (free)
```

Dry-run first, edit between cards when it matters, classify every claim before you act on one, and verify the checkable claims yourself.
