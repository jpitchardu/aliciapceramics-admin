import { Box, Text } from "@/components";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { useTodaysTasks } from "@/hooks/useTodaysTasks";
import { useCompleteTask } from "@/hooks/useCompleteTask";
import { useRegenerateSchedule } from "@/hooks/useRegenerateSchedule";
import { theme } from "@/theme";
import { useRouter } from "expo-router";
import { memo, useCallback } from "react";
import {
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  const router = useRouter();
  const tasksResponse = useTodaysTasks();
  const completeTaskMutation = useCompleteTask();
  const regenerateScheduleMutation = useRegenerateSchedule();

  const onOrderPress = useCallback(
    (orderId: string) => {
      router.push(`/orders/${orderId}`);
    },
    [router]
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
    [completeTaskMutation]
  );

  const onRegenerateSchedule = useCallback(() => {
    Alert.alert(
      "Regenerate Schedule",
      "This will delete all pending tasks and create a new schedule based on current orders and availability. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Regenerate",
          style: "destructive",
          onPress: () => {
            regenerateScheduleMutation.mutate(undefined, {
              onSuccess: () => {
                Alert.alert("Success", "Schedule regenerated successfully");
              },
              onError: (error) => {
                Alert.alert(
                  "Error",
                  `Failed to regenerate schedule: ${error.message}`
                );
              },
            });
          },
        },
      ]
    );
  }, [regenerateScheduleMutation]);

  const isLoading = !tasksResponse.isSuccess;
  const hasError = tasksResponse.isError;

  if (hasError) {
    return <ErrorState error={JSON.stringify(tasksResponse.error)} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  const { data: tasks } = tasksResponse;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: theme.spacing.m,
        backgroundColor: theme.colors.primary50,
      }}
    >
      <ScrollView style={{ flex: 1 }}>
        <Text variant="title" paddingTop="xxl">
          Dashboard
        </Text>
        <Box padding="m" gap="l">
          {tasks && tasks.length > 0 && (
            <Box gap="s">
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text variant="heading">
                  Today&apos;s Tasks ({tasks.length})
                </Text>
                <TouchableOpacity
                  onPress={onRegenerateSchedule}
                  disabled={regenerateScheduleMutation.isPending}
                >
                  <Box
                    backgroundColor="input500"
                    paddingHorizontal="m"
                    paddingVertical="s"
                    borderRadius="m"
                    opacity={regenerateScheduleMutation.isPending ? 0.5 : 1}
                  >
                    <Text variant="button" color="neutral50" fontSize={10}>
                      {regenerateScheduleMutation.isPending
                        ? "REGENERATING..."
                        : "REGENERATE"}
                    </Text>
                  </Box>
                </TouchableOpacity>
              </Box>
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

          {(!tasks || tasks.length === 0) && (
            <Box
              justifyContent="center"
              alignItems="center"
              paddingVertical="xl"
            >
              <Text variant="heading" color="primary900" textAlign="center">
                All caught up! 🎉
              </Text>
            </Box>
          )}

          <Box gap="s" marginTop="l">
            <Text variant="heading">Quick Actions</Text>
            <TouchableOpacity onPress={() => router.push("/availability")}>
              <Box
                backgroundColor="neutral50"
                padding="m"
                borderRadius="m"
                borderWidth={1}
                borderColor="neutral200"
              >
                <Text variant="heading" fontSize={16} marginBottom="xs">
                  Manage Availability
                </Text>
                <Text variant="body" color="neutral600" fontSize={14}>
                  Set your working hours for upcoming days
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

const ErrorState = memo<{ error: string }>(function ErrorState({ error }) {
  return (
    <Box
      flex={1}
      backgroundColor="primary50"
      paddingHorizontal="l"
      justifyContent="center"
      alignItems="center"
    >
      <Text variant="body" color="alert600" textAlign="center">
        Error loading dashboard, {JSON.stringify(error)}
      </Text>
    </Box>
  );
});

const LoadingState = memo(function LoadingState() {
  return (
    <Box
      flex={1}
      backgroundColor="primary50"
      justifyContent="center"
      alignItems="center"
    >
      <ActivityIndicator size="large" color="primary800" />
      <Text variant="body" marginTop="m">
        Loading dashboard...
      </Text>
    </Box>
  );
});
