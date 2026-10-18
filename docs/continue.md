# Continue — owner pickup point

For daily use, open [Start or return](START.md). Current scope and maturity live in `STATUS.md`, `LOCAL-EDITION.md`, and `SCOPE-DECISION-CLAIM-AUDIT.md`; run `git status -sb` for the actual Git state. This note does not assert that local changes are committed, pushed, published or accepted.

## Current shape

- The original Local Edition is an authored, local-only creative/reference project. Its fictional consultancy and commercial roadmap remain a simulation and archive.
- Claim Audit and Illustrative Examples are the only accepted real-draft workflows: owner-only, own non-confidential D0/D1 material, exact registered provider/model/purpose. Retention unknowns remain explicit in `operations/AI-DATA-POLICY.md`.
- The runner persists stages and individual request attempts, preserves owner answers downstream, and resumes explicitly. Actual request hashes/context and reported usage belong to each attempt; requesting a model does not establish upstream provider identity.
- Checkers validate completed packs mechanically. Claim Audit keeps verbatim spans, derived working, uncapped Risk flags and explicit task references; Examples retains framing/provenance, DERIVED formulas and seven named checks. Neither checker certifies truth or usefulness.
- Training is an authored system with one demonstrated minimum viable synthetic route. Full-system validation, rendered artifact acceptance, supervised practice and certification remain unproved. The historical run is frozen; its external complete inventory adds checks without changing it.
- Current card revisions are instruction revisions, not measured optimization. No fresh model trials or real-asset results are supplied by these documentation changes.

## Short local commands

```bash
node scripts/ee.mjs status
node scripts/ee.mjs list
node scripts/ee.mjs show
node scripts/ee.mjs resume RUN_ID "short answer"
node scripts/ee.mjs check RUN_ID pack.md
node scripts/ee.mjs preview
```

`status`, `list`, `show` and `check` do not call a model. `resume` can make a paid call. See [Start or return](START.md) for the optional session alias, paid audit/example commands, owner review, and explicit `finish RUN_ID` cleanup. `console/README.md` documents advanced flags and between-card editing.

## Next evidence, only when wanted

Use [the bounded evaluation worksheet](EVALUATION.md) for the accepted three-own-asset usefulness gate. It starts empty. Do not substitute deterministic test passes or model self-checks for those observations. If it finds nothing the author had missed, follow the scope decision's stop condition.

The [happy path](happy-path.md) lists offline checks and the optional human-invoked `node scripts/audit-site.cjs` browser pass. Browser work and model calls must be explicitly chosen; they are not routine verification prerequisites. The [architecture note](ARCHITECTURE.md) explains components, stored data, provenance and maintenance contracts.

Preserve unrelated work. No staging, committing, pushing, deployment or publication is implied by a successful local check.
