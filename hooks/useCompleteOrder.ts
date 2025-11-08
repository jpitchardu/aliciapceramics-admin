import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOrder } from "@/api/data/orders";

export function useCompleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeOrder,
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
  });
}

