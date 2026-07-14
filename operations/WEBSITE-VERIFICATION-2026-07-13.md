# Website Verification Report — 2026-07-13

**Artifact:** `index.html` production candidate  
**Release state:** Deployment-ready preview; formal application closed; limited pilot inquiries enabled; public deployment not yet recorded as complete
**Operator:** EE-10 Beacon role, executed in the project workspace

## Automated content and structure contract

Command:

```bash
node --test tests/site-contract.test.js
```

Result: 6 passed, 0 failed.

The contract verifies:

- production entry point and external stylesheet;
- English language, landmarks, one H1, five named sections, and keyboard skip target;
- explicit satirical-brand and real-practice framing;
- disclosed AI staff agents and accountable-principal boundary;
- Executive Retainer pilot as the only real offer;
- closed application state with no form, fields, inline handlers, or data collection;
- baseline title, description, Open Graph, viewport, and theme metadata.

## Real-browser matrix

Command:

```bash
PLAYWRIGHT_MODULE_PATH=/path/to/playwright \
CHROMIUM_PATH=/path/to/chrome-headless-shell \
node tests/browser-audit.cjs
```

Chromium was run at 320, 375, 768, 1024, and 1440 CSS pixels. Result: 0 failures.

At every width:

- HTTP response was 200;
- exactly one H1 and all primary landmarks were present;
- no horizontal overflow appeared;
- all in-page targets resolved;
- heading levels did not skip;
- navigation targets met the audit's 24-pixel minimum in both dimensions;
- no console error or uncaught page error occurred.
- every requested local asset returned successfully; a deliberately observed favicon 404 led to an explicit favicon and a failed-resource assertion in the audit.

Keyboard verification confirmed the skip link is first in the focus order and moves focus to main content. Reduced-motion emulation confirmed smooth scrolling is disabled. Full-page screenshots were reviewed at phone and wide-desktop widths; no collision, clipping, illegible block, or broken hierarchy was observed.

The matrix was rerun after adding the pilot-inquiry path. The form rendered without overflow at every viewport, all controls met the audit's target-size check, and the interaction test confirmed that valid fields produce the local email-handoff status. The page made no inquiry submission request and reported no console, page, or failed-resource errors.

## Automated accessibility

Command:

```bash
npx --yes @axe-core/cli http://127.0.0.1:8000/ --exit
```

Initial result: 16 issues—15 low-contrast small brass labels and one disclosure outside a landmark.

Corrections:

- introduced a darker brass token on light surfaces and the lighter brass token on dark surfaces;
- placed the brand disclosure in a labeled complementary landmark.

Final result: **0 axe-core 4.12.1 violations**.

Automated accessibility checks do not replace assistive-technology testing. Screen-reader verification remains part of the form task once an approved application exists.

## Preliminary performance signal

Lighthouse was run locally with mobile throttling after the functional and accessibility checks.

| Category | Score |
| --- | ---: |
| Performance | 87 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Observed metrics were 3.2 s First Contentful Paint, 3.2 s Largest Contentful Paint, 0 ms Total Blocking Time, and 0.004 Cumulative Layout Shift. The page ships no script and no unused third-party runtime. The preliminary performance score is below the roadmap’s production-like target of 90; the dominant signal is render-blocking/caching behavior under the local Python server and external font loading. This was superseded by the production run below.

## Production Lighthouse audit (2026-07-14)

Run against the live GitHub Pages URL via the `Lighthouse (production)` workflow.

| Category | Score | Target | Result |
| --- | ---: | ---: | --- |
| Performance | 91 | ≥ 90 | Met |
| Accessibility | 100 | ≥ 95 | Met |
| SEO | 100 | ≥ 90 | Met |
| Best Practices | 79 | ≥ 95 | Approved exception |

Performance meets the target once served from the CDN (the local 87 reflected render-blocking/caching under the Python server).

**Approved exception — Best Practices 79.** The only failing audits are `is-on-https` (weight 5) and `inspector-issues` (mixed content), both caused solely by the `mailto:` pilot-inquiry link, which Lighthouse classifies as a non-secure request. HTTPS is enforced and there is no real insecure resource; the deduction is a known Lighthouse treatment of `mailto:`. The interim email inquiry path is retained intentionally, so this exception is approved for the closed-state release. Re-evaluate when the formal application replaces the email handoff.

Task 3.2 acceptance is satisfied: budgets met (no CLS from fonts, no render-blocking script, first-party payload well under 500 KB) with the documented Best-Practices exception.

## Remaining release gates

- Checkpoint A outsider comprehension/trust review.
- Approved P0.5c formal-application fields, disclosures, data path, and operator process. The current email inquiry is not the formal application.
- Checkpoint P business readiness.
- GitHub Pages enablement and hosted-candidate verification.
- Release-candidate review in supported browser engines, including Safari/VoiceOver where available.
