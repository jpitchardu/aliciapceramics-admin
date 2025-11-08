import { Tables } from "@/api/dbTypes";
import { Box, Text } from "@/components";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { UpdateProgressModal } from "./UpdateProgressModal";

interface PieceAccordionProps {
  piece: Tables<"order_details">;
  onUpdateProgress?: (
    orderDetailId: string,
    status?: string,
    completedQuantity?: number
  ) => void;
}

export function PieceAccordion({
  piece,
  onUpdateProgress,
}: PieceAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleUpdateConfirm = (status?: string, completedQuantity?: number) => {
    setShowUpdateModal(false);
    if (onUpdateProgress) {
      onUpdateProgress(piece.id, status, completedQuantity);
    }
  };

  const formatStatus = (status: string | null) => {
    if (!status) return "Pending";
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      <UpdateProgressModal
        visible={showUpdateModal}
        piece={piece}
        onConfirm={handleUpdateConfirm}
        onCancel={() => setShowUpdateModal(false)}
      />
      <Box backgroundColor="primary100" borderRadius="m" overflow="hidden">
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Box flexDirection="row" alignItems="center" gap="s" padding="m">
            <Box flex={1}>
              <Box flexDirection="row" alignItems="center" gap="s">
                <Text variant="label">{piece.type}</Text>
                {piece.size && <Text variant="label">• {piece.size} oz.</Text>}
              </Box>
            </Box>
            <Box
              backgroundColor="interactive500"
              paddingHorizontal="s"
              paddingVertical="xs"
              borderRadius="s"
            >
              <Text variant="label" color="neutral50">
                {piece.quantity}
              </Text>
            </Box>
            <Text variant="body" color="primary900">
              {isExpanded ? "↑" : "↓"}
            </Text>
          </Box>
        </TouchableOpacity>
        {isExpanded && (
          <Box paddingHorizontal="m" paddingBottom="m" gap="m">
            <Text variant="body">{piece.description}</Text>

            <Box gap="xs">
              <Box flexDirection="row" alignItems="center" gap="s">
                <Text variant="label" fontSize={12}>
                  Status:
                </Text>
                <Box
                  backgroundColor="interactive400"
                  paddingHorizontal="s"
                  paddingVertical="xs"
                  borderRadius="s"
                >
                  <Text variant="body" fontSize={12}>
                    {formatStatus(piece.status)}
                  </Text>
                </Box>
              </Box>

              <Box flexDirection="row" alignItems="center" gap="s">
                <Text variant="label" fontSize={12}>
                  Progress:
                </Text>
                <Text variant="body" fontSize={12}>
                  {piece.completed_quantity || 0} / {piece.quantity} completed
                </Text>
              </Box>
            </Box>

            <TouchableOpacity onPress={() => setShowUpdateModal(true)}>
              <Box
                backgroundColor="interactive500"
                padding="m"
                borderRadius="m"
              >
                <Text variant="button" color="neutral50" textAlign="center">
                  UPDATE PROGRESS
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
        )}
      </Box>
    </>
  );
}
