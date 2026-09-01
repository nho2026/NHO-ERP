import { apiClient } from "@/shared/api/client";
import type { Page } from "@/shared/api/pagination";
export type CrmRecord = Record<string, unknown> & { id: string };
export type CrmResource = "leads" | "patients" | "surgeries" | "surgery-appointments" | "payments";
const resource = (name: CrmResource) => ({
  list: (page = 1, pageSize = 50) => apiClient.get<Page<CrmRecord>>(`/crm/${name}`, { params: { page, pageSize } }).then(({ data }) => data),
  create: (payload: Record<string, unknown>) => apiClient.post(`/crm/${name}`, payload),
  update: (id: string, payload: Record<string, unknown>) => apiClient.patch(`/crm/${name}/${id}`, payload),
  remove: (id: string) => apiClient.delete(`/crm/${name}/${id}`),
});
export const crmApi = {
  leads: resource("leads"), patients: resource("patients"), surgeries: resource("surgeries"),
  "surgery-appointments": resource("surgery-appointments"), payments: resource("payments"),
  lookups: () => apiClient.get<Record<string, CrmRecord[]>>("/crm/lookups").then(({ data }) => data),
};
