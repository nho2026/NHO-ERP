import { prisma } from "../../../shared/database/client.js";
export const budgetModel = {
  async findPage(page, pageSize) {
    const [items, total] = await prisma.$transaction([
      prisma.financeBudget.findMany({
        orderBy: [{ fiscalYear: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.financeBudget.count(),
    ]);
    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  },
  create: (data) => prisma.financeBudget.create({ data }),
  update: (id, data) => prisma.financeBudget.update({ where: { id }, data }),
  remove: (id) => prisma.financeBudget.delete({ where: { id } }),
};
