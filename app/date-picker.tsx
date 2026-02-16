import { Box, Text } from "@/components";
import { resolveDatePicker } from "@/contexts/datePicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Platform, TouchableOpacity } from "react-native";

export default function DatePickerScreen() {
  const router = useRouter();
  const { current, clearable } = useLocalSearchParams<{
    current?: string;
    clearable?: string;
  }>();

  const currentDate = current ? new Date(current) : null;
  const [selectedDate, setSelectedDate] = useState(
    currentDate || getTomorrowDate()
  );

  const handleConfirm = () => {
    resolveDatePicker(selectedDate);
    router.back();
  };

  const handleClear = () => {
    resolveDatePicker(null);
    router.back();
  };

  return (
    <Box flex={1} backgroundColor="primary50">
      <Box paddingHorizontal="m" paddingTop="m" paddingBottom="s">
        <Text variant="heading">Set Date</Text>
      </Box>

      <Box
        backgroundColor="primary100"
        borderRadius="m"
        padding="m"
        marginHorizontal="m"
        alignItems="center"
      >
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, date) => {
            if (date) setSelectedDate(date);
          }}
          minimumDate={getTomorrowDate()}
          themeVariant="light"
        />
      </Box>

      <Box paddingHorizontal="m" paddingBottom="xl" gap="s" paddingTop="m">
        <TouchableOpacity onPress={handleConfirm}>
          <Box backgroundColor="primary900" padding="m" borderRadius="l" alignItems="center">
            <Text variant="button">CONFIRM</Text>
          </Box>
        </TouchableOpacity>

        {clearable === "true" && currentDate && (
          <TouchableOpacity onPress={handleClear}>
            <Box backgroundColor="input500" padding="m" borderRadius="l" alignItems="center">
              <Text variant="button">CLEAR DATE</Text>
            </Box>
          </TouchableOpacity>
        )}

      </Box>
    </Box>
  );
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}
