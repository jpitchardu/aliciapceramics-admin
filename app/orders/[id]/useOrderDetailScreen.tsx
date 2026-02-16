import { registerDatePickerCallback } from "@/contexts/datePicker";
import { useCancelOrder } from "@/hooks/useCancelOrder";
import { useCompleteOrder } from "@/hooks/useCompleteOrder";
import { useOrderDetail } from "@/hooks/useOrderDetail";
import { useUpdateDueDate } from "@/hooks/useUpdateDueDate";
import { useUpdateOrderDetailProgress } from "@/hooks/useUpdateOrderDetailProgress";
import { theme } from "@/theme";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { Box, Text } from "@/components";

export function useOrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderResponse = useOrderDetail(id);
  const cancelOrderMutation = useCancelOrder();
  const completeOrderMutation = useCompleteOrder();
  const updateDueDateMutation = useUpdateDueDate();
  const updateProgressMutation = useUpdateOrderDetailProgress(id);
  const navigation = useNavigation();
  const router = useRouter();

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
      navigation.setOptions({ title: "Error" });
    } else {
      navigation.setOptions({ title: "Loading..." });
    }
  }, [orderResponse, navigation]);

  const openMessagingScreen = useCallback(() => {
    if (!orderResponse.data) return;
    if (!orderResponse.data.customers) return;
    router.push(`/customers/${orderResponse.data.customer_id}/conversation`);
  }, [orderResponse.data, router]);

  const copyPhoneToClipboard = useCallback(() => {
    if (orderResponse.data?.customers?.phone) {
      Clipboard.setStringAsync(orderResponse.data.customers.phone);
    }
  }, [orderResponse.data]);

  const handleCancelOrder = useCallback(() => {
    if (!orderResponse.data) return;
    const orderId = orderResponse.data.id;
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order? This action cannot be undone.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel Order",
          style: "destructive",
          onPress: () => {
            cancelOrderMutation.mutate(orderId, {
              onSuccess: () => router.back(),
              onError: (error) => {
                Alert.alert("Error", `Failed to cancel order: ${error.message}`);
              },
            });
          },
        },
      ],
    );
  }, [orderResponse.data, cancelOrderMutation, router]);

  const handleCompleteOrder = useCallback(() => {
    if (!orderResponse.data) return;
    const orderId = orderResponse.data.id;
    Alert.alert("Complete Order", "Mark this order as completed?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Complete",
        onPress: () => {
          completeOrderMutation.mutate(orderId, {
            onSuccess: () => router.back(),
            onError: (error) => {
              Alert.alert("Error", `Failed to complete order: ${error.message}`);
            },
          });
        },
      },
    ]);
  }, [orderResponse.data, completeOrderMutation, router]);

  const openDatePicker = useCallback(() => {
    if (!orderResponse.data) return;
    const order = orderResponse.data;
    registerDatePickerCallback((date) => {
      updateDueDateMutation.mutate(
        { orderId: order.id, dueDate: date },
        {
          onError: (error) => {
            Alert.alert("Error", `Failed to update due date: ${error.message}`);
          },
        },
      );
    });
    router.push({
      pathname: "/date-picker",
      params: {
        current: order.due_date ?? undefined,
        clearable: "true",
      },
    });
  }, [orderResponse.data, updateDueDateMutation, router]);

  const handleUpdateProgress = useCallback(
    (orderDetailId: string, status?: string, completedQuantity?: number) => {
      updateProgressMutation.mutate(
        { orderDetailId, status, completedQuantity },
        {
          onError: (error) => {
            Alert.alert("Error", `Failed to update progress: ${error.message}`);
          },
        },
      );
    },
    [updateProgressMutation],
  );

  const order = orderResponse.data;
  const isStorefrontOrder = order ? !order.customers : false;

  let statusBadgeColor: keyof (typeof theme)["colors"] = "interactive400";
  if (order?.status === "completed") statusBadgeColor = "primary900";
  if (order?.status === "cancelled") statusBadgeColor = "alert600";

  return {
    order,
    isLoading: !orderResponse.isSuccess,
    isError: orderResponse.isError,
    error: orderResponse.error,
    isStorefrontOrder,
    statusBadgeColor,
    isCancelPending: cancelOrderMutation.isPending,
    isCompletePending: completeOrderMutation.isPending,
    openMessagingScreen,
    copyPhoneToClipboard,
    handleCancelOrder,
    handleCompleteOrder,
    openDatePicker,
    handleUpdateProgress,
  };
}

function getStatusStyles(status: string | null) {
  switch (status) {
    case "unread_messages":
      return { label: "Unread Messages" };
    case "ready_to_work":
      return { label: "Ready to Work" };
    case "in_progress":
      return { label: "In Progress" };
    case "drying":
      return { label: "Drying" };
    case "cancelled":
      return { label: "Cancelled" };
    default:
      return { label: status || "Unknown" };
  }
}

export function formatDueDate(dateString: string | null) {
  if (!dateString) return "No deadline set";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
