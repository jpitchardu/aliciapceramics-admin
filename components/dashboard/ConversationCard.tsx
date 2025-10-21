import { Box, Text } from "@/components";
import { UnreadConversation } from "@/api/data/conversations";
import { TouchableOpacity } from "react-native";

interface ConversationCardProps {
  conversation: UnreadConversation;
  onPress: (customerId: string) => void;
}

export function ConversationCard({
  conversation,
  onPress,
}: ConversationCardProps) {
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

  return (
    <TouchableOpacity onPress={() => onPress(conversation.customer_id)}>
      <Box
        backgroundColor="alert600"
        borderRadius="xl"
        padding="m"
        borderLeftWidth={4}
        borderLeftColor="alert600"
        borderWidth={2}
        borderColor="primary50"
      >
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box flex={1} gap="xs">
            <Text variant="heading" color="neutral50">
              {conversation.customer_name}
            </Text>
            <Text variant="body" color="neutral50" fontSize={12}>
              {conversation.customer_phone}
            </Text>
          </Box>
          <Box alignItems="flex-end" gap="xs">
            <Box
              backgroundColor="neutral50"
              paddingHorizontal="s"
              paddingVertical="xs"
              borderRadius="s"
              minWidth={24}
              alignItems="center"
            >
              <Text variant="label" color="alert600" fontSize={12}>
                {conversation.unread_count}
              </Text>
            </Box>
            <Text variant="label" color="neutral50" fontSize={10}>
              {formatTimeAgo(conversation.last_message_at)}
            </Text>
          </Box>
        </Box>
      </Box>
    </TouchableOpacity>
  );
}
