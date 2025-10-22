import { useQuery } from "@tanstack/react-query";
import { fetchAllConversations } from "@/api/data/conversations";

export function useAllConversations() {
  return useQuery({
    queryKey: ["conversations", "all"],
    queryFn: fetchAllConversations,
    refetchInterval: 30000,
  });
}
