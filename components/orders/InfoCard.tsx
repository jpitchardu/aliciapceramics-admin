import {
  Box,
  HStack,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import React from "react";

interface InfoCardProps {
  title: string;
  content: string;
  icon: string;
  isLink?: boolean;
  isSpecial?: boolean;
}

export function InfoCard({ title, content, icon, isLink, isSpecial }: InfoCardProps) {
  return (
    <Box
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        ...(isSpecial && {
          borderLeftWidth: 4,
          borderLeftColor: "var(--redFocus)",
        }),
      }}
    >
      <HStack style={{ alignItems: "flex-start", gap: 12 }}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
        <VStack style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "var(--earthDark)",
              marginBottom: 4,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: isLink ? "var(--blueBorder)" : "var(--stoneText)",
              lineHeight: 20,
              ...(isSpecial && { color: "var(--redFocus)" }),
            }}
          >
            {content}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}