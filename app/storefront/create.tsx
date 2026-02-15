import { Box, Text, TextInput } from "@/components";
import { DragHandle } from "@/ui/DragHandle";
import { PieceTypeRow } from "@/components/orders/PieceTypeRow";
import { PIECE_CONFIGS } from "@/constants/pieces";
import { useCreateStorefrontOrderScreen } from "./useCreateStorefrontOrderScreen";
import { theme } from "@/theme";
import { ScrollView, TouchableOpacity } from "react-native";

export default function CreateStorefrontOrderScreen() {
  const {
    name,
    setName,
    dueDate,
    pieces,
    isPending,
    handleAddPiece,
    handleRemovePiece,
    openDatePicker,
    handleCreate,
  } = useCreateStorefrontOrderScreen();

  return (
    <Box flex={1} backgroundColor="primary50">
      <DragHandle />

      <ScrollView
        style={{ flex: 1, padding: theme.spacing.m, gap: theme.spacing.l }}
        contentContainerStyle={{ paddingBottom: theme.spacing.m }}
      >
        <Text variant="heading" marginBottom="m">
          New Order
        </Text>
        <Box>
          <Box gap="xs" paddingVertical="xs">
            <Text variant="label">Order Name *</Text>
            <TextInput
              autoFocus
              value={name}
              onChangeText={setName}
              multiline={false}
              returnKeyType="done"
              submitBehavior="blurAndSubmit"
              placeholder="e.g., 333 Market, Flower Shop"
            />
          </Box>

          <Box gap="xs" paddingVertical="xs">
            <Text variant="label">Target Completion Date (Optional)</Text>
            <TouchableOpacity onPress={openDatePicker}>
              <Box
                backgroundColor="input400"
                padding="m"
                borderRadius="l"
                borderWidth={2}
                borderColor="primary50"
              >
                <Text
                  variant="body"
                  color={dueDate ? "primary900" : "neutral700"}
                >
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
                [],
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

      <Box paddingHorizontal="m" paddingBottom="xl" gap="s">
        <TouchableOpacity onPress={handleCreate} disabled={isPending}>
          <Box
            backgroundColor="primary900"
            padding="m"
            borderRadius="l"
            alignItems="center"
            opacity={isPending ? 0.6 : 1}
          >
            <Text variant="button">
              {isPending ? "SAVING..." : "SAVE ORDER"}
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>
    </Box>
  );
}
