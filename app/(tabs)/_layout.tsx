import { NativeTabs, Label, Icon } from "expo-router/unstable-native-tabs";
import { theme } from "@/theme";

export default function TabLayout() {
  return (
    <NativeTabs
      backgroundColor={theme.colors.primary100}
      iconColor={theme.colors.primary900}
      minimizeBehavior="onScrollDown"
    >
      <NativeTabs.Trigger name="dashboard">
        <Label hidden />
        <Icon sf={{ default: "house", selected: "house.fill" }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="orders">
        <Label hidden />
        <Icon sf={"list.bullet"} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="week">
        <Label hidden />
        <Icon sf={"calendar"} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
