import { useBulkCodes } from "@/hooks/useBulkCodes";
import { useScroll } from "@/contexts/ScrollContext";
import { theme } from "@/theme";
import { BlurView } from "expo-blur";
import { useNavigation, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type FilterType = "active" | "redeemed";

export function useBulkCodesScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const bulkCodesResponse = useBulkCodes();
  const [activeFilter, setActiveFilter] = useState<FilterType>("active");
  const { setScrollY } = useScroll();

  const ActionButton = useMemo(
    () =>
      function ActionButton() {
        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="New bulk code"
            onPress={() => router.push("/bulk-codes/create")}
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
    [router],
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
    [setScrollY],
  );

  const filteredCodes = useMemo(() => {
    if (!bulkCodesResponse.data) return [];
    return bulkCodesResponse.data.filter((code) =>
      activeFilter === "active" ? !code.redeemed_at : !!code.redeemed_at,
    );
  }, [bulkCodesResponse.data, activeFilter]);

  const onCodePress = useCallback(
    (id: string) => router.push(`/bulk-codes/${id}`),
    [router],
  );

  return {
    isLoading: bulkCodesResponse.isLoading,
    isError: bulkCodesResponse.isError,
    activeFilter,
    setActiveFilter,
    filteredCodes,
    handleScroll,
    onCodePress,
  };
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
});
