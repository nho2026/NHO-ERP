import { useCallback, useMemo, useState } from "react";
import { Printer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { attendancePermissionsApi, hrApi } from "../api/hr.api";
import { attendanceApi } from "@/features/attendance/api/attendance.api";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { MonthPicker } from "@/shared/components/ui/month-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { printDocument } from "@/features/accounting/components/print-document";
import {
  activeSalaryFor,
  deviceAttendanceRecords,
  duration,
  employeeLabel,
  lostMinutes,
  monthValue,
  payrollAmounts,
  scheduledMinutes,
} from "./monthly-hr";

export default function PayrollPage() {
  const { t, i18n } = useTranslation();
  const tx = (key: string, fallback: string) =>
    t(`hrMonthly.${key}`, { defaultValue: fallback });
  const [month, setMonth] = useState(monthValue());
  const employees = useApiResource(
    useCallback(() => hrApi.employees.list(), []),
  );
  const salaries = useApiResource(useCallback(() => hrApi.salaries.list(), []));
  const adjustments = useApiResource(
    useCallback(() => {
      const [year, selectedMonth] = month.split("-");
      return hrApi.adjustments.list({
        year: Number(year),
        month: Number(selectedMonth),
      });
    }, [month]),
  );
  const permissions = useApiResource(
    useCallback(
      () =>
        attendancePermissionsApi.list({
          from: `${month}-01`,
          to: `${month}-31`,
          status: "approved",
        }),
      [month],
    ),
  );
  const people = useApiResource(useCallback(() => attendanceApi.people(), []));
  const events = useApiResource(
    useCallback(
      () => attendanceApi.events({ from: `${month}-01`, to: `${month}-31` }),
      [month],
    ),
  );
  const deviceRecords = useMemo(
    () =>
      deviceAttendanceRecords(
        events.data ?? [],
        people.data ?? [],
        employees.data ?? [],
        month,
      ),
    [events.data, people.data, employees.data, month],
  );
  const rows = useMemo(
    () =>
      (employees.data ?? [])
        .filter((employee) =>
          Boolean(activeSalaryFor(employee.id, salaries.data ?? [], month)),
        )
        .map((employee) => {
          const salary = activeSalaryFor(
            employee.id,
            salaries.data ?? [],
            month,
          );
          const records = deviceRecords.filter(
            (record) => record.employeeId === employee.id,
          );
          const minutesLost = records.reduce(
            (sum, row) => sum + lostMinutes(row, permissions.data ?? []),
            0,
          );
          const employeeAdjustments = (adjustments.data ?? []).filter(
            (adjustment) => adjustment.employeeId === employee.id,
          );
          const rewardAmount = employeeAdjustments
            .filter((adjustment) => adjustment.type === "reward")
            .reduce((sum, adjustment) => sum + Number(adjustment.amount), 0);
          const punishmentAmount = employeeAdjustments
            .filter((adjustment) => adjustment.type === "punishment")
            .reduce((sum, adjustment) => sum + Number(adjustment.amount), 0);
          return {
            employee,
            salary,
            minutesLost,
            adjustments: employeeAdjustments,
            ...payrollAmounts(
              Number(salary?.baseSalary ?? 0),
              minutesLost,
              scheduledMinutes(employee) / 60,
              rewardAmount,
              punishmentAmount,
            ),
          };
        }),
    [
      adjustments.data,
      employees.data,
      salaries.data,
      deviceRecords,
      month,
      permissions.data,
    ],
  );
  const money = (value: number, currency?: unknown) =>
    `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${String(currency ?? "")}`.trim();
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {tx("payrollTitle", "Monthly payroll")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {tx(
              "payrollSubtitle",
              "All employees, with salary automatically adjusted from monthly attendance.",
            )}
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <MonthPicker
            value={month}
            onValueChange={setMonth}
            locale={i18n.resolvedLanguage}
            label={tx("attendanceMonth", "Attendance month")}
            className="flex-1 sm:flex-none"
          />
          <Button
            type="button"
            variant="outline"
            className="h-11 gap-2 px-4"
            onClick={printDocument}
          >
            <Printer className="size-4" />
            {tx("print", "Print")}
          </Button>
        </div>
      </div>
      {(employees.error ||
        salaries.error ||
        adjustments.error ||
        people.error ||
        events.error) && (
        <p className="text-sm text-destructive">
          {employees.error ||
            salaries.error ||
            adjustments.error ||
            people.error ||
            events.error}
        </p>
      )}
      <Card className="print-document print-document-visible salary-list-print">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>{t("hr.employee")}</TableHead>
                  <TableHead>{t("hr.baseSalary")}</TableHead>
                  <TableHead>{tx("lostHours", "Lost hours")}</TableHead>
                  <TableHead>{tx("hourlyRate", "Hourly rate")}</TableHead>
                  <TableHead>
                    {tx("attendanceDeduction", "Attendance deduction")}
                  </TableHead>
                  <TableHead>{tx("rewards", "Rewards")}</TableHead>
                  <TableHead>{tx("punishments", "Punishments")}</TableHead>
                  <TableHead>{tx("adjustmentReasons", "Reasons")}</TableHead>
                  <TableHead>{t("hr.net")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={row.employee.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <p className="font-medium">
                        {employeeLabel(row.employee)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {String(row.employee.employeeCode)}
                      </p>
                    </TableCell>
                    {row.salary ? (
                      <>
                        <TableCell>
                          {money(
                            Number(row.salary.baseSalary),
                            row.salary.currencyId,
                          )}
                        </TableCell>
                        <TableCell>{duration(row.minutesLost)}</TableCell>
                        <TableCell>
                          {money(row.hourlyRate, row.salary.currencyId)}
                        </TableCell>
                        <TableCell className="text-destructive">
                          − {money(row.deduction, row.salary.currencyId)}
                        </TableCell>
                        <TableCell className="text-emerald-700">
                          + {money(row.rewardAmount, row.salary.currencyId)}
                        </TableCell>
                        <TableCell className="text-destructive">
                          − {money(row.punishmentAmount, row.salary.currencyId)}
                        </TableCell>
                        <TableCell className="min-w-56">
                          {row.adjustments.length ? (
                            <ul className="space-y-1 text-xs">
                              {row.adjustments.map((adjustment) => (
                                <li key={adjustment.id}>
                                  <span
                                    className={
                                      adjustment.type === "reward"
                                        ? "font-semibold text-emerald-700"
                                        : "font-semibold text-destructive"
                                    }
                                  >
                                    {adjustment.type === "reward" ? "+" : "−"}
                                    {money(
                                      Number(adjustment.amount),
                                      row.salary?.currencyId,
                                    )}
                                  </span>{" "}
                                  — {String(adjustment.reason)}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="font-bold text-emerald-700">
                          {money(row.netSalary, row.salary.currencyId)}
                        </TableCell>
                      </>
                    ) : (
                      <TableCell colSpan={8} className="text-muted-foreground">
                        {tx("noSalary", "No active salary for this month")}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
