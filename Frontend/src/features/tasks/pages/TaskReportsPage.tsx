import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { tasksApi, type TaskReport } from "../api/tasks.api";
import { FormDatePicker } from "@/shared/components/ui/form-date-picker";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
const hours = (minutes: number) =>
  (minutes / 60).toLocaleString(undefined, { maximumFractionDigits: 1 });
export default function TaskReportsPage() {
  const { t } = useTranslation();
  const [month, setMonth] = useState(() =>
      new Date().toISOString().slice(0, 7),
    ),
    [report, setReport] = useState<TaskReport | null>(null);
  useEffect(() => {
    tasksApi.report(month).then(setReport);
  }, [month]);
  return (
    <div className="space-y-5 p-4 md:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t("tasks.report.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("tasks.report.subtitle")}
          </p>
        </div>
        <label className="grid min-w-52 gap-1 text-sm">
          {t("tasks.report.month")}
          <FormDatePicker mode="month" value={month} onValueChange={setMonth} />
        </label>
      </header>
      {report && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            {[
              ["created", report.summary.created],
              ["completed", report.summary.completed],
              ["overdue", report.summary.overdue],
              ["completionRate", `${report.summary.completionRate}%`],
              ["estimatedHours", hours(report.summary.estimatedMinutes)],
              ["trackedHours", hours(report.summary.trackedMinutes)],
            ].map(([key, value]) => (
              <Card key={key}>
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs text-muted-foreground">
                    {t(`tasks.report.${key}`)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                  {value}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <section className="overflow-hidden rounded-xl border bg-card">
              <h2 className="border-b p-4 font-semibold">
                {t("tasks.report.employeePerformance")}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-start">
                      <th className="p-3 text-start">
                        {t("navigation.employees")}
                      </th>
                      <th className="p-3 text-start">
                        {t("tasks.report.hours")}
                      </th>
                      <th className="p-3 text-start">
                        {t("tasks.report.entries")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.employees.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="h-24 text-center text-muted-foreground"
                        >
                          {t("tasks.report.noData")}
                        </td>
                      </tr>
                    )}
                    {report.employees.map((x) => (
                      <tr key={x.employeeId} className="border-b last:border-0">
                        <td className="p-3">{x.employeeName}</td>
                        <td className="p-3">{hours(x.minutes)}</td>
                        <td className="p-3">{x.entries}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="overflow-hidden rounded-xl border bg-card">
              <h2 className="border-b p-4 font-semibold">
                {t("tasks.report.teamPerformance")}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-start">
                        {t("tasks.fields.team")}
                      </th>
                      <th className="p-3 text-start">
                        {t("tasks.report.assigned")}
                      </th>
                      <th className="p-3 text-start">
                        {t("tasks.report.completed")}
                      </th>
                      <th className="p-3 text-start">
                        {t("tasks.report.hours")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.teams.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="h-24 text-center text-muted-foreground"
                        >
                          {t("tasks.report.noData")}
                        </td>
                      </tr>
                    )}
                    {report.teams.map((x) => (
                      <tr key={x.team} className="border-b last:border-0">
                        <td className="p-3">{t(`tasks.teams.${x.team}`)}</td>
                        <td className="p-3">{x.assigned}</td>
                        <td className="p-3">{x.completed}</td>
                        <td className="p-3">{hours(x.minutes)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
