import { Box, Text } from "@/components";
import { useConversation } from "@/hooks/useConversation";
import { useCallback } from "react";
import { ActivityIndicator } from "react-native";
import { ConversationView } from "./ConversationView";
import { MessageComposer } from "./MessageComposer";

type MessagingInterfaceProps = {
  customerId: string;
  orderId: string;
};

export function MessagingInterface({
  customerId,
  orderId,
}: MessagingInterfaceProps) {
  const {
    data: conversation,
    error,
    isLoading,
    refetch,
  } = useConversation(customerId);

  const handleMessageSent = useCallback(async () => {
    if (!conversation) {
      await refetch();
    }
  }, [conversation, refetch]);

  if (isLoading) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="primary50"
      >
        <ActivityIndicator size="large" color="#3d1900" />
        <Text variant="body" color="neutral600" marginTop="m">
          Loading messages...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="primary50"
        padding="l"
      >
        <Text
          variant="heading"
          color="alert600"
          textAlign="center"
          marginBottom="m"
        >
          Error Loading Messages
        </Text>
        <Text variant="body" color="neutral600" textAlign="center">
          {error?.message || "Unable to load the conversation"}
        </Text>
      </Box>
    );
  }

  if (!conversation) {
    return (
      <Box flex={1} backgroundColor="primary50">
        <Box flex={1} justifyContent="center" alignItems="center" padding="l">
          <Text
            variant="body"
            color="neutral600"
            textAlign="center"
            marginBottom="l"
          >
            No conversation started yet. Send your first message to the
            customer!
          </Text>
        </Box>
        <MessageComposer orderId={orderId} onMessageSent={handleMessageSent} />
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="primary50">
      <Box flex={1}>
        <ConversationView conversationId={conversation.id} />
      </Box>
      <MessageComposer orderId={orderId} onMessageSent={handleMessageSent} />
    </Box>
  );
}
