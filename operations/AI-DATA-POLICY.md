# Initial AI and Data Policy

> **Local Edition status:** This is a reference policy for synthetic/local exercises. No real applicant, prospect, client, or restricted data is in scope; unratified external fields are intentionally dormant. The accepted exceptions are the owner-only Claim Audit and Illustrative Examples workflows on the owner's own D0/D1 drafts (see the section below); other real material remains excluded.

**Status:** Draft for P0.1 approval  
**Owner:** EE-09 Steward (proposed controls); Accountable Principal ratification pending
**Approved version/date:**  

This is an internal operating policy draft, not a substitute for contractual, privacy, security, or legal review required by P0.5d and P0.6.

## Principle

Use the minimum necessary data in the minimum number of systems. AI staff agents may own bounded operating tasks and work records; they are not legal persons, factual sources, or their own approval authority. Consequential external delivery requires the review specified in `AI-STAFF-CHARTER.md`.

## Data classes

### D0 — Public

Information intentionally available to the public from a retrievable source.

**Examples:** public reports, published websites, authorized public brand material.  
**Default:** may be used in approved business tools; source and access date remain required.

### D1 — Internal operations

Non-public company information whose disclosure would cause limited operational harm.

**Examples:** draft training materials, de-identified discovery synthesis, internal process notes.  
**Default:** approved internal systems only; no public AI tools unless explicitly approved for D1.

### D2 — Confidential business/client

Non-public information provided by or about a client, applicant, partner, or company whose disclosure could cause material harm.

**Examples:** client strategy, unpublished financials, contracts, application details, identifiable interview notes, client working papers.  
**Default:** approved restricted systems; do not enter into an AI tool unless the specific tool, account configuration, purpose, and data use are approved for D2.

### D3 — Restricted

Highly sensitive information requiring specialized handling or excluded from the initial pilot.

**Examples:** authentication secrets, payment-card data, government identifiers, medical information, privileged legal material, regulated data, data whose contract prohibits AI processing.  
**Default:** never enter into AI systems; collect only when a qualified policy and approved system explicitly require it. The initial application must not request D3 data.

When uncertain, use the more restrictive class and ask the data/tool owner.

## Approved-tool register

No tool is approved by brand name alone. Approval applies to a specific account, configuration, data class, purpose, and review date.

| Tool/account | Purpose | Maximum data class | Training/data-use setting verified | Retention/access | Owner | Approved/review date |
| --- | --- | --- | --- | --- | --- | --- |
| OpenRouter, owner's account, model `tencent/hy3` (paid) only | Claim Audit and illustrative examples, owner's own use | D1 | Account setting blocking routing to providers that may train on prompts, set by the owner on 2026-10-17 (owner-reported; not independently checked). Per-provider training and retention terms for `tencent/hy3`: **not verified** | OpenRouter's own logging and retention: **not stated** on the page read, so unknown. Upstream provider retention: **unknown**. Local run records in `console/runs/` deleted after each audit | Owner (Ryan Johnson) | Approved 2026-10-17 for D0/D1 own use with the unknowns left open. Review when the model, provider, or account settings change |

The row above is the only approval. It covers D0 and D1 only, for the owner's own use, with that one model. Any other tool, model (free-tier models are not covered), or data class falls back to this rule: use AI only with D0 public information or purpose-built synthetic training material through systems already authorized by the owner for that use. Its unknowns are accepted by the owner for text they would be comfortable seeing public; they are not resolved.

## Claim Audit extension and Illustrative Examples

Accepted in [`SCOPE-DECISION-CLAIM-AUDIT.md`](../SCOPE-DECISION-CLAIM-AUDIT.md) on 2026-10-17.

