import { useQuery } from "@tanstack/react-query";
import { fetchWeekTasks } from "@/api/data/tasks";

export function useWeekTasks() {
  return useQuery({
    queryKey: ["weekTasks"],
    queryFn: fetchWeekTasks,
    refetchInterval: 30000,
  });
}
