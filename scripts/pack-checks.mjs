// Shared mechanical rules for Markdown packs. These parsers retain suspect text:
// a malformed boundary must never make copy disappear from the safety checks.
export const INTERNAL = /\b(on file|per the profile|supplied copy|billing export|membership export|price sheet|client-provided|client-supplied)\b|\bowner:/gi;
export const STRONG = /\b(guarantee[ds]?|proven|clinically|cures?|cured|best|awards?|winner|certified|risk-free|leading)\b|#1/gi;
export const plain = (s) => s.replace(/[*`]/g, "").trim();
export const normalized = (s) => plain(s).replace(/\s+/g, " ").trim();
export const numberValues = (s) => [...s.matchAll(/\$?\d[\d,]*(?:\.\d+)?/g)].map((m) => ({
  value: m[0].replace(/[$,]/g, ""), text: m[0], index: m.index,
}));
export const numbers = (s) => new Set(numberValues(s).map((n) => n.value));

// A source may write "four" where a numeric entry uses 4. This narrow conversion
// is for provenance only; prose number words do not become extra output figures.
const SMALL = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
export function sourceNumbers(text) {
  const result = numbers(text);
  const pattern = new RegExp(`\\b(${Object.keys(TENS).join("|")})(?:[- ](${SMALL.slice(1, 10).join("|")}))?\\b|\\b(${SMALL.join("|")})\\b`, "gi");
  for (const match of text.matchAll(pattern)) result.add(String(match[1] ? TENS[match[1].toLowerCase()] + (match[2] ? SMALL.indexOf(match[2].toLowerCase()) : 0) : SMALL.indexOf(match[3].toLowerCase())));
  return result;
}

// The one explicit boundary between copy a customer might read and provenance
// notes. Fenced lookalikes stay in the copy, so they cannot hide claim wording.
export function splitSourceNotes(text) {
  const lines = text.split(/\r?\n/), hits = [];
  let fence = null;
  for (const [index, line] of lines.entries()) {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (marker && marker[1][0] === fence.char && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
    } else if (marker) fence = { char: marker[1][0], length: marker[1].length };
    else if (/^ {0,3}###[ \t]+Source notes(?:[ \t]+#+)?[ \t]*$/.test(line)) hits.push(index);
  }
  return {
    copy: lines.slice(0, hits[0] ?? lines.length).join("\n").trim(),
    notes: hits.length ? lines.slice(hits[0] + 1).join("\n").trim() : "",
    count: hits.length,
  };
}

export function splitSections(pack) {
  const found = Object.create(null);
  const issues = [];
  const names = new Set();
  const preamble = [];
  let name = null, fence = null;
  for (const [index, line] of pack.split(/\r?\n/).entries()) {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (name) found[name].push(line); else preamble.push(line);
      if (marker && marker[1][0] === fence.char && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
      continue;
    }
    if (marker) {
      fence = { char: marker[1][0], length: marker[1].length };
      if (name) found[name].push(line); else preamble.push(line);
      continue;
    }
    const heading = line.match(/^ {0,3}##[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*$/);
    if (heading) {
      name = heading[1];
      const key = name.toLowerCase();
      if (names.has(key)) issues.push(`duplicate section "${name}" at line ${index + 1}`);
      names.add(key);
      found[name] ??= [];
    } else if (name) found[name].push(line); else preamble.push(line);
  }
  if (preamble.some((line) => line.trim())) issues.push("text before the first required section is not allowed");
  if (fence) issues.push("unclosed Markdown code fence");
  return { sections: Object.fromEntries(Object.entries(found).map(([key, lines]) => [key, lines.join("\n").trim()])), issues };
}

// Compatibility API for callers that only need the bodies. Checkers use the
// validated API below so duplicate/unexpected headings are always findings.
export const sections = (pack) => splitSections(pack).sections;

export function checkedSections(pack, required, add) {
  const { sections: result, issues } = splitSections(pack);
  for (const issue of issues) add("ERROR", "sections", issue);
  for (const name of required) {
    if (!(name in result)) add("ERROR", "sections", `missing section: ${name}`);
    else if (!result[name]) add("ERROR", "sections", `empty required section: ${name}`);
  }
  for (const name of Object.keys(result)) if (!required.includes(name)) add("ERROR", "sections", `unexpected section: ${name}; use ### for headings inside a section`);
  return result;
}

export function tableCells(line) {
  const text = line.trim();
  const cells = [""];
  for (let i = text.startsWith("|") ? 1 : 0; i < text.length; i++) {
    if (text[i] === "\\" && text[i + 1] === "|") {
      cells[cells.length - 1] += "|";
      i++;
    } else if (text[i] === "\\" && text[i + 1] === "\\") {
      cells[cells.length - 1] += "\\";
      i++;
    } else if (text[i] === "|") cells.push("");
    else cells[cells.length - 1] += text[i];
  }
  if (text.endsWith("|") && cells.at(-1) === "") cells.pop();
  return cells.map(plain);
}

export function parseTable(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().startsWith("|"));
  const header = lines.length ? tableCells(lines[0]) : [];
  const issues = [];
  if (!header.length) return { header, rows: [], issues };
  if (new Set(header).size !== header.length) issues.push("duplicate column headings");
  const separator = lines[1] ? tableCells(lines[1]) : [];
  const hasSeparator = separator.length === header.length && separator.every((cell) => /^:?-{3,}:?$/.test(cell));
  if (!hasSeparator) issues.push("missing or malformed table separator row");
  const rows = lines.slice(hasSeparator ? 2 : 1).map((line, index) => {
    const cells = tableCells(line);
    if (cells.length !== header.length) issues.push(`data row ${index + 1} has ${cells.length} cells; expected ${header.length}`);
    return Object.fromEntries(header.map((key, i) => [key, cells[i] ?? ""]));
  });
  return { header, rows, issues };
}
