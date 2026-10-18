# How the local project works

The project has two independent paths: a static reference site and a text-only model workflow. [Start or return](../docs/START.md) gives the short owner commands; this note explains where behavior and evidence live.

## Components and data flow

```text
owner brief + optional profile + owner answers
                    |
       scripts/ee.mjs (short local commands)
                    |
       console/console.mjs (stage runner)
         |                         |
  Markdown card Prompt       scripts/llm.mjs
         |                         |
         +----- provider request --+--> OpenRouter
                    |
      STATUS reply + optional owner edit
                    |
      atomic console/runs/<id>.json
                    |
     claim-audit/check.mjs or examples/check.mjs
                    |
      findings + optional local Markdown pack
                    |
          owner review and verification
```

The helper is a convenience entry point. The runner owns ordered stages, context, request attempts, editing, saved state and resume. The provider adapter owns request formatting and transport. The two checkers are separate deterministic commands; a saved run is not accepted merely because the model finished. The helper's `check` command selects the appropriate checker for the run.

Four libraries share the runner: three brand cards in `console/cards/`, fourteen engineering cards in `prompts/`, four Claim Audit cards in `claim-audit/`, and three example cards in `examples/`. Only a card's exact `## Prompt` section becomes its task instructions. Card titles, prerequisites, expected outputs, failure modes and changelogs are human-facing documentation. The runner adds the stage response contract.

The model receives only supplied text; it has no repository browsing, retrieval, command execution or independent verification tools. The local runner itself reads cards/input files, writes run records, and can launch the owner's configured editor. Engineering cards review the text provided; orchestration cards design a workflow rather than starting agents.

## Context, state and recovery

Every stage receives the original brief, profile and accumulated owner answers alongside the previous stage's accepted output. Profile and draft text are labeled input data; claims policy can constrain wording, but input text does not grant new tool or data authority.

The reply begins with COMPLETE, NEEDS_INPUT or BLOCKED in the runner's STATUS format. A valid status is a format result, not proof of correctness. NEEDS_INPUT pauses at the same stage and preserves the owner's answer for later stages. Failed or interrupted work can be resumed explicitly; the runner does not silently retry a paid request.

Each request attempt records its actual prompt/card hash, input context, requested model, response/error, timing and provider-reported usage/cost when available. A requested OpenRouter model does not establish which upstream provider actually processed it or resolve retention unknowns. Failed attempts and retries can cost money; unavailable cost is unknown, not zero. Prompt changes are recorded per attempt rather than rewriting earlier provenance.

Run records and exports live in gitignored `console/runs/`. They are plaintext, not encrypted storage. The helper's explicit `finish RUN_ID` removes that run and its marked local exports; it does not remove source inputs or an export outside that directory. It is possible to lose a local record after a provider completed a request; resume can therefore incur another charge.

## The output contracts

Claim Audit preserves exact quoted source spans in a numbered register. An implied interpretation is separate from its quotation. Provenance class, unresolved evidence, relative work priority and rewritten copy answer different questions. An unresolved review draft is not publishable copy. Derived figures are allowed only with stated inputs, formula and units.

Illustrative Examples preserve their framing and assumptions through writing and challenge. SUPPLIED means the original owner brief/profile supplied the value; ASSUMED means a chosen scenario input; DERIVED means a calculated output with working. An earlier model output cannot turn an invented value into a supplied fact. Every numeric value used in the final example, including its break-even and sensitivity, must have a traceable numbers-box entry.

The checkers validate structure, allowed values and bounded textual/numeric consistency rules without calling a model. They cannot determine truth, fairness, persuasiveness, legal compliance or whether a cited source supports its claim. Read the current known gaps in repository files `claim-audit/README.md` and `examples/README.md`; keep the exact illustrative label and review every unresolved issue.

## Static site

`hugo.toml` mounts selected repository content into Hugo. `index.html` is the original Local Edition experience; `layouts/` and `assets/styles.css` supply the documentation shell and visual rules. The site uses local system font stacks and does not require remote fonts. It has no intake, analytics, backend or automatic publishing mechanism.

Use `node scripts/ee.mjs preview` to serve only generated output on loopback. Do not serve the repository root: it also contains Git metadata and may contain `.env` secrets. For a disk export, choose a fresh empty destination outside the repository, for example `hugo --destination /tmp/ee-export-UNIQUE`; inspect that generated tree, not stale files in an old `public/` directory. Do not delete an existing export that the owner may need.

The training archive intentionally includes keys and facilitator notes. Future synthetic candidate evaluations must use separate allowlisted materials and fresh candidate/assessor contexts, never the whole rendered archive.

## Maintain and evaluate

Edit one card at a time, add an `instruction revision` changelog entry, and update the relevant targeted contract. Changing fixed headings, allowed values, labels or pack schema requires matching card/checker/documentation/test changes. Improved wording is not measured optimization.

Current training definitions separate provenance from verification. The authored curriculum has one demonstrated synthetic route; it is not fully validated and grants no credential. The original dry-run directory is frozen. Its historical manifest checks selected artifacts; an adjacent external SHA-256 inventory covers the complete file set without modifying any historical artifact.

Use [the bounded evaluation worksheet](../docs/EVALUATION.md) for synthetic regression observations and the three owner-asset usefulness gate. An offline contract pass does not establish model performance, real-asset usefulness, browser acceptance, or certification. Commercial roadmap gates remain archived unless a new written scope decision opens them.
