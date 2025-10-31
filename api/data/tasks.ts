import { getAliciapCeramicsSubaseClient } from "../aliciapCeramicsClient";
import { Tables } from "../dbTypes";

export type Task = Tables<"tasks"> & {
  order_details: {
    type: string;
    quantity: number;
    completed_quantity: number;
    description: string;
    order_id: string;
    status: string;
  };
};

export async function fetchTodaysTasks() {
  const client = getAliciapCeramicsSubaseClient();

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await client
    .from("tasks")
    .select(
      `
      *,
      order_details (
        type,
        quantity,
        completed_quantity,
        description,
        order_id,
        status
      )
    `
    )
    .eq("date", today)
    .eq("status", "pending")
    .order("is_late", { ascending: false })
    .order("estimated_hours", { ascending: false });

  if (error) throw error;

  return (data || []) as Task[];
}

export async function fetchWeekTasks() {
  const client = getAliciapCeramicsSubaseClient();

  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const mondayStr = monday.toISOString().split('T')[0];
  const sundayStr = sunday.toISOString().split('T')[0];

  const { data, error } = await client
    .from("tasks")
    .select(
      `
      *,
      order_details (
        type,
        quantity,
        completed_quantity,
        description,
        order_id,
        status
      )
    `
    )
    .gte("date", mondayStr)
    .lte("date", sundayStr)
    .eq("status", "pending")
    .order("date", { ascending: true })
    .order("is_late", { ascending: false })
    .order("estimated_hours", { ascending: false });

  if (error) throw error;

  return (data || []) as Task[];
}

export async function completeTask(taskId: string) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "https://aliciapceramics.com";

  const response = await fetch(`${apiUrl}/api/completeTask?id=${taskId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to complete task");
  }

  const data = await response.json();
  return data;
}

export async function regenerateSchedule() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "https://aliciapceramics.com";

  const response = await fetch(`${apiUrl}/api/scheduleTasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to regenerate schedule");
  }

  const data = await response.json();
  return data;
}
