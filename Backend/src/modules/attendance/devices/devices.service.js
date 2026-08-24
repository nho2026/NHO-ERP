import { verifySecret } from "../../../shared/security/password.js";
import { HikvisionClient } from "../hikvision/hikvision.client.js";
import { deviceModel } from "./devices.model.js";
const safe = (d) => ({ ...d, password: undefined }),
  fail = (message, status) => {
    throw Object.assign(new Error(message), { status });
  };
const authorize = async (user, password) => {
  if (!user.roles.some(({ role }) => role.name === "Super Administrator"))
    fail("Only a Super Administrator can delete attendance records.", 403);
  if (!(await verifySecret(password, user.passwordHash)))
    fail("Super Administrator password is incorrect.", 403);
};
export const deviceService = {
  async list() {
    return (await deviceModel.findAll()).map(safe);
  },
  async create(data) {
    const info = await new HikvisionClient(data).info(),
      raw = info.DeviceInfo ?? info;
    return safe(
      await deviceModel.create({
        ...data,
        model: raw.model ?? "DS-K1T342MFWX-E1",
        serialNumber: raw.serialNumber,
        status: "online",
        lastSeenAt: new Date(),
      }),
    );
  },
  async update(id, data) {
    return safe(await deviceModel.update(id, data));
  },
  async remove(id, user, password) {
    await authorize(user, password);
    await deviceModel.remove(id);
  },
  async clearEvents(id, user, password) {
    await authorize(user, password);
    const clearedAt = new Date(),
      deleted = await deviceModel.clearEvents(id, clearedAt);
    return { deleted: deleted.count, clearedAt };
  },
  async test(id) {
    const d = await deviceModel.findById(id);
    try {
      const info = await new HikvisionClient(d).info();
      await deviceModel.update(id, {
        status: "online",
        lastSeenAt: new Date(),
      });
      return { online: true, info: info.DeviceInfo ?? info };
    } catch (error) {
      await deviceModel
        .update(id, { status: "offline" })
        .catch(() => undefined);
      throw error;
    }
  },
};
