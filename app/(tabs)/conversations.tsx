import { Box, Text } from "@/components";
import { useAllConversations } from "@/hooks/useAllConversations";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";

export default function ConversationsScreen() {
  const router = useRouter();
  const { data: conversations, isLoading, isError } = useAllConversations();

  const onConversationPress = useCallback(
    (customerId: string) => {
      router.push(`/customers/${customerId}/conversation`);
    },
    [router],
  );

  if (isError) {
    return (
      <Box
        flex={1}
        backgroundColor="primary50"
        justifyContent="center"
        alignItems="center"
        padding="l"
      >
        <Text variant="heading" color="alert600" textAlign="center">
          Error Loading Conversations
        </Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        flex={1}
        backgroundColor="primary50"
        justifyContent="center"
        alignItems="center"
      >
        <ActivityIndicator size="large" color="#3d1900" />
        <Text variant="body" marginTop="m">
          Loading conversations...
        </Text>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="primary50">
      <ScrollView style={{ flex: 1 }}>
        <Box padding="m" gap="s">
          {conversations && conversations.length > 0 ? (
            conversations.map((conversation) => (
              <TouchableOpacity
                key={conversation.conversation_id}
                onPress={() => onConversationPress(conversation.customer_id)}
              >
                <Box
                  backgroundColor="neutral50"
                  padding="m"
                  borderRadius="m"
                  borderWidth={1}
                  borderColor="neutral200"
                >
                  <Text variant="heading" marginBottom="xs">
                    {conversation.customer_name}
                  </Text>
                  <Text variant="body" color="neutral600" fontSize={14}>
                    {conversation.customer_phone}
                  </Text>
                  {conversation.customer_email && (
                    <Text variant="body" color="neutral600" fontSize={14}>
                      {conversation.customer_email}
                    </Text>
                  )}
                </Box>
              </TouchableOpacity>
            ))
          ) : (
            <Box paddingVertical="xl" alignItems="center">
              <Text variant="heading" color="neutral600" textAlign="center">
                No conversations yet
              </Text>
            </Box>
          )}
        </Box>
      </ScrollView>
    </Box>
  );
}
