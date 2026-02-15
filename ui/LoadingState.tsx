import { Box, Text } from "@/components";
import { theme } from "@/theme";
import { ActivityIndicator } from "react-native";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <Box flex={1} backgroundColor="primary50" justifyContent="center" alignItems="center">
      <ActivityIndicator size="large" color={theme.colors.primary900} />
      {message && (
        <Text variant="body" marginTop="m">
          {message}
        </Text>
      )}
    </Box>
  );
}
