# Exemplary Examples™ — Local Edition

> Every business case needs one perfect example. We build yours.

**Status:** Complete local project

**Mode:** Personal, local-only creative and educational artifact
**External commercialization:** Intentionally out of scope
Exemplary Examples™ is an openly satirical brand, a five-exhibit local website, and a complete consulting-operation simulation. It explores a familiar corporate mechanism: choosing the conclusion first and manufacturing the appearance of supporting evidence afterward.

The project answers that joke with a serious method for decision framing, evidence classification, transparent modeling, exhibit craft, adversarial review, and AI-agent training. It is not a real consultancy, active service, application program, or public certification provider.

The governing scope decision is recorded in [`LOCAL-EDITION.md`](LOCAL-EDITION.md).

## What is complete

- The responsive, accessible Local Edition website in [`index.html`](index.html).
- The original single-file parody prototype in [`exemplary-examples.html`](exemplary-examples.html), kept as history and excluded from the generated site.
- The validated EE-TRAINING-2026.07 curriculum, workshops, simulations, assessment system, and facilitation guides in [`training/`](training/).
- A controlled synthetic training run with an isolated candidate, two independent assessors, calibration, and frozen evidence in [`training/dry-runs/2026-07-13-ee-mvq-01-r1/`](training/dry-runs/2026-07-13-ee-mvq-01-r1/).
- The ten-role disclosed AI staff agents simulation and its governance, data, authorization, and escalation reference materials in [`operations/`](operations/).
- Synthetic customer-discovery exercises and reusable research materials in [`discovery/`](discovery/).
- Automated documentation and website contracts in [`tests/`](tests/).

## What is still moving

- The card runner in [`console/`](console/) and the cards in [`prompts/`](prompts/) are a working proof of concept, not a finished tool. It sends one prompt per step and edits between steps; it has no saved run state, so an interrupted chain starts over.
- Each step carries the original brief forward, so a later card can check work against what was actually asked. It does not yet detect an unanswered clarifying question: a card that responds by asking one will have that question passed to the next card as if it were finished work. Watch for it when chaining cards that open with questions.
- The runner has no tools, retrieval, or code execution. A card named "Code Review" produces a review written from the text you give it — it cannot open a repository or run tests. Read card names as tasks the model is asked to perform, not capabilities the runner has.
- The Hugo site renders every Markdown file in `training/`, assessor keys and facilitator material included. That is fine as an owner's reference archive; it is not a candidate-isolated evaluation bundle.

## Local Edition boundary

| Included | Not part of this project |
| --- | --- |
| Local website and visual artifact | Public deployment or hosted service |
| Synthetic D0/D1 exercises | Real applicant, prospect, or client data |
| AI staff agents as simulated roles | Claims that agents hold real professional authority |
| Executive Retainer as a simulated offer | Applications, inquiries, sales, or client delivery |
| Training-system validation | Public credentials or external certification |
| Governance as an inspectable reference system | Legal, tax, insurance, vendor, or commercial launch work |

The historical company-launch plan remains in [`ROADMAP.md`](ROADMAP.md) as design archaeology and an optional thought experiment. Its unchecked items are not Local Edition blockers or an active backlog.

## Truth standard

The satire may be fictional; its relationship to reality must remain clear. Every material claim in professional-style simulation belongs to one of six classes:

| Class | Required treatment |
| --- | --- |
| Sourced fact | Retrievable source, context, and access date |
| Supplied fact | Attributable supplied reference |
| Calculation | Reproducible inputs, formula, and units |
| Inference | Supporting facts and exposed reasoning |
| Modeled scenario | Assumptions, method, sensitivities, and limitations |
| Satirical fiction | Clear placement inside the satirical context |

> If a reasonable audience could mistake constructed material for verified real-world fact, change the labeling, sourcing, design, or artifact.

## Training system

EE-TRAINING-2026.07 is an initial validated training release covering ten competencies from decision framing through retainer leadership. It uses self-paced modules, workshops, simulations, portfolio artifacts, critical-failure rules, independent assessment, accessibility accommodations, and calibration.

The controlled run passed its minimum viable composite route with no critical failure and assessor agreement within tolerance. That proves the training system is usable; it does not create real-world authority. The historical candidate record deliberately remains “Not Yet” certified because external authorization is outside the Local Edition scope.

Start with [`training/README.md`](training/README.md) or read the completed [`dry-run report`](training/dry-runs/2026-07-13-ee-mvq-01-r1/08-DRY-RUN-REPORT.md).

## Run locally

The site is a Hugo wrapper over the Markdown already in the repository; no other dependency or install step is required.

```bash
hugo server
```

Open:

```text
http://localhost:1313/
```

`hugo server` serves only generated output, bound to `127.0.0.1`. Do not preview by serving the repository root with a generic static server — that publishes `.env` and `.git/` to anything that can reach the port.

The page contains no form, inquiry handoff, analytics, backend, storage, or automatic publishing mechanism. Google Fonts are the only remote browser resources; the content and functionality are otherwise static.

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
| [`STATUS.md`](STATUS.md) | Final project status |
| [`index.html`](index.html) | Current Local Edition experience |
| [`assets/`](assets/) | Styles and visual identity assets |
| [`training/`](training/) | Validated educational and assessment series |
| [`operations/`](operations/) | Simulated company operating system |
| [`discovery/`](discovery/) | Synthetic discovery exercises and reusable templates |
| [`ROADMAP.md`](ROADMAP.md) | Archived external-expansion plan |
| [`CHANGELOG.md`](CHANGELOG.md) | Historical work record |
| [`console/`](console/) | Card runner CLI and its seed card library |
| [`prompts/`](prompts/) | Technical prompt cards, runnable via `--dir prompts` |
| [`scripts/llm.mjs`](scripts/llm.mjs) | The single provider call both of the above use |
| [`hugo.toml`](hugo.toml), [`layouts/`](layouts/) | Renders the Markdown content as a browsable site |
| [`tests/`](tests/) | Local contracts and browser-audit tooling |

## Safe use

- Use synthetic or deliberately public material.
- Do not treat fictional organizations, results, roles, or certifications as real.
- Keep generated citations and factual claims untrusted until independently verified.
- Do not add personal, applicant, prospect, or client data.
- Preserve accessibility and the visible distinction between evidence classes.

## Definition of complete

The Local Edition's *content* is complete: its website, method, training curriculum, simulations, assessment system, controlled validation run, and reference operating materials all exist and pass their local contracts. The card runner listed under "What is still moving" is deliberately outside that claim. Nothing requires a customer, Accountable Principal, commercial entity, public deployment, or real-world certification unless the owner explicitly reopens external commercialization through a new scope decision.
