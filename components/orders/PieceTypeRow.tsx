import { Box, Text, TextInput } from "@/components";
import { PieceConfig, PieceDetail, SizeOption } from "@/constants/pieces";
import { theme } from "@/theme";
import { CloseButton } from "@/ui/CloseButton";
import { IconButton } from "@/ui/IconButton";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { PieceTypeCard } from "./PieceTypeCard";

type PieceTypeRowProps = {
  configs: PieceConfig[];
  onAddToOrder: (piece: PieceDetail) => void;
};

export function PieceTypeRow({ configs, onAddToOrder }: PieceTypeRowProps) {
  const [selectedConfig, setSelectedConfig] = useState<PieceConfig | null>(
    null
  );
  const [quantity, setQuantity] = useState("1");
  const [size, setSize] = useState<SizeOption | undefined>(undefined);

  const handleSelectCard = (config: PieceConfig) => {
    if (selectedConfig?.type === config.type) {
      setSelectedConfig(null);
    } else {
      setSelectedConfig(config);
      setSize(config.sizes[0] || undefined);
      setQuantity("1");
    }
  };

  const handleAddToOrder = () => {
    if (!selectedConfig || !isValid) return;

    const pieceDetail: PieceDetail = {
      type: selectedConfig.type,
      quantity: parseInt(quantity) || 1,
      description: `${selectedConfig.label}${size ? ` - ${size}oz` : ""}`,
    };

    if (selectedConfig.sizes.length > 0 && size) {
      pieceDetail.size = size;
    }

    onAddToOrder(pieceDetail);

    setQuantity("1");
    setSize(undefined);
    setSelectedConfig(null);
  };

  const handleClearConfig = () => {
    setSelectedConfig(null);
    setSize(null);
    setQuantity(null);
  };

  const isValid = quantity && parseInt(quantity) > 0;

  return (
    <Box position="relative" zIndex={selectedConfig ? 10 : 1}>
      {/* Row of cards */}
      <Box flexDirection="row" gap="s">
        {configs.map((config) => (
          <Box key={config.type} style={{ flexBasis: "31%", maxWidth: "31%" }}>
            <PieceTypeCard
              config={config}
              isSelected={selectedConfig?.type === config.type}
              onSelect={() => handleSelectCard(config)}
            />
          </Box>
        ))}
      </Box>

      {/* Expandable form - absolutely positioned */}
      {selectedConfig && (
        <View style={styles.contextMenu}>
          <BlurView intensity={15} style={styles.blurView} tint="light" />
          <View style={styles.contextMenuContent}>
            <CloseButton onPress={() => setSelectedConfig(null)} />
            {selectedConfig.sizes.length > 0 && (
              <Box>
                <Text variant="label" fontSize={12} color="primary900">
                  Size
                </Text>
                <Box flexDirection="row" gap="xs" flex={1}>
                  {selectedConfig.sizes.map((sizeOption) => (
                    <TouchableOpacity
                      key={sizeOption}
                      onPress={() => setSize(sizeOption)}
                    >
                      <Box
                        backgroundColor={
                          size === sizeOption ? "primary500" : "input400"
                        }
                        padding="xs"
                        borderRadius="s"
                        alignItems="center"
                      >
                        <Text
                          variant="body"
                          fontSize={12}
                          color={
                            size === sizeOption ? "primary50" : "primary900"
                          }
                        >
                          {sizeOption}
                        </Text>
                      </Box>
                    </TouchableOpacity>
                  ))}
                </Box>
              </Box>
            )}

            <Box style={{ width: 60 }}>
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="number-pad"
                placeholder="1"
                style={{ fontSize: 14, minHeight: 40, textAlign: "center" }}
              />
            </Box>

            <Box opacity={isValid ? 1 : 0.4}>
              <IconButton
                variant="primary"
                symbol="checkmark"
                onPress={handleAddToOrder}
              />
            </Box>
          </View>
        </View>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  contextMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: theme.spacing.xs,
    borderRadius: theme.borderRadii.m,
    overflow: "hidden",
  },
  blurView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: theme.borderRadii.m,
  },
  contextMenuContent: {
    backgroundColor: `${theme.colors.primary100}95`,
    borderRadius: theme.borderRadii.m,
    padding: theme.spacing.m,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
