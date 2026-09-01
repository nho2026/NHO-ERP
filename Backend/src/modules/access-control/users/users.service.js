import { hashSecret, verifySecret } from "../../../shared/security/password.js";
import { createPinLookup } from "../../../shared/security/token.js";
import { presentUser } from "../../auth/auth.presenter.js";
import { userModel } from "./users.model.js";
const forbidden = (message, status = 400) =>
  Object.assign(new Error(message), { status });
export const userService = {
  async list() {
    return (await userModel.findAll()).map(presentUser);
  },
  async create({ roleIds, pin, password, ...data }) {
    return presentUser(
      await userModel.create({
        ...data,
        passwordHash: await hashSecret(password),
        pinHash: pin ? await hashSecret(pin) : null,
        pinLookup: pin ? createPinLookup(pin) : null,
        roles: { create: roleIds.map((roleId) => ({ roleId })) },
      }),
    );
  },
  async update(id, { roleIds, pin, password, ...data }) {
    const update = { ...data };
    if (password) update.passwordHash = await hashSecret(password);
    if (pin !== undefined) {
      update.pinHash = pin ? await hashSecret(pin) : null;
      update.pinLookup = pin ? createPinLookup(pin) : null;
    }
    if (roleIds)
      update.roles = {
        deleteMany: {},
        create: roleIds.map((roleId) => ({ roleId })),
      };
    return presentUser(await userModel.update(id, update));
  },
  async remove(id, currentId) {
    if (id === currentId)
      throw forbidden("You cannot delete your own account.");
    await userModel.remove(id, currentId);
  },
  async changePassword(id, currentUser, input) {
    if (id !== currentUser.id) throw forbidden("Forbidden.", 403);
    if (!(await verifySecret(input.currentPassword, currentUser.passwordHash)))
      throw forbidden("Current password is incorrect.");
    await userModel.updatePassword(id, await hashSecret(input.newPassword));
  },
};
