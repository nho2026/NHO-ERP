import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("both appointment relations preserve records when their doctor is deleted", async () => {
  const schema = await readFile(new URL("../src/shared/database/prisma/schema.prisma", import.meta.url), "utf8");
  for (const name of ["Appointment", "SurgeryAppointment"]) {
    const body = schema.split(`model ${name} {`)[1].split("\n}")[0];
    assert.match(body, /doctorId\s+String\?/);
    assert.match(body, /doctor\s+HealthStaff\?\s+@relation\([^\n]*onDelete: SetNull/);
  }
});
