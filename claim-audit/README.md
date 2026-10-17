# Claim Audit (v1)

Paste a marketing or business draft; get every claim classified under the six-class truth standard, the evidence each still needs, and a safer rewrite, then run a mechanical check on the result. Scope and limits: [`../SCOPE-DECISION-CLAIM-AUDIT.md`](../SCOPE-DECISION-CLAIM-AUDIT.md). Data rules: [`../operations/AI-DATA-POLICY.md`](../operations/AI-DATA-POLICY.md).

**v1 status:** built and tested on fictional drafts only. It has not been used on a real asset, so the scope decision's exit criteria (three real assets, honestly scored) are **not met**.

> **Before you use a real draft:** only your own D0/D1 drafts, only through the provider row in the [policy register](../operations/AI-DATA-POLICY.md) (OpenRouter, `tencent/hy3`). Its retention terms are unknown, so use text you would be comfortable seeing public. Anyone else's draft needs the volunteer notice first.

## Run it

```bash
# 1. Audit (four model calls, about 1.5 cents and a few minutes on the model used in testing)
node --env-file=.env console/console.mjs --dir claim-audit --all \
  --profile claim-audit/_samples/profile.example.md \
  --idea-file claim-audit/_samples/synthetic-draft-01.md

# 2. Check the result mechanically and save the pack
node claim-audit/check.mjs --out pack.md
```

Preview the plan with no credentials or cost: `node console/console.mjs --dir claim-audit --all --dry-run --idea "x"`.

`--all` runs the four cards in order, opening your editor between them. That is the moment to fix a misquoted claim or a wrong class. `--no-edit` runs unattended. The runner prints token use, and the provider's cost when it reports one, to stderr when it finishes. See [Editing between cards](../console/README.md#editing-between-cards) for setting a GUI editor.

| Step | Card | Adds to the table |
| --- | --- | --- |
| 1 | `extract-claims` | Verbatim, atomic claims and their kind |
| 2 | `classify-claims` | Truth class (or UNPLACED) and why |
| 3 | `evidence-needs` | Evidence needed, what it cannot support, check-by, priority |
| 4 | `safe-rewrite` | Safe rewrite, and the final five-section evidence pack |

## The profile

`--profile <file>` adds your context to every card as labeled data: brand, audience, voice, claims policy, and **facts the client supplied** (those can be classed Client-provided fact). Copy [`_samples/profile.example.md`](_samples/profile.example.md). The profile is saved with the run, so `--resume` reuses it. It is context, not instructions, but write it as if it will be read by the model, because it is.

## Reading the pack

- **Class** says where a claim comes from, not whether it is true. **UNPLACED** means the draft gives it no provenance. That is expected, not a failure.
- **Check by** is the next action: `open-source`, `recompute`, `ask-owner`, `get-permission`, or `remove-or-reframe`.
- **`[UNVERIFIED: "…"; needs …]`** in the rewritten draft quotes the unsupported phrase and what it needs. Resolve each one or remove the phrase before publishing. A pack with brackets in it is not publishable copy.
- Nothing in the pack has been checked by a person. The Limits section says so on purpose.

## The pack checker

`check.mjs` tests the finished pack against the cards' own rules and against your draft and profile. It does not call a model and gives the same answer every time.

| Level | What it flags |
| --- | --- |
| **ERROR** (exit 1) | A missing section or column; a value outside the allowed lists; a summary count that disagrees with the table; more High rows than one third of the register; a forecast, promise, or testimonial rated Low; internal-record phrases in the rewritten copy ("on file", "price sheet", "client-provided", "owner:" and similar); strong wording ("guaranteed", "proven", "award", "leading", "#1" and similar) that neither the draft nor the profile contains. |
| **WARN** | A number in the rewrite that is not in the draft or profile (fine only if it is a recomputation); a draft sentence that looks dropped or replaced; verdict wording such as "verified" or "defensible". |

A pack with no findings has only passed these mechanical tests. The checker cannot say a claim is true, cannot see that a comparison is unlike for like, and cannot judge a rewrite's meaning.

## Known gaps

Measured on two fictional drafts, a handful of runs each, with one model (`tencent/hy3`) on 2026-10-17. Treat these as observed behavior; each run was one sample from a non-deterministic model.

- **Detection is the strong part.** Every planted defect was caught on both drafts, contradictions against the profile were found, supported claims were not flagged, and no run invented a source, figure, name, or study.
- **The rewrite step is noisy.** Between runs of the same draft it flipped on whether to substitute a profile fact (212 accounts), whether to correct or replace an arithmetic claim, whether a citation counted as Sourced fact, and how much of a sentence to bracket (once including the brand name). Read the rewritten draft as a first pass to edit, not copy to publish. The checker now catches several of these failures (internal notes in the copy, invented strong wording, dropped sentences), but not all.
- **Wording can escalate.** In one run "refunds within 30 days" became "30-day money-back guarantee". The checker misses this when the draft already contains the word "guarantee". Compare any rewritten claim with the profile's exact wording.
- **Baselines.** After a rule was added to the evidence card, the one run on the draft with a 14-day price compared to a monthly price did flag it as not like for like. Before the rule, it was missed in the one run that tested it, and a missing baseline for "save" was flagged in another. The rewrite still kept the comparison ("a 44.9% difference from our $89 monthly price"). Check every comparison's baseline yourself.
- **Priority varies run to run.** The cap and the never-Low rules are now enforced by the checker, but which claims fill the High slots still changes. A claim that breaks the profile's claims policy was High in one run and Medium in another. Scan the full register, not only the High rows.
- **The compliant-rewrite rule is not working.** Card 4 says to rewrite a claim that breaks a claims policy into allowed wording. Across the trials the model either bracketed the whole sentence or produced a vacuous one ("Mossgrove's guided program is a guided program."). Treat these as placeholders to be written by a person.
- **Test labels can become claims.** The "SYNTHETIC SAMPLE" line at the top of each sample was sometimes extracted as a claim. Real drafts will not carry it.
- **Stability.** The checker reports a pack's problems; it does not make two runs agree. Run a draft twice if the result matters and compare the registers.
- **Small sample.** Two drafts, one model, no repeated-run statistics. The cards' changelogs say "not yet re-measured" where a revision has not been rerun.

## Samples and fixtures

`_samples/` holds two deliberately flawed, fully fictional drafts, each with a matching profile (`synthetic-draft-01.md` with `profile.example.md`; `synthetic-draft-02.md` with `profile-02.example.md`), and recorded model output for the checker's tests (`example-pack-*.md`, including one that leaks internal notes on purpose).

- **Draft 1** plants an unsourced customer count that contradicts the profile, a ranking with no basis, an unattributed percentage, a named survey that is only a lead, arithmetic that does not add up, a testimonial without permission, and a forecast stated as a promise.
- **Draft 2** plants a medical claim the profile forbids, a before/after result with no sample size, a fictional award the profile says does not exist, a misquoted statistic (the supplied report says 27%), a wrong percentage saving, and a refund window that contradicts the profile. It also includes supported controls (a member count, a price, and a testimonial with permission recorded) that should not be flagged.

`node --test tests/*.test.js` pins all of this. It does not call a model, so it proves the cards' rules, the runner, and the checker, not the model's judgment.

## What v1 does not do

- It does not open sources, recompute in code, or check that a URL resolves. A class is a model's reading of the draft, not verification.
- It does not take Word, PDF, or web input, only text, and it does not export beyond the Markdown pack.
- It is not legal or compliance advice.
- It has not been tried on a real draft.
