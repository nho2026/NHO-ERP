import type { LoginRequest, LoginResponse } from "../types/auth.types";
import { apiClient } from "@/shared/api/client";
import axios from "axios";
import type { AttendanceEvent } from "@/features/attendance/api/attendance.api";

export class AuthApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  try {
    const { data } = await apiClient.post<LoginResponse>(
      "/auth/login",
      payload,
    );
    if (!data.user)
      throw new AuthApiError(
        "The server returned an invalid login response.",
        502,
      );
    return data;
  } catch (error) {
    if (error instanceof AuthApiError) throw error;
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new AuthApiError(
        error.response?.data?.message ??
          "Unable to sign in. Check your details and try again.",
        error.response?.status ?? 0,
      );
    }
    throw error;
  }
}

export async function getCurrentUser(): Promise<LoginResponse["user"]> {
  const { data } = await apiClient.get<LoginResponse>("/auth/me");
  return data.user;
}

export async function getProfile(): Promise<LoginResponse["user"]> {
  return (await apiClient.get<LoginResponse>("/auth/profile")).data.user;
}
export async function updateProfile(payload: {
  name: string;
  email: string;
  department: string | null;
}): Promise<LoginResponse["user"]> {
  return (await apiClient.patch<LoginResponse>("/auth/profile", payload)).data
    .user;
}
export async function getProfileEvents(): Promise<AttendanceEvent[]> {
  return (await apiClient.get<AttendanceEvent[]>("/auth/profile/events")).data;
}
export async function changeOwnPassword(
  userId: string,
  payload: { currentPassword: string; newPassword: string },
): Promise<void> {
  await apiClient.post(`/users/${userId}/password`, payload);
}

export async function logoutUser(): Promise<void> {
  await apiClient.post("/auth/logout");
}
