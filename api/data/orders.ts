import { getAliciapCeramicsSubaseClient } from "../aliciapCeramicsClient";
import { Tables } from "../dbTypes";

export type Order = {
  id: string;
  status: string | null;
  name: string | null;
  type: string | null;
  due_date: string | null;
  timeline: string | null;
  customers: { name: string } | null;
  order_details: { id: string; quantity: number; type: string }[];
};

export type OrderWithDetails = Tables<"orders"> & {
  customers: Tables<"customers"> | null;
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
      name,
      type,
      due_date,
      timeline,
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

export async function cancelOrder(orderId: string) {
  const client = getAliciapCeramicsSubaseClient();

  const { data, error } = await client
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;

  return data as OrderWithDetails;
}

export async function completeOrder(orderId: string) {
  const client = getAliciapCeramicsSubaseClient();

  const { data, error } = await client
    .from("orders")
    .update({ status: "completed" })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;

  return data as OrderWithDetails;
}

export async function updateOrderDueDate(
  orderId: string,
  dueDate: Date | null
) {
  const client = getAliciapCeramicsSubaseClient();

  const dueDateString = dueDate ? dueDate.toISOString().split("T")[0] : null;

  const { data, error } = await client
    .from("orders")
    .update({ due_date: dueDateString })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;

  return data as OrderWithDetails;
}

export type CreateStorefrontOrderParams = {
  name: string;
  dueDate?: Date;
  pieceDetails: {
    type: string;
    size?: string;
    quantity: number;
    description: string;
  }[];
};

export async function createStorefrontOrder(
  params: CreateStorefrontOrderParams
) {
  const client = getAliciapCeramicsSubaseClient();

  const { data: order, error: orderError } = await client
    .from("orders")
    .insert({
      type: "storefront",
      name: params.name,
      due_date: params.dueDate?.toISOString().split("T")[0] || null,
      customer_id: null,
      timeline: params.dueDate?.toISOString().split("T")[0] || "2026-12-31",
      inspiration: "",
      special_considerations: "",
      consent: true,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const orderDetails = params.pieceDetails.map((piece) => ({
    order_id: order.id,
    type: piece.type,
    size: piece.size || null,
    quantity: piece.quantity,
    description: piece.description,
  }));

  const { error: detailsError } = await client
    .from("order_details")
    .insert(orderDetails);

  if (detailsError) throw detailsError;

  return order;
}

export type UpdateOrderDetailProgressParams = {
  orderDetailId: string;
  status?: string;
  completedQuantity?: number;
};

export async function updateOrderDetailProgress(params: UpdateOrderDetailProgressParams) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "https://aliciapceramics.com";

  const response = await fetch(`${apiUrl}/api/updateOrderDetail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderDetailId: params.orderDetailId,
      status: params.status,
      completedQuantity: params.completedQuantity,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update order detail");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to update order detail");
  }

  return result;
}
