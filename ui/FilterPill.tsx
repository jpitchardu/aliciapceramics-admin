import { Box, Text } from "@/components";
import { TouchableOpacity } from "react-native";

interface FilterPillProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function FilterPill({ label, active, onPress }: FilterPillProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        paddingHorizontal="m"
        paddingVertical="s"
        borderRadius="xl"
        backgroundColor={active ? "primary900" : "neutral50"}
        borderWidth={1}
        borderColor={active ? "primary900" : "neutral200"}
      >
        <Text
          variant="label"
          color={active ? "neutral50" : "primary700"}
          fontSize={12}
        >
          {label}
        </Text>
      </Box>
    </TouchableOpacity>
  );
}
