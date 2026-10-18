const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const libraries = [path.join(root, "console", "cards"), path.join(root, "prompts"), path.join(root, "claim-audit"), path.join(root, "examples")];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.name.startsWith("_") || e.name.startsWith(".")) return [];
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return e.name.endsWith(".md") && e.name.toLowerCase() !== "readme.md" ? [p] : [];
  });
}

test("every card in every library follows the standard entry format", async () => {
  // One parser for runtime and tests: the contract checks what the runner will actually send.
  const { section } = await import(path.join(root, "console", "console.mjs"));
  const cards = libraries.flatMap(walk);
  assert.ok(cards.length >= 1, "expected at least one card");
  for (const p of cards) {
    const body = fs.readFileSync(p, "utf8");
    const rel = path.relative(root, p);
    assert.match(body, /^#\s+.+/m, `${rel}: missing "# Title"`);
    for (const name of ["When to use", "Prompt", "Expected output", "Changelog"]) {
      let found;
      try { found = section(body, name); } catch (error) { assert.fail(`${rel}: ${error.message}`); }
      assert.ok(found, `${rel}: missing or empty "## ${name}"`);
    }
  }
});

test("visual direction preserves offline type and local reference constraints", async () => {
  const { section } = await import(path.join(root, "console", "console.mjs"));
  const card = fs.readFileSync(path.join(root, "console", "cards", "02-visual-style-guide.md"), "utf8");
  const prompt = section(card, "Prompt");
  assert.match(prompt, /local system serif fonts/);
  assert.match(prompt, /without remote font requests or font downloads/);
  assert.match(prompt, /when supplied/);
  assert.doesNotMatch(prompt, /Fraunces|IBM Plex Mono|Google Fonts/);
  assert.match(section(card, "Changelog"), /instruction revision/i);
});
