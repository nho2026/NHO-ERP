import { test } from "node:test";
import assert from "node:assert/strict";
import { eventsService } from "../src/modules/attendance/events/events.service.js";
import { eventsModel } from "../src/modules/attendance/events/events.model.js";
import { peopleService } from "../src/modules/attendance/people/people.service.js";
import { HikvisionClient } from "../src/modules/attendance/hikvision/hikvision.client.js";

test("long syncs cover every selected day with separate paginated ten-day searches", async t => {
  t.mock.method(eventsModel, "devices", async () => [{id: "device"}]);
  t.mock.method(eventsModel, "people", async () => [{id: "person", employeeNo: "1"}]);
  t.mock.method(eventsModel, "existingEvents", async () => []);
  t.mock.method(eventsModel, "status", async () => {});
  const saved = [];
  t.mock.method(eventsModel, "saveUnique", async (_device, _id, data) => {
    saved.push(data.occurredAt.toISOString());
    return {created: true};
  });
  const calls = [];
  t.mock.method(HikvisionClient.prototype, "events", async (from, to, position, searchID) => {
    assert.ok(to - from < 10 * 86400000, "device rejects searches over ten days");
    calls.push({from: from.toISOString(), to: to.toISOString(), position, searchID});
    const time = position === 0 ? from.toISOString() : new Date(Math.floor(to.getTime() / 1000) * 1000).toISOString();
    return {AcsEvent: {
      responseStatusStrg: position === 0 ? "MORE" : "OK",
      totalMatches: 2,
      InfoList: [{time, serialNo: time, employeeNo: "1", major: 5, minor: 1, attendanceStatus: position === 0 ? "checkIn" : "checkOut"}],
    }};
  });
  const result = await eventsService.sync({from: "2026-07-01", to: "2026-07-25"});
  assert.deepEqual(result.errors, []);
  assert.equal(result.synced, 6);
  assert.deepEqual(calls.map(call => call.position), [0, 1, 0, 1, 0, 1]);
  assert.equal(new Set(calls.map(call => call.searchID)).size, 3);
  for (let i = 0; i < calls.length; i += 2) {
    assert.equal(calls[i].searchID, calls[i + 1].searchID);
    if (i > 0) assert.equal(Date.parse(calls[i].from), Date.parse(calls[i - 1].to) + 1);
  }
  assert.equal(calls[0].from, "2026-06-30T21:00:00.000Z");
  assert.equal(calls.at(-1).to, "2026-07-25T20:59:59.999Z");
  assert.deepEqual(saved, [
    "2026-06-30T21:00:00.000Z", "2026-07-10T20:59:59.000Z",
    "2026-07-10T21:00:00.000Z", "2026-07-20T20:59:59.000Z",
    "2026-07-20T21:00:00.000Z", "2026-07-25T20:59:59.000Z",
  ]);
});

test("an empty ten-day window does not stop a longer sync", async t => {
  t.mock.method(eventsModel, "devices", async () => [{id: "device"}]);
  t.mock.method(eventsModel, "people", async () => []);
  t.mock.method(eventsModel, "existingEvents", async () => []);
  t.mock.method(eventsModel, "status", async () => {});
  const read = t.mock.method(HikvisionClient.prototype, "events", async () => ({AcsEvent: {InfoList: [], totalMatches: 0}}));
  for (const [to, expected] of [["2026-07-10", 1], ["2026-07-11", 2], ["2026-07-20", 2]]) {
    const before = read.mock.callCount();
    const result = await eventsService.sync({from: "2026-07-01", to});
    assert.deepEqual(result.errors, []);
    assert.equal(read.mock.callCount() - before, expected);
  }
});

