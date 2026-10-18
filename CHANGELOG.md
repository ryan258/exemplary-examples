# Changelog

Local changes and historical work. Entries do not imply a commit, deployment, publication, or model-performance measurement. [`ROADMAP.md`](ROADMAP.md) is the archived commercial expansion plan, not the active Local Edition backlog.

## 2026-10-18

### Final review corrections — local, uncommitted

- Reviewed the prior harmony repairs from the clean `b17b928` baseline. Remaining corrections from this pass stay uncommitted; the earlier repair entries describe their original working state.
- Checker exports now reject symlink destinations and relative paths through directories outside `console/runs/`. A shared atomic writer creates private Markdown exports without truncating saved records through hard links, preserves prior exports on write failure, and cleans up temporary files. Both checkers explain empty-stage records without a TypeError. Explicit `finish` cleanup covers marked exports in real nested folders and skips symlinks, retaining the run record until export removal succeeds.
- Numeric provenance compares equivalent decimal spellings without floating-point conversion. Written-number support accepts complete zero-to-ninety-nine quantities and does not approve fragments of unsupported larger or fractional expressions. Literal arithmetic operators survive presentation normalization, and UNVERIFIED annotations balance their outer brackets independently of quoted source brackets.
- Clarified explicit saved owner-answer provenance in each extension card, with dated instruction-revision entries and corresponding contract assertions. Frame Example now states the single-value/unit and escaped-pipe table contract. These instruction revisions have no fresh model measurement.
- Corrected the plaintext-record retention policy to require explicit owner cleanup and prohibit tracking private draft text. The homepage names both accepted owner-only workflows, and table-of-contents links have explicit target sizing consistent with the optional browser audit.
- Verification is limited to targeted checker, export, runner-history, owner-command, documentation, and generated-site tests. Frozen training evidence and recorded model samples remain unchanged. No full suite, live model call, browser/assistive-technology acceptance, or three-own-asset evaluation is claimed.

## 2026-10-17

### Harmony repair pass — local, uncommitted

- Closed checker false-pass paths: empty required sections/cells, duplicate/unexpected headings and unchecked preambles, hidden fenced content, malformed or escaped-pipe tables, unstable claim IDs/earlier columns, missing task references, and unmatched review annotations. Parsing and common rules now live in `scripts/pack-checks.mjs`.
- Kept owner-supplied evidence separate from generated framing. Examples require the exact first-line disclosure, a basis-marked entry for every numeric value, explicit DERIVED working, and seven named Pass/Fail checks. Claim Audit carries uncapped Risk flags independently of relative Priority, with matching counts, claim IDs, and task references.
- Examples keep their accepted provenance table under an explicit nested Source notes boundary; customer-facing wording checks do not misclassify quoted source notes as advertising. Owner edits establish an accepted baseline while later unedited model changes remain checkable. Markdown-only exports cannot overwrite or masquerade as saved JSON run records.
- Preserved all recorded model-output fixtures unchanged. They predate the stricter contracts and can now correctly fail them; clearly identified test-only derivatives and hand-authored synthetic packs test current success paths. No fresh model behavior or improved rewrite performance is claimed.
- Runner history records each request attempt's exact messages, requested model, instruction hashes, timing, raw reply/error, and reported usage. Clarifications survive legacy migration, retries, and downstream stages. Usage includes retries and failed/clarification requests; missing usage and interrupted outcomes remain explicitly unknown. Version-1 records stay readable with clearer validation/recovery errors.
- Added short owner commands in `scripts/ee.mjs` for inspection, audit/example, resume, checking/export, preview, and explicit per-run cleanup. They preserve registered-model restrictions, use an existing `.env` only for chosen provider workflows, and skip editing by default for the two short workflow commands. The setup template now selects the registered model.
- Revised cards one at a time with instruction-revision changelogs: source spans versus implied meaning, derived figures versus invented inputs, review drafts versus publishable copy, sentence retention, customization limits, source/framing carrythrough, and priority versus risk. The brand visual-style card now matches offline system typography. Revisions are not yet re-measured on fresh model output.
- Aligned governing scope, data-purpose guidance, and training maturity/verification definitions. Added `docs/START.md`, `docs/ARCHITECTURE.md`, and an empty bounded `docs/EVALUATION.md`; simplified the local walkthrough and continuation note.
- Improved local reference navigation with grouped, uniquely labeled archive links, page tables of contents, a persistent simulation boundary, and an owner Start route. Removed remote font requests. The optional human-invoked browser helper manages its own clean build/server and captures transport failures by template; its imports and deterministic tests never launch a browser. Lighthouse verifies the Hugo download checksum.
- Added a complete external 13-file SHA-256 inventory captured from committed frozen evidence. The historical run directory and its original manifest remain unchanged. Targeted contracts cover added, missing, modified, and non-regular files; generated-site checks guard excluded repository content and offline resources.
- Deterministic verification uses targeted subsystem checks and socket-free provider/audit-handler fixtures. No full-suite run, live model trial, browser session, certification, or public operation is asserted by this repair pass.

