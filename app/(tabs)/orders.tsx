import { Box, Text } from "@/components";
import { useOrders } from "@/hooks/useOrders";
import { useRouter } from "expo-router";
import {
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function OrdersScreen() {
  const router = useRouter();
  const { data: orders, isLoading, isError, error } = useOrders();

  if (isError) {
    console.error(error);

    return (
      <Box
        flex={1}
        backgroundColor="primary50"
        justifyContent="center"
        alignItems="center"
        padding="l"
      >
        <Text variant="heading" color="alert600" textAlign="center">
          Error Loading Orders, {}
        </Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        flex={1}
        backgroundColor="primary50"
        justifyContent="center"
        alignItems="center"
      >
        <ActivityIndicator size="large" color="#3d1900" />
        <Text variant="body" marginTop="m">
          Loading orders...
        </Text>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="primary50">
      <ScrollView style={{ flex: 1 }}>
        <Box padding="m" gap="s">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <TouchableOpacity
                key={order.id}
                onPress={() => router.push(`/orders/${order.id}`)}
              >
                <Box
                  backgroundColor="neutral50"
                  padding="m"
                  borderRadius="m"
                  borderWidth={1}
                  borderColor="neutral200"
                >
                  <Text variant="heading" marginBottom="xs">
                    {order.customers?.name || order.name || "Order"}
                  </Text>
                  <Text variant="body" color="neutral600" fontSize={14}>
                    Status: {order.status || "pending"}
                  </Text>
                  <Text variant="body" color="neutral600" fontSize={14}>
                    Items: {order.order_details.length}
                  </Text>
                </Box>
              </TouchableOpacity>
            ))
          ) : (
            <Box paddingVertical="xl" alignItems="center">
              <Text variant="heading" color="neutral600" textAlign="center">
                No orders found
              </Text>
            </Box>
          )}
        </Box>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/storefront/create")}
      >
        <Box
          backgroundColor="primary900"
          width={56}
          height={56}
          borderRadius="xl"
          justifyContent="center"
          alignItems="center"
        >
          <Text variant="heading" color="neutral50" fontSize={24}>
            +
          </Text>
        </Box>
      </TouchableOpacity>
    </Box>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});
