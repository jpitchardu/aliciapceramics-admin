import { OrderCard } from "@/components/orders/OrderCard";
import { Box, Spinner, Text, VStack } from "@/components/ui";
import { useOrders } from "@/hooks/useOrders";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { ScrollView } from "react-native";

export default function Dashboard() {
  const router = useRouter();
  const ordersResponse = useOrders();

  const onOrderItemPress = useCallback(
    (id: string) => {
      router.push(`/orders/${id}`);
    },
    [router]
  );

  if (ordersResponse.status === "loading") {
    return <LoadingState />;
  }

  if (ordersResponse.status === "error") {
    return (
      <Box className="flex-1 bg-primary-50 px-6">
        <Text className="text-alert-600 text-center font-body">
          Error loading orders: {ordersResponse.error.message}
        </Text>
      </Box>
    );
  }
  const { data: orders } = ordersResponse;

  return (
    <Box className="flex-1 bg-primary-50">
      <ScrollView className="flex-1 px-5 py-6">
        <VStack className="space-y-3">
          {orders.map((order) => (
            <OrderCard
              order={order}
              key={order.id}
              onPress={onOrderItemPress}
            />
          ))}
        </VStack>
      </ScrollView>
    </Box>
  );
}

const LoadingState = React.memo(function LoadingState() {
  return (
    <Box className="flex-1 bg-primary-50">
      <Spinner size="large" />
      <Text className="mt-4 text-primary-900 font-body">Loading orders...</Text>
    </Box>
  );
});
