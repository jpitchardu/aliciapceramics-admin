import { getAliciapCeramicsSubaseClient } from "../aliciapCeramicsClient";
import { Tables } from "../dbTypes";

export type Task = Tables<"tasks"> & {
  order_details: {
    type: string;
    quantity: number;
    description: string;
    order_id: string;
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
        description,
        order_id
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
  const client = getAliciapCeramicsSubaseClient();

  const { data, error } = await client
    .from("tasks")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .select()
    .single();

  if (error) throw error;

  return data as Tables<"tasks">;
}
