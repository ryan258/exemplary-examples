# 101 — Gaining Insight and Profit with Exemplary Examples™

A working guide to getting real value out of this repository.

**On the word "profit":** there is no commercial offer here, no intake, and nothing to buy or sell — see [`../LOCAL-EDITION.md`](../LOCAL-EDITION.md). Profit in this guide means *leverage on your own real work*: better output from models, and claims you can defend when someone pushes back. If you came looking for the consultancy, it is fiction, and deliberately so.

This guide assumes you have never run anything here. If you only want to confirm the machine works, read [`happy-path.md`](happy-path.md) instead — that is a five-minute smoke test. This is the longer "how do I actually use it" document.

---

## 1. What you actually get

Three assets, in descending order of how much they will matter to you.

| Asset | What it is | Where |
| --- | --- | --- |
| **The evidence method** | A six-class scheme for labeling every claim, plus the review habits around it. Portable to any work you do, with or without this repo. | [`../README.md`](../README.md), [`../training/`](../training/) |
| **The card runner** | A ~200-line CLI that chains Markdown prompt files through a model, letting you edit between steps. | [`../console/README.md`](../console/README.md) |
| **The prompt library** | 14 task-shaped system prompts for technical work — review, architecture, debugging, research, testing. | [`../prompts/README.md`](../prompts/README.md) |

The satirical consultancy wrapped around all of this is a container, not the product. The method is the product.

---

## 2. Setup

Two paths. Pick based on whether you want to read or to run.

### Reading only — no key, no cost

```bash
hugo server          # → http://localhost:1313/
```

Serves the generated site on loopback only. The repository directory is never a document root, so `.env` and `.git/` are not reachable. **Do not** substitute a generic static server on the repo root — that publishes your credentials to anything that can reach the port.

You also do not need Hugo at all: every document is Markdown in the repository and reads fine in an editor. The site exists for browsing and cross-linking.

### Running cards — needs Node 20.6+ and a key

```bash
cp -n .env.example .env     # -n never clobbers an existing .env
```

