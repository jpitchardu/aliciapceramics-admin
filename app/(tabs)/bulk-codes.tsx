import { Box, Text } from "@/components";
import { BulkCodeCard } from "@/components/BulkCodeCard";
import { ErrorState } from "@/ui/ErrorState";
import { FilterPill } from "@/ui/FilterPill";
import { FilterPillBar } from "@/ui/FilterPillBar";
import { LoadingState } from "@/ui/LoadingState";
import { ScreenContainer } from "@/ui/ScreenContainer";
import { useBulkCodesScreen } from "./useBulkCodesScreen";
import { ScrollView } from "react-native";

export default function BulkCodesScreen() {
  const {
    isLoading,
    isError,
    activeFilter,
    setActiveFilter,
    filteredCodes,
    handleScroll,
    onCodePress,
  } = useBulkCodesScreen();

  if (isError) {
    return <ErrorState message="Error Loading Bulk Codes" />;
  }

  if (isLoading) {
    return <LoadingState message="Loading bulk codes..." />;
  }

  return (
    <ScreenContainer>
      <Text variant="title" paddingTop="xxl">
        Bulk Codes
      </Text>
      <FilterPillBar>
        <FilterPill label="Active" active={activeFilter === "active"} onPress={() => setActiveFilter("active")} />
        <FilterPill label="Redeemed" active={activeFilter === "redeemed"} onPress={() => setActiveFilter("redeemed")} />
      </FilterPillBar>

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
                onPress={() => onCodePress(code.id)}
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
  );
}
