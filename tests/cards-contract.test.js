const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const dir = path.resolve(__dirname, "..", "console", "cards");
const cards = fs.readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("_"));

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

test("every console card follows the standard entry format", () => {
  assert.ok(cards.length >= 1, "expected at least one card in console/cards/");
  for (const file of cards) {
    const body = fs.readFileSync(path.join(dir, file), "utf8");
    assert.match(body, /^#\s+.+/m, `${file}: missing "# Title"`);
    for (const name of ["When to use", "Prompt", "Expected output", "Changelog"]) {
      assert.ok(section(body, name), `${file}: missing or empty "## ${name}"`);
    }
  }
});
