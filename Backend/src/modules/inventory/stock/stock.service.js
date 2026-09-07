import { stockModel } from "./stock.model.js";
import { stockAdjustmentSchema } from "./stock.schema.js";
export const stockService = {
  list: async ({ query = {} }) => {
    const where = {
      ...(query.warehouseId && {
        warehouseId: String(query.warehouseId),
      }),
      ...(query.productId && { productId: String(query.productId) }),
    };
    return await stockModel.paginate(query, "inventoryStock", {
      where,
      include: { product: { include: { category: true } }, warehouse: true },
      orderBy: { product: { name: "asc" } },
    });
  },
  adjust: async ({ body }) => {
    const input = stockAdjustmentSchema.parse(body);
    const incoming = [
      "purchase",
      "adjustment_in",
      "transfer_in",
      "return",
    ].includes(input.movementType);
    const signed = incoming ? input.quantity : -input.quantity;
    const result = await stockModel.$transaction(async (tx) => {
      const current = await tx.inventoryStock.findUnique({
        where: {
          productId_warehouseId: {
            productId: input.productId,
            warehouseId: input.warehouseId,
          },
        },
      });
      if ((current?.quantity ?? 0) + signed < 0) {
        const error = new Error("Insufficient stock for this movement.");
        error.status = 409;
        throw error;
      }
      const stock = await tx.inventoryStock.upsert({
        where: {
          productId_warehouseId: {
            productId: input.productId,
            warehouseId: input.warehouseId,
          },
        },
        update: {
          quantity: { increment: signed },
          ...(input.reorderLevel !== undefined && {
            reorderLevel: input.reorderLevel,
          }),
        },
        create: {
          productId: input.productId,
          warehouseId: input.warehouseId,
          quantity: signed,
          reorderLevel: input.reorderLevel ?? 0,
        },
        include: { product: true, warehouse: true },
      });
      await tx.inventoryMovement.create({
        data: {
          productId: input.productId,
          warehouseId: input.warehouseId,
          movementType: input.movementType,
          quantity: signed,
          reference: input.reference,
          notes: input.notes,
        },
      });
      return stock;
    });
    return result;
  },
};
