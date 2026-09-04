import { healthcareModel as model } from "./healthcare.model.js";
export const healthcareService = {
  listDepartments: model.listDepartments,
  async createDepartment(data) {
    const item = await model.createDepartment(data);
    if (data.managerId) await model.assignDepartment(data.managerId, item.id);
    return item;
  },
  async updateDepartment(id, data) {
    const item = await model.updateDepartment(id, data);
    if (data.managerId) await model.assignDepartment(data.managerId, item.id);
    return item;
  },
  removeDepartment: model.removeDepartment,
  listStaff: model.listStaff,
  async createStaff(data) {
    const item = await model.createStaff(data);
    if (data.departmentId)
      await model.assignDepartment(data.employeeId, data.departmentId);
    return item;
  },
  async updateStaff(id, data) {
    const item = await model.updateStaff(id, data);
    if (data.departmentId)
      await model.assignDepartment(item.employeeId, data.departmentId);
    return item;
  },
  removeStaff: model.removeStaff,
  publicDepartments: model.publicDepartments,
  publicDoctors: model.publicDoctors,
};
