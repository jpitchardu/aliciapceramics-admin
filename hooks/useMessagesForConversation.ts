import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import {
  fetchMessagesByConversationId,
  insertMessage,
  updateMessage,
  deleteMessage,
  Message,
} from "@/api/data/messages";
import { subscribeToMessages } from "@/api/data/conversations";

export function useMessagesForConversation(conversationId: string | undefined) {
  const queryClient = useQueryClient();

  const queryKey = useMemo(()=>["messages", conversationId], [conversationId]);

  const query = useQuery({
    queryKey,
    enabled: !!conversationId,
    queryFn: () => fetchMessagesByConversationId(conversationId!),
  });

  useEffect(() => {
    if (!conversationId) return;

    const channel = subscribeToMessages(conversationId, {
      onMessage: (payload) => {
        console.log("Realtime event:", payload);

        queryClient.setQueryData(queryKey, (old: Message[] = []) => {
          if (payload.eventType === "INSERT") {
            return insertMessage(old, payload.new);
          }
          if (payload.eventType === "UPDATE") {
            return updateMessage(old, payload.new);
          }
          if (payload.eventType === "DELETE") {
            return deleteMessage(old, payload.old);
          }
          return old;
        });
      },
      onSubscribed: () => {
        console.log("✅ Realtime subscription active for conversation:", conversationId);
      },
      onError: (error) => {
        console.error("❌ Realtime subscription error:", error);
      },
    });

    return () => {
      console.log("Cleaning up realtime subscription");
      channel.unsubscribe();
    };
  }, [conversationId, queryClient, queryKey]);

  return query;
}
