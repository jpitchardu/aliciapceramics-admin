import { OrderCard } from "@/components/orders/OrderCard";
import { Box, Text } from "@/components";
import { useOrders } from "@/hooks/useOrders";
import { useRouter } from "expo-router";
import { memo, useCallback } from "react";
import { ScrollView, ActivityIndicator } from "react-native";

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
      <Box flex={1} backgroundColor="primary50" paddingHorizontal="l">
        <Text variant="body" color="alert600" textAlign="center">
          Error loading orders: {ordersResponse.error.message}
        </Text>
      </Box>
    );
  }
  const { data: orders } = ordersResponse;

  return (
    <Box flex={1} backgroundColor="primary50">
      <ScrollView style={{ flex: 1 }}>
        <Box padding="m" gap="m">
          {orders.map((order) => (
            <OrderCard
              order={order}
              key={order.id}
              onPress={onOrderItemPress}
            />
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
}

const LoadingState = memo(function LoadingState() {
  return (
    <Box flex={1} backgroundColor="primary50" justifyContent="center" alignItems="center">
      <ActivityIndicator size="large" color="#3d1900" />
      <Text variant="body" marginTop="m">Loading orders...</Text>
    </Box>
  );
});
