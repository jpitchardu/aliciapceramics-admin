// components/OrderCard.tsx
import { Box, HStack, Pressable, Text, VStack } from "@/components/ui";
import { Order } from "@/hooks/useOrders";
import React from "react";

type OrderCardProps = {
  order: {
    id: string;
    status: string | null;
    customers: { name: string } | null;
    order_details: { id: string; quantity: number; type: string }[];
  };
  onPress: (id: string) => void;
};

export function OrderCard({ order, onPress }: OrderCardProps) {
  const statusStyles = getStatusStyles(order.status);

  const onCardPress = () => {
    onPress(order.id);
  };

  return (
    <Pressable onPress={onCardPress}>
      <Box
        className={`${statusStyles.cardBg} rounded-xl p-4 border-l-4 ${statusStyles.borderColor} border-2 border-transparent`}
      >
        <VStack className="space-y-1">
          <HStack className="justify-between items-start">
            <Text className="text-lg font-semibold text-primary-900">
              {order.customers?.name || "Unknown Customer"}
            </Text>
            <Box className={`${statusStyles.badgeBg} px-3 py-1 rounded-lg`}>
              <Text className="text-xs font-semibold text-white uppercase">
                {order.status}
              </Text>
            </Box>
          </HStack>
          <Text className="text-sm text-primary-900 opacity-80">
            {buildOrderSummary(order.order_details)}
          </Text>
        </VStack>
      </Box>
    </Pressable>
  );
}

const buildOrderSummary = (orderDetails: Order["order_details"]) => {
  if (!orderDetails?.length) return "No items";

  // Group by type and sum quantities
  const grouped = orderDetails.reduce((acc, detail) => {
    if (acc[detail.type]) {
      acc[detail.type] += detail.quantity;
    } else {
      acc[detail.type] = detail.quantity;
    }
    return acc;
  }, {} as Record<string, number>);

  // Create summary like "2 mugs • 1 vase"
  return Object.entries(grouped)
    .map(([type, quantity]) => `${quantity} ${type}${quantity > 1 ? "s" : ""}`)
    .join(" • ");
};

const getStatusStyles = (status: string | null) => {
  switch (status) {
    case "unread_messages":
      return {
        cardBg: "bg-alert-600/10",
        borderColor: "border-l-alert-600",
        badgeBg: "bg-alert-600",
      };
    case "ready_to_work":
      return {
        cardBg: "bg-input-500/10",
        borderColor: "border-l-input-500",
        badgeBg: "bg-input-500",
      };
    case "in_progress":
      return {
        cardBg: "bg-interactive-500/10",
        borderColor: "border-l-interactive-500",
        badgeBg: "bg-interactive-500",
      };
    case "drying":
      return {
        cardBg: "bg-neutral-50",
        borderColor: "border-l-neutral-600",
        badgeBg: "bg-neutral-600",
      };
    default:
      return {
        cardBg: "bg-neutral-50",
        borderColor: "border-l-neutral-200",
        badgeBg: "bg-neutral-600",
      };
  }
};
