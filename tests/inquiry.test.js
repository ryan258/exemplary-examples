const test = require("node:test");
const assert = require("node:assert/strict");

test("the inquiry handoff creates an encoded email without leaking raw fields", async () => {
  const { buildInquiryMailto } = await import("../assets/inquiry.mjs");
  const inquiry = {
    name: "Avery & Co",
    email: "avery@example.com",
    role: "Strategy lead",
    need: "We need a scenario for option A vs. B?",
    timing: "Within 30 days",
  };

  const url = buildInquiryMailto(inquiry, "pilot@example.com");

  assert.match(url, /^mailto:pilot@example\.com\?/);
  assert.match(url, /subject=Pilot%20inquiry%20from%20Avery%20%26%20Co/);
  assert.doesNotMatch(url, /Avery & Co/);
  assert.doesNotMatch(url, /option A vs\. B\?/);
  assert.match(decodeURIComponent(url), /Reply-to email: avery@example\.com/);
  assert.match(decodeURIComponent(url), /Timing: Within 30 days/);
});

test("the inquiry handoff rejects missing required fields", async () => {
  const { buildInquiryMailto } = await import("../assets/inquiry.mjs");

  assert.throws(
    () =>
      buildInquiryMailto(
        { name: "", email: "avery@example.com", need: "A real need", timing: "Exploring" },
        "pilot@example.com",
      ),
    /name is required/i,
  );
});
