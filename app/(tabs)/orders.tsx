import { Box, Text } from "@/components";
import { useOrders, Order } from "@/hooks/useOrders";
import { useRouter } from "expo-router";
import {
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useMemo, useState } from "react";

type FilterType = "all" | "commissioned" | "storefront" | "cancelled";

export default function OrdersScreen() {
  const router = useRouter();
  const { data: orders, isLoading, isError, error } = useOrders();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredAndSortedOrders = useMemo(() => {
    if (!orders) return [];

    let filtered = orders.filter(order => {
      if (activeFilter === "all") {
        return order.status !== "cancelled";
      }
      if (activeFilter === "cancelled") {
        return order.status === "cancelled";
      }
      return order.type === activeFilter && order.status !== "cancelled";
    });

    return filtered.sort((a, b) => {
      const dateA = a.due_date || a.timeline;
      const dateB = b.due_date || b.timeline;

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;

      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });
  }, [orders, activeFilter]);

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

  const FilterPill = ({ filter, label }: { filter: FilterType; label: string }) => (
    <TouchableOpacity onPress={() => setActiveFilter(filter)}>
      <Box
        paddingHorizontal="m"
        paddingVertical="s"
        borderRadius="xl"
        backgroundColor={activeFilter === filter ? "primary900" : "neutral50"}
        borderWidth={1}
        borderColor={activeFilter === filter ? "primary900" : "neutral200"}
      >
        <Text
          variant="label"
          color={activeFilter === filter ? "neutral50" : "neutral600"}
          fontSize={12}
        >
          {label}
        </Text>
      </Box>
    </TouchableOpacity>
  );

  return (
    <Box flex={1} backgroundColor="primary50">
      <ScrollView style={{ flex: 1 }}>
        <Box paddingHorizontal="m" paddingTop="m" paddingBottom="s">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Box flexDirection="row" gap="s">
              <FilterPill filter="all" label="All" />
              <FilterPill filter="commissioned" label="Commissions" />
              <FilterPill filter="storefront" label="Storefront" />
              <FilterPill filter="cancelled" label="Cancelled" />
            </Box>
          </ScrollView>
        </Box>

        <Box padding="m" gap="s">
          {filteredAndSortedOrders && filteredAndSortedOrders.length > 0 ? (
            filteredAndSortedOrders.map((order) => (
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
                  <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="xs">
                    <Text variant="heading">
                      {order.customers?.name || order.name || "Order"}
                    </Text>
                    {order.type && (
                      <Box
                        paddingHorizontal="s"
                        paddingVertical="xs"
                        borderRadius="s"
                        backgroundColor={order.type === "commissioned" ? "interactive300" : "input300"}
                      >
                        <Text variant="label" fontSize={10} color="neutral50">
                          {order.type.toUpperCase()}
                        </Text>
                      </Box>
                    )}
                  </Box>
                  <Text variant="body" color="neutral600" fontSize={14}>
                    Status: {order.status || "pending"}
                  </Text>
                  <Text variant="body" color="neutral600" fontSize={14}>
                    Items: {order.order_details.length}
                  </Text>
                  {(order.due_date || order.timeline) && (
                    <Text variant="body" color="primary900" fontSize={14} marginTop="xs">
                      Due: {new Date(order.due_date || order.timeline!).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </Text>
                  )}
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
