import { Router } from "express";
import { patientController } from "./patient.controller.js";

const router = Router();

const canView = (req, res, next) =>
  req.permissionKeys.has("*") ||
  req.permissionKeys.has("employees.view") ||
  req.permissionKeys.has("employees.manage")
    ? next()
    : res.status(403).json({ message: "CRM access is required." });

router.get("/", canView, patientController.list);
router.get("/:id", canView, patientController.profile);

export default router;
