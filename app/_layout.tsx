import { Stack } from "expo-router";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { config } from "@/components/ui/gluestack-ui-provider/config";
import "@/global.css";

export default function RootLayout() {
  return (
    <GluestackUIProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerStyle: {
              backgroundColor: `rgb(${config.light["--color-primary-50"]})`,
            },
            headerTitleStyle: {
              color: `rgb(${config.light["--color-primary-900"]})`,
            },
          }}
        />
        <Stack.Screen
          name="orders/[id]"
          options={{
            headerStyle: {
              backgroundColor: `rgb(${config.light["--color-primary-50"]})`,
            },
            headerTitleStyle: {
              color: `rgb(${config.light["--color-primary-900"]})`,
            },
          }}
        />
      </Stack>
    </GluestackUIProvider>
  );
}
