import { getSettings } from "../../settings/settings.service.js";
import { appointmentsModel } from "./appointments.model.js";

const fail = (message, status) => {
  throw Object.assign(new Error(message), { status });
};

export const ensureAppointmentDate = (scheduledAt, currentScheduledAt) => {
  if (scheduledAt === undefined) return;
  const date = new Date(scheduledAt);
  // Historical appointments can still have their status or notes updated.
  if (
    currentScheduledAt &&
    date.getTime() === new Date(currentScheduledAt).getTime()
  )
    return;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) fail("Appointment date cannot be in the past.", 400);
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
    const policy = await getSettings("healthcare");
    data = { ...data, durationMinutes: data.durationMinutes ?? policy.appointmentMinutes };
    ensureAppointmentDate(data.scheduledAt);
    await ensureDoctor(data);
    return appointmentsModel.create({
      ...data,
      patientEmail: data.patientEmail || null,
      source: "admin",
    });
  },
  async update(id, data) {
    const current = await appointmentsModel.findById(id);
    ensureAppointmentDate(data.scheduledAt, current.scheduledAt);
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
    const policy = await getSettings("healthcare");
    const system = await getSettings("system");
    const parts = new Intl.DateTimeFormat("en-US", {timeZone:system.timezone,weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date(data.scheduledAt));
    const part = key => parts.find(p => p.type === key)?.value;
    const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(part("weekday"));
    const minute = Number(part("hour"))*60+Number(part("minute"));
    const minutes = time => Number(time.split(":")[0])*60+Number(time.split(":")[1]);
    if (!policy.bookingDays.includes(day) || minute < minutes(policy.bookingStart) || minute + policy.appointmentMinutes > minutes(policy.bookingEnd))
      fail("This appointment is outside public booking hours.", 400);
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
        durationMinutes: policy.appointmentMinutes,
        status: "pending",
        source: "website",
      },
      true,
    );
  },
};
