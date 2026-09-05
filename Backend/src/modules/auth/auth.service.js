import { getSettings } from "../settings/settings.service.js";
import { createPinLookup, signToken } from "../../shared/security/token.js";
import { verifySecret } from "../../shared/security/password.js";
import { authModel } from "./auth.model.js";
import { presentUser } from "./auth.presenter.js";

const httpError = (message, status) =>
  Object.assign(new Error(message), { status });
export const authService = {
  present: presentUser,
  async login(input) {
    const user =
      input.method === "credentials"
        ? await authModel.findByLogin(input.username)
        : await authModel.findByPinLookup(createPinLookup(input.pin));
    const valid =
      input.method === "credentials"
        ? user && (await verifySecret(input.password, user.passwordHash))
        : user?.pinHash && (await verifySecret(input.pin, user.pinHash));
    if (!valid)
      throw httpError(
        input.method === "credentials"
          ? "Invalid username or password."
          : "Invalid PIN.",
        401,
      );
    if (user.status !== "active")
      throw httpError("This account is inactive.", 403);
    const remember = input.method === "credentials" && input.remember;
    const security = await getSettings("security");
    const maxAge = (remember ? security.rememberDays * 86400 : security.sessionHours * 3600) * 1000;
    return {
      maxAge,
      user: presentUser(user),
      token: signToken(user.id, remember, maxAge / 1000),
      remember,
    };
  },
  async profile(userId) {
    const user = await authModel.getProfile(userId);
    return { ...presentUser(user), employee: user.employee };
  },
  async updateProfile(userId, input) {
    const user = await authModel.updateProfile(userId, {
      ...input,
      department: input.department || null,
    });
    return { ...presentUser(user), employee: user.employee };
  },
  async profileEvents(userId) {
    const employee = await authModel.getEmployeeIdentity(userId);
    if (!employee) return [];
    const fullName = `${employee.firstName} ${employee.lastName}`.trim();
    const people = await authModel.findMatchingPeople(
      employee.id,
      employee.employeeCode,
      fullName,
    );
    const numbers = [
      ...new Set(
        [
          employee.employeeCode,
          ...employee.devicePeople.map((x) => x.employeeNo),
          ...people.map((x) => x.employeeNo),
        ].filter(Boolean),
      ),
    ];
    return authModel.findEvents(numbers);
  },
};
