# Happy Path — testing this machine locally

A five-minute walkthrough to confirm the Exemplary Examples™ **Local Edition** works end to end on your machine. This is the golden path, not exhaustive QA. Everything here is local and synthetic — see [`../LOCAL-EDITION.md`](../LOCAL-EDITION.md) for scope.

## Prerequisites

- **Node** 20.6+ (`--env-file` landed in 20.6.0; global `fetch` in 18). Tested on 22.
- **Hugo** (extended; tested on 0.166) for the preview server.
- A **browser**.
- Optional: an **OpenRouter API key** (for the LLM caller) and a **Chromium** binary (for the browser audit).

Run everything from the repo root.

## 1. Run the automated contracts (fastest signal)

```bash
node --test tests/*.test.js
```

**Expect:** `# fail 0` (the pass count grows as contracts are added). This checks the site's semantics, positioning, single-offer integrity, closed-state safety, and metadata; that every relative Markdown link resolves; and that the training run keeps its evidence and its "not a certification" boundary.

## 2. Preview the website

```bash
hugo server
```

`hugo server` binds to `127.0.0.1` and serves only the generated site from memory — the repository directory is never a document root, so `.env` and `.git/` are not reachable. Don't serve the repo root with a generic static server; that does expose them.

Open <http://localhost:1313/> and walk the five exhibits:

- **Home / Premise / Practice / Method / Pilot** are all reachable from the nav.
- On a skim you can tell it's an **openly satirical brand** *and* a **real professional method** — without mistaking fiction for a real client claim.
- The **Proof** section shows methodology and the six-class truth standard, not fictional testimonials.
- **Contact** is a closed state: no form, no email link, no data collection.

Keyboard check: press `Tab` from the top — the first stop is **"Skip to main content"**; `Enter` jumps focus into the page.

404 check: open <http://localhost:1313/nope> → the branded **"This exhibit isn't on file."** page.

Isolation check: <http://localhost:1313/.env> and <http://localhost:1313/.git/HEAD> both return 404.

Training content: the nav's **Training** link reaches the rendered Markdown; every section page lists its own documents.

**Expect:** no console errors (DevTools → Console), no horizontal scrollbar, legible at narrow widths.

Stop the server with `Ctrl+C`.

## 3. Exercise the LLM caller (optional — needs a key)

The machine's one piece of live tooling is a zero-dependency OpenRouter caller, [`../scripts/llm.mjs`](../scripts/llm.mjs).

Offline check (no key or network needed):

```bash
node scripts/llm.mjs --selftest      # prints: selftest ok
```

Live call:

```bash
cp -n .env.example .env              # -n: never clobber an existing .env
                                     #   OPENROUTER_API_KEY=sk-or-...
node --env-file=.env scripts/llm.mjs "In one sentence, what is Exemplary Examples?"
```

**Expect:** the offline self-test prints `selftest ok`; the live call prints a one-line completion. Change the model in `.env` (`OPENROUTER_MODEL`) or per call with `--model <slug>`.

## 4. Read the training system (optional)

Start at [`../training/README.md`](../training/README.md) and follow "Start here." To see the machine's proof-of-work, open the frozen validation run:

```
training/dry-runs/2026-07-13-ee-mvq-01-r1/
```

`00-RUN-MANIFEST.md` records isolated candidate/assessor sessions and SHA-256 hashes of every frozen artifact. Verify one holds:

```bash
cd training/dry-runs/2026-07-13-ee-mvq-01-r1
shasum -a 256 02-CANDIDATE-OUTPUT.md   # matches the hash listed in 00-RUN-MANIFEST.md
```

**Expect:** the hash matches, and `07-CERTIFICATION-RECORD.md` reads **"Not yet — no external authority granted"** (training validation is not a credential).

## 5. Real-browser audit (optional — needs Chromium)

```bash
CHROMIUM_PATH=/path/to/chrome-headless-shell node tests/browser-audit.cjs
```

**Expect:** JSON report with `"failures": []` across 320–1440px (skip link, landmarks, no overflow, no console errors, reduced-motion honored).

## You know it works when

- [ ] `node --test tests/*.test.js` → all pass.
- [ ] The site previews locally; the satire-and-real-method premise is clear; Contact is closed.
- [ ] The 404 route renders the branded page.
- [ ] `node scripts/llm.mjs --selftest` prints `selftest ok` (and a live call works if you set a key).
- [ ] The training run's frozen hash verifies and its certification boundary reads "Not yet."
