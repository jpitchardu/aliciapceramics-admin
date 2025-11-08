import { TabBar } from "@/ui/TabBar";

import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      detachInactiveScreens={true}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
        }}
      />
      <Tabs.Screen
        name="conversations"
        options={{
          title: "Conversations",
        }}
      />
      <Tabs.Screen
        name="week"
        options={{
          title: "Week",
        }}
      />
    </Tabs>
  );
}
