import React from 'react'
import { Box, Text } from '@/components'
import { Tables } from '@/api/dbTypes'

type MessageBubbleProps = {
  message: Tables<'messages'>
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOutbound = message.direction === 'outbound'

  return (
    <Box
      alignSelf={isOutbound ? 'flex-end' : 'flex-start'}
      maxWidth="80%"
      marginVertical="xs"
    >
      <Box
        backgroundColor={isOutbound ? 'primary900' : 'primary100'}
        paddingVertical="s"
        paddingHorizontal="m"
        borderRadius="m"
        borderBottomRightRadius={isOutbound ? 's' : 'm'}
        borderBottomLeftRadius={isOutbound ? 'm' : 's'}
      >
        <Text
          variant="body"
          color={isOutbound ? 'neutral50' : 'primary900'}
        >
          {message.body}
        </Text>
      </Box>
      <Box alignSelf={isOutbound ? 'flex-end' : 'flex-start'} marginTop="xs">
        <Text
          variant="label"
          color="neutral600"
          fontSize={10}
          textTransform="none"
        >
          {new Date(message.created_at || '').toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
          {isOutbound && ` • ${message.twilio_status || 'sent'}`}
        </Text>
      </Box>
    </Box>
  )
}