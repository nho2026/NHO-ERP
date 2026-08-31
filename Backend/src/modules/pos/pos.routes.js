import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../shared/database/client.js";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";
import { requirePermission } from "../../shared/middleware/permission.middleware.js";
import { verifySecret } from "../../shared/security/password.js";

const router = Router();
router.use(requireAuth);
const view = requirePermission("pos.use");
const sell = requirePermission("pos.use");
const requireSuperAdmin = (req, res, next) => {
  if (!req.permissionKeys?.has("*"))
    return res
      .status(403)
      .json({ message: "Only a Super Administrator can cancel sales." });
  next();
};
const saleInclude = { warehouse: true, items: { include: { product: true } } };
router.get("/sales", view, async (req, res, next) => {
  try {
    const page = z.coerce
        .number()
        .int()
        .min(1)
        .default(1)
        .parse(req.query.page),
      pageSize = z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(50)
        .parse(req.query.pageSize);
    const [items, total] = await prisma.$transaction([
      prisma.posSale.findMany({
        include: saleInclude,
        orderBy: { soldAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.posSale.count(),
    ]);
    res.json({
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    });
  } catch (e) {
    next(e);
  }
});
router.post("/sales", sell, async (req, res, next) => {
  try {
    const input = z
      .object({
        warehouseId: z.string(),
        customerName: z.string().trim().nullable().optional(),
        paymentMethod: z.enum(["cash", "card", "bank_transfer"]),
        discountAmount: z.coerce.number().min(0).default(0),
        paidAmount: z.coerce.number().min(0),
        notes: z.string().trim().nullable().optional(),
        items: z
          .array(
            z.object({
              productId: z.string(),
              quantity: z.coerce.number().positive(),
            }),
          )
          .min(1),
      })
      .parse(req.body);
    input.items = [
      ...input.items
        .reduce((items, item) => {
          const current = items.get(item.productId);
          items.set(item.productId, {
            ...item,
            quantity: (current?.quantity ?? 0) + item.quantity,
          });
          return items;
        }, new Map())
        .values(),
    ];
    const sale = await prisma.$transaction(async (tx) => {
      const ids = [...new Set(input.items.map((i) => i.productId))];
      const products = await tx.inventoryProduct.findMany({
        where: { id: { in: ids }, status: "active" },
      });
      if (products.length !== ids.length) {
        const error = new Error("One or more products are unavailable.");
        error.status = 409;
        throw error;
      }
      const productMap = new Map(products.map((p) => [p.id, p]));
      const stocks = await tx.inventoryStock.findMany({
        where: { warehouseId: input.warehouseId, productId: { in: ids } },
      });
      const stockMap = new Map(stocks.map((s) => [s.productId, s]));
      for (const item of input.items)
        if ((stockMap.get(item.productId)?.quantity ?? 0) < item.quantity) {
          const error = new Error(
            `Insufficient stock for ${productMap.get(item.productId)?.name ?? "product"}.`,
          );
          error.status = 409;
          throw error;
        }
      const now = new Date();
      const lines = input.items.map((item) => {
        const product = productMap.get(item.productId);
        const discountActive =
          product.discountType &&
          product.discountValue > 0 &&
          (!product.discountStart || product.discountStart <= now) &&
          (!product.discountEnd || product.discountEnd >= now);
        const discountedPrice = discountActive
          ? product.discountType === "percentage"
            ? product.sellingPrice *
              (1 - Math.min(product.discountValue, 100) / 100)
            : Math.max(0, product.sellingPrice - product.discountValue)
          : product.sellingPrice;
        const beforeTax = discountedPrice * item.quantity;
        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: discountedPrice,
          taxRate: product.taxRate,
          lineTotal: beforeTax + (beforeTax * product.taxRate) / 100,
        };
      });
      const subtotal = lines.reduce(
          (sum, line) => sum + line.unitPrice * line.quantity,
          0,
        ),
        taxAmount = lines.reduce(
          (sum, line) => sum + line.lineTotal - line.unitPrice * line.quantity,
          0,
        ),
        totalAmount = Math.max(0, subtotal + taxAmount - input.discountAmount);
      if (input.paidAmount < totalAmount) {
        const error = new Error("Paid amount is less than the sale total.");
        error.status = 400;
        throw error;
      }
      const created = await tx.posSale.create({
        data: {
          saleNumber: `POS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          warehouseId: input.warehouseId,
          customerName: input.customerName,
          paymentMethod: input.paymentMethod,
          subtotal,
          discountAmount: input.discountAmount,
          taxAmount,
          totalAmount,
          paidAmount: input.paidAmount,
          changeAmount: input.paidAmount - totalAmount,
          cashierName: req.user.name,
          notes: input.notes,
          items: { create: lines },
        },
        include: saleInclude,
      });
      for (const item of input.items) {
        await tx.inventoryStock.update({
          where: {
            productId_warehouseId: {
              productId: item.productId,
              warehouseId: input.warehouseId,
            },
          },
          data: { quantity: { decrement: item.quantity } },
        });
        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            warehouseId: input.warehouseId,
            movementType: "sale",
            quantity: -item.quantity,
            reference: created.saleNumber,
            notes: `POS sale ${created.saleNumber}`,
          },
        });
      }
      return created;
    });
    res.status(201).json(sale);
  } catch (e) {
    next(e);
  }
});
const returnSale = (where) =>
  prisma.$transaction(async (tx) => {
    const current = await tx.posSale.findUniqueOrThrow({
      where,
      include: { items: true },
    });
    if (current.status === "cancelled") {
      const error = new Error("Sale is already cancelled.");
      error.status = 409;
      throw error;
    }
    for (const item of current.items) {
      await tx.inventoryStock.update({
        where: {
          productId_warehouseId: {
            productId: item.productId,
            warehouseId: current.warehouseId,
          },
        },
        data: { quantity: { increment: item.quantity } },
      });
      await tx.inventoryMovement.create({
        data: {
          productId: item.productId,
          warehouseId: current.warehouseId,
          movementType: "sale_cancelled",
          quantity: item.quantity,
          reference: current.saleNumber,
        },
      });
    }
    return tx.posSale.update({
      where: { id: current.id },
      data: { status: "cancelled" },
      include: saleInclude,
    });
  });
router.post("/sales/return", sell, async (req, res, next) => {
  try {
    const { saleNumber } = z
      .object({ saleNumber: z.string().trim().min(1) })
      .parse(req.body);
    res.json(await returnSale({ saleNumber }));
  } catch (e) {
    next(e);
  }
});
router.post("/sales/:id/cancel", requireSuperAdmin, async (req, res, next) => {
  try {
    const { password } = z
      .object({ password: z.string().min(1).max(128) })
      .parse(req.body);
    if (!(await verifySecret(password, req.user.passwordHash)))
      return res.status(403).json({ message: "The password is incorrect." });
    const sale = await returnSale({ id: req.params.id });
    res.json(sale);
  } catch (e) {
    next(e);
  }
});
export default router;
