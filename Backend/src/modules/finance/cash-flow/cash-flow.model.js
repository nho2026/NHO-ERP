import { prisma } from "../../../shared/database/client.js";
export const cashFlowModel = {
  async findPage(page, pageSize) {
    const [items, total] = await prisma.$transaction([
      prisma.financeCashFlow.findMany({
        orderBy: { flowDate: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.financeCashFlow.count(),
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
  create: (data) => prisma.financeCashFlow.create({ data }),
  update: (id, data) => prisma.financeCashFlow.update({ where: { id }, data }),
  remove: (id) => prisma.financeCashFlow.delete({ where: { id } }),
};
