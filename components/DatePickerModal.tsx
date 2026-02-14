import { Box, Text } from "@/components";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, Platform } from "react-native";

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
      animationType="slide"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onCancel}
      >
        <TouchableOpacity activeOpacity={1}>
          <Box
            backgroundColor="primary50"
            borderTopLeftRadius="xl"
            borderTopRightRadius="xl"
            padding="m"
            paddingBottom="xl"
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
                  backgroundColor="primary900"
                  padding="m"
                  borderRadius="l"
                  alignItems="center"
                >
                  <Text variant="button">
                    CONFIRM
                  </Text>
                </Box>
              </TouchableOpacity>

              {currentDate && (
                <TouchableOpacity onPress={handleClear}>
                  <Box
                    backgroundColor="input500"
                    padding="m"
                    borderRadius="l"
                    alignItems="center"
                  >
                    <Text variant="button">
                      CLEAR DUE DATE
                    </Text>
                  </Box>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={onCancel}>
                <Box
                  backgroundColor="neutral200"
                  padding="m"
                  borderRadius="l"
                  alignItems="center"
                >
                  <Text variant="button" color="neutral600">
                    CANCEL
                  </Text>
                </Box>
              </TouchableOpacity>
            </Box>
          </Box>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
});

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}