Put an [OpenRouter](https://openrouter.ai/) key in `.env` as `OPENROUTER_API_KEY`, and a model slug as `OPENROUTER_MODEL`. See [`../.env.example`](../.env.example).

Verify without spending anything:

```bash
node console/console.mjs --dir prompts --list
node console/console.mjs --dir prompts --dry-run --cards system-design,code-review --idea "a rate limiter"
```

`--dry-run` composes the whole chain and prints the plan without contacting a provider. Use it every time you build a new chain.

---

## 3. The insight half: the six-class truth standard

This is the part worth stealing even if you never run a card.

Every material claim in a professional artifact belongs to exactly one class, and each class carries an obligation:

| Class | What you owe the reader |
| --- | --- |
| Sourced fact | A retrievable source, its context, and the date you accessed it |
| Supplied fact | Attribution to whoever supplied it |
| Calculation | Reproducible inputs, the formula, and units |
| Inference | The supporting facts, and your reasoning exposed |
| Modeled scenario | Assumptions, method, sensitivities, and limitations |
| Satirical fiction | Clear placement inside the fictional frame |

> If a reasonable audience could mistake constructed material for verified real-world fact, change the labeling, sourcing, design, or artifact.

### Why this earns its keep

Model output is uniformly confident across all six classes. It renders a retrieved fact, an arithmetic result, a plausible inference, and an invention in the same register, with the same cadence. The classification is the thing that breaks that flatness back apart.

Applied to a paragraph of model output, the exercise is mechanical:

1. Split it into individual claims — usually more than you expect.
2. Label each one.
3. For every **sourced fact**, go get the source. Not "it sounds right." The source.
4. For every **calculation**, recompute it yourself.
5. For every **inference**, ask what would have to be true, and whether it is.
6. Anything you cannot place in a class is not a claim yet. Cut it or downgrade it.

Most of the value shows up at step 3, and it is uncomfortable the first few times.

### The habits around it

Four more, drawn from the training material:

- **Ask for counterevidence explicitly.** A model asked to support a position will support it. Ask what would falsify it, separately, in its own request.
- **State reversal conditions.** "I would change this recommendation if X." If nothing would change it, you have a preference, not an analysis.
- **Keep generation and review separate.** The same context that produced an answer is the worst context for judging it. A self-check inside one prompt is a useful habit, not independent verification — do not record it as such.
- **Do not let a critical failure average away.** One disqualifying defect is not offset by nine good sections. Score it as disqualifying.

---

## 4. The profit half: running the library on real work

### The mental model

```text
your input text
      ↓
  [card 1]  ← the card's "## Prompt" section is the system prompt
      ↓
  model output  →  you edit it in $EDITOR
      ↓
  [card 2]  ← receives the ORIGINAL BRIEF plus the edited output
      ↓
  final text
```

Every card is one Markdown file. Adding a card means dropping a `.md` in a directory. There is no registry, plugin system, or code change.

### Browse and pick

```bash
node console/console.mjs --dir prompts --list
```

Fourteen cards in seven categories: `agent-workflows`, `architecture`, `coding`, `debugging`, `research`, `review`, `testing`.

### Run one card

```bash
node --env-file=.env console/console.mjs --dir prompts \
  --cards code-review --idea-file /path/to/your.diff
```

### Chain cards

```bash
node --env-file=.env console/console.mjs --dir prompts \
  --cards system-design,code-review --idea "…" --no-edit
```

Between steps, the runner opens `$EDITOR` so you can correct the intermediate result before it becomes the next step's input. **Use this.** It is the highest-value thirty seconds in the whole loop — you are cutting off the errors that would otherwise compound through every subsequent step. `--no-edit` skips it for unattended runs; prefer the interactive path while you are learning what a chain does.

### Chains worth trying

| Goal | Chain |
| --- | --- |
| Design something, then attack the design | `system-design,code-review` |
| Understand a bug before fixing it | `failure-analysis,implement-from-spec` |
| Harden code you already have | `edge-cases,test-generation` |
| Decide between options and record why | `comparative-analysis,adr` |
| Improve a prompt you are writing | `prompt-optimization` |

### Argument rules worth knowing

The parser is strict on purpose — a typo must not reach a paid call.

```bash
--modle claude-x                  # → Unknown option "--modle". Try --help.
--cards                           # → --cards needs a value.
--model --idea "x"                # → --model needs a value. (dashed token is the next option)
--idea="-starts with a dash"      # → use = when the value legitimately starts with -
```

Card selection prefers an exact ID, and refuses ambiguity rather than guessing:

```bash
--cards review    # → "review" matches code-review, security-review. Be specific.
```

---

## 5. Worked example

A real defect from this repository, run end to end.

**The code** — the provider call in [`../scripts/llm.mjs`](../scripts/llm.mjs), before it was fixed:

```js
const json = await res.json();
const content = json.choices?.[0]?.message?.content;
if (content == null) throw new Error(`Unexpected response: ${JSON.stringify(json)}`);
return content;
```

**The run:**

```bash
node --env-file=.env console/console.mjs --dir prompts \
  --cards code-review --idea-file /tmp/llm-excerpt.js
```

**What the card is built to return** — see [`../prompts/review/01-code-review.md`](../prompts/review/01-code-review.md) — is a severity-ranked list where each finding carries a file/line, a one-sentence defect statement, a concrete inputs→wrong-output scenario, and a specific fix.

**The finding you are hoping for:** the function never inspects `finish_reason`. When a provider stops because it hit the token ceiling, it returns `finish_reason: "length"` with partial content, and this code returns that fragment as a successful result. In a chain, that truncated fragment becomes the next card's input.

**Now apply section 3 to the review itself:**

| The review says | Class | What you owe |
| --- | --- | --- |
| "`finish_reason` is never read" | Sourced fact | Read the four lines. It is either there or it is not. Thirty seconds. |
| "A truncated response returns as success" | Calculation-like — it is a claim about behavior | **Run it.** Mock a response with `finish_reason: "length"` and see what comes back. |
| "This will corrupt downstream chain steps" | Inference | Depends on a premise: that some caller feeds the result onward. Check whether one does. |
| "You should return a structured result object" | Modeled scenario | A design proposal with assumptions. Reasonable; not established by anything above. |

Row two is the important one. The claim is checkable by execution, so check it by execution:

```js
globalThis.fetch = async () => ({
  ok: true,
  json: async () => ({ choices: [{ finish_reason: "length", message: { content: "TRUNCATED" } }] }),
});
console.log(await chat({ model: "m", prompt: "p", env }));
```

Before the fix, that prints `TRUNCATED` as a successful return. After, it throws. That eight-line script is worth more than any amount of agreement from a second model, and it is the entire difference between "the review sounds right" and "the review is right."

Row four is where people lose time: the model's design proposal is not wrong, but nothing above it established that a structured result object was needed. The minimal fix — check `finish_reason`, throw on a bad one — is four lines and closes the actual defect.

**Transfer lesson:** the review's value was concentrated in one checkable claim. Find that claim, execute it, and treat everything around it as unverified until it earns better.

---

## 6. How not to get fooled by your own output

A checklist for anything a chain produces that you intend to act on.

- [ ] Every claim has a class from section 3.
- [ ] Every sourced fact has a source you personally opened.
- [ ] Every calculation was recomputed outside the model.
- [ ] Deterministic checks were run where they exist — tests, a schema, a linter, a build. A card's own self-check is not one of these.
- [ ] Counterevidence was requested in a separate call, not the generating one.
- [ ] The final artifact states its own limitations and what would change the conclusion.
- [ ] Anything unverified is labeled unverified in the artifact, not just in your head.

The last one is the one people skip, and it is the one that matters when someone else picks up your work.

---

## 7. Writing your own card

Copy [`../console/cards/_TEMPLATE.md`](../console/cards/_TEMPLATE.md) into a category folder and fill it in. Rules the runner enforces:

- A `## Prompt` section is **required** and must be non-empty. A card without one is rejected at load time, before any request.
- **Only** `## Prompt` is sent to the model. Every other section is for humans.
- Headings inside fenced code blocks are content, not section boundaries — you can include Markdown examples in a prompt safely.
- The card ID is the filename minus any `NN-` ordering prefix. Keep IDs distinct; ambiguous selectors are refused.

What makes a card good:

1. **A shaped output, not a topic.** "Report correctness bugs first, then reuse issues" beats "review this code."
2. **An explicit refusal path.** Tell it what to do when there is nothing to report, or it will invent something.
3. **A per-finding evidence requirement.** "Each finding needs a concrete inputs→wrong-output scenario" is what stops vague output.
4. **A closing self-check.** Useful. Not verification — see section 3.

One honesty note carried over from the existing cards: if you add a self-check instruction to a card, that is an *instruction revision*. Do not log it in the changelog as "optimized" unless you measured something.

---

## 8. Limits — read this before trusting anything

Stated plainly, because the card names oversell the runner:

- **The runner has no tools.** No file reading, no retrieval, no code execution, no network beyond the one model call. A card named "Code Review" reviews the text you paste. It cannot open your repository or run your tests. "Multi-Agent Orchestration" produces a *design* for agents; it does not instantiate any.
- **There is no saved run state.** An interrupted chain starts over. Long or expensive chains are best run in pieces you keep yourself.
- **Unanswered clarifying questions flow downstream.** Several cards open by asking questions. In `--no-edit` mode, a card that responds with a question has that question passed to the next card as though it were finished work. Watch for it.
- **One provider.** OpenRouter, one chat-completions call, no streaming.
- **The training material is a validated *design*, not a credential.** The controlled run in [`../training/dry-runs/2026-07-13-ee-mvq-01-r1/08-DRY-RUN-REPORT.md`](../training/dry-runs/2026-07-13-ee-mvq-01-r1/08-DRY-RUN-REPORT.md) proves the assessment system can execute. It certifies nothing about the outside world, and the record deliberately says "Not Yet."
- **The discovery research is synthetic.** Six fabricated interviews. They establish no demand and no willingness to pay, and must never be cited as market evidence.

---

## 9. Where to go next

| You want | Read |
| --- | --- |
| To confirm the machine works | [`happy-path.md`](happy-path.md) |
| The full method and its curriculum | [`../training/README.md`](../training/README.md), then [`../training/01_foundations/CURRICULUM.md`](../training/01_foundations/CURRICULUM.md) |
| The prompt library's format and quality bar | [`../prompts/README.md`](../prompts/README.md) |
| The runner's own documentation | [`../console/README.md`](../console/README.md) |
| What is in scope and what is deliberately not | [`../LOCAL-EDITION.md`](../LOCAL-EDITION.md) |

---

## The short version

Run `--dry-run` first. Edit between steps. Classify every claim before you act on one. Verify the checkable claims by executing them, not by asking another model whether it agrees.

The method transfers to work that has nothing to do with this repository. That is the whole return.
