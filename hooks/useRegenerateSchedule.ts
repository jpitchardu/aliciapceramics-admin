import { useMutation, useQueryClient } from "@tanstack/react-query";
import { regenerateSchedule } from "@/api/data/tasks";

export function useRegenerateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: regenerateSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todaysTasks"] });
    },
  });
}
