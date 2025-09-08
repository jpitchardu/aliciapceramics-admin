import { Tables } from "@/api/dbTypes";

import React, { useState } from "react";
import { Box } from "../ui/box";
import { HStack } from "../ui/hstack";
import { ChevronDownIcon, ChevronUpIcon, Icon } from "../ui/icon";
import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface PieceAccordionProps {
  piece: Tables<"order_details">;
}

export function PieceAccordion({ piece }: PieceAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box className="bg-primary-100 rounded-md overflow-hidden ">
      <Pressable onPress={() => setIsExpanded(!isExpanded)}>
        <HStack className="items-center gap-3 p-4">
          <VStack className="flex-1">
            <HStack className="items-center gap-2">
              <Text className="font-labelSemibold text-primary-900 text-base">
                {piece.type}
              </Text>
              {piece.size && (
                <Text className="text-sm text-primary-900">• {piece.size}</Text>
              )}
            </HStack>
          </VStack>
          <Box className="bg-interactive-500 px-2 py-1 rounded-md">
            <Text className="text-neutral-50 text-xs font-medium">
              {piece.quantity}
            </Text>
          </Box>
          <Icon
            as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
            className="text-primary-900"
            style={{ width: 16, height: 16 }}
          />
        </HStack>
      </Pressable>
      {isExpanded && (
        <HStack className="gap-3 px-4 pb-4">
          <Text className="text-sm text-primary-900 italic">
            {piece.description}
          </Text>
        </HStack>
      )}
    </Box>
  );
}
