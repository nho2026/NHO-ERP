import { useCallback } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { crmApi, type CrmRecord } from "../api/crm.api";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

const labels: Record<string, string> = {
  new: "New lead",
  contacted: "Contacted",
  qualified: "Qualified",
  appointment_requested: "Appointment requested",
  converted: "Converted to patient",
  lost: "Lost",
};
export default function LeadDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const lead = useApiResource(useCallback(() => crmApi.leads.get(id), [id]));
  if (!lead.data)
    return (
      <div className="p-10 text-center text-muted-foreground">
        Loading lead progress…
      </div>
    );
  const item = lead.data;
  const history = (item.statusHistory ?? []) as CrmRecord[];
  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      <header className="flex items-center gap-3">
        <Button
          size="icon"
          variant="outline"
          onClick={() => navigate("/crm/leads/progress")}
        >
          <ArrowLeft className="rtl:rotate-180" />
        </Button>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Lead progress
          </p>
          <h1 className="text-2xl font-bold">{String(item.name)}</h1>
        </div>
      </header>
      <section className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <UserRound />
                </span>
                <div>
                  <h2 className="text-xl font-bold">{String(item.name)}</h2>
                  <p className="text-sm text-muted-foreground">
                    {String(item.code ?? "—")}
                  </p>
                </div>
              </div>
              <Badge className="capitalize">
                {labels[String(item.status)]}
              </Badge>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <Phone className="size-4 text-primary" />
                {String(item.phone)}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                {String(item.email ?? "Not recorded")}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                {String(item.address ?? "Not recorded")}
              </p>
              <p>
                Source: <strong>{String(item.source ?? "Not recorded")}</strong>
              </p>
              <p>
                Age: <strong>{String(item.age ?? "—")}</strong>
              </p>
              <p>
                Gender:{" "}
                <strong className="capitalize">
                  {String(item.gender ?? "—")}
                </strong>
              </p>
            </div>
            {Boolean(item.notes) && (
              <div className="mt-6 rounded-xl bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">Notes</p>
                <p className="mt-1 text-sm">{String(item.notes)}</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-5 flex items-center gap-2 font-bold">
              <CalendarDays className="size-5 text-primary" />
              Progress history
            </h2>
            <div className="space-y-0">
              {history.length ? (
                history.map((entry, index) => (
                  <div key={entry.id} className="relative flex gap-3 pb-6">
                    <div className="relative z-10 mt-1 size-3 rounded-full bg-primary ring-4 ring-primary/10" />
                    {index < history.length - 1 && (
                      <span className="absolute start-[5px] top-4 h-full w-px bg-border" />
                    )}
                    <div>
                      <p className="font-semibold">
                        {labels[String(entry.toStatus)] ??
                          String(entry.toStatus)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(String(entry.createdAt)).toLocaleString()}
                      </p>
                      {Boolean(entry.fromStatus) && (
                        <p className="mt-1 text-xs">
                          From{" "}
                          {labels[String(entry.fromStatus)] ??
                            String(entry.fromStatus)}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No status changes recorded yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
