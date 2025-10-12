import { getAliciapCeramicsSubaseClient } from "../aliciapCeramicsClient";
import { Tables } from "../dbTypes";

export type Message = Tables<"messages">;

export async function fetchMessagesByConversationId(conversationId: string) {
  const client = getAliciapCeramicsSubaseClient();
  const { data, error } = await client
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data || []) as Message[];
}

export async function sendMessage(params: { body: string; orderId: string }) {
  const baseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL || "https://www.aliciapceramics.com";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const response = await fetch(`${baseUrl}/api/newMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      data.error || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return await response.json();
}

export function insertMessage(messages: Message[], newMessage: Message): Message[] {
  if (messages.some((m) => m.id === newMessage.id)) return messages;
  return [...messages, newMessage].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
}

export function updateMessage(messages: Message[], updated: Message): Message[] {
  return messages.map((m) => (m.id === updated.id ? updated : m));
}

export function deleteMessage(messages: Message[], deleted: Message): Message[] {
  return messages.filter((m) => m.id !== deleted.id);
}
