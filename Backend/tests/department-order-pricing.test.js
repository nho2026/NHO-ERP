import test from "node:test";
import assert from "node:assert/strict";
import { priceDepartmentItems, departmentOrdersModel } from "../src/modules/inventory/department-orders/department-orders.model.js";

test("department totals use selling prices and quantities with decimal precision", () => {
  const result = priceDepartmentItems([{ productId: "a", quantity: 100 }, { productId: "b", quantity: 3 }], [{ id: "a", sellingPrice: "0.10" }, { id: "b", sellingPrice: "1.25" }]);
  assert.equal(result.price, "13.75");
  assert.equal(result.items[0].sellingPrice, "0.1");
});

test("approval ignores submitted price and completion preserves the saved price", async () => {
  let order = { id: "order", status: "pending", departmentName: "Department", items: [{ productId: "a", warehouseId: "w", quantity: 100 }] };
  let movements = 0;
  const tx = {
    inventoryDepartmentOrder: { findUnique: async () => order, updateMany: async ({ data }) => { order = { ...order, ...data }; return { count: 1 }; } },
    inventoryProduct: { findMany: async () => [{ id: "a", sellingPrice: "2.50" }], findUnique: async () => ({ status: "active" }) },
    inventoryStock: { updateMany: async () => ({ count: 1 }) },
    inventoryMovement: { create: async () => { movements++; } },
  };
  const db = { $transaction: (run) => run(tx) };
  const approved = await departmentOrdersModel.update("order", { status: "approved", price: 999, reason: "" }, db);
  assert.equal(approved.price, "250.00");
  assert.equal(approved.items[0].sellingPrice, "2.5");
  const completed = await departmentOrdersModel.update("order", { status: "completed", price: 0, reason: "" }, db);
  assert.equal(completed.price, "250.00");
  assert.equal(movements, 1);
});
