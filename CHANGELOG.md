# Changelog

Completed work, moved out of [`ROADMAP.md`](ROADMAP.md) as it finishes. The roadmap holds only remaining work; this file is the record of what shipped.

## 2026-07-13

### Website — built, verified, and deployed

Live at <https://ryan258.github.io/exemplary-examples/> as a closed-state pilot site (the application is intentionally closed until Checkpoint P). Verification record: [`operations/WEBSITE-VERIFICATION-2026-07-13.md`](operations/WEBSITE-VERIFICATION-2026-07-13.md).

- **Task 0.1 — Format & premise alignment.** Single-page, five-section site; obsolete tiers and "precedent" language removed; Executive Retainer is the only real offer.
- **Task 0.2 — Content & exhibit map.** Explicit brand-level satire framing; the Proof section shows methodology, not fictional testimonials; no named real firms or people.
- **Task 1.1 — Static baseline.** `index.html` + `assets/styles.css`, no build step; README with preview, verification, and deploy notes.
- **Task 1.2 — Semantics & navigation.** Semantic landmarks, skip link, logical keyboard order, five-destination navigation.
- **Task 2.1 — Visual system.** Tokenized color/type/spacing; contrast corrected to WCAG AA (axe: 0 violations); visible focus on every control.
- **Task 2.2 — Responsive & interaction states.** Verified 320–1440px, `prefers-reduced-motion` honored, practical touch targets, single-offer readability.
- **Task 2.3 — Identity & sharing metadata.** Favicon, 1200×630 social card, Open Graph/Twitter tags, canonical + `og:url`.
- **Task 3.1 — Verification suite.** `node --test tests/*.test.js` (site + documentation contracts) plus the repeatable `tests/browser-audit.cjs`.
- **Task 3.3 — Release candidate published.** GitHub Pages via an Actions workflow (site-only artifact, tests-gated), HTTPS, branded `404.html`, deploy/rollback docs.

### Foundations & governance (scaffolded)

- Adopted the disclosed AI-staff operating model: AI Staff Charter with ten roles + backups and an accountable-principal boundary ([`operations/AI-STAFF-CHARTER.md`](operations/AI-STAFF-CHARTER.md)).
- Governance register, AI/data policy (D0–D3 classes), and four design-level tabletop scenarios ([`operations/`](operations/)).
- Customer-discovery kit: interview guide, recruitment plan, per-interview record, and synthesis templates ([`discovery/`](discovery/)).
- Reorganized training docs into numbered stage directories (`training/01_foundations` … `06_facilitation`).

### Process dry run

- Synthetic customer-discovery run (six fictional personas) to exercise the interview guide, isolated and labeled under [`discovery/simulations/`](discovery/simulations/); the guide was then sharpened from its friction log.

### Tooling

- Zero-dependency OpenRouter LLM caller with `.env` config ([`scripts/llm.mjs`](scripts/llm.mjs)).

> **Still open (in the roadmap):** the pilot application build (Tasks 1.3a–e), the performance budget ≥ 90 (Task 3.2), the outsider comprehension/trust review (Task 3.4), and the entire company track — real interviews, the human Accountable Principal plus legal/insurance/tax sign-off, agent qualification, and the retainer simulation.
