# CONTINUE — Exemplary Examples™ (updated 2026-07-15)

Pick-up point for the next session. Repo: `/Users/ryanjohnson/Projects/nonsense/exemplary-examples`.

## TL;DR
- Project is a **Local Edition** — complete, local-only, not commercial. See [`../LOCAL-EDITION.md`](../LOCAL-EDITION.md) and [`../STATUS.md`](../STATUS.md).
- Latest work built a **prompt-library / console system**. It's done and tested.
- **1 commit unpushed** on `main` (`8fc1b48`). Push it when ready — nothing else pending.

## What We Built (this stretch)
- `console/console.mjs` — card+chain engine: run an idea through a chain of prompt "cards" with an `$EDITOR` edit phase between each. Reuses the OpenRouter caller.
- `console/cards/` — brand-asset cards (brand voice, visual style guide, brand guidelines), standard entry format.
- `prompts/` — general **AI-engineering prompt library**: 14 cards, 2 per category (architecture, agent-workflows, coding, review, research, testing, debugging). See [`../prompts/README.md`](../prompts/README.md).
- `scripts/llm.mjs` — zero-dep OpenRouter caller; exports `chat()`; CLI only runs when executed directly.
- `tests/cards-contract.test.js` — enforces the standard card format across both libraries.
- `.github/workflows/lighthouse.yml` — on-demand production Lighthouse.
- `docs/happy-path.md` — local smoke-test walkthrough. `docs/demo--sales.md` — sales demo script.

## Decisions Made
- **Cards are data, not code** — a `.md` per card; only the `## Prompt` section is sent to the model; metadata is docs + tested.
- **One engine, two libraries** — brand cards in `console/cards/`, general library in `prompts/`; run either with `--dir`.
- **Kept generic AI-eng categories out of the brand console** — the general library is separate.
- **Prompt optimization = uniform verification-step pass**, not idiosyncratic rewrites (all 14 cards now self-check before output).
- **Sales demo is straight, not in-universe** — honesty is the pitch; audience is Ryan + a few people.

## What's Next
- Push `main` to origin (1 commit) — Ryan, when ready.
- Optional: deeper-optimize a specific card via the built-in `prompt-optimization` card.
- Optional: a standalone general prompt library *outside* this repo (offered; not started).

## Open Questions
- Push the unpushed commit now, or keep local?
- Any prompt cards worth a deeper (per-card) rewrite vs. the uniform pass done?
- Add categories/cards to the library, or is 14 enough for now?

## Project Status Snapshot
- Exemplary Examples (Local Edition): Done
- Prompt library / console: Active
- Company/commercial roadmap: Paused (archived in [`../ROADMAP.md`](../ROADMAP.md))

## How to Resume
```bash
cd /Users/ryanjohnson/Projects/nonsense/exemplary-examples
node --test tests/*.test.js                 # all pass (13)
git status -sb                              # expect: ahead of origin by 1

# run the prompt libraries (needs OPENROUTER_API_KEY in .env)
node console/console.mjs --dir prompts --list
node console/console.mjs --list             # brand cards
node console/console.mjs --selftest         # offline
```
Full local walkthrough: [`happy-path.md`](happy-path.md). Console/card docs: [`../console/README.md`](../console/README.md).
