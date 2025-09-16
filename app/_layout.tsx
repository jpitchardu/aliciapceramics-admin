import { Stack } from "expo-router";
import { ThemeProvider } from "@shopify/restyle";

import { theme } from "@/theme";

export default function RootLayout() {
  return (
    <ThemeProvider theme={theme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerStyle: {
              backgroundColor: theme.colors.primary50,
            },
            headerTitleStyle: {
              color: theme.colors.primary900,
            },
          }}
        />
        <Stack.Screen
          name="orders/[id]/index"
          options={{
            headerStyle: {
              backgroundColor: theme.colors.primary50,
            },
            headerTitleStyle: {
              color: theme.colors.primary900,
            },
          }}
        />
        <Stack.Screen
          name="orders/[id]/messages"
          options={{
            headerStyle: {
              backgroundColor: theme.colors.primary100,
            },
            headerTitleStyle: {
              color: theme.colors.primary900,
            },
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
