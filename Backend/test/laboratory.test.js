import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { attachLaboratoryRealtime, laboratoryChangeMiddleware } from "../src/modules/laboratory/laboratory.realtime.js";
import { attachmentType } from "../src/modules/laboratory/laboratory.attachments.js";
import { test } from "node:test";

test("laboratory websocket refreshes only after successful mutations", () => {
  const events = [];
  attachLaboratoryRealtime({ of: () => ({ use() {}, on() {}, emit: (event) => events.push(event) }) });
  for (const [method, status] of [["POST", 201], ["PATCH", 409], ["GET", 200]]) {
    const response = new EventEmitter(); response.statusCode = status;
    laboratoryChangeMiddleware({ method }, response, () => {});
    assert.equal(events.length, method === "POST" ? 0 : 1);
    response.emit("finish");
  }
  assert.deepEqual(events, ["laboratory:changed"]);
  const called = new EventEmitter(); called.statusCode = 200;
  laboratoryChangeMiddleware({ method: "POST", path: "/orders/ticket/call-ticket" }, called, () => {});
  called.emit("finish");
  assert.deepEqual(events.slice(1), ["laboratory:ticket-called", "laboratory:changed"]);
});
import {
  queueDay,
  advanceLaboratoryOrder,
  createLaboratoryOrder,
} from "../src/modules/laboratory/laboratory.service.js";
import {
  testSchema,
  orderSchema,
  paymentSchema,
} from "../src/modules/laboratory/laboratory.schema.js";
import { createBillingPayment } from "../src/modules/accounting/billing/billing.model.js";
import {
  requestPermission,
  missingRequestPermissions,
} from "../src/shared/security/access-policy.js";

test("walk-in laboratory requests require phone and accept optional address", () => {
  assert.equal(requestPermission("GET", "/api/laboratory/orders/test/queue-position"), "laboratory.orders.view");
  const input = {
    requestId: "550e8400-e29b-41d4-a716-446655440000",
    patient: { firstName: "Test", lastName: "Patient", phone: "07701234567" },
    testIds: ["cbc"],
  };
  assert.equal(orderSchema.parse(input).patient.address, undefined);
  assert.equal(orderSchema.parse({ ...input, patient: { ...input.patient, address: "  Baghdad  " } }).patient.address, "Baghdad");
  assert.equal(orderSchema.parse({ ...input, patient: { ...input.patient, address: "" } }).patient.address, "");
  assert.equal(orderSchema.safeParse({ ...input, patient: { ...input.patient, phone: " " } }).success, false);
});

test("laboratory test inputs need no code and cannot overwrite generated codes", () => {
  const input = { name: "CBC", specimen: "Blood", price: 10 };
  assert.equal(testSchema.parse(input).name, "CBC");
  assert.equal(testSchema.parse({ ...input, code: "manual" }).code, undefined);
});

test("laboratory catalog supports name and price and protects delete permissions", () => {
  const parsed = testSchema.parse({ name: " CBC ", price: 10000 });
  assert.equal(parsed.name, "CBC");
  assert.equal(parsed.price, 10000);
  assert.equal(parsed.specimen, "");
  assert.equal(testSchema.safeParse({ name: "", price: 10 }).success, false);
  assert.equal(testSchema.safeParse({ name: "CBC", price: -1 }).success, false);
  assert.equal(requestPermission("DELETE", "/api/laboratory/tests/test-id"), "laboratory.tests.delete");
});

