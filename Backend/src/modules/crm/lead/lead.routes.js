import { Router } from "express";
import { validate } from "../../../shared/middleware/validation.middleware.js";
import { leadController } from "./lead.controller.js";
import { leadSchema, leadUpdateSchema } from "./lead.schema.js";

const router = Router();

const canView = (req, res, next) =>
  req.permissionKeys.has("*") ||
  req.permissionKeys.has("employees.view") ||
  req.permissionKeys.has("employees.manage")
    ? next()
    : res.status(403).json({ message: "CRM access is required." });

const canManage = (req, res, next) =>
  req.permissionKeys.has("*") || req.permissionKeys.has("employees.manage")
    ? next()
    : res.status(403).json({ message: "CRM management access is required." });

router.get("/", canView, leadController.list);
router.get("/:id", canView, leadController.get);
router.post("/", canManage, validate(leadSchema), leadController.create);
router.patch(
  "/:id",
  canManage,
  validate(leadUpdateSchema),
  leadController.update,
);
router.delete("/:id", canManage, leadController.remove);

export default router;
