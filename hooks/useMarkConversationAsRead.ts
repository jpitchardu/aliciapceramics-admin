import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markConversationAsRead } from "@/api/data/messages";

export function useMarkConversationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) =>
      markConversationAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations", "unread"] });
    },
  });
}
