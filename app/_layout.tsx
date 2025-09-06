import { Stack } from "expo-router";

import "@/global.css";
import { aliciapCeramicsTheme } from "@/theme/aliciap-theme";
import { GluestackUIProvider } from "@gluestack-ui/themed";

export default function RootLayout() {
  return (
    <GluestackUIProvider config={aliciapCeramicsTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerStyle: { backgroundColor: "#fbfaf9" },
            headerTitleStyle: { color: "#3d1900" },
          }}
        />
        <Stack.Screen
          name="orders/[id]"
          options={{
            headerStyle: { backgroundColor: "#fbfaf9" },
            headerTitleStyle: { color: "#3d1900" },
          }}
        />
      </Stack>
    </GluestackUIProvider>
  );
}
