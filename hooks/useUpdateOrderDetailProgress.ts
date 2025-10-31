import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderDetailProgress, UpdateOrderDetailProgressParams } from "@/api/data/orders";

export function useUpdateOrderDetailProgress(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderDetailProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
