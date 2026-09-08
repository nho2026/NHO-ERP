import { prescriptionsModel as model } from './prescriptions.model.js';
import { prescriptionSchema } from './prescriptions.schema.js';
export const prescriptionsService = {
  list: id => model.list(id),
  catalog: () => model.catalog(),
  create: async (patientId, body, user) => {
    const input = prescriptionSchema.parse(body);
    const patient = await model.patient(patientId);
    const record = await model.create({ ...input, patientId, prescriberId: user.id, prescriberName: user.name, patientName: `${patient.firstName} ${patient.lastName}`, patientCode: patient.patientCode });
    if (record.patientId !== patientId || record.prescriberId !== user.id) throw Object.assign(new Error('Request already belongs to another prescription.'), { status: 409 });
    return record;
  },
};
