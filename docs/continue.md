# CONTINUE — Exemplary Examples™ (snapshot of 2026-10-17)

Historical pick-up point. **Current status lives in [`../STATUS.md`](../STATUS.md)**; read this for the shape of the console, Hugo work, and extensions, and run `git status -sb` for the actual repository state. Repo: `/Users/ryanjohnson/Projects/nonsense/exemplary-examples`.

## TL;DR
- Project is a **Local Edition** — complete, local-only, not commercial. See [`../LOCAL-EDITION.md`](../LOCAL-EDITION.md) and [`../STATUS.md`](../STATUS.md).
- Accepted extensions under [`../SCOPE-DECISION-CLAIM-AUDIT.md`](../SCOPE-DECISION-CLAIM-AUDIT.md): **Claim Audit** (`claim-audit/`) and **Illustrative Examples** (`examples/`), both bounded to local, D0/D1 non-confidential material.
- Latest work hardened the **prompt card runner**, built **deterministic pack checkers**, added comprehensive **contract suites**, and refined the **Hugo site wrapper**.
- Whether anything is unpushed is a fact about the repository right now, not about this snapshot: check `git status -sb`.

## What We Built (this stretch)
- `scripts/llm.mjs` & `console/console.mjs` — shared strict option parser (`parseOptions`); rejects unknown flags, missing arguments, or options after `--`; enforces registered models from `AI-DATA-POLICY.md` (`assertRegisteredModel`), refusing unregistered or `:free` models before any request unless `--allow-unregistered-model` is explicitly given.
- Runner hardening in `console/console.mjs` — saves every completed stage request to `console/runs/`; requires a `STATUS:` line (`COMPLETE`, `NEEDS_INPUT`, `BLOCKED`, tolerating markdown bold/backticks and case variations) so questions halt execution; adds `--resume`, `--run`, `--answer`, `--profile`, and `--all` flags; tracks per-stage tokens and reported provider cost; handles GUI editor wait flags; safe `--out` output destination via `outPath`; extended timeout to 300s.
- `claim-audit/` — Claim Audit extension v1: four cards (`extract-claims`, `classify-claims`, `evidence-needs`, `safe-rewrite`), `--profile` context injection, mechanical pack checker (`check.mjs`) verifying pack identity, and synthetic test drafts (`_samples/`) with planted defects. Owner-only scope (volunteers excluded).
- `examples/` — Illustrative Examples extension: three cards (`frame-example`, `write-example`, `challenge-example`), mechanical checker (`check.mjs`), mandatory labeling rules, and synthetic test briefs (`_samples/`).
- `layouts/` & `hugo.toml` — `layouts/404.html` with root-relative assets and links; `layouts/_markup/render-blockquote.html` blockquote render hook; skip link and mobile header accessibility fixes in `assets/styles.css`.
- Test suites in `tests/` — 6 suites (71 tests):
  - `tests/cards-contract.test.js` (card format, exact section heading matching, prompt parsing)
  - `tests/documentation-contract.test.js` (links, Local Edition boundaries, manifest SHA-256 hashes, scope decisions)
  - `tests/claim-audit.test.js` (four cards, pack checker, error detection, sample verification, cross-pack rejection)
  - `tests/examples.test.js` (three cards, checker, labeling enforcement, fictional samples)
  - `tests/console.test.js` (option parsing, local mock provider, resume, edit confirmation, brief forwarding, registered model enforcement, flexible status parsing, outPath validation)
  - `tests/site-generated.test.js` (Hugo build route audits, single H1, heading hierarchy, unique IDs, broken link detection)
- CI workflows — `.github/workflows/test.yml` (automated test runner) and `.github/workflows/lighthouse.yml` (audits Hugo build of target commit).
- Policy register — `operations/AI-DATA-POLICY.md` recorded owner's own-use approval for OpenRouter (`tencent/hy3`, D0/D1, retention unknowns stated). Volunteers explicitly excluded.

## Decisions Made
- **Cards are data, not code** — `.md` files; exact `## Prompt` heading extraction; fenced headings ignored; duplicate sections rejected.
- **Four libraries, one runner** — brand cards in `console/cards/`, general engineering in `prompts/`, Claim Audit in `claim-audit/`, and Illustrative Examples in `examples/`; selectable with `--dir`.
- **Run state is atomic and local** — completed steps write atomically to `console/runs/`; resume retries only the incomplete stage; prompts are hashed to detect drift.
- **Checkers are deterministic** — `claim-audit/check.mjs` and `examples/check.mjs` evaluate packs mechanically without model calls, catching structural flaws, unallowed values, and missing disclosures.
- **Extensions stay bounded** — no public hosting, intake, payments, or D2/D3 confidential data. Output is labeled untrusted until independently verified.

## Project Status Snapshot
- Exemplary Examples (Local Edition): Complete
- Console & prompt runner: Active & hardened
- Claim Audit extension: v1 built & synthetically verified (real-asset runs pending exit criteria)
- Illustrative Examples extension: v1 built & synthetically verified
- Hugo doc site wrapper: Complete (tested across all generated routes)
- Company/commercial roadmap: Paused (archived in [`../ROADMAP.md`](../ROADMAP.md))

## How to Resume
```bash
cd /Users/ryanjohnson/Projects/nonsense/exemplary-examples

# run all contract tests (offline, deterministic)
node --test tests/*.test.js

# run offline self-tests
node console/console.mjs --selftest
node scripts/llm.mjs --selftest

# preview documentation & training site
hugo server

# dry-run extension chains (offline)
node console/console.mjs --dir claim-audit --all --dry-run --idea "draft copy"
node console/console.mjs --dir examples --all --dry-run --idea "brief"

# check git status
git status -sb
```
Full local walkthrough: [`happy-path.md`](happy-path.md). Console/card docs: [`../console/README.md`](../console/README.md).
