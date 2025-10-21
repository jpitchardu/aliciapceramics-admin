import { Box, Text } from "@/components";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Modal, TouchableOpacity, Platform } from "react-native";

interface DatePickerModalProps {
  visible: boolean;
  currentDate: Date | null;
  onConfirm: (date: Date | null) => void;
  onCancel: () => void;
}

export function DatePickerModal({
  visible,
  currentDate,
  onConfirm,
  onCancel,
}: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState(
    currentDate || getTomorrowDate()
  );

  const handleConfirm = () => {
    onConfirm(selectedDate);
  };

  const handleClear = () => {
    onConfirm(null);
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
                Set Due Date
              </Text>

              <Box
                backgroundColor="primary100"
                borderRadius="m"
                padding="m"
                alignItems="center"
              >
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, date) => {
                    if (date) {
                      setSelectedDate(date);
                    }
                  }}
                  minimumDate={getTomorrowDate()}
                  themeVariant="light"
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
                      CONFIRM
                    </Text>
                  </Box>
                </TouchableOpacity>

                {currentDate && (
                  <TouchableOpacity onPress={handleClear}>
                    <Box
                      backgroundColor="input500"
                      padding="m"
                      borderRadius="m"
                    >
                      <Text
                        variant="button"
                        color="neutral50"
                        textAlign="center"
                      >
                        CLEAR DUE DATE
                      </Text>
                    </Box>
                  </TouchableOpacity>
                )}

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

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}
