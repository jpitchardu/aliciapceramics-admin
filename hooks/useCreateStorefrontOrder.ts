import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createStorefrontOrder, CreateStorefrontOrderParams } from "@/api/data/orders";

export function useCreateStorefrontOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateStorefrontOrderParams) => createStorefrontOrder(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
