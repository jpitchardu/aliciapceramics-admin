import { Box, Text } from "@/components";
import { PieceAccordion } from "@/components/orders/PieceAccordion";
import { Badge } from "@/ui/Badge";
import { DragHandle } from "@/ui/DragHandle";
import { ErrorState } from "@/ui/ErrorState";
import { LoadingState } from "@/ui/LoadingState";
import { useOrderDetailScreen, formatDueDate } from "./useOrderDetailScreen";
import { ScrollView, TouchableOpacity } from "react-native";

export default function OrderDetail() {
  const {
    order,
    isLoading,
    isError,
    error,
    isStorefrontOrder,
    statusBadgeColor,
    isCancelPending,
    isCompletePending,
    openMessagingScreen,
    copyPhoneToClipboard,
    handleCancelOrder,
    handleCompleteOrder,
    openDatePicker,
    handleUpdateProgress,
  } = useOrderDetailScreen();

  if (isError) {
    return <ErrorState message={error?.message} />;
  }

  if (isLoading || !order) {
    return <LoadingState />;
  }

  return (
    <Box flex={1} backgroundColor="primary50">
      <DragHandle />

      <Box paddingTop="l" paddingBottom="s" paddingHorizontal="m" gap="s">
        <Text variant="title">
          {isStorefrontOrder ? order.name : order.customers?.name}
        </Text>
        <Box flexDirection="row">
          {order.status ? (
            <>
              <Badge
                label={order.status}
                backgroundColor={statusBadgeColor}
                color={order.status === "completed" ? "primary50" : "primary900"}
              />
              <Box width={8} />
            </>
          ) : null}
          <TouchableOpacity onPress={openDatePicker}>
            <Badge
              label={formatDueDate(order.due_date ?? order.timeline)}
              backgroundColor="interactive400"
            />
          </TouchableOpacity>
        </Box>
      </Box>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Box padding="m" gap="l">
          <Box gap="s">
            <Text variant="label">Pieces ({order.order_details.length})</Text>
            <Box gap="s">
              {order.order_details.map((detail) => (
                <PieceAccordion
                  key={detail.id}
                  piece={detail}
                  onUpdateProgress={handleUpdateProgress}
                />
              ))}
            </Box>
          </Box>

          <Box gap="m">
            {order.inspiration?.length > 0 ? (
              <>
                <Text variant="label">Inspiration</Text>
                <Text variant="body">{order.inspiration}</Text>
              </>
            ) : null}

            {order.special_considerations &&
            order.special_considerations.length > 0 ? (
              <>
                <Text variant="label">Special Considerations</Text>
                <Text variant="body">{order.special_considerations}</Text>
              </>
            ) : null}

            {!isStorefrontOrder && (
              <Box gap="s">
                <Text variant="label">Customer</Text>
                <TouchableOpacity
                  onPress={openMessagingScreen}
                  onLongPress={copyPhoneToClipboard}
                >
                  <Box
                    backgroundColor="primary100"
                    padding="m"
                    borderRadius="m"
                    borderWidth={1}
                    borderColor="neutral200"
                  >
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box flex={1} gap="xs">
                        <Text variant="body">{order.customers!.name}</Text>
                        <Text variant="body">{order.customers!.email}</Text>
                        <Text variant="body">{order.customers!.phone}</Text>
                      </Box>
                      <Box alignItems="center" gap="xs">
                        <Text variant="button" color="primary900" fontSize={10}>
                          MESSAGES
                        </Text>
                        <Text variant="body" fontSize={18}>
                          →
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </TouchableOpacity>
                <Text
                  variant="label"
                  color="neutral600"
                  fontSize={10}
                  textTransform="none"
                >
                  Tap to open messages • Long press to copy phone
                </Text>
              </Box>
            )}
          </Box>

          {order.status !== "completed" ? (
            <Box gap="s" flexDirection="row" justifyContent="space-between">
              <TouchableOpacity
                onPress={handleCancelOrder}
                disabled={isCancelPending}
                style={{ flex: 1 }}
              >
                <Box
                  backgroundColor="input500"
                  padding="m"
                  borderRadius="m"
                  opacity={isCancelPending ? 0.5 : 1}
                >
                  <Text variant="button" color="primary900" textAlign="center">
                    {isCancelPending ? "cancelling..." : "cancel"}
                  </Text>
                </Box>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCompleteOrder}
                style={{ flex: 1 }}
              >
                <Box
                  backgroundColor="primary900"
                  padding="m"
                  borderRadius="m"
                >
                  <Text variant="button" color="neutral50" textAlign="center">
                    {isCompletePending ? "working..." : "complete"}
                  </Text>
                </Box>
              </TouchableOpacity>
            </Box>
          ) : null}
        </Box>
      </ScrollView>
    </Box>
  );
}
