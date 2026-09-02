import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

type Option = { value: string; label: string; searchText?: string };

export function SearchableSelect({
  name,
  options,
  defaultValue = "",
  placeholder = "Select an option",
  searchPlaceholder = "Search…",
  required,
}: {
  name: string;
  options: Option[];
  defaultValue?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [search, setSearch] = useState("");
  const selected = options.find((option) => option.value === value);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return options;
    return options.filter((option) =>
      `${option.label} ${option.searchText ?? ""}`.toLowerCase().includes(term),
    );
  }, [options, search]);

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setSearch("");
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-required={required}
            className="w-full justify-between px-3 font-normal"
          >
            <span
              className={cn("truncate", !selected && "text-muted-foreground")}
            >
              {selected?.label ?? placeholder}
            </span>
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] p-0"
        >
          <div className="relative border-b p-2">
            <Search className="absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              className="border-0 ps-9 shadow-none focus-visible:ring-0"
            />
          </div>
          <ScrollArea className="h-64">
            <div className="p-1">
              {filtered.length ? (
                filtered.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setValue(option.value);
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-start text-sm hover:bg-accent"
                  >
                    <Check
                      className={cn(
                        "size-4 text-primary",
                        value !== option.value && "opacity-0",
                      )}
                    />
                    <span className="truncate">{option.label}</span>
                  </button>
                ))
              ) : (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  No patients found.
                </p>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </>
  );
}
