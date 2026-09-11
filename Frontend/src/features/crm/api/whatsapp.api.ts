import { apiClient } from "@/shared/api/client";

export type WhatsappMessage = { id: string; externalId?: string | null; direction: "inbound" | "outbound"; messageType: string; body?: string | null; status: string; sentAt: string };
export type WhatsappConversation = {
  id: string; phone: string; profileName?: string | null; lastMessageAt: string;
  lead?: { id: string; code?: string | null; name: string; phone: string; status: string } | null;
  messages: WhatsappMessage[];
};

export const whatsappApi = {
  status: () => apiClient.get<{ configured: boolean; phoneNumberId: string | null; graphVersion: string }>("/crm/whatsapp/status").then(({ data }) => data),
  conversations: () => apiClient.get<WhatsappConversation[]>("/crm/whatsapp/conversations").then(({ data }) => data),
  conversation: (id: string) => apiClient.get<WhatsappConversation>(`/crm/whatsapp/conversations/${id}`).then(({ data }) => data),
  send: (id: string, body: string) => apiClient.post<WhatsappMessage>(`/crm/whatsapp/conversations/${id}/messages`, { body }).then(({ data }) => data),
};
