import { Box, Text } from "@/components";
import { Badge } from "@/ui/Badge";
import { DragHandle } from "@/ui/DragHandle";
import { useBulkCodeDetailScreen } from "./useBulkCodeDetailScreen";
import { ScrollView, TouchableOpacity } from "react-native";

export default function BulkCodeDetailScreen() {
  const {
    bulkCode,
    orders,
    isRedeemed,
    isDeletePending,
    formatDate,
    handleDelete,
  } = useBulkCodeDetailScreen();

  if (!bulkCode) return null;

  return (
    <Box flex={1} backgroundColor="primary50">
      <DragHandle />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Box padding="m" gap="l">
          <Box gap="s">
            <Text variant="title">{bulkCode.name}</Text>
            <Box flexDirection="row" gap="s" alignItems="center">
              <Badge
                label={bulkCode.code}
                backgroundColor={isRedeemed ? "neutral600" : "primary900"}
              />
              {isRedeemed && <Badge label="REDEEMED" backgroundColor="interactive400" />}
            </Box>
          </Box>

          <Box gap="s">
            <Box gap="xs">
              <Text variant="label" color="neutral600">Earliest Completion</Text>
              <Text variant="body">{formatDate(bulkCode.earliest_completion_date)}</Text>
            </Box>
            {isRedeemed && bulkCode.redeemed_at && (
              <Box gap="xs">
                <Text variant="label" color="neutral600">Redeemed On</Text>
                <Text variant="body">{formatDate(bulkCode.redeemed_at)}</Text>
              </Box>
            )}
            <Box gap="xs">
              <Text variant="label" color="neutral600">Created</Text>
              <Text variant="body">{formatDate(bulkCode.created_at)}</Text>
            </Box>
          </Box>

          {orders && orders.length > 0 && (
            <Box gap="s">
              <Text variant="label">Orders ({orders.length})</Text>
              <Box gap="s">
                {orders.map((order) => (
                  <Box
                    key={order.id}
                    backgroundColor="primary100"
                    padding="m"
                    borderRadius="m"
                    borderWidth={1}
                    borderColor="neutral200"
                    gap="xs"
                  >
                    <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Text variant="body">
                        {order.customers?.name || order.name || "Order"}
                      </Text>
                      {order.status && (
                        <Badge label={order.status} />
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
            <TouchableOpacity onPress={handleDelete} disabled={isDeletePending}>
              <Box
                backgroundColor="input500"
                padding="m"
                borderRadius="m"
                opacity={isDeletePending ? 0.5 : 1}
              >
                <Text variant="button" color="primary900" textAlign="center">
                  {isDeletePending ? "deleting..." : "delete"}
                </Text>
              </Box>
            </TouchableOpacity>
          )}
        </Box>
      </ScrollView>
    </Box>
  );
}
