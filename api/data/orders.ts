import { getAliciapCeramicsSubaseClient } from "../aliciapCeramicsClient";
import { Tables } from "../dbTypes";

export type Order = {
  id: string;
  status: string | null;
  customers: { name: string };
  order_details: { id: string; quantity: number; type: string }[];
};

export type OrderWithDetails = Tables<"orders"> & {
  customers: Tables<"customers">;
  order_details: Tables<"order_details">[];
};

export async function fetchOrders() {
  const client = getAliciapCeramicsSubaseClient();

  const { data, error } = await client
    .from("orders")
    .select(
      `
      id,
      status,
      customers (
        name
      ),
      order_details (
        id,
        quantity,
        type
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Order[];
}

export async function fetchOrderById(orderId: string) {
  const client = getAliciapCeramicsSubaseClient();

  const { data, error } = await client
    .from("orders")
    .select(
      `
      *,
      customers (*),
      order_details (*)
    `
    )
    .eq("id", orderId)
    .single();

  if (error) throw error;

  return data as OrderWithDetails;
}
