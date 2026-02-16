import { useTodaysTasks } from "@/hooks/useTodaysTasks";
import { useCompleteTask } from "@/hooks/useCompleteTask";
import { useRegenerateSchedule } from "@/hooks/useRegenerateSchedule";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert } from "react-native";

export function useDashboardScreen() {
  const router = useRouter();
  const tasksResponse = useTodaysTasks();
  const completeTaskMutation = useCompleteTask();
  const regenerateScheduleMutation = useRegenerateSchedule();

  const onOrderPress = useCallback(
    (orderId: string) => {
      router.push(`/orders/${orderId}`);
    },
    [router],
  );

  const onCompleteTask = useCallback(
    (taskId: string) => {
      Alert.alert("Complete Task", "Mark this task as completed?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Complete",
          onPress: () => completeTaskMutation.mutate(taskId),
        },
      ]);
    },
    [completeTaskMutation],
  );

  const onRegenerateSchedule = useCallback(() => {
    Alert.alert(
      "Regenerate Schedule",
      "This will delete all pending tasks and create a new schedule based on current orders and availability. Continue?",
      [
        { text: "Cancel", style: "cancel" },
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
                  `Failed to regenerate schedule: ${error.message}`,
                );
              },
            });
          },
        },
      ],
    );
  }, [regenerateScheduleMutation]);

  return {
    tasks: tasksResponse.data,
    isLoading: !tasksResponse.isSuccess,
    isError: tasksResponse.isError,
    error: tasksResponse.error,
    isRegenerating: regenerateScheduleMutation.isPending,
    onOrderPress,
    onCompleteTask,
    onRegenerateSchedule,
  };
}
