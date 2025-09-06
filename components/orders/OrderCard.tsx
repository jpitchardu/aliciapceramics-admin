// components/OrderCard.tsx
import { Order } from "@/hooks/useOrders";
import { Box, HStack, Pressable, Text, VStack } from "@gluestack-ui/themed";
import React from "react";

type OrderCardProps = {
  order: {
    id: string;
    status: string | null;
    customers: { name: string } | null;
    order_details: { id: string; quantity: number; type: string }[];
  };
  onPress?: () => void;
};

export function OrderCard({ order, onPress }: OrderCardProps) {
  const statusStyles = getStatusStyles(order.status);

  return (
    <Pressable key={order.id}>
      <Box
        className={`${statusStyles.cardBg} rounded-xl p-4 border-l-4 ${statusStyles.borderColor} border-2 border-transparent hover:border-orange-300 hover:-translate-y-0.5`}
      >
        <VStack className="space-y-1">
          <HStack className="justify-between items-start">
            <Text className="text-lg font-semibold text-gray-800">
              {order.customers?.name || "Unknown Customer"}
            </Text>
            <Box className={`${statusStyles.badgeBg} px-3 py-1 rounded-lg`}>
              <Text className="text-xs font-semibold text-white uppercase">
                {order.status}
              </Text>
            </Box>
          </HStack>
          <Text className="text-sm text-gray-600 opacity-80">
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
        cardBg: "bg-red-50",
        borderColor: "border-l-red-500",
        badgeBg: "bg-red-500",
      };
    case "ready_to_work":
      return {
        cardBg: "bg-orange-50",
        borderColor: "border-l-orange-500",
        badgeBg: "bg-orange-500",
      };
    case "in_progress":
      return {
        cardBg: "bg-blue-50",
        borderColor: "border-l-blue-500",
        badgeBg: "bg-blue-500",
      };
    case "drying":
      return {
        cardBg: "bg-gray-50",
        borderColor: "border-l-gray-500",
        badgeBg: "bg-gray-500",
      };
    default:
      return {
        cardBg: "bg-white",
        borderColor: "border-l-gray-300",
        badgeBg: "bg-gray-400",
      };
  }
};
