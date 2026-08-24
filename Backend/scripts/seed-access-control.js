import "dotenv/config";
import { prisma } from "../src/shared/database/client.js";

try {
  const catalog = [
    ["pos.use", "Use point of sale", "Point of Sale"],
    ...[
      ["tasks.list", "Tasks / Task List"],
      ["tasks.reports", "Tasks / Reports"],
      ["attendance.devices", "Attendance / Devices"],
      ["attendance.users", "Attendance / Users"],
      ["attendance.events", "Attendance / Events"],
      ["hr.employees", "Human Resources / Employees"],
      ["hr.positions", "Human Resources / Positions"],
      ["hr.contracts", "Human Resources / Contracts"],
      ["hr.salaries", "Human Resources / Salaries"],
      ["hr.attendance", "Human Resources / Attendance"],
      ["hr.payrolls", "Human Resources / Payrolls"],
      ["hr.advances", "Human Resources / Salary Advances"],
      ["healthcare.departments", "Healthcare / Departments"],
      ["healthcare.staff", "Healthcare / Staff"],
      ["healthcare.appointments", "Healthcare / Appointments"],
      ["healthcare.feedback", "Healthcare / Feedback"],
      ["accounting.accounts", "Accounting / Accounts"],
      ["accounting.journals", "Accounting / Journals"],
      ["accounting.customers", "Accounting / Customers"],
      ["accounting.invoices", "Accounting / Invoices"],
      ["accounting.payments", "Accounting / Payments"],
      ["accounting.service_advances", "Accounting / Service Advances"],
      ["accounting.reports", "Accounting / Reports"],
      ["finance.budgets", "Finance / Budgets"],
      ["finance.cash-flow", "Finance / Cash Flow"],
      ["finance.forecasts", "Finance / Forecasts"],
      ["finance.analysis", "Finance / Analysis"],
      ["finance.funding", "Finance / Funding"],
      ["inventory.brands", "Inventory / Brands"],
      ["inventory.products", "Inventory / Products"],
      ["inventory.barcodes", "Inventory / Barcodes"],
      ["inventory.categories", "Inventory / Categories"],
      ["inventory.warehouses", "Inventory / Warehouses"],
      ["inventory.stock", "Inventory / Stock"],
      ["inventory.movements", "Inventory / Movements"],
      ["pos.checkout", "Point of Sale / Checkout"],
      ["pos.sales", "Point of Sale / Sales History"],
    ].flatMap(([page, module]) =>
      ["view", "create", "update", "delete", "manage"].map((action) => [
        `${page}.${action}`,
        `${action[0].toUpperCase()}${action.slice(1)} ${module.split(" / ").at(-1)}`,
        module,
      ]),
    ),
    ["accounting.journals.post", "Post journals", "Accounting / Journals"],
  ];
  for (const [key, name, module] of catalog)
    await prisma.permission.upsert({
      where: { key },
      update: { name, module },
      create: { key, name, module },
    });
  const permission = await prisma.permission.findUniqueOrThrow({
    where: { key: "pos.use" },
  });
  const cashier = await prisma.role.upsert({
    where: { name: "Cashier" },
    update: { description: "Point-of-sale and own-profile access only" },
    create: {
      name: "Cashier",
      description: "Point-of-sale and own-profile access only",
    },
  });
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: cashier.id,
        permissionId: permission.id,
      },
    },
    update: {},
    create: { roleId: cashier.id, permissionId: permission.id },
  });
  console.log("Cashier role and granular access permissions are ready.");
} finally {
  await prisma.$disconnect();
}
