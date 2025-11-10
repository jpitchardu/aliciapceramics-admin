import { Box, Text } from "@/components";
import { useOrders } from "@/hooks/useOrders";

import { useScroll } from "@/contexts/ScrollContext";
import { theme } from "@/theme";
import { ScreenContainer } from "@/ui/ScreenContainer";
import { BlurView } from "expo-blur";
import { useNavigation, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type FilterType = "all" | "commissioned" | "storefront" | "cancelled";

export default function OrdersScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { data: orders, isLoading, isError, error } = useOrders();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const { setScrollY } = useScroll();

  const ActionButton = useMemo(
    () =>
      function ActionButton() {
        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="New order"
            onPress={() => router.push("/storefront/create")}
            style={styles.tab}
          >
            <BlurView
              intensity={15}
              style={styles.blurContainer}
              tint="prominent"
            />
            <SymbolView
              name="plus"
              size={24}
              type="hierarchical"
              tintColor={theme.colors.primary900}
              style={styles.icon}
            />
          </TouchableOpacity>
        );
      },
    [router]
  );

  useEffect(() => {
    navigation.setOptions({
      tabBarActionButton: ActionButton,
    });
  }, [navigation, ActionButton]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setScrollY(event.nativeEvent.contentOffset.y);
    },
    [setScrollY]
  );

  const filteredAndSortedOrders = useMemo(() => {
    if (!orders) return [];

    let filtered = orders.filter((order) => {
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
          Error Loading Orders
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

  const FilterPill = ({
    filter,
    label,
  }: {
    filter: FilterType;
    label: string;
  }) => (
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
          color={activeFilter === filter ? "neutral50" : "primary700"}
          fontSize={12}
        >
          {label}
        </Text>
      </Box>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <Text variant="title" paddingTop="xxl">
        Orders
      </Text>
      <Box paddingHorizontal="xs" paddingTop="m" paddingBottom="m">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Box flexDirection="row" gap="s">
            <FilterPill filter="all" label="All" />
            <FilterPill filter="commissioned" label="Commissions" />
            <FilterPill filter="storefront" label="Storefront" />
            <FilterPill filter="cancelled" label="Cancelled" />
          </Box>
        </ScrollView>
      </Box>

      <Box paddingHorizontal="xs" gap="s" flex={1}>
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 90, gap: 8 }}
          showsVerticalScrollIndicator={false}
        >
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
                  <Box
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    marginBottom="xs"
                  >
                    <Text variant="body">
                      {order.customers?.name || order.name || "Order"}
                    </Text>
                    {order.type && (
                      <Box
                        paddingHorizontal="s"
                        paddingVertical="xs"
                        borderRadius="s"
                        backgroundColor={
                          order.type === "commissioned"
                            ? "interactive300"
                            : "input300"
                        }
                      >
                        <Text variant="label" fontSize={10} color="primary700">
                          {order.type.toUpperCase()}
                        </Text>
                      </Box>
                    )}
                  </Box>
                  <Text variant="body" color="primary900" fontSize={14}>
                    Status: {order.status || "pending"}
                  </Text>
                  {(order.due_date || order.timeline) && (
                    <Text
                      variant="body"
                      color="primary900"
                      fontSize={14}
                      marginTop="xs"
                    >
                      Due:{" "}
                      {new Date(
                        order.due_date || order.timeline!
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
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
        </ScrollView>
      </Box>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.m,
    backgroundColor: `${theme.colors.primary100}95`,
    borderRadius: theme.borderRadii.l,
    elevation: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  blurContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: theme.borderRadii.l,
  },
});
