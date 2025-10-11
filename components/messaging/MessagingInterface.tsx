import React, { useEffect, useRef } from "react";
import { ActivityIndicator } from "react-native";
import { Box, Text } from "@/components";
import { useConversation } from "@/hooks/useConversation";
import { ConversationView } from "./ConversationView";
import { MessageComposer } from "./MessageComposer";

type MessagingInterfaceProps = {
  customerId: string;
};

export function MessagingInterface({
  customerId: orderId,
}: MessagingInterfaceProps) {
  const {
    status,
    data: conversation,
    error,
    refresh,
  } = useConversation(orderId);
  const conversationRef = useRef(conversation);

  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  const handleMessageSent = async () => {
    // Refresh the conversation to show the new message
    await refresh();
    // Small delay to ensure the new message is rendered before scrolling
    setTimeout(() => {
      // The ConversationView will handle scrolling to bottom
    }, 100);
  };

  if (status === "loading") {
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

  if (status === "error") {
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

  if (status === "no_conversation") {
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
        <ConversationView conversation={conversation} />
      </Box>
      <MessageComposer orderId={orderId} onMessageSent={handleMessageSent} />
    </Box>
  );
}
