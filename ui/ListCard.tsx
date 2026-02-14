import { Box, Text } from "@/components";
import { TouchableOpacity } from "react-native";

interface ListCardProps {
  title: string;
  badge?: string;
  badgeBg?: "interactive300" | "input300";
  subtitle?: string;
  meta?: string;
  onPress?: () => void;
}

export function ListCard({ title, badge, badgeBg = "interactive300", subtitle, meta, onPress }: ListCardProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Box
        backgroundColor="neutral50"
        padding="m"
        borderRadius="m"
        borderWidth={1}
        borderColor="neutral200"
      >
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="xs"
        >
          <Text variant="heading">{title}</Text>
          {badge && (
            <Box
              paddingHorizontal="s"
              paddingVertical="xs"
              borderRadius="s"
              backgroundColor={badgeBg}
            >
              <Text variant="label" fontSize={10} color="primary700">
                {badge}
              </Text>
            </Box>
          )}
        </Box>
        {subtitle && (
          <Text variant="body" color="primary900" fontSize={14}>
            {subtitle}
          </Text>
        )}
        {meta && (
          <Text variant="body" color="primary900" fontSize={14} marginTop="xs">
            {meta}
          </Text>
        )}
      </Box>
    </TouchableOpacity>
  );
}
