const pageKey = (req) => {
  const path = req.originalUrl.split("?")[0].replace(/^\/api\//, "");
  const parts = path.split("/");
  if (parts[0] === "employees") {
    if (parts[1] === "positions") return "hr.positions";
    if (parts[1] === "records") return `hr.${parts[2]}`;
    return "hr.employees";
  }
  if (parts[0] === "attendance")
    return `attendance.${parts[1] === "people" ? "users" : parts[1]}`;
  if (parts[0] === "healthcare") return `healthcare.${parts[1]}`;
  if (parts[0] === "accounting") return `accounting.${parts[1]}`;
  if (parts[0] === "billing") return `accounting.${parts[1]}`;
  if (parts[0] === "advances")
    return parts[1] === "service" ? "accounting.service_advances" : "hr.advances";
  if (parts[0] === "finance") return `finance.${parts[1]}`;
  if (parts[0] === "inventory") {
    if (path.includes("/barcode")) return "inventory.barcodes";
    const resource = parts[1] === "adjust" ? "stock" : parts[1];
    return `inventory.${resource}`;
  }
  if (parts[0] === "pos") return parts[1] === "sales" && req.method === "GET" ? "pos.sales" : "pos.checkout";
  if (parts[0] === "tasks") return parts[1] === "reports" ? "tasks.reports" : "tasks.list";
  if (parts[0] === "feedback") return "healthcare.feedback";
  return null;
};

const actionKey = (req) => {
  if (/\/barcode\/new$/.test(req.originalUrl.split("?")[0])) return "create";
  if (req.method === "GET") return "view";
  if (req.method === "DELETE") return "delete";
  if (["PATCH", "PUT"].includes(req.method)) return "update";
  if (req.method === "POST") {
    if (/\/post$/.test(req.path)) return "post";
    if (/\/sync$|\/test$/.test(req.path)) return "manage";
    return "create";
  }
  return "view";
};

const hasGranularPermission = (req) => {
  const page = pageKey(req);
  return Boolean(page && req.permissionKeys?.has(`${page}.${actionKey(req)}`));
};

export const requirePermission = (permission) => (req, res, next) => {
  if (!req.permissionKeys?.has("*") && !req.permissionKeys?.has(permission) && !hasGranularPermission(req))
    return res
      .status(403)
      .json({ message: `Missing permission: ${permission}` });
  next();
};

export const requireAnyPermission = (...permissions) => (req, res, next) => {
  if (
    !req.permissionKeys?.has("*") &&
    !permissions.some((permission) => req.permissionKeys?.has(permission)) &&
    !hasGranularPermission(req)
  )
    return res.status(403).json({
      message: `Missing one of permissions: ${permissions.join(", ")}`,
    });
  next();
};
