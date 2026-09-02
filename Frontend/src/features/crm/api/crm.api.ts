import { apiClient } from "@/shared/api/client";
import type { Page } from "@/shared/api/pagination";
export type CrmRecord = Record<string, unknown> & { id: string };
export type CrmResource =
  "leads" | "patients" | "surgeries" | "surgery-appointments" | "payments";
export type CrmListFilters = Record<string, string | number | undefined>;
export type DynamicFormField = {
  id: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select" | "checkbox";
  required: boolean;
  options?: string[];
};
export type FormTemplate = CrmRecord & {
  code: string;
  name: string;
  description?: string | null;
  category: string;
  status: string;
  fields: DynamicFormField[];
  _count?: { submissions: number };
};
const resource = (name: CrmResource) => ({
  list: (page = 1, pageSize = 50, filters: CrmListFilters = {}) =>
    apiClient
      .get<Page<CrmRecord>>(`/crm/${name}`, {
        params: { page, pageSize, ...filters },
      })
      .then(({ data }) => data),
  get: (id: string) =>
    apiClient.get<CrmRecord>(`/crm/${name}/${id}`).then(({ data }) => data),
  create: (payload: Record<string, unknown>) =>
    apiClient.post(`/crm/${name}`, payload),
  update: (id: string, payload: Record<string, unknown>) =>
    apiClient.patch(`/crm/${name}/${id}`, payload),
  remove: (id: string) => apiClient.delete(`/crm/${name}/${id}`),
});
export const crmApi = {
  leads: resource("leads"),
  patients: resource("patients"),
  surgeries: resource("surgeries"),
  "surgery-appointments": resource("surgery-appointments"),
  payments: resource("payments"),
  lookups: () =>
    apiClient
      .get<Record<string, CrmRecord[]>>("/crm/lookups")
      .then(({ data }) => data),
};

export const crmFormsApi = {
  templates: () =>
    apiClient.get<FormTemplate[]>("/crm/forms").then(({ data }) => data),
  activeTemplates: () =>
    apiClient.get<FormTemplate[]>("/crm/forms/active").then(({ data }) => data),
  create: (payload: Omit<FormTemplate, "id">) =>
    apiClient.post("/crm/forms", payload),
  update: (id: string, payload: Partial<FormTemplate>) =>
    apiClient.patch(`/crm/forms/${id}`, payload),
  remove: (id: string) => apiClient.delete(`/crm/forms/${id}`),
  submissions: (patientId: string) =>
    apiClient
      .get<CrmRecord[]>(`/crm/forms/patient/${patientId}`)
      .then(({ data }) => data),
  submit: (patientId: string, payload: Record<string, unknown>) =>
    apiClient.post(`/crm/forms/patient/${patientId}`, payload),
  removeSubmission: (id: string) =>
    apiClient.delete(`/crm/forms/submissions/${id}`),
};
