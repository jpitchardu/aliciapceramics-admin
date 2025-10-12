import { useQuery } from "@tanstack/react-query";
import { fetchConversationByCustomerId } from "@/api/data/conversations";

export function useConversation(customerId: string | undefined) {
  return useQuery({
    queryKey: ["conversation", customerId],
    queryFn: () => fetchConversationByCustomerId(customerId!),
    enabled: !!customerId,
  });
}