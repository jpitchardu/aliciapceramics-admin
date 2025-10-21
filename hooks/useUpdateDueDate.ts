import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderDueDate } from "@/api/data/orders";

export function useUpdateDueDate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      dueDate,
    }: {
      orderId: string;
      dueDate: Date | null;
    }) => updateOrderDueDate(orderId, dueDate),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
