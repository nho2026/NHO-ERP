import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { AuthUser } from "./types/auth.types";

export const storedUser = (): AuthUser | null => {
  try {
    return JSON.parse(sessionStorage.getItem("nho-current-user") ?? "null");
  } catch {
    return null;
  }
};

export const isCashier = (user: AuthUser | null) =>
  Boolean(
    user?.roles?.some(({ name }) =>
      ["cashier", "cashir"].includes(name.trim().toLowerCase()),
    ),
  );

export const hasPermission = (
  user: AuthUser | null,
  permission?: string,
) => {
  if (!user) return false;
  if (!permission || user.permissions?.includes("*") || user.permissions?.includes(permission))
    return true;
  if (permission === "tasks.list.view" && user.employee) return true;
  if (permission.startsWith("accounting.")) {
    if (permission.endsWith(".view"))
      return Boolean(user.permissions?.includes("finance.view"));
    return Boolean(user.permissions?.includes("journal.create"));
  }
  if (permission === "system.logs.view")
    return Boolean(user.permissions?.includes("roles.view"));
  const module = permission.split(".")[0];
  const legacy: Record<string, { view: string; manage: string }> = {
    tasks: { view: "employees.view", manage: "employees.manage" },
    attendance: { view: "employees.view", manage: "employees.manage" },
    hr: { view: "employees.view", manage: "employees.manage" },
    healthcare: { view: "employees.view", manage: "employees.manage" },
    finance: { view: "finance.view", manage: "journal.create" },
    inventory: { view: "inventory.view", manage: "inventory.manage" },
    pos: { view: "pos.use", manage: "pos.use" },
  };
  const fallback = legacy[module];
  if (fallback)
    return Boolean(
      user.permissions?.includes(
        permission.endsWith(".view") ? fallback.view : fallback.manage,
      ),
    );
  return false;
};

export function RequireAccess({
  permission,
  allowCashier = false,
  children,
}: {
  permission?: string;
  allowCashier?: boolean;
  children: ReactNode;
}) {
  const user = storedUser();
  if (!user) return <Navigate to="/login" replace />;
  if (isCashier(user) && !allowCashier)
    return <Navigate to="/pos/checkout" replace />;
  if (!hasPermission(user, permission))
    return <Navigate to={isCashier(user) ? "/pos/checkout" : "/profile"} replace />;
  return children;
}
