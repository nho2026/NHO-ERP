import test from "node:test";
import assert from "node:assert/strict";
import { departmentOrdersModel } from "../src/modules/inventory/department-orders/department-orders.model.js";
function database(quantity = 5, status = "pending") {
  const state = { quantity, order: { id: "o", status, departmentId: "d", departmentName: "ICU", items: [{ productId: "p", warehouseId: "w", name: "Gloves", quantity: 3 }] }, movements: [] };
  return { state, async $transaction(fn) {
    const next = structuredClone(state);
    const result = await fn({
      inventoryDepartmentOrder: { findUnique: async () => next.order, updateMany: async ({ where, data }) => { if (next.order.status !== where.status) return { count: 0 }; next.order = { ...next.order, ...data }; return { count: 1 }; } },
      inventoryProduct: { findUnique: async () => ({ status: "active" }) },
      inventoryStock: { updateMany: async ({ where, data }) => { if (next.quantity < where.quantity.gte) return { count: 0 }; next.quantity -= data.quantity.decrement; return { count: 1 }; } },
      inventoryMovement: { create: async ({ data }) => next.movements.push(data) },
    });
    Object.assign(state, next); return result;
  } };
}
test("approval issues stock once, completion does not issue again", async () => {
  const db = database();
  await departmentOrdersModel.update("o", { status: "approved" }, db);
  assert.equal(db.state.quantity, 2); assert.equal(db.state.movements[0].quantity, -3);
  assert.equal(db.state.movements[0].reference, "o");
  await departmentOrdersModel.update("o", { status: "approved" }, db);
  await departmentOrdersModel.update("o", { status: "completed" }, db);
  assert.equal(db.state.quantity, 2); assert.equal(db.state.movements.length, 1);
});
test("insufficient stock rolls back approval", async () => {
  const db = database(2);
  await assert.rejects(departmentOrdersModel.update("o", { status: "approved" }, db), { status: 409 });
  assert.equal(db.state.order.status, "pending"); assert.equal(db.state.quantity, 2); assert.equal(db.state.movements.length, 0);
});
test("rejection makes no movement and cannot later be approved", async () => {
  const db = database();
  await departmentOrdersModel.update("o", { status: "rejected" }, db);
  assert.equal(db.state.quantity, 5); assert.equal(db.state.movements.length, 0);
  await assert.rejects(departmentOrdersModel.update("o", { status: "approved" }, db), { status: 409 });
});
