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
    `,
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
    `,
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

export async function updateOrderDueDate(orderId: string, dueDate: Date | null) {
  const client = getAliciapCeramicsSubaseClient();

  const dueDateString = dueDate ? dueDate.toISOString().split('T')[0] : null;

  const { data, error} = await client
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
  pieceDetails: Array<{
    type: string;
    size?: string;
    quantity: number;
    description: string;
  }>;
};

export async function createStorefrontOrder(params: CreateStorefrontOrderParams) {
  const client = getAliciapCeramicsSubaseClient();

  const { data: order, error: orderError } = await client
    .from("orders")
    .insert({
      type: "storefront",
      name: params.name,
      due_date: params.dueDate?.toISOString().split('T')[0] || null,
      customer_id: null,
      timeline: params.dueDate?.toISOString().split('T')[0] || "2026-12-31",
      inspiration: "",
      special_considerations: "",
      consent: true,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const orderDetails = params.pieceDetails.map(piece => ({
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
  const client = getAliciapCeramicsSubaseClient();

  const updates: {
    status?: string;
    completed_quantity?: number;
    status_changed_at?: string;
  } = {};

  if (params.status !== undefined) {
    updates.status = params.status;
    updates.status_changed_at = new Date().toISOString();
  }

  if (params.completedQuantity !== undefined) {
    updates.completed_quantity = params.completedQuantity;
  }

  const { data, error } = await client
    .from("order_details")
    .update(updates)
    .eq("id", params.orderDetailId)
    .select()
    .single();

  if (error) throw error;

  return data as Tables<"order_details">;
}
