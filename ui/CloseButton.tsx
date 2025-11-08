import { theme } from "@/theme";
import { SymbolView } from "expo-symbols";
import { StyleSheet, TouchableOpacity } from "react-native";

type CloseButtonProps = {
  onPress: () => void;
};

export function CloseButton({ onPress }: CloseButtonProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="New order"
      onPress={onPress}
      style={styles.tab}
    >
      <SymbolView
        name="xmark"
        size={24}
        type="hierarchical"
        tintColor={theme.colors.primary900}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.borderRadii.l,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
