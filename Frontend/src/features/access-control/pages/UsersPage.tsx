import { useCallback, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { usersApi, rolesApi } from "../api/access.api";
import type { User } from "../types/access.types";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { apiErrorMessage } from "@/shared/api/client";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { TableResourceState } from "@/shared/components/ui/table-resource-state";
import { DeleteConfirmationDialog } from "@/shared/components/ui/confirmation-dialog";
import { useTranslation } from "react-i18next";
import { hasPermission, storedUser } from "@/features/auth/access";
import { healthcareApi } from "@/features/healthcare/api/healthcare.api";
export default function UsersPage() {
  const { t } = useTranslation();
  const currentUser = storedUser();
  const canCreate = hasPermission(currentUser, "users.create");
  const canUpdate = hasPermission(currentUser, "users.update");
  const canDelete = hasPermission(currentUser, "users.delete");
  const canViewRoles = hasPermission(currentUser, "roles.view");
  const canEditUsers = canCreate || canUpdate;
  const users = useApiResource(useCallback(() => usersApi.list(), [])),
    roles = useApiResource(
      useCallback(
        () => (canViewRoles ? rolesApi.list() : Promise.resolve([])),
        [canViewRoles],
      ),
    ),
    departments = useApiResource(
      useCallback(
        () =>
          canEditUsers ? healthcareApi.departments.list() : Promise.resolve([]),
        [canEditUsers],
      ),
    );
  const [search, setSearch] = useState(""),
    [editing, setEditing] = useState<User | null | undefined>(undefined),
    [roleId, setRoleId] = useState(""),
    [department, setDepartment] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const filtered = useMemo(
    () =>
      users.data?.filter((u) =>
        `${u.name} ${u.username} ${u.email}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ) ?? [],
    [users.data, search],
  );
  const openEditor = (user: User | null) => {
    setEditing(user);
    setRoleId(user?.roles?.[0]?.id ?? "");
    setDepartment(user?.department ?? "");
    setError("");
  };
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const data = {
      username: String(f.get("username")),
      email: String(f.get("email")),
      name: String(f.get("name")),
      department,
      status: String(f.get("status")),
      roleIds: roleId ? [roleId] : [],
      ...(!editing && { password: String(f.get("password")) }),
      ...(editing &&
        f.get("password") && { password: String(f.get("password")) }),
    };
    try {
      editing
        ? await usersApi.update(editing.id, data)
        : await usersApi.create(data);
      setEditing(undefined);
      await users.refresh();
    } catch (c) {
      setError(apiErrorMessage(c));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("usersAdmin.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("usersAdmin.description")}
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => openEditor(null)}>
            <Plus />
            {t("usersAdmin.add")}
          </Button>
        )}
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="relative m-4 max-w-sm">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2" />
            <Input
              className="ps-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("usersAdmin.search")}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.headers.user")}</TableHead>
                <TableHead>{t("table.headers.role")}</TableHead>
                <TableHead>{t("table.headers.department")}</TableHead>
                <TableHead>{t("table.headers.status")}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableResourceState
                isLoading={users.isLoading}
                error={users.error}
                isEmpty={!filtered.length}
                colSpan={5}
              />
              {!users.isLoading &&
                !users.error &&
                filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {u.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <b>{u.name}</b>
                          <small className="block text-muted-foreground">
                            @{u.username} · {u.email}
                          </small>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{u.role ?? "—"}</TableCell>
                    <TableCell>{u.department || "—"}</TableCell>
                    <TableCell>
                      <Badge>{u.status}</Badge>
                    </TableCell>
                    <TableCell className="text-end">
                      <div className="flex flex-wrap items-center gap-2 justify-end">
                        {canUpdate && (
                          <Button data-action="edit"
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditor(u)}
                          >
                            <Pencil />
                          </Button>
                        )}
                        {canDelete && (
                          <DeleteConfirmationDialog
                            description={t("usersAdmin.deleteConfirm", {
                              name: u.name,
                            })}
                            onConfirm={async () => {
                              try {
                                await usersApi.remove(u.id);
                                await users.refresh();
                              } catch (c) {
                                setError(apiErrorMessage(c));
                              }
                            }}
                          >
                            <Button data-action="delete"
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                            >
                              <Trash2  className="size-4 text-white" />
                            </Button>
                          </DeleteConfirmationDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog
        open={editing !== undefined}
        onOpenChange={(v) => {
          if (!v) setEditing(undefined);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t(editing ? "usersAdmin.edit" : "usersAdmin.add")}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-3" onSubmit={submit}>
            <Input
              name="name"
              defaultValue={editing?.name}
              placeholder={t("usersAdmin.fullName")}
              required
            />
            <Input
              name="username"
              defaultValue={editing?.username}
              placeholder={t("usersAdmin.username")}
              required
            />
            <Input
              name="email"
              type="email"
              defaultValue={editing?.email}
              placeholder={t("usersAdmin.email")}
              required
            />
            <Select
              value={department || "none"}
              onValueChange={(value) =>
                setDepartment(value === "none" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("usersAdmin.department")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                {departments.data?.map((item) => (
                  <SelectItem key={item.id} value={String(item.name)}>
                    {String(item.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              name="password"
              type="password"
              placeholder={
                editing
                  ? t("usersAdmin.newPasswordOptional")
                  : t("usersAdmin.passwordMinimum")
              }
              required={!editing}
            />
            <Select value={roleId} onValueChange={setRoleId}>
              <SelectTrigger>
                <SelectValue placeholder={t("usersAdmin.chooseRole")} />
              </SelectTrigger>
              <SelectContent>
                {roles.data?.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select name="status" defaultValue={editing?.status ?? "active"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">
                  {t("dashboard.status.active")}
                </SelectItem>
                <SelectItem value="inactive">
                  {t("dashboard.status.inactive")}
                </SelectItem>
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full" disabled={busy}>
              {busy
                ? t("usersAdmin.saving")
                : t(editing ? "usersAdmin.update" : "usersAdmin.create")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
