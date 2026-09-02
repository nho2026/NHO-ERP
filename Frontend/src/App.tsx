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
import HrReportsPage from "@/features/hr/pages/HrReportsPage";
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
import TaskDetailPage from "@/features/tasks/pages/TaskDetailPage";
import FeedbackPage from "@/features/feedback/pages/FeedbackPage";
import EmployeePortalPage from "@/features/employee-portal/pages/EmployeePortalPage";
import HrWarningsPage from "@/features/hr/pages/HrWarningsPage";
import HrAttendancePage from "@/features/hr/pages/HrAttendancePage";
import PayrollPage from "@/features/hr/pages/PayrollPage";
import MeetingsPage from "@/features/meetings/MeetingsPage";
import TargetsPage from "@/features/targets/pages/TargetsPage";
import CrmPage from "@/features/crm/pages/CrmPage";
import PatientProfilePage from "@/features/crm/pages/PatientProfilePage";
import CrmFormsPage from "@/features/crm/pages/CrmFormsPage";
import LeadProgressPage from "@/features/crm/pages/LeadProgressPage";
import LeadDetailPage from "@/features/crm/pages/LeadDetailPage";
import SystemLogsPage from "@/features/system-logs/pages/SystemLogsPage";
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
          <Route
            path="/dashboard"
            element={secured("dashboard.view", <DashboardPage />)}
          />
          <Route
            path="/profile"
            element={secured(undefined, <ProfilePage />, true)}
          />
          <Route
            path="/employee-portal"
            element={secured(undefined, <EmployeePortalPage />, true)}
          />
          <Route
            path="/tasks"
            element={secured("tasks.list.view", <TasksPage />)}
          />
          <Route
            path="/meetings"
            element={secured(undefined, <MeetingsPage />)}
          />
          <Route
            path="/targets"
            element={secured(undefined, <TargetsPage />)}
          />
          <Route
            path="/tasks/:id"
            element={secured("tasks.list.view", <TaskDetailPage />)}
          />
          <Route
            path="/tasks/reports"
            element={secured("tasks.reports.view", <TaskReportsPage />)}
          />
          <Route
            path="/feedback"
            element={secured("healthcare.feedback.view", <FeedbackPage />)}
          />
          <Route path="/users" element={secured("users.view", <UsersPage />)} />
          <Route path="/roles" element={secured("roles.view", <RolesPage />)} />
          <Route
            path="/system-logs"
            element={secured("system.logs.view", <SystemLogsPage />)}
          />
          <Route
            path="/employees"
            element={secured(
              "hr.employees.view",
              <HrPage resource="employees" />,
            )}
          />
          <Route
            path="/positions"
            element={secured(
              "hr.positions.view",
              <HrPage resource="positions" />,
            )}
          />
          <Route
            path="/salaries"
            element={secured(
              "hr.salaries.view",
              <HrPage resource="salaries" />,
            )}
          />
          <Route
            path="/hr-attendance"
            element={secured("hr.attendance.view", <HrAttendancePage />)}
          />
          <Route
            path="/payrolls"
            element={secured("hr.payrolls.view", <PayrollPage />)}
          />
          <Route
            path="/hr/reports"
            element={secured("hr.employees.view", <HrReportsPage />)}
          />
          <Route
            path="/hr/warnings"
            element={secured("hr.employees.update", <HrWarningsPage />)}
          />
          <Route
            path="/salary-advances"
            element={secured(
              "hr.advances.view",
              <HrPage resource="advances" />,
            )}
          />
          <Route
            path="/departments"
            element={secured(
              "healthcare.departments.view",
              <HealthcarePage resource="departments" />,
            )}
          />
          <Route
            path="/health-staff"
            element={secured(
              "healthcare.staff.view",
              <HealthcarePage resource="staff" />,
            )}
          />
          <Route
            path="/appointments"
            element={<Navigate to="/crm/appointments" replace />}
          />
          <Route
            path="/crm/leads"
            element={secured("employees.view", <CrmPage resource="leads" />)}
          />
          <Route
            path="/crm/leads/progress"
            element={secured("employees.view", <LeadProgressPage />)}
          />
          <Route
            path="/crm/leads/:id"
            element={secured("employees.view", <LeadDetailPage />)}
          />
          <Route
            path="/crm/patients"
            element={secured("employees.view", <CrmPage resource="patients" />)}
          />
          <Route
            path="/crm/patients/:id"
            element={secured("employees.view", <PatientProfilePage />)}
          />
          <Route
            path="/crm/forms"
            element={secured("employees.view", <CrmFormsPage />)}
          />
          <Route
            path="/crm/appointments"
            element={secured(
              "healthcare.appointments.view",
              <HealthcarePage resource="appointments" />,
            )}
          />
          <Route
            path="/crm/surgery-appointments"
            element={secured(
              "employees.view",
              <CrmPage resource="surgery-appointments" />,
            )}
          />
          <Route
            path="/crm/payments"
            element={secured("employees.view", <CrmPage resource="payments" />)}
          />
          <Route
            path="/crm/surgeries"
            element={secured(
              "employees.view",
              <CrmPage resource="surgeries" />,
            )}
          />
          <Route
            path="/accounting/accounts"
            element={secured(
              "accounting.accounts.view",
              <AccountingPage resource="accounts" />,
            )}
          />
          <Route
            path="/accounting/journals"
            element={secured(
              "accounting.journals.view",
              <AccountingPage resource="journals" />,
            )}
          />
          <Route
            path="/accounting/customers"
            element={secured(
              "accounting.customers.view",
              <BillingPage resource="customers" />,
            )}
          />
          <Route
            path="/accounting/invoices"
            element={secured(
              "accounting.invoices.view",
              <BillingPage resource="invoices" />,
            )}
          />
          <Route
            path="/accounting/payments"
            element={secured(
              "accounting.payments.view",
              <BillingPage resource="payments" />,
            )}
          />
          <Route
            path="/accounting/service-advances"
            element={secured(
              "accounting.service_advances.view",
              <ServiceAdvancesPage />,
            )}
          />
          <Route
            path="/accounting/reports"
            element={secured(
              "accounting.reports.view",
              <AccountingPage resource="reports" />,
            )}
          />
          <Route
            path="/finance/budgets"
            element={secured(
              "finance.budgets.view",
              <FinancePage resource="budgets" />,
            )}
          />
          <Route
            path="/finance/cash-flow"
            element={secured(
              "finance.cash-flow.view",
              <FinancePage resource="cash-flow" />,
            )}
          />
          <Route
            path="/finance/forecasts"
            element={secured(
              "finance.forecasts.view",
              <FinancePage resource="forecasts" />,
            )}
          />
          <Route
            path="/finance/analysis"
            element={secured(
              "finance.analysis.view",
              <FinancePage resource="analysis" />,
            )}
          />
          <Route
            path="/finance/funding"
            element={secured(
              "finance.funding.view",
              <FinancePage resource="funding" />,
            )}
          />
          <Route
            path="/inventory/products"
            element={secured(
              "inventory.products.view",
              <InventoryPage resource="products" />,
            )}
          />
          <Route
            path="/inventory/barcodes"
            element={secured("inventory.barcodes.view", <BarcodeLabelsPage />)}
          />
          <Route
            path="/inventory/categories"
            element={secured(
              "inventory.categories.view",
              <InventoryPage resource="categories" />,
            )}
          />
          <Route
            path="/inventory/brands"
            element={secured(
              "inventory.brands.view",
              <InventoryPage resource="brands" />,
            )}
          />
          <Route
            path="/inventory/warehouses"
            element={secured(
              "inventory.warehouses.view",
              <InventoryPage resource="warehouses" />,
            )}
          />
          <Route
            path="/inventory/stock"
            element={secured(
              "inventory.stock.view",
              <InventoryPage resource="stock" />,
            )}
          />
          <Route
            path="/inventory/movements"
            element={secured(
              "inventory.movements.view",
              <InventoryPage resource="movements" />,
            )}
          />
          <Route
            path="/pos/sales"
            element={secured("pos.sales.view", <PosPage mode="sales" />)}
          />
          <Route
            path="/attendance"
            element={secured(undefined, <AttendanceShell />)}
          >
            <Route index element={<Navigate to="devices" replace />} />
            <Route
              path="devices"
              element={secured("attendance.devices.view", <DevicesPage />)}
            />
            <Route
              path="users"
              element={secured("attendance.users.view", <DeviceUsersPage />)}
            />
            <Route
              path="events"
              element={secured("attendance.events.view", <EventsPage />)}
            />
          </Route>
        </Route>
        <Route
          path="/pos/checkout"
          element={secured("pos.checkout.view", <HealthPosPage />, true)}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster dir={direction} richColors position="top-center" closeButton />
    </DirectionProvider>
  );
}
