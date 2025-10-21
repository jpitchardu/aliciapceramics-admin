import { RealtimeChannel } from "@supabase/supabase-js";
import { getAliciapCeramicsSubaseClient } from "../aliciapCeramicsClient";
import { Tables } from "../dbTypes";

export type UnreadConversation = {
  conversation_id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  unread_count: number;
  last_message_at: string;
};

export async function fetchConversationByCustomerId(customerId: string) {
  const client = getAliciapCeramicsSubaseClient();
  const { data, error } = await client
    .from("conversations")
    .select("*")
    .eq("customer_id", customerId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  return data as Tables<"conversations">;
}

export async function fetchUnreadConversations() {
  const client = getAliciapCeramicsSubaseClient();
  const { data, error } = await client
    .from("conversations_with_unread_messages")
    .select("*")
    .order("last_message_at", { ascending: false });

  if (error) throw error;

  return (data || []) as UnreadConversation[];
}

export function subscribeToMessages(
  conversationId: string,
  callbacks: {
    onMessage: (payload: any) => void;
    onSubscribed?: () => void;
    onError?: (error: any) => void;
  },
): RealtimeChannel {
  const client = getAliciapCeramicsSubaseClient();

  const channel = client
    .channel(`messages-${conversationId}`, {
      config: {
        broadcast: { self: true },
      },
    })
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      callbacks.onMessage,
    )
    .subscribe((status, err) => {
      if (status === "SUBSCRIBED") {
        callbacks.onSubscribed?.();
      } else if (status === "CHANNEL_ERROR") {
        callbacks.onError?.(err);
      } else if (status === "TIMED_OUT") {
        callbacks.onError?.(new Error("Subscription timed out"));
      }
    });

  return channel;
}
