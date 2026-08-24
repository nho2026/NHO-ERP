import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import UsersPage from "@/features/access-control/pages/UsersPage";
import RolesPage from "@/features/access-control/pages/RolesPage";
import ProfilePage from "@/features/auth/pages/ProfilePage";
import AttendanceShell from "@/features/attendance/pages/AttendanceShell";
import DevicesPage from "@/features/attendance/pages/DevicesPage";
import DeviceUsersPage from "@/features/attendance/pages/DeviceUsersPage";
import EventsPage from "@/features/attendance/pages/EventsPage";
import HrPage from "@/features/hr/pages/HrPage";
import HealthcarePage from "@/features/healthcare/pages/HealthcarePage";
import AccountingPage from "@/features/accounting/pages/AccountingPage";
import BillingPage from "@/features/accounting/pages/BillingPage";
import ServiceAdvancesPage from "@/features/accounting/pages/ServiceAdvancesPage";
import FinancePage from "@/features/finance/pages/FinancePage";
import InventoryPage from "@/features/inventory/pages/InventoryPage";
import BarcodeLabelsPage from "@/features/inventory/pages/BarcodeLabelsPage";
import PosPage from "@/features/inventory/pages/PosPage";
import HealthPosPage from "@/features/inventory/pages/HealthPosPage";
import TasksPage from "@/features/tasks/pages/TasksPage";
import TaskReportsPage from "@/features/tasks/pages/TaskReportsPage";
import FeedbackPage from "@/features/feedback/pages/FeedbackPage";
import { Toaster } from "sonner";
import { DirectionProvider } from "@radix-ui/react-direction";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import { RequireAccess } from "@/features/auth/access";

const secured = (
  permission: string | undefined,
  element: ReactNode,
  allowCashier = false,
) => (
  <RequireAccess permission={permission} allowCashier={allowCashier}>
    {element}
  </RequireAccess>
);

export default function App() {
  const { i18n } = useTranslation();
  const direction = i18n.resolvedLanguage?.startsWith("en") ? "ltr" : "rtl";
  return (
    <DirectionProvider dir={direction}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={secured("dashboard.view", <DashboardPage />)} />
          <Route path="/profile" element={secured(undefined, <ProfilePage />, true)} />
          <Route path="/tasks" element={secured("tasks.list.view", <TasksPage />)} />
          <Route path="/tasks/reports" element={secured("tasks.reports.view", <TaskReportsPage />)} />
          <Route path="/feedback" element={secured("healthcare.feedback.view", <FeedbackPage />)} />
          <Route path="/users" element={secured("users.view", <UsersPage />)} />
          <Route path="/roles" element={secured("roles.view", <RolesPage />)} />
          <Route path="/employees" element={secured("hr.employees.view", <HrPage resource="employees" />)} />
          <Route path="/positions" element={secured("hr.positions.view", <HrPage resource="positions" />)} />
          <Route path="/contracts" element={secured("hr.contracts.view", <HrPage resource="contracts" />)} />
          <Route path="/salaries" element={secured("hr.salaries.view", <HrPage resource="salaries" />)} />
          <Route
            path="/hr-attendance"
            element={secured("hr.attendance.view", <HrPage resource="attendance" />)}
          />
          <Route path="/payrolls" element={secured("hr.payrolls.view", <HrPage resource="payrolls" />)} />
          <Route
            path="/salary-advances"
            element={secured("hr.advances.view", <HrPage resource="advances" />)}
          />
          <Route
            path="/departments"
            element={secured("healthcare.departments.view", <HealthcarePage resource="departments" />)}
          />
          <Route
            path="/health-staff"
            element={secured("healthcare.staff.view", <HealthcarePage resource="staff" />)}
          />
          <Route
            path="/appointments"
            element={secured("healthcare.appointments.view", <HealthcarePage resource="appointments" />)}
          />
          <Route
            path="/accounting/accounts"
            element={secured("accounting.accounts.view", <AccountingPage resource="accounts" />)}
          />
          <Route
            path="/accounting/journals"
            element={secured("accounting.journals.view", <AccountingPage resource="journals" />)}
          />
          <Route
            path="/accounting/customers"
            element={secured("accounting.customers.view", <BillingPage resource="customers" />)}
          />
          <Route
            path="/accounting/invoices"
            element={secured("accounting.invoices.view", <BillingPage resource="invoices" />)}
          />
          <Route
            path="/accounting/payments"
            element={secured("accounting.payments.view", <BillingPage resource="payments" />)}
          />
          <Route
            path="/accounting/service-advances"
            element={secured("accounting.service_advances.view", <ServiceAdvancesPage />)}
          />
          <Route
            path="/accounting/reports"
            element={secured("accounting.reports.view", <AccountingPage resource="reports" />)}
          />
          <Route
            path="/finance/budgets"
            element={secured("finance.budgets.view", <FinancePage resource="budgets" />)}
          />
          <Route
            path="/finance/cash-flow"
            element={secured("finance.cash-flow.view", <FinancePage resource="cash-flow" />)}
          />
          <Route
            path="/finance/forecasts"
            element={secured("finance.forecasts.view", <FinancePage resource="forecasts" />)}
          />
          <Route
            path="/finance/analysis"
            element={secured("finance.analysis.view", <FinancePage resource="analysis" />)}
          />
          <Route
            path="/finance/funding"
            element={secured("finance.funding.view", <FinancePage resource="funding" />)}
          />
          <Route
            path="/inventory/products"
            element={secured("inventory.products.view", <InventoryPage resource="products" />)}
          />
          <Route path="/inventory/barcodes" element={secured("inventory.barcodes.view", <BarcodeLabelsPage />)} />
          <Route
            path="/inventory/categories"
            element={secured("inventory.categories.view", <InventoryPage resource="categories" />)}
          />
          <Route
            path="/inventory/brands"
            element={secured("inventory.brands.view", <InventoryPage resource="brands" />)}
          />
          <Route
            path="/inventory/warehouses"
            element={secured("inventory.warehouses.view", <InventoryPage resource="warehouses" />)}
          />
          <Route
            path="/inventory/stock"
            element={secured("inventory.stock.view", <InventoryPage resource="stock" />)}
          />
          <Route
            path="/inventory/movements"
            element={secured("inventory.movements.view", <InventoryPage resource="movements" />)}
          />
          <Route path="/pos/sales" element={secured("pos.sales.view", <PosPage mode="sales" />)} />
          <Route path="/attendance" element={secured(undefined, <AttendanceShell />)}>
            <Route index element={<Navigate to="devices" replace />} />
            <Route path="devices" element={secured("attendance.devices.view", <DevicesPage />)} />
            <Route path="users" element={secured("attendance.users.view", <DeviceUsersPage />)} />
            <Route path="events" element={secured("attendance.events.view", <EventsPage />)} />
          </Route>
        </Route>
        <Route path="/pos/checkout" element={secured("pos.checkout.view", <HealthPosPage />, true)} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster dir={direction} richColors position="top-center" closeButton />
    </DirectionProvider>
  );
}
