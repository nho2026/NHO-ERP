import assert from "node:assert/strict";
import { test } from "node:test";
import { saveOrder } from "../src/modules/inventory/orders/orders.service.js";

function fixture(arrived = false) {
  const item = { isNew: true, productId: null, name: "New product", quantity: 2, price: 5,
    arrived, arrivedAt: arrived ? "2026-09-16T00:00:00.000Z" : null };
  const existing = { id: "order", name: "Order", note: "", items: [item] };
  const body = { name: "Updated order", note: "Note", originalItems: [item],
    items: [{ ...item, originalIndex: 0, price: 7 }] };
  let saved;
  const model = { find: async () => existing, products: async () => [],
    update: async (id, previous, data) => { assert.equal(id, "order"); assert.equal(previous, existing); saved = data; return { count: 1 }; } };
  return { model, body, get saved() { return saved; } };
}

test("order edits recalculate totals and preserve arrival metadata", async () => {
  const f = fixture(true);
  const result = await saveOrder(f.model, f.body, "order");
  assert.equal(result.totalPrice, 14);
  assert.equal(result.name, "Updated order");
  assert.equal(result.items[0].arrived, true);
  assert.equal(result.items[0].arrivedAt, "2026-09-16T00:00:00.000Z");
  assert.equal(result.items[0].originalIndex, undefined);
});

test("unarrived order items can change quantity", async () => {
  const f = fixture(); f.body.items[0].quantity = 3;
  assert.equal((await saveOrder(f.model, f.body, "order")).totalPrice, 21);
});

test("arrived products cannot change quantity", async () => {
  const f = fixture(true); f.body.items[0].quantity = 3;
  await assert.rejects(saveOrder(f.model, f.body, "order"), /Unmark arrived/);
  assert.equal(f.saved, undefined);
});

test("stale forms and concurrent writes are rejected", async () => {
  const f = fixture(); f.body.originalItems = [];
  await assert.rejects(saveOrder(f.model, f.body, "order"), /Order changed/);
  const g = fixture(); g.model.update = async () => ({ count: 0 });
  await assert.rejects(saveOrder(g.model, g.body, "order"), /Order changed/);
});

test("duplicate line references are rejected", async () => {
  const f = fixture(); f.body.items.push({ ...f.body.items[0] });
  await assert.rejects(saveOrder(f.model, f.body, "order"), /Invalid order item/);
});

test("new order creation keeps request idempotency", async () => {
  const f = fixture(); const previous = { id: "already-saved" };
  f.model.findRequest = async () => previous;
  assert.equal(await saveOrder(f.model, { ...f.body, requestId: "f2451aba-ff1f-4070-9be7-c229b663a49f" }), previous);
});
