import { Box, Text } from "@/components";

interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message = "Something went wrong" }: ErrorStateProps) {
  return (
    <Box flex={1} backgroundColor="primary50" justifyContent="center" alignItems="center" padding="l">
      <Text variant="heading" color="alert600" textAlign="center">
        {message}
      </Text>
    </Box>
  );
}
