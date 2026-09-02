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
  CircleHelp,
  Clock3,
  ContactRound,
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
  PanelLeftClose,
  PanelLeftOpen,
  Barcode,
  Tags,
  Warehouse,
  Video,
  Boxes,
  ArrowLeftRight,
  ShoppingCart,
  ListTodo,
  Lightbulb,
  TriangleAlert,
  Star,
  Sun,
  Goal,
  ScrollText,
  FileText,
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
import { WindowControls } from "@/shared/components/WindowControls";
import {
  hasPermission,
  isCashier as userIsCashier,
} from "@/features/auth/access";
import {
  notificationsApi,
  type NotificationItem,
} from "@/features/notifications/api/notifications.api";

function notificationRoute(notification: NotificationItem) {
  if (notification.task) return `/tasks/${notification.task.id}`;
  if (notification.meeting) return "/meetings";
  if (notification.warning) return "/hr/warnings";
  return undefined;
}

function notificationLabel(
  type: NotificationItem["type"],
  t: (key: string) => string,
) {
  if (type === "warning") return t("employeePortal.warnings");
  if (type === "meeting_created") return t("notificationCenter.meetingCreated");
  if (type === "task_review_requested")
    return t("notificationCenter.taskReviewRequested");
  if (type === "task_status_updated")
    return t("notificationCenter.taskStatusUpdated");
  return t("notificationCenter.taskAssigned");
}

const primaryNavigation = [
  { to: "/dashboard", label: "navigation.dashboard", icon: LayoutDashboard },
  { to: "/meetings", label: "navigation.liveMeetings", icon: Video },
  { to: "/targets", label: "navigation.targets", icon: Goal },
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
  { to: "/salaries", label: "navigation.salaries", icon: BadgeDollarSign },
  { to: "/hr-attendance", label: "navigation.hrAttendance", icon: UserCheck },
  { to: "/payrolls", label: "navigation.payrolls", icon: ContactRound },
  {
    to: "/salary-advances",
    label: "navigation.salaryAdvances",
    icon: BadgeDollarSign,
  },
  {
    to: "/hr/reports",
    label: "navigation.hrReports",
    icon: ChartNoAxesCombined,
  },
  { to: "/hr/warnings", label: "hrWarnings.title", icon: TriangleAlert },
];
const healthcareNavigation = [
  { to: "/departments", label: "navigation.departments", icon: Building2 },
  { to: "/health-staff", label: "navigation.healthStaff", icon: Stethoscope },
  { to: "/feedback", label: "feedback.title", icon: Star },
];
const crmNavigation = [
  { to: "/crm/leads", label: "navigation.crmLeads", icon: ContactRound },
  {
    to: "/crm/leads/progress",
    label: "navigation.leadProgressOverview",
    icon: ChartLine,
  },
  { to: "/crm/patients", label: "navigation.crmPatients", icon: UsersRound },
  { to: "/crm/forms", label: "navigation.crmForms", icon: FileText },
  {
    to: "/crm/appointments",
    label: "navigation.doctorAppointments",
    icon: CalendarPlus,
  },
  {
    to: "/crm/surgery-appointments",
    label: "navigation.surgeryAppointments",
    icon: CalendarClock,
  },
  { to: "/crm/payments", label: "navigation.crmPayments", icon: CreditCard },
  { to: "/crm/surgeries", label: "navigation.surgeries", icon: HeartPulse },
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
  { to: "/system-logs", label: "navigation.systemLogs", icon: ScrollText },
];

