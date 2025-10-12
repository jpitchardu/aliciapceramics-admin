import { useRef, useEffect, useState, memo, useCallback } from "react";
import { FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { Box, Text } from "@/components";
import { useMessagesForConversation } from "@/hooks/useMessagesForConversation";
import { MessageBubble } from "./MessageBubble";
import { Tables } from "@/api/dbTypes";

type ConversationViewProps = {
  conversationId: string;
};

const renderMessage = ({ item }: { item: Tables<"messages"> }) => (
  <MessageBubble message={item} />
);

const keyExtractor = (item: Tables<"messages">) => item.id;

export const ConversationView = memo(function ConversationView({
  conversationId,
}: ConversationViewProps) {
  const flatListRef = useRef<FlatList>(null);
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: messages,
    error,
    isLoading,
    refetch,
  } = useMessagesForConversation(conversationId);

  useEffect(() => {
    if (messages && messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

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
          {error?.message || "Unable to load messages"}
        </Text>
      </Box>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        padding="l"
        backgroundColor="primary50"
      >
        <Text variant="body" color="neutral600" textAlign="center">
          No messages yet. Start a conversation with the customer!
        </Text>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="primary50">
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={keyExtractor}
        renderItem={renderMessage}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3d1900"
            colors={["#3d1900"]}
          />
        }
      />
    </Box>
  );
});
