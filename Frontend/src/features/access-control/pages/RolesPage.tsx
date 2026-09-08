import { useCallback, useMemo, useState, type FormEvent } from "react";
import { Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { permissionsApi, rolesApi } from "../api/access.api";
import type { Permission, Role } from "../types/access.types";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { apiErrorMessage } from "@/shared/api/client";
import { hasPermission, storedUser } from "@/features/auth/access";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { DeleteConfirmationDialog } from "@/shared/components/ui/confirmation-dialog";
import { ResourceState } from "@/shared/components/ui/table-resource-state";
import {
  PaginationControls,
  usePaginatedItems,
} from "@/shared/components/ui/pagination-controls";

export default function RolesPage() {
  const { t } = useTranslation();
  const user = storedUser();
  const canCreate = hasPermission(user, "roles.create");
  const canUpdate = hasPermission(user, "roles.update");
  const canAssign = hasPermission(user, "roles.assign_permissions");
  const canDelete = hasPermission(user, "roles.delete");
  const roles = useApiResource(useCallback(() => rolesApi.list(), []));
  const permissions = useApiResource(
    useCallback(
      () =>
        hasPermission(storedUser(), "permissions.view")
          ? permissionsApi.list()
          : Promise.resolve([]),
      [],
    ),
  );
  const pagination = usePaginatedItems(roles.data ?? undefined);
  const [editing, setEditing] = useState<Role | null | undefined>();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const groups = useMemo(
    () =>
      (permissions.data ?? []).reduce<Record<string, Permission[]>>(
        (result, permission) => {
          (result[permission.module] ??= []).push(permission);
          return result;
        },
        {},
      ),
    [permissions.data],
  );
  const openEditor = (role: Role | null) => {
    setEditing(role);
    setSelected(new Set(role?.permissionItems?.map(({ id }) => id) ?? []));
    setError("");
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    try {
      if (editing) {
        if (canUpdate) await rolesApi.update(editing.id, { name, description });
        if (canAssign)
          await rolesApi.assignPermissions(editing.id, [...selected]);
      } else {
        await rolesApi.create({
          name,
          description,
          permissionIds: [...selected],
        });
      }
      setEditing(undefined);
      await roles.refresh();
    } catch (cause) {
      setError(apiErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("rolesAdmin.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("rolesAdmin.description")}
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => openEditor(null)}>
            <Plus />
            {t("rolesAdmin.new")}
          </Button>
        )}
      </div>
      <ResourceState
        isLoading={roles.isLoading}
        error={roles.error}
        isEmpty={!roles.data?.length}
      />
      {!roles.isLoading && !roles.error && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pagination.pageItems.map((role) => (
            <Card key={role.id}>
              <CardHeader className="flex-row items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" />
                </span>
                <Badge variant="outline">
                  {t("rolesAdmin.usersCount", { count: role.users })}
                </Badge>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base">{role.name}</CardTitle>
                <p className="mt-2 min-h-10 text-sm text-muted-foreground">
                  {role.description || t("rolesAdmin.noDescription")}
                </p>
                <div className="mt-5 flex items-center gap-2 border-t pt-4">
                  <span className="me-auto text-xs text-muted-foreground">
                    {t("rolesAdmin.permissionsCount", {
                      count: role.permissions,
                    })}
                  </span>
                  {(canUpdate || canAssign) && (
                    <Button data-action="edit"
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditor(role)}
                    >
                      <Pencil />
                    </Button>
                  )}
                  {canDelete && role.name !== "Super Administrator" && (
                    <DeleteConfirmationDialog
                      description={`Delete role ${role.name}?`}
                      onConfirm={async () => {
                        await rolesApi.remove(role.id);
                        await roles.refresh();
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <PaginationControls
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        onPageChange={pagination.setPage}
      />
      <Dialog
        open={editing !== undefined}
        onOpenChange={(open) => !open && !busy && setEditing(undefined)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? t("rolesAdmin.manage") : t("rolesAdmin.new")}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submit}>
            <Input
              name="name"
              defaultValue={editing?.name}
              placeholder={t("pageText.roleName")}
              required
              disabled={Boolean(editing) && !canUpdate}
            />
            <textarea
              name="description"
              defaultValue={editing?.description ?? ""}
              placeholder={t("pageText.description")}
              disabled={Boolean(editing) && !canUpdate}
              className="min-h-20 w-full rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
            {canAssign && (
              <div className="max-h-72 space-y-4 overflow-y-auto rounded-xl border p-4">
                {Object.entries(groups).map(([module, items]) => (
                  <fieldset key={module} className="space-y-2">
                    <legend className="mb-2 text-sm font-bold text-primary">
                      {module}
                    </legend>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {items?.map((permission) => (
                        <label
                          key={permission.id}
                          className="flex cursor-pointer items-center gap-2 rounded-lg bg-muted/50 p-2 text-xs"
                        >
                          <Checkbox
                            checked={selected.has(permission.id)}
                            onCheckedChange={(checked) =>
                              setSelected((current) => {
                                const next = new Set(current);
                                checked
                                  ? next.add(permission.id)
                                  : next.delete(permission.id);
                                return next;
                              })
                            }
                          />
                          <span>{permission.name}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full" disabled={busy}>
              {busy ? t("usersAdmin.saving") : t("common.save")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
