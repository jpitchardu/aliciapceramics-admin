import { Box, Text } from "@/components";
import { theme } from "@/theme";

type BadgeColor = keyof (typeof theme)["colors"];

interface BadgeProps {
  label: string;
  backgroundColor?: BadgeColor;
  color?: BadgeColor;
}

export function Badge({
  label,
  backgroundColor = "interactive400",
  color = "primary900",
}: BadgeProps) {
  return (
    <Box
      backgroundColor={backgroundColor}
      paddingHorizontal="s"
      paddingVertical="xs"
      borderRadius="s"
      alignSelf="flex-start"
    >
      <Text variant="label" fontSize={10} color={color}>
        {label}
      </Text>
    </Box>
  );
}
