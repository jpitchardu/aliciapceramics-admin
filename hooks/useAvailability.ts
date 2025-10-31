import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAvailability, updateAvailability, AvailabilityUpdate } from "@/api/data/availability";

export function useAvailability(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["availability", startDate, endDate],
    queryFn: () => fetchAvailability(startDate, endDate),
  });
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: AvailabilityUpdate[]) => updateAvailability(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      queryClient.invalidateQueries({ queryKey: ["weekTasks"] });
    },
  });
}
