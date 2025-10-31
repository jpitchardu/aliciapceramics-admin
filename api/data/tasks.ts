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
