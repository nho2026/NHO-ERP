import { healthcareModel as model } from "./healthcare.model.js";
const fail = (message, status) => {
  throw Object.assign(new Error(message), { status });
};
const ensureDoctor = async (data) => {
  if (!data.doctorId) return;
  const doctor = await model.getDoctor(data.doctorId);
  if (doctor.staffType !== "doctor")
    fail("Appointments can only be assigned to doctors.", 400);
  if (data.departmentId && doctor.departmentId !== data.departmentId)
    fail("The selected doctor does not belong to this department.", 400);
};
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
  listAppointments: model.listAppointments,
  async createAppointment(data) {
    await ensureDoctor(data);
    return model.createAppointment({
      ...data,
      patientEmail: data.patientEmail || null,
      source: "admin",
    });
  },
  async updateAppointment(id, data) {
    const current = await model.getAppointment(id);
    await ensureDoctor({ ...current, ...data });
    return model.updateAppointment(id, {
      ...data,
      ...(data.patientEmail !== undefined && {
        patientEmail: data.patientEmail || null,
      }),
    });
  },
  removeAppointment: model.removeAppointment,
  publicDepartments: model.publicDepartments,
  publicDoctors: model.publicDoctors,
  async book(data) {
    if (!(await model.findPublicDoctor(data.doctorId, data.departmentId)))
      fail("The selected doctor is not available for public booking.", 400);
    if (await model.findConflict(data.doctorId, data.scheduledAt))
      fail("This appointment time is no longer available.", 409);
    return model.createAppointment(
      {
        ...data,
        patientEmail: data.patientEmail || null,
        durationMinutes: 30,
        status: "pending",
        source: "website",
      },
      true,
    );
  },
};
