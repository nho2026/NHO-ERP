import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { prisma } from "../src/shared/database/client.js";

test(
  "department deletion preserves appointments and clears department links",
  {
    skip: process.env.RUN_DATABASE_TESTS !== "1",
  },
  async () => {
    const rollback = new Error("Roll back test fixtures");
    try {
      await assert.rejects(
        prisma.$transaction(async (tx) => {
          const key = randomUUID();
          const department = await tx.department.create({
            data: { code: key, name: key },
          });
          const employee = await tx.employee.create({
            data: {
              employeeCode: key,
              firstName: "Test",
              lastName: "Doctor",
              hireDate: new Date(),
              departmentId: department.id,
            },
          });
          const doctor = await tx.healthStaff.create({
            data: {
              employeeId: employee.id,
              departmentId: department.id,
              staffType: "doctor",
            },
          });
          const appointment = await tx.appointment.create({
            data: {
              patientName: "Test Patient",
              patientPhone: "0000000000",
              doctorId: doctor.id,
              departmentId: department.id,
              scheduledAt: new Date(),
            },
          });
          await tx.department.delete({ where: { id: department.id } });
          const saved = await tx.appointment.findUniqueOrThrow({
            where: { id: appointment.id },
            include: { department: true },
          });
          assert.equal(saved.departmentId, null);
          assert.equal(saved.department, null);
          assert.equal(saved.doctorId, doctor.id);
          assert.equal(saved.patientName, appointment.patientName);
          assert.equal(
            (
              await tx.employee.findUniqueOrThrow({
                where: { id: employee.id },
              })
            ).departmentId,
            null,
          );
          assert.equal(
            (
              await tx.healthStaff.findUniqueOrThrow({
                where: { id: doctor.id },
              })
            ).departmentId,
            null,
          );
          throw rollback;
        }),
        (error) => error === rollback,
      );
    } finally {
      await prisma.$disconnect();
    }
  },
);
