import { theme } from "@/theme";
import { SFSymbol, SymbolView } from "expo-symbols";
import { StyleSheet, TouchableOpacity } from "react-native";

type IconButtonProps = {
  symbol: SFSymbol;
  variant: "primary" | "transparent";
  onPress: () => void;
};

export function IconButton({ onPress, symbol }: IconButtonProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="New order"
      onPress={onPress}
      style={styles.container}
    >
      <SymbolView
        name={symbol}
        size={24}
        type="hierarchical"
        tintColor={theme.colors.primary900}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
