import { useState } from "react";
import { TouchableOpacity, Image } from "react-native";
import { Box, Text, TextInput } from "@/components";
import {
  PieceConfig,
  PieceDetail,
  SizeOption,
} from "@/constants/pieces";
import { SizeSelector } from "./SizeSelector";

type PieceTypeCardProps = {
  config: PieceConfig;
  onAddToOrder: (piece: PieceDetail) => void;
};

export function PieceTypeCard({ config, onAddToOrder }: PieceTypeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [size, setSize] = useState<SizeOption | undefined>(
    config.sizes[0] || undefined,
  );
  const [description, setDescription] = useState("");

  const handleAddToOrder = () => {
    const pieceDetail: PieceDetail = {
      type: config.type,
      quantity: parseInt(quantity) || 1,
      description,
    };

    if (config.sizes.length > 0 && size) {
      pieceDetail.size = size;
    }

    onAddToOrder(pieceDetail);

    setQuantity("1");
    setDescription("");
    setSize(config.sizes[0] || undefined);
    setIsExpanded(false);
  };

  const isValid = quantity && parseInt(quantity) > 0 && description.trim();

  return (
    <Box
      backgroundColor="neutral50"
      borderRadius="m"
      borderWidth={1}
      borderColor="neutral200"
      overflow="hidden"
    >
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <Box
          flexDirection="row"
          alignItems="center"
          padding="m"
          gap="m"
        >
          <Image
            source={{ uri: config.icon }}
            style={{ width: 60, height: 60 }}
            resizeMode="contain"
          />
          <Box flex={1}>
            <Text variant="heading">{config.label}</Text>
          </Box>
          <Text variant="heading" fontSize={20}>
            {isExpanded ? "−" : "+"}
          </Text>
        </Box>
      </TouchableOpacity>

      {isExpanded && (
        <Box padding="m" gap="m">
          {config.sizes.length > 0 && (
            <Box gap="xs">
              <Text variant="label">Size</Text>
              <SizeSelector
                sizes={config.sizes}
                selected={size!}
                onSelect={setSize}
              />
            </Box>
          )}

          <Box gap="xs">
            <Text variant="label">Quantity</Text>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="number-pad"
              placeholder="1"
            />
          </Box>

          <Box gap="xs">
            <Text variant="label">Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the piece..."
              multiline
              numberOfLines={3}
              style={{ minHeight: 80, textAlignVertical: "top" }}
            />
          </Box>

          <TouchableOpacity onPress={handleAddToOrder} disabled={!isValid}>
            <Box
              backgroundColor={isValid ? "primary900" : "neutral600"}
              padding="m"
              borderRadius="m"
              opacity={isValid ? 1 : 0.5}
            >
              <Text variant="button" color="neutral50" textAlign="center">
                ADD TO ORDER
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
      )}
    </Box>
  );
}
