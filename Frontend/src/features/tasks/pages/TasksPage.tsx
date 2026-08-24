import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Search,
  Paperclip,
  CalendarDays,
  UsersRound,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { tasksApi, type TaskEmployee, type TaskItem } from "../api/tasks.api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { FormDatePicker } from "@/shared/components/ui/form-date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
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
  const [items, setItems] = useState<TaskItem[]>([]),
    [employees, setEmployees] = useState<TaskEmployee[]>([]),
    [loading, setLoading] = useState(true),
    [open, setOpen] = useState(false),
    [search, setSearch] = useState(""),
    [status, setStatus] = useState(""),
    [team, setTeam] = useState("");
  const load = async () => {
    setLoading(true);
    try {
      const [data, staff] = await Promise.all([
        tasksApi.list({
          search,
          status: status || undefined,
          team: team || undefined,
          pageSize: 50,
        }),
        tasksApi.employees(),
      ]);
      setItems(data.items);
      setEmployees(staff);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("tasks.loadFailed"));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, [search, status, team]);
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
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <Input name="estimatedHours" type="number" min="0" step="0.25" />
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
                      <input type="checkbox" name="assigneeIds" value={x.id} />
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
        <Select value={team || "all"} onValueChange={(value) => setTeam(value === "all" ? "" : value)}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent>
          <SelectItem value="all">{t("tasks.allTeams")}</SelectItem>
          {teams.map((x) => (
            <SelectItem key={x} value={x}>
              {t(`tasks.teams.${x}`)}
            </SelectItem>
          ))}
          </SelectContent></Select>
        <Select value={status || "all"} onValueChange={(value) => setStatus(value === "all" ? "" : value)}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent>
          <SelectItem value="all">{t("tasks.allStatuses")}</SelectItem>
          {statuses.map((x) => (
            <SelectItem key={x} value={x}>
              {t(`tasks.statuses.${x}`)}
            </SelectItem>
          ))}
          </SelectContent></Select>
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((task) => (
            <article
              key={task.id}
              className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold">{task.title}</h2>
                  <div className="mt-1 flex gap-1">
                    <Badge variant="secondary">
                      {t(`tasks.teams.${task.team ?? "other"}`)}
                    </Badge>
                    <Badge>{t(`tasks.priorities.${task.priority}`)}</Badge>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost">
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
              </div>
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {task.description}
              </p>
              <Select
                value={task.status}
                onValueChange={async (value) => {
                  await tasksApi.update(task.id, { status: value });
                  await load();
                }}
              >
                <SelectTrigger aria-label={t("tasks.fields.status")}><SelectValue /></SelectTrigger><SelectContent>
                {statuses.map((value) => (
                  <SelectItem key={value} value={value}>
                    {t(`tasks.statuses.${value}`)}
                  </SelectItem>
                ))}
                </SelectContent>
              </Select>
              <form
                className="grid grid-cols-[1fr_6rem_auto] gap-2"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const data = new FormData(event.currentTarget);
                  await tasksApi.addTime(task.id, {
                    employeeId: data.get("employeeId"),
                    workDate: new Date().toISOString(),
                    minutes: Number(data.get("minutes")),
                    note: null,
                  });
                  toast.success(t("tasks.timeSaved"));
                  event.currentTarget.reset();
                }}
              >
                <Select name="employeeId" defaultValue={task.assignees[0]?.employee.id}>
                  <SelectTrigger><SelectValue placeholder={t("tasks.fields.assignees")} /></SelectTrigger>
                  <SelectContent>{task.assignees.map(({employee})=><SelectItem key={employee.id} value={employee.id}>{employee.firstName} {employee.lastName}</SelectItem>)}</SelectContent>
                </Select>
                <Input name="minutes" type="number" min="1" required placeholder={t("tasks.fields.minutes")} />
                <Button type="submit" size="sm">{t("tasks.logTime")}</Button>
              </form>
              <div className="mt-auto space-y-2 border-t pt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <UsersRound className="size-4" />
                  {task.assignees
                    .map(
                      (x) => `${x.employee.firstName} ${x.employee.lastName}`,
                    )
                    .join(", ")}
                </div>
                {task.dueDate && (
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
                {task.attachments.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Paperclip className="size-4" />
                    {task.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline"
                      >
                        {attachment.fileName}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
