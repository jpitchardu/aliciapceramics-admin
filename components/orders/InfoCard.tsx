import { Box, HStack, Text, VStack } from "@/components/ui";
import clsx from "clsx";
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
  return (
    <Box
      className={clsx(
        "bg-neutral-50 rounded-md p-4 shadow-md",
        isSpecial && "border-l-4 border-l-alert-600"
      )}
    >
      <HStack className="items-start gap-3">
        <Text className="text-lg">{icon}</Text>
        <VStack className="flex-1">
          <Text className="text-sm font-labelSemibold text-primary-900 mb-1">
            {title}
          </Text>
          <Text
            className={clsx(
              "text-sm leading-5",
              isSpecial && "text-alert-600",
              isLink && !isSpecial && "text-interactive-500",
              !isLink && !isSpecial && "text-primary-900"
            )}
          >
            {content}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}
