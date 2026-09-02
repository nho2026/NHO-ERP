import "dotenv/config";
import { prisma } from "../src/shared/database/client.js";

const names = [
  "Baran Mohammed",
  "Avin Jalal",
  "Dilshad Rahman",
  "Zana Farhad",
  "Hana Ibrahim",
  "Karwan Ismail",
  "Nawroz Kamal",
  "Zhino Adnan",
  "Sirwan Latif",
  "Tara Yousif",
];
const procedures = [
  "Appendectomy",
  "Cataract surgery",
  "Knee arthroscopy",
  "Hernia repair",
  "Tonsillectomy",
  "Gallbladder removal",
  "Cesarean section",
  "Coronary angioplasty",
  "Sinus surgery",
  "Carpal tunnel release",
];
const leadStatuses = [
  "new",
  "contacted",
  "qualified",
  "appointment_requested",
  "lost",
  "converted",
  "contacted",
  "qualified",
  "appointment_requested",
  "converted",
];
const progressPath = (status) => {
  if (status === "lost") return ["new", "contacted", "lost"];
  const pipeline = [
    "new",
    "contacted",
    "qualified",
    "appointment_requested",
    "converted",
  ];
  return pipeline.slice(0, pipeline.indexOf(status) + 1);
};
const doctors = await prisma.healthStaff.findMany({
  where: { staffType: "doctor", status: "active" },
  orderBy: { createdAt: "asc" },
});
if (!doctors.length)
  throw new Error(
    "Create at least one active doctor before seeding CRM surgery appointments.",
  );

for (let index = 0; index < 10; index += 1) {
  const number = String(index + 1).padStart(3, "0");
  const [firstName, lastName] = names[index].split(" ");
  const leadData = {
    code: `LEAD-${number}`,
    name: names[index],
    phone: `075040${String(index + 1).padStart(5, "0")}`,
    email: `crm.patient${number}@example.com`,
    source: ["website", "phone", "referral", "social_media"][index % 4],
    age: 20 + index * 3,
    gender: index % 2 ? "female" : "male",
    address: ["Erbil", "Sulaymaniyah", "Duhok", "Kirkuk"][index % 4],
    interest: [
      "General consultation",
      "Dental treatment",
      "Eye examination",
      "Surgery consultation",
    ][index % 4],
    notes: `SEED: CRM lead ${index + 1}`,
    status: leadStatuses[index],
  };
  const lead = await prisma.crmLead.upsert({
    where: { id: `seed-crm-lead-${number}` },
    update: leadData,
    create: { id: `seed-crm-lead-${number}`, ...leadData },
  });
  await prisma.crmLeadStatusHistory.deleteMany({
    where: {
      leadId: lead.id,
      OR: [
        { id: `seed-crm-lead-history-${number}` },
        { id: { startsWith: `seed-crm-lead-history-${number}-` } },
      ],
    },
  });
  const statusPath = progressPath(lead.status);
  await prisma.crmLeadStatusHistory.createMany({
    data: statusPath.map((status, statusIndex) => ({
      id: `seed-crm-lead-history-${number}-${statusIndex + 1}`,
      leadId: lead.id,
      fromStatus: statusIndex ? statusPath[statusIndex - 1] : null,
      toStatus: status,
      createdAt: new Date(
        Date.UTC(2026, 7, 15 + index, 8 + statusIndex * 3, index * 2),
      ),
    })),
  });
  const patient = await prisma.patient.upsert({
    where: { patientCode: `PAT-${String(index + 1).padStart(4, "0")}` },
    update: { firstName, lastName, status: "active" },
    create: {
      patientCode: `PAT-${String(index + 1).padStart(4, "0")}`,
      firstName,
      lastName,
      phone: `075050${String(index + 1).padStart(5, "0")}`,
      email: `patient${number}@example.com`,
      dateOfBirth: new Date(Date.UTC(1980 + index * 3, index % 12, 5 + index)),
      gender: index % 2 ? "female" : "male",
      address: ["Erbil", "Sulaymaniyah", "Duhok", "Kirkuk"][index % 4],
      bloodType: ["A+", "O+", "B+", "AB+", "A-"][index % 5],
      allergies: index % 3 === 0 ? "Penicillin" : null,
      medicalNotes: `SEED: Patient medical profile ${index + 1}`,
      status: "active",
    },
  });
  if (lead.status === "converted") {
    await prisma.crmLead.update({
      where: { id: lead.id },
      data: { convertedPatientId: patient.id },
    });
  }
  const surgery = await prisma.surgery.upsert({
    where: { code: `SUR-${number}` },
    update: { name: procedures[index], status: "active" },
    create: {
      code: `SUR-${number}`,
      name: procedures[index],
      description: `SEED: ${procedures[index]} procedure`,
      durationMinutes: 45 + index * 15,
      basePrice: 500000 + index * 175000,
      status: "active",
    },
  });
  const appointment = await prisma.surgeryAppointment.upsert({
    where: { id: `seed-crm-surgery-appointment-${number}` },
    update: {
      patientId: patient.id,
      doctorId: doctors[index % doctors.length].id,
      surgeryId: surgery.id,
      scheduledAt: new Date(
        Date.UTC(2026, 8 + (index % 3), 3 + index, 7 + (index % 6)),
      ),
      operatingRoom: `OR-${1 + (index % 4)}`,
      status: ["scheduled", "confirmed", "in_progress", "completed"][index % 4],
    },
    create: {
      id: `seed-crm-surgery-appointment-${number}`,
      patientId: patient.id,
      doctorId: doctors[index % doctors.length].id,
      surgeryId: surgery.id,
      scheduledAt: new Date(
        Date.UTC(2026, 8 + (index % 3), 3 + index, 7 + (index % 6)),
      ),
      operatingRoom: `OR-${1 + (index % 4)}`,
      status: ["scheduled", "confirmed", "in_progress", "completed"][index % 4],
      preOpNotes: `SEED: Pre-operation assessment ${index + 1}`,
      postOpNotes:
        index % 4 === 3 ? "SEED: Procedure completed successfully" : null,
    },
  });
  const payment = {
    patientId: patient.id,
    surgeryAppointmentId: appointment.id,
    amount: 250000 + index * 125000,
    paymentMethod: ["cash", "card", "bank_transfer", "insurance"][index % 4],
    reference: `CRM-PAY-${String(index + 1).padStart(4, "0")}`,
    notes: `SEED: Surgery payment ${index + 1}`,
    paidAt: new Date(Date.UTC(2026, 7 + (index % 3), 2 + index, 9)),
    status: index % 4 === 0 ? "pending" : "paid",
  };
  await prisma.patientPayment.upsert({
    where: { id: `seed-crm-payment-${number}` },
    update: payment,
    create: { id: `seed-crm-payment-${number}`, ...payment },
  });
}

