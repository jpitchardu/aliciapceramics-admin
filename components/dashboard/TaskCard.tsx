import { Box, Text } from "@/components";
import { Task } from "@/api/data/tasks";
import { TouchableOpacity } from "react-native";

interface TaskCardProps {
  task: Task;
  onPress: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export function TaskCard({ task, onPress, onComplete }: TaskCardProps) {
  const formatTaskType = (taskType: string) => {
    return taskType
      .replace("task_", "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Box
      backgroundColor={task.is_late ? "input300" : "interactive300"}
      borderRadius="xl"
      padding="m"
      borderLeftWidth={4}
      borderLeftColor={task.is_late ? "alert600" : "interactive500"}
      borderWidth={2}
      borderColor="primary50"
      gap="s"
    >
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box flex={1} gap="xs">
          <Text variant="heading">{formatTaskType(task.task_type)}</Text>
          <Text variant="body">
            {task.quantity} × {task.order_details.type}
          </Text>
          {task.order_details.description && (
            <Text variant="body" color="neutral600" fontSize={12}>
              {task.order_details.description}
            </Text>
          )}
          <Text variant="label" color="neutral600" fontSize={10}>
            Est. {task.estimated_hours}h
          </Text>
        </Box>
        {task.is_late && (
          <Box backgroundColor="alert600" paddingHorizontal="s" paddingVertical="xs" borderRadius="s">
            <Text variant="label" color="neutral50" fontSize={10}>
              LATE
            </Text>
          </Box>
        )}
      </Box>

      <Box flexDirection="row" gap="s">
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => onComplete(task.id)}
        >
          <Box backgroundColor="interactive500" padding="s" borderRadius="m">
            <Text variant="button" color="neutral50" textAlign="center" fontSize={12}>
              COMPLETE
            </Text>
          </Box>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => onPress(task.order_details.order_id)}
        >
          <Box backgroundColor="primary100" padding="s" borderRadius="m">
            <Text variant="button" color="primary900" textAlign="center" fontSize={12}>
              VIEW ORDER
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>
    </Box>
  );
}
