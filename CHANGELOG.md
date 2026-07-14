# Changelog

Completed work, moved out of [`ROADMAP.md`](ROADMAP.md) as it finishes. The roadmap holds only remaining work; this file is the record of what shipped.

## 2026-07-13

### Local Edition — completed

- Adopted the Local Edition as the terminal personal, local-only scope.
- Reframed the Executive Retainer as a simulation rather than a real offer.
- Removed the pilot inquiry form, email handoff, public canonical URL, and automatic GitHub Pages deployment.
- Published EE-TRAINING-2026.07 after a successful controlled run with isolated assessment and calibration.
- Preserved company-launch, governance, and discovery materials as an optional simulation/reference system rather than an active backlog.

### Website — built, verified, and deployment-ready

Release candidate configured for <https://ryan258.github.io/exemplary-examples/> as a closed-formal-application pilot site. Publication remains pending in [`STATUS.md`](STATUS.md). Verification record: [`operations/WEBSITE-VERIFICATION-2026-07-13.md`](operations/WEBSITE-VERIFICATION-2026-07-13.md).

- **Task 0.1 — Format & premise alignment.** Single-page, five-section site; obsolete tiers and "precedent" language removed; Executive Retainer is the only real offer.
- **Task 0.2 — Content & exhibit map.** Explicit brand-level satire framing; the Proof section shows methodology, not fictional testimonials; no named real firms or people.
- **Task 1.1 — Static baseline.** `index.html` + `assets/styles.css`, no build step; README with preview, verification, and deploy notes.
- **Task 1.2 — Semantics & navigation.** Semantic landmarks, skip link, logical keyboard order, five-destination navigation.
- **Task 2.1 — Visual system.** Tokenized color/type/spacing; contrast corrected to WCAG AA (axe: 0 violations); visible focus on every control.
- **Task 2.2 — Responsive & interaction states.** Verified 320–1440px, `prefers-reduced-motion` honored, practical touch targets, single-offer readability.
- **Task 2.3 — Identity & sharing metadata.** Favicon, 1200×630 social card, Open Graph/Twitter tags, canonical + `og:url`.
- **Task 3.1 — Verification suite.** `node --test tests/*.test.js` (site + documentation contracts) plus the repeatable `tests/browser-audit.cjs`.
- **Task 3.2 — Performance budget.** Production Lighthouse (via the `Lighthouse (production)` workflow): Performance 91, Accessibility 100, SEO 100 all meet target; Best Practices 79 accepted as a documented exception (a `mailto:` Lighthouse quirk, not a real vulnerability). See [`operations/WEBSITE-VERIFICATION-2026-07-13.md`](operations/WEBSITE-VERIFICATION-2026-07-13.md).
- **Task 3.3 — Release candidate prepared.** GitHub Pages Actions workflow (site-only artifact, tests-gated), branded `404.html`, and deploy/rollback docs; publication is not yet recorded as complete.
- **Pilot inquiry path.** A short form prepares a structured email in the visitor's own mail app. No third-party form processor or site-side submission storage is introduced; formal applications remain gated by Checkpoint P.

### Foundations & governance (scaffolded)

- Adopted the disclosed AI-staff operating model: AI Staff Charter with ten roles + backups and an accountable-principal boundary ([`operations/AI-STAFF-CHARTER.md`](operations/AI-STAFF-CHARTER.md)).
- Governance register, AI/data policy (D0–D3 classes), and four design-level tabletop scenarios ([`operations/`](operations/)).
- Customer-discovery kit: interview guide, recruitment plan, per-interview record, and synthesis templates ([`discovery/`](discovery/)).
- Reorganized training docs into numbered stage directories (`training/01_foundations` … `06_facilitation`).

### Process dry run

- Synthetic customer-discovery run (six fictional personas) to exercise the interview guide, isolated and labeled under [`discovery/simulations/`](discovery/simulations/); the guide was then sharpened from its friction log.

### Tooling

- Zero-dependency OpenRouter LLM caller with `.env` config ([`scripts/llm.mjs`](scripts/llm.mjs)).

> **Still open (in the roadmap):** the pilot application build (Tasks 1.3a–e), the outsider comprehension/trust review (Task 3.4), and the entire company track — real interviews, the human Accountable Principal plus legal/insurance/tax sign-off, candidate certification, and the retainer simulation.
