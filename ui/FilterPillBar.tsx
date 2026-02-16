import { Box } from "@/components";
import { ReactNode } from "react";
import { ScrollView } from "react-native";

interface FilterPillBarProps {
  children: ReactNode;
}

export function FilterPillBar({ children }: FilterPillBarProps) {
  return (
    <Box paddingHorizontal="xs" paddingTop="m" paddingBottom="m">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Box flexDirection="row" gap="s">
          {children}
        </Box>
      </ScrollView>
    </Box>
  );
}