const pediatricFields = [
  ["visitDate", "Date of visit", "date", true],
  ["weight", "Weight (kg)", "number", true],
  ["height", "Height / length (cm)", "number", true],
  ["headCircumference", "Head circumference (cm)", "number", false],
  ["temperature", "Temperature (°C)", "number", false],
  ["heartRate", "Heart rate (/min)", "number", false],
  ["respiratoryRate", "Respiratory rate (/min)", "number", false],
  ["spo2", "SpO₂ (%)", "number", false],
  ["mainComplaint", "Main complaint", "textarea", true],
  ["onset", "Onset", "select", false, ["Sudden", "Gradual"]],
  [
    "reason",
    "Reason for visit",
    "select",
    true,
    [
      "Fever",
      "Cough / respiratory problem",
      "Vomiting",
      "Diarrhea",
      "Abdominal pain",
      "Poor feeding",
      "Growth concern",
      "Developmental concern",
      "Skin problem",
      "Follow-up",
      "Vaccination",
      "Other",
    ],
  ],
  ["clinicalHistory", "History of present illness", "textarea", false],
  ["pastMedicalHistory", "Past medical history", "textarea", false],
  ["birthHistory", "Birth and neonatal history", "textarea", false],
  [
    "immunization",
    "Immunization status",
    "select",
    false,
    ["Up to date", "Incomplete", "Unknown"],
  ],
  ["allergyMedication", "Allergy and medication history", "textarea", false],
  ["familySocialHistory", "Family and social history", "textarea", false],
  ["generalExamination", "General condition", "textarea", false],
  ["respiratoryExam", "Respiratory examination", "textarea", false],
  ["cardiovascularExam", "Cardiovascular examination", "textarea", false],
  ["abdominalExam", "Abdominal examination", "textarea", false],
  ["neurologicalExam", "Neurological examination", "textarea", false],
  ["skinExam", "Skin examination", "textarea", false],
  ["provisionalDiagnosis", "Provisional diagnosis", "textarea", false],
  ["finalDiagnosis", "Final diagnosis", "textarea", false],
  ["investigations", "Investigations", "textarea", false],
  ["treatment", "Treatment", "textarea", false],
  ["followUpDate", "Follow-up date", "date", false],
  ["referrals", "Referrals", "textarea", false],
].map(([id, label, type, required, options]) => ({
  id,
  label,
  type,
  required,
  ...(options && { options }),
}));

await prisma.crmFormTemplate.upsert({
  where: { code: "PED-ASSESSMENT" },
  update: { fields: pediatricFields, status: "active" },
  create: {
    code: "PED-ASSESSMENT",
    name: "Pediatric Patient ID & Clinical Assessment",
    description:
      "Pediatric vital signs, history, examination, diagnosis, and management.",
    category: "examination",
    fields: pediatricFields,
    status: "active",
  },
});

console.log(
  "CRM seed complete: leads, patients, surgeries, appointments, payments, and pediatric form.",
);
await prisma.$disconnect();
