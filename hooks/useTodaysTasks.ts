import { useQuery } from "@tanstack/react-query";
import { fetchTodaysTasks } from "@/api/data/tasks";

export function useTodaysTasks() {
  return useQuery({
    queryKey: ["tasks", "today"],
    queryFn: fetchTodaysTasks,
    refetchInterval: 60000,
  });
}
