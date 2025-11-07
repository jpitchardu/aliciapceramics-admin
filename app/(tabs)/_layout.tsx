import { Tabs } from "expo-router";
import { TabBar } from "@/components/TabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
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