test("attachments validate file contents and require laboratory permissions", () => {
  assert.equal(requestPermission("POST", "/api/laboratory/orders/id/call-ticket"), "laboratory.display.call");
  assert.equal(requestPermission("GET", "/api/laboratory/accounting-queue"), "laboratory.orders.view");
  assert.equal(attachmentType(Buffer.from("%PDF-1.7")), "application/pdf");
  assert.equal(
    attachmentType(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    "image/png",
  );
  assert.equal(attachmentType(Buffer.from([255, 216, 255, 224])), "image/jpeg");
  assert.equal(attachmentType(Buffer.from("GIF89a")), "image/gif");
  assert.equal(attachmentType(Buffer.from("RIFF1234WEBP")), "image/webp");
  assert.throws(
    () => attachmentType(Buffer.from("<script>alert(1)</script>")),
    /Attach a PDF/,
  );
  assert.equal(
    requestPermission("POST", "/api/laboratory/orders/id/attachments"),
    "laboratory.orders.update",
  );
  assert.equal(
    requestPermission("GET", "/api/laboratory/orders/id/attachments/file"),
    "laboratory.orders.view",
  );
});

test("laboratory queue day follows hospital timezone across midnight", () => {
  assert.equal(
    queueDay(new Date("2026-09-18T22:00:00Z"), "Asia/Baghdad"),
    "2026-09-19",
  );
});

test("reception requires one patient source and unique tests", () => {
  const valid = {
    requestId: "00000000-0000-4000-8000-000000000001",
    patientId: "patient",
    testIds: ["test"],
  };
  assert.equal(orderSchema.safeParse(valid).success, true);
  assert.equal(
    orderSchema.safeParse({ ...valid, leadId: "lead" }).success,
    false,
  );
  assert.equal(
    orderSchema.safeParse({ ...valid, patientId: undefined }).success,
    false,
  );
  assert.equal(
    orderSchema.safeParse({ ...valid, testIds: ["test", "test"] }).success,
    false,
  );
  assert.equal(
    paymentSchema.safeParse({
      requestId: valid.requestId,
      amount: 0,
      method: "cash",
    }).success,
    false,
  );
  assert.equal(
    paymentSchema.safeParse({
      requestId: valid.requestId,
      amount: 1.001,
      method: "cash",
    }).success,
    false,
  );
});

function stageFixture(
  status,
  invoice = { status: "paid", balanceAmount: 0 },
  result = "Normal",
) {
  const updates = [];
  const order = { id: "order", status, invoice, items: [{ result }] };
  const tx = {
    $queryRaw: async () => [],
    laboratoryOrder: {
      findUniqueOrThrow: async () => order,
      update: async ({ data }) => {
        updates.push(data);
        return { ...order, ...data };
      },
    },
  };
  return { db: { $transaction: (run) => run(tx) }, updates };
}

test("unpaid requests and stage skipping are blocked", async () => {
  const unpaid = stageFixture("waiting", {
    status: "partial",
    balanceAmount: 10,
  });
  await assert.rejects(
    advanceLaboratoryOrder(unpaid.db, "order", "collecting", "Staff"),
    { status: 409 },
  );
  assert.equal(unpaid.updates.length, 0);
  const skip = stageFixture("waiting");
  await assert.rejects(
    advanceLaboratoryOrder(skip.db, "order", "completed", "Staff"),
    { status: 409 },
  );
});

test("collection records staff and completion requires all results", async () => {
  const ready = stageFixture("waiting");
  const processing = await advanceLaboratoryOrder(ready.db, "order", "processing", "Lab staff");
  assert.equal(processing.status, "processing");
  assert.equal(processing.collectedByName, "Lab staff");
  const collecting = stageFixture("waiting");
  const result = await advanceLaboratoryOrder(
    collecting.db,
    "order",
    "collecting",
    "Lab staff",
  );
  assert.equal(result.collectedByName, "Lab staff");
  assert.ok(result.collectedAt instanceof Date);
  const incomplete = stageFixture("processing", undefined, " ");
  await assert.rejects(
    advanceLaboratoryOrder(incomplete.db, "order", "completed", "Staff"),
    /every test/,
  );
  const complete = stageFixture("processing");
  assert.equal(
    (await advanceLaboratoryOrder(complete.db, "order", "completed", "Staff"))
      .completedByName,
    "Staff",
  );
});

test("results require attachment before reception handover and record contact and delivery", async () => {
  const missing = stageFixture("completed");
  await assert.rejects(
    advanceLaboratoryOrder(missing.db, "order", "received", "Staff"),
    /PDF or image result report/,
  );
  const imageOnly = stageFixture("completed");
  const originalTransaction = imageOnly.db.$transaction;
  imageOnly.db.$transaction = (run) => originalTransaction(async (tx) => {
    const find = tx.laboratoryOrder.findUniqueOrThrow;
    tx.laboratoryOrder.findUniqueOrThrow = async () => ({ ...(await find()), attachments: [{ mime: "image/png" }] });
    return run(tx);
  });
  assert.equal((await advanceLaboratoryOrder(imageOnly.db, "order", "received", "Staff")).status, "received");
  const contact = stageFixture("received");
  const called = await advanceLaboratoryOrder(
    contact.db,
    "order",
    "called",
    "Reception",
  );
  assert.equal(called.contactedByName, "Reception");
  assert.ok(called.contactedAt instanceof Date);
  const delivery = stageFixture("called");
  const delivered = await advanceLaboratoryOrder(
    delivery.db,
    "order",
    "delivered",
    "Reception",
  );
  assert.equal(delivered.deliveredByName, "Reception");
  assert.ok(delivered.deliveredAt instanceof Date);
  await assert.rejects(
    advanceLaboratoryOrder(contact.db, "order", "delivered", "Reception"),
    /Invalid laboratory stage/,
  );
});

test("existing reception request is returned without creating another invoice or patient", async () => {
  const saved = { id: "existing-order" };
  const db = {
    $transaction: (run) =>
      run({ laboratoryOrder: { findUnique: async () => saved } }),
  };
  assert.equal(
    await createLaboratoryOrder(
      db,
      { requestId: "same-request" },
      "Reception",
      {},
    ),
    saved,
  );
});

test("billing full payment releases the lab queue; partial payment does not", async () => {
  for (const amount of [25, 100]) {
    let released = false;
    let locked = false;
    const tx = {
      $queryRaw: async () => {
        locked = true;
      },
      billingInvoice: {
        findUniqueOrThrow: async () => {
          assert.equal(locked, true);
          return {
            id: "invoice",
            totalAmount: 100,
            paidAmount: 0,
            balanceAmount: 100,
          };
        },
        update: async ({ data }) => {
          assert.equal(data.status, amount === 100 ? "paid" : "partial");
        },
      },
      billingPayment: { create: async () => ({ id: "payment" }) },
      laboratoryOrder: {
        updateMany: async ({ where, data }) => {
          released = true;
          assert.equal(where.status, "awaiting_payment");
          assert.equal(data.status, "waiting");
        },
      },
    };
    await createBillingPayment(tx, { invoiceId: "invoice", amount }, () => {});
    assert.equal(released, amount === 100);
  }
});

test("laboratory actions resolve separate reception, accounting and test permissions", () => {
  assert.equal(
    requestPermission("POST", "/api/laboratory/orders"),
    "laboratory.orders.create",
  );
  assert.equal(
    requestPermission("POST", "/api/laboratory/orders/id/pay"),
    "laboratory.payments.create",
  );
  assert.equal(
    requestPermission("PATCH", "/api/laboratory/orders/id/results"),
    "laboratory.orders.update",
  );
  assert.equal(
    requestPermission("POST", "/api/laboratory/tests"),
    "laboratory.tests.create",
  );
  assert.deepEqual(
    missingRequestPermissions(
      new Set(["laboratory.payments.view", "laboratory.payments.create"]),
      "POST",
      "/api/laboratory/orders/id/pay",
    ),
    [],
  );
});
