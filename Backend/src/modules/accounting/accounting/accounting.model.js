import { prisma } from "../../../shared/database/client.js";
const journalInclude = { lines: { include: { account: true } } };
export const accountingModel = {
  listAccounts: () =>
    prisma.accountingAccount.findMany({
      include: {
        parent: { select: { id: true, code: true, name: true } },
        _count: { select: { lines: true, children: true } },
      },
      orderBy: { code: "asc" },
    }),
  createAccount: (data) => prisma.accountingAccount.create({ data }),
  updateAccount: (id, data) =>
    prisma.accountingAccount.update({ where: { id }, data }),
  deleteAccount: (id) => prisma.accountingAccount.delete({ where: { id } }),
  listJournals: () =>
    prisma.journalEntry.findMany({
      include: journalInclude,
      orderBy: [{ entryDate: "desc" }, { createdAt: "desc" }],
      take: 1,
    }),
  createJournal: (data) =>
    prisma.journalEntry.create({ data, include: journalInclude }),
  postJournal: (id) =>
    prisma.journalEntry.update({
      where: { id, status: "draft" },
      data: { status: "posted" },
      include: journalInclude,
    }),
  deleteJournal: (id) =>
    prisma.journalEntry.delete({ where: { id, status: "draft" } }),
  reportAccounts: (from, to) =>
    prisma.accountingAccount.findMany({
      include: {
        lines: {
          where: {
            entry: { status: "posted", entryDate: { gte: from, lte: to } },
          },
          select: { debit: true, credit: true },
        },
      },
      orderBy: { code: "asc" },
    }),
};
