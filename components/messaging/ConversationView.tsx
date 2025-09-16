import React, { useRef, useEffect } from 'react'
import { FlatList } from 'react-native'
import { Box, Text } from '@/components'
import { ConversationWithMessages } from '@/hooks/useConversation'
import { MessageBubble } from './MessageBubble'

type ConversationViewProps = {
  conversation: ConversationWithMessages
}

export function ConversationView({ conversation }: ConversationViewProps) {
  const flatListRef = useRef<FlatList>(null)
  const sortedMessages = [...conversation.messages].sort(
    (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
  )

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (sortedMessages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true })
    }
  }, [sortedMessages.length])

  if (sortedMessages.length === 0) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" padding="l">
        <Text variant="body" color="neutral600" textAlign="center">
          No messages yet. Start a conversation with the customer!
        </Text>
      </Box>
    )
  }

  return (
    <Box flex={1} backgroundColor="primary50">
      <FlatList
        ref={flatListRef}
        data={sortedMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </Box>
  )
}