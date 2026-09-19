import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { test } from "node:test";
import { requestLog } from "../src/shared/middleware/request-log.middleware.js";

test("access logs include status and duration once and omit query credentials", (t) => {
  const lines = [];
  t.mock.method(console, "log", (line) => lines.push(line));
  const res = Object.assign(new EventEmitter(), { statusCode: 404, writableFinished: true });
  let continued = false;
  requestLog({ method: "GET", originalUrl: "/api/missing?token=private", httpVersion: "1.1", socket: { remoteAddress: "::ffff:127.0.0.1", remotePort: 1234 } }, res, () => { continued = true; });
  assert.equal(continued, true);
  assert.equal(lines.length, 0);
  res.emit("finish");
  res.emit("close");
  assert.equal(lines.length, 1);
  assert.match(lines[0], /127\.0\.0\.1:1234 - "GET \/api\/missing HTTP\/1\.1" 404 Not Found \d+\.\dms/);
  assert.ok(!lines[0].includes("private"));
});

test("interrupted responses log as aborted once", (t) => {
  const lines = [];
  t.mock.method(console, "log", (line) => lines.push(line));
  const res = Object.assign(new EventEmitter(), { statusCode: 200, writableFinished: false });
  requestLog({ method: "POST", url: "/api/orders", httpVersion: "1.1", socket: {} }, res, () => {});
  res.emit("close");
  res.emit("finish");
  assert.equal(lines.length, 1);
  assert.match(lines[0], /ABORTED/);
});
