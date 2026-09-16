import { test } from "node:test";
import assert from "node:assert/strict";
import { eventsService } from "../src/modules/attendance/events/events.service.js";
import { eventsModel } from "../src/modules/attendance/events/events.model.js";
import { peopleService } from "../src/modules/attendance/people/people.service.js";
import { HikvisionClient } from "../src/modules/attendance/hikvision/hikvision.client.js";

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
