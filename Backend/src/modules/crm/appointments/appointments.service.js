import { appointmentsModel } from "./appointments.model.js";

const fail = (message, status) => {
  throw Object.assign(new Error(message), { status });
};

const ensureDoctor = async (data) => {
  if (!data.doctorId) return;
  const doctor = await appointmentsModel.findDoctor(data.doctorId);
  if (doctor.staffType !== "doctor")
    fail("Appointments can only be assigned to doctors.", 400);
  if (data.departmentId && doctor.departmentId !== data.departmentId)
    fail("The selected doctor does not belong to this department.", 400);
};

export const appointmentsService = {
  list: (query) => appointmentsModel.list(query),
  async create(data) {
    await ensureDoctor(data);
    return appointmentsModel.create({
      ...data,
      patientEmail: data.patientEmail || null,
      source: "admin",
    });
  },
  async update(id, data) {
    const current = await appointmentsModel.findById(id);
    await ensureDoctor({ ...current, ...data });
    return appointmentsModel.update(id, {
      ...data,
      ...(data.patientEmail !== undefined && {
        patientEmail: data.patientEmail || null,
      }),
    });
  },
  remove: (id) => appointmentsModel.remove(id),
  async book(data) {
    if (
      !(await appointmentsModel.findPublicDoctor(
        data.doctorId,
        data.departmentId,
      ))
    )
      fail("The selected doctor is not available for public booking.", 400);
    if (await appointmentsModel.findConflict(data.doctorId, data.scheduledAt))
      fail("This appointment time is no longer available.", 409);
    return appointmentsModel.create(
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
