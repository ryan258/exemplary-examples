SYNTHETIC OUTPUT: an earlier run that leaked internal notes into the copy; kept as a failing fixture for the pack checker.

## Summary
Classes: UNPLACED 7, Client-provided fact 3, Calculation 1. Priorities: High 4, Medium 5, Low 2. Verdict: Draft is partially supported by client-supplied PROFILE facts for membership count, Halden report percentage, testimonial, pricing, and refund window; remaining claims are unverified and need owner input or removal before publication.

## Claim register
| # | Claim (verbatim) | Kind | Class | Why | Evidence needed | Cannot support | Check by | Priority | Safe rewrite |
|---|---|---|---|---|---|---|---|---|---|
| 1 | SYNTHETIC SAMPLE: the company, people, award, institute, and figures below are invented for testing. | factual-description | UNPLACED | Claim gives no retrievable source, client attribution, or other provenance. | Confirm this is a testing placeholder and not intended for final brand copy; remove or reframe as needed. | Any real product attribute or efficacy claim. | remove-or-reframe | Low | `[UNVERIFIED: "SYNTHETIC SAMPLE: the company, people, award, institute, and figures below are invented for testing."; needs confirmation as testing placeholder not final copy]` |
| 2 | Nothing here is real. | factual-description | UNPLACED | Claim gives no retrievable source, client attribution, or other provenance. | Confirm this is a testing disclaimer and not part of final consumer copy; remove or reframe. | Any actual Mossgrove Sleep claim. | remove-or-reframe | Low | `[UNVERIFIED: "Nothing here is real."; needs confirmation as testing disclaimer not final copy]` |
| 3 | Mossgrove's guided program is clinically proven to cure insomnia. | factual-description | UNPLACED | Claim gives no source, client attribution, or calculation; provenance missing. | Apply PROFILE claims policy (no medical or treatment claims, no "cure", "clinically proven"); obtain rewrite removing prohibited terms; no source exists to support. | Any medical, treatment, or cure efficacy claim, regardless of any study, because policy forbids such claims. | remove-or-reframe | High | `[UNVERIFIED: "Mossgrove's guided program is clinically proven to cure insomnia."; needs rewrite removing prohibited terms per PROFILE claims policy and source]` |
| 4 | In our member study, people went from sleeping 5.2 hours to 7.4 hours a night. | statistic | UNPLACED | No retrievable source named and not listed as client-provided fact; provenance missing. | Obtain the member study data from owner, including sample size, method, and exact figures 5.2 and 7.4, and population. | Causation that the program caused the change; generalizability to all adults 30-55; before/after result without sample size and method (PROFILE requires these). | ask-owner | Medium | `[UNVERIFIED: "In our member study, people went from sleeping 5.2 hours to 7.4 hours a night."; needs member study data with sample size, method, exact figures]` |
| 5 | A 2024 report from the Halden Sleep Institute found that nearly 1 in 2 adults sleep under six hours. | statistic | UNPLACED | PROFILE fact states "The Halden Sleep Institute 2024 report, supplied copy on file, found that 27% of surveyed adults sleep under six hours," contradicting the claim; draft also lacks specific report title and full retrievable source. | Open the supplied Halden Sleep Institute 2024 report on file (owner Marketing); confirm the exact percentage of surveyed adults sleeping under six hours and reconcile with claim. | That nearly 50% of adults sleep under six hours; the on-file report states 27%. | ask-owner | High | The Halden Sleep Institute 2024 report, supplied copy on file, found that 27% of surveyed adults sleep under six hours. (Owner: Marketing) |
| 6 | Mossgrove has 14,300 active members | statistic | Client-provided fact | PROFILE lists this as client-supplied fact from membership export, owner Product. | Verify with Product owner the membership export dated 2026-09-30 confirming 14,300 active members. | That the count reflects any date other than 2026-09-30 or a different segment. | ask-owner | Medium | Mossgrove has 14,300 active members as of 2026-09-30. (Owner: Product) |
| 7 | Mossgrove was named Winner of the 2025 Golden Pillow Award. | comparison-or-ranking | UNPLACED | PROFILE states "No awards are on file," contradicting the award claim; claim also provides no source or client attribution. | Apply PROFILE fact "No awards are on file"; request proof from owner; if none, remove claim. | Any award status; PROFILE states none on file. | remove-or-reframe | High | No awards are on file. (Owner: not specified in PROFILE) |
| 8 | "I fall asleep faster and wake up clear-headed," says Priya Raman, Operations Director at Fernhill Logistics. | testimonial-or-endorsement | Client-provided fact | Draft and PROFILE give full name, organization, role, and PROFILE confirms written permission on file; covers only speaker's quoted words. | Confirm written permission on file (2026-08-12, owner Marketing) and exact quote; verify full name, organization, role. | That typical users will have the same experience; it is a single testimonial. | ask-owner | Medium | `[UNVERIFIED: testimonial; needs full attribution and written permission]"I fall asleep faster and wake up clear-headed," says Priya Raman, Operations Director at Fernhill Logistics. (Owner: Marketing)` |
| 9 | Start the 14-day plan for $49 | price-or-offer | Client-provided fact | PROFILE price sheet lists 14-day plan at $49 as client-supplied fact from Sales Ops. | Verify with Sales Ops current price sheet showing 14-day plan $49. | Any discount versus other plans beyond the stated price. | ask-owner | Medium | Start the 14-day plan for $49 (Owner: Sales Ops) |
| 10 | a 60% saving on our $89 monthly price | comparison-or-ranking | Calculation | Arithmetic fails: (89-49)/89 ≈ 45% saving, not 60% as claimed. | Recompute the saving from $89 to $49: (89-49)/89 ≈ 45%; correct the percentage or reframe. | A 60% saving; the math yields ~45%. | recompute | Medium | a 45% saving on our $89 monthly price |
| 11 | try it risk-free with our 60-day money-back guarantee | forecast-or-promise | UNPLACED | PROFILE states "refunds within 30 days," contradicting the 60-day guarantee claim; claim provides no source or client attribution. | Apply PROFILE refund policy (30 days, owner Sales Ops); obtain source for 60-day claim or remove; confirm allowed refund window. | Any 60-day refund promise; PROFILE states 30 days. | remove-or-reframe | High | try it risk-free with refunds within 30 days (Owner: Sales Ops) |

