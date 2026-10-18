const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { Writable } = require("node:stream");
const { createSiteServer } = require("../scripts/audit-site.cjs");
const { routeFailures, defaultRoutes } = require("./browser-audit.cjs");

// Exercise the real request handler without opening a socket or launching a browser.
function request(server, url) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const response = new Writable({ write(chunk, encoding, done) { chunks.push(Buffer.from(chunk)); done(); } });
    response.writeHead = function (status, headers) { this.status = status; this.headers = headers; return this; };
    response.once("error", reject);
    response.once("finish", () => resolve({ status: response.status, body: Buffer.concat(chunks).toString("utf8") }));
    server.emit("request", { url }, response);
  });
}

test("the optional audit handler serves only generated files and branded missing pages without sockets", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ee-audit-server-test-"));
  fs.writeFileSync(path.join(root, "index.html"), "site homepage");
  fs.writeFileSync(path.join(root, "404.html"), "branded missing page");
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), "ee-audit-outside-test-"));
  fs.writeFileSync(path.join(outside, "private.txt"), "outside fixture");
  fs.symlinkSync(path.join(outside, "private.txt"), path.join(root, "escape.txt"));
  const server = createSiteServer(root);
  try {
    const home = await request(server, "/");
    assert.equal(home.status, 200); assert.equal(home.body, "site homepage");
    for (const route of ["/.env", "/.git/HEAD", "/nested/missing/"]) {
      const response = await request(server, route);
      assert.equal(response.status, 404); assert.equal(response.body, "branded missing page");
    }
    const escaped = await request(server, "/%2e%2e%2foutside");
    assert.equal(escaped.status, 403);
    assert.equal((await request(server, "/escape.txt")).status, 403);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(outside, { recursive: true, force: true });
  }
});

test("audit profiles accept an intentional branded 404 and report transport failures", () => {
  const result = {
    route: "/missing/", kind: "notfound", width: 320, expectedStatus: 404, status: 404,
    h1Count: 1, mainPresent: true, siteLandmarksPresent: false, horizontalOverflow: false,
    missingTargets: [], skippedHeadingLevels: false, consoleErrors: [], pageErrors: [],
    failedResponses: [], failedRequests: [], remoteRequests: [], interactiveForms: 0,
    smallTargets: [], localEditionDisclosed: true, reducedMotion: true,
  };
  assert.deepEqual(routeFailures(result), []);
  assert.match(routeFailures({ ...result, failedRequests: ["net::ERR_NAME_NOT_RESOLVED"] })[0], /failed resource request/);
  assert.ok(defaultRoutes.some((entry) => entry.kind === "document"));
  assert.ok(defaultRoutes.some((entry) => entry.kind === "notfound"));
});
