import { useBulkCodes, useDeleteBulkCode, useBulkCodeOrders } from "@/hooks/useBulkCodes";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert } from "react-native";

export function useBulkCodeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const bulkCodesResponse = useBulkCodes();
  const ordersResponse = useBulkCodeOrders(id);
  const deleteMutation = useDeleteBulkCode();

  const bulkCode = bulkCodesResponse.data?.find((c) => c.id === id);
  const isRedeemed = bulkCode ? !!bulkCode.redeemed_at : false;

  const formatDate = useCallback(
    (dateString: string) =>
      new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    [],
  );

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Delete Bulk Code",
      "Are you sure you want to delete this code? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteMutation.mutate(id, {
              onSuccess: () => router.back(),
              onError: (error) => {
                Alert.alert("Error", `Failed to delete: ${error.message}`);
              },
            });
          },
        },
      ],
    );
  }, [id, deleteMutation, router]);

  return {
    bulkCode,
    orders: ordersResponse.data,
    isRedeemed,
    isDeletePending: deleteMutation.isPending,
    formatDate,
    handleDelete,
  };
}
