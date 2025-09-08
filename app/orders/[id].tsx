import { PieceAccordion } from "@/components/orders/PieceAccordion";
import { Box } from "@/components/ui/box";
import { config } from "@/components/ui/gluestack-ui-provider/config";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useOrderDetail } from "@/hooks/useOrderDetail";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

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
        headerStyle: {
          backgroundColor: `rgb(${config.light["--color-primary-100"]})`,
        },
        headerRight: () => (
          <Box className="bg-interactive-500 px-3 py-1 rounded-lg">
            <Text className="text-neutral-50 text-xs font-medium">
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
      <Box className="flex-1 justify-center items-center bg-primary-50">
        <Spinner size="large" />
      </Box>
    );
  }

  if (orderResponse.status === "error") {
    return (
      <Box className="flex-1 justify-center items-center bg-primary-50 p-5">
        <Text className="text-alert-600 text-center">
          {orderResponse.error.message}
        </Text>
      </Box>
    );
  }

  const { data: order } = orderResponse;

  console.log(JSON.stringify(order, null, 2));

  return (
    <View className="flex-1 bg-primary-50">
      <VStack className="p-5 gap-6">
        <VStack className="gap-3">
          <Text className="text-sm font-labelSemibold text-primary-900 uppercase tracking-wider">
            Pieces ({order.order_details.length})
          </Text>
          <VStack className="gap-2">
            {order.order_details.map((detail) => (
              <PieceAccordion key={detail.id} piece={detail} />
            ))}
          </VStack>
        </VStack>

        <VStack className="gap-4">
          <VStack className="gap-2">
            <Text className="text-sm font-labelSemibold text-primary-900 uppercase tracking-wider">
              Timeline
            </Text>
            <Box className="bg-interactive-400/40 px-3 py-1 rounded-md self-start">
              <Text className="text-sm font-medium text-primary-900">
                {order.timeline}
              </Text>
            </Box>
          </VStack>
          <VStack className="gap-2">
            <Text className="text-sm font-labelSemibold text-primary-900 uppercase tracking-wider">
              Inspiration
            </Text>
            <Text className="flex-1 text-sm text-primary-900 leading-5">
              {order.inspiration || "No inspiration provided"}
            </Text>
          </VStack>

          {order.special_considerations && (
            <VStack className="gap-2">
              <Text className="text-sm font-labelSemibold text-primary-900 uppercase tracking-wider">
                Special Considerations
              </Text>
              <Text className="flex-1 text-sm text-primary-900 leading-5">
                {order.special_considerations}
              </Text>
            </VStack>
          )}

          <VStack className="gap-2">
            <Text className="text-sm font-labelSemibold text-primary-900 uppercase tracking-wider">
              Customer
            </Text>
            <HStack className="items-start gap-3">
              <VStack className="flex-1 gap-1">
                <Text className="text-sm font-medium text-primary-900">
                  {order.customers.name}
                </Text>
                <Text className="text-sm text-primary-900">
                  {order.customers.email}
                </Text>
                <Text className="text-sm text-primary-900">
                  {order.customers.phone}
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    </View>
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
