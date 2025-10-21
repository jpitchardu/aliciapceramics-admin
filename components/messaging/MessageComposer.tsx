import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box, Text, TextInput } from "@/components";
import { useSendMessage } from "@/hooks/useSendMessage";

type MessageComposerProps = {
  customerId: string;
  onMessageSent?: () => void;
};

export function MessageComposer({
  customerId,
  onMessageSent,
}: MessageComposerProps) {
  const [messageText, setMessageText] = useState("");
  const { mutate: sendMessage, isPending, error } = useSendMessage();
  const insets = useSafeAreaInsets();

  const handleSend = async () => {
    if (!messageText.trim()) return;

    sendMessage({ body: messageText.trim(), customerId }, {
      onSuccess: () => {
        setMessageText("");
        onMessageSent?.();
      },
      onError: (err) => {
        Alert.alert("Error", err.message || "Failed to send message");
      },
    });
  };

  return (
    <Box
      backgroundColor="neutral50"
      padding="m"
      borderTopWidth={1}
      borderTopColor="neutral200"
      style={{ paddingBottom: Math.max(insets.bottom, 16) }}
    >
      {error && (
        <Box
          marginBottom="s"
          padding="s"
          backgroundColor="alert600"
          borderRadius="s"
        >
          <Text variant="body" color="neutral50" fontSize={14}>
            {error.message}
          </Text>
        </Box>
      )}

      <Box flexDirection="row" alignItems="flex-end" gap="s">
        <Box flex={1}>
          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type your message..."
            placeholderTextColor="#a4b4b7"
            multiline
            maxLength={1600}
            style={{
              maxHeight: 120,
              minHeight: 44,
              textAlignVertical: "top",
              paddingTop: 12,
            }}
            editable={!isPending}
          />
        </Box>

        <TouchableOpacity
          onPress={handleSend}
          disabled={!messageText.trim() || isPending}
          style={{
            backgroundColor:
              !messageText.trim() || isPending ? "#a4b4b7" : "#3d1900",
            borderRadius: 14,
            paddingVertical: 12,
            paddingHorizontal: 16,
            minHeight: 44,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text variant="button" color="neutral50" fontSize={12}>
            {isPending ? "SENDING..." : "SEND"}
          </Text>
        </TouchableOpacity>
      </Box>

      <Box marginTop="xs" alignSelf="flex-end">
        <Text
          variant="label"
          color="neutral600"
          fontSize={10}
          textTransform="none"
        >
          {messageText.length}/1600
        </Text>
      </Box>
    </Box>
  );
}
