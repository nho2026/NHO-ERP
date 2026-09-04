import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Input } from "@/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

type Props = {
  name?: string;
  initialValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  includeTime?: boolean;
  mode?: "date" | "month";
  required?: boolean;
};
function parseValue(value?: string, month = false) {
  if (!value) return undefined;
  const parsed = new Date(month ? `${value}-01T12:00:00` : value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}
export function FormDatePicker({
  name,
  initialValue,
  value: controlledValue,
  onValueChange,
  includeTime = false,
  mode = "date",
  required,
}: Props) {
  const { t, i18n } = useTranslation();
  const isMonth = mode === "month";
  const initialDate = parseValue(controlledValue ?? initialValue, isMonth);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [displayYear, setDisplayYear] = useState(
    initialDate?.getFullYear() ?? new Date().getFullYear(),
  );
  const [time, setTime] = useState(
    initialDate ? format(initialDate, "HH:mm") : "09:00",
  );
  useEffect(() => {
    if (controlledValue !== undefined) {
      const next = parseValue(controlledValue, isMonth);
      setDate(next);
      if (next) setDisplayYear(next.getFullYear());
    }
  }, [controlledValue, isMonth]);
  const output = date
    ? isMonth
      ? format(date, "yyyy-MM")
      : includeTime
        ? `${format(date, "yyyy-MM-dd")}T${time}`
        : format(date, "yyyy-MM-dd")
    : "";
  const commit = (next?: Date) => {
    setDate(next);
    const nextValue = next
      ? isMonth
        ? format(next, "yyyy-MM")
        : includeTime
          ? `${format(next, "yyyy-MM-dd")}T${time}`
          : format(next, "yyyy-MM-dd")
      : "";
    onValueChange?.(nextValue);
  };
  const label = date
    ? new Intl.DateTimeFormat(
        i18n.resolvedLanguage,
        isMonth
          ? { year: "numeric", month: "long" }
          : {
              dateStyle: "medium",
              ...(includeTime ? { timeStyle: "short" as const } : {}),
            },
      ).format(
        includeTime && !isMonth
          ? new Date(`${format(date, "yyyy-MM-dd")}T${time}`)
          : date,
      )
    : t(
        isMonth
          ? "datePicker.pickMonth"
          : includeTime
            ? "datePicker.pickDateTime"
            : "datePicker.pickDate",
      );
  const months = Array.from(
    { length: 12 },
    (_, month) => new Date(displayYear, month, 1),
  );
  return (
    <>
      {name && (
        <input type="hidden" name={name} value={output} required={required} />
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            aria-required={required}
            className="w-full justify-between font-normal"
          >
            <span className={date ? "" : "text-muted-foreground"}>{label}</span>
            <ChevronDownIcon className="size-4 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {isMonth ? (
            <div className="w-72 p-3">
              <div className="mb-3 flex items-center justify-between">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setDisplayYear((year) => year - 1)}
                >
                  <ChevronLeft className="size-4 rtl:rotate-180" />
                </Button>
                <strong>{displayYear}</strong>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setDisplayYear((year) => year + 1)}
                >
                  <ChevronRight className="size-4 rtl:rotate-180" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {months.map((month) => (
                  <Button
                    type="button"
                    key={month.getMonth()}
                    size="sm"
                    variant={
                      date?.getFullYear() === displayYear &&
                      date?.getMonth() === month.getMonth()
                        ? "default"
                        : "ghost"
                    }
                    onClick={() => {
                      commit(month);
                      setOpen(false);
                    }}
                  >
                    {new Intl.DateTimeFormat(i18n.resolvedLanguage, {
                      month: "short",
                    }).format(month)}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <Calendar
              mode="single"
              selected={date}
              defaultMonth={date}
              onSelect={(selected) => {
                commit(selected);
                if (selected && !includeTime) setOpen(false);
              }}
            />
          )}
          {includeTime && !isMonth && (
            <div className="flex items-center gap-2 border-t p-3">
              <CalendarIcon className="size-4 text-muted-foreground" />
              <Input
                type="time"
                value={time}
                onChange={(event) => {
                  setTime(event.target.value);
                  if (date)
                    onValueChange?.(
                      `${format(date, "yyyy-MM-dd")}T${event.target.value}`,
                    );
                }}
                aria-label={t("datePicker.time")}
              />
              <Button type="button" size="sm" onClick={() => setOpen(false)}>
                {t("datePicker.done")}
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}