function LiveDateTime({ locale }: { locale: string }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="hidden h-10 items-center overflow-hidden rounded-xl border border-primary/15 bg-gradient-to-r from-primary/8 via-card to-card shadow-sm lg:flex">
      <time
        className="flex h-full items-center gap-2 border-e border-primary/12 px-3"
        dateTime={now.toISOString()}
      >
        <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground shadow-sm">
          <Clock3 className="size-3.5" />
        </span>
        <span className="text-sm font-bold tabular-nums tracking-tight text-foreground">
          {new Intl.DateTimeFormat(locale, {
            hour: "2-digit",
            minute: "2-digit",
          }).format(now)}
        </span>
      </time>
      <time
        className="flex h-full items-center gap-2 px-3 text-muted-foreground"
        dateTime={now.toISOString().slice(0, 10)}
      >
        <CalendarCheck className="size-3.5 text-primary" />
        <span className="text-[11px] font-medium whitespace-nowrap">
          {new Intl.DateTimeFormat(locale, {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(now)}
        </span>
      </time>
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
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const knownNotificationIds = useRef<Set<string> | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [navigationSearch, setNavigationSearch] = useState("");
  const navigationSearchRef = useRef<HTMLInputElement>(null);
  const [hrExpanded, setHrExpanded] = useState(true);
  const [attendanceExpanded, setAttendanceExpanded] = useState(true);
  const [healthcareExpanded, setHealthcareExpanded] = useState(true);
  const [crmExpanded, setCrmExpanded] = useState(true);
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
  useEffect(() => {
    return window.electronWindow?.onNotificationClick((route) =>
      navigate(route),
    );
  }, [navigate]);
  useEffect(() => {
    let active = true;
    const loadNotifications = () =>
      notificationsApi
        .list()
        .then((result) => {
          if (!active) return;
          const previousIds = knownNotificationIds.current;
          if (previousIds) {
            result.items
              .filter(
                (notification) =>
                  !notification.readAt && !previousIds.has(notification.id),
              )
              .forEach((notification) => {
                window.electronWindow?.showNotification({
                  title:
                    notification.warning?.title ??
                    notification.meeting?.title ??
                    notification.task?.title ??
                    "NHO ERP",
                  body: notification.warning
                    ? notification.warning.message
                    : notificationLabel(notification.type, t),
                  route: notificationRoute(notification),
                });
              });
          }
          knownNotificationIds.current = new Set(
            result.items.map((notification) => notification.id),
          );
          setNotifications(result.items);
          setUnreadCount(result.unreadCount);
        })
        .catch(() => undefined);
    void loadNotifications();
    const timer = window.setInterval(loadNotifications, 30_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [t]);
  const openNotification = async (notification: NotificationItem) => {
    if (!notification.readAt) {
      setNotifications((items) =>
        items.map((item) =>
          item.id === notification.id
            ? { ...item, readAt: new Date().toISOString() }
            : item,
        ),
      );
      setUnreadCount((count) => Math.max(0, count - 1));
      await notificationsApi.markRead(notification.id).catch(() => undefined);
    }
    const route = notificationRoute(notification);
    if (route) navigate(route);
  };
  const markAllNotificationsRead = async () => {
    const readAt = new Date().toISOString();
    setNotifications((items) => items.map((item) => ({ ...item, readAt })));
    setUnreadCount(0);
    await notificationsApi.markAllRead().catch(() => undefined);
  };
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
  const pageTitle = (() => {
    const allItems = [
      ...primaryNavigation,
      ...taskNavigation,
      ...attendanceNavigation,
      ...hrNavigation,
      ...healthcareNavigation,
      ...crmNavigation,
      ...accountingNavigation,
      ...financeNavigation,
      ...inventoryNavigation,
      ...posNavigation,
      ...accessNavigation,
    ];
    const item = allItems.find(({ to }) => location.pathname === to);
    if (location.pathname === "/employee-portal")
      return t("employeePortal.title");
    if (location.pathname === "/profile") return t("navigation.profile");
    return item ? t(item.label) : "NHO Workspace";
  })();
  const normalizedNavigationSearch = navigationSearch
    .trim()
    .toLocaleLowerCase(i18n.resolvedLanguage);
  const cashier = userIsCashier(user);
  const permissionForPath = (path: string) => {
    const keys: Record<string, string | undefined> = {
      "/dashboard": "dashboard.view",
      "/meetings": undefined,
      "/targets": undefined,
      "/tasks": "tasks.list.view",
      "/tasks/reports": "tasks.reports.view",
      "/attendance/devices": "attendance.devices.view",
      "/attendance/users": "attendance.users.view",
      "/attendance/events": "attendance.events.view",
      "/employees": "hr.employees.view",
      "/positions": "hr.positions.view",
      "/salaries": "hr.salaries.view",
      "/hr-attendance": "hr.attendance.view",
      "/payrolls": "hr.payrolls.view",
      "/salary-advances": "hr.advances.view",
      "/hr/reports": "hr.employees.view",
      "/hr/warnings": "hr.employees.update",
      "/departments": "healthcare.departments.view",
      "/health-staff": "healthcare.staff.view",
      "/appointments": "healthcare.appointments.view",
      "/feedback": "healthcare.feedback.view",
      "/crm/leads": "employees.view",
      "/crm/leads/progress": "employees.view",
      "/crm/patients": "employees.view",
      "/crm/forms": "employees.view",
      "/crm/appointments": "healthcare.appointments.view",
      "/crm/surgery-appointments": "employees.view",
      "/crm/payments": "employees.view",
      "/crm/surgeries": "employees.view",
      "/accounting/accounts": "accounting.accounts.view",
      "/accounting/journals": "accounting.journals.view",
      "/accounting/customers": "accounting.customers.view",
      "/accounting/invoices": "accounting.invoices.view",
      "/accounting/payments": "accounting.payments.view",
      "/accounting/service-advances": "accounting.service_advances.view",
      "/accounting/reports": "accounting.reports.view",
      "/finance/budgets": "finance.budgets.view",
      "/finance/cash-flow": "finance.cash-flow.view",
      "/finance/forecasts": "finance.forecasts.view",
      "/finance/analysis": "finance.analysis.view",
      "/finance/funding": "finance.funding.view",
      "/inventory/brands": "inventory.brands.view",
      "/inventory/products": "inventory.products.view",
      "/inventory/barcodes": "inventory.barcodes.view",
      "/inventory/categories": "inventory.categories.view",
      "/inventory/warehouses": "inventory.warehouses.view",
      "/inventory/stock": "inventory.stock.view",
      "/inventory/movements": "inventory.movements.view",
      "/pos/checkout": "pos.checkout.view",
      "/pos/sales": "pos.sales.view",
      "/users": "users.view",
      "/roles": "roles.view",
      "/system-logs": "system.logs.view",
    };
    return keys[path];
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
            `group relative flex h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/25 ${collapsed ? "lg:justify-center lg:px-0" : ""} ${isActive ? "bg-primary/10 text-primary shadow-[inset_3px_0_0_var(--primary)] rtl:shadow-[inset_-3px_0_0_var(--primary)]" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`
          }
        >
          <Icon
            className={`size-[18px] shrink-0 stroke-[1.8] transition-transform group-hover:scale-105`}
          />
          <span className={collapsed ? "lg:hidden" : ""}>{t(label)}</span>
        </NavLink>
      ));
  const sectionButtonClass = (items: typeof primaryNavigation) =>
    `group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-[13px] font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/25 ${items.some((item) => location.pathname === item.to) ? "bg-primary/8 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`;

  return (
    <div className="h-svh w-full overflow-hidden bg-muted/45">
      <aside
        className={`fixed inset-y-0 inset-s-0 z-50 flex w-[286px] flex-col border-e border-primary/10 bg-card px-[15px] shadow-[8px_0_30px_-25px_rgba(15,23,42,.45)] transition-[width,transform] duration-300 lg:translate-x-0! ${collapsed ? "lg:w-20 lg:px-3" : ""} ${open ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"}`}
      >
        <div
          className={`flex h-[87px] items-center gap-3 border-b border-primary/15 px-1 ${collapsed ? "lg:justify-center" : ""}`}
        >
          <span
            className={`grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-primary/15 bg-white shadow-[0_4px_14px_-8px_rgba(7,89,154,.65)] ${collapsed ? "lg:border-primary/20 lg:bg-primary lg:text-primary-foreground" : ""}`}
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
            <strong className="block truncate text-[12px] font-bold leading-4 tracking-wide">
              NHO Workspace
            </strong>
            <span className="mt-0.5 block truncate text-[9px] font-medium text-muted-foreground">
              Management system
            </span>
          </div>
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
              className="h-10 w-full rounded-xl border border-primary/20 bg-primary/[.025] ps-9 pe-10 text-xs font-medium outline-none transition placeholder:text-muted-foreground/75 focus:border-primary/45 focus:bg-card focus:ring-3 focus:ring-primary/8 dark:bg-slate-950"
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
              onClick={() => {
                setCollapsed(false);
                localStorage.setItem("nho-sidebar-collapsed", "false");
                window.setTimeout(
                  () => navigationSearchRef.current?.focus(),
                  320,
                );
              }}
            >
              <Search className="size-4.25" />
            </button>
          )}
        </div>
        <nav
          dir={i18n.resolvedLanguage?.startsWith("en") ? "ltr" : "rtl"}
          className="sidebar-scroll flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain pe-0.5"
        >
          <div className="space-y-1 pt-1">
            <NavLink
              to="/employee-portal"
              className={({ isActive }) =>
                `group flex h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-semibold outline-none transition-all ${isActive ? "bg-primary/10 text-primary shadow-[inset_3px_0_0_var(--primary)] rtl:shadow-[inset_-3px_0_0_var(--primary)]" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`
              }
            >
              <Lightbulb className="size-[18px] stroke-[1.8] transition-transform group-hover:scale-105" />
              <span className={collapsed ? "lg:hidden" : ""}>
                {t("employeePortal.title")}
              </span>
            </NavLink>
          </div>
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
            <div
              className={`mt-2 space-y-1 ${taskNavigation.some(({ to }) => hasPermission(user, permissionForPath(to))) ? "" : "hidden"}`}
            >
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
                    <span className="flex-1 text-start">
                      {t("tasks.title")}
                    </span>
                    <ChevronDown
                      className={`size-3.5 transition-transform ${tasksExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {(tasksExpanded || Boolean(normalizedNavigationSearch)) && (
                    <div className="ms-[18px] space-y-0.5 border-s border-primary/20 ps-3">
                      {navItems(taskNavigation)}
                    </div>
                  )}
                </>
              )}
            </div>
            <div
              className={`mt-2 space-y-1 ${attendanceNavigation.some(({ to }) => hasPermission(user, permissionForPath(to))) ? "" : "hidden"}`}
            >
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
                  {(attendanceExpanded ||
                    Boolean(normalizedNavigationSearch)) && (
                    <div className="ms-[18px] space-y-0.5 border-s border-primary/20 ps-3">
                      {navItems(attendanceNavigation)}
                    </div>
                  )}
                </>
              )}
            </div>
            <div
              className={`mt-2 space-y-1 ${inventoryNavigation.some(({ to }) => hasPermission(user, permissionForPath(to))) ? "" : "hidden"}`}
            >
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
                  {(inventoryExpanded ||
                    Boolean(normalizedNavigationSearch)) && (
                    <div className="ms-[18px] space-y-0.5 border-s border-primary/20 ps-3">
                      {navItems(inventoryNavigation)}
                    </div>
                  )}
                </>
              )}
            </div>
            <div
              className={`mt-2 space-y-1 ${posNavigation.some(({ to }) => hasPermission(user, permissionForPath(to))) ? "" : "hidden"}`}
            >
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
                    <div className="ms-[18px] space-y-0.5 border-s border-primary/20 ps-3">
                      {navItems(posNavigation)}
                    </div>
                  )}
                </>
              )}
            </div>
            <div
              className={`mt-2 space-y-1 ${healthcareNavigation.some(({ to }) => hasPermission(user, permissionForPath(to))) ? "" : "hidden"}`}
            >
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
                  {(healthcareExpanded ||
                    Boolean(normalizedNavigationSearch)) && (
                    <div className="ms-[18px] space-y-0.5 border-s border-primary/20 ps-3">
                      {navItems(healthcareNavigation)}
                    </div>
                  )}
                </>
              )}
            </div>
            <div
              className={`mt-2 space-y-1 ${crmNavigation.some(({ to }) => hasPermission(user, permissionForPath(to))) ? "" : "hidden"}`}
            >
              {collapsed ? (
                <NavLink
                  to="/crm/leads"
                  title="CRM"
                  className={({ isActive }) =>
                    `hidden h-9 items-center justify-center rounded-lg outline-none transition-colors lg:flex ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-primary/7 hover:text-primary"}`
                  }
                >
                  <ContactRound className="size-4.25" />
                </NavLink>
              ) : (
                <>
                  <button
                    className={sectionButtonClass(crmNavigation)}
                    onClick={() => setCrmExpanded((value) => !value)}
                  >
                    <ContactRound className="size-4.25 shrink-0" />
                    <span className="flex-1 text-start">CRM</span>
                    <ChevronDown
                      className={`size-3.5 transition-transform ${crmExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {(crmExpanded || Boolean(normalizedNavigationSearch)) && (
                    <div className="ms-[18px] space-y-0.5 border-s border-primary/20 ps-3">
                      {navItems(crmNavigation)}
                    </div>
                  )}
                </>
              )}
            </div>
            <div
              className={`mt-2 space-y-1 ${hrNavigation.some(({ to }) => hasPermission(user, permissionForPath(to))) ? "" : "hidden"}`}
            >
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
                    <div className="ms-[18px] space-y-0.5 border-s border-primary/20 ps-3">
                      {navItems(hrNavigation)}
                    </div>
                  )}
                </>
              )}
            </div>
            <div
              className={`mt-2 space-y-1 ${accountingNavigation.some(({ to }) => hasPermission(user, permissionForPath(to))) ? "" : "hidden"}`}
            >
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
                  {(accountingExpanded ||
                    Boolean(normalizedNavigationSearch)) && (
                    <div className="ms-[18px] space-y-0.5 border-s border-primary/20 ps-3">
                      {navItems(accountingNavigation)}
                    </div>
                  )}
                </>
              )}
            </div>
            <div
              className={`mt-2 space-y-1 ${financeNavigation.some(({ to }) => hasPermission(user, permissionForPath(to))) ? "" : "hidden"}`}
            >
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
                    <div className="ms-[18px] space-y-0.5 border-s border-primary/20 ps-3">
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
        <div className="border-t border-primary/15 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex w-full items-center gap-2.5 rounded-xl p-1.5 text-start transition-all hover:bg-muted ${collapsed ? "lg:justify-center" : ""}`}
              >
                <Avatar className="size-9 shrink-0 border border-primary/15 shadow-sm">
                  <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={`min-w-0 flex-1 ${collapsed ? "lg:hidden" : ""}`}
                >
                  <strong className="block truncate text-[11px] font-bold">
                    {user?.name ?? "Qasem Admin"}
                  </strong>
                  <small className="mt-0.5 block truncate text-[9px] text-muted-foreground">
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
        className={`flex h-svh min-w-0 flex-col overflow-hidden transition-[padding] duration-300 ${collapsed ? "lg:ps-20" : "lg:ps-[286px]"}`}
      >
        <header className="electron-titlebar z-40 flex h-18 shrink-0 items-center gap-3 border-b border-border/60 bg-card/92 px-4 backdrop-blur-xl md:px-6">
          <Button
            className="border lg:hidden"
            variant="outline"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <button
            className="hidden size-9 place-items-center rounded-lg border border-primary/15 bg-card text-muted-foreground shadow-sm transition-colors hover:bg-primary/8 hover:text-primary lg:grid"
            onClick={toggle}
            title={collapsed ? t("expandSidebar") : t("collapseSidebar")}
            aria-label={collapsed ? t("expandSidebar") : t("collapseSidebar")}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4.5" />
            ) : (
              <PanelLeftClose className="size-4.5" />
            )}
          </button>
          <div className="min-w-0">
            <p className="truncate text-base font-bold tracking-tight md:text-lg">
              {pageTitle}
            </p>
            <p className="hidden text-[10px] text-muted-foreground md:block">
              NHO Management System
            </p>
          </div>
          <div className="ms-auto hidden w-full max-w-72 md:block">
            <label className="relative block">
              <Search className="absolute inset-s-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                className="h-10 w-full rounded-full border border-border/70 bg-muted/55 ps-9 pe-14 text-xs outline-none transition focus:border-primary/60 focus:bg-card focus:ring-2 focus:ring-primary/10"
                placeholder={t("navigation.search")}
                value={navigationSearch}
                onChange={(event) => setNavigationSearch(event.target.value)}
                onFocus={() => {
                  if (collapsed) {
                    setCollapsed(false);
                    localStorage.setItem("nho-sidebar-collapsed", "false");
                  }
                }}
              />
              <kbd className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">
                ⌘ K
              </kbd>
            </label>
          </div>
          <div className="hidden 2xl:block">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="relative size-9 rounded-lg"
                variant="outline"
                size="icon"
                aria-label={t("notificationCenter.title")}
              >
                <Bell className="size-4 fill-red-500 text-red-500 dark:text-red-700" />
                {unreadCount > 0 && (
                  <span className="absolute -end-1.5 -top-1.5 grid min-w-4.5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-4 text-destructive-foreground">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="z-10000 w-80 rounded-xl p-2"
            >
              <DropdownMenuLabel className="flex items-center justify-between gap-3">
                <span>{t("notificationCenter.title")}</span>
                {unreadCount > 0 && (
                  <button
                    className="text-xs font-normal text-primary hover:underline"
                    onClick={(event) => {
                      event.preventDefault();
                      void markAllNotificationsRead();
                    }}
                  >
                    {t("notificationCenter.markAllRead")}
                  </button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                  {t("notificationCenter.empty")}
                </p>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="items-start gap-2 rounded-lg py-2.5"
                    onSelect={() => void openNotification(notification)}
                  >
                    <span
                      className={`mt-1.5 size-2 shrink-0 rounded-full ${notification.readAt ? "bg-muted" : "bg-primary"}`}
                    />
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold">
                        {notificationLabel(notification.type, t)}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {notification.warning?.title ??
                          notification.meeting?.title ??
                          notification.task?.title ??
                          t("notificationCenter.deletedTask")}
                      </span>
                      <span className="mt-1 block text-[10px] text-muted-foreground">
                        {new Intl.DateTimeFormat(i18n.resolvedLanguage, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(notification.createdAt))}
                      </span>
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            className="hidden h-10 items-center gap-2 rounded-full border border-border/70 bg-card py-1 ps-1 pe-3 text-start shadow-sm transition hover:bg-muted sm:flex"
            onClick={() => navigate("/profile")}
          >
            <Avatar className="size-7 border">
              <AvatarFallback className="bg-primary/10 text-[9px] font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden min-w-0 lg:block">
              <strong className="block max-w-24 truncate text-[10px] leading-3.5">
                {user?.name ?? "Qasem Admin"}
              </strong>
              <small className="block max-w-24 truncate text-[8px] text-muted-foreground">
                @{user?.username ?? "admin"}
              </small>
            </span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </button>
          <WindowControls />
        </header>
        <main className="content-scrollbar min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain scroll-smooth">
          <div className="min-h-full p-3 md:p-5 xl:p-6">
            <Outlet />
          </div>
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
