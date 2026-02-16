import { registerDatePickerCallback } from "@/contexts/datePicker";
import { useCreateBulkCode } from "@/hooks/useBulkCodes";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export function useCreateBulkCodeScreen() {
  const router = useRouter();
  const createBulkCodeMutation = useCreateBulkCode();
  const [name, setName] = useState("");
  const [earliestDate, setEarliestDate] = useState<Date | null>(null);

  const openDatePicker = useCallback(() => {
    registerDatePickerCallback((date) => {
      if (date !== undefined) setEarliestDate(date);
    });
    router.push({
      pathname: "/date-picker",
      params: {
        current: earliestDate?.toISOString(),
        clearable: "true",
      },
    });
  }, [earliestDate, router]);

  const handleCreate = useCallback(() => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a name for the bulk code");
      return;
    }
    if (!earliestDate) {
      Alert.alert("Error", "Please select an earliest completion date");
      return;
    }

    createBulkCodeMutation.mutate(
      { name: name.trim(), earliestCompletionDate: earliestDate },
      {
        onSuccess: (data) => {
          Alert.alert("Success", `Bulk code created: ${data.code}`);
          router.back();
        },
        onError: (error) => {
          Alert.alert("Error", `Failed to create bulk code: ${error.message}`);
        },
      },
    );
  }, [name, earliestDate, createBulkCodeMutation, router]);

  return {
    name,
    setName,
    earliestDate,
    isPending: createBulkCodeMutation.isPending,
    openDatePicker,
    handleCreate,
  };
}
