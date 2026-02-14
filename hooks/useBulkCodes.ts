import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBulkCommissionCodes,
  createBulkCommissionCode,
  deleteBulkCommissionCode,
  fetchOrdersByBulkCode,
  CreateBulkCommissionCodeParams,
} from "@/api/data/bulkCodes";

export type { BulkCommissionCode } from "@/api/data/bulkCodes";

export function useBulkCodes() {
  return useQuery({
    queryKey: ["bulkCodes"],
    queryFn: fetchBulkCommissionCodes,
  });
}

export function useCreateBulkCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateBulkCommissionCodeParams) =>
      createBulkCommissionCode(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bulkCodes"] });
    },
  });
}

export function useDeleteBulkCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBulkCommissionCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bulkCodes"] });
    },
  });
}

export function useBulkCodeOrders(bulkCodeId: string) {
  return useQuery({
    queryKey: ["bulkCodeOrders", bulkCodeId],
    queryFn: () => fetchOrdersByBulkCode(bulkCodeId),
    enabled: !!bulkCodeId,
  });
}
