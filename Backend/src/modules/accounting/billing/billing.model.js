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
  createCustomer: (data) => prisma.billingCustomer.create({ data }),
  updateCustomer: (id, data) =>
    prisma.billingCustomer.update({ where: { id }, data }),
  deleteCustomer: (id) => prisma.billingCustomer.delete({ where: { id } }),
  listInvoices: (status) =>
    prisma.billingInvoice.findMany({
      where: status ? { status } : {},
      include: invoiceInclude,
      orderBy: { issueDate: "desc" },
      take: 1000,
    }),
  createInvoice: (data) =>
    prisma.billingInvoice.create({ data, include: invoiceInclude }),
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
