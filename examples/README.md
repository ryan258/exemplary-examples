# Illustrative examples for small businesses

Make an honest, vivid example a small business can show its customers: a made-up but plausible customer, a short story, and the arithmetic behind it, always labeled as an example and never posing as a real result. This is the project's original joke turned useful: the perfect example, built in the open.

Scope: [`../SCOPE-DECISION-CLAIM-AUDIT.md`](../SCOPE-DECISION-CLAIM-AUDIT.md#amendment-illustrative-examples) (illustrative only: no real customers, no real results).

> Use only public or non-confidential facts (D0/D1). Send them only through the provider row in the [policy register](../operations/AI-DATA-POLICY.md) (OpenRouter, `tencent/hy3`, your own use); its retention terms are unknown. If a small business gives you facts, make sure they are ones it is comfortable being public.

## Make one

1. Write a short brief: what the business sells, who buys it, and **the hesitation the example should answer** ("I'd never use it enough to be worth it"). Add any real facts the business can supply (prices, hours, quantities). Copy [`_samples/brief-01.md`](_samples/brief-01.md).
2. Optional profile: voice and claims policy. Copy [`_samples/profile-01.example.md`](_samples/profile-01.example.md).

```bash
node --env-file=.env console/console.mjs --dir examples --all \
  --profile examples/_samples/profile-01.example.md \
  --idea-file examples/_samples/brief-01.md
node examples/check.mjs --out my-example.md
```

About one cent and a minute or two per example on the model used in testing. Preview without cost: add `--dry-run` to the first command.

| Step | Card | What it does |
| --- | --- | --- |
| 1 | `frame-example` | Decides the decision, persona, and assumptions table (every number marked `SUPPLIED` or `ASSUMED`), works out the result, the break-even, and the sensitivity |
| 2 | `write-example` | Writes the customer-facing example under a fixed label line |
| 3 | `challenge-example` | A skeptical re-read that fixes misleading wording, recomputes figures, and lists a seven-point pass/fail check |

The runner opens your editor between cards. Edit the framing there: the numbers and the break-even are the part to get right before any copy exists.

## What makes it honest

- The first line is always `Illustrative example — not a real customer or result.`
- Every number is `SUPPLIED` (the business gave it) or `ASSUMED` (a labeled, round guess). Nothing is presented as a statistic, and nothing cites a study, survey, award, or competitor.
- The example states its **break-even**: where the offer stops being worth it. Customers trust an example that says so.
- No quotations, testimonials, surnames, or real businesses.
- The model may not add facts about the business that the brief did not give ("no commitment", "cancel anytime", "fresh daily"). In the first test it did exactly that.

## The checker

`check.mjs` runs after the model and gives the same answer every time.

| Level | What it flags |
| --- | --- |
| **ERROR** (exit 1) | Missing label line; no SUPPLIED/ASSUMED marks; an attributed quotation; real-customer wording ("most people", "customers like you", "case study"); strong words ("guaranteed", "best", "leading", "#1") not in the brief or profile; business terms nothing supplied ("without any commitment", "free trial", "locally sourced") |
| **WARN** | Numbers not in the brief, profile, or framing (fine only if they are arithmetic on stated figures); a missing headline, alternates, "What would change this", numbers box, or next step; a failed item in the challenge checklist |

A clean result does not mean the example is good, persuasive, or fair. It means the mechanical rules held.

## Known gaps

From three runs on two fictional businesses with one model (`tencent/hy3`), 2026-10-17.

- **Arithmetic and labeling held.** In the runs read, every figure was SUPPLIED or ASSUMED, the sums were right, and break-evens were correct (for the bookkeeper, $250 ÷ $90 = 2.78 billable hours). The checker flags derived numbers for you to recompute rather than trusting them.
- **It invented a business term once.** The first run told customers to ask about pickup "without any commitment", which the brief never said, and the challenge step passed it. The cards now forbid this and the checker catches the phrasing; the following run did not repeat it. One run is not proof.
- **Persuasion is uneven.** The bookkeeper example (hours freed against a fee) was concrete and strong. The bakery example's whole benefit is $4 a month, and its story was flatter. The tool cannot make a weak offer exciting; it can only make it honest. The assumptions that favor the offer (for example "100% of freed hours get billed") are labeled `ASSUMED` but are optimistic. Read them as the business's call.
- **Structure drifts.** One run dropped the "What would change this" heading and the next-step label. The checker warns.
- **The challenge step is not independent.** It is the same model re-reading its own work, so it missed the invented term the first time. Read the example yourself before it goes to a customer.
- **Not tried on a real business.** Both samples are fictional.

## Samples

`_samples/` holds two fictional briefs (a bakery subscription and a bookkeeping service), one profile, and recorded model output used by the tests (one passes, one invents a business term on purpose).