### Review corrections

- Owner-only scope: the volunteer allowance and notice were withdrawn from the scope decision, policy, and READMEs (amendment recorded); the scope decision is no longer titled "Draft"; `AGENTS.md` is a symlink to `CLAUDE.md`.
- `parseStage` forgives bold/backtick marks and letter case on the `STATUS:` line (a bolded status no longer costs a failed stage and a paid retry); both checkers refuse a run whose last card is not their library's (`safe-rewrite` / `challenge-example`) instead of printing misleading errors.
- The runner and `scripts/llm.mjs` refuse any model without a register row (today `tencent/hy3`; `:free` variants are refused) before a request or run record, unless `--allow-unregistered-model` is given; a test keeps the list in step with the register. A checker's relative `--out` now lands in `console/runs/` (gitignored) and cannot climb out of it.

- `scripts/llm.mjs` and the console share one strict option parser: unknown flags, missing values, and flags consumed as values fail before any provider request; `--` ends options.
- Card sections match headings exactly (no `## Prompt injection` for `## Prompt`), ignore fenced headings, and reject duplicates; the card-contract test uses the runtime parser.
- The console saves every completed request to `console/runs/`, requires a `STATUS:` line so a question stops the run instead of flowing downstream, and adds `--resume`, `--run`, and `--answer`.
- `404.html` is now a Hugo layout with root-relative URLs; focus rings are two-tone; the mobile header no longer sticks; quoted exhibit headings no longer add H1s to the generated site.
- New tests: `tests/console.test.js` (argument rejection against a local fake provider, stage transitions, resume) and `tests/site-generated.test.js` (audits every generated route when `hugo` is installed).
- Training wording narrowed to "authored; one minimum viable route demonstrated"; the 101 guide separates claim class, verification status, and recommendation; prompt-card changelog entries say "instruction revision", not "optimized".
- The Lighthouse workflow now audits a Hugo build of a chosen revision instead of the historical public URL.
- Follow-up fixes: an editor that returns text unchanged (or empty) no longer advances a run silently, and GUI editors get their wait flag; flag names like `constructor` are prompt text, not inherited keys; array-style provider content is joined instead of crashing; run records hash each card prompt and `--resume` warns on drift; run ids are validated; edit drafts are deleted after a successful edit.
- Accepted: [`SCOPE-DECISION-CLAIM-AUDIT.md`](SCOPE-DECISION-CLAIM-AUDIT.md), a narrow Claim Audit extension of the Local Edition. `LOCAL-EDITION.md`, `README.md`, `STATUS.md`, `index.html`, `operations/AI-DATA-POLICY.md`, and the scope tests were updated to match.
- Added `claim-audit/`: four cards (extract, classify, evidence needs, safe rewrite), `--all` and `--profile` runner flags, and fully fictional samples. Tested offline against a fake provider; no real model output has been evaluated, and no provider is approved for real drafts.
- AI-DATA-POLICY register: first row recorded 2026-10-17 (OpenRouter, `tencent/hy3` paid only, D1, owner's own use; training-routing block set by the owner; OpenRouter and upstream retention stated as unknown). The "none approved" wording in the policy, scope decision, status, and READMEs was updated to match.
- Illustrative examples for small businesses (`examples/`): three cards (frame, write, challenge), a mechanical checker (label line, SUPPLIED/ASSUMED marks, no quotations, no invented business terms, structure), fictional samples, and tests. The cards were revised once after a trial that invented a business term. Scope amendment recorded in `SCOPE-DECISION-CLAIM-AUDIT.md`.
- Claim Audit v1: the four cards got six instruction revisions from three synthetic trials (see each card's changelog); `claim-audit/check.mjs` checks a finished pack mechanically (sections, allowed values, summary counts, High cap, never-Low, internal notes in copy, strong wording absent from sources, new numbers, dropped sentences); recorded model output serves as test fixtures. Both fictional drafts were re-run once after the last revisions; results are in the Known gaps section.
- Runner: per-stage token and provider-reported cost tracking with a one-line summary, and the model-call deadline raised from 120s to 300s after a Claim Audit stage timed out.
- Repository: `package.json` (no dependencies; Node 20.6+), a test-only GitHub workflow (`.github/workflows/test.yml`, not yet run on GitHub), the Markdown contract test now reads `git ls-files` so ignored tool folders cannot change results, `.claude/settings.local.json` is gitignored, and `CLAUDE.md`/`AGENTS.md` start with project rules.

## 2026-07-13

### Local Edition — completed

- Adopted the Local Edition as the terminal personal, local-only scope.
- Reframed the Executive Retainer as a simulation rather than a real offer.
- Removed the pilot inquiry form, email handoff, public canonical URL, and automatic GitHub Pages deployment.
- Published EE-TRAINING-2026.07 after a successful controlled run with isolated assessment and calibration.
- Preserved company-launch, governance, and discovery materials as an optional simulation/reference system rather than an active backlog.

### Website — built and verified (historical: superseded by the Local Edition decision above)

This entry records the earlier deployment-and-inquiry plan. The Local Edition decision removed the public URL, inquiry form, and automatic deployment; the site is now local-only (see [`STATUS.md`](STATUS.md)). Verification record: [`operations/WEBSITE-VERIFICATION-2026-07-13.md`](operations/WEBSITE-VERIFICATION-2026-07-13.md).

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
- **Pilot inquiry path (later removed).** A short form prepares a structured email in the visitor's own mail app. No third-party form processor or site-side submission storage is introduced; formal applications remain gated by Checkpoint P.

### Foundations & governance (scaffolded)

- Adopted the disclosed AI-staff operating model: AI Staff Charter with ten roles + backups and an accountable-principal boundary ([`operations/AI-STAFF-CHARTER.md`](operations/AI-STAFF-CHARTER.md)).
- Governance register, AI/data policy (D0–D3 classes), and four design-level tabletop scenarios ([`operations/`](operations/)).
- Customer-discovery kit: interview guide, recruitment plan, per-interview record, and synthesis templates ([`discovery/`](discovery/)).
- Reorganized training docs into numbered stage directories (`training/01_foundations` … `06_facilitation`).

### Process dry run

- Synthetic customer-discovery run (six fictional personas) to exercise the interview guide, isolated and labeled under [`discovery/simulations/`](discovery/simulations/); the guide was then sharpened from its friction log.

### Tooling

- Zero-dependency OpenRouter LLM caller with `.env` config ([`scripts/llm.mjs`](scripts/llm.mjs)).

> **Superseded, not pursued:** these items were open before the Local Edition decision and are archived in [`ROADMAP.md`](ROADMAP.md). Previously listed: the pilot application build (Tasks 1.3a–e), the outsider comprehension/trust review (Task 3.4), and the entire company track — real interviews, the human Accountable Principal plus legal/insurance/tax sign-off, candidate certification, and the retainer simulation.
