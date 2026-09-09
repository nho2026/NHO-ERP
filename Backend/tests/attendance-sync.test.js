import test from "node:test";
import assert from "node:assert/strict";
import { peopleService } from "../src/modules/attendance/people/people.service.js";
import { peopleModel } from "../src/modules/attendance/people/people.model.js";
import { eventsService } from "../src/modules/attendance/events/events.service.js";
import { eventsModel } from "../src/modules/attendance/events/events.model.js";
import { HikvisionClient } from "../src/modules/attendance/hikvision/hikvision.client.js";

test("event dates use explicit offsets while preserving the requested instant", async (t) => {
  const api = new HikvisionClient({});
  const read = t.mock.method(api, "readRequest", async () => ({}));
  await api.events("2026-09-09T08:00:00+03:00", "2026-09-09T09:00:00+03:00");
  const { AcsEventCond: condition } = read.mock.calls[0].arguments[2];
  assert.equal(condition.startTime, "2026-09-09T05:00:00+00:00");
  assert.equal(condition.endTime, "2026-09-09T06:00:00+00:00");
});

test("sync imports users despite card failures and never writes to the terminal", async (t) => {
  t.mock.timers.enable({
    apis: ["Date"],
    now: new Date("2026-09-09T12:00:00Z"),
  });
  const device = { id: "device", name: "Terminal" };
  const imported = [];
  t.mock.method(peopleModel, "devices", async () => [device]);
  t.mock.method(peopleModel, "employee", async () => undefined);
  t.mock.method(peopleModel, "upsert", async (deviceId, employeeNo, data) =>
    imported.push({ id: "person", employeeNo, ...data }),
  );
  t.mock.method(peopleModel, "deviceStatus", async () => {});
  t.mock.method(HikvisionClient.prototype, "allUsers", async () => [
    { employeeNo: "12", name: "Device User", numOfFP: 1 },
  ]);
  t.mock.method(HikvisionClient.prototype, "allCards", async () => {
    throw new Error("Card lookup unavailable");
  });
  const writes = t.mock.method(
    HikvisionClient.prototype,
    "request",
    async () => {
      throw new Error("Unexpected device write");
    },
  );
  t.mock.method(eventsModel, "devices", async () => [device]);
  t.mock.method(eventsModel, "people", async () => imported);
  t.mock.method(eventsModel, "status", async () => {});
  const search = t.mock.method(
    HikvisionClient.prototype,
    "events",
    async () => ({
      AcsEvent: {
        InfoList: [
          {
            employeeNo: "12",
            time: "2026-08-31T20:59:59Z",
            major: 5,
            minor: 38,
            attendanceStatus: "checkIn",
          },
          {
            employeeNo: "12",
            time: "2026-09-09T08:00:00Z",
            major: 5,
            minor: 38,
            attendanceStatus: "checkIn",
          },
        ],
        totalMatches: 2,
      },
    }),
  );
  const save = t.mock.method(eventsModel, "saveUnique", async () => ({
    created: true,
  }));
  const result = await eventsService.sync({
    from: "2000-01-01",
    to: "2030-01-01",
  });
  assert.equal(
    search.mock.calls[0].arguments[0].toISOString(),
    "2026-08-31T21:00:00.000Z",
  );
  assert.equal(
    search.mock.calls[0].arguments[1].toISOString(),
    "2026-09-09T12:00:00.000Z",
  );
  assert.equal(save.mock.callCount(), 1);
  assert.equal(result.usersSynced, 1);
  assert.equal(result.synced, 1);
  assert.match(result.errors[0].message, /Card lookup unavailable/);
  assert.equal(imported[0].cardNo, undefined);
  assert.equal(imported[0].hasFingerprint, true);
  assert.equal(save.mock.calls[0].arguments[2].personId, "person");
  assert.equal(writes.mock.callCount(), 0);
});

test("listing cached users does not contact the device", async (t) => {
  t.mock.method(peopleModel, "findAll", async () => [{ id: "cached" }]);
  const devices = t.mock.method(peopleModel, "devices", async () => {
    throw new Error("Unexpected sync");
  });
  assert.deepEqual(await peopleService.list(), [{ id: "cached" }]);
  assert.equal(devices.mock.callCount(), 0);
});

test("user search follows MORE pages without a total count", async (t) => {
  const read = t.mock.method(
    HikvisionClient.prototype,
    "readRequest",
    async () => ({
      UserInfoSearch:
        read.mock.callCount() === 0
          ? { UserInfo: [{ employeeNo: "1" }], responseStatusStrg: "MORE" }
          : { UserInfo: [{ employeeNo: "2" }], responseStatusStrg: "OK" },
    }),
  );
  assert.deepEqual(await new HikvisionClient({}).allUsers(), [
    { employeeNo: "1" },
    { employeeNo: "2" },
  ]);
});
