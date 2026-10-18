# Happy path — use and check the local project

This walkthrough separates offline plumbing, paid owner workflows, and an optional human browser pass. It does not assert fresh model usefulness, browser acceptance, or full training validation. For fewer commands, start with [Start or return](START.md).

## Prerequisites

- Node 20.6+ for `--env-file` support; the provider caller uses built-in fetch.
- Hugo for local site preview/build.
- An existing OpenRouter key only if you choose a paid workflow; see `.env.example`.
- An installed browser only if you choose to inspect the site; optional audit prerequisites are below.

Run from the repository root. Use `node scripts/ee.mjs` wherever the short `ee` alias has not been set.

## Inspect without a model call

```bash
node scripts/ee.mjs status
node scripts/ee.mjs list
node console/console.mjs --selftest
node scripts/llm.mjs --selftest
node console/console.mjs --dir claim-audit --all --dry-run --idea "fictional sample"
node console/console.mjs --dir examples --all --dry-run --idea "fictional sample"
```

Expect selftests to report success and dry runs to print the ordered plan. None contacts a provider. A saved run's `STATUS: COMPLETE` only means the model returned a valid stage status; use its checker and owner review separately.

## Use one approved owner workflow

Read `operations/AI-DATA-POLICY.md` before invoking a live call. The only real-draft approval is your own D0/D1 material through your OpenRouter account with paid `tencent/hy3`, for Claim Audit and Illustrative Examples. Retention remains unknown. Anyone else's drafts, D2/D3 data, and private engineering drafts remain outside that approval.

```bash
# These commands make paid model calls when you invoke them.
node scripts/ee.mjs audit /path/to/your-draft.md /path/to/your-profile.md
node scripts/ee.mjs example /path/to/your-brief.md

# Inspect, resume deliberately, then check a particular run.
node scripts/ee.mjs show RUN_ID
node scripts/ee.mjs resume RUN_ID "answer to the pending question"
node scripts/ee.mjs check RUN_ID pack.md
```

The helper loads an existing `.env`, uses the registered model and skips between-card editing. For editing, use the direct runner and its documented editor wait behavior in `console/README.md`. Failed/interrupted calls are not automatically retried; a deliberate resume can be billed again. Request attempts preserve the actual model/prompt/input and reported usage, including failed attempts where reported cost exists. Unreported cost stays unknown.

Read the result before using it. Resolve every UNVERIFIED annotation, open needed sources, independently recompute calculations, and review all Risk flags and claim rows rather than just the capped High priorities. Examples retain their label, framing and numeric provenance; a model's seven Pass checks are not independent verification. Record a chosen usefulness trial with [the evaluation worksheet](EVALUATION.md).

When finished, `node scripts/ee.mjs finish RUN_ID` explicitly removes that run and its marked exports within `console/runs/`. It does not remove your source inputs or outside exports. Keep private text out of Git.

## Preview the local site

```bash
node scripts/ee.mjs preview
# Open http://localhost:1313/ yourself; stop with Ctrl+C.
```

The server binds to loopback and serves generated output, not the repository root. Do not serve the repo root with a generic static server: `.env` and `.git/` may become reachable. For an exported build, choose a fresh empty destination outside the repository, such as `hugo --destination /tmp/ee-export-UNIQUE`; an old `public/` tree may contain stale files and is not release evidence.

Manually check navigation, the skip link, keyboard focus, a narrow layout, reduced motion, and a missing route. The home page has a closed contact state, the owner start page is at `/start/`, and training remains an owner archive containing assessor material. No remote font request is needed.

## Optional focused browser audit

Only run this when you choose a browser pass:

```bash
node scripts/audit-site.cjs
```

The script uses an installed Playwright module and installed browser. `PLAYWRIGHT_MODULE_PATH` and `CHROMIUM_PATH` can point to existing installations; missing prerequisites produce an actionable error, with no download/install. It builds a fresh temporary site, starts its own loopback server, checks representative templates, and retains a report/screenshots under `AUDIT_DIR` or the reported temporary directory. It cleans its own build/server afterward. No manually maintained preview server is required.

## Deterministic contracts and frozen evidence

For a documentation change, use the relevant contract only:

```bash
node --test tests/documentation-contract.test.js
```

For a card/checker change, run `tests/claim-audit.test.js`, `tests/examples.test.js`, or `tests/cards-contract.test.js` as appropriate. These checks are offline. They prove rules, structure and plumbing, not model judgment. The documentation contract verifies the original recorded hashes plus the full frozen inventory in `training/dry-runs/2026-07-13-ee-mvq-01-r1.sha256.json`; it must detect changed, missing and added files without editing the frozen run.

If you want the entire offline suite at the end of a wider review, run this locally and retain its result:

```bash
node --test tests/*.test.js
```

A passing suite does not demonstrate a new model trial, browser session, full curriculum validation, or real-world certification. The archived candidate record remains Not Yet.
