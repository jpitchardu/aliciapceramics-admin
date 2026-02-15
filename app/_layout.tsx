import { ThemeProvider } from "@shopify/restyle";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

import { queryClient } from "@/api/queryClient";
import { ScrollProvider } from "@/contexts/ScrollContext";
import { theme } from "@/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <ScrollProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="storefront/create"
                options={{
                  headerShown: false,
                  presentation: "modal",
                }}
              />
              <Stack.Screen
                name="orders/[id]/index"
                options={{
                  headerShown: false,
                  presentation: "modal",
                }}
              />
              <Stack.Screen
                name="bulk-codes/create"
                options={{
                  headerShown: false,
                  presentation: "formSheet",
                  sheetAllowedDetents: [0.4],
                  sheetGrabberVisible: true,
                  contentStyle: { backgroundColor: theme.colors.primary50 },
                }}
              />
              <Stack.Screen
                name="bulk-codes/[id]"
                options={{
                  headerShown: false,
                  presentation: "modal",
                }}
              />
              <Stack.Screen
                name="date-picker"
                options={{
                  headerShown: false,
                  presentation: "formSheet",
                  sheetAllowedDetents: [0.45],
                  sheetGrabberVisible: true,
                  contentStyle: { backgroundColor: theme.colors.primary50 },
                }}
              />
              <Stack.Screen
                name="availability/index"
                options={{
                  title: "Manage Availability",
                  headerStyle: {
                    backgroundColor: theme.colors.primary50,
                  },
                  headerTitleStyle: {
                    color: theme.colors.primary900,
                  },
                  presentation: "card",
                }}
              />
            </Stack>
          </ScrollProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
