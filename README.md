# Exemplary Examples™ — Local Edition

> Every business case needs one perfect example. We build yours.

**Status:** Complete local project

**Mode:** Personal, local-only creative and educational artifact, plus accepted narrow extensions (Claim Audit and Illustrative Examples, below)
**External commercialization:** Intentionally out of scope
Exemplary Examples™ is an openly satirical brand, a five-exhibit local website, and a complete consulting-operation simulation. It explores a familiar corporate mechanism: choosing the conclusion first and manufacturing the appearance of supporting evidence afterward.

The project answers that joke with a serious method for decision framing, evidence classification, transparent modeling, exhibit craft, adversarial review, and AI-agent training. It is not a real consultancy, active service, application program, or public certification provider.

Start or return with [`docs/START.md`](docs/START.md): read the method, inspect a saved run, audit your own draft, or make a labeled example with short commands. The governing scope decision is recorded in [`LOCAL-EDITION.md`](LOCAL-EDITION.md); [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) explains the implementation and its limits.

## What is complete

- The responsive, accessible Local Edition website in [`index.html`](index.html).
- The original single-file parody prototype in [`exemplary-examples.html`](exemplary-examples.html), kept as history and excluded from the generated site.
- The complete authored EE-TRAINING-2026.07 curriculum, workshops, simulations, assessment system, and facilitation guides in [`training/`](training/).
- A controlled synthetic training run with an isolated candidate, two independent assessors, calibration, and frozen evidence in [`training/dry-runs/2026-07-13-ee-mvq-01-r1/`](training/dry-runs/2026-07-13-ee-mvq-01-r1/).
- The ten-role disclosed AI staff agents simulation and its governance, data, authorization, and escalation reference materials in [`operations/`](operations/).
- Synthetic customer-discovery exercises and reusable research materials in [`discovery/`](discovery/).
- Automated documentation and website contracts in [`tests/`](tests/).

## What is still moving

- The card runner in [`console/`](console/) and the cards in [`prompts/`](prompts/) are a working proof of concept, not a finished tool. It sends one prompt per step and edits between steps. Every completed request is saved to `console/runs/` (gitignored), and `--resume` continues the last run at the stage that needs it.
- Each step carries the original brief forward, so a later card can check work against what was actually asked. The runner requires each reply to open with a `STATUS:` line (`COMPLETE`, `NEEDS_INPUT`, or `BLOCKED`). A card that asks a question stops the run and waits for your answer instead of passing the question on; a reply with no valid status line is treated as a failed stage, never as finished work.
- Checker exports write atomically with private permissions (`0o600`), reject symlinks and directory-symlink escapes, and leave existing exports intact on write failures. Empty or interrupted run records produce clear recovery guidance. Explicit cleanup via `node scripts/ee.mjs finish RUN_ID` traverses real nested directories in `console/runs/` to remove marked exports and only deletes the run record once exports are cleared, skipping symlinks and preserving unrelated files.
- The runner has no tools, retrieval, or code execution. A card named "Code Review" produces a review written from the text you give it — it cannot open a repository or run tests. Read card names as tasks the model is asked to perform, not capabilities the runner has.
- The Hugo site renders every Markdown file in `training/`, assessor keys and facilitator material included. That is fine as an owner's reference archive; it is not a candidate-isolated evaluation bundle.

## Extensions (accepted; v1 built, tested on synthetic drafts only)

[`SCOPE-DECISION-CLAIM-AUDIT.md`](SCOPE-DECISION-CLAIM-AUDIT.md) opens two bounded workflows under the same limits:

- **Claim Audit** ([`claim-audit/`](claim-audit/)): paste draft marketing or business copy, get every claim classified under the six-class standard with the evidence it still needs and a safer rewrite. The CLI and its mechanical pack checker live in [`claim-audit/`](claim-audit/); its README lists what is known to be unreliable. It runs locally on the owner's own non-confidential drafts; the owner is its only user. One own-use provider row (D0/D1, with unknowns stated) is recorded in the register in [`operations/AI-DATA-POLICY.md`](operations/AI-DATA-POLICY.md).
- **Illustrative Examples** ([`examples/`](examples/)): three cards (frame, write, challenge), a mechanical checker, and synthetic samples producing openly labeled, assumption-based examples for small businesses. Every example requires the label line `Illustrative example — not a real customer or result.` and never uses real customer results or invented statistics.

## Local Edition boundary

| Included | Not part of this project |
| --- | --- |
| Local website and visual artifact | Public deployment or hosted service |
| Synthetic D0/D1 exercises | Real applicant, prospect, or client data |
| AI staff agents as simulated roles | Claims that agents hold real professional authority |
| Executive Retainer as a simulated offer | Applications, inquiries, sales, or client delivery |
| Training-system validation | Public credentials or external certification |
| Governance as an inspectable reference system | Legal, tax, insurance, vendor, or commercial launch work |
| Claim Audit and Illustrative Examples on the owner's own D0/D1 drafts | Confidential (D2) or restricted (D3) data, paid client work, hosting, intake |

The historical company-launch plan remains in [`ROADMAP.md`](ROADMAP.md) as design archaeology and an optional thought experiment. Its unchecked items are not Local Edition blockers or an active backlog.

## Truth standard

The satire may be fictional; its relationship to reality must remain clear. Every material claim in professional-style simulation belongs to one of six classes:

| Class | Required treatment |
| --- | --- |
| Sourced fact | Retrievable source, context, and access date |
| Client-provided fact | Attributable supplied reference |
| Calculation | Reproducible inputs, formula, and units |
| Inference | Supporting facts and exposed reasoning |
| Modeled scenario | Assumptions, method, sensitivities, and limitations |
| Satirical fiction | Clear placement inside the satirical context |

