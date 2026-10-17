# Scope Decision: Claim Audit Extension

**Status:** Accepted
**Date:** 2026-10-17
**Decision owner:** Repository owner
**Effect:** amends [`LOCAL-EDITION.md`](LOCAL-EDITION.md); supersedes its "Intentionally excluded" list only for the items named under "Scope opened". Everything else in the Local Edition stands.

## Context

The Local Edition closed the project as a satirical, local-only artifact. Its one reusable asset is the six-class truth standard, plus a card runner that can chain prompts. A review on 2026-10-17 found that marketing and business professionals have a real need this asset fits: showing which claims in their own copy, decks and case studies are sourced, calculated, inferred or modeled. Serving that need requires real user material, which the Local Edition forbids.

## Decision

Add one workflow, **Claim Audit**, and nothing else.

> Input: draft marketing or business copy. Output: an evidence pack listing every atomic claim, its truth class, the evidence it still needs, what it cannot support, and a safer rewrite.

## Scope opened

| Item | Limit |
| --- | --- |
| Real user material | The owner's own non-confidential drafts only (data class D0/D1). |
| External participants | None. The owner is the only user. |
| Deliverable | A local CLI producing a Markdown/CSV (later HTML) evidence pack. |
| Cards | At most 8 marketing cards, plus brand-agnostic versions of the 3 existing brand cards. |
| AI use on real material | Only through a provider the owner has checked for data retention; recorded in the approved-tool register in `operations/AI-DATA-POLICY.md`. |

## Still excluded

- Public hosting, deployment, payments, accounts, analytics, or an intake form.
- Paid client work, contracts, or any offer to sell.
- Confidential (D2) or restricted (D3) data.
- Legal, compliance or professional advice. The tool classifies claims; it does not certify them. Output carries the line "untrusted until independently verified".
- Credentials, certification, or the training system's candidate pipeline.
- New canon: no production bible, universe or series structure for this extension.

## Completion test (instincts, Part 1)

| Question | Answer |
| --- | --- |
| The number | 1 workflow, at most 8 cards. |
| The single tool | The evidence pack file. |
| Fits one burst | Target 2–3 weeks. |
| Canon to remember | None new; the six-class standard already exists. |
| Core idea in unit one | Yes, claim extraction and classification. |

## Exit criteria

- Claim Audit run on at least 3 real assets, with claims found, claims wrongly classified, and time saved written down honestly.
- If it caught nothing the author had not already seen, stop and return to the Local Edition.

## Consequences

1. `LOCAL-EDITION.md` points here (done).
2. `README.md`, `STATUS.md`, `index.html` and the scope assertions in `tests/documentation-contract.test.js` were updated in the same change (done).
3. `operations/AI-DATA-POLICY.md` now has a Claim Audit section. On 2026-10-17 the owner recorded one own-use approval (OpenRouter, `tencent/hy3`, D0/D1, with retention unknowns stated). No other provider or data source is approved.
4. The exclusions on hosting, payments, intake and D2/D3 data are unchanged; reopening any of them needs another written decision.

## Progress (2026-10-17)

- Built: v1 CLI, the pack checker, and two fictional samples. Known unreliable behavior is listed in [`claim-audit/README.md`](claim-audit/README.md#known-gaps).
- Not done: any run on a real asset. A provider row exists for the owner's own use (2026-10-17), but the exit criteria above are **not met**.

## Amendment: Illustrative examples

**Date:** 2026-10-17. **Chosen by the owner in chat.** A second workflow is added under the same limits: the owner makes openly labeled, assumption-based examples that small businesses can show their own customers.

- **Allowed:** fictional personas and modeled scenarios; the business's own public or non-confidential facts as inputs; the label line `Illustrative example — not a real customer or result.` on every example.
- **Still excluded:** real customers' data or results, testimonials and attributed quotations, invented statistics or sources, payments, hosting, intake, and D2/D3 data.
- **Real case studies** built from a business's actual customers need a further written decision.
- Code: [`examples/`](examples/); known limits: [`examples/README.md`](examples/README.md#known-gaps).

## Amendment: owner-only

**Date:** 2026-10-17. **Chosen by the owner in chat.** The owner is the only user of this program, on their own machine. The earlier allowance for up to five volunteers' drafts, and the volunteer notice that went with it, is withdrawn. Anyone else's draft needs a new written decision.

## Approval

Approved by: Repository owner (Ryan Johnson), in chat, 2026-10-17.
