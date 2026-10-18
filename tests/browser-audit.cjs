// Optional browser audit. Importing this module never discovers or launches a browser.
const fs = require("node:fs");
const path = require("node:path");
const widths = [320, 375, 768, 1024, 1440];
const defaultRoutes = [
  { route: "/", kind: "home" },
  { route: "/start/", kind: "document" },
  { route: "/training/", kind: "document" },
  { route: "/training/02_instruction/course-modules/", kind: "document" },
  { route: "/training/dry-runs/2026-07-13-ee-mvq-01-r1/02-candidate-output/", kind: "document" },
  { route: "/__audit__/missing/", kind: "notfound", status: 404 },
];

function routeFailures(result) {
  const issues = [];
  if (result.status !== result.expectedStatus) issues.push(`expected HTTP ${result.expectedStatus}, got ${result.status}`);
  if (result.h1Count !== 1) issues.push("h1 count");
  if (!result.mainPresent) issues.push("missing main landmark");
  if (result.kind !== "notfound" && !result.siteLandmarksPresent) issues.push("missing header, navigation, or footer landmark");
  if (result.horizontalOverflow) issues.push("horizontal overflow");
  if (result.missingTargets.length) issues.push("missing anchor target");
  if (result.skippedHeadingLevels) issues.push("skipped heading level");
  if (result.consoleErrors.length || result.pageErrors.length) issues.push("browser error");
  if (result.failedResponses.length || result.failedRequests.length) issues.push("failed resource request");
  if (result.remoteRequests.length) issues.push("unexpected remote resource request");
  if (result.interactiveForms !== 0) issues.push("unexpected form");
  if (result.smallTargets.length) issues.push(`standalone target under 24px: ${result.smallTargets.map((target) => target.text || "(no text)").join(", ")}`);
  if (!result.localEditionDisclosed) issues.push("missing Local Edition disclosure");
  if (result.keyboard && result.keyboard.firstFocus.href !== "#main-content") issues.push("skip link is not first focus target");
  if (result.keyboard && !result.keyboard.skipLinkLanded) issues.push("skip link did not move focus to main content");
  if (!result.reducedMotion) issues.push("reduced-motion preference is not honored");
  return issues.map((issue) => `${result.route} ${result.width}px: ${issue}`);
}

async function runAudit({ chromium, executablePath, baseURL, outputDirectory, routes = defaultRoutes }) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath });
  const results = [];
  try {
    for (const definition of routes) {
      for (const width of widths) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        const consoleErrors = [], pageErrors = [], failedResponses = [], failedRequests = [], remoteRequests = [];
        const url = new URL(definition.route, baseURL).href;
        const expectedStatus = definition.status || 200;
        page.on("console", (message) => {
          // Resource 404s still fail through the response listener below.
          const expected404 = expectedStatus === 404 && /Failed to load resource.*404/.test(message.text());
          if (message.type() === "error" && !expected404) consoleErrors.push(message.text());
        });
        page.on("pageerror", (error) => pageErrors.push(error.message));
        page.on("request", (request) => {
          const resource = new URL(request.url());
          if (["http:", "https:"].includes(resource.protocol) && resource.origin !== new URL(baseURL).origin) remoteRequests.push(request.url());
        });
        page.on("requestfailed", (request) => failedRequests.push(`${request.failure()?.errorText || "request failed"} ${request.url()}`));
        page.on("response", (response) => {
          const expectedMissingPage = expectedStatus === 404 && response.status() === 404 && response.url() === url && response.request().isNavigationRequest();
          if (response.status() >= 400 && !expectedMissingPage) failedResponses.push(`${response.status()} ${response.url()}`);
        });
        const response = await page.goto(url, { waitUntil: "networkidle" });
        const audit = await page.evaluate(() => {
          const anchors = [...document.querySelectorAll('a[href^="#"]')];
          const missingTargets = anchors.map((anchor) => anchor.getAttribute("href")).filter((href) => href.length > 1 && !document.getElementById(decodeURIComponent(href.slice(1))));
          const headingLevels = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((heading) => Number(heading.tagName.slice(1)));
          const skippedHeadingLevels = headingLevels.some((level, index) => index > 0 && level > headingLevels[index - 1] + 1);
          const smallTargets = [...document.querySelectorAll("a")]
            .filter((element) => element.closest("nav,header,footer") || element.classList.contains("skip-link") || !element.closest("p,li,td,blockquote,h1,h2,h3,h4"))
            .map((element) => ({ text: element.textContent.trim(), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }))
            .filter((target) => target.width < 24 || target.height < 24);
          return {
            title: document.title,
            h1Count: document.querySelectorAll("h1").length,
            mainPresent: Boolean(document.querySelector("main")),
            siteLandmarksPresent: ["header", "nav", "footer"].every((selector) => document.querySelector(selector)),
            horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            viewportWidth: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
            missingTargets, skippedHeadingLevels, smallTargets,
            interactiveForms: document.querySelectorAll("form").length,
            localEditionDisclosed: /local edition/i.test(document.body.textContent),
          };
        });
        let keyboard;
        if (width === 375 && definition.kind !== "notfound") {
          await page.keyboard.press("Tab");
          const firstFocus = await page.evaluate(() => ({ text: document.activeElement?.textContent?.trim(), href: document.activeElement?.getAttribute("href") }));
          await page.keyboard.press("Enter");
          const skipLinkLanded = await page.evaluate(() => location.hash === "#main-content" && document.activeElement?.id === "main-content");
          keyboard = { firstFocus, skipLinkLanded };
        }
        await page.emulateMedia({ reducedMotion: "reduce" });
        const reducedMotion = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior === "auto");
        const name = definition.route.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home";
        await page.screenshot({ path: path.join(outputDirectory, `${name}-${width}.png`), fullPage: true });
        results.push({ route: definition.route, kind: definition.kind, width, expectedStatus, status: response?.status(), ...audit, keyboard, reducedMotion, consoleErrors, pageErrors, failedResponses, failedRequests, remoteRequests });
        await page.close();
      }
    }
  } finally { await browser.close(); }
  return { baseURL, outputDirectory, results, failures: results.flatMap(routeFailures) };
}

module.exports = { defaultRoutes, routeFailures, runAudit };
if (require.main === module) {
  // Existing-server compatibility. Prefer scripts/audit-site.cjs for a managed clean build.
  (async () => {
    const { discoverPlaywright, discoverChromium } = require("../scripts/audit-site.cjs");
    const { chromium } = discoverPlaywright();
    const report = await runAudit({ chromium, executablePath: discoverChromium(chromium), baseURL: process.env.SITE_URL || "http://127.0.0.1:1313/", outputDirectory: process.env.AUDIT_DIR || "/tmp/exemplary-examples-browser-audit" });
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
    process.exitCode = report.failures.length ? 1 : 0;
  })().catch((error) => { process.stderr.write(error.message + "\n"); process.exitCode = 1; });
}
