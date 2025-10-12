import { useQuery } from "@tanstack/react-query";
import { fetchOrderById } from "@/api/data/orders";

export type { OrderWithDetails } from "@/api/data/orders";

export function useOrderDetail(orderId: string | undefined) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId!),
    enabled: !!orderId,
  });
}