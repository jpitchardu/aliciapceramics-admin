import { Box, Text } from "@/components";
import { OrderCard } from "@/components/orders/OrderCard";
import { ErrorState } from "@/ui/ErrorState";
import { FilterPill } from "@/ui/FilterPill";
import { FilterPillBar } from "@/ui/FilterPillBar";
import { LoadingState } from "@/ui/LoadingState";
import { ScreenContainer } from "@/ui/ScreenContainer";
import { useOrdersScreen } from "./useOrdersScreen";
import { ScrollView } from "react-native";

export default function OrdersScreen() {
  const {
    isLoading,
    isError,
    error,
    activeFilter,
    setActiveFilter,
    filteredAndSortedOrders,
    handleScroll,
    onOrderPress,
  } = useOrdersScreen();

  if (isError) {
    console.error(error);
    return <ErrorState message="Error Loading Orders" />;
  }

  if (isLoading) {
    return <LoadingState message="Loading orders..." />;
  }

  return (
    <ScreenContainer>
      <Text variant="title" paddingTop="xxl">
        Orders
      </Text>
      <FilterPillBar>
        <FilterPill label="All" active={activeFilter === "all"} onPress={() => setActiveFilter("all")} />
        <FilterPill label="Commissions" active={activeFilter === "commissioned"} onPress={() => setActiveFilter("commissioned")} />
        <FilterPill label="Storefront" active={activeFilter === "storefront"} onPress={() => setActiveFilter("storefront")} />
        <FilterPill label="Bulk" active={activeFilter === "bulk"} onPress={() => setActiveFilter("bulk")} />
        <FilterPill label="Completed" active={activeFilter === "completed"} onPress={() => setActiveFilter("completed")} />
        <FilterPill label="Cancelled" active={activeFilter === "cancelled"} onPress={() => setActiveFilter("cancelled")} />
      </FilterPillBar>

      <Box paddingHorizontal="xs" gap="s" flex={1}>
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 90, gap: 8 }}
          showsVerticalScrollIndicator={false}
        >
          {filteredAndSortedOrders && filteredAndSortedOrders.length > 0 ? (
            filteredAndSortedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onPress={onOrderPress}
              />
            ))
          ) : (
            <Box paddingVertical="xl" alignItems="center">
              <Text variant="heading" color="neutral600" textAlign="center">
                No orders found
              </Text>
            </Box>
          )}
        </ScrollView>
      </Box>
    </ScreenContainer>
  );
}
