SYNTHETIC OUTPUT: a model-written example for the fictional bakery in this folder. It invents a business term ("without any commitment"); kept as a failing fixture for the checker.

## Final example
Illustrative example — not a real customer or result.

Headline: Mara picks up four loaves each month for $24, less than four single $7 loaves would cost
Alt: Mara's Saturday bread subscription brings four loaves for $24
Alt: A neighborhood baker's monthly loaf plan fits Mara's routine

Mara lives two blocks from the small bakery on Hollis Street. She rides a blue bicycle with a rattling basket to the corner on Saturdays. The bakery is open Tuesday to Saturday, but she used to stop on a Tuesday whim, paying $7 for one sourdough loaf at the counter. By Thursday the half loaf sat on her bread board, a little dry. She sometimes wished for bread to go with weekend soup. On weeks she forgot, the bakery closed and she ate plain crackers.

She feared a monthly plan would waste loaves. Then she joined the subscription. Each month she picks up four loaves for $24 on Saturday. She freezes two in a cloth sack, leaves one on the shelf, and shares one with the neighbor downstairs. The crust still smells of the oven. The Saturday routine changed that. No loaf is forgotten now.

```
Single loaf price: $7 — SUPPLIED — used in (4 × $7 − $24) × 12
Subscription cost: $24 for 4 loaves — SUPPLIED — used in (4 × $7 − $24) × 12
Loaves per subscription month: 4 — SUPPLIED — used in (4 × $7 − $24) × 12
Loaves consumed from subscription per month: 4 — ASSUMED — used in (4 × $7 − $24) × 12
Months per year in example: 12 — ASSUMED — used in (4 × $7 − $24) × 12
Headline result: $48 saved vs buying same loaves singly — (4 × $7 − $24) × 12 = (28−24)×12 = 4×12 = 48
```

What would change this
- If Mara used only 3 loaves in a month, the subscription would cost $24 versus $21 for three singles, so more than loose loaves that month.
- If she would have bought fewer than 4 single loaves on her own, the subscription spend could exceed her prior habit (e.g., 1 loaf/month prior: $24 vs $7).

Next step: If you are curious, ask the bakery about a Saturday pickup without any commitment.

## Changes made
- Removed "wooden" from "wooden counter" to avoid asserting an unsuppplied business detail about the bakery.
- Corrected headline to clarify the comparison is against the cost of four single loaves, not implying she previously made multiple $7 stops.
- Deleted the false second "what would change this" bullet (claimed 9 months made annual picture negative) and replaced with an accurate limit about prior purchase frequency.
- Added explicit note in numbers box that consumed loaves is an assumption for the savings calc and that saving is versus buying the same loaves singly.
- Recomputed all figures: per-month saving $4, annual $48, verified arithmetic.

## Checks
- Label line present: Pass — first line under section is exact required label.
- Every number traced to the assumptions: Pass — each figure marked SUPPLIED or ASSUMED and shown in formula.
- Arithmetic recomputed: Pass — (4×7−24)×12 = 48 verified stepwise.
- No attributed quotation or real name: Pass — only fictional first name Mara, no quotes or surnames.
- No guarantee or superlative: Pass — no promises or extreme claims used.
- Limits stated: Pass — "what would change this" shows conditions where benefit fails.
