import { InfoCard } from "@/components/orders/InfoCard";
import { PieceAccordion } from "@/components/orders/PieceAccordion";
import { useOrderDetail } from "@/hooks/useOrderDetail";
import { Box, ScrollView, Spinner, Text, VStack } from "@gluestack-ui/themed";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderResponse = useOrderDetail(id);
  const navigation = useNavigation();

  useEffect(() => {
    if (orderResponse.status === "success") {
      const { data: order } = orderResponse;
      const statusStyles = getStatusStyles(order.status);

      navigation.setOptions({
        title: order.customers.name,
        headerRight: () => (
          <Box className={`${statusStyles.badgeBg} px-3 py-1 rounded-lg`}>
            <Text className={`${statusStyles.badgeText} text-xs font-medium`}>
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

  if (orderResponse.status === "loading") {
    return (
      <Box
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "var(--earthBg)",
        }}
      >
        <Spinner size="large" />
      </Box>
    );
  }

  if (orderResponse.status === "error") {
    return (
      <Box
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "var(--earthBg)",
          padding: 20,
        }}
      >
        <Text style={{ color: "var(--redFocus)", textAlign: "center" }}>
          {orderResponse.error.message}
        </Text>
      </Box>
    );
  }

  const { data: order } = orderResponse;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "var(--earthBg)" }}>
      <VStack style={{ padding: 20, gap: 20 }}>
        <Box>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "var(--earthDark)",
              marginBottom: 12,
            }}
          >
            Pieces ({order.order_details.length})
          </Text>
          <VStack style={{ gap: 8 }}>
            {order.order_details.map((detail) => (
              <PieceAccordion key={detail.id} piece={detail} />
            ))}
          </VStack>
        </Box>
        <VStack style={{ gap: 16 }}>
          <InfoCard title="Timeline" content={order.timeline} icon="📅" />
          <InfoCard
            title="Inspiration"
            content={order.inspiration}
            icon="💡"
            isLink
          />
          {order.special_considerations && (
            <InfoCard
              title="Special Considerations"
              content={order.special_considerations}
              icon="⚠️"
              isSpecial
            />
          )}
          <InfoCard
            title="Customer Details"
            content={`${order.customers.name}\n${order.customers.email}\n${order.customers.phone}`}
            icon="👤"
          />
        </VStack>
      </VStack>
    </ScrollView>
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
