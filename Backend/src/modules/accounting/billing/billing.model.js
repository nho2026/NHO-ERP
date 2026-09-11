import { createWithCode, withoutCode } from "../../../shared/database/automatic-code.js";
import { defaults } from "../../settings/settings.schema.js";
import { prisma } from "../../../shared/database/client.js";
const invoiceInclude = {
  customer: true,
  items: true,
  payments: { orderBy: { paidAt: "desc" } },
};
export const billingModel = {
  listCustomers: () =>
    prisma.billingCustomer.findMany({
      include: { _count: { select: { invoices: true } } },
      orderBy: { name: "asc" },
    }),
  createCustomer: (data) => createWithCode(prisma.billingCustomer, { data }, "CUS"),
  updateCustomer: (id, data) =>
    prisma.billingCustomer.update({ where: { id }, data: withoutCode(data) }),
  deleteCustomer: (id) => prisma.billingCustomer.delete({ where: { id } }),
  listInvoices: (status) =>
    prisma.billingInvoice.findMany({
      where: status ? { status } : {},
      include: invoiceInclude,
      orderBy: { issueDate: "desc" },
      take: 1000,
    }),
  createInvoice: (data) =>
    prisma.$transaction(async (tx) => {
      await tx.systemSetting.upsert({
        where: { category: "finance" },
        create: { category: "finance", value: defaults.finance },
        update: {},
      });
      await tx.$queryRaw`SELECT category FROM system_Settings WHERE category = 'finance' FOR UPDATE`;
      const row = await tx.systemSetting.findUniqueOrThrow({
        where: { category: "finance" },
      });
      const policy = { ...defaults.finance, ...row.value };
      const invoiceNumber = `${policy.invoicePrefix}-${String(policy.invoiceNextNumber).padStart(6, "0")}`;
      const invoice = await tx.billingInvoice.create({
        data: { ...data, invoiceNumber },
        include: invoiceInclude,
      });
      await tx.systemSetting.update({
        where: { category: "finance" },
        data: {
          value: { ...policy, invoiceNextNumber: policy.invoiceNextNumber + 1 },
        },
      });
      return invoice;
    }),
  findInvoice: (id) =>
    prisma.billingInvoice.findUniqueOrThrow({ where: { id } }),
  updateInvoiceStatus: (id, status) =>
    prisma.billingInvoice.update({
      where: { id },
      data: { status },
      include: invoiceInclude,
    }),
  deleteDraftInvoice: (id) =>
    prisma.billingInvoice.delete({
      where: { id, status: "draft", paidAmount: 0 },
    }),
  listPayments: () =>
    prisma.billingPayment.findMany({
      include: { invoice: { include: { customer: true } } },
      orderBy: { paidAt: "desc" },
      take: 1000,
    }),
  recordPayment: (data, validate) =>
    prisma.$transaction(async (tx) => {
      const invoice = await tx.billingInvoice.findUniqueOrThrow({
        where: { id: data.invoiceId },
      });
      validate(invoice);
      const payment = await tx.billingPayment.create({ data });
      const paidAmount = invoice.paidAmount + data.amount,
        balanceAmount = Math.max(0, invoice.totalAmount - paidAmount);
      await tx.billingInvoice.update({
        where: { id: invoice.id },
        data: {
          paidAmount,
          balanceAmount,
          status: balanceAmount <= 0.001 ? "paid" : "partial",
        },
      });
      return payment;
    }),
};
