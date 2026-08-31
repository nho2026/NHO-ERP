import "dotenv/config";
import { prisma } from "../src/shared/database/client.js";

const names = ["Baran Mohammed", "Avin Jalal", "Dilshad Rahman", "Zana Farhad", "Hana Ibrahim", "Karwan Ismail", "Nawroz Kamal", "Zhino Adnan", "Sirwan Latif", "Tara Yousif"];
const procedures = ["Appendectomy", "Cataract surgery", "Knee arthroscopy", "Hernia repair", "Tonsillectomy", "Gallbladder removal", "Cesarean section", "Coronary angioplasty", "Sinus surgery", "Carpal tunnel release"];
const doctors = await prisma.healthStaff.findMany({ where: { staffType: "doctor", status: "active" }, orderBy: { createdAt: "asc" } });
if (!doctors.length) throw new Error("Create at least one active doctor before seeding CRM surgery appointments.");

for (let index = 0; index < 10; index += 1) {
  const number = String(index + 1).padStart(3, "0");
  const [firstName, lastName] = names[index].split(" ");
  await prisma.crmLead.upsert({
    where: { id: `seed-crm-lead-${number}` },
    update: { name: names[index], status: ["new", "contacted", "qualified", "qualified", "lost"][index % 5] },
    create: { id: `seed-crm-lead-${number}`, name: names[index], phone: `075040${String(index + 1).padStart(5, "0")}`, email: `crm.patient${number}@example.com`, source: ["website", "phone", "referral", "social_media"][index % 4], interest: ["General consultation", "Dental treatment", "Eye examination", "Surgery consultation"][index % 4], notes: `SEED: CRM lead ${index + 1}`, status: ["new", "contacted", "qualified", "qualified", "lost"][index % 5] },
  });
  const patient = await prisma.patient.upsert({
    where: { patientCode: `PAT-${String(index + 1).padStart(4, "0")}` },
    update: { firstName, lastName, status: "active" },
    create: { patientCode: `PAT-${String(index + 1).padStart(4, "0")}`, firstName, lastName, phone: `075050${String(index + 1).padStart(5, "0")}`, email: `patient${number}@example.com`, dateOfBirth: new Date(Date.UTC(1980 + index * 3, index % 12, 5 + index)), gender: index % 2 ? "female" : "male", address: ["Erbil", "Sulaymaniyah", "Duhok", "Kirkuk"][index % 4], bloodType: ["A+", "O+", "B+", "AB+", "A-"][index % 5], allergies: index % 3 === 0 ? "Penicillin" : null, medicalNotes: `SEED: Patient medical profile ${index + 1}`, status: "active" },
  });
  const surgery = await prisma.surgery.upsert({
    where: { code: `SUR-${number}` },
    update: { name: procedures[index], status: "active" },
    create: { code: `SUR-${number}`, name: procedures[index], description: `SEED: ${procedures[index]} procedure`, durationMinutes: 45 + index * 15, basePrice: 500000 + index * 175000, status: "active" },
  });
  const appointment = await prisma.surgeryAppointment.upsert({
    where: { id: `seed-crm-surgery-appointment-${number}` },
    update: { patientId: patient.id, doctorId: doctors[index % doctors.length].id, surgeryId: surgery.id, scheduledAt: new Date(Date.UTC(2026, 8 + (index % 3), 3 + index, 7 + (index % 6))), operatingRoom: `OR-${1 + (index % 4)}`, status: ["scheduled", "confirmed", "in_progress", "completed"][index % 4] },
    create: { id: `seed-crm-surgery-appointment-${number}`, patientId: patient.id, doctorId: doctors[index % doctors.length].id, surgeryId: surgery.id, scheduledAt: new Date(Date.UTC(2026, 8 + (index % 3), 3 + index, 7 + (index % 6))), operatingRoom: `OR-${1 + (index % 4)}`, status: ["scheduled", "confirmed", "in_progress", "completed"][index % 4], preOpNotes: `SEED: Pre-operation assessment ${index + 1}`, postOpNotes: index % 4 === 3 ? "SEED: Procedure completed successfully" : null },
  });
  const payment = { patientId: patient.id, surgeryAppointmentId: appointment.id, amount: 250000 + index * 125000, paymentMethod: ["cash", "card", "bank_transfer", "insurance"][index % 4], reference: `CRM-PAY-${String(index + 1).padStart(4, "0")}`, notes: `SEED: Surgery payment ${index + 1}`, paidAt: new Date(Date.UTC(2026, 7 + (index % 3), 2 + index, 9)), status: index % 4 === 0 ? "pending" : "paid" };
  await prisma.patientPayment.upsert({ where: { id: `seed-crm-payment-${number}` }, update: payment, create: { id: `seed-crm-payment-${number}`, ...payment } });
}

console.log("CRM seed complete: 10 leads, patients, surgeries, surgery appointments, and payments.");
await prisma.$disconnect();
