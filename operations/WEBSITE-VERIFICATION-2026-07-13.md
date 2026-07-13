# Website Verification Report — 2026-07-13

**Artifact:** `index.html` production candidate  
**Release state:** Internal preview; application closed; no public deployment authorized  
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

Observed metrics were 3.2 s First Contentful Paint, 3.2 s Largest Contentful Paint, 0 ms Total Blocking Time, and 0.004 Cumulative Layout Shift. The page ships no script and no unused third-party runtime. The preliminary performance score is below the roadmap’s production-like target of 90; the dominant signal is render-blocking/caching behavior under the local Python server and external font loading. Task 3.2 remains open until hosting/cache behavior and the final font-loading strategy are measured on the release candidate or a specific exception is approved.

## Remaining release gates

- Checkpoint A outsider comprehension/trust review.
- Approved P0.5c application fields, disclosures, data path, and operator process.
- Checkpoint P business readiness.
- Favicon/social image, production URL/canonical metadata, hosting choice, and preview deployment.
- Release-candidate review in supported browser engines, including Safari/VoiceOver where available.
