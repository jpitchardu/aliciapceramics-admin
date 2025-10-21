import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeTask } from "@/api/data/tasks";

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => completeTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "today"] });
    },
  });
}
