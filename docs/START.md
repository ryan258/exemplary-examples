# Start or return

Exemplary Examples is your local reference and drafting tool: a satirical website, an evidence method, and two owner-only workflows. The original content is authored. Claim Audit and Illustrative Examples are built and tested on fictional material; real-asset usefulness is still unmeasured.

Every command below, plus setup, templates and troubleshooting, ready to paste: repository file `docs/full-copy-and-paste-guide-to-getting-the-most-out-of-this-tool.md`.

## Pick up where you left off

Run these from the repository root. They inspect local state without contacting a model:

```bash
node scripts/ee.mjs status
node scripts/ee.mjs list
node scripts/ee.mjs show
```

`status` gives the current local picture, `list` lists saved runs, and `show` prints the most recent run's result. Add a run ID to inspect a particular record. Run IDs are the names under `console/runs/` without `.json`.

For less typing, this optional alias lasts for the current shell session:

```bash
alias ee='node /Users/ryanjohnson/Projects/nonsense/exemplary-examples/scripts/ee.mjs'
```

Then say or type `ee status`, `ee show`, or the short commands below. No shell configuration file is changed automatically.

## Use your own draft

Only your own non-confidential D0/D1 material is allowed for these two workflows. Anyone else's drafts, actual customers' data/results, and confidential or restricted D2/D3 material remain out of scope. A small-business scenario may be fictional or use deliberately public facts; this is not authorization to accept another business's private draft.

The sole provider/model approval is your OpenRouter account with paid `tencent/hy3`, for these two purposes. Retention remains unknown; use text you would be comfortable seeing public. The exact approval is in repository file `operations/AI-DATA-POLICY.md`; the scope decision is `SCOPE-DECISION-CLAIM-AUDIT.md`.

The following commands make paid model calls when you invoke them. They use your existing `.env` if present and skip between-card editing for lower input effort. A missing key stops before a request. No paid calls occur from the read-only commands above.

```bash
# Four-card evidence review of your own draft
ee audit /path/to/your-draft.md

# Three-card openly illustrative example
ee example /path/to/your-brief.md /path/to/your-profile.md

# Continue a stopped run; optionally answer its pending question
ee resume RUN_ID "your short answer"

# Check a finished result and save its pack locally
ee check RUN_ID pack.md
```

A profile is optional for either workflow. It supplies context, voice, claims policy and attributable facts; it cannot approve new data or change the task's rules. Add `--dry-run` to `ee audit` or `ee example` for a plan without credentials or cost. Add `--edit` if you want between-card editing. Advanced flags and editor setup are documented in repository file `console/README.md`.

## Read and review the result

A clean checker result proves a mechanical contract held. It does not verify a source, calculation, interpretation, promise, or model judgment. Read the complete claim register, resolve every UNVERIFIED annotation, and independently recompute figures before using the copy. Relative Priority means work order, not an absolute safety rating.

Examples must retain the exact line `Illustrative example — not a real customer or result.` Their numeric inputs are SUPPLIED from the original brief/profile or explicitly ASSUMED; calculated outputs are DERIVED with formulas. Keep the framing/source notes with the example. A model's Pass checklist is its own self-check.

Use the small [evaluation worksheet](../docs/EVALUATION.md) when you choose to assess usefulness. It starts empty; three real owner assets have not been evaluated. [Architecture and maintenance](../docs/ARCHITECTURE.md) explains the data flow and the boundaries.

## Finish or browse

Run files contain plaintext prompts, drafts, answers and outputs. After you have reviewed what to keep, finish the specific run:

```bash
ee finish RUN_ID
```

This explicit action deletes that local run record and its marked regular `.md` exports inside `console/runs/`, including real subdirectories. Symlinks are never followed or deleted, and the run record is kept until export removal succeeds so a failed cleanup remains resumable. It does not delete your source draft/profile or exports elsewhere; handle those separately. Do not put private drafts or run records in Git.

To browse the local site, start its loopback-only server, then open the address yourself:

```bash
ee preview
# http://localhost:1313/
```

The [training reference](../training/README.md) includes assessor and facilitator material. It is an owner archive, not a candidate-isolated bundle. The archived company roadmap, real customer discovery, commercial launch and certification gates are not your current backlog.
