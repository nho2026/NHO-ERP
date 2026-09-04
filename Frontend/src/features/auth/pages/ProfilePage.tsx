import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  BriefcaseBusiness,
  CalendarDays,
  KeyRound,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { apiErrorMessage } from "@/shared/api/client";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { TableResourceState } from "@/shared/components/ui/table-resource-state";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  changeOwnPassword,
  getProfile,
  getProfileEvents,
  updateProfile,
} from "../api/auth.api";
import type { AuthUser } from "../types/auth.types";
import { employeePortalApi } from "@/features/employee-portal/api/employee-portal.api";

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const profile = useApiResource(useCallback(() => getProfile(), []));
  const events = useApiResource(useCallback(() => getProfileEvents(), []));
  const warnings = useApiResource(
    useCallback(() => employeePortalApi.warnings(), []),
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (profile.data) setUser(profile.data);
  }, [profile.data]);
  const initials = useMemo(
    () =>
      user?.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() ?? "—",
    [user?.name],
  );
  const employee = user?.employee;
  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    try {
      const updated = await updateProfile({
        name: String(form.get("name")),
        email: String(form.get("email")),
        department: String(form.get("department") || "") || null,
      });
      setUser(updated);
      sessionStorage.setItem("nho-current-user", JSON.stringify(updated));
      setEditing(false);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };
  const savePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const next = String(form.get("newPassword"));
    if (next !== String(form.get("confirmPassword")))
      return toast.error(t("profile.passwordMismatch"));
    setSaving(true);
    try {
      await changeOwnPassword(user.id, {
        currentPassword: String(form.get("currentPassword")),
        newPassword: next,
      });
      formElement.reset();
      toast.success(t("profile.passwordUpdated"));
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <Card className="overflow-hidden border-0 shadow-sm">
        <div className="h-32 bg-[linear-gradient(120deg,#07599a,#1596b7,#20b4b8)]" />
        <CardContent className="relative flex flex-wrap items-end gap-5 px-6 pb-6">
          <Avatar className="-mt-14 size-28 border-4 border-card shadow-lg">
            <AvatarFallback className="bg-primary text-3xl font-bold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-bold">
                {user?.name ?? t("resourceState.loading")}
              </h1>
              <Badge>{user?.status ?? "active"}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              @{user?.username} · {user?.role ?? t("profile.noRole")}
            </p>
          </div>
          <Button
            variant={editing ? "secondary" : "outline"}
            onClick={() => setEditing((value) => !value)}
          >
            <Pencil />
            {editing ? t("profile.cancel") : t("profile.edit")}
          </Button>
        </CardContent>
      </Card>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserRound className="text-primary" />
                {t("profile.personalInformation")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.isLoading ? (
                <div className="h-36 animate-pulse rounded-xl bg-muted" />
              ) : (
                <form
                  className="grid gap-4 sm:grid-cols-2"
                  onSubmit={saveProfile}
                >
                  <label className="space-y-1 text-xs font-medium">
                    {t("profile.fullName")}
                    <Input
                      name="name"
                      defaultValue={user?.name ?? ""}
                      disabled={!editing}
                      required
                    />
                  </label>
                  <label className="space-y-1 text-xs font-medium">
                    {t("profile.email")}
                    <Input
                      name="email"
                      type="email"
                      defaultValue={user?.email ?? ""}
                      disabled={!editing}
                      required
                    />
                  </label>
                  <label className="space-y-1 text-xs font-medium sm:col-span-2">
                    {t("profile.department")}
                    <Input
                      name="department"
                      defaultValue={
                        user?.department ?? employee?.department?.name ?? ""
                      }
                      disabled={!editing}
                    />
                  </label>
                  {editing && (
                    <Button className="sm:col-span-2" disabled={saving}>
                      {saving ? t("profile.saving") : t("profile.save")}
                    </Button>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="text-primary" />
                {t("profile.recentAttendance")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("profile.event")}</TableHead>
                    <TableHead>{t("profile.device")}</TableHead>
                    <TableHead>{t("profile.verification")}</TableHead>
                    <TableHead>{t("profile.dateTime")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableResourceState
                    isLoading={events.isLoading}
                    error={events.error}
                    isEmpty={!events.data?.length}
                    colSpan={4}
                  />
                  {events.data?.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Badge variant="secondary">
                          {t(`profile.${event.eventType}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>{event.device.name}</TableCell>
                      <TableCell>{event.verification || "—"}</TableCell>
                      <TableCell>
                        {new Intl.DateTimeFormat(i18n.resolvedLanguage, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(event.occurredAt))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BriefcaseBusiness className="text-primary" />
                {t("profile.employment")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                [ShieldCheck, t("profile.role"), user?.role],
                [UserRound, t("profile.employeeCode"), employee?.employeeCode],
                [
                  BriefcaseBusiness,
                  t("profile.position"),
                  employee?.position?.name,
                ],
                [MapPin, t("profile.department"), employee?.department?.name],
                [
                  CalendarDays,
                  t("profile.hireDate"),
                  employee?.hireDate
                    ? new Intl.DateTimeFormat(i18n.resolvedLanguage, {
                        dateStyle: "medium",
                      }).format(new Date(employee.hireDate))
                    : null,
                ],
                [Mail, t("profile.email"), user?.email],
              ].map(([Icon, label, value], index) => {
                const ItemIcon = Icon as typeof ShieldCheck;
                return (
                  <div
                    className="flex items-center gap-3 rounded-xl bg-muted/60 p-3"
                    key={index}
                  >
                    <ItemIcon className="size-4 text-primary" />
                    <div>
                      <small className="block text-muted-foreground">
                        {String(label)}
                      </small>
                      <b className="text-sm">{String(value || "—")}</b>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t("employeePortal.warnings")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!warnings.data?.length ? (
                <p className="text-sm text-muted-foreground">
                  {t("employeePortal.noWarnings")}
                </p>
              ) : (
                warnings.data.slice(0, 5).map((item) => (
                  <div
                    key={item.warningId}
                    className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3"
                  >
                    <div className="flex justify-between gap-2">
                      <b className="text-sm">{item.warning.title}</b>
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
                    <p className="mt-1 text-xs">{item.warning.message}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <KeyRound className="text-primary" />
                {t("profile.security")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={savePassword}>
                <Input
                  name="currentPassword"
                  type="password"
                  placeholder={t("profile.currentPassword")}
                  required
                />
                <Input
                  name="newPassword"
                  type="password"
                  minLength={8}
                  placeholder={t("profile.newPassword")}
                  required
                />
                <Input
                  name="confirmPassword"
                  type="password"
                  minLength={8}
                  placeholder={t("profile.confirmPassword")}
                  required
                />
                <Button className="w-full" variant="outline" disabled={saving}>
                  {t("profile.changePassword")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
