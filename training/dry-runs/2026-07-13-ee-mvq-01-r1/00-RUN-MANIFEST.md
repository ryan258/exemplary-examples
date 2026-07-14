# Agent Qualification Run Manifest

**Run ID:** 2026-07-13-ee-mvq-01-r1

**Started:** 2026-07-13

**Curriculum version:** EE-TRAINING-2026.07-draft

**Evaluation fixture version:** EE-MVQ-01

**Data classification:** Purpose-built synthetic D1 only

**Candidate packet SHA-256:** `45139901c870cb68f58d5946accbc5ce55136a87fe78c4d1bb170b0a20cacba5`

**Facilitator packet SHA-256:** `4ff8ea7c65bd00301ffebc46b4064ca5f968bec2a4ef450739f491f4a31831c4`

**Assessor key SHA-256:** `c1150de57a39e71d8ac7c7ddcebc50dee5bb444e80b9700d0135ed407a6a0abd`

## Assignments

| Function | Agent ID | Runtime/model | Instruction version | Context isolation confirmed? |
| --- | --- | --- | --- | --- |
| Program owner | EE-01 Northstar | Root Codex session / GPT-5 family; exact deployment unavailable | Current run orchestration | N/A |
| Candidate | EE-03 Keystone (`/root/keystone_candidate`) | Fresh Codex subagent / GPT-5 family; exact deployment unavailable | Keystone isolation prompt r1 | Yes — `fork_turns=none`, candidate-visible allowlist |
| Facilitator | EE-04 Forge | Root Codex session / GPT-5 family; exact deployment unavailable | EE-MVQ-01 facilitator packet | Separate from candidate |
| Assessor 1 | EE-05 Verity (`/root/verity_assessor`) | Fresh Codex subagent / GPT-5 family; exact deployment unavailable | Verity isolation prompt r1 | Yes — `fork_turns=none`, assessor allowlist |
| Assessor 2 | EE-06 Counterpoint (`/root/counterpoint_assessor`) | Fresh Codex subagent / GPT-5 family; exact deployment unavailable | Counterpoint isolation prompt r1 | Yes — `fork_turns=none`, assessor allowlist |

## Artifact versions

| Artifact | Frozen location/version | Created by | Released to |
| --- | --- | --- | --- |
| Candidate brief | `fixture/01-CANDIDATE-PACKET.md`, hash above | Forge | Keystone |
| Candidate output | `02-CANDIDATE-OUTPUT.md`; SHA-256 `9a1eced8ae89ccf3a1d7ef185851694484eaed24dfb02d342cef461b20cce2e8` | Keystone | Verity + Counterpoint only after freeze |
| Initial score 1 | `04-VERITY-SCORE.md`; SHA-256 `7b68d9c63015b377dfa74cf241928cc4b219fdc8b251ede7bfbd9aab23ce3828` | Verity | Northstar only before calibration |
| Initial score 2 | `05-COUNTERPOINT-SCORE.md`; SHA-256 `4650ba9a331990b25f32205f1bed8e6fe41f81acfefe431a979a6fa6fddcabef` | Counterpoint | Northstar only before calibration |
| Calibration record | `06-CALIBRATION.md`; SHA-256 `c584a4361ba4dcddd5e9a86b762cdcb25f0d0a30cea4d10e8c966edd2d03ea67` | Verity + Counterpoint | Northstar |
| Certification boundary | `07-CERTIFICATION-RECORD.md`; SHA-256 `d7aad2c5cd55b181a0bd039c7acaaefbf3080008a00219e8326e1a9915d5d994` | Northstar | Program record |
| Dry-run report | `08-DRY-RUN-REPORT.md`; SHA-256 `1de89357a89141bcaff58807a582f633c6c606a1eb6f7cc6e66fe890e30aed38` | Northstar | Program record |

## Validity checks

- [x] Candidate received a candidate-visible file allowlist and an explicit prohibition on hidden material.
- [x] Fixture files match the versions/hashes frozen at the start of the run.
- [x] Candidate output was frozen before assessors received it.
- [x] Assessors had no shared conversation or initial-score context before both scores were frozen.
- [x] Assessor outputs cite observable evidence rather than style or model reputation.
- [x] No real participant/client data or unauthorized external tool is in the work envelope.
- [x] Written-event accessibility accommodation was exercised and recorded.
- [x] Both assessors checked critical failures and invalidating conditions; neither found a critical failure or invalidating gap.
- [x] The dry-run report distinguishes completed records from certification or external authorization.

## Outcome

- [x] Complete and successful
- [ ] Complete; curriculum revision required
- [ ] Incomplete/invalid; repeat named stage
- [ ] Paused for safety or authority review

**Decision and evidence:** The minimum viable composite training route passed. Both frozen independent scores rated every competency at least Ready, found no critical failure, and selected Ready for the named synthetic gate. Calibration reconciled the sole one-point difference (C4) to Ready. The certification record remains Not Yet and grants no external authority.

**Next action/owner:** Program owner obtains rendered-artifact, completed-triangulation, and supervised-work evidence before any candidate certification. Governance owners complete P0.1 before real client operation.
