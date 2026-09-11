import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, RefreshCw, Search, Send, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { whatsappApi, type WhatsappConversation } from "../api/whatsapp.api";
import { apiErrorMessage } from "@/shared/api/client";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";



export default function WhatsappPage() {
  const { t, i18n } = useTranslation();
  const tr = (key: string) => t(`whatsappInbox.${key}`);
  const time = (value: string) => new Intl.DateTimeFormat(i18n.language, { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
  const messageLabel = (value: string) => t(`whatsappInbox.${value}`, { defaultValue: tr("unknown") });
  const conversations = useApiResource(useCallback(() => whatsappApi.conversations(), []));
  const status = useApiResource(useCallback(() => whatsappApi.status(), []));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<WhatsappConversation | null>(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const openConversation = useCallback(async (id: string) => {
    setSelectedId(id);
    try { setSelected(await whatsappApi.conversation(id)); } catch (error) { toast.error(apiErrorMessage(error)); }
  }, []);
  useEffect(() => {
    if (!selectedId && conversations.data?.[0]) void openConversation(conversations.data[0].id);
  }, [conversations.data, openConversation, selectedId]);
  const rows = (conversations.data ?? []).filter((item) => `${item.profileName ?? ""} ${item.phone} ${item.lead?.code ?? ""}`.toLowerCase().includes(search.toLowerCase()));
  const send = async () => {
    if (!selected || !draft.trim()) return;
    setSending(true);
    try {
      await whatsappApi.send(selected.id, draft.trim());
      setDraft("");
      await Promise.all([openConversation(selected.id), conversations.refresh()]);
      toast.success(tr("sentSuccess"));
    } catch (error) { toast.error(apiErrorMessage(error)); } finally { setSending(false); }
  };
  return <div className="space-y-5" dir={i18n.dir()}>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">CRM · WhatsApp</p><h1 className="mt-1 text-2xl font-bold">{tr("title")}</h1><p className="text-sm text-muted-foreground">{tr("subtitle")}</p></div>
      <div className="flex items-center gap-2"><Badge variant={status.data?.configured ? "default" : "secondary"}>{status.data?.configured ? tr("configured") : tr("configurationRequired")}</Badge><Button variant="outline" size="icon" title={tr("refresh")} aria-label={tr("refresh")} onClick={() => { void conversations.refresh(); void status.refresh(); if (selectedId) void openConversation(selectedId); }}><RefreshCw className={conversations.isLoading ? "animate-spin" : ""} /></Button></div>
    </div>
    {status.error && <Card role="alert" className="border-destructive p-4 text-sm text-destructive">{t("whatsappInbox.configurationError", { error: status.error })}</Card>}
    {conversations.error && <Card role="alert" className="border-destructive p-4 text-sm text-destructive">{t("whatsappInbox.conversationsError", { error: conversations.error })}</Card>}
    {!status.isLoading && !status.error && !status.data?.configured && <Card className="border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">{t("whatsappInbox.setup", { variables: "WHATSAPP_VERIFY_TOKEN, WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID", webhook: "/api/crm/whatsapp/webhook" })}</Card>}
    <Card className="grid min-h-[620px] overflow-hidden lg:grid-cols-[340px_1fr]">
      <aside className="border-b lg:border-b-0 lg:border-e"><div className="border-b p-3"><div className="relative"><Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={tr("search")} aria-label={tr("search")} className="ps-9" /></div></div>
        <ScrollArea className="h-[300px] lg:h-[558px]">{rows.length ? rows.map((item) => { const last = item.messages[0]; return <button key={item.id} onClick={() => void openConversation(item.id)} className={`w-full border-b p-4 text-start transition hover:bg-muted/60 ${selectedId === item.id ? "bg-emerald-50 dark:bg-emerald-950/20" : ""}`}><div className="flex items-center justify-between gap-2"><strong className="truncate">{item.profileName || item.lead?.name || item.phone}</strong><span className="text-[10px] text-muted-foreground">{time(item.lastMessageAt)}</span></div><div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground"><span className="truncate">{last?.body || (last?.messageType ? messageLabel(last.messageType) : tr("newConversation"))}</span>{item.lead?.code && <Badge variant="outline">{item.lead.code}</Badge>}</div></button>; }) : <p className="p-8 text-center text-sm text-muted-foreground">{conversations.isLoading ? tr("loading") : conversations.error ? tr("loadFailed") : search ? tr("noMatches") : tr("empty")}</p>}</ScrollArea>
      </aside>
      <section className="flex min-h-[620px] flex-col">{selected ? <><header className="flex items-center justify-between border-b p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Smartphone /></span><div><h2 className="font-bold">{selected.profileName || selected.lead?.name || selected.phone}</h2><p dir="ltr" className="text-xs text-muted-foreground">+{selected.phone}</p></div></div>{selected.lead && <Button asChild variant="outline" size="sm"><Link to={`/crm/leads/${selected.lead.id}`}>{t("whatsappInbox.lead", { code: selected.lead.code })}</Link></Button>}</header>
        <ScrollArea className="flex-1 bg-muted/20 p-5"><div className="space-y-3">{selected.messages.map((message) => <div key={message.id} className={`flex ${message.direction === "outbound" ? "justify-end" : "justify-start"}`}><div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${message.direction === "outbound" ? "rounded-ee-sm bg-emerald-600 text-white" : "rounded-es-sm border bg-card"}`}><p dir="auto" className="whitespace-pre-wrap">{message.body || `[${messageLabel(message.messageType)}]`}</p><p className={`mt-1 text-[10px] ${message.direction === "outbound" ? "text-emerald-100" : "text-muted-foreground"}`}>{time(message.sentAt)} · {messageLabel(message.status)}</p></div></div>)}</div></ScrollArea>
        <div className="flex gap-2 border-t p-4"><Input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(); } }} placeholder={tr("compose")} aria-label={tr("compose")} disabled={!status.data?.configured || sending} /><Button onClick={() => void send()} disabled={!draft.trim() || !status.data?.configured || sending}><Send /> {tr("send")}</Button></div></> : <div className="grid flex-1 place-items-center p-8 text-center text-muted-foreground"><div><MessageCircle className="mx-auto mb-3 size-12"/><p>{tr("selectConversation")}</p></div></div>}</section>
    </Card>
  </div>;
}
