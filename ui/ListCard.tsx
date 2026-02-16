import { Box, Text } from "@/components";
import { Badge } from "@/ui/Badge";
import { theme } from "@/theme";
import { TouchableOpacity } from "react-native";

type BadgeColor = keyof (typeof theme)["colors"];

interface ListCardProps {
  title: string;
  badge?: string;
  badgeBg?: BadgeColor;
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
          {badge && <Badge label={badge} backgroundColor={badgeBg} />}
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
