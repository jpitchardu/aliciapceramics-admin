import { useQuery } from "@tanstack/react-query";
import { fetchUnreadConversations } from "@/api/data/conversations";

export function useUnreadConversations() {
  return useQuery({
    queryKey: ["conversations", "unread"],
    queryFn: fetchUnreadConversations,
    refetchInterval: 30000,
  });
}
