import { Tables } from "@/api/dbTypes";
import { Box, Text } from "@/components";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

interface PieceAccordionProps {
  piece: Tables<"order_details">;
}

export function PieceAccordion({ piece }: PieceAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box backgroundColor="primary100" borderRadius="m" overflow="hidden">
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <Box flexDirection="row" alignItems="center" gap="s" padding="m">
          <Box flex={1}>
            <Box flexDirection="row" alignItems="center" gap="s">
              <Text variant="label">{piece.type}</Text>
              {piece.size && <Text variant="body">• {piece.size}</Text>}
            </Box>
          </Box>
          <Box
            backgroundColor="interactive500"
            paddingHorizontal="s"
            paddingVertical="xs"
            borderRadius="s"
          >
            <Text variant="label" color="neutral50">
              {piece.quantity}
            </Text>
          </Box>
          <Text variant="body" color="primary900">
            {isExpanded ? "↑" : "↓"}
          </Text>
        </Box>
      </TouchableOpacity>
      {isExpanded && (
        <Box paddingHorizontal="m" paddingBottom="m">
          <Text variant="body">{piece.description}</Text>
        </Box>
      )}
    </Box>
  );
}
