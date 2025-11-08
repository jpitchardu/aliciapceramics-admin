import { Box, Text } from "@/components";
import { DatePickerModal } from "@/components/DatePickerModal";
import { PieceAccordion } from "@/components/orders/PieceAccordion";
import { useCancelOrder } from "@/hooks/useCancelOrder";
import { useCompleteOrder } from "@/hooks/useCompleteOrder";
import { useOrderDetail } from "@/hooks/useOrderDetail";
import { useUpdateDueDate } from "@/hooks/useUpdateDueDate";
import { useUpdateOrderDetailProgress } from "@/hooks/useUpdateOrderDetailProgress";
import { theme } from "@/theme";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const STATUS_COLOR: Record<string, keyof (typeof theme)["colors"]> = {
  completed: "primary900",
  cancelled: "input500",
};

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderResponse = useOrderDetail(id);
  const cancelOrderMutation = useCancelOrder();
  const completeOrderMutation = useCompleteOrder();
  const updateDueDateMutation = useUpdateDueDate();
  const updateProgressMutation = useUpdateOrderDetailProgress(id);
  const navigation = useNavigation();
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (orderResponse.status === "success") {
      const { data: order } = orderResponse;
      const statusStyles = getStatusStyles(order.status);

      navigation.setOptions({
        title: order.customers?.name || order.name || "Order",
        headerStyle: {
          backgroundColor: theme.colors.primary100,
        },
        headerRight: () => (
          <Box
            backgroundColor="interactive500"
            paddingHorizontal="s"
            paddingVertical="xs"
            borderRadius="s"
          >
            <Text variant="label" color="neutral50">
              {statusStyles.label}
            </Text>
          </Box>
        ),
      });
    } else if (orderResponse.status === "error") {
      navigation.setOptions({
        title: "Error",
      });
    } else {
      navigation.setOptions({
        title: "Loading...",
      });
    }
  }, [orderResponse, navigation]);

  if (orderResponse.isError) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="primary50"
        padding="m"
      >
        <Text variant="body" color="alert600" textAlign="center">
          {orderResponse.error.message}
        </Text>
      </Box>
    );
  }

  if (!orderResponse.isSuccess) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="primary50"
      >
        <ActivityIndicator size="large" color={theme.colors.primary900} />
      </Box>
    );
  }

  const { data: order } = orderResponse;

  const isStorefrontOrder = !order.customers;

  const openMessagingScreen = () => {
    if (!isStorefrontOrder) {
      router.push(`/customers/${order.customer_id}/conversation`);
    }
  };

  const copyPhoneToClipboard = () => {
    if (order.customers?.phone) {
      Clipboard.setStringAsync(order.customers.phone);
    }
  };

  const handleCancelOrder = () => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order? This action cannot be undone.",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel Order",
          style: "destructive",
          onPress: () => {
            cancelOrderMutation.mutate(order.id, {
              onSuccess: () => {
                router.back();
              },
              onError: (error) => {
                Alert.alert(
                  "Error",
                  `Failed to cancel order: ${error.message}`
                );
              },
            });
          },
        },
      ]
    );
  };

  const handleCompleteOrder = () => {
    Alert.alert("Complete Order", "Mark this order as completed?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Complete",
        onPress: () => {
          completeOrderMutation.mutate(order.id, {
            onSuccess: () => {
              router.back();
            },
            onError: (error) => {
              Alert.alert(
                "Error",
                `Failed to complete order: ${error.message}`
              );
            },
          });
        },
      },
    ]);
  };

  const handleDueDateConfirm = (date: Date | null) => {
    setShowDatePicker(false);
    updateDueDateMutation.mutate(
      { orderId: order.id, dueDate: date },
      {
        onError: (error) => {
          Alert.alert("Error", `Failed to update due date: ${error.message}`);
        },
      }
    );
  };

  const handleUpdateProgress = (
    orderDetailId: string,
    status?: string,
    completedQuantity?: number
  ) => {
    updateProgressMutation.mutate(
      { orderDetailId, status, completedQuantity },
      {
        onError: (error) => {
          Alert.alert("Error", `Failed to update progress: ${error.message}`);
        },
      }
    );
  };

  let statusBadgeColor: keyof (typeof theme)["colors"] = "interactive400";

  if (order.status === "completed") {
    statusBadgeColor = "primary900";
  }

  if (order.status === "cancelled") {
    statusBadgeColor = "alert600";
  }

  return (
    <Box flex={1} backgroundColor="primary50">
      <Box flexDirection="row" padding="m">
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="New order"
          onPress={router.back}
          style={styles.tab}
        >
          <SymbolView
            name="xmark"
            size={24}
            type="hierarchical"
            tintColor={theme.colors.primary900}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Box flex={1} />
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="New order"
          onPress={openMessagingScreen}
          style={styles.tab}
        >
          <SymbolView
            name="bubble.fill"
            size={24}
            type="hierarchical"
            tintColor={theme.colors.primary900}
            style={styles.icon}
          />
        </TouchableOpacity>
      </Box>

      <Box paddingTop="l" paddingBottom="s" paddingHorizontal="m" gap="s">
        <Text variant="title">
          {isStorefrontOrder ? order.name : order.customers?.name}
        </Text>
        <Box flexDirection="row">
          {order.status ? (
            <>
              <Box
                backgroundColor={statusBadgeColor}
                paddingHorizontal="s"
                paddingVertical="xs"
                borderRadius="s"
                alignSelf="flex-start"
              >
                <Text
                  variant="label"
                  color={
                    order.status === "completed" ? "primary50" : "primary900"
                  }
                >
                  {order.status}
                </Text>
              </Box>
              <Box width={theme.spacing.s} />
            </>
          ) : null}
          <Box
            backgroundColor={"interactive400"}
            paddingHorizontal="s"
            paddingVertical="xs"
            borderRadius="s"
            alignSelf="flex-start"
          >
            <Text variant="label">
              {formatDueDate(order.due_date ?? order.timeline)}
            </Text>
          </Box>
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
                disabled={cancelOrderMutation.isPending}
                style={{ flex: 1 }}
              >
                <Box
                  backgroundColor="input500"
                  padding="m"
                  borderRadius="m"
                  opacity={cancelOrderMutation.isPending ? 0.5 : 1}
                >
                  <Text variant="button" color="primary900" textAlign="center">
                    {cancelOrderMutation.isPending ? "cancelling..." : "cancel"}
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
                  opacity={1}
                >
                  <Text variant="button" color="neutral50" textAlign="center">
                    {completeOrderMutation.isPending
                      ? "working..."
                      : "complete"}
                  </Text>
                </Box>
              </TouchableOpacity>
            </Box>
          ) : null}
        </Box>
      </ScrollView>
      <DatePickerModal
        visible={showDatePicker}
        currentDate={order.due_date ? new Date(order.due_date) : null}
        onConfirm={handleDueDateConfirm}
        onCancel={() => setShowDatePicker(false)}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.borderRadii.l,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

function getStatusStyles(status: string | null) {
  switch (status) {
    case "unread_messages":
      return {
        badgeBg: "bg-red-500",
        badgeText: "text-white",
        label: "Unread Messages",
      };
    case "ready_to_work":
      return {
        badgeBg: "bg-orange-500",
        badgeText: "text-white",
        label: "Ready to Work",
      };
    case "in_progress":
      return {
        badgeBg: "bg-blue-500",
        badgeText: "text-white",
        label: "In Progress",
      };
    case "drying":
      return {
        badgeBg: "bg-gray-500",
        badgeText: "text-white",
        label: "Drying",
      };
    case "cancelled":
      return {
        badgeBg: "bg-red-900",
        badgeText: "text-white",
        label: "Cancelled",
      };
    default:
      return {
        badgeBg: "bg-gray-400",
        badgeText: "text-white",
        label: status || "Unknown",
      };
  }
}

const formatDueDate = (dateString: string | null) => {
  if (!dateString) return "No deadline set";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