## Open verification tasks
High priority:
- #3 (remove-or-reframe): Remove or reframe medical claim per PROFILE policy forbidding cure/clinically proven terms.
- #5 (ask-owner): Open supplied Halden Sleep Institute 2024 report on file (owner Marketing) to confirm 27% figure and reconcile.
- #7 (remove-or-reframe): Apply PROFILE fact "No awards are on file"; remove award claim.
- #11 (remove-or-reframe): Apply PROFILE refund policy (30 days, owner Sales Ops); correct guarantee wording.

Medium priority:
- #4 (ask-owner): Obtain member study data with sample size, method, exact figures from owner.
- #6 (ask-owner): Verify membership export dated 2026-09-30 with Product owner.
- #8 (ask-owner): Confirm written permission on file (2026-08-12, Marketing) and full attribution for testimonial.
- #9 (ask-owner): Verify current price sheet showing 14-day plan $49 with Sales Ops.
- #10 (recompute): Restate saving as ~45% from draft inputs $89 and $49.

Low priority:
- #1 (remove-or-reframe): Confirm synthetic placeholder not intended for final brand copy.
- #2 (remove-or-reframe): Confirm testing disclaimer not part of consumer copy.

## Rewritten draft
# Mossgrove Sleep: Wake up the way you were meant to

[UNVERIFIED: "SYNTHETIC SAMPLE: the company, people, award, institute, and figures below are invented for testing."; needs confirmation as testing placeholder not final copy]

[UNVERIFIED: "Nothing here is real."; needs confirmation as testing disclaimer not final copy]

[UNVERIFIED: "Mossgrove's guided program is clinically proven to cure insomnia."; needs rewrite removing prohibited terms per PROFILE claims policy and source]

[UNVERIFIED: "In our member study, people went from sleeping 5.2 hours to 7.4 hours a night."; needs member study data with sample size, method, exact figures]

The Halden Sleep Institute 2024 report, supplied copy on file, found that 27% of surveyed adults sleep under six hours.

Mossgrove has 14,300 active members as of 2026-09-30 and no awards are on file.

[UNVERIFIED: testimonial; needs full attribution and written permission]"I fall asleep faster and wake up clear-headed," says Priya Raman, Operations Director at Fernhill Logistics.

Start the 14-day plan for $49, a 45% saving on our $89 monthly price, and try it risk-free with refunds within 30 days.

## Limits
Classification above is a model's reading of the draft, untrusted until a person checks each item against sources and the PROFILE; this is not legal or compliance advice.
