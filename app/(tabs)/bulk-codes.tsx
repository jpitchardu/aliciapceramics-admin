import { Box, Text, TextInput } from "@/components";
import { BulkCodeCard } from "@/components/BulkCodeCard";
import { useBulkCodes, useCreateBulkCode } from "@/hooks/useBulkCodes";
import { DatePickerModal } from "@/components/DatePickerModal";
import { theme } from "@/theme";
import { useState } from "react";
import {
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BulkCodesScreen() {
  const bulkCodesResponse = useBulkCodes();
  const createBulkCodeMutation = useCreateBulkCode();

  const [name, setName] = useState("");
  const [earliestDate, setEarliestDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleCreateCode = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a name for the bulk code");
      return;
    }
    if (!earliestDate) {
      Alert.alert("Error", "Please select an earliest completion date");
      return;
    }

    createBulkCodeMutation.mutate(
      {
        name: name.trim(),
        earliestCompletionDate: earliestDate,
      },
      {
        onSuccess: (data) => {
          Alert.alert("Success", `Bulk code created: ${data.code}`);
          setName("");
          setEarliestDate(undefined);
        },
        onError: (error) => {
          Alert.alert("Error", `Failed to create bulk code: ${error.message}`);
        },
      }
    );
  };

  if (bulkCodesResponse.isLoading) {
    return (
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ flex: 1, backgroundColor: theme.colors.primary50 }}
      >
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={theme.colors.primary900} />
        </Box>
      </SafeAreaView>
    );
  }

  if (bulkCodesResponse.isError) {
    return (
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ flex: 1, backgroundColor: theme.colors.primary50 }}
      >
        <Box flex={1} justifyContent="center" alignItems="center" padding="xl">
          <Text variant="heading" color="alert600" textAlign="center">
            ERROR LOADING BULK CODES
          </Text>
          <Text variant="body" color="neutral600" textAlign="center" marginTop="m">
            {bulkCodesResponse.error?.message || "Unknown error"}
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  const bulkCodes = bulkCodesResponse.data || [];

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: theme.colors.primary50 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Box flex={1}>
          <Box padding="m" gap="m" backgroundColor="primary100">
            <Text variant="brand" fontSize={32} color="primary900">
              bulk codes
            </Text>

            <Box gap="s">
              <TextInput
                placeholder="Code name..."
                value={name}
                onChangeText={setName}
              />

              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Box
                  backgroundColor="input300"
                  padding="m"
                  borderRadius="m"
                  borderWidth={2}
                  borderColor="primary50"
                >
                  <Text variant="body" color="primary900">
                    {earliestDate
                      ? `Earliest: ${earliestDate.toLocaleDateString()}`
                      : "Select earliest completion date..."}
                  </Text>
                </Box>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCreateCode}
                disabled={createBulkCodeMutation.isPending}
              >
                <Box
                  backgroundColor="interactive500"
                  padding="m"
                  borderRadius="m"
                  opacity={createBulkCodeMutation.isPending ? 0.6 : 1}
                >
                  <Text variant="button" color="neutral50" textAlign="center">
                    {createBulkCodeMutation.isPending
                      ? "CREATING..."
                      : "CREATE CODE"}
                  </Text>
                </Box>
              </TouchableOpacity>
            </Box>
          </Box>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              padding: theme.spacing.m,
              gap: theme.spacing.m,
            }}
          >
            {bulkCodes.length === 0 ? (
              <Box padding="xl" alignItems="center">
                <Text variant="body" color="neutral600" textAlign="center">
                  No bulk codes yet. Create one above.
                </Text>
              </Box>
            ) : (
              bulkCodes.map((code) => (
                <BulkCodeCard key={code.id} bulkCode={code} />
              ))
            )}
          </ScrollView>
        </Box>

        <DatePickerModal
          visible={showDatePicker}
          value={earliestDate}
          onClose={() => setShowDatePicker(false)}
          onChange={(date) => {
            setEarliestDate(date || undefined);
            setShowDatePicker(false);
          }}
          minimumDate={new Date()}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
