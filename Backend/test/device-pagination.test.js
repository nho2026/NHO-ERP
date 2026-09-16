import { test } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/shared/database/client.js";
import { deviceService } from "../src/modules/attendance/devices/devices.service.js";

test("device pages include metadata and omit passwords; lookup arrays remain compatible", async t => {
  const transaction = prisma.$transaction;
  const findMany = prisma.attendanceDevice.findMany;
  t.after(() => { prisma.$transaction = transaction; prisma.attendanceDevice.findMany = findMany; });
  const device = {id: "device", name: "Main", password: "private"};
  prisma.attendanceDevice.findMany = async () => [device];
  prisma.$transaction = async run => run({attendanceDevice: {
    count: async () => 21,
    findMany: async args => {
      assert.equal(args.skip, 20);
      assert.equal(args.take, 20);
      return [device];
    },
  }});
  const page = await deviceService.list({page: "2", pageSize: "20"});
  assert.deepEqual(page.pagination, {page: 2, pageSize: 20, total: 21, totalPages: 2});
  assert.equal(page.items[0].password, undefined);
  const lookup = await deviceService.list();
  assert.equal(Array.isArray(lookup), true);
  assert.equal(lookup[0].password, undefined);
});
