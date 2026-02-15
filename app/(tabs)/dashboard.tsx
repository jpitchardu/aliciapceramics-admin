import { Box, Text } from "@/components";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { ErrorState } from "@/ui/ErrorState";
import { LoadingState } from "@/ui/LoadingState";
import { useDashboardScreen } from "./useDashboardScreen";
import { theme } from "@/theme";
import { ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();
  const {
    tasks,
    isLoading,
    isError,
    error,
    isRegenerating,
    onOrderPress,
    onCompleteTask,
    onRegenerateSchedule,
  } = useDashboardScreen();

  if (isError) {
    return <ErrorState message={`Error loading dashboard: ${JSON.stringify(error)}`} />;
  }

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />;
  }

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
                  disabled={isRegenerating}
                >
                  <Box
                    backgroundColor="input500"
                    paddingHorizontal="m"
                    paddingVertical="s"
                    borderRadius="m"
                    opacity={isRegenerating ? 0.5 : 1}
                  >
                    <Text variant="button" color="neutral50" fontSize={10}>
                      {isRegenerating ? "REGENERATING..." : "REGENERATE"}
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
