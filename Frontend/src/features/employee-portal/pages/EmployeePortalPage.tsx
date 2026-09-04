import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Lightbulb, ListTodo, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { apiErrorMessage } from "@/shared/api/client";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { employeePortalApi } from "../api/employee-portal.api";

export default function EmployeePortalPage() {
  const { t, i18n } = useTranslation();
  const tasks = useApiResource(
    useCallback(() => employeePortalApi.tasks(), []),
  );
  const ideas = useApiResource(
    useCallback(() => employeePortalApi.ideas(), []),
  );
  const warnings = useApiResource(
    useCallback(() => employeePortalApi.warnings(), []),
  );
  const [saving, setSaving] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const form = e.currentTarget,
      fd = new FormData(form);
    try {
      await employeePortalApi.submitIdea({
        title: String(fd.get("title")),
        description: String(fd.get("description")),
      });
      form.reset();
      await ideas.refresh();
      toast.success(t("employeePortal.ideaSent"));
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };
  const date = (value: string) =>
    new Intl.DateTimeFormat(i18n.resolvedLanguage, {
      dateStyle: "medium",
    }).format(new Date(value));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("employeePortal.title")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("employeePortal.subtitle")}
        </p>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="text-primary" />
              {t("employeePortal.myTasks")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!tasks.data?.length ? (
              <p className="text-sm text-muted-foreground">
                {t("employeePortal.noTasks")}
              </p>
            ) : (
              tasks.data.map((task) => (
                <div
                  key={task.id}
                  className="block w-full rounded-xl border p-3 text-start"
                >
                  <div className="flex justify-between gap-2">
                    <b className="text-sm">{task.title}</b>
                    <Badge variant="secondary">
                      {t(`tasks.statuses.${task.status}`)}
                    </Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {task.description}
                  </p>
                  {task.dueDate && (
                    <small>
                      {t("employeePortal.due")} {date(task.dueDate)}
                    </small>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="text-primary" />
              {t("employeePortal.submitIdea")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={submit}>
              <Input
                name="title"
                placeholder={t("employeePortal.ideaTitle")}
                required
              />
              <textarea
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                name="description"
                placeholder={t("employeePortal.ideaDescription")}
                rows={5}
                required
              />
              <Button className="w-full" disabled={saving}>
                {t("employeePortal.sendIdea")}
              </Button>
            </form>
            <div className="mt-4 space-y-2">
              {ideas.data?.map((idea) => (
                <div key={idea.id} className="rounded-lg bg-muted p-3">
                  <div className="flex justify-between">
                    <b className="text-sm">{idea.title}</b>
                    <Badge variant="outline">{idea.status}</Badge>
                  </div>
                  <small className="text-muted-foreground">
                    {date(idea.createdAt)}
                  </small>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TriangleAlert className="text-amber-500" />
              {t("employeePortal.warnings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!warnings.data?.length ? (
              <p className="text-sm text-muted-foreground">
                {t("employeePortal.noWarnings")}
              </p>
            ) : (
              warnings.data.map((item) => (
                <div
                  key={item.warningId}
                  className={`rounded-xl border p-3 ${item.warning.severity === "urgent" ? "border-destructive/50 bg-destructive/5" : "border-amber-500/30 bg-amber-500/5"}`}
                >
                  <div className="flex justify-between gap-2">
                    <b>{item.warning.title}</b>
                    <Badge
                      variant={
                        item.warning.severity === "urgent"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {item.warning.severity}
                    </Badge>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm">
                    {item.warning.message}
                  </p>
                  <small className="mt-2 block text-muted-foreground">
                    {item.warning.sender.name} · {date(item.warning.createdAt)}
                  </small>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
