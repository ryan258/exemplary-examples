const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createHash } = require("node:crypto");
const root = path.resolve(__dirname, "..");
const load = () => import(path.join(root, "console/console.mjs"));
const chain = () => ["a", "b", "c"].map((id) => ({ file: `${id}.md`, id, title: id, prompt: `Do ${id}.` }));
const quiet = { ask: async () => { throw new Error("unexpected question"); }, edit: async () => { throw new Error("unexpected editor"); }, save: () => {}, log: () => {}, noEdit: true };

test("attempt history totals clarification, malformed replies and retries without losing provenance", async () => {
  const { newRun, runChain, usageLine, promptDrift, saveRun, loadRun } = await load();
  const cards = chain().slice(0, 1);
  const state = newRun({ dir: root, model: "first/model", brief: "Draft", chain: cards, noEdit: true });
  const replies = ["STATUS: NEEDS_INPUT\nBaseline?", "missing protocol", "STATUS: COMPLETE\nResult"];
  const send = async ({ onUsage }) => { onUsage({ prompt_tokens: 10, completion_tokens: 5, cost: 0.01 }); return replies.shift(); };
  await runChain(state, cards, { ...quiet, send });
  await assert.rejects(runChain(state, cards, { ...quiet, send, answer: "$100 annually" }), /valid STATUS/);
  state.model = "second/model";
  const revised = [{ ...cards[0], prompt: "Revised card" }];
  await runChain(state, revised, { ...quiet, send });
  const attempts = state.stages[0].attempts;
  assert.deepEqual(attempts.map((a) => a.status), ["needs_input", "failed", "complete"]);
  assert.deepEqual(attempts.map((a) => a.model), ["first/model", "first/model", "second/model"]);
  assert.match(usageLine(state), /30 prompt \+ 15 completion tokens over 3 request\(s\), cost 0\.0300/);
  assert.equal(attempts[1].prompt, attempts[2].prompt, "retry keeps exact answered request");
  assert.match(attempts[2].system, /^Revised card/);
  assert.equal(attempts[2].systemHash, createHash("sha256").update(attempts[2].system).digest("hex"));
  assert.ok(attempts.every((a) => a.startedAt && a.finishedAt));
  assert.notEqual(state.stages[0].initialPromptHash, state.stages[0].promptHash);
  assert.deepEqual(promptDrift(state, revised), [], "latest hash describes instructions actually used");
  assert.equal(state.initialModel, "first/model");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ee-attempt-roundtrip-"));
  try {
    saveRun(state, dir);
    assert.deepEqual(loadRun(state.id, dir).stages[0].attempts, attempts);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test("owner clarifications reach every later stage and checker context, including legacy saved inputs", async () => {
  const { newRun, runChain, ownerContext } = await load();
  const cards = chain();
  const state = newRun({ dir: root, model: "m", brief: "Draft", chain: cards, noEdit: true });
  await runChain(state, cards, { ...quiet, send: async () => "STATUS: NEEDS_INPUT\nIs cancellation free?" });
  const seen = [], systems = [];
  await runChain(state, cards, { ...quiet, answer: "The baseline is $100 annually.", send: async ({ prompt, system }) => { seen.push(prompt); systems.push(system); return "STATUS: COMPLETE\nA table that omits the answer"; } });
  assert.equal(seen.length, 3);
  assert.ok(seen.every((p) => p.includes("$100 annually")));
  assert.ok(systems.every((s) => /PROFILE[^\n]*:\nOWNER ANSWERS[^\n]*:\nThe baseline is \$100 annually\./.test(s)), "card rules see owner answers as supplied PROFILE context");
  assert.ok(systems.every((s) => !s.includes("Is cancellation free?")), "model questions are never promoted to supplied profile facts");
  assert.match(ownerContext(state), /The baseline is \$100 annually/);
  assert.doesNotMatch(ownerContext(state), /cancellation free/, "generated question is not supplied evidence");
  delete state.stages[0].clarifications;
  assert.match(ownerContext(state), /The baseline is \$100 annually/, "legacy answer remains recoverable");
});

test("interrupted attempts and missing usage stay visible; historical stage totals are preserved once", async () => {
  const { newRun, runChain, usageLine, trimUsage } = await load();
  const cards = chain().slice(0, 1);
  const state = newRun({ dir: root, model: "m", brief: "x", chain: cards, noEdit: true });
  delete state.stages[0].attempts;
  state.stages[0].usage = { prompt_tokens: 8, completion_tokens: 2, cost: 0.01 };
  await assert.rejects(runChain(state, cards, { ...quiet, send: async ({ onUsage }) => { onUsage({ prompt_tokens: 4, completion_tokens: 1, cost: 0.02 }); throw new Error("provider failed after usage"); } }), /provider failed/);
  await runChain(state, cards, { ...quiet, send: async () => "STATUS: COMPLETE\nResult" });
  assert.match(usageLine(state), /12 prompt \+ 3 completion tokens over 3 request\(s\), cost 0\.0300/);
  assert.match(usageLine(state), /partial/);
  assert.match(usageLine(state), /Legacy stage totals/);
  const interrupted = newRun({ dir: root, model: "m", brief: "x", chain: cards, noEdit: true });
  interrupted.stages[0].attempts.push({ status: "in_flight", usage: null });
  await runChain(interrupted, cards, { ...quiet, send: async () => "STATUS: COMPLETE\nResult" });
  assert.deepEqual(interrupted.stages[0].attempts.map((a) => a.status), ["interrupted", "complete"]);
  assert.deepEqual(trimUsage({ cost: Infinity, prompt_tokens: -1, total_tokens: 3 }), { total_tokens: 3 });
});

test("a resumed legacy stage keeps earlier answers when it asks a second question", async () => {
  const { newRun, runChain, ownerContext } = await load();
  const cards = chain().slice(0, 1);
  const state = newRun({ dir: root, model: "m", brief: "Draft", chain: cards, noEdit: true });
  const stage = state.stages[0];
  delete stage.clarifications;
  Object.assign(stage, { status: "needs_input", input: "Draft\n\nYOUR QUESTIONS:\nBaseline?\n\nUSER ANSWERS:\nAnnual fee $100", note: "Which audience?" });
  await runChain(state, cards, { ...quiet, answer: "Existing members", send: async () => "STATUS: COMPLETE\nResult" });
  assert.match(ownerContext(state), /Annual fee \$100/);
  assert.match(ownerContext(state), /Existing members/);
  assert.equal(stage.clarifications.length, 2);
  const modern = newRun({ dir: root, model: "m", brief: "Draft", chain: cards, noEdit: true });
  modern.stages[0].input = "Model text\n\nYOUR QUESTIONS:\nPolicy?\n\nUSER ANSWERS:\nCancel anytime";
  assert.equal(ownerContext(modern), "Draft", "only legacy records recover answers from unstructured input");
});

test("corrupt saved records explain recovery and never become resumable requests", async () => {
  const { loadRun } = await load();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ee-malformed-"));
  try {
    const file = path.join(dir, "probe.json");
    fs.writeFileSync(file, "{broken");
    assert.throws(() => loadRun("probe", dir), /valid JSON.*recovery/);
    for (const record of [null, [], { version: 1, id: "other", brief: "x", stages: [] }, { version: 1, id: "probe", brief: "x", stages: [{}] }, { version: 1, id: "probe", brief: "x", stages: [{ status: "complete", result: "" }] }]) {
      fs.writeFileSync(file, JSON.stringify(record));
      assert.throws(() => loadRun("probe", dir), /object|malformed/);
    }
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
