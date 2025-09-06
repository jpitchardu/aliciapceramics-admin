import { OrderCard } from "@/components/orders/OrderCard";
import { useOrders } from "@/hooks/useOrders";
import {
  Box,
  Center,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import React from "react";

export default function Dashboard() {
  const ordersResponse = useOrders();

  if (ordersResponse.status === "loading") {
    return <LoadingState />;
  }

  if (ordersResponse.status === "error") {
    return (
      <Center
        style={{
          flex: 1,
          backgroundColor: "var(--earthBg)",
          paddingHorizontal: 24,
        }}
      >
        <Text
          style={{
            color: "var(--redFocus)",
            textAlign: "center",
            fontFamily: "Poppins",
          }}
        >
          Error loading orders: {ordersResponse.error.message}
        </Text>
      </Center>
    );
  }
  const { data: orders } = ordersResponse;

  return (
    <Box className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-5 py-6">
        <VStack className="space-y-3">
          {orders.map((order) => (
            <OrderCard order={order} key={order.id} />
          ))}
        </VStack>
      </ScrollView>
    </Box>
  );
}

const LoadingState = React.memo(function LoadingState() {
  return (
    <Center style={{ flex: 1, backgroundColor: "var(--earthBg)" }}>
      <Spinner size="large" />
      <Text
        style={{
          marginTop: 16,
          color: "var(--stoneText)",
          fontFamily: "Poppins",
        }}
      >
        Loading orders...
      </Text>
    </Center>
  );
});
