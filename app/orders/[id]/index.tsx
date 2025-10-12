import { PieceAccordion } from "@/components/orders/PieceAccordion";
import { Box, Text } from "@/components";
import { theme } from "@/theme";
import { useOrderDetail } from "@/hooks/useOrderDetail";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { TouchableOpacity, ActivityIndicator } from "react-native";

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderResponse = useOrderDetail(id);
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    if (orderResponse.status === "success") {
      const { data: order } = orderResponse;
      const statusStyles = getStatusStyles(order.status);

      navigation.setOptions({
        title: order.customers.name,
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

  const openMessagingScreen = () => {
    router.push(`/orders/${order.id}/messages`);
  };

  const copyPhoneToClipboard = () => {
    if (order.customers.phone) {
      Clipboard.setStringAsync(order.customers.phone);
    }
  };

  return (
    <Box flex={1} backgroundColor="primary50">
      <Box padding="m" gap="l">
        <Box gap="s">
          <Text variant="label">Pieces ({order.order_details.length})</Text>
          <Box gap="s">
            {order.order_details.map((detail) => (
              <PieceAccordion key={detail.id} piece={detail} />
            ))}
          </Box>
        </Box>

        <Box gap="m">
          <Text variant="label">Timeline</Text>
          <Box
            backgroundColor="interactive400"
            paddingHorizontal="s"
            paddingVertical="xs"
            borderRadius="s"
            alignSelf="flex-start"
          >
            <Text variant="body">{order.timeline}</Text>
          </Box>

          <Text variant="label">Inspiration</Text>
          <Text variant="body">{order.inspiration}</Text>

          <Text variant="label">Special Considerations</Text>
          <Text variant="body">{order.special_considerations}</Text>

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
                    <Text variant="body">{order.customers.name}</Text>
                    <Text variant="body">{order.customers.email}</Text>
                    <Text variant="body">{order.customers.phone}</Text>
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
        </Box>
      </Box>
    </Box>
  );
}

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
    default:
      return {
        badgeBg: "bg-gray-400",
        badgeText: "text-white",
        label: status || "Unknown",
      };
  }
}