test("sync requests the selected Baghdad days and excludes terminal events outside them", async t => {
  t.mock.method(peopleService, "sync", async () => ({synced: 0, errors: []}));
  t.mock.method(eventsModel, "devices", async () => [{id: "device", ipAddress: "127.0.0.1", port: 80, username: "test", password: "test"}]);
  t.mock.method(eventsModel, "people", async () => []);
  t.mock.method(eventsModel, "existingEvents", async () => []);
  t.mock.method(eventsModel, "status", async () => {});
  const saved = [];
  t.mock.method(eventsModel, "saveUnique", async (_device, _id, data) => { saved.push(data); return {created: true}; });
  t.mock.method(HikvisionClient.prototype, "events", async (from, to) => {
    assert.equal(from.toISOString(), "2026-07-09T21:00:00.000Z");
    assert.equal(to.toISOString(), "2026-07-11T20:59:59.999Z");
    return {AcsEvent: {InfoList: ["2026-07-09T20:59:59Z", "2026-07-09T21:00:00Z", "2026-07-11T20:59:59Z", "2026-07-11T21:00:00Z"].map((time, serialNo) => ({time, serialNo, employeeNo: "1", major: 5, minor: 1, attendanceStatus: "checkIn"}))}};
  });
  const result = await eventsService.sync({deviceId: "device", from: "2026-07-10", to: "2026-07-11"});
  assert.deepEqual(result.errors, []);
  assert.equal(result.synced, 2);
  assert.equal(saved.length, 2);
});

test("invalid sync dates fail before contacting devices", async t => {
  const sync = t.mock.method(peopleService, "sync", async () => {throw Error("Unexpected device access");});
  for (const range of [{from:"bad"}, {from:"2026-02-30"}, {from:"2026-07-12",to:"2026-07-10"}])
    await assert.rejects(eventsService.sync(range), {status:400});
  assert.equal(sync.mock.callCount(), 0);
});

test("repeat sync skips saved events but still processes reused terminal serial numbers", async t => {
  const userSync = t.mock.method(peopleService, "sync", async () => ({synced: 0, errors: []}));
  t.mock.method(eventsModel, "devices", async () => [{id: "device"}]);
  t.mock.method(eventsModel, "people", async () => [{id: "person", employeeNo: "1"}]);
  t.mock.method(eventsModel, "status", async () => {});
  const time = "2026-07-10T06:00:00Z";
  t.mock.method(eventsModel, "existingEvents", async (_device, ids) => {
    assert.deepEqual(ids, ["1", "2"]);
    return [
      {deviceEventId: "1", employeeNo: "1", eventType: "check_in", occurredAt: new Date(time)},
      {deviceEventId: "2", employeeNo: "1", eventType: "check_in", occurredAt: new Date("2026-06-01T06:00:00Z")},
    ];
  });
  const save = t.mock.method(eventsModel, "saveUnique", async (_device, id) => {
    assert.equal(id, "2");
    return {created: true};
  });
  t.mock.method(HikvisionClient.prototype, "events", async () => ({AcsEvent: {InfoList: [1, 2].map(serialNo => ({time, serialNo, employeeNo: "1", major: 5, minor: 1, attendanceStatus: "checkIn"}))}}));
  const result = await eventsService.sync({deviceId: "device", from: "2026-07-10", to: "2026-07-10"});
  assert.deepEqual(result.errors, []);
  assert.equal(result.synced, 1);
  assert.equal(save.mock.callCount(), 1);
  assert.equal(userSync.mock.callCount(), 0);
});

test("unknown employees trigger only one user import per device and retain links", async t => {
  const userSync = t.mock.method(peopleService, "sync", async deviceId => {
    assert.equal(deviceId, "device");
    return {synced: 1, errors: []};
  });
  t.mock.method(eventsModel, "devices", async () => [{id: "device"}]);
  t.mock.method(eventsModel, "people", async () => userSync.mock.callCount() ? [{id: "linked-person", employeeNo: "1"}] : []);
  t.mock.method(eventsModel, "existingEvents", async () => []);
  t.mock.method(eventsModel, "status", async () => {});
  const save = t.mock.method(eventsModel, "saveUnique", async (_device, _serial, data) => {
    if (data.employeeNo === "1") assert.equal(data.personId, "linked-person");
    return {created: true};
  });
  t.mock.method(HikvisionClient.prototype, "events", async () => ({AcsEvent: {InfoList: ["1", "2", "3"].map(employeeNo => ({time: "2026-07-10T06:00:00Z", serialNo: employeeNo, employeeNo, major: 5, minor: 1, attendanceStatus: "checkIn"}))}}));
  const result = await eventsService.sync({deviceId: "device", from: "2026-07-10", to: "2026-07-10"});
  assert.deepEqual(result.errors, []);
  assert.equal(result.usersSynced, 1);
  assert.equal(userSync.mock.callCount(), 1);
  assert.equal(save.mock.callCount(), 3);
});
