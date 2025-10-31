import { Tabs } from "expo-router";
import { theme } from "@/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary50,
        },
        headerTitleStyle: {
          color: theme.colors.primary900,
          fontFamily: "Inter-Bold",
          fontSize: 18,
          textTransform: "uppercase",
        },
        tabBarStyle: {
          backgroundColor: theme.colors.neutral50,
          borderTopColor: theme.colors.neutral200,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: theme.colors.primary900,
        tabBarInactiveTintColor: theme.colors.neutral600,
        tabBarLabelStyle: {
          fontFamily: "Inter-SemiBold",
          fontSize: 11,
          textTransform: "uppercase",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarLabel: "Orders",
        }}
      />
      <Tabs.Screen
        name="conversations"
        options={{
          title: "Messages",
          tabBarLabel: "Messages",
        }}
      />
      <Tabs.Screen
        name="week"
        options={{
          title: "Week View",
          tabBarLabel: "Week",
        }}
      />
    </Tabs>
  );
}
