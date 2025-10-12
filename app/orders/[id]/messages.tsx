import { Box, Text } from "@/components";
import { MessagingInterface } from "@/components/messaging/MessagingInterface";
import { useOrderDetail } from "@/hooks/useOrderDetail";
import { theme } from "@/theme";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function MessagesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderResponse = useOrderDetail(id);
  const navigation = useNavigation();

  useEffect(() => {
    if (orderResponse.status === "success") {
      const { data: order } = orderResponse;
      navigation.setOptions({
        title: `Messages - ${order.customers.name}`,
        headerStyle: {
          backgroundColor: theme.colors.primary100,
        },
      });
    } else if (orderResponse.status === "error") {
      navigation.setOptions({
        title: "Messages - Error",
      });
    } else {
      navigation.setOptions({
        title: "Messages - Loading...",
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
        padding="l"
      >
        <Text
          variant="heading"
          color="alert600"
          textAlign="center"
          marginBottom="m"
        >
          Error Loading Order
        </Text>
        <Text variant="body" color="neutral600" textAlign="center">
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
        <Text variant="body" color="neutral600" marginTop="m">
          Loading messages...
        </Text>
      </Box>
    );
  }

  const { data: order } = orderResponse;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <MessagingInterface customerId={order.customer_id} orderId={order.id} />
    </KeyboardAvoidingView>
  );
}
