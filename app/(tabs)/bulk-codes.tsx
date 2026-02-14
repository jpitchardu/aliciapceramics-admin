import { Box, Text, TextInput } from "@/components";
import { BulkCodeCard } from "@/components/BulkCodeCard";
import { BulkCodeDetailSheet } from "@/components/BulkCodeDetailSheet";
import { DatePickerModal } from "@/components/DatePickerModal";
import { useScroll } from "@/contexts/ScrollContext";
import { useBulkCodes, useCreateBulkCode, BulkCommissionCode } from "@/hooks/useBulkCodes";
import { BottomSheet } from "@/ui/BottomSheet";
import { ScreenContainer } from "@/ui/ScreenContainer";
import { theme } from "@/theme";
import { BlurView } from "expo-blur";
import { useNavigation } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type FilterType = "active" | "redeemed";

export default function BulkCodesScreen() {
  const navigation = useNavigation();
  const bulkCodesResponse = useBulkCodes();
  const createBulkCodeMutation = useCreateBulkCode();
  const { setScrollY } = useScroll();

  const [activeFilter, setActiveFilter] = useState<FilterType>("active");
  const [showSheet, setShowSheet] = useState(false);
  const [selectedCode, setSelectedCode] = useState<BulkCommissionCode | null>(null);
  const [name, setName] = useState("");
  const [earliestDate, setEarliestDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const ActionButton = useMemo(
    () =>
      function ActionButton() {
        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="New bulk code"
            onPress={() => setShowSheet(true)}
            style={styles.tab}
          >
            <BlurView
              intensity={15}
              style={styles.blurContainer}
              tint="prominent"
            />
            <SymbolView
              name="plus"
              size={24}
              type="hierarchical"
              tintColor={theme.colors.primary900}
              style={styles.icon}
            />
          </TouchableOpacity>
        );
      },
    []
  );

  useEffect(() => {
    navigation.setOptions({
      tabBarActionButton: ActionButton,
    });
  }, [navigation, ActionButton]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setScrollY(event.nativeEvent.contentOffset.y);
    },
    [setScrollY]
  );

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
          setEarliestDate(null);
          setShowSheet(false);
        },
        onError: (error) => {
          Alert.alert("Error", `Failed to create bulk code: ${error.message}`);
        },
      }
    );
  };

  const filteredCodes = useMemo(() => {
    if (!bulkCodesResponse.data) return [];
    return bulkCodesResponse.data.filter((code) =>
      activeFilter === "active" ? !code.redeemed_at : !!code.redeemed_at
    );
  }, [bulkCodesResponse.data, activeFilter]);

  const FilterPill = ({
    filter,
    label,
  }: {
    filter: FilterType;
    label: string;
  }) => (
    <TouchableOpacity onPress={() => setActiveFilter(filter)}>
      <Box
        paddingHorizontal="m"
        paddingVertical="s"
        borderRadius="xl"
        backgroundColor={activeFilter === filter ? "primary900" : "neutral50"}
        borderWidth={1}
        borderColor={activeFilter === filter ? "primary900" : "neutral200"}
      >
        <Text
          variant="label"
          color={activeFilter === filter ? "neutral50" : "primary700"}
          fontSize={12}
        >
          {label}
        </Text>
      </Box>
    </TouchableOpacity>
  );

  if (bulkCodesResponse.isError) {
    return (
      <Box
        flex={1}
        backgroundColor="primary50"
        justifyContent="center"
        alignItems="center"
        padding="l"
      >
        <Text variant="heading" color="alert600" textAlign="center">
          Error Loading Bulk Codes
        </Text>
      </Box>
    );
  }

  if (bulkCodesResponse.isLoading) {
    return (
      <Box
        flex={1}
        backgroundColor="primary50"
        justifyContent="center"
        alignItems="center"
      >
        <ActivityIndicator size="large" color={theme.colors.primary900} />
        <Text variant="body" marginTop="m">
          Loading bulk codes...
        </Text>
      </Box>
    );
  }

  return (
    <>
      <ScreenContainer>
        <Text variant="title" paddingTop="xxl">
          Bulk Codes
        </Text>
        <Box paddingHorizontal="xs" paddingTop="m" paddingBottom="m">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Box flexDirection="row" gap="s">
              <FilterPill filter="active" label="Active" />
              <FilterPill filter="redeemed" label="Redeemed" />
            </Box>
          </ScrollView>
        </Box>

        <Box paddingHorizontal="xs" gap="s" flex={1}>
          <ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingBottom: 90, gap: 8 }}
            showsVerticalScrollIndicator={false}
          >
            {filteredCodes.length > 0 ? (
              filteredCodes.map((code) => (
                <BulkCodeCard
                  key={code.id}
                  bulkCode={code}
                  onPress={() => setSelectedCode(code)}
                />
              ))
            ) : (
              <Box paddingVertical="xl" alignItems="center">
                <Text variant="heading" color="neutral600" textAlign="center">
                  No {activeFilter} codes
                </Text>
              </Box>
            )}
          </ScrollView>
        </Box>
      </ScreenContainer>

      <BottomSheet visible={showSheet} onClose={() => setShowSheet(false)}>
        <BottomSheet.Header>New Bulk Code</BottomSheet.Header>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <BottomSheet.Body>
            <Box gap="s">
              <Box gap="xs">
                <Text variant="label">Code Name *</Text>
                <TextInput
                  placeholder="e.g., Spring 2026, Wedding Party"
                  value={name}
                  onChangeText={setName}
                  autoFocus
                  multiline={false}
                  returnKeyType="done"
                  blurOnSubmit
                />
              </Box>

              <Box gap="xs">
                <Text variant="label">Earliest Completion Date *</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
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
          </BottomSheet.Body>
          <BottomSheet.Footer>
            <TouchableOpacity
              onPress={handleCreateCode}
              disabled={createBulkCodeMutation.isPending}
            >
              <Box
                backgroundColor="primary900"
                padding="m"
                borderRadius="l"
                opacity={createBulkCodeMutation.isPending ? 0.6 : 1}
                alignItems="center"
              >
                <Text variant="button">
                  {createBulkCodeMutation.isPending ? "CREATING..." : "CREATE CODE"}
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSheet(false)}>
              <Box
                backgroundColor="neutral200"
                padding="m"
                borderRadius="l"
                alignItems="center"
              >
                <Text variant="button" color="neutral600">CANCEL</Text>
              </Box>
            </TouchableOpacity>
          </BottomSheet.Footer>
        </KeyboardAvoidingView>

        <DatePickerModal
          visible={showDatePicker}
          currentDate={earliestDate}
          onConfirm={(date) => {
            setEarliestDate(date);
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
        />
      </BottomSheet>

      <BulkCodeDetailSheet
        bulkCode={selectedCode}
        onClose={() => setSelectedCode(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.m,
    backgroundColor: `${theme.colors.primary100}95`,
    borderRadius: theme.borderRadii.l,
    overflow: "hidden",
    elevation: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  blurContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: theme.borderRadii.l,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheetWrapper: {
    width: "100%",
  },
});
