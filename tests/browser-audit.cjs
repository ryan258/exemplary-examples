const fs = require("node:fs");
const path = require("node:path");
let playwright;
try {
  playwright = require("playwright");
} catch (error) {
  if (!process.env.PLAYWRIGHT_MODULE_PATH) throw error;
  playwright = require(process.env.PLAYWRIGHT_MODULE_PATH);
}
const { chromium } = playwright;

const url = process.env.SITE_URL || "http://127.0.0.1:8000/";
const executablePath = process.env.CHROMIUM_PATH;
const outputDirectory = process.env.AUDIT_DIR || "/tmp/exemplary-examples-browser-audit";
const widths = [320, 375, 768, 1024, 1440];

if (!executablePath) {
  throw new Error("Set CHROMIUM_PATH to a Playwright-compatible Chromium executable.");
}

fs.mkdirSync(outputDirectory, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });
  const results = [];

  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const consoleErrors = [];
    const pageErrors = [];
    const failedResponses = [];

    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("response", (resourceResponse) => {
      if (resourceResponse.status() >= 400) {
        failedResponses.push(`${resourceResponse.status()} ${resourceResponse.url()}`);
      }
    });

    const response = await page.goto(url, { waitUntil: "networkidle" });
    const audit = await page.evaluate(() => {
      const anchors = [...document.querySelectorAll('a[href^="#"]')];
      const missingTargets = anchors
        .map((anchor) => anchor.getAttribute("href"))
        .filter((href) => href.length > 1 && !document.querySelector(href));
      const headingLevels = [...document.querySelectorAll("h1, h2, h3")].map((heading) =>
        Number(heading.tagName.slice(1)),
      );
      const skippedHeadingLevels = headingLevels.some(
        (level, index) => index > 0 && level > headingLevels[index - 1] + 1,
      );
      const smallTargets = [...document.querySelectorAll("a")]
        .map((element) => ({
          text: element.textContent.trim(),
          width: Math.round(element.getBoundingClientRect().width),
          height: Math.round(element.getBoundingClientRect().height),
        }))
        .filter((target) => target.width < 24 || target.height < 24);

      return {
        title: document.title,
        h1Count: document.querySelectorAll("h1").length,
        landmarksPresent: ["header", "nav", "main", "footer"].every((selector) =>
          document.querySelector(selector),
        ),
        horizontalOverflow:
          document.documentElement.scrollWidth > document.documentElement.clientWidth,
        viewportWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        navigationDestinations: [...document.querySelectorAll("nav a")].map((anchor) =>
          anchor.textContent.trim(),
        ),
        missingTargets,
        skippedHeadingLevels,
        smallTargets,
        interactiveForms: document.querySelectorAll("form").length,
        localEditionComplete: /local edition is complete/i.test(document.body.textContent),
      };
    });

    await page.screenshot({
      path: path.join(outputDirectory, `site-${width}.png`),
      fullPage: true,
    });

    results.push({
      width,
      status: response?.status(),
      ...audit,
      consoleErrors,
      pageErrors,
      failedResponses,
    });
    await page.close();
  }

  const keyboardPage = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await keyboardPage.goto(url, { waitUntil: "networkidle" });
  await keyboardPage.keyboard.press("Tab");
  const firstFocus = await keyboardPage.evaluate(() => ({
    text: document.activeElement?.textContent?.trim(),
    href: document.activeElement?.getAttribute("href"),
  }));
  await keyboardPage.keyboard.press("Enter");
  const skipLinkLanded = await keyboardPage.evaluate(
    () => location.hash === "#main-content" && document.activeElement?.id === "main-content",
  );

  await keyboardPage.emulateMedia({ reducedMotion: "reduce" });
  const reducedMotion = await keyboardPage.evaluate(
    () => getComputedStyle(document.documentElement).scrollBehavior === "auto",
  );

  await browser.close();

  const failures = results.flatMap((result) => {
    const issues = [];
    if (result.status !== 200) issues.push("non-200 response");
    if (result.h1Count !== 1) issues.push("h1 count");
    if (!result.landmarksPresent) issues.push("missing landmark");
    if (result.horizontalOverflow) issues.push("horizontal overflow");
    if (result.missingTargets.length) issues.push("missing anchor target");
    if (result.skippedHeadingLevels) issues.push("skipped heading level");
    if (result.consoleErrors.length || result.pageErrors.length) issues.push("browser error");
    if (result.failedResponses.length) issues.push("failed resource response");
    if (result.interactiveForms !== 0) issues.push("unexpected interactive form");
    if (!result.localEditionComplete) issues.push("missing Local Edition completion status");
    return issues.map((issue) => `${result.width}px: ${issue}`);
  });
  if (firstFocus.href !== "#main-content") failures.push("skip link is not first focus target");
  if (!skipLinkLanded) failures.push("skip link did not move focus to main content");
  if (!reducedMotion) failures.push("reduced-motion preference is not honored");
  const report = {
    url,
    outputDirectory,
    results,
    keyboard: { firstFocus, skipLinkLanded },
    reducedMotion,
    failures,
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exitCode = failures.length ? 1 : 0;
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
