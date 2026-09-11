import { prisma } from '../../../shared/database/client.js';
export const prescriptionsModel = {
  list: patientId => prisma.patientPrescription.findMany({ where: { patientId }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }] }),
  patient: id => prisma.patient.findUniqueOrThrow({ where: { id }, select: { firstName: true, lastName: true, patientCode: true } }),
  create: data => prisma.patientPrescription.upsert({ where: { requestId: data.requestId }, create: data, update: {} }),
  catalog: () => prisma.inventoryProduct.findMany({ where: { status: 'active' }, select: { id: true, name: true, sku: true, size: true, doseMgKgDay: true, dosesPerDay: true, concentrationMg: true, concentrationMl: true }, orderBy: { name: 'asc' } }),
};
