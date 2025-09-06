import { Stack } from "expo-router";

import "@/global.css";
import { aliciapCeramicsTheme } from "@/theme/aliciap-theme";
import { GluestackUIProvider } from "@gluestack-ui/themed";

export default function RootLayout() {
  return (
    <GluestackUIProvider config={aliciapCeramicsTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </GluestackUIProvider>
  );
}
