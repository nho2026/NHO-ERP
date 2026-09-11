import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { attachMeetingSignaling } from "../src/modules/meetings/meetings.signaling.js";

test("meeting polling handshake works through the API path and still requires authentication", async (t) => {
  const server = createServer((_request, response) => {
    response.setHeader("Content-Type", "text/html");
    response.end("<!doctype html><html>SPA fallback</html>");
  });
  const io = attachMeetingSignaling(server, []);
  t.after(() => new Promise((resolve) => io.close(resolve)));
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const url = `http://127.0.0.1:${server.address().port}/api/socket.io/?EIO=4&transport=polling`;
  const handshake = await fetch(url);
  assert.equal(handshake.status, 200);
  const packet = await handshake.text();
  assert.equal(packet[0], "0", "must return an Engine.IO handshake, not the SPA");
  const { sid } = JSON.parse(packet.slice(1));
  assert.ok(sid);
  const sessionUrl = `${url}&sid=${encodeURIComponent(sid)}`;
  const connect = await fetch(sessionUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: "40",
  });
  assert.equal(connect.status, 200);
  await connect.text();
  const reply = await (await fetch(sessionUrl)).text();
  assert.equal(reply, '44{"message":"Authentication required"}');
});