- **Data allowed:** the owner's own drafts only, class D0 or D1. D2 and D3 stay excluded; when unsure, use the more restrictive class.
- **Before any real draft is sent to a provider:** the provider must have a row in the register above. As of 2026-10-17 the only row is the owner's own-use OpenRouter row, so the owner's own D0/D1 drafts may be sent; drafts from anyone else may not. Any other provider or model stays out of AI tools until it has its own row.
- **Run records** (`console/runs/`) hold drafts in plaintext and are gitignored. Delete them when the audit is done; never copy them into the repository.
- Nothing in this section approves a tool by itself, sets a retention period, or replaces the review required before any use beyond this extension. The register row is the approval.

## Permitted AI roles

With an approved tool and permitted data:

- Generate alternative intake questions or example architectures.
- Identify counterarguments, missing assumptions, or possible failure modes.
- Transform verified notes into candidate structures.
- Critique a draft against a supplied rubric.
- Generate synthetic training exercises clearly confined to training.

## Prohibited AI roles

- Acting as the source or final verifier of a fact, citation, quotation, or calculation.
- Creating real-seeming customers, quotes, events, credentials, or results for professional presentation.
- Receiving D3 data.
- Sending, publishing, approving, or committing client-facing work autonomously.
- Making final certification, employment, contracting, or applicant decisions without the independent and principal review required by policy.
- Replacing inspectable reasoning with model confidence for a consequential recommendation.

## Required workflow

1. Classify the data before selecting a tool.
2. Confirm the tool/account is approved for that class and purpose.
3. Reduce, mask, or replace data with a synthetic abstraction where possible.
4. State supplied facts, assumptions, and requested generated suggestions separately.
5. Treat factual or citation output as an unverified lead.
6. Verify by output type using an independent source or reproducible work.
7. Record material AI assistance in the engagement's AI work log.
8. Obtain the review required by the person's authorization level.

## AI work log

Record:

- Tool/account/model and date.
- Purpose.
- Data class and minimization performed.
- Material instruction or prompt.
- Output retained, changed, or rejected.
- Independent verification.
- Accountable reviewer and decision.

Do not copy sensitive prompt content into a less restricted log.

## Verification by output type

| Output | Required verification |
| --- | --- |
| Fact | Retrieve a suitable independent source |
| Citation | Open the exact source; verify claim, context, author/title, and date |
| Calculation | Reproduce outside the language model from recorded inputs and formulas |
| Source summary | Compare with the original source |
| Model/scenario | Inspect inputs, formulas, assumptions, sensitivities, and limitations |
| Recommendation | Expose assumptions and test alternatives/counterevidence |
| Draft language | Confirm meaning, certainty, evidence class, and audience interpretation did not change |

## Incident response

Stop work and notify the data/tool owner and client escalation owner when:

- Data was entered into an unapproved tool or wrong account.
- Output containing sensitive data appears in an unintended location.
- An AI-generated false source, quote, calculation, or claim reaches an approved or external artifact.
- Automated behavior sends, publishes, or changes client work without authorization.
- Access, retention, or vendor behavior differs from the approved register.

Do not conceal the event or continue processing to “fix it quietly.” Preserve only the information needed for accountable containment and qualified review.

Record:

- What happened and when.
- Data class and systems involved.
- Who may be affected.
- Immediate containment.
- Required client, vendor, contractual, or legal escalation as determined by qualified owners.
- Corrective action and authorization-restoration decision.

## Access and review

- Grant access based on assigned work and remove it when no longer needed.
- Review the tool register whenever a model, vendor, account configuration, data term, connector, or use changes.
- Reapprove this policy before real client data enters any AI-supported workflow.
- A deadline, client request, or employee seniority cannot waive this policy.

## Approval checklist

- [ ] Data/tool owner named with backup.
- [ ] Initial tool/account register completed.
- [ ] D2 and D3 handling reviewed by appropriate qualified owners.
- [ ] Client contractual promises align with actual tools and data paths.
- [ ] AI work-log location approved.
- [ ] Incident location and escalation contacts approved.
- [ ] Tabletop AI data scenario completed.

**Approved by:**  
**Date/version:**  
**Next review:**  
