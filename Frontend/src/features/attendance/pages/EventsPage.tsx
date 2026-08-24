import { useCallback, useEffect, useState } from "react";
import { endOfMonth, format, startOfMonth } from "date-fns";
import {
  Check,
  ChevronDownIcon,
  LogIn,
  LogOut,
  RefreshCw,
  Search,
  UsersRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  attendanceApi,
  type Person,
} from "../api/attendance.api";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { TableResourceState } from "@/shared/components/ui/table-resource-state";
import { apiErrorMessage } from "@/shared/api/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
type EmployeeOption = {
  id: string;
  employeeNo: string;
  name: string;
  deviceName: string;
};
function currentEmployees(people: Person[]) {
  const employees = new Map<string, EmployeeOption>();
  for (const person of people)
    employees.set(person.employeeNo, {
      id: person.id,
      employeeNo: person.employeeNo,
      name: person.name,
      deviceName: person.device?.name ?? "",
    });
  return [...employees.values()].sort((a, b) =>
    a.employeeNo.localeCompare(b.employeeNo, undefined, { numeric: true }),
  );
}
function MonthFilter({
  date,
  onChange,
}: {
  date?: Date;
  onChange: (date?: Date) => void;
}) {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const label = date
    ? new Intl.DateTimeFormat(i18n.resolvedLanguage, {
        month: "long",
        year: "numeric",
      }).format(date)
    : t("attendanceFilters.pickMonth");
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[190px] justify-between font-normal"
        >
          {label}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(value) => {
            onChange(value);
            setOpen(false);
          }}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  );
}
function EmployeeFilter({
  options,
  value,
  onChange,
}: {
  options: EmployeeOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false),
    [search, setSearch] = useState("");
  const { t } = useTranslation();
  const selected = options.find((x) => x.employeeNo === value),
    filtered = options.filter((x) =>
      `${x.name} ${x.employeeNo} ${x.deviceName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
    setSearch("");
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[220px] justify-between font-normal"
        >
          <span className="truncate">
            {selected
              ? `${selected.name} · #${selected.employeeNo}`
              : t("attendanceFilters.allEmployees")}
          </span>
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="relative border-b p-2">
          <Search className="absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="ps-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("attendanceFilters.searchEmployee")}
            autoFocus
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          <button
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
            onClick={() => pick("")}
          >
            <UsersRound />
            <span className="flex-1 text-start">
              {t("attendanceFilters.allEmployees")}
            </span>
            {!value && <Check className="text-primary" />}
          </button>
          {filtered.map((x) => (
            <button
              key={x.id}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-start hover:bg-muted"
              onClick={() => pick(x.employeeNo)}
            >
              <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {x.name
                  .split(" ")
                  .map((v) => v[0])
                  .join("")
                  .slice(0, 2)}
              </span>
              <span className="min-w-0 flex-1">
                <b className="block truncate text-xs">{x.name}</b>
                <small className="text-[10px] text-muted-foreground">
                  #{x.employeeNo} · {x.deviceName}
                </small>
              </span>
              {value === x.employeeNo && <Check className="text-primary" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
export default function EventsPage() {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState<Record<string, string>>({}),
    [month, setMonth] = useState<Date>(),
    [syncing, setSyncing] = useState(false);
  const events = useApiResource(
      useCallback(() => attendanceApi.events(filters), [filters]),
    ),
    people = useApiResource(useCallback(() => attendanceApi.people(), []));
  const verificationLabel = (value?: string) => {
    if (!value) return "—";
    const mode = value.toLowerCase();
    const labels: string[] = [];
    if (mode.includes("face")) labels.push(t("attendanceFilters.face"));
    if (mode === "fp" || mode.includes("finger") || mode.includes("fp"))
      labels.push(t("attendanceFilters.fingerprint"));
    if (mode.includes("card")) labels.push(t("attendanceFilters.card"));
    if (
      mode.includes("password") ||
      mode.includes("pwd") ||
      mode.includes("pw")
    )
      labels.push(t("attendanceFilters.password"));
    return labels.length ? labels.join(" · ") : value;
  };
  useEffect(() => {
    const timer = setInterval(() => void events.refresh(), 10000);
    return () => clearInterval(timer);
  }, [events.refresh]);
  const chooseMonth = (date?: Date) => {
    setMonth(date);
    setFilters((v) => ({
      ...v,
      from: date ? format(startOfMonth(date), "yyyy-MM-dd") : "",
      to: date ? format(endOfMonth(date), "yyyy-MM-dd") : "",
    }));
  };
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-wrap gap-2 border-b p-4">
          <EmployeeFilter
            options={currentEmployees(people.data ?? [])}
            value={filters.employeeNo ?? ""}
            onChange={(employeeNo) => setFilters((v) => ({ ...v, employeeNo }))}
          />
          <MonthFilter date={month} onChange={chooseMonth} />
          <Select
            value={filters.eventType || "all"}
            onValueChange={(eventType) =>
              setFilters((v) => ({
                ...v,
                eventType: eventType === "all" ? "" : eventType,
              }))
            }
          >
            <SelectTrigger className="w-[155px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("attendanceFilters.allEvents")}
              </SelectItem>
              <SelectItem value="check_in">
                {t("attendanceFilters.checkIn")}
              </SelectItem>
              <SelectItem value="check_out">
                {t("attendanceFilters.checkOut")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="ms-auto"
            disabled={syncing}
            onClick={async () => {
              setSyncing(true);
              try {
                const result = await attendanceApi.sync(filters);
                await events.refresh();
                if (result.errors.length)
                  toast.warning(t("attendanceFilters.syncPartial"), {
                    description: result.errors
                      .map((error) => `${error.deviceName}: ${error.message}`)
                      .join(" · "),
                  });
                else
                  toast.success(t("attendanceFilters.syncComplete", {
                    count: result.synced,
                  }));
              } catch (error) {
                toast.error(t("attendanceFilters.syncFailed"), {
                  description: apiErrorMessage(error),
                });
              } finally {
                setSyncing(false);
              }
            }}
          >
            <RefreshCw className={syncing ? "animate-spin" : ""} />
            {t("attendanceFilters.sync")}
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Date & time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableResourceState
              isLoading={events.isLoading}
              error={events.error}
              isEmpty={!events.data?.length}
              colSpan={5}
            />
            {!events.isLoading &&
              !events.error &&
              events.data?.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <b>{e.personName ?? t("attendanceFilters.unknownUser")}</b>
                    <small className="block text-muted-foreground">
                      #{e.employeeNo}
                    </small>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        e.eventType === "check_in"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }
                    >
                      {e.eventType === "check_in" ? <LogIn /> : <LogOut />}
                      {t(
                        e.eventType === "check_in"
                          ? "attendanceFilters.checkIn"
                          : "attendanceFilters.checkOut",
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>{e.device.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="max-w-56 whitespace-normal text-center font-medium"
                      title={e.verification}
                    >
                      {verificationLabel(e.verification)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat(i18n.resolvedLanguage, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(e.occurredAt))}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
