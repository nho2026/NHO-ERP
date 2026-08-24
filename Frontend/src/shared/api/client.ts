import axios from "axios";
import { toast } from "sonner";
import i18n from "@/i18n";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  timeout: 15_000,
});

export const apiErrorMessage = (error: unknown) =>
  axios.isAxiosError<{ message?: string }>(error)
    ? (error.response?.data?.message ??
      "The server is unavailable. Please try again.")
    : "Something went wrong. Please try again.";

const nonCrudAction = /\/(login|logout|sync|test|capture|password|time|checkout|check-in|check-out)(\/|$)|\/pos\/(sales|returns)(\/|$)/i;

apiClient.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    const url = response.config.url ?? "";
    if (!nonCrudAction.test(url)) {
      if (method === "post") toast.success(i18n.t("crudToast.created"));
      if (method === "put" || method === "patch")
        toast.success(i18n.t("crudToast.updated"));
      if (method === "delete") toast.success(i18n.t("crudToast.deleted"));
    }
    return response;
  },
  (error) => Promise.reject(error),
);
