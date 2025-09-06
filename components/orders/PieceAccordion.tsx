import { Tables } from "@/api/dbTypes";
import {
  Box,
  ChevronDownIcon,
  ChevronUpIcon,
  HStack,
  Pressable,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import React, { useState } from "react";

interface PieceAccordionProps {
  piece: Tables<"order_details">;
}

export function PieceAccordion({ piece }: PieceAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const pieceEmoji = getPieceEmoji(piece.type);
  const sizeText = piece.size ? ` • ${piece.size}"` : "";

  return (
    <Box
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        style={{
          minHeight: 44, // Accessibility touch target
        }}
      >
        <HStack
          style={{
            padding: 16,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <VStack style={{ alignItems: "center", flex: 1, gap: 12 }}>
            <Text style={{ fontSize: 20 }}>{pieceEmoji}</Text>
            <VStack style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "var(--earthDark)",
                }}
              >
                {piece.type}
                {sizeText}
              </Text>
            </VStack>
            <Box
              style={{
                backgroundColor: "var(--blueBorder)",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "600", color: "white" }}>
                {piece.quantity}x
              </Text>
            </Box>
          </VStack>

          <Box style={{ marginLeft: 8 }}>
            {isExpanded ? (
              <ChevronUpIcon
                style={{ width: 16, height: 16, color: "var(--stoneText)" }}
              />
            ) : (
              <ChevronDownIcon
                style={{ width: 16, height: 16, color: "var(--stoneText)" }}
              />
            )}
          </Box>
        </HStack>
      </Pressable>

      {isExpanded && (
        <Box
          style={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            borderTopWidth: 1,
            borderTopColor: "var(--stoneBorder)",
          }}
        >
          <Text
            style={{ fontSize: 14, color: "var(--stoneText)", lineHeight: 20 }}
          >
            {piece.description}
          </Text>
        </Box>
      )}
    </Box>
  );
}

function getPieceEmoji(type: string): string {
  const typeMap: Record<string, string> = {
    mug: "☕",
    bowl: "🍲",
    plate: "🍽️",
    vase: "🏺",
    cup: "🥤",
    pitcher: "🫖",
    planter: "🪴",
    sculpture: "🎨",
  };

  return typeMap[type.toLowerCase()] || "🏺";
}
