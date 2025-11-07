import { theme } from "@/theme";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { SFSymbol, SymbolView } from "expo-symbols";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type TabRoute = "dashboard" | "orders" | "conversations" | "week";

const TAB_ICONS: Record<TabRoute, { default: SFSymbol; selected: SFSymbol }> = {
  dashboard: { default: "house", selected: "house.fill" },
  orders: { default: "list.bullet", selected: "list.bullet" },
  conversations: { default: "bubble.left", selected: "bubble.left.fill" },
  week: { default: "calendar", selected: "calendar" },
} as const;

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <BlurView intensity={10} style={styles.blurContainer} tint="prominent" />
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const iconName = TAB_ICONS[route.name as TabRoute];
          const icon = isFocused ? iconName.selected : iconName.default;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.tab, isFocused && styles.tabSelected]}
            >
              <SymbolView
                name={icon}
                size={24}
                type="hierarchical"
                tintColor={theme.colors.primary900}
                style={styles.icon}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: "center",
    overflow: "hidden",
    borderRadius: theme.borderRadii.l,
  },
  blurContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: theme.borderRadii.l,
  },
  tabBar: {
    zIndex: 1,
    flexDirection: "row",
    backgroundColor: `${theme.colors.primary100}95`,
    borderRadius: theme.borderRadii.l,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.m,
  },
  tabSelected: {
    backgroundColor: theme.colors.input400,
    borderRadius: theme.borderRadii.m,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
