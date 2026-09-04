import { createCrudService } from "../../../shared/services/crud.service.js";
import { attendancePermissionModel } from "./attendance-permissions.model.js";
export const attendancePermissionService = createCrudService(
  attendancePermissionModel,
);
