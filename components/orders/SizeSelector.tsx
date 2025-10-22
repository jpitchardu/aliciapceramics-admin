import { TouchableOpacity } from "react-native";
import { Box, Text } from "@/components";
import { SizeOption, getSizeLabel } from "@/constants/pieces";

type SizeSelectorProps = {
  sizes: readonly SizeOption[];
  selected: SizeOption;
  onSelect: (size: SizeOption) => void;
};

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <Box flexDirection="row" gap="s">
      {sizes.map((size) => {
        const isSelected = size === selected;
        return (
          <TouchableOpacity
            key={size}
            onPress={() => onSelect(size)}
            style={{ flex: 1 }}
          >
            <Box
              backgroundColor={isSelected ? "primary900" : "neutral200"}
              padding="m"
              borderRadius="s"
              alignItems="center"
            >
              <Text
                variant="button"
                color={isSelected ? "neutral50" : "primary900"}
                fontSize={12}
              >
                {getSizeLabel(size)}
              </Text>
            </Box>
          </TouchableOpacity>
        );
      })}
    </Box>
  );
}
