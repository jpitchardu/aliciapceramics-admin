import { Box, Text } from "@/components";
import { BulkCommissionCode } from "@/hooks/useBulkCodes";
import { TouchableOpacity } from "react-native";

interface BulkCodeCardProps {
  bulkCode: BulkCommissionCode;
  onPress?: (codeId: string) => void;
}

export function BulkCodeCard({ bulkCode, onPress }: BulkCodeCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isRedeemed = !!bulkCode.redeemed_at;

  return (
    <TouchableOpacity
      onPress={() => onPress?.(bulkCode.id)}
      disabled={!onPress}
    >
      <Box
        backgroundColor={isRedeemed ? "neutral200" : "primary100"}
        borderRadius="xl"
        padding="m"
        borderLeftWidth={4}
        borderLeftColor={isRedeemed ? "neutral600" : "interactive500"}
        borderWidth={2}
        borderColor="primary50"
        gap="s"
      >
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box flex={1} gap="xs">
            <Text variant="heading">{bulkCode.name}</Text>
            <Box
              backgroundColor={isRedeemed ? "neutral600" : "interactive500"}
              paddingHorizontal="m"
              paddingVertical="xs"
              borderRadius="m"
              alignSelf="flex-start"
            >
              <Text variant="button" color="neutral50" fontSize={16}>
                {bulkCode.code}
              </Text>
            </Box>
            <Text variant="body" color="neutral600" fontSize={12}>
              Earliest: {formatDate(bulkCode.earliest_completion_date)}
            </Text>
            {isRedeemed && (
              <Text variant="body" color="alert600" fontSize={12}>
                Redeemed: {formatDate(bulkCode.redeemed_at)}
              </Text>
            )}
          </Box>
          {isRedeemed && (
            <Box
              backgroundColor="alert600"
              paddingHorizontal="s"
              paddingVertical="xs"
              borderRadius="s"
            >
              <Text variant="label" color="neutral50" fontSize={10}>
                REDEEMED
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </TouchableOpacity>
  );
}
