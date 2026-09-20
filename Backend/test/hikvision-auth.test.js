import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import crypto from "node:crypto";
import { HikvisionClient } from "../src/modules/attendance/hikvision/hikvision.client.js";

const md5 = value => crypto.createHash("md5").update(value).digest("hex");

test("paged device reads reuse valid Digest authentication and recover from expired nonces", async t => {
  let nonce = "initial";
  let requests = 0;
  const counts = [];
  const cnonces = [];
  const server = http.createServer((req, res) => {
    requests++;
    req.resume();
    const fields = Object.fromEntries([...String(req.headers.authorization ?? "").matchAll(/(\w+)=(?:"([^"]*)"|([^,\s]+))/g)].map(m => [m[1], m[2] ?? m[3]]));
    if (fields.nonce !== nonce) {
      res.writeHead(401, { "WWW-Authenticate": `Digest realm="terminal", nonce="${nonce}", qop="auth", opaque="device"` });
      res.end();
      return;
    }
    const expected = md5(`${md5("test:terminal:secret")}:${nonce}:${fields.nc}:${fields.cnonce}:auth:${md5(`${req.method}:${req.url}`)}`);
    if (fields.response !== expected || fields.uri !== req.url || fields.opaque !== "device") {
      res.writeHead(403);
      res.end();
      return;
    }
    counts.push(fields.nc);
    cnonces.push(fields.cnonce);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ AcsEvent: { InfoList: [] } }));
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const client = new HikvisionClient({ ipAddress: "127.0.0.1", port: server.address().port, username: "test", password: "secret" });
  const read = () => client.events("2026-09-01", "2026-09-20");
  await read();
  assert.equal(requests, 2);
  await read();
  await read();
  assert.equal(requests, 4);
  assert.deepEqual(counts, ["00000001", "00000002", "00000003"]);
  assert.equal(new Set(cnonces).size, 1);
  nonce = "renewed";
  await read();
  assert.equal(requests, 6);
  await read();
  assert.equal(requests, 7);
  assert.deepEqual(counts.slice(-2), ["00000001", "00000002"]);
  assert.notEqual(cnonces[2], cnonces[3]);
});

for (const withChallenge of [false, true]) {
  test(`long sync recovers from rejected cached authentication (challenge: ${withChallenge})`, async t => {
    let nonce = 0;
    let requests = 0;
    let accepted = 0;
    const server = http.createServer((req, res) => {
      requests++;
      req.resume();
      const auth = req.headers.authorization;
      if (!auth) {
        nonce++;
        res.writeHead(401, {"WWW-Authenticate": `Digest realm="terminal", nonce="${nonce}", qop="auth"`});
      } else if (accepted === 1 && auth.includes('nonce="1"')) {
        res.writeHead(401, withChallenge ? {"WWW-Authenticate": 'Digest realm="terminal", nonce="1", qop="auth"'} : {});
      } else {
        accepted++;
        res.writeHead(200, {"Content-Type": "application/json"});
      }
      res.end('{}');
    });
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    t.after(() => new Promise(resolve => server.close(resolve)));
    const client = new HikvisionClient({ipAddress: "127.0.0.1", port: server.address().port, username: "test", password: "secret"});
    await client.info();
    await client.info();
    assert.equal(accepted, 2);
    assert.equal(client.reuseDigest, false);
    const before = requests;
    await client.info();
    assert.equal(accepted, 3);
    assert.equal(requests - before, 2);
  });
}

test("rejected credentials stop after one authenticated retry", async t => {
  let requests = 0;
  const server = http.createServer((req, res) => {
    requests++;
    req.resume();
    res.writeHead(401, { "WWW-Authenticate": 'Digest realm="terminal", nonce="nonce", qop="auth"' });
    res.end();
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const client = new HikvisionClient({ ipAddress: "127.0.0.1", port: server.address().port, username: "test", password: "wrong" });
  await assert.rejects(client.info(), /rejected/);
  assert.equal(requests, 2);
  assert.equal(client.digestChallenge, null);
});
