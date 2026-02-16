import { registerDatePickerCallback } from "@/contexts/datePicker";
import { PieceDetail } from "@/constants/pieces";
import { useCreateStorefrontOrder } from "@/hooks/useCreateStorefrontOrder";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export function useCreateStorefrontOrderScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [pieces, setPieces] = useState<PieceDetail[]>([]);
  const createOrderMutation = useCreateStorefrontOrder();

  const handleAddPiece = useCallback((piece: PieceDetail) => {
    setPieces((prev) => [...prev, piece]);
  }, []);

  const handleRemovePiece = useCallback((index: number) => {
    setPieces((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const openDatePicker = useCallback(() => {
    registerDatePickerCallback((date) => setDueDate(date));
    router.push({
      pathname: "/date-picker",
      params: {
        current: dueDate?.toISOString(),
        clearable: "true",
      },
    });
  }, [dueDate, router]);

  const handleCreate = useCallback(() => {
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
            { text: "OK", onPress: () => router.back() },
          ]);
        },
        onError: (error) => {
          Alert.alert("Error", `Failed to create order: ${error.message}`);
        },
      },
    );
  }, [name, dueDate, pieces, createOrderMutation, router]);

  return {
    name,
    setName,
    dueDate,
    pieces,
    isPending: createOrderMutation.isPending,
    handleAddPiece,
    handleRemovePiece,
    openDatePicker,
    handleCreate,
  };
}
