import { purchasesModel } from "./purchases.model.js";
import {
  purchaseSchema,
  paymentSchema,
  debtStatusSchema,
} from "./purchases.schema.js";
import { pageInput } from "../shared/pagination.schema.js";
export async function savePurchase(db, input) {
  return db.$transaction(async (tx) => {
    const previous = await tx.inventoryPurchase.findUnique({
      where: { requestId: input.requestId },
    });
    if (previous) return previous;
    const productIds = [...new Set(input.items.map((item) => item.productId))];
    const warehouseIds = [
      ...new Set(input.items.map((item) => item.warehouseId)),
    ];
    const [products, warehouses] = await Promise.all([
      tx.inventoryProduct.findMany({
        where: { id: { in: productIds }, status: "active" },
      }),
      tx.inventoryWarehouse.findMany({
        where: { id: { in: warehouseIds }, status: "active" },
      }),
    ]);
    if (
      products.length !== productIds.length ||
      warehouses.length !== warehouseIds.length
    ) {
      const error = new Error("Select active products and storage locations.");
      error.status = 400;
      throw error;
    }
    const items = input.items.map((item) => ({
      ...item,
      productName: products.find((p) => p.id === item.productId).name,
      warehouseName: warehouses.find((w) => w.id === item.warehouseId).name,
      totalPrice:
        Math.round(item.quantity * Math.round(item.price * 100)) / 100,
    }));
    const totalPrice =
      items.reduce((sum, item) => sum + Math.round(item.totalPrice * 100), 0) /
      100;
    if (!Number.isSafeInteger(Math.round(totalPrice * 100)))
      throw new Error("Purchase total is too large.");
    const purchase = await tx.inventoryPurchase.create({
      data: { ...input, buyDate: new Date(input.buyDate), items, totalPrice },
    });
    for (const item of items) {
      await tx.inventoryStock.upsert({
        where: {
          productId_warehouseId: {
            productId: item.productId,
            warehouseId: item.warehouseId,
          },
        },
        create: {
          productId: item.productId,
          warehouseId: item.warehouseId,
          quantity: item.quantity,
        },
        update: { quantity: { increment: item.quantity } },
      });
      await tx.inventoryMovement.create({
        data: {
          productId: item.productId,
          warehouseId: item.warehouseId,
          movementType: "purchase",
          quantity: item.quantity,
          reference: input.invoiceNumber,
          notes: input.note,
          occurredAt: new Date(input.buyDate),
        },
      });
    }
    return purchase;
  });
}

export async function reversePurchase(db, id, status) {
  if (!["returned", "deleted"].includes(status))
    throw new Error("Invalid purchase action.");
  return db.$transaction(async (tx) => {
    const purchase = await tx.inventoryPurchase.findUnique({ where: { id } });
    if (!purchase) {
      const error = new Error("Purchase not found.");
      error.status = 404;
      throw error;
    }
    if (purchase.status === status) return purchase;
    if (
      purchase.status === "deleted" ||
      (status === "returned" && purchase.status !== "completed")
    ) {
      const error = new Error("This purchase can no longer be returned.");
      error.status = 409;
      throw error;
    }
    if (Number(purchase.paidAmount ?? 0) > 0) {
      const error = new Error(
        "This purchase has recorded payments and cannot be returned or deleted.",
      );
      error.status = 409;
      throw error;
    }
    // Claim the transition before adjusting stock; concurrent actions cannot reverse twice.
    const claimed = await tx.inventoryPurchase.updateMany({
      where: { id, status: purchase.status, paidAmount: 0 },
      data: { status },
    });
    if (claimed.count !== 1) {
      const error = new Error("Purchase changed. Refresh and try again.");
      error.status = 409;
      throw error;
    }
    if (purchase.status === "completed") {
      const quantities = new Map();
      for (const item of purchase.items) {
        const key = JSON.stringify([item.productId, item.warehouseId]);
        const previous = quantities.get(key);
        quantities.set(key, {
          ...item,
          quantity: (previous?.quantity ?? 0) + item.quantity,
        });
      }
      for (const item of [...quantities.values()].sort((a, b) =>
        `${a.productId}:${a.warehouseId}`.localeCompare(
          `${b.productId}:${b.warehouseId}`,
        ),
      )) {
        const changed = await tx.inventoryStock.updateMany({
          where: {
            productId: item.productId,
            warehouseId: item.warehouseId,
            quantity: { gte: item.quantity },
          },
          data: { quantity: { decrement: item.quantity } },
        });
        if (changed.count !== 1) {
          const error = new Error(
            "Insufficient stock to reverse this purchase. No changes were saved.",
          );
          error.status = 409;
          throw error;
        }
        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            warehouseId: item.warehouseId,
            quantity: -item.quantity,
            movementType: "adjustment_out",
            reference: purchase.invoiceNumber,
            notes:
              status === "returned"
                ? "Purchase returned to retailer"
                : "Purchase deleted (stock reversed)",
          },
        });
      }
    }
    return { ...purchase, status };
  });
}

