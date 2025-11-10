import { Box, Text } from "@/components";
import { PieceConfig } from "@/constants/pieces";
import { Image, TouchableOpacity } from "react-native";

type PieceTypeCardProps = {
  config: PieceConfig;
  isSelected: boolean;
  onSelect: () => void;
};

export function PieceTypeCard({
  config,
  isSelected,
  onSelect,
}: PieceTypeCardProps) {
  return (
    <TouchableOpacity onPress={onSelect}>
      <Box
        alignItems="center"
        padding="s"
        {...(isSelected && { backgroundColor: "primary100" })}
        borderRadius="m"
      >
        <Image
          source={{ uri: config.icon }}
          style={{ width: 90, height: 90 }}
          resizeMode="contain"
        />
        <Text
          variant="body"
          fontSize={12}
          textAlign="center"
          marginTop="xs"
          color="primary900"
        >
          {config.label}
        </Text>
      </Box>
    </TouchableOpacity>
  );
}
