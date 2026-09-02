import { prisma } from "../../../shared/database/client.js";

const templateInclude = { _count: { select: { submissions: true } } };

export const formsModel = {
  templates: () =>
    prisma.crmFormTemplate.findMany({
      include: templateInclude,
      orderBy: { createdAt: "desc" },
    }),
  activeTemplates: () =>
    prisma.crmFormTemplate.findMany({
      where: { status: "active" },
      orderBy: { name: "asc" },
    }),
  template: (id) => prisma.crmFormTemplate.findUniqueOrThrow({ where: { id } }),
  createTemplate: (data) =>
    prisma.crmFormTemplate.create({ data, include: templateInclude }),
  updateTemplate: (id, data) =>
    prisma.crmFormTemplate.update({
      where: { id },
      data,
      include: templateInclude,
    }),
  removeTemplate: (id) => prisma.crmFormTemplate.delete({ where: { id } }),
  submissions: (patientId) =>
    prisma.patientFormSubmission.findMany({
      where: { patientId },
      include: { formTemplate: true },
      orderBy: { createdAt: "desc" },
    }),
  createSubmission: (data) =>
    prisma.patientFormSubmission.create({
      data,
      include: { formTemplate: true },
    }),
  removeSubmission: (id) =>
    prisma.patientFormSubmission.delete({ where: { id } }),
};