> If a reasonable audience could mistake constructed material for verified real-world fact, change the labeling, sourcing, design, or artifact.

## Training system

EE-TRAINING-2026.07 is a complete authored Local Edition training release covering ten competencies from decision framing through retainer leadership. It uses self-paced modules, workshops, simulations, portfolio artifacts, critical-failure rules, independent assessment, accessibility accommodations, and calibration.

A minimum viable synthetic composite route was demonstrated in one controlled run, with no critical failure and assessor agreement within tolerance. That shows the route can be executed once under controlled conditions; it does not validate the whole system or create real-world authority.

| Material | State |
| --- | --- |
| Curriculum, instruction, workshop outlines, simulations, assessment, facilitation, supervision, templates | **Authored** |
| Minimum viable composite route | **Demonstrated** in one controlled synthetic run (`2026-07-13-ee-mvq-01-r1`) |
| Full-system validation, standalone workshop timing, rendered exhibits, supervised practice, candidate certification | **Not validated** — separate later gates named in the [run report](training/dry-runs/2026-07-13-ee-mvq-01-r1/08-DRY-RUN-REPORT.md) |

The historical candidate record deliberately remains “Not Yet” certified because external authorization is outside the Local Edition scope.

Start with [`training/README.md`](training/README.md) or read the completed [`dry-run report`](training/dry-runs/2026-07-13-ee-mvq-01-r1/08-DRY-RUN-REPORT.md).

## Run locally

The site is a Hugo wrapper over the Markdown already in the repository; no other dependency or install step is required.

```bash
node scripts/ee.mjs preview
```

Open:

```text
http://localhost:1313/
```

`hugo server` serves only generated output, bound to `127.0.0.1`. Do not preview by serving the repository root with a generic static server — that publishes `.env` and `.git/` to anything that can reach the port.

The page contains no form, inquiry handoff, analytics, backend, storage, or automatic publishing mechanism. Fonts use local system stacks; the generated site makes no remote font requests. Content and functionality are static and available offline.

## Verify

Run all contracts:

```bash
node --test tests/*.test.js
```

The suite verifies Markdown links, Local Edition scope, the frozen training record, semantic structure, evidence-language requirements, metadata, and the absence of application or publishing mechanisms.

The prior real-browser verification record remains at [`operations/WEBSITE-VERIFICATION-2026-07-13.md`](operations/WEBSITE-VERIFICATION-2026-07-13.md). It describes the earlier deployment candidate and is retained as historical evidence, not a current hosting plan.

## Project map

| Path | Purpose |
| --- | --- |
| [`LOCAL-EDITION.md`](LOCAL-EDITION.md) | Governing scope and completion decision |
| [`STATUS.md`](STATUS.md) | Current maturity and unresolved evidence gates |
| [`docs/START.md`](docs/START.md) | Owner landing page and short local commands |
| [`docs/full-copy-and-paste-guide-to-getting-the-most-out-of-this-tool.md`](docs/full-copy-and-paste-guide-to-getting-the-most-out-of-this-tool.md) | Full copy-and-paste walkthrough for setup, workflows, and review |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Components, data flow, provenance, and maintenance boundaries |
| [`docs/EVALUATION.md`](docs/EVALUATION.md) | Bounded owner evaluation and synthetic trial record |
| [`index.html`](index.html) | Current Local Edition experience |
| [`assets/`](assets/) | Styles and visual identity assets |
| [`training/`](training/) | Authored educational and assessment series |
| [`operations/`](operations/) | Simulated company operating system |
| [`discovery/`](discovery/) | Synthetic discovery exercises and reusable templates |
| [`ROADMAP.md`](ROADMAP.md) | Archived external-expansion plan |
| [`CHANGELOG.md`](CHANGELOG.md) | Historical work record |
| [`console/`](console/) | Card runner CLI and its seed card library |
| [`prompts/`](prompts/) | Technical prompt cards, runnable via `--dir prompts` |
| [`examples/`](examples/) | Illustrative examples for small businesses: cards, checker, fictional samples (`--dir examples --all`) |
| [`claim-audit/`](claim-audit/) | Claim Audit cards, pack checker, synthetic samples, and usage (`--dir claim-audit --all`) |
| [`scripts/llm.mjs`](scripts/llm.mjs) | The single provider call both of the above use |
| [`hugo.toml`](hugo.toml), [`layouts/`](layouts/) | Renders the Markdown content as a browsable site |
| [`tests/`](tests/) | Local contracts and browser-audit tooling |

## Safe use

- Use synthetic or deliberately public material. Claim Audit and Illustrative Examples additionally allow the owner's own non-confidential (D0/D1) drafts through the exact provider/model/purpose in the AI-DATA-POLICY register. Anyone else's drafts and D2/D3 material remain excluded.
- Run records (`console/runs/`) hold drafts in plaintext inside the local repository directory and are gitignored. Delete them explicitly when done: `node scripts/ee.mjs finish RUN_ID` removes that run and its marked local exports. Never stage or commit these records, or copy private draft text into tracked repository files. Gitignore prevents ordinary tracking; it does not delete retained data.
- Do not treat fictional organizations, results, roles, or certifications as real.
- Keep generated citations and factual claims untrusted until independently verified.
- Do not add personal, applicant, prospect, or client data.
- Preserve accessibility and the visible distinction between evidence classes.

## Definition of complete

The Local Edition's *content* is authored: its website, method, training curriculum, simulations, assessment system, controlled synthetic run, and reference operating materials exist. Local contracts check their structure and frozen evidence; they do not prove the whole curriculum works or that model output is correct. The card runner listed under "What is still moving" is deliberately outside that claim. Nothing requires a customer, Accountable Principal, commercial entity, public deployment, or real-world certification unless the owner explicitly reopens external commercialization through a new scope decision.
