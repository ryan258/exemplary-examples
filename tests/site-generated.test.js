const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

// Audits the site Hugo actually emits (every route), not just the homepage source.
// Needs the `hugo` binary; skipped when it is absent. Source files are never modified.
const root = path.resolve(__dirname, "..");
const hasHugo = !spawnSync("hugo", ["version"], { encoding: "utf8" }).error;
const opts = { skip: hasHugo ? false : "hugo is not installed" };

let out;
let pages;

function build() {
  if (pages) return pages;
  out = fs.mkdtempSync(path.join(os.tmpdir(), "ee-site-"));
  const r = spawnSync("hugo", ["--source", root, "--destination", out, "--quiet"], { encoding: "utf8" });
  assert.equal(r.status, 0, `hugo build failed:\n${r.stderr}`);
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name);
      return e.isDirectory() ? walk(p) : e.name.endsWith(".html") ? [p] : [];
    });
  pages = walk(out).map((file) => ({ file, route: "/" + path.relative(out, file).split(path.sep).join("/"), html: fs.readFileSync(file, "utf8") }));
  return pages;
}

test.after(() => out && fs.rmSync(out, { recursive: true, force: true }));

const ids = (html) => [...html.matchAll(/\sid="([^"]*)"/g)].map((m) => m[1]);
const refs = (html) => [...html.matchAll(/\s(?:href|src)="([^"]*)"/g)].map((m) => m[1]);

function resolveTarget(route, ref) {
  const [pathAndQuery, fragment = ""] = ref.split("#");
  const p = pathAndQuery.split("?")[0];
  const abs = p === "" ? route : p.startsWith("/") ? p : path.posix.join(path.posix.dirname(route), p);
  const candidates = abs.endsWith("/") ? [abs + "index.html"] : [abs, abs + "/index.html"];
  const file = candidates.map((c) => path.join(out, decodeURIComponent(c))).find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
  return { abs, file, fragment: decodeURIComponent(fragment) };
}

test("every generated route has one H1 and no skipped heading levels", opts, () => {
  const problems = [];
  for (const { route, html } of build()) {
    const levels = [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
    if (levels.filter((l) => l === 1).length !== 1) problems.push(`${route}: ${levels.filter((l) => l === 1).length} h1 elements`);
    levels.forEach((l, i) => {
      if (i > 0 && l > levels[i - 1] + 1) problems.push(`${route}: h${levels[i - 1]} -> h${l}`);
    });
  }
  assert.deepEqual(problems, []);
});

test("every generated route has unique ids and resolvable links and fragments", opts, () => {
  const all = build();
  const problems = [];
  const idCache = new Map();
  const idsOf = (file) => idCache.get(file) ?? idCache.set(file, new Set(ids(fs.readFileSync(file, "utf8")))).get(file);
  for (const { route, html } of all) {
    const seen = new Set();
    for (const id of ids(html)) {
      if (seen.has(id)) problems.push(`${route}: duplicate id "${id}"`);
      seen.add(id);
    }
    for (const ref of refs(html)) {
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(ref)) continue; // external, mailto:, data:
      const { abs, file, fragment } = resolveTarget(route, ref);
      if (!file) problems.push(`${route}: broken link ${ref} -> ${abs}`);
      else if (fragment && file.endsWith(".html") && !idsOf(file).has(fragment)) problems.push(`${route}: missing fragment ${ref}`);
    }
  }
  assert.deepEqual(problems, []);
});

test("the 404 page uses root-relative URLs so it works at any missing depth", opts, () => {
  const page = build().find((p) => p.route === "/404.html");
  assert.ok(page, "404.html must be generated");
  for (const ref of refs(page.html)) {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(ref) || ref.startsWith("#")) continue;
    assert.ok(ref.startsWith("/"), `404 reference "${ref}" would break under /training/missing/`);
  }
  assert.match(page.html, /href="\/assets\/styles\.css"/);
  assert.match(page.html, /href="\/">Return to the Local Edition/);
});

test("generated output excludes repository secrets, saved runs, tooling, and historical prototypes", opts, () => {
  build();
  for (const entry of [".env", ".env.example", ".git", ".gitnexus", "console", "scripts", "prompts", "claim-audit", "examples", "operations", "discovery", "exemplary-examples.html"]) {
    assert.equal(fs.existsSync(path.join(out, entry)), false, `${entry} must stay outside the site output`);
  }
});

test("owner reference pages retain the Local Edition boundary and use offline resources", opts, () => {
  for (const { route, html } of build()) {
    assert.doesNotMatch(html, /<(?:link|script|img)\b[^>]*(?:href|src)="(?:https?:)?\/\//i, `${route}: remote browser resource`);
    if (route !== "/index.html" && route !== "/404.html") {
      assert.match(html, /aria-label="Local Edition boundary"/, `${route}: missing simulation boundary`);
      assert.match(html, /href="\/start\/">Start or resume/);
    }
  }
  assert.doesNotMatch(fs.readFileSync(path.join(root, "assets", "styles.css"), "utf8"), /@import\b|url\(\s*["']?https?:/i);
});

test("the training archive groups every document and distinguishes repeated record titles", opts, () => {
  const all = build();
  const archive = all.find((page) => page.route === "/training/index.html").html;
  const index = archive.split('<section class="archive-index"')[1].split("</section>")[0];
  const links = [...index.matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g)];
  const routes = all.filter((page) => page.route.startsWith("/training/") && page.route !== "/training/index.html");
  assert.equal(links.length, routes.length, "every training document belongs in one archive group");
  assert.equal(new Set(links.map((match) => match[1])).size, links.length, "no duplicate document entries");
  assert.equal(new Set(links.map((match) => match[2])).size, links.length, "link names must distinguish templates, reusable fixtures, and frozen records");
  for (const heading of ["Curriculum and practice", "Working templates", "Reusable qualification fixture", "Run plans and blank records", "Frozen evidence"]) assert.ok(index.includes(heading));
  assert.match(all.find((page) => page.route === "/training/02_instruction/course-modules/index.html").html, /<details class="doc-toc" open>/);
});
