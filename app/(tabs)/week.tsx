import { Box, Text } from "@/components";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { useWeekTasks } from "@/hooks/useWeekTasks";
import { useCompleteTask } from "@/hooks/useCompleteTask";
import { useRouter } from "expo-router";
import { memo, useCallback, useMemo } from "react";
import { ScrollView, ActivityIndicator, Alert } from "react-native";
import { Task } from "@/api/data/tasks";

export default function WeekView() {
  const router = useRouter();
  const tasksResponse = useWeekTasks();
  const completeTaskMutation = useCompleteTask();

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

  const tasksByDay = useMemo(() => {
    if (!tasksResponse.isSuccess || !tasksResponse.data) {
      return [];
    }

    const grouped = new Map<string, Task[]>();
    tasksResponse.data.forEach((task) => {
      const existing = grouped.get(task.date) || [];
      grouped.set(task.date, [...existing, task]);
    });

    return Array.from(grouped.entries()).map(([date, tasks]) => ({
      date,
      tasks,
      totalHours: tasks.reduce(
        (sum, task) => sum + (task.estimated_hours || 0),
        0
      ),
    }));
  }, [tasksResponse.data, tasksResponse.isSuccess]);

  if (tasksResponse.isError) {
    return (
      <Box
        flex={1}
        backgroundColor="primary50"
        paddingHorizontal="l"
        justifyContent="center"
        alignItems="center"
      >
        <Text variant="body" color="alert600" textAlign="center">
          Error loading weekly tasks
        </Text>
      </Box>
    );
  }

  if (!tasksResponse.isSuccess) {
    return <LoadingState />;
  }

  if (tasksByDay.length === 0) {
    return (
      <Box flex={1} backgroundColor="primary50">
        <Box
          flex={1}
          justifyContent="center"
          alignItems="center"
          paddingHorizontal="l"
        >
          <Text variant="heading" color="neutral600" textAlign="center">
            No tasks this week
          </Text>
          <Text
            variant="body"
            color="neutral600"
            textAlign="center"
            marginTop="s"
          >
            The schedule has not been generated yet
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="primary50">
      <ScrollView style={{ flex: 1 }}>
        <Box padding="m" gap="l">
          {tasksByDay.map(({ date, tasks, totalHours }) => (
            <DaySection
              key={date}
              date={date}
              tasks={tasks}
              totalHours={totalHours}
              onOrderPress={onOrderPress}
              onCompleteTask={onCompleteTask}
            />
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
}

interface DaySectionProps {
  date: string;
  tasks: Task[];
  totalHours: number;
  onOrderPress: (orderId: string) => void;
  onCompleteTask: (taskId: string) => void;
}

const DaySection = memo(function DaySection({
  date,
  tasks,
  totalHours,
  onOrderPress,
  onCompleteTask,
}: DaySectionProps) {
  const dateObj = new Date(date + "T00:00:00");
  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const today = new Date().toISOString().split("T")[0];
  const isToday = date === today;

  const defaultCapacity = getDefaultCapacity(dateObj.getDay());

  return (
    <Box gap="s">
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box flexDirection="row" alignItems="center" gap="s">
          <Text variant="heading">
            {dayName} {formattedDate}
          </Text>
          {isToday && (
            <Box
              backgroundColor="interactive500"
              paddingHorizontal="s"
              paddingVertical="xs"
              borderRadius="s"
            >
              <Text variant="label" color="neutral50" fontSize={10}>
                TODAY
              </Text>
            </Box>
          )}
        </Box>
        <Box
          backgroundColor="neutral200"
          paddingHorizontal="s"
          paddingVertical="xs"
          borderRadius="s"
        >
          <Text variant="label" fontSize={10}>
            {totalHours.toFixed(1)}h / {defaultCapacity}h
          </Text>
        </Box>
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
      <ActivityIndicator size="large" color="#3d1900" />
      <Text variant="body" marginTop="m">
        Loading weekly schedule...
      </Text>
    </Box>
  );
});

function getDefaultCapacity(dayOfWeek: number): number {
  const schedule: Record<number, number> = {
    0: 0,
    1: 4,
    2: 2,
    3: 2,
    4: 4,
    5: 8,
    6: 8,
  };
  return schedule[dayOfWeek] || 0;
}
