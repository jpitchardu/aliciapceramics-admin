import { Box, Text } from "@/components";
import { useDeleteBulkCode, useBulkCodeOrders, BulkCommissionCode } from "@/hooks/useBulkCodes";
import { BottomSheet } from "@/ui/BottomSheet";
import { Dimensions } from "react-native";
import { Alert, TouchableOpacity } from "react-native";

interface BulkCodeDetailSheetProps {
  bulkCode: BulkCommissionCode | null;
  onClose: () => void;
}

const SHEET_HEIGHT = Dimensions.get("window").height * 0.75;

export function BulkCodeDetailSheet({ bulkCode, onClose }: BulkCodeDetailSheetProps) {
  const deleteMutation = useDeleteBulkCode();
  const ordersResponse = useBulkCodeOrders(bulkCode?.id ?? "");

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const handleDelete = () => {
    if (!bulkCode) return;
    Alert.alert(
      "Delete Bulk Code",
      "Are you sure you want to delete this code? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteMutation.mutate(bulkCode.id, {
              onSuccess: onClose,
              onError: (error) => {
                Alert.alert("Error", `Failed to delete: ${error.message}`);
              },
            });
          },
        },
      ]
    );
  };

  const isRedeemed = !!bulkCode?.redeemed_at;

  return (
    <BottomSheet visible={!!bulkCode} onClose={onClose} height={SHEET_HEIGHT}>
      <BottomSheet.Body scrollable>
        <Box paddingBottom="s" gap="s">
          <Text variant="title">{bulkCode?.name}</Text>
          <Box flexDirection="row" gap="s" alignItems="center">
            <Box
              backgroundColor={isRedeemed ? "neutral600" : "primary900"}
              paddingHorizontal="s"
              paddingVertical="xs"
              borderRadius="s"
              alignSelf="flex-start"
            >
              <Text variant="button">{bulkCode?.code}</Text>
            </Box>
            {isRedeemed && (
              <Box
                backgroundColor="interactive400"
                paddingHorizontal="s"
                paddingVertical="xs"
                borderRadius="s"
              >
                <Text variant="label">REDEEMED</Text>
              </Box>
            )}
          </Box>
        </Box>

        <Box gap="l" paddingTop="m">
          <Box gap="s">
            <Box gap="xs">
              <Text variant="label" color="neutral600">Earliest Completion</Text>
              <Text variant="body">
                {bulkCode ? formatDate(bulkCode.earliest_completion_date) : ""}
              </Text>
            </Box>
            {isRedeemed && bulkCode?.redeemed_at && (
              <Box gap="xs">
                <Text variant="label" color="neutral600">Redeemed On</Text>
                <Text variant="body">{formatDate(bulkCode.redeemed_at)}</Text>
              </Box>
            )}
            <Box gap="xs">
              <Text variant="label" color="neutral600">Created</Text>
              <Text variant="body">
                {bulkCode ? formatDate(bulkCode.created_at) : ""}
              </Text>
            </Box>
          </Box>

          {ordersResponse.data && ordersResponse.data.length > 0 && (
            <Box gap="s">
              <Text variant="label">
                Orders ({ordersResponse.data.length})
              </Text>
              <Box gap="s">
                {ordersResponse.data.map((order) => (
                  <Box
                    key={order.id}
                    backgroundColor="primary100"
                    padding="m"
                    borderRadius="m"
                    borderWidth={1}
                    borderColor="neutral200"
                    gap="xs"
                  >
                    <Box
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text variant="body">
                        {order.customers?.name || order.name || "Order"}
                      </Text>
                      {order.status && (
                        <Box
                          backgroundColor="interactive400"
                          paddingHorizontal="s"
                          paddingVertical="xs"
                          borderRadius="s"
                        >
                          <Text variant="label" fontSize={10}>
                            {order.status}
                          </Text>
                        </Box>
                      )}
                    </Box>
                    {order.order_details?.length > 0 && (
                      <Text variant="body" color="neutral600" fontSize={14}>
                        {order.order_details
                          .map((d) => `${d.quantity} ${d.type}${d.quantity > 1 ? "s" : ""}`)
                          .join(" • ")}
                      </Text>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {!isRedeemed && (
            <TouchableOpacity
              onPress={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Box
                backgroundColor="input500"
                padding="m"
                borderRadius="m"
                opacity={deleteMutation.isPending ? 0.5 : 1}
              >
                <Text variant="button" color="primary900" textAlign="center">
                  {deleteMutation.isPending ? "deleting..." : "delete"}
                </Text>
              </Box>
            </TouchableOpacity>
          )}
        </Box>
      </BottomSheet.Body>
    </BottomSheet>
  );
}
