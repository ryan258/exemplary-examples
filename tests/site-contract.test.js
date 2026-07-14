const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const entrypoint = path.join(root, "index.html");

function page() {
  return fs.readFileSync(entrypoint, "utf8");
}

test("the production entrypoint exists", () => {
  assert.equal(fs.existsSync(entrypoint), true, "index.html must be the production entrypoint");
});

test("the page exposes a semantic, keyboard-oriented document structure", () => {
  const html = page();

  assert.match(html, /<html\s+lang="en"/i);
  assert.match(html, /href="#main-content"[^>]*>\s*Skip to (?:main )?content/i);
  assert.match(html, /<main\s+id="main-content"\s+tabindex="-1"/i);
  assert.equal((html.match(/<h1\b/gi) || []).length, 1, "exactly one h1 is required");
  for (const landmark of ["header", "nav", "main", "footer"]) {
    assert.match(html, new RegExp(`<${landmark}\\b`, "i"), `${landmark} landmark is required`);
  }
  for (const id of ["home", "about", "offering", "proof", "contact"]) {
    assert.match(html, new RegExp(`id="${id}"`, "i"), `#${id} section is required`);
  }
});

test("the satire and the real practice are both explicit", () => {
  const html = page();

  assert.match(html, /openly satirical/i);
  assert.match(html, /real professional (?:practice|service)/i);
  assert.match(html, /satirical fiction/i);
  assert.match(html, /modeled scenario/i);
  assert.match(html, /AI staff agents?/i);
  assert.match(html, /accountable principal/i);
});

test("only the Executive Retainer pilot is presented as a real offer", () => {
  const html = page();

  assert.match(html, /Executive Retainer pilot/i);
  assert.doesNotMatch(html, /Tier I|Tier II|\$8,500|\$22,000/i);
  assert.doesNotMatch(html, /fictional testimonials?/i);
});

test("formal applications remain closed while pilot inquiries are actionable", () => {
  const html = page();

  assert.match(html, /applications? (?:are |is )?closed/i);
  assert.match(html, /Checkpoint P/i);
  assert.match(html, /pilot conversations? (?:are |is )?open/i);
  assert.match(html, /<form\s+id="pilot-inquiry"/i);
  assert.match(html, /<input[^>]+type="email"[^>]+required/i);
  assert.match(html, /<textarea[^>]+maxlength="1200"[^>]+required/i);
  assert.match(html, /<input[^>]+type="checkbox"[^>]+required/i);
  assert.match(html, /opens? your email app/i);
  assert.match(html, /do not include confidential/i);
  assert.match(html, /<script\s+type="module"\s+src="assets\/inquiry\.mjs"/i);
  assert.doesNotMatch(html, /<form[^>]+action="https?:/i);
  assert.doesNotMatch(html, /\son[a-z]+\s*=/i);
});

test("the page includes baseline sharing and rendering metadata", () => {
  const html = page();

  assert.match(html, /<meta\s+name="description"/i);
  assert.match(html, /<meta\s+property="og:title"/i);
  assert.match(html, /<meta\s+property="og:description"/i);
  assert.match(html, /<meta\s+name="theme-color"/i);
  assert.match(html, /<meta\s+name="viewport"/i);
  assert.match(html, /<link\s+rel="icon"[^>]+href="assets\/favicon\.svg"/i);
  assert.match(html, /href="assets\/styles\.css"/i);
});
