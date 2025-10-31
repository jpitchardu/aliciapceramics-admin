import { Box, Text, TextInput } from "@/components";
import { Tables } from "@/api/dbTypes";
import { useState } from "react";
import { Modal, TouchableOpacity, ScrollView, Alert } from "react-native";

interface UpdateProgressModalProps {
  visible: boolean;
  piece: Tables<"order_details">;
  onConfirm: (status?: string, completedQuantity?: number) => void;
  onCancel: () => void;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "build", label: "Build" },
  { value: "trim", label: "Trim" },
  { value: "attach", label: "Attach" },
  { value: "trim_final", label: "Trim Final" },
  { value: "bisque", label: "Bisque" },
  { value: "glaze", label: "Glaze" },
  { value: "fire", label: "Fire" },
  { value: "completed", label: "Completed" },
];

export function UpdateProgressModal({
  visible,
  piece,
  onConfirm,
  onCancel,
}: UpdateProgressModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(piece.status || "pending");
  const [completedQty, setCompletedQty] = useState(
    piece.completed_quantity?.toString() || "0"
  );

  const handleConfirm = () => {
    const qty = parseInt(completedQty, 10);

    if (isNaN(qty) || qty < 0) {
      Alert.alert("Invalid Quantity", "Please enter a valid number for completed quantity.");
      return;
    }

    if (qty > piece.quantity) {
      Alert.alert(
        "Invalid Quantity",
        `Completed quantity (${qty}) cannot exceed total quantity (${piece.quantity}).`
      );
      return;
    }

    const statusChanged = selectedStatus !== piece.status;
    const qtyChanged = qty !== (piece.completed_quantity || 0);

    if (!statusChanged && !qtyChanged) {
      onCancel();
      return;
    }

    onConfirm(
      statusChanged ? selectedStatus : undefined,
      qtyChanged ? qty : undefined
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        activeOpacity={1}
        onPress={onCancel}
      >
        <Box flex={1} justifyContent="center" alignItems="center" padding="m">
          <TouchableOpacity
            activeOpacity={1}
            style={{ width: "100%", maxWidth: 400 }}
          >
            <Box
              backgroundColor="primary50"
              borderRadius="xl"
              padding="m"
              gap="m"
            >
              <Text variant="heading" textAlign="center">
                Update Progress
              </Text>

              <Box gap="s">
                <Text variant="label">Piece</Text>
                <Box
                  backgroundColor="primary100"
                  padding="m"
                  borderRadius="m"
                >
                  <Text variant="body">{piece.type}</Text>
                  <Text variant="body" color="neutral600">
                    Total: {piece.quantity} pieces
                  </Text>
                </Box>
              </Box>

              <Box gap="s">
                <Text variant="label">Status</Text>
                <ScrollView
                  style={{ maxHeight: 200 }}
                  nestedScrollEnabled
                >
                  <Box gap="xs">
                    {STATUS_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => setSelectedStatus(option.value)}
                      >
                        <Box
                          backgroundColor={
                            selectedStatus === option.value
                              ? "interactive500"
                              : "primary100"
                          }
                          padding="m"
                          borderRadius="m"
                          borderWidth={1}
                          borderColor={
                            selectedStatus === option.value
                              ? "interactive500"
                              : "neutral200"
                          }
                        >
                          <Text
                            variant="body"
                            color={
                              selectedStatus === option.value
                                ? "neutral50"
                                : "primary900"
                            }
                          >
                            {option.label}
                          </Text>
                        </Box>
                      </TouchableOpacity>
                    ))}
                  </Box>
                </ScrollView>
              </Box>

              <Box gap="s">
                <Text variant="label">Completed Quantity</Text>
                <TextInput
                  value={completedQty}
                  onChangeText={setCompletedQty}
                  keyboardType="number-pad"
                  placeholder="0"
                />
              </Box>

              <Box gap="s">
                <TouchableOpacity onPress={handleConfirm}>
                  <Box
                    backgroundColor="interactive500"
                    padding="m"
                    borderRadius="m"
                  >
                    <Text
                      variant="button"
                      color="neutral50"
                      textAlign="center"
                    >
                      SAVE
                    </Text>
                  </Box>
                </TouchableOpacity>

                <TouchableOpacity onPress={onCancel}>
                  <Box
                    backgroundColor="neutral200"
                    padding="m"
                    borderRadius="m"
                  >
                    <Text
                      variant="button"
                      color="neutral600"
                      textAlign="center"
                    >
                      CANCEL
                    </Text>
                  </Box>
                </TouchableOpacity>
              </Box>
            </Box>
          </TouchableOpacity>
        </Box>
      </TouchableOpacity>
    </Modal>
  );
}
