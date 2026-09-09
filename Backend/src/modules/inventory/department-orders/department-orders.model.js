import { prisma } from "../../../shared/database/client.js";
import { paginate } from "../shared/pagination.model.js";
import { Prisma } from "@prisma/client";

export const priceDepartmentItems = (items, products) => {
  let total = new Prisma.Decimal(0);
  const priced = items.map((item) => {
    const product = products.find((product) => product.id === item.productId);
    if (!product)
      throw Object.assign(new Error(`Product unavailable: ${item.name}`), {
        status: 409,
      });
    const unitPrice = new Prisma.Decimal(product.sellingPrice);
    total = total.plus(unitPrice.times(item.quantity));
    return { ...item, sellingPrice: unitPrice.toString() };
  });
  return { items: priced, price: total.toFixed(2) };
};
export const departmentOrdersModel = {
  departments: () =>
    prisma.department.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  department: (id) =>
    prisma.department.findUnique({ where: { id }, select: { name: true } }),
  list: async (query, where) => {
    const result = await paginate(query, "inventoryDepartmentOrder", {
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
    const orders = Array.isArray(result) ? result : result.items;
    const products = await prisma.inventoryProduct.findMany({
      where: {
        id: {
          in: orders
            .filter((order) => order.status === "pending")
            .flatMap((order) =>
              order.items.map((item) => item.productId).filter(Boolean),
            ),
        },
      },
      select: { id: true, sellingPrice: true },
    });
    const items = orders.map((order) =>
      order.status === "pending" &&
      order.items.every((item) =>
        products.some((product) => product.id === item.productId),
      )
        ? { ...order, ...priceDepartmentItems(order.items, products) }
        : order,
    );
    return Array.isArray(result) ? items : { ...result, items };
  },
  catalog: async () => {
    const [products, warehouses] = await Promise.all([
      prisma.inventoryProduct.findMany({
        where: { status: "active" },
        select: {
          id: true,
          name: true,
          stocks: { select: { warehouseId: true, quantity: true } },
        },
        orderBy: { name: "asc" },
      }),
      prisma.inventoryWarehouse.findMany({
        where: { status: "active" },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]);
    return products.flatMap((product) =>
      warehouses.map((warehouse) => ({
        id: `${product.id}:${warehouse.id}`,
        productId: product.id,
        warehouseId: warehouse.id,
        quantity:
          product.stocks.find((stock) => stock.warehouseId === warehouse.id)
            ?.quantity ?? 0,
        product: { name: product.name },
        warehouse: { name: warehouse.name },
      })),
    );
  },
  create: async (data) => {
    const items = [];
    for (const item of data.items) {
      const [product, warehouse] = await Promise.all([
        prisma.inventoryProduct.findUnique({
          where: { id: item.productId },
          select: { name: true, status: true },
        }),
        prisma.inventoryWarehouse.findUnique({
          where: { id: item.warehouseId },
          select: { name: true, status: true },
        }),
      ]);
      if (
        !product ||
        product.status !== "active" ||
        !warehouse ||
        warehouse.status !== "active"
      )
        throw Object.assign(
          new Error("Select an active product and storage."),
          { status: 400 },
        );
      items.push({
        ...item,
        name: product.name,
        warehouseName: warehouse.name,
      });
    }
    return prisma.inventoryDepartmentOrder.create({
      data: { ...data, items, status: "pending" },
    });
  },
  update: (id, data, db = prisma) =>
    db.$transaction(async (tx) => {
      const order = await tx.inventoryDepartmentOrder.findUnique({
        where: { id },
      });
      const fail = (message) =>
        Object.assign(new Error(message), { status: 409 });
      if (!order)
        throw Object.assign(new Error("Order not found."), { status: 404 });
      if (order.status === data.status) return order;
      const allowed = {
        pending: ["approved", "rejected"],
        approved: ["completed"],
        completed: [],
        rejected: [],
      };
      if (!allowed[order.status]?.includes(data.status))
        throw fail("Invalid order status transition.");
      const update = { status: data.status, reason: data.reason };
      if (data.status === "approved") {
        const products = await tx.inventoryProduct.findMany({
          where: {
            id: {
              in: order.items.map((item) => item.productId).filter(Boolean),
            },
          },
        });
        Object.assign(update, priceDepartmentItems(order.items, products));
      }
      const claimed = await tx.inventoryDepartmentOrder.updateMany({
        where: { id, status: order.status },
        data: update,
      });
      if (claimed.count !== 1)
        throw fail(
          "Order was changed by another reviewer. Reopen it and try again.",
        );
      if (data.status === "approved") {
        for (const item of order.items) {
          if (!item.productId || !item.warehouseId)
            throw fail(
              "This legacy request has no product/storage references. Submit a new request.",
            );
          const product = await tx.inventoryProduct.findUnique({
            where: { id: item.productId },
          });
          if (!product || product.status !== "active")
            throw fail("A requested product is unavailable.");
          const updated = await tx.inventoryStock.updateMany({
            where: {
              productId: item.productId,
              warehouseId: item.warehouseId,
              quantity: { gte: item.quantity },
            },
            data: { quantity: { decrement: item.quantity } },
          });
          if (updated.count !== 1)
            throw fail(`Insufficient stock for ${item.name}.`);
          await tx.inventoryMovement.create({
            data: {
              productId: item.productId,
              warehouseId: item.warehouseId,
              movementType: "department_issue",
              quantity: -item.quantity,
              reference: order.id,
              notes: `Issued to ${order.departmentName} (${order.departmentId})`,
            },
          });
        }
      }
      return tx.inventoryDepartmentOrder.findUnique({ where: { id } });
    }),
  comment: (id, note) =>
    prisma.inventoryDepartmentOrderComment.create({
      data: { orderId: id, note },
    }),
  comments: (id) =>
    prisma.inventoryDepartmentOrderComment.findMany({
      where: { orderId: id },
      orderBy: { createdAt: "asc" },
    }),
};
