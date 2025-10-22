import { Box, Text } from "@/components";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { ConversationCard } from "@/components/dashboard/ConversationCard";
import { useTodaysTasks } from "@/hooks/useTodaysTasks";
import { useUnreadConversations } from "@/hooks/useUnreadConversations";
import { useCompleteTask } from "@/hooks/useCompleteTask";
import { useRouter } from "expo-router";
import { memo, useCallback } from "react";
import { ScrollView, ActivityIndicator, Alert } from "react-native";

export default function Dashboard() {
  const router = useRouter();
  const tasksResponse = useTodaysTasks();
  const conversationsResponse = useUnreadConversations();
  const completeTaskMutation = useCompleteTask();

  const onOrderPress = useCallback(
    (orderId: string) => {
      router.push(`/orders/${orderId}`);
    },
    [router],
  );

  const onConversationPress = useCallback(
    (customerId: string) => {
      router.push(`/customers/${customerId}/conversation`);
    },
    [router],
  );

  const onCompleteTask = useCallback(
    (taskId: string) => {
      Alert.alert("Complete Task", "Mark this task as completed?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Complete",
          onPress: () => {
            completeTaskMutation.mutate(taskId);
          },
        },
      ]);
    },
    [completeTaskMutation],
  );

  const isLoading =
    !tasksResponse.isSuccess || !conversationsResponse.isSuccess;
  const hasError = tasksResponse.isError || conversationsResponse.isError;

  if (hasError) {
    return (
      <Box
        flex={1}
        backgroundColor="primary50"
        paddingHorizontal="l"
        justifyContent="center"
        alignItems="center"
      >
        <Text variant="body" color="alert600" textAlign="center">
          Error loading dashboard
        </Text>
      </Box>
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  const { data: tasks } = tasksResponse;
  const { data: conversations } = conversationsResponse;

  return (
    <Box flex={1} backgroundColor="primary50">
      <ScrollView style={{ flex: 1 }}>
        <Box padding="m" gap="l">
          {conversations && conversations.length > 0 && (
            <Box gap="s">
              <Text variant="heading">
                Unread Messages ({conversations.length})
              </Text>
              <Box gap="s">
                {conversations.map((conversation) => (
                  <ConversationCard
                    key={conversation.conversation_id}
                    conversation={conversation}
                    onPress={onConversationPress}
                  />
                ))}
              </Box>
            </Box>
          )}

          {tasks && tasks.length > 0 && (
            <Box gap="s">
              <Text variant="heading">Today&apos;s Tasks ({tasks.length})</Text>
              <Box gap="s">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onPress={onOrderPress}
                    onComplete={onCompleteTask}
                  />
                ))}
              </Box>
            </Box>
          )}

          {(!tasks || tasks.length === 0) &&
            (!conversations || conversations.length === 0) && (
              <Box
                justifyContent="center"
                alignItems="center"
                paddingVertical="xl"
              >
                <Text
                  variant="heading"
                  color="neutral600"
                  textAlign="center"
                >
                  All caught up! 🎉
                </Text>
                <Text
                  variant="body"
                  color="neutral600"
                  textAlign="center"
                  marginTop="s"
                >
                  No tasks or unread messages
                </Text>
              </Box>
            )}
        </Box>
      </ScrollView>
    </Box>
  );
}

const LoadingState = memo(function LoadingState() {
  return (
    <Box
      flex={1}
      backgroundColor="primary50"
      justifyContent="center"
      alignItems="center"
    >
      <ActivityIndicator size="large" color="#3d1900" />
      <Text variant="body" marginTop="m">
        Loading dashboard...
      </Text>
    </Box>
  );
});
