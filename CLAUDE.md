# Project rules — Exemplary Examples™ Local Edition

- **Scope:** the Local Edition plus the owner-only Claim Audit and Illustrative Examples extensions, nothing more ([`LOCAL-EDITION.md`](LOCAL-EDITION.md), [`SCOPE-DECISION-CLAIM-AUDIT.md`](SCOPE-DECISION-CLAIM-AUDIT.md)). No hosting, intake, payments, or confidential (D2/D3) data.
- **Real drafts go only through a provider with a row in the register** in `operations/AI-DATA-POLICY.md`: today that is OpenRouter with `tencent/hy3`, D0/D1, the owner's own use. Anyone else's drafts, other models, and D2/D3 stay out. Fictional files are in `claim-audit/_samples/` and `examples/_samples/`.
- **Verify with** `node --test tests/*.test.js` and `node console/console.mjs --selftest`. The suite makes no model calls, so it proves rules and plumbing, not model judgment.
- **Illustrative examples** (`examples/`) are labeled, assumption-based, and never real customer results; real case studies are out of scope until a new written decision.
- **Changing a card:** edit one card at a time, add a Changelog line that says "instruction revision" (never "optimized" without a measurement), and update its relevant test: `tests/claim-audit.test.js` for Claim Audit, `tests/examples.test.js` for Illustrative Examples, or `tests/cards-contract.test.js` for brand/engineering cards. Changes to fixed labels, headings, enums, or pack schema require coordinated card/checker/docs/test updates.
- **Frozen evidence** in `training/dry-runs/2026-07-13-ee-mvq-01-r1/` is hash-checked. Do not edit it.
- **Git:** stage, commit, or push only when the owner names that action.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **exemplary-examples** (1308 symbols, 1537 relationships, 6 execution flows).

> Index stale? Run `node .gitnexus/run.cjs analyze --index-only` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? Bootstrap with `npx`, `bunx`, or `pnpm dlx` — e.g. `bunx gitnexus@latest analyze` (npm 11 npx crash; #1939).

## Always Do

- **MUST run impact before editing.** Use `impact({target: "symbolName", direction: "upstream"})` or `node .gitnexus/run.cjs impact "symbolName" --direction upstream --repo .`; report callers, processes, and risk. Never substitute grep for graph analysis.
- **MUST analyze graph changes before committing.** Use `detect_changes({scope: "all"})` (MCP) or `node .gitnexus/run.cjs detect-changes --scope all --repo .` (CLI fallback). `partial: true` or `truncated: true` is not a clean check — a zero means unseen, not unaffected; re-run it. For regression review: `detect_changes({scope: "compare", base_ref: "main"})` or `node .gitnexus/run.cjs detect-changes --scope compare --base-ref "main" --repo .`.
- MUST warn on HIGH/CRITICAL `risk` pre-edit; never use `riskSharedAxes` to waive a HIGH/CRITICAL `risk` warning. Compare File/symbol: MCP File omits axes; Graph-RAG expands File.
- **MUST treat `risk: UNKNOWN` as unresolved, not as low.** An empty caller set is not evidence the symbol is unused — it can also mean the callers are not resolvable by the index (plain-object property access, dynamic dispatch, cross-language calls). `impact` pairs `UNKNOWN` with a `riskNote` saying so. Confirm with a text search before treating the symbol as safe to change or delete; do not proceed on the strength of a zero.
- **MUST use `query({search_query: "concept"})` for concepts/flows, `context({name: "symbolName"})` for a named symbol, or `impact` for blast radius, on read-only callers, dependencies, imports, or execution flow.** Graph first; text search only for empty/`UNKNOWN`/literals.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method before MCP/CLI impact analysis.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis, and never read `UNKNOWN` as an all-clear — it means the walk could not answer, which is the one verdict that requires confirming by other means.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit before MCP/CLI graph change analysis.

## Resources

| Resource | Use for |
| --- | --- |
| `gitnexus://repo/exemplary-examples/context` | Codebase overview, check index freshness |
| `gitnexus://repo/exemplary-examples/clusters` | All functional areas |
| `gitnexus://repo/exemplary-examples/processes` | All execution flows |
| `gitnexus://repo/exemplary-examples/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
| --- | --- |
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
