import { Router } from "express";
import { validate } from "../../../shared/middleware/validation.middleware.js";
import { referralController } from "./referral.controller.js";
import { referralSchema } from "./referral.schema.js";

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

router.get("/", canView, referralController.list);
router.post(
  "/",
  canManage,
  validate(referralSchema),
  referralController.create,
);
router.patch(
  "/:id",
  canManage,
  validate(referralSchema.partial()),
  referralController.update,
);
router.delete("/:id", canManage, referralController.remove);

export default router;
