import { Stack } from "expo-router";
import { ThemeProvider } from "@shopify/restyle";
import { QueryClientProvider } from "@tanstack/react-query";

import { theme } from "@/theme";
import { queryClient } from "@/api/queryClient";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
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
              presentation: "card",
            }}
          />
          <Stack.Screen
            name="customers/[id]/conversation"
            options={{
              headerStyle: {
                backgroundColor: theme.colors.primary100,
              },
              headerTitleStyle: {
                color: theme.colors.primary900,
              },
              presentation: "card",
            }}
          />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
