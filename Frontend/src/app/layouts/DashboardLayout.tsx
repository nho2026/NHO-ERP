import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  BadgeDollarSign,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  ChevronDown,
  ChevronsUpDown,
  CircleHelp,
  Clock3,
  ContactRound,
  FileText,
  Globe2,
  HeartPulse,
  LayoutDashboard,
  Landmark,
  BookOpenText,
  ChartNoAxesCombined,
  ReceiptText,
  CreditCard,
  LogOut,
  Menu,
  Moon,
  Radio,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  UserRound,
  UsersRound,
  X,
  WalletCards,
  ArrowRightLeft,
  ChartLine,
  HandCoins,
  Package,
  Barcode,
  Tags,
  Warehouse,
  Boxes,
  ArrowLeftRight,
  ShoppingCart,
  ListTodo,
  Star,
  Sun,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "@/assets/icons/logo.png";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { getCurrentUser, logoutUser } from "@/features/auth/api/auth.api";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { useTheme } from "@/shared/hooks/useTheme";
import { hasPermission, isCashier as userIsCashier } from "@/features/auth/access";

const primaryNavigation = [
  { to: "/dashboard", label: "navigation.dashboard", icon: LayoutDashboard },
];
const taskNavigation = [
  { to: "/tasks", label: "tasks.list", icon: ListTodo },
  {
    to: "/tasks/reports",
    label: "tasks.report.title",
    icon: ChartNoAxesCombined,
  },
];
const attendanceNavigation = [
  { to: "/attendance/devices", label: "attendancePage.devices", icon: Radio },
  { to: "/attendance/users", label: "attendancePage.users", icon: UsersRound },
  {
    to: "/attendance/events",
    label: "attendancePage.events",
    icon: CalendarClock,
  },
];
const hrNavigation = [
  { to: "/employees", label: "navigation.employees", icon: UsersRound },
  { to: "/positions", label: "navigation.positions", icon: BriefcaseBusiness },
  { to: "/contracts", label: "navigation.contracts", icon: FileText },
  { to: "/salaries", label: "navigation.salaries", icon: BadgeDollarSign },
  { to: "/hr-attendance", label: "navigation.hrAttendance", icon: UserCheck },
  { to: "/payrolls", label: "navigation.payrolls", icon: ContactRound },
  {
    to: "/salary-advances",
    label: "navigation.salaryAdvances",
    icon: BadgeDollarSign,
  },
];
const healthcareNavigation = [
  { to: "/departments", label: "navigation.departments", icon: Building2 },
  { to: "/health-staff", label: "navigation.healthStaff", icon: Stethoscope },
  { to: "/appointments", label: "navigation.appointments", icon: CalendarPlus },
  { to: "/feedback", label: "feedback.title", icon: Star },
];
const accountingNavigation = [
  {
    to: "/accounting/accounts",
    label: "navigation.chartOfAccounts",
    icon: Landmark,
  },
  {
    to: "/accounting/journals",
    label: "navigation.journalEntries",
    icon: BookOpenText,
  },
  {
    to: "/accounting/customers",
    label: "navigation.customers",
    icon: UsersRound,
  },
  {
    to: "/accounting/invoices",
    label: "navigation.invoices",
    icon: ReceiptText,
  },
  {
    to: "/accounting/payments",
    label: "navigation.payments",
    icon: CreditCard,
  },
  {
    to: "/accounting/service-advances",
    label: "navigation.serviceAdvances",
    icon: BadgeDollarSign,
  },
  {
    to: "/accounting/reports",
    label: "navigation.financialReports",
    icon: ChartNoAxesCombined,
  },
];
const financeNavigation = [
  { to: "/finance/budgets", label: "navigation.budgets", icon: WalletCards },
  {
    to: "/finance/cash-flow",
    label: "navigation.cashFlow",
    icon: ArrowRightLeft,
  },
  { to: "/finance/forecasts", label: "navigation.forecasts", icon: ChartLine },
  {
    to: "/finance/analysis",
    label: "navigation.financialAnalysis",
    icon: ChartNoAxesCombined,
  },
  { to: "/finance/funding", label: "navigation.funding", icon: HandCoins },
];
const inventoryNavigation = [
  { to: "/inventory/brands", label: "navigation.productBrands", icon: Tags },
  { to: "/inventory/products", label: "navigation.products", icon: Package },
  { to: "/inventory/barcodes", label: "navigation.barcodes", icon: Barcode },
  {
    to: "/inventory/categories",
    label: "navigation.productCategories",
    icon: Tags,
  },
  {
    to: "/inventory/warehouses",
    label: "navigation.warehouses",
    icon: Warehouse,
  },
  { to: "/inventory/stock", label: "navigation.stock", icon: Boxes },
  {
    to: "/inventory/movements",
    label: "navigation.stockMovements",
    icon: ArrowLeftRight,
  },
];
const posNavigation = [
  { to: "/pos/checkout", label: "navigation.newSale", icon: ShoppingCart },
  { to: "/pos/sales", label: "navigation.salesHistory", icon: ReceiptText },
];
const accessNavigation = [
  { to: "/users", label: "navigation.users", icon: UsersRound },
  { to: "/roles", label: "navigation.roles", icon: ShieldCheck },
];

