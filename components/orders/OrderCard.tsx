// components/OrderCard.tsx
import { Box, Text } from "@/components";
import { Order } from "@/hooks/useOrders";
import { TouchableOpacity } from "react-native";

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
    <TouchableOpacity onPress={onCardPress}>
      <Box
        backgroundColor={statusStyles.cardBg}
        borderRadius="xl"
        padding="m"
        borderLeftWidth={4}
        borderLeftColor={statusStyles.borderColor}
        borderWidth={2}
        borderColor="primary50"
      >
        <Box gap="xs">
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Text variant="heading">
              {order.customers?.name || "Unknown Customer"}
            </Text>
            <Box
              backgroundColor={statusStyles.badgeBg}
              paddingHorizontal="s"
              paddingVertical="xs"
              borderRadius="s"
            >
              <Text variant="label" color="neutral50">
                {order.status}
              </Text>
            </Box>
          </Box>
          <Text variant="body">{buildOrderSummary(order.order_details)}</Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );
}

const buildOrderSummary = (orderDetails: Order["order_details"]) => {
  if (!orderDetails?.length) return "No items";

  // Group by type and sum quantities
  const grouped = orderDetails.reduce(
    (acc, detail) => {
      if (acc[detail.type]) {
        acc[detail.type] += detail.quantity;
      } else {
        acc[detail.type] = detail.quantity;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  // Create summary like "2 mugs • 1 vase"
  return Object.entries(grouped)
    .map(([type, quantity]) => `${quantity} ${type}${quantity > 1 ? "s" : ""}`)
    .join(" • ");
};

const getStatusStyles = (status: string | null) => {
  switch (status) {
    case "unread_messages":
      return {
        cardBg: "primary100" as const,
        borderColor: "alert600" as const,
        badgeBg: "alert600" as const,
      };
    case "ready_to_work":
      return {
        cardBg: "input300" as const,
        borderColor: "input500" as const,
        badgeBg: "input500" as const,
      };
    case "in_progress":
      return {
        cardBg: "interactive300" as const,
        borderColor: "interactive500" as const,
        badgeBg: "interactive500" as const,
      };
    case "drying":
      return {
        cardBg: "neutral50" as const,
        borderColor: "neutral600" as const,
        badgeBg: "neutral600" as const,
      };
    case "cancelled":
      return {
        cardBg: "neutral200" as const,
        borderColor: "alert600" as const,
        badgeBg: "alert600" as const,
      };
    default:
      return {
        cardBg: "neutral50" as const,
        borderColor: "neutral200" as const,
        badgeBg: "neutral600" as const,
      };
  }
};
