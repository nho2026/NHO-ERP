import { verifySecret } from "../../../shared/security/password.js";
import { HikvisionClient } from "../hikvision/hikvision.client.js";
import { peopleModel as model } from "./people.model.js";
const fail = (m, s) => {
  throw Object.assign(new Error(m), { status: s });
};
const syncDevice = async (d) => {
  let count = 0;
  for (const user of await new HikvisionClient(d).allUsers()) {
    const employeeNo = String(user.employeeNo ?? user.employeeNoString ?? "");
    if (!employeeNo) continue;
    await model.upsert(d.id, employeeNo, {
      name: user.name || `Employee #${employeeNo}`,
      employeeId: await model.employee(employeeNo),
      hasPassword: Boolean(user.password),
    });
    count++;
  }
  await model.deviceStatus(d.id, { status: "online", lastSeenAt: new Date() });
  return count;
};
const admin = async (user, password) => {
  if (
    !user.roles.some(({ role }) => role.name === "Super Administrator") ||
    !(await verifySecret(password, user.passwordHash))
  )
    fail("Super Administrator password is incorrect.", 403);
};
export const peopleService = {
  async list(deviceId) {
    for (const d of await model.devices(deviceId)) {
      try {
        await syncDevice(d);
      } catch {
        await model.deviceStatus(d.id, { status: "offline" }).catch(() => {});
      }
    }
    return model.findAll(deviceId);
  },
  async sync(deviceId) {
    let synced = 0;
    const errors = [];
    for (const d of await model.devices(deviceId)) {
      try {
        synced += await syncDevice(d);
      } catch (error) {
        errors.push({
          deviceId: d.id,
          deviceName: d.name,
          message: error.message,
        });
        await model.deviceStatus(d.id, { status: "offline" }).catch(() => {});
      }
    }
    return { synced, errors };
  },
  async create(input) {
    const d = (await model.devices(input.deviceId))[0];
    if (!d) fail("Record not found.", 404);
    if (await model.findNumber(input.deviceId, input.employeeNo))
      fail(
        `Employee number ${input.employeeNo} already exists on this device.`,
        409,
      );
    const api = new HikvisionClient(d);
    try {
      await api.addUser(input);
    } catch (error) {
      if (error.deviceStatus !== "employeeNoAlreadyExist") throw error;
      fail(
        `Employee number ${input.employeeNo} already exists on the Hikvision terminal.`,
        409,
      );
    }
    if (input.cardNo)
      await api.addCard(input.employeeNo, input.cardNo).catch((error) => {
        if (
          !["cardNoAlreadyExist", "employeeNoAndCardNoAlreadyExist"].includes(
            error.deviceStatus,
          )
        )
          throw error;
      });
    return model.create({
      ...input,
      employeeId: await model.employee(input.employeeNo),
    });
  },
  async update(id, data) {
    const p = await model.find(id),
      api = new HikvisionClient(p.device);
    await api.updateUser({ ...p, ...data });
    if (data.cardNo !== undefined && data.cardNo !== p.cardNo) {
      if (p.cardNo) await api.deleteCards(p.employeeNo);
      if (data.cardNo) await api.addCard(p.employeeNo, data.cardNo);
    }
    return model.update(id, data);
  },
  async remove(id, user, password) {
    await admin(user, password);
    const p = await model.find(id);
    await new HikvisionClient(p.device).deleteUser(p.employeeNo);
    await model.remove(id);
  },
  async removeCredential(id, method) {
    const p = await model.find(id),
      api = new HikvisionClient(p.device);
    let data;
    if (method === "card") {
      await api.deleteCards(p.employeeNo);
      data = { cardNo: null };
    } else if (method === "fingerprint") {
      await api.deleteFingerprint(p.employeeNo);
      data = { hasFingerprint: false };
    } else if (method === "face") {
      await api.deleteFace(p.employeeNo);
      data = { hasFace: false };
    } else {
      await api.clearUserPassword(p);
      data = { hasPassword: false };
    }
    return model.update(id, data);
  },
  async addCredential(id, method, input) {
    const p = await model.find(id),
      api = new HikvisionClient(p.device);
    let data;
    if (method === "card") {
      if (!input.cardNo) fail("Card number is required.", 400);
      await api.addCard(p.employeeNo, input.cardNo);
      data = { cardNo: input.cardNo };
    } else if (method === "pin") {
      if (!input.pin) fail("PIN is required.", 400);
      await api.setUserPassword(p, input.pin);
      data = { hasPassword: true };
    } else if (method === "fingerprint") {
      await api.captureFingerprint(p.employeeNo);
      data = { hasFingerprint: true };
    } else {
      await api.captureFace(p.employeeNo, p.name);
      data = { hasFace: true };
    }
    return model.update(id, data);
  },
};
