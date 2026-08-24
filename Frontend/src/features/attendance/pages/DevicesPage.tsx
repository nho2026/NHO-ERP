import { useCallback, useState } from "react";
import {
  Clock3,
  CalendarX2,
  Plus,
  RefreshCw,
  Settings2,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { attendanceApi, type Device } from "../api/attendance.api";
import { DeleteConfirmationDialog } from "../components/DeleteConfirmationDialog";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { apiErrorMessage } from "@/shared/api/client";
import { ResourceState } from "@/shared/components/ui/table-resource-state";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  PaginationControls,
  usePaginatedItems,
} from "@/shared/components/ui/pagination-controls";
export default function DevicesPage() {
  const { t } = useTranslation();
  const devices = useApiResource(
    useCallback(() => attendanceApi.devices(), []),
  );
  const pagination = usePaginatedItems(devices.data ?? undefined);
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [deleting, setDeleting] = useState<Device | null>(null),
    [clearingEvents, setClearingEvents] = useState<Device | null>(null),
    [managing, setManaging] = useState<Device | null>(null);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      await attendanceApi.addDevice({
        name: f.get("name"),
        ipAddress: f.get("ipAddress"),
        port: Number(f.get("port")),
        username: f.get("username"),
        password: f.get("password"),
        eventType: f.get("eventType"),
      });
      setOpen(false);
      await devices.refresh();
    } catch (cause) {
      setError(apiErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  };
  const saveSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!managing) return;
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      await attendanceApi.updateDevice(managing.id, {
        workingDaysPerMonth: Number(f.get("workingDaysPerMonth")),
        checkInTime: f.get("checkInTime"),
        checkOutTime: f.get("checkOutTime"),
        eventType: f.get("eventType"),
      });
      setManaging(null);
      await devices.refresh();
    } catch (cause) {
      setError(apiErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  };
  const testDevice = async (device: Device) => {
    const toastId = toast.loading(
      t("attendance.device.testing", { name: device.name }),
    );
    try {
      await attendanceApi.testDevice(device.id);
      await devices.refresh();
      toast.success(t("attendance.device.online", { name: device.name }), {
        id: toastId,
      });
    } catch (cause) {
      toast.error(t("attendance.device.testFailed"), {
        id: toastId,
        description: apiErrorMessage(cause),
      });
    }
  };
  return (
    <>
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              {t("attendance.device.setup")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("attendance.device.connectTitle")}</DialogTitle>
            </DialogHeader>
            <form className="space-y-3" onSubmit={submit}>
              <Input
                name="name"
                placeholder={t("attendance.device.namePlaceholder")}
                required
              />
              <div className="grid grid-cols-[1fr_100px] gap-2">
                <Input name="ipAddress" placeholder="192.168.1.64" required />
                <Input name="port" type="number" defaultValue="80" required />
              </div>
              <Input name="username" defaultValue="admin" required />
              <Input
                name="password"
                type="password"
                placeholder={t("attendance.device.passwordPlaceholder")}
                required
              />
              <Select name="eventType" defaultValue="check_in">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="check_in">
                    {t("attendance.device.checkInDevice")}
                  </SelectItem>
                  <SelectItem value="check_out">
                    {t("attendance.device.checkOutDevice")}
                  </SelectItem>
                </SelectContent>
              </Select>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button disabled={busy} className="w-full">
                {busy
                  ? t("attendance.device.connecting")
                  : t("attendance.device.connectSave")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ResourceState
          isLoading={devices.isLoading}
          error={devices.error}
          isEmpty={!devices.data?.length}
        />
        {pagination.pageItems.map((d) => (
          <Card key={d.id}>
            <CardContent className="p-5">
              <div className="flex justify-between">
                <span
                  className={`grid size-10 place-items-center rounded-xl ${d.status === "online" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                >
                  {d.status === "online" ? <Wifi /> : <WifiOff />}
                </span>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {t(
                      `attendance.device.${d.eventType === "check_out" ? "checkOutDevice" : "checkInDevice"}`,
                    )}
                  </Badge>
                  <Badge variant="outline">{d.status}</Badge>
                </div>
              </div>
              <h2 className="mt-4 font-bold">{d.name}</h2>
              <p className="text-xs text-muted-foreground">
                {d.model} ·{" "}
                {d.serialNumber ?? t("attendance.device.serialUnavailable")}
              </p>
              <p className="mt-3 font-mono text-sm">
                {d.ipAddress}:{d.port}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-muted/50 p-3 text-xs">
                <span>
                  <small className="block text-muted-foreground">
                    {t("attendance.device.monthlyDays")}
                  </small>
                  <b>{d.workingDaysPerMonth}</b>
                </span>
                <span>
                  <small className="block text-muted-foreground">
                    {t("attendance.device.dailyHours")}
                  </small>
                  <b>
                    {d.checkInTime} – {d.checkOutTime}
                  </b>
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  title={t("attendance.device.clearEvents")}
                  variant="ghost"
                  size="icon"
                  className="text-amber-600"
                  onClick={() => setClearingEvents(d)}
                >
                  <CalendarX2 />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setManaging(d)}
                >
                  <Settings2 />
                  {t("common.manage")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => void testDevice(d)}
                >
                  <RefreshCw />
                  {t("common.test")}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => setDeleting(d)}
                >
                  <Trash2 />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <PaginationControls
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        onPageChange={pagination.setPage}
      />
      <Dialog
        open={!!managing}
        onOpenChange={(value) => {
          if (!value) {
            setManaging(null);
            setError("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock3 />
              {t("attendance.schedule.title", { name: managing?.name })}
            </DialogTitle>
          </DialogHeader>
          {managing && (
            <form className="space-y-4" onSubmit={saveSchedule}>
              <div>
                <label className="mb-1.5 block text-xs font-semibold">
                  {t("attendance.device.purpose")}
                </label>
                <Select
                  name="eventType"
                  defaultValue={managing.eventType ?? "check_in"}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="check_in">
                      {t("attendance.device.checkInDevice")}
                    </SelectItem>
                    <SelectItem value="check_out">
                      {t("attendance.device.checkOutDevice")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold">
                  {t("attendance.schedule.workingDays")}
                </label>
                <Input
                  name="workingDaysPerMonth"
                  type="number"
                  min="1"
                  max="31"
                  defaultValue={managing.workingDaysPerMonth}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">
                    {t("attendance.schedule.checkIn")}
                  </label>
                  <Input
                    name="checkInTime"
                    dir="ltr"
                    inputMode="numeric"
                    pattern="([01][0-9]|2[0-3]):[0-5][0-9]"
                    placeholder="09:00"
                    defaultValue={managing.checkInTime}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">
                    {t("attendance.schedule.checkOut")}
                  </label>
                  <Input
                    name="checkOutTime"
                    dir="ltr"
                    inputMode="numeric"
                    pattern="([01][0-9]|2[0-3]):[0-5][0-9]"
                    placeholder="17:00"
                    defaultValue={managing.checkOutTime}
                    required
                  />
                </div>
              </div>
              {error && (
                <p className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                  {error}
                </p>
              )}
              <Button className="w-full" disabled={busy}>
                {busy
                  ? t("attendance.schedule.saving")
                  : t("attendance.schedule.save")}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <DeleteConfirmationDialog
        open={!!clearingEvents}
        title={t("attendance.device.clearEventsTitle")}
        description={t("attendance.device.clearEventsDescription", {
          name: clearingEvents?.name,
        })}
        onOpenChange={(value) => {
          if (!value) setClearingEvents(null);
        }}
        onConfirm={async (password) => {
          if (!clearingEvents) return;
          const response = await attendanceApi.clearDeviceEvents(
            clearingEvents.id,
            password,
          );
          toast.success(t("attendance.device.eventsCleared"), {
            description: t("attendance.device.eventsDeletedCount", {
              count: response.data.deleted,
            }),
          });
        }}
      />
      <DeleteConfirmationDialog
        open={!!deleting}
        title={t("attendance.device.deleteTitle")}
        description={t("attendance.device.deleteDescription", {
          name: deleting?.name ?? t("attendance.device.thisDevice"),
        })}
        onOpenChange={(value) => {
          if (!value) setDeleting(null);
        }}
        onConfirm={async (password) => {
          if (!deleting) return;
          await attendanceApi.deleteDevice(deleting.id, password);
          await devices.refresh();
        }}
      />
    </>
  );
}
