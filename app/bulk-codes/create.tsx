import { Box, Text, TextInput } from "@/components";
import { useCreateBulkCodeScreen } from "./useCreateBulkCodeScreen";
import { TouchableOpacity } from "react-native";

export default function CreateBulkCodeScreen() {
  const {
    name,
    setName,
    earliestDate,
    isPending,
    openDatePicker,
    handleCreate,
  } = useCreateBulkCodeScreen();

  return (
    <Box flex={1} backgroundColor="primary50">
      <Box paddingHorizontal="m" paddingTop="l" paddingBottom="m">
        <Text variant="heading">New Bulk Code</Text>
      </Box>

      <Box paddingHorizontal="m" gap="s" flex={1}>
        <Box gap="xs">
          <Text variant="label">Code Name *</Text>
          <TextInput
            placeholder="e.g., Spring 2026, Wedding Party"
            value={name}
            onChangeText={setName}
            autoFocus
            multiline={false}
            returnKeyType="done"
            submitBehavior="blurAndSubmit"
          />
        </Box>

        <Box gap="xs">
          <Text variant="label">Earliest Completion Date *</Text>
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
                color={earliestDate ? "primary900" : "neutral700"}
              >
                {earliestDate
                  ? earliestDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "No date set"}
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
      </Box>

      <Box paddingHorizontal="m" paddingVertical="xl" gap="m">
        <TouchableOpacity onPress={handleCreate} disabled={isPending}>
          <Box
            backgroundColor="primary900"
            padding="m"
            borderRadius="l"
            alignItems="center"
            opacity={isPending ? 0.6 : 1}
          >
            <Text variant="button">
              {isPending ? "CREATING..." : "CREATE CODE"}
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>
    </Box>
  );
}
