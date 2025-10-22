import { useState } from "react";
import { ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Box, Text, TextInput } from "@/components";
import { PieceTypeCard } from "@/components/orders/PieceTypeCard";
import { DatePickerModal } from "@/components/DatePickerModal";
import { PIECE_CONFIGS, PieceDetail } from "@/constants/pieces";
import { useCreateStorefrontOrder } from "@/hooks/useCreateStorefrontOrder";

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
      },
    );
  };

  const isValid = name.trim() && pieces.length > 0;

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

      <ScrollView style={{ flex: 1 }}>
        <Box padding="m" gap="l">
          <Box gap="s">
            <Text variant="heading">Create Storefront Order</Text>
            <Text variant="body" color="neutral600">
              For markets and inventory pieces
            </Text>
          </Box>

          <Box gap="xs">
            <Text variant="label">Order Name *</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g., 333 Market, Flower Shop"
            />
          </Box>

          <Box gap="xs">
            <Text variant="label">Target Completion Date (Optional)</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Box
                backgroundColor="interactive400"
                padding="m"
                borderRadius="m"
              >
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

          {pieces.length > 0 && (
            <Box gap="s">
              <Text variant="label">
                Pieces Added ({pieces.length})
              </Text>
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
            {Object.values(PIECE_CONFIGS).map((config) => (
              <PieceTypeCard
                key={config.type}
                config={config}
                onAddToOrder={handleAddPiece}
              />
            ))}
          </Box>

          <TouchableOpacity
            onPress={handleCreate}
            disabled={!isValid || createOrderMutation.isPending}
          >
            <Box
              backgroundColor={isValid && !createOrderMutation.isPending ? "primary900" : "neutral600"}
              padding="m"
              borderRadius="m"
              opacity={isValid && !createOrderMutation.isPending ? 1 : 0.5}
            >
              <Text variant="button" color="neutral50" textAlign="center">
                {createOrderMutation.isPending
                  ? "CREATING..."
                  : "CREATE STOREFRONT ORDER"}
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
      </ScrollView>
    </Box>
  );
}
