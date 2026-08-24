import { financeModel } from "./finance.model.js";
export const financeService = {
  async analysis(year) {
    const [budgets, flows, forecasts, funding, accounts] =
        await financeModel.analysisData(year),
      accountTotal = (type) =>
        accounts
          .filter((a) => a.type === type)
          .reduce(
            (s, a) => s + a.lines.reduce((x, l) => x + l.credit - l.debit, 0),
            0,
          ),
      actualRevenue = accountTotal("revenue"),
      actualExpense = -accountTotal("expense"),
      plannedBudget = budgets.reduce((s, x) => s + x.plannedAmount, 0),
      inflow = flows
        .filter((x) => x.flowType === "inflow")
        .reduce((s, x) => s + x.amount, 0),
      outflow = flows
        .filter((x) => x.flowType === "outflow")
        .reduce((s, x) => s + x.amount, 0),
      projectedRevenue = forecasts.reduce((s, x) => s + x.projectedRevenue, 0),
      projectedExpense = forecasts.reduce((s, x) => s + x.projectedExpense, 0),
      committedFunding = funding.reduce((s, x) => s + x.committedAmount, 0),
      receivedFunding = funding.reduce((s, x) => s + x.receivedAmount, 0);
    return {
      year,
      plannedBudget,
      actualRevenue,
      actualExpense,
      actualNet: actualRevenue - actualExpense,
      budgetVariance: plannedBudget - actualExpense,
      inflow,
      outflow,
      netCashFlow: inflow - outflow,
      projectedRevenue,
      projectedExpense,
      projectedNet: projectedRevenue - projectedExpense,
      committedFunding,
      receivedFunding,
      fundingGap: committedFunding - receivedFunding,
    };
  },
};
