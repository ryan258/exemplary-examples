# Bounded owner evaluation

This is an empty worksheet for evaluating the existing workflows. No new trial, model call, result or performance improvement is asserted. [Start or return](../docs/START.md) gives the commands; [architecture](../docs/ARCHITECTURE.md) explains what their checks prove.

## Three own-asset usefulness gate

The accepted scope decision asks whether Claim Audit finds something the author had missed on at least three real assets. Only the owner's own non-confidential D0/D1 drafts, through the registered OpenRouter model and purpose, qualify. Other people's drafts and D2/D3 data stay excluded. No public sharing, customer trial or paid work is needed.

Do not paste a private draft, identifiable material, or its verbatim claims into this tracked worksheet. Keep raw text and output only in the local run records while working. Record a non-identifying asset ID and aggregate observations in a private copy if the summary itself should not be public.

| Asset ID | Baseline review minutes | Audit + owner-check minutes | Claims checked | New useful issues found | Missed issues | Wrong classifications / false flags | Usefulness decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| own-01 | Not measured | Not measured | Not measured | Not measured | Not measured | Not measured | Pending |
| own-02 | Not measured | Not measured | Not measured | Not measured | Not measured | Not measured | Pending |
| own-03 | Not measured | Not measured | Not measured | Not measured | Not measured | Not measured | Pending |

Review the draft yourself first and record what you already noticed. Then run the audit only when you choose to spend on it. Check the entire register and every uncapped Risk flag, not only High rows. Count an issue as useful only after checking it independently; a model disagreement is not a finding. Compare net review effort honestly, including time spent repairing model mistakes.

After all three: record whether it found anything you had not already seen, what you kept/rejected, and whether it reduced effort. If it caught nothing new, follow the decision's stop condition and return to the Local Edition. Leaving this worksheet unfilled is not a blocker for the authored reference archive.

Illustrative Examples has no separately claimed real-business validation. An optional owner trial can use the same fields, replacing claim classification with numeric/provenance mistakes and misleading wording. It does not authorize accepting another business's private draft or publishing the result.

## Small synthetic regression record

Use fictional inputs when revising a card. Keep the sample set bounded to the behavior changed: for example an implied claim, a literal table pipe, a corrected arithmetic result, missing source provenance, an invented term, or break-even/sensitivity drift. Tests of saved fixtures check rules and plumbing; fresh model trials measure sampled model behavior only.

| Field | Record for each chosen trial |
| --- | --- |
| Trial/sample ID | Fictional sample filename and content SHA-256 |
| Workflow and date | Claim Audit or Illustrative Examples; date |
| Requested model | Exact slug; upstream provider only if actually reported |
| Instructions | Card/system hash from each saved request attempt |
| Expected defects and controls | A small list defined before viewing output |
| Observed result | Found / missed / falsely flagged for each expected item |
| Rewrite acceptance | Kept / edited / rejected, with the reason |
| Arithmetic and provenance | Independent recomputation and original source-span checks |
| Attempts, elapsed time, cost | Include failures/retries; unavailable cost remains unknown |
| Limit | Sample count, prompt changes, and what was not tested |

Use the saved attempt record to identify the prompt actually sent, rather than hashing a card that changed afterward. Preserve representative fictional outcomes with a short description; do not rewrite historical fixtures to make a revised checker look successful. A stricter checker may correctly reject an old output that formerly passed.

## Final owner check and cleanup

Resolve every UNVERIFIED phrase, verify sources when a claim depends on them, and recompute numeric outputs outside the model. For examples, preserve the fixed illustrative label, original SUPPLIED provenance, visible ASSUMED inputs, DERIVED formulas, limits and break-even. A model's seven-item Pass list remains a self-check.

After retaining only the reviewed material you want, use `ee finish RUN_ID` for the explicit local run cleanup. It removes that run and its marked regular exports within `console/runs/` across real nested directories; source files and outside exports need separate handling. Do not retain raw owner drafts in Git as evaluation evidence.
