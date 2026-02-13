import { TabBar } from "@/ui/TabBar";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="dashboard" options={{ headerShown: false }} />
      <Tabs.Screen name="orders" options={{ headerShown: false }} />
      <Tabs.Screen name="week" options={{ headerShown: false }} />
      <Tabs.Screen name="bulk-codes" options={{ headerShown: false }} />
    </Tabs>
  );
}
