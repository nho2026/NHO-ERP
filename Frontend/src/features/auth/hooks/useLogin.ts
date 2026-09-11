import { toast } from "sonner";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthApiError, loginUser } from "../api/auth.api";
import type { AuthUser, LoginRequest } from "../types/auth.types";

export function useLogin() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (request: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loginUser(request);
      setUser(result.user);
      sessionStorage.setItem("nho-current-user", JSON.stringify(result.user));
      toast.success(t("auth.loginSuccess"));
      return result.user;
    } catch (cause) {
      const message =
        cause instanceof AuthApiError
          ? cause.message
          : t("auth.errors.unavailable");
      setError(message);
      toast.error(message, { id: "login-error" });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error, user, clearError: () => setError(null) };
}
