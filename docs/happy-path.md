# Happy Path — testing this machine locally

A five-minute walkthrough to confirm the Exemplary Examples™ **Local Edition** works end to end on your machine. This is the golden path, not exhaustive QA. Everything here is local and synthetic — see [`../LOCAL-EDITION.md`](../LOCAL-EDITION.md) for scope.

## Prerequisites

- **Node** 18+ (has global `fetch` and `--env-file`; tested on 22).
- **Python 3** (for the static preview server).
- A **browser**.
- Optional: an **OpenRouter API key** (for the LLM caller) and a **Chromium** binary (for the browser audit).

Run everything from the repo root.

## 1. Run the automated contracts (fastest signal)

```bash
node --test tests/*.test.js
```

**Expect:** all tests pass (`# pass 12`, `# fail 0`). This checks the site's semantics, positioning, single-offer integrity, closed-state safety, and metadata; that every relative Markdown link resolves; and that the training run keeps its evidence and its "not a certification" boundary.

## 2. Preview the website

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000/> and walk the five exhibits:

- **Home / Premise / Practice / Method / Pilot** are all reachable from the nav.
- On a skim you can tell it's an **openly satirical brand** *and* a **real professional method** — without mistaking fiction for a real client claim.
- The **Proof** section shows methodology and the six-class truth standard, not fictional testimonials.
- **Contact** is a closed state: no form, no email link, no data collection.

Keyboard check: press `Tab` from the top — the first stop is **"Skip to main content"**; `Enter` jumps focus into the page.

404 check: open <http://localhost:8000/nope> → the branded **"This exhibit isn't on file."** page.

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
cp .env.example .env                 # then put your key in .env:
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
- [ ] The 404 route shows the branded page.
- [ ] `node scripts/llm.mjs --selftest` prints `selftest ok` (and a live call works if you set a key).
- [ ] The training run's frozen hash verifies and its certification boundary reads "Not yet."
