import { prisma } from "../../shared/database/client.js";
export const financeModel = {
  analysisData: async (year) => {
    const from = new Date(`${year}-01-01T00:00:00.000Z`),
      to = new Date(`${year}-12-31T23:59:59.999Z`);
    return Promise.all([
      prisma.financeBudget.findMany({
        where: { fiscalYear: year, status: { not: "closed" } },
      }),
      prisma.financeCashFlow.findMany({
        where: {
          flowDate: { gte: from, lte: to },
          status: { not: "cancelled" },
        },
      }),
      prisma.financeForecast.findMany({
        where: {
          periodStart: { lte: to },
          periodEnd: { gte: from },
          status: { not: "archived" },
        },
      }),
      prisma.financeFunding.findMany({
        where: { startDate: { lte: to }, status: { not: "cancelled" } },
      }),
      prisma.accountingAccount.findMany({
        include: {
          lines: {
            where: {
              entry: { status: "posted", entryDate: { gte: from, lte: to } },
            },
            select: { debit: true, credit: true },
          },
        },
      }),
    ]);
  },
};
