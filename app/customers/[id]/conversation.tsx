import { Box, Text } from "@/components";
import { MessagingInterface } from "@/components/messaging/MessagingInterface";
import { theme } from "@/theme";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

export default function CustomerConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Messages",
      headerStyle: {
        backgroundColor: theme.colors.primary100,
      },
    });
  }, [navigation]);

  if (!id) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="primary50"
        padding="l"
      >
        <Text variant="heading" color="alert600" textAlign="center">
          Invalid customer ID
        </Text>
      </Box>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <MessagingInterface customerId={id} />
    </KeyboardAvoidingView>
  );
}
