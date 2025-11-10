import { Box, Text, TextInput } from "@/components";
import { DatePickerModal } from "@/components/DatePickerModal";
import { PieceTypeRow } from "@/components/orders/PieceTypeRow";
import { PIECE_CONFIGS, PieceDetail } from "@/constants/pieces";
import { useCreateStorefrontOrder } from "@/hooks/useCreateStorefrontOrder";
import { theme } from "@/theme";
import { CloseButton } from "@/ui/CloseButton";
import { IconButton } from "@/ui/IconButton";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, TouchableOpacity } from "react-native";

export default function CreateStorefrontOrderScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pieces, setPieces] = useState<PieceDetail[]>([]);

  const createOrderMutation = useCreateStorefrontOrder();

  const handleAddPiece = (piece: PieceDetail) => {
    setPieces([...pieces, piece]);
  };

  const handleRemovePiece = (index: number) => {
    setPieces(pieces.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter an order name");
      return;
    }
    if (pieces.length === 0) {
      Alert.alert("Error", "Please add at least one piece");
      return;
    }

    createOrderMutation.mutate(
      {
        name: name.trim(),
        dueDate: dueDate || undefined,
        pieceDetails: pieces,
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Storefront order created!", [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]);
        },
        onError: (error) => {
          Alert.alert("Error", `Failed to create order: ${error.message}`);
        },
      }
    );
  };

  return (
    <Box flex={1} backgroundColor="primary50">
      <DatePickerModal
        visible={showDatePicker}
        currentDate={dueDate}
        onConfirm={(date) => {
          setDueDate(date);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      <ScrollView
        style={{ flex: 1, padding: theme.spacing.m, gap: theme.spacing.l }}
      >
        <Box flexDirection="row" paddingVertical="m">
          <CloseButton onPress={router.back} />
          <Box flex={1} />
          <IconButton
            variant="primary"
            symbol="checkmark"
            onPress={handleCreate}
          />
        </Box>
        <Text variant="heading">New Order</Text>
        <Box>
          <Box gap="xs" paddingVertical="xs">
            <Text variant="label">Order Name *</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g., 333 Market, Flower Shop"
            />
          </Box>

          <Box gap="xs" paddingVertical="xs">
            <Text variant="label">Target Completion Date (Optional)</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Box backgroundColor="input400" padding="m" borderRadius="m">
                <Text variant="body" textAlign="center">
                  {dueDate
                    ? dueDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "No deadline set"}
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
        </Box>

        {pieces.length > 0 && (
          <Box gap="s">
            <Text variant="label">Pieces Added ({pieces.length})</Text>
            {pieces.map((piece, index) => (
              <Box
                key={index}
                backgroundColor="interactive400"
                padding="m"
                borderRadius="m"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box flex={1}>
                  <Text variant="body">
                    {PIECE_CONFIGS[piece.type].label} × {piece.quantity}
                  </Text>
                  {piece.size && (
                    <Text variant="body" fontSize={12} color="neutral600">
                      {piece.size} oz
                    </Text>
                  )}
                  <Text variant="body" fontSize={12} color="neutral600">
                    {piece.description}
                  </Text>
                </Box>
                <TouchableOpacity onPress={() => handleRemovePiece(index)}>
                  <Box
                    backgroundColor="input500"
                    paddingHorizontal="m"
                    paddingVertical="s"
                    borderRadius="s"
                  >
                    <Text variant="button" color="neutral50" fontSize={10}>
                      REMOVE
                    </Text>
                  </Box>
                </TouchableOpacity>
              </Box>
            ))}
          </Box>
        )}

        <Box gap="s">
          <Text variant="label">Add Pieces *</Text>
          <Box gap="s">
            {Object.values(PIECE_CONFIGS)
              .reduce<(typeof PIECE_CONFIGS)[keyof typeof PIECE_CONFIGS][][]>(
                (rows, config, index) => {
                  const rowIndex = Math.floor(index / 3);
                  if (!rows[rowIndex]) {
                    rows[rowIndex] = [];
                  }
                  rows[rowIndex].push(config);
                  return rows;
                },
                []
              )
              .map((rowConfigs, index) => (
                <PieceTypeRow
                  key={index}
                  configs={rowConfigs}
                  onAddToOrder={handleAddPiece}
                />
              ))}
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
}
