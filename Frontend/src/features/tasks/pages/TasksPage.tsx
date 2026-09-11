import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { hasPermission, storedUser } from "@/features/auth/access";
import { tasksApi, type TaskEmployee, type TaskItem } from "../api/tasks.api";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { FormDatePicker } from "@/shared/components/ui/form-date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
const teams = [
    "marketing",
    "design",
    "content",
    "development",
    "photography",
    "other",
  ],
  statuses = ["todo", "in_progress", "review", "completed", "cancelled"],
  priorities = ["low", "medium", "high", "urgent"];
export default function TasksPage() {
  const { t } = useTranslation();
  const currentUser = storedUser();
  const isHr =
    hasPermission(currentUser, "employees.manage") ||
    Boolean(
      currentUser?.permissions?.some((key) => key.startsWith("hr.employees.")),
    );
  const canAssign = isHr || Boolean(currentUser?.employee?.isTeamLeader);
  const availableStatuses = isHr ? statuses : ["todo", "in_progress", "review"];
  const [items, setItems] = useState<TaskItem[]>([]),
    [employees, setEmployees] = useState<TaskEmployee[]>([]),
    [loading, setLoading] = useState(true),
    [open, setOpen] = useState(false),
    [search, setSearch] = useState(""),
    [status, setStatus] = useState(""),
    [team, setTeam] = useState("");
  const load = useCallback(async () => {
    try {
      const [data, staff] = await Promise.all([
        tasksApi.list({
          search,
          status: status || undefined,
          team: team || undefined,
          pageSize: 100,
        }),
        canAssign ? tasksApi.employees() : Promise.resolve([]),
      ]);
      setItems(data.items);
      setEmployees(staff);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("tasks.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [canAssign, search, status, t, team]);
  useEffect(() => {
    // Refresh the server-backed list whenever its filters change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);
  const counts = useMemo(
    () =>
      statuses.map(
        (x) => [x, items.filter((i) => i.status === x).length] as const,
      ),
    [items],
  );
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget,
      data = new FormData(form),
      files = data
        .getAll("files")
        .filter((x) => x instanceof File && x.size) as File[];
    try {
      const attachments = files.length ? await tasksApi.upload(files) : [];
      await tasksApi.create({
        title: data.get("title"),
        description: data.get("description"),
        team: data.get("team") || null,
        priority: data.get("priority"),
        status: "todo",
        startDate: data.get("startDate") || null,
        dueDate: data.get("dueDate") || null,
        estimatedMinutes: Number(data.get("estimatedHours") || 0) * 60 || null,
        assigneeIds: data.getAll("assigneeIds"),
        attachments,
      });
      setOpen(false);
      form.reset();
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("tasks.saveFailed"));
    }
  };
  return (
    <div className="space-y-5 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t("tasks.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("tasks.subtitle")}</p>
        </div>
        {canAssign && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus /> {t("tasks.add")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t("tasks.add")}</DialogTitle>
              </DialogHeader>
              <form className="grid gap-4" onSubmit={submit}>
                <label className="grid gap-1 text-sm">
                  {t("tasks.fields.title")}
                  <Input name="title" required />
                </label>
                <label className="grid gap-1 text-sm">
                  {t("tasks.fields.description")}
                  <textarea
                    name="description"
                    required
                    className="min-h-28 rounded-md border bg-background p-3"
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1 text-sm">
                    {t("tasks.fields.team")}
                    <Select name="team" defaultValue="marketing">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((x) => (
                          <SelectItem key={x} value={x}>
                            {t(`tasks.teams.${x}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>
                  <label className="grid gap-1 text-sm">
                    {t("tasks.fields.priority")}
                    <Select name="priority" defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((x) => (
                          <SelectItem key={x} value={x}>
                            {t(`tasks.priorities.${x}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>
                  <label className="grid gap-1 text-sm">
                    {t("tasks.fields.startDate")}
                    <FormDatePicker name="startDate" />
                  </label>
                  <label className="grid gap-1 text-sm">
                    {t("tasks.fields.dueDate")}
                    <FormDatePicker name="dueDate" />
                  </label>
                  <label className="grid gap-1 text-sm">
                    {t("tasks.fields.estimatedHours")}
                    <Input
                      name="estimatedHours"
                      type="number"
                      min="0"
                      step="0.25"
                    />
                  </label>
                </div>
                <fieldset className="grid gap-2">
                  <legend className="text-sm font-medium">
                    {t("tasks.fields.assignees")}
                  </legend>
                  <div className="grid max-h-40 gap-2 overflow-y-auto rounded-md border p-3 sm:grid-cols-2">
                    {employees.map((x) => (
                      <label
                        key={x.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Checkbox name="assigneeIds" value={x.id} />
                        <span>
                          {x.firstName} {x.lastName} ·{" "}
                          {x.position?.name ?? x.employeeCode}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="grid gap-1 text-sm">
                  {t("tasks.fields.attachments")}
                  <Input
                    name="files"
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  />
                </label>
                <Button type="submit">{t("common.save")}</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </header>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {counts.map(([x, n]) => (
          <div key={x} className="rounded-xl border bg-card p-3">
            <div className="text-xs text-muted-foreground">
              {t(`tasks.statuses.${x}`)}
            </div>
            <div className="text-xl font-bold">{n}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 rounded-xl border bg-card p-3">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute start-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9"
            placeholder={t("tasks.search")}
          />
        </div>
        <Select
          value={team || "all"}
          onValueChange={(value) => setTeam(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("tasks.allTeams")}</SelectItem>
            {teams.map((x) => (
              <SelectItem key={x} value={x}>
                {t(`tasks.teams.${x}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status || "all"}
          onValueChange={(value) => setStatus(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("tasks.allStatuses")}</SelectItem>
            {statuses.map((x) => (
              <SelectItem key={x} value={x}>
                {t(`tasks.statuses.${x}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {loading ? (
        <div className="py-20 text-center text-muted-foreground">
          {t("common.loading")}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border py-20 text-center text-muted-foreground">
          {t("tasks.empty")}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("tasks.fields.title")}</TableHead>
                <TableHead>{t("tasks.fields.assignees")}</TableHead>
                <TableHead>{t("tasks.fields.team")}</TableHead>
                <TableHead>{t("tasks.fields.priority")}</TableHead>
                <TableHead>{t("tasks.fields.status")}</TableHead>
                <TableHead>{t("tasks.fields.startDate")}</TableHead>
                <TableHead>{t("tasks.fields.dueDate")}</TableHead>
                <TableHead>{t("tasks.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody pageSize={15}>
              {items.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="min-w-52">
                    <Link
                      to={`/tasks/${task.id}`}
                      className="font-semibold hover:text-primary hover:underline"
                    >
                      {task.title}
                    </Link>
                    <p className="mt-1 max-w-sm truncate text-xs text-muted-foreground">
                      {task.description}
                    </p>
                  </TableCell>
                  <TableCell className="min-w-48">
                    {task.assignees.length
                      ? task.assignees
                          .map(
                            ({ employee }) =>
                              `${employee.firstName} ${employee.lastName}`,
                          )
                          .join(", ")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {t(`tasks.teams.${task.team ?? "other"}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{t(`tasks.priorities.${task.priority}`)}</Badge>
                  </TableCell>
                  <TableCell className="min-w-44">
                    <Select
                      value={task.status}
                      onValueChange={async (value) => {
                        try {
                          await tasksApi.update(task.id, { status: value });
                          await load();
                        } catch (error) {
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : t("tasks.saveFailed"),
                          );
                        }
                      }}
                    >
                      <SelectTrigger aria-label={t("tasks.fields.status")}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStatuses.map((value) => (
                          <SelectItem key={value} value={value}>
                            {t(`tasks.statuses.${value}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {task.startDate
                      ? new Date(task.startDate).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" asChild>
                        <Link
                          to={`/tasks/${task.id}`}
                          aria-label={t("tasks.viewDetails")}
                        >
                          <Eye />
                        </Link>
                      </Button>
                      {isHr && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button data-action="delete" size="icon" variant="ghost">
                              <Trash2 className="text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {t("tasks.deleteTitle")}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {t("tasks.deleteDescription")}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {t("common.cancel")}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  await tasksApi.remove(task.id);
                                  await load();
                                }}
                              >
                                {t("common.delete")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