export async function payPurchase(db, id, input) {
  return db.$transaction(async (tx) => {
    const previous = await tx.inventoryPurchasePayment.findUnique({
      where: { requestId: input.requestId },
    });
    if (previous) {
      if (previous.purchaseId !== id) {
        const error = new Error("Payment request belongs to another invoice.");
        error.status = 409;
        throw error;
      }
      return previous;
    }
    const purchase = await tx.inventoryPurchase.findUnique({ where: { id } });
    if (!purchase || !purchase.isDebt || purchase.status !== "completed") {
      const error = new Error("This invoice is not an active purchase debt.");
      error.status = 409;
      throw error;
    }
    const paid = Math.round(Number(purchase.paidAmount) * 100);
    const amount = Math.round(input.amount * 100);
    const total = Math.round(Number(purchase.totalPrice) * 100);
    if (paid + amount > total) {
      const error = new Error("Payment exceeds the remaining balance.");
      error.status = 400;
      throw error;
    }
    const changed = await tx.inventoryPurchase.updateMany({
      where: { id, status: "completed", paidAmount: purchase.paidAmount },
      data: { paidAmount: { increment: input.amount } },
    });
    if (changed.count !== 1) {
      const error = new Error("Invoice changed. Refresh and try again.");
      error.status = 409;
      throw error;
    }
    return tx.inventoryPurchasePayment.create({
      data: { ...input, purchaseId: id },
    });
  });
}

export const purchasesService = {
  debts: async ({ query = {}, id }) => {
    const search = String(query.search ?? "").trim();
    const status = debtStatusSchema.parse(query.status ?? "");
    const where = {
      isDebt: true,
      status: "completed",
      ...(query.retailer && { retailer: String(query.retailer) }),
      ...(search && {
        OR: ["invoiceNumber", "retailer", "salesperson", "note"].map((key) => ({
          [key]: { contains: search },
        })),
      }),
      ...(status === "paid" && {
        paidAmount: { gte: purchasesModel.fields.totalPrice },
      }),
      ...(status === "unpaid" && {
        paidAmount: { lt: purchasesModel.fields.totalPrice },
      }),
      ...(status === "partial" && {
        paidAmount: { gt: 0, lt: purchasesModel.fields.totalPrice },
      }),
    };
    const { page, pageSize } = pageInput(query);
    const [items, total, sums] = await purchasesModel.$transaction([
      purchasesModel.findMany({
        where,
        include: { payments: { orderBy: { paidAt: "desc" } } },
        orderBy: [{ buyDate: "desc" }, { id: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      purchasesModel.count({ where }),
      purchasesModel.aggregate({
        where,
        _sum: { totalPrice: true, paidAmount: true },
      }),
    ]);
    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
      summary: {
        totalPrice: sums._sum.totalPrice ?? 0,
        paidAmount: sums._sum.paidAmount ?? 0,
        outstanding:
          (Math.round(Number(sums._sum.totalPrice ?? 0) * 100) -
            Math.round(Number(sums._sum.paidAmount ?? 0) * 100)) /
          100,
      },
    };
  },
  pay: async ({ body, id }) => {
    try {
      return await payPurchase(purchasesModel, id, paymentSchema.parse(body));
    } catch (error) {
      if (error.code === "P2002") {
        const previous = await purchasesModel
          .findPayment({ where: { requestId: body.requestId } })
          .catch(() => null);
        if (previous?.purchaseId === id) return previous;
      }
      throw error;
    }
  },
  list: async ({ query = {}, id }) => {
    const search = String(query.search ?? "").trim();
    return await purchasesModel.paginate(query, "inventoryPurchase", {
      where: {
        status: { not: "deleted" },
        ...(query.retailer && { retailer: String(query.retailer) }),
        ...(search && {
          OR: ["retailer", "invoiceNumber", "note"].map((key) => ({
            [key]: { contains: search },
          })),
        }),
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
  },
  returnPurchase: async ({ id }) => {
    return await reversePurchase(purchasesModel, id, "returned");
  },
  remove: async ({ id }) => {
    return await reversePurchase(purchasesModel, id, "deleted");
  },
  retailers: async () => {
    const rows = await purchasesModel.findMany({
      select: { retailer: true },
      distinct: ["retailer"],
      orderBy: { retailer: "asc" },
    });
    return rows.map((row) => row.retailer);
  },
  create: async ({ body }) => {
    try {
      return await savePurchase(purchasesModel, purchaseSchema.parse(body));
    } catch (error) {
      if (error.code === "P2002") {
        const previous = await purchasesModel
          .findUnique({ where: { requestId: body.requestId } })
          .catch(() => null);
        if (previous) return previous;
        throw Object.assign(
          new Error("This retailer invoice has already been recorded."),
          { status: 409 },
        );
      }
      throw error;
    }
  },
};