function LiveDateTime({ locale }: { locale: string }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="hidden h-9 items-center gap-2 rounded-lg bg-muted/60 px-3 lg:flex">
      <Clock3 className="size-3.5 text-primary" />
      <span className="text-xs font-semibold">
        {new Intl.DateTimeFormat(locale, {
          hour: "2-digit",
          minute: "2-digit",
        }).format(now)}
      </span>
      <i className="h-3.5 w-px bg-border" />
      <span className="text-[11px] text-muted-foreground">
        {new Intl.DateTimeFormat(locale, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(now)}
      </span>
    </div>
  );
}

export default function DashboardLayout() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("nho-sidebar-collapsed") === "true",
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      return JSON.parse(sessionStorage.getItem("nho-current-user") ?? "null");
    } catch {
      return null;
    }
  });
  const [loggingOut, setLoggingOut] = useState(false);
  const [navigationSearch, setNavigationSearch] = useState("");
  const navigationSearchRef = useRef<HTMLInputElement>(null);
  const [hrExpanded, setHrExpanded] = useState(true);
  const [attendanceExpanded, setAttendanceExpanded] = useState(true);
  const [healthcareExpanded, setHealthcareExpanded] = useState(true);
  const [accountingExpanded, setAccountingExpanded] = useState(true);
  const [financeExpanded, setFinanceExpanded] = useState(true);
  const [inventoryExpanded, setInventoryExpanded] = useState(true);
  const [posExpanded, setPosExpanded] = useState(true);
  const [tasksExpanded, setTasksExpanded] = useState(true);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const focusNavigationSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCollapsed(false);
        navigationSearchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusNavigationSearch);
    return () => window.removeEventListener("keydown", focusNavigationSearch);
  }, []);
  useEffect(() => {
    void getCurrentUser()
      .then((current) => {
        setUser(current);
        sessionStorage.setItem("nho-current-user", JSON.stringify(current));
      })
      .catch(() => {
        if (!sessionStorage.getItem("nho-current-user"))
          navigate("/login", { replace: true });
      });
  }, [navigate]);
  const logout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
    } finally {
      sessionStorage.removeItem("nho-current-user");
      navigate("/login", { replace: true });
      setLoggingOut(false);
    }
  };
  const toggle = () =>
    setCollapsed((value) => {
      localStorage.setItem("nho-sidebar-collapsed", String(!value));
      return !value;
    });
  const initials =
    user?.name
      ?.split(" ")
      .map((v) => v[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "QA";
  const normalizedNavigationSearch = navigationSearch.trim().toLocaleLowerCase(
    i18n.resolvedLanguage,
  );
  const cashier = userIsCashier(user);
  const permissionForPath = (path: string) => {
    const keys: Record<string, string> = {
      "/dashboard": "dashboard.view", "/tasks": "tasks.list.view", "/tasks/reports": "tasks.reports.view",
      "/attendance/devices": "attendance.devices.view", "/attendance/users": "attendance.users.view", "/attendance/events": "attendance.events.view",
      "/employees": "hr.employees.view", "/positions": "hr.positions.view", "/contracts": "hr.contracts.view", "/salaries": "hr.salaries.view", "/hr-attendance": "hr.attendance.view", "/payrolls": "hr.payrolls.view", "/salary-advances": "hr.advances.view",
      "/departments": "healthcare.departments.view", "/health-staff": "healthcare.staff.view", "/appointments": "healthcare.appointments.view", "/feedback": "healthcare.feedback.view",
      "/accounting/accounts": "accounting.accounts.view", "/accounting/journals": "accounting.journals.view", "/accounting/customers": "accounting.customers.view", "/accounting/invoices": "accounting.invoices.view", "/accounting/payments": "accounting.payments.view", "/accounting/service-advances": "accounting.service_advances.view", "/accounting/reports": "accounting.reports.view",
      "/finance/budgets": "finance.budgets.view", "/finance/cash-flow": "finance.cash-flow.view", "/finance/forecasts": "finance.forecasts.view", "/finance/analysis": "finance.analysis.view", "/finance/funding": "finance.funding.view",
      "/inventory/brands": "inventory.brands.view", "/inventory/products": "inventory.products.view", "/inventory/barcodes": "inventory.barcodes.view", "/inventory/categories": "inventory.categories.view", "/inventory/warehouses": "inventory.warehouses.view", "/inventory/stock": "inventory.stock.view", "/inventory/movements": "inventory.movements.view",
      "/pos/checkout": "pos.checkout.view", "/pos/sales": "pos.sales.view", "/users": "users.view", "/roles": "roles.view",
    };
    return keys[path] ?? "dashboard.view";
  };
  const navItems = (items: typeof primaryNavigation) =>
    items
      .filter(
        ({ to, label }) =>
          !cashier &&
          hasPermission(user, permissionForPath(to)) &&
          (!normalizedNavigationSearch ||
            t(label)
              .toLocaleLowerCase(i18n.resolvedLanguage)
              .includes(normalizedNavigationSearch)),
      )
      .map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        end
        title={collapsed ? t(label) : undefined}
        onClick={() => setOpen(false)}
        className={({ isActive }) =>
          `group flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium outline-none transition-colors focus-visible:bg-primary focus-visible:text-primary-foreground ${collapsed ? "lg:justify-center lg:px-0" : ""} ${isActive ? "bg-primary font-semibold text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-primary/7 hover:text-primary"}`
        }
      >
        <Icon className="size-5 shrink-0 stroke-[1.7]" />
        <span className={collapsed ? "lg:hidden" : ""}>{t(label)}</span>
      </NavLink>
      ));
  const sectionButtonClass = (items: typeof primaryNavigation) =>
    `flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium outline-none transition-colors focus-visible:bg-primary focus-visible:text-primary-foreground ${items.some((item) => location.pathname === item.to) ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-primary/7 hover:text-primary"}`;

  return (
    <div className="min-h-svh w-full overflow-x-clip bg-background">
      <aside
        className={`fixed inset-y-0 inset-s-0 z-50 flex w-72 flex-col border-e border-primary/15 bg-card px-4 shadow-[4px_0_24px_-18px_color-mix(in_srgb,var(--primary)_55%,transparent)] transition-[width,transform] duration-300 lg:translate-x-0! ${collapsed ? "lg:w-17 lg:px-3" : ""} ${open ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"}`}
      >
        <div
          className={`flex h-20 items-center gap-3 border-b px-1 ${collapsed ? "lg:justify-center" : ""}`}
        >
          <span
            className={`grid size-9 shrink-0 place-items-center overflow-hidden rounded-[10px] border shadow-sm ${collapsed ? "lg:border-primary/20 lg:bg-primary lg:text-primary-foreground" : "bg-white"}`}
          >
            {collapsed ? (
              <>
                <HeartPulse
                  className="hidden size-5 lg:block"
                  aria-label="NHO"
                />
                <img
                  className="size-8 object-contain lg:hidden"
                  src={logo}
                  alt="NHO"
                />
              </>
            ) : (
              <img className="size-8 object-contain" src={logo} alt="NHO" />
            )}
          </span>
          <div className={`min-w-0 flex-1 ${collapsed ? "lg:hidden" : ""}`}>
            <strong className="block truncate text-[13px] leading-4">
              NHO Workspace
            </strong>
            <span className="block truncate text-[10px] text-muted-foreground">
              Management system
            </span>
          </div>
          <button
            className={`text-muted-foreground hover:text-foreground ${collapsed ? "lg:hidden" : ""}`}
            onClick={toggle}
          >
            <ChevronsUpDown className="size-3.5 rotate-90" />
          </button>
          <Button
            className="ms-auto lg:hidden"
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className={cashier ? "hidden" : "py-3"}>
          <label className={`relative block ${collapsed ? "lg:hidden" : ""}`}>
            <Search className="absolute inset-s-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={navigationSearchRef}
              className="h-10 w-full rounded-xl border bg-slate-50 ps-9 pe-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:bg-slate-950"
              placeholder={t("navigation.search")}
              value={navigationSearch}
              onChange={(event) => setNavigationSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setNavigationSearch("");
                  event.currentTarget.blur();
                }
              }}
            />
            <kbd className="absolute inset-e-2 top-1/2 -translate-y-1/2 rounded border bg-white px-1 text-[9px] text-muted-foreground dark:bg-slate-900">
              ⌘K
            </kbd>
          </label>
          {collapsed && (
            <button
              className="hidden size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted lg:grid"
              title={t("navigation.search")}
            >
              <Search className="size-4.25" />
            </button>
          )}
        </div>
        <nav
          dir={i18n.resolvedLanguage?.startsWith("en") ? "ltr" : "rtl"}
          className="scrollbar-hidden flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain"
        >
          {cashier && (
            <div className="space-y-2 pt-3">
              <NavLink
                to="/pos/checkout"
                className={({ isActive }) =>
                  `flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/30 ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-primary/7 hover:text-primary"}`
                }
              >
                <ShoppingCart className="size-5" />
                <span>{t("navigation.newSale")}</span>
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/30 ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-primary/7 hover:text-primary"}`
                }
              >
                <UserRound className="size-5" />
                <span>{t("navigation.profile")}</span>
              </NavLink>
            </div>
          )}
          <div className={cashier ? "hidden" : "contents"}>
          <div className="space-y-1">{navItems(primaryNavigation)}</div>
          <div className={`mt-2 space-y-1 ${taskNavigation.some(({ to }) => hasPermission(user, permissionForPath(to))) ? "" : "hidden"}`}>
            {collapsed ? (
              <NavLink
                to="/tasks"
                title={t("tasks.title")}
                className={({ isActive }) =>
                  `hidden h-9 items-center justify-center rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/35 lg:flex ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-primary/7 hover:text-primary"}`
                }
              >
                <ListTodo className="size-4.25" />
              </NavLink>
            ) : (
              <>
                <button
                  className={sectionButtonClass(taskNavigation)}
                  onClick={() => setTasksExpanded((value) => !value)}
                >
                  <ListTodo className="size-4.25 shrink-0" />
                  <span className="flex-1 text-start">{t("tasks.title")}</span>
                  <ChevronDown
                    className={`size-3.5 transition-transform ${tasksExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                {(tasksExpanded || Boolean(normalizedNavigationSearch)) && (
                  <div className="ms-4 space-y-1 border-s ps-2">
                    {navItems(taskNavigation)}
                  </div>
                )}
              </>
            )}
          </div>
          <div className={`mt-2 space-y-1 ${attendanceNavigation.some(({ to }) => hasPermission(user, permissionForPath(to))) ? "" : "hidden"}`}>
            {collapsed ? (
              <NavLink
                to="/attendance/devices"
                title={t("navigation.attendance")}
                className={({ isActive }) =>
                  `hidden h-9 items-center justify-center rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/35 lg:flex ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-primary/7 hover:text-primary"}`
                }
              >
                <CalendarCheck className="size-4.25" />
              </NavLink>
            ) : (
              <>
                <button
                  className={sectionButtonClass(attendanceNavigation)}
                  onClick={() => setAttendanceExpanded((value) => !value)}
                >
                  <CalendarCheck className="size-4.25 shrink-0" />
                  <span className="flex-1 text-start">
                    {t("navigation.attendance")}
                  </span>
                  <ChevronDown
                    className={`size-3.5 transition-transform ${attendanceExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                {(attendanceExpanded || Boolean(normalizedNavigationSearch)) && (
                  <div className="ms-4 space-y-1 border-s ps-2">
                    {navItems(attendanceNavigation)}
                  </div>
                )}
              </>
            )}
          </div>
          <div className={`mt-2 space-y-1 ${inventoryNavigation.some(({ to }) => hasPermission(user, permissionForPath(to))) ? "" : "hidden"}`}>
            {collapsed ? (
              <NavLink
                to="/inventory/products"
                title={t("navigation.inventory")}
                className="hidden h-9 items-center justify-center rounded-lg lg:flex"
              >
                <Package className="size-4.25" />
              </NavLink>
            ) : (
              <>
                <button
                  className={sectionButtonClass(inventoryNavigation)}
                  onClick={() => setInventoryExpanded((v) => !v)}
                >
                  <Package className="size-4.25" />
                  <span className="flex-1 text-start">
                    {t("navigation.inventory")}
                  </span>
                  <ChevronDown
                    className={`size-3.5 ${inventoryExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                {(inventoryExpanded || Boolean(normalizedNavigationSearch)) && (
                  <div className="ms-4 space-y-1 border-s ps-2">
                    {navItems(inventoryNavigation)}
                  </div>
                )}
              </>
            )}
          </div>
          <div className={`mt-2 space-y-1 ${posNavigation.some(({ to }) => hasPermission(user, permissionForPath(to))) ? "" : "hidden"}`}>
            {collapsed ? (
              <NavLink
                to="/pos/checkout"
                title={t("navigation.pos")}
                className="hidden h-9 items-center justify-center rounded-lg lg:flex"
              >
                <ShoppingCart className="size-4.25" />
              </NavLink>
            ) : (
              <>
                <button
                  className={sectionButtonClass(posNavigation)}
                  onClick={() => setPosExpanded((v) => !v)}
                >
                  <ShoppingCart className="size-4.25" />
                  <span className="flex-1 text-start">
                    {t("navigation.pos")}
                  </span>
                  <ChevronDown
                    className={`size-3.5 ${posExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                {(posExpanded || Boolean(normalizedNavigationSearch)) && (
                  <div className="ms-4 space-y-1 border-s ps-2">
                    {navItems(posNavigation)}
                  </div>
                )}
              </>
            )}
          </div>
          <div className={`mt-2 space-y-1 ${healthcareNavigation.some(({ to }) => hasPermission(user, permissionForPath(to))) ? "" : "hidden"}`}>
            {collapsed ? (
              <NavLink
                to="/departments"
                title={t("navigation.healthcare")}
                className={({ isActive }) =>
                  `hidden h-9 items-center justify-center rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/35 lg:flex ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-primary/7 hover:text-primary"}`
                }
              >
                <Stethoscope className="size-4.25" />
              </NavLink>
            ) : (
              <>
                <button
                  className={sectionButtonClass(healthcareNavigation)}
                  onClick={() => setHealthcareExpanded((value) => !value)}
                >
                  <Stethoscope className="size-4.25 shrink-0" />
                  <span className="flex-1 text-start">
                    {t("navigation.healthcare")}
                  </span>
                  <ChevronDown
                    className={`size-3.5 transition-transform ${healthcareExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                {(healthcareExpanded || Boolean(normalizedNavigationSearch)) && (
                  <div className="ms-4 space-y-1 border-s ps-2">
                    {navItems(healthcareNavigation)}
                  </div>
                )}
              </>
            )}
          </div>
          <div className={`mt-2 space-y-1 ${hrNavigation.some(({ to }) => hasPermission(user, permissionForPath(to))) ? "" : "hidden"}`}>
            {collapsed ? (
              <NavLink
                to="/employees"
                title={t("navigation.humanResources")}
                className={({ isActive }) =>
                  `hidden h-9 items-center justify-center rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/35 lg:flex ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-primary/7 hover:text-primary"}`
                }
              >
                <BriefcaseBusiness className="size-4.25" />
              </NavLink>
            ) : (
              <>
                <button
                  className={sectionButtonClass(hrNavigation)}
                  onClick={() => setHrExpanded((value) => !value)}
                >
                  <BriefcaseBusiness className="size-4.25 shrink-0" />
                  <span className="flex-1 text-start">
                    {t("navigation.humanResources")}
                  </span>
                  <ChevronDown
                    className={`size-3.5 transition-transform ${hrExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                {(hrExpanded || Boolean(normalizedNavigationSearch)) && (
                  <div className="ms-4 space-y-1 border-s ps-2">
                    {navItems(hrNavigation)}
                  </div>
                )}
              </>
            )}
          </div>
          <div className={`mt-2 space-y-1 ${accountingNavigation.some(({ to }) => hasPermission(user, permissionForPath(to))) ? "" : "hidden"}`}>
            {collapsed ? (
              <NavLink
                to="/accounting/accounts"
                title={t("navigation.accounting")}
                className={({ isActive }) =>
                  `hidden h-9 items-center justify-center rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/35 lg:flex ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-primary/7 hover:text-primary"}`
                }
              >
                <Landmark className="size-4.25" />
              </NavLink>
            ) : (
              <>
                <button
                  className={sectionButtonClass(accountingNavigation)}
                  onClick={() => setAccountingExpanded((value) => !value)}
                >
                  <Landmark className="size-4.25 shrink-0" />
                  <span className="flex-1 text-start">
                    {t("navigation.accounting")}
                  </span>
                  <ChevronDown
                    className={`size-3.5 transition-transform ${accountingExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                {(accountingExpanded || Boolean(normalizedNavigationSearch)) && (
                  <div className="ms-4 space-y-1 border-s ps-2">
                    {navItems(accountingNavigation)}
                  </div>
                )}
              </>
            )}
          </div>
          <div className={`mt-2 space-y-1 ${financeNavigation.some(({ to }) => hasPermission(user, permissionForPath(to))) ? "" : "hidden"}`}>
            {collapsed ? (
              <NavLink
                to="/finance/budgets"
                title={t("navigation.finance")}
                className={({ isActive }) =>
                  `hidden h-9 items-center justify-center rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/35 lg:flex ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-primary/7 hover:text-primary"}`
                }
              >
                <WalletCards className="size-4.25" />
              </NavLink>
            ) : (
              <>
                <button
                  className={sectionButtonClass(financeNavigation)}
                  onClick={() => setFinanceExpanded((value) => !value)}
                >
                  <WalletCards className="size-4.25 shrink-0" />
                  <span className="flex-1 text-start">
                    {t("navigation.finance")}
                  </span>
                  <ChevronDown
                    className={`size-3.5 transition-transform ${financeExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                {(financeExpanded || Boolean(normalizedNavigationSearch)) && (
                  <div className="ms-4 space-y-1 border-s ps-2">
                    {navItems(financeNavigation)}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="my-3 border-t" />
          <div
            className={`mb-1 flex h-6 items-center px-2 text-[10px] font-medium text-muted-foreground ${collapsed ? "lg:hidden" : ""}`}
          >
            {t("navigation.accessControl")}
          </div>
          <div className="space-y-1">{navItems(accessNavigation)}</div>
          <div className="mt-auto space-y-1 pb-3">
            {[
              [Settings, "navigation.settings"],
              [CircleHelp, "navigation.help"],
            ].map(([Icon, label]) => (
              <button
                key={String(label)}
                className={`flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-primary/7 hover:text-primary ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
              >
                <Icon className="size-4.25 stroke-[1.7]" />
                <span className={collapsed ? "lg:hidden" : ""}>
                  {t(String(label))}
                </span>
              </button>
            ))}
          </div>
          </div>
        </nav>
        <div className="border-t py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex w-full items-center gap-2.5 rounded-lg p-1.5 text-start transition hover:bg-muted ${collapsed ? "lg:justify-center" : ""}`}
              >
                <Avatar className="size-8 shrink-0 border">
                  <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={`min-w-0 flex-1 ${collapsed ? "lg:hidden" : ""}`}
                >
                  <strong className="block truncate text-[11px]">
                    {user?.name ?? "Qasem Admin"}
                  </strong>
                  <small className="block truncate text-[9px] text-muted-foreground">
                    @{user?.username ?? "admin"}
                  </small>
                </span>
                <ChevronDown
                  className={`size-3 text-muted-foreground ${collapsed ? "lg:hidden" : ""}`}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side={collapsed ? "right" : "top"}
              align="start"
              sideOffset={8}
              className="z-10000 w-56 rounded-xl p-2"
            >
              <DropdownMenuLabel className="font-normal">
                <p className="text-xs font-semibold">
                  {user?.name ?? "Qasem Admin"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  @{user?.username ?? "admin"}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate("/profile")}>
                <UserRound />
                {t("navigation.profile")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                disabled={loggingOut}
                onSelect={() => void logout()}
              >
                <LogOut />
                {loggingOut
                  ? t("navigation.loggingOut")
                  : t("navigation.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      <div
        className={`min-w-0 transition-[padding] duration-300 ${collapsed ? "lg:ps-17" : "lg:ps-72"}`}
      >
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-primary/15 bg-card/95 px-4 shadow-[0_4px_18px_-16px_color-mix(in_srgb,var(--primary)_60%,transparent)] backdrop-blur-xl md:px-7">
          <Button
            className="border lg:hidden"
            variant="outline"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <button
            className="hidden text-xs font-medium text-muted-foreground hover:text-foreground lg:block"
            onClick={toggle}
          >
            {collapsed ? t("expandSidebar") : t("collapseSidebar")}
          </button>
          <div className="ms-auto">
            <LiveDateTime locale={i18n.resolvedLanguage ?? "en"} />
          </div>
          <Select
            value={i18n.resolvedLanguage?.split("-")[0] ?? "en"}
            onValueChange={(v) => void i18n.changeLanguage(v)}
          >
            <SelectTrigger className="hidden h-9 w-28 rounded-lg sm:flex">
              <Globe2 className="size-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-10000">
              <SelectItem value="en">{t("language.english")}</SelectItem>
              <SelectItem value="ar">{t("language.arabic")}</SelectItem>
              <SelectItem value="ku">{t("language.kurdish")}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="size-9 rounded-lg"
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            title={theme === "dark" ? "Use light mode" : "Use dark mode"}
            aria-label={theme === "dark" ? "Use light mode" : "Use dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>
          <Button className="size-9 rounded-lg" variant="outline" size="icon">
            <Bell className="size-4" />
          </Button>
        </header>
        <main className="min-w-0 overflow-x-hidden p-4 md:p-7">
          <Outlet />
        </main>
      </div>
      {open && (
        <button
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
