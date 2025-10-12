import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/api/data/orders";

export type { Order } from "@/api/data/orders";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
}
