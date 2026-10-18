#!/usr/bin/env node
/** Explicit, optional human-invoked browser audit. Never installs a dependency. */
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const http = require("node:http");
const { spawnSync } = require("node:child_process");

function discoverPlaywright(env = process.env) {
  const candidates = [env.PLAYWRIGHT_MODULE_PATH, "playwright", "playwright-core"].filter(Boolean);
  for (const candidate of candidates) {
    try {
      const installed = require(candidate);
      if (installed.chromium) return installed;
    } catch { /* Try the next existing installation; do not install anything. */ }
  }
  throw new Error("Playwright is not available. Set PLAYWRIGHT_MODULE_PATH to an installed playwright or playwright-core module, or use an existing local node_modules installation. This command never downloads dependencies.");
}

function discoverChromium(chromium, env = process.env) {
  const candidates = [
    env.CHROMIUM_PATH,
    chromium.executablePath?.(),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser",
  ].filter(Boolean);
  const executable = candidates.find((candidate) => {
    try { fs.accessSync(candidate, fs.constants.X_OK); return fs.statSync(candidate).isFile(); }
    catch { return false; }
  });
  if (!executable) throw new Error("No installed Chromium executable was found. Set CHROMIUM_PATH to your Playwright-compatible Chrome/Chromium executable. This command never downloads a browser.");
  return executable;
}

function createSiteServer(directory) {
  const root = path.resolve(directory);
  const realRoot = fs.realpathSync(root);
  const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png" };
  return http.createServer((req, res) => {
    let decoded;
    try { decoded = decodeURIComponent(new URL(req.url, "http://localhost").pathname); }
    catch { res.writeHead(400); res.end("Invalid path"); return; }
    const relative = decoded.replace(/^\/+/, "");
    const target = path.resolve(root, relative);
    if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403); res.end("Outside site output"); return; }
    let file = target;
    try { if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html"); }
    catch { /* Serve the generated branded 404 below. */ }
    let status = 200;
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { file = path.join(root, "404.html"); status = 404; }
    if (!fs.existsSync(file)) { res.writeHead(404); res.end("Not found"); return; }
    const realFile = fs.realpathSync(file);
    if (!realFile.startsWith(realRoot + path.sep)) { res.writeHead(403); res.end("Outside site output"); return; }
    res.writeHead(status, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(realFile).pipe(res);
  });
}

async function main(args = process.argv.slice(2)) {
  if (args.length) {
    if (args.length === 1 && ["--help", "-h"].includes(args[0])) {
      process.stdout.write("Usage: node scripts/audit-site.cjs\nExplicitly launch an installed Chromium to audit a fresh temporary Hugo build.\nOptional: PLAYWRIGHT_MODULE_PATH, CHROMIUM_PATH, AUDIT_DIR. No installs or downloads.\n");
      return;
    }
    throw new Error("Unknown option. Use node scripts/audit-site.cjs --help.");
  }
  const { chromium } = discoverPlaywright();
  const executablePath = discoverChromium(chromium);
  const destination = fs.mkdtempSync(path.join(os.tmpdir(), "ee-browser-site-"));
  const root = path.resolve(__dirname, "..");
  const outputDirectory = process.env.AUDIT_DIR || fs.mkdtempSync(path.join(os.tmpdir(), "ee-browser-audit-"));
  let server;
  try {
    const build = spawnSync("hugo", ["--source", root, "--destination", destination, "--quiet"], { encoding: "utf8" });
    if (build.error || build.status !== 0) throw new Error(`Hugo build failed: ${build.error?.message || build.stderr}`);
    server = createSiteServer(destination);
    await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
    const baseURL = `http://127.0.0.1:${server.address().port}/`;
    process.stderr.write(`Auditing a fresh temporary site at ${baseURL}\nReports: ${outputDirectory}\n`);
    const { runAudit } = require("../tests/browser-audit.cjs");
    const report = await runAudit({ chromium, executablePath, baseURL, outputDirectory });
    fs.writeFileSync(path.join(outputDirectory, "report.json"), JSON.stringify(report, null, 2) + "\n");
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
    process.exitCode = report.failures.length ? 1 : 0;
  } finally {
    if (server?.listening) await new Promise((resolve) => server.close(resolve));
    fs.rmSync(destination, { recursive: true, force: true });
  }
}

module.exports = { discoverPlaywright, discoverChromium, createSiteServer, main };
if (require.main === module) main().catch((error) => { process.stderr.write(error.message + "\n"); process.exitCode = 1; });
