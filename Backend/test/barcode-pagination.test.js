import assert from "node:assert/strict";
import { test } from "node:test";
import { productsService } from "../src/modules/inventory/products/products.service.js";
import { productsModel } from "../src/modules/inventory/products/products.model.js";

for (const hasBarcode of ["true", "false"]) {
  test(`barcode pagination filters ${hasBarcode === "true" ? "assigned" : "missing"} barcodes before paging`, async (t) => {
    const query = { hasBarcode, page: "2", pageSize: "20", search: "sample", compact: "true", includeStocks: "false" };
    t.mock.method(productsModel, "paginate", async (received, model, args) => {
      assert.deepEqual(received, query);
      assert.equal(model, "inventoryProduct");
      assert.deepEqual(args.where.AND, hasBarcode === "true"
        ? [{ barcode: { not: null } }, { barcode: { not: "" } }]
        : [{ OR: [{ barcode: null }, { barcode: "" }] }]);
      assert.deepEqual(args.where.OR, [
        { name: { contains: "sample" } },
        { sku: { contains: "sample" } },
        { barcode: { contains: "sample" } },
      ]);
      assert.equal(args.include.stocks, false);
      assert.equal(args.include.images, false);
      assert.deepEqual(args.orderBy, [{ name: "asc" }, { id: "asc" }]);
      return { items: [], pagination: { page: 2, pageSize: 20, total: 21, totalPages: 2 } };
    });
    const result = await productsService.list({ query });
    assert.equal(result.pagination.page, 2);
  });
}

test("normal product lists keep products with and without barcodes", async (t) => {
  t.mock.method(productsModel, "paginate", async (_query, _model, args) => {
    assert.equal(args.where.AND, undefined);
    return [];
  });
  await productsService.list({ query: {} });
});
