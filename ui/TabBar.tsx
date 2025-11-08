import { Box } from "@/components";
import { useScroll } from "@/contexts/ScrollContext";
import { theme } from "@/theme";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { SFSymbol, SymbolView } from "expo-symbols";
import { ComponentType, useEffect } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

type TabRoute = "dashboard" | "orders" | "conversations" | "week";

// Custom options interface that extends the base options
interface CustomTabOptions {
  tabBarActionButton?: ComponentType;
}

const TAB_ICONS: Record<TabRoute, { default: SFSymbol; selected: SFSymbol }> = {
  dashboard: { default: "house", selected: "house.fill" },
  orders: { default: "list.bullet", selected: "list.bullet" },
  conversations: { default: "bubble.left", selected: "bubble.left.fill" },
  week: { default: "calendar", selected: "calendar" },
};

const COLLAPSE_THRESHOLD = Dimensions.get("window").height * 0.5; // 50vh
const COLLAPSED_WIDTH = 60;
const SPRING_CONFIG = {
  damping: 20,
  stiffness: 90,
  mass: 0.8,
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const {
    scrollY,
    isCollapsed,
    setIsCollapsed,
    manualOverride,
    setManualOverride,
  } = useScroll();

  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const customOptions = focusedDescriptor.options as CustomTabOptions;
  const ScreenActionTab = customOptions.tabBarActionButton;
  const screenWidth = Dimensions.get("window").width - 32;

  useEffect(() => {
    if (manualOverride) {
      if (scrollY < 50) {
        setManualOverride(false);
        setIsCollapsed(false);
      }
      return;
    }

    if (scrollY > COLLAPSE_THRESHOLD && !isCollapsed) {
      setIsCollapsed(true);
    } else if (scrollY < 50 && isCollapsed) {
      setIsCollapsed(false);
    }
  }, [scrollY, isCollapsed, setIsCollapsed, manualOverride, setManualOverride]);

  // Animated styles for container
  const containerAnimatedStyle = useAnimatedStyle(() => {
    "worklet";
    const targetWidth = isCollapsed ? COLLAPSED_WIDTH : screenWidth;

    return {
      width: withSpring(targetWidth, SPRING_CONFIG),
      flex: 0,
      alignSelf: "flex-start" as const,
    };
  });

  // Handle tap to expand when collapsed
  const handleContainerPress = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setManualOverride(true); // Prevent auto-collapse
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={isCollapsed ? 0.7 : 1}
      onPress={handleContainerPress}
      disabled={!isCollapsed}
    >
      <View style={styles.newContainer}>
        <Animated.View style={[styles.container, containerAnimatedStyle]}>
          <BlurView
            intensity={15}
            style={styles.blurContainer}
            tint="prominent"
          />
          <Animated.View style={styles.tabBar}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;

              // Hide non-focused tabs when collapsed
              if (isCollapsed && !isFocused) {
                return null;
              }

              const onPress = () => {
                // If collapsed, expand instead of navigating
                if (isCollapsed) {
                  setManualOverride(true);
                  setIsCollapsed(false);
                  return;
                }

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
          </Animated.View>
        </Animated.View>
        {ScreenActionTab ? (
          <>
            <Box flex={1} minWidth={theme.spacing.s} />
            <ScreenActionTab />
          </>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  newContainer: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
    bottom: theme.spacing.l,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.borderRadii.l,
    justifyContent: "space-between",
  },
  container: {
    flexShrink: 1,
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
