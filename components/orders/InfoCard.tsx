import { Box, Text } from "@/components";
import React from "react";

interface InfoCardProps {
  title: string;
  content: string;
  icon: string;
  isLink?: boolean;
  isSpecial?: boolean;
}

export function InfoCard({
  title,
  content,
  icon,
  isLink,
  isSpecial,
}: InfoCardProps) {
  const getTextColor = () => {
    if (isSpecial) return "alert600";
    if (isLink && !isSpecial) return "interactive500";
    return "primary900";
  };

  return (
    <Box
      backgroundColor="neutral50"
      borderRadius="m"
      padding="m"
      borderLeftWidth={isSpecial ? 4 : 0}
      borderLeftColor={isSpecial ? "alert600" : undefined}
      shadowOpacity={0.1}
      shadowRadius={2}
      shadowOffset={{ width: 0, height: 1 }}
    >
      <Box flexDirection="row" alignItems="flex-start" gap="s">
        <Text variant="body">{icon}</Text>
        <Box flex={1}>
          <Text variant="label" marginBottom="xs">
            {title}
          </Text>
          <Text
            variant="body"
            color={getTextColor()}
          >
            {content}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
