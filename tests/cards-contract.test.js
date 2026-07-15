const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const libraries = [path.join(root, "console", "cards"), path.join(root, "prompts")];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.name.startsWith("_") || e.name.startsWith(".")) return [];
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return e.name.endsWith(".md") && e.name.toLowerCase() !== "readme.md" ? [p] : [];
  });
}

function section(body, name) {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((l) => new RegExp(`^##\\s+${name}\\b`, "i").test(l));
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^##\s+/.test(lines[i])) { end = i; break; }
  }
  return lines.slice(start + 1, end).join("\n").trim() || null;
}

test("every card in every library follows the standard entry format", () => {
  const cards = libraries.flatMap(walk);
  assert.ok(cards.length >= 1, "expected at least one card");
  for (const p of cards) {
    const body = fs.readFileSync(p, "utf8");
    const rel = path.relative(root, p);
    assert.match(body, /^#\s+.+/m, `${rel}: missing "# Title"`);
    for (const name of ["When to use", "Prompt", "Expected output", "Changelog"]) {
      assert.ok(section(body, name), `${rel}: missing or empty "## ${name}"`);
    }
  }
});
