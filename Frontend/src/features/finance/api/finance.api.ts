import { apiClient } from "@/shared/api/client";

export type FinanceResource = "budgets" | "cash-flow" | "forecasts" | "funding";
export type FinanceRecord = Record<string, unknown> & { id: string; status: string };
export type FinancePage = { items: FinanceRecord[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } };
export type FinanceAnalysis = {
  year: number; plannedBudget: number; actualRevenue: number; actualExpense: number; actualNet: number;
  budgetVariance: number; inflow: number; outflow: number; netCashFlow: number; projectedRevenue: number;
  projectedExpense: number; projectedNet: number; committedFunding: number; receivedFunding: number; fundingGap: number;
};

export const financeApi = {
  list: (resource: FinanceResource, page = 1, pageSize = 50) => apiClient.get<FinancePage>(`/finance/${resource}`, { params: { page, pageSize } }).then((r) => r.data),
  create: (resource: FinanceResource, data: Record<string, unknown>) => apiClient.post(`/finance/${resource}`, data),
  update: (resource: FinanceResource, id: string, data: Record<string, unknown>) => apiClient.patch(`/finance/${resource}/${id}`, data),
  remove: (resource: FinanceResource, id: string) => apiClient.delete(`/finance/${resource}/${id}`),
  analysis: (year: number) => apiClient.get<FinanceAnalysis>("/finance/analysis", { params: { year } }).then((r) => r.data),
};
