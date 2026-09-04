import { createCrudController } from "../../../shared/controllers/crud.controller.js";
import { attendancePermissionService } from "./attendance-permissions.service.js";
export const attendancePermissionController = createCrudController(
  attendancePermissionService,
);
