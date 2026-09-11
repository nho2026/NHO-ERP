import { AlertSounds } from "@/shared/components/feedback/AlertSounds";
import TodayPatientsPage from "@/features/healthcare/pages/TodayPatientsPage";
import PatientProductsReportPage from "@/features/inventory/pages/PatientProductsReportPage";
import ItemReductionPage from "@/features/inventory/pages/ItemReductionPage";
import SurgeryBypassPage from "@/features/inventory/pages/SurgeryBypassPage";
import IcuPage from "@/features/inventory/pages/IcuPage";
import ThresholdPage from "@/features/inventory/pages/ThresholdPage";
import DirectoryPage from "@/features/inventory/pages/DirectoryPage";
import RetailersPage from "@/features/inventory/pages/RetailersPage";
import ExpireSoonPage from "@/features/inventory/pages/ExpireSoonPage";
import SpecialPricesPage from "@/features/inventory/pages/SpecialPricesPage";
import StoragePage from "@/features/inventory/pages/StoragePage";
import TransferProductPage from "@/features/inventory/pages/TransferProductPage";
import AddSpecialProductPage from "@/features/inventory/pages/AddSpecialProductPage";
import OrderHistoryPage from "@/features/inventory/pages/OrderHistoryPage";
import OrderPage from "@/features/inventory/pages/OrderPage";
import BuyDebtsPage from "@/features/inventory/pages/BuyDebtsPage";
import BuyProductPage from "@/features/inventory/pages/BuyProductPage";
import WarehouseDashboardPage from "@/features/inventory/pages/WarehouseDashboardPage";
import { warehousePages } from "@/features/inventory/warehouse-pages";
import WarehouseModulePage from "@/features/inventory/pages/WarehouseModulePage";

import DepartmentOrdersPage from "@/features/inventory/pages/DepartmentOrdersPage";
import SettingsPage from "@/features/settings/SettingsPage";
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
import TargetsPage from "@/features/targets/pages/TargetsPage";
import CrmPage from "@/features/crm/pages/CrmPage";
import PatientPrescriptionsPage from "@/features/crm/pages/PatientPrescriptionsPage";
import PatientProfilePage from "@/features/crm/pages/PatientProfilePage";
import CrmFormsPage from "@/features/crm/pages/CrmFormsPage";
import LeadProgressPage from "@/features/crm/pages/LeadProgressPage";
import LeadDetailPage from "@/features/crm/pages/LeadDetailPage";
import WhatsappPage from "@/features/crm/pages/WhatsappPage";
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
            element={secured(undefined, null)}
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
          <Route path="/settings" element={<SettingsPage />} />
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
            path="/crm/whatsapp"
            element={secured("employees.view", <WhatsappPage />)}
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
            path="/crm/patients/:id/medications"
            element={secured("employees.view", <PatientPrescriptionsPage />)}
          />
          <Route
            path="/crm/patients/:id"
            element={secured("employees.view", <PatientProfilePage />)}
          />
          <Route
            path="/crm/referrals"
            element={secured(
              "employees.view",
              <CrmPage resource="referrals" />,
            )}
          />
          <Route
            path="/crm/forms"
            element={secured("employees.view", <CrmFormsPage />)}
          />
          <Route
            path="/crm/today-patients"
            element={secured(
              "healthcare.appointments.view",
              <TodayPatientsPage />,
            )}
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
            path="/warehouses/buy/product"
            element={secured("inventory.warehouses.view", <BuyProductPage />)}
          />
          <Route
            path="/warehouses/buy/debts"
            element={secured("inventory.warehouses.view", <BuyDebtsPage />)}
          />
          <Route
            path="/warehouses/buy/order"
            element={secured("inventory.warehouses.view", <OrderPage />)}
          />
          <Route
            path="/warehouses/buy/order-history"
            element={secured("inventory.warehouses.view", <OrderHistoryPage />)}
          />
          <Route
            path="/warehouses/buy/department-orders"
            element={secured(
              "inventory.warehouses.view",
              <DepartmentOrdersPage />,
            )}
          />
          <Route
            path="/warehouses/product/special"
            element={secured(
              "inventory.products.view",
              <AddSpecialProductPage />,
            )}
          />
          <Route
            path="/warehouses/product/transfer"
            element={secured(
              "inventory.products.view",
              <TransferProductPage />,
            )}
          />
          <Route
            path="/warehouses/storage/special-price"
            element={secured("inventory.stock.view", <SpecialPricesPage />)}
          />
          <Route
            path="/warehouses/storage/expire-soon"
            element={secured("inventory.stock.view", <ExpireSoonPage />)}
          />
          <Route
            path="/warehouses/storage/threshold"
            element={secured("inventory.stock.view", <ThresholdPage />)}
          />
          <Route
            path="/warehouses"
            element={secured(
              "inventory.warehouses.view",
              <WarehouseDashboardPage />,
            )}
          />
          {warehousePages.map((page) => (
            <Route
              key={page.path}
              path={page.path}
              element={secured(
                "inventory.warehouses.view",
                page.path === "/warehouses/cases/surgery-bypass" ? (
                  <SurgeryBypassPage />
                ) : page.path === "/warehouses/cases/icu" ? (
                  <IcuPage key="icu" />
                ) : page.path === "/warehouses/cases/picu" ? (
                  <IcuPage key="picu" unit="picu" />
                ) : page.path === "/warehouses/cases/cardiac-surgery" ? (
                  <IcuPage key="cardiac-surgery" unit="cardiac-surgery" />
                ) : page.path === "/warehouses/cases/cardiology" ? (
                  <IcuPage key="cardiology" unit="cardiology" />
                ) : page.path === "/warehouses/cases/cardiac-sw" ? (
                  <IcuPage key="cardiac-sw" unit="cardiac-sw" />
                ) : page.path === "/warehouses/retailers" ? (
                  <RetailersPage />
                ) : page.path === "/warehouses/production-companies" ? (
                  <DirectoryPage
                    key="companies"
                    resource="production-companies"
                  />
                ) : page.path === "/warehouses/customers" ? (
                  <DirectoryPage key="customers" resource="customers" />
                ) : page.section === "utilities" ? (
                  <ItemReductionPage />
                ) : page.path === "/warehouses/reports/products-per-patient" ? (
                  <PatientProductsReportPage />
                ) : (
                  <WarehouseModulePage page={page} />
                ),
              )}
            />
          ))}
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
            element={secured("inventory.stock.view", <StoragePage />)}
          />
          <Route
            path="/inventory/movements"
            element={<Navigate to="/inventory/stock" replace />}
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
      <AlertSounds />
      <Toaster dir={direction} richColors position="top-center" closeButton />
    </DirectionProvider>
  );
}
