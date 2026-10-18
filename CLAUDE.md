# Project rules — Exemplary Examples™ Local Edition

- **Scope:** the Local Edition plus the owner-only Claim Audit and Illustrative Examples extensions, nothing more ([`LOCAL-EDITION.md`](LOCAL-EDITION.md), [`SCOPE-DECISION-CLAIM-AUDIT.md`](SCOPE-DECISION-CLAIM-AUDIT.md)). No hosting, intake, payments, or confidential (D2/D3) data.
- **Real drafts go only through a provider with a row in the register** in `operations/AI-DATA-POLICY.md`: today that is OpenRouter with `tencent/hy3`, D0/D1, the owner's own use. Anyone else's drafts, other models, and D2/D3 stay out. Fictional files are in `claim-audit/_samples/` and `examples/_samples/`.
- **Verify with** `node --test tests/*.test.js` and `node console/console.mjs --selftest`. The suite makes no model calls, so it proves rules and plumbing, not model judgment.
- **Illustrative examples** (`examples/`) are labeled, assumption-based, and never real customer results; real case studies are out of scope until a new written decision.
- **Changing a card:** edit one card at a time, add a Changelog line that says "instruction revision" (never "optimized" without a measurement), and update its relevant test: `tests/claim-audit.test.js` for Claim Audit, `tests/examples.test.js` for Illustrative Examples, or `tests/cards-contract.test.js` for brand/engineering cards. Changes to fixed labels, headings, enums, or pack schema require coordinated card/checker/docs/test updates.
- **Frozen evidence** in `training/dry-runs/2026-07-13-ee-mvq-01-r1/` is hash-checked. Do not edit it.
- **Git:** stage, commit, or push only when the owner names that action.

## Source change checks

Trace affected imports, callers, routes, templates, and focused tests with native repository searches and source reads before editing. Keep unresolved references explicit and follow Ryan's current verification instructions. Staging, commits, pushes, deployment, and publication require his explicit delegation of that action.
