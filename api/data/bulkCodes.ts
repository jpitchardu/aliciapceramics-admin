import { getAliciapCeramicsSubaseClient } from "../aliciapCeramicsClient";
import { Tables } from "../dbTypes";

export type BulkCommissionCode = Tables<"bulk_commission_codes">;

export async function fetchBulkCommissionCodes() {
  const client = getAliciapCeramicsSubaseClient();

  const { data, error } = await client
    .from("bulk_commission_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as BulkCommissionCode[];
}

export type CreateBulkCommissionCodeParams = {
  name: string;
  earliestCompletionDate: Date;
};

function generateBulkCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createBulkCommissionCode(
  params: CreateBulkCommissionCodeParams
) {
  const client = getAliciapCeramicsSubaseClient();

  const code = generateBulkCode();
  const dateString = params.earliestCompletionDate.toISOString().split("T")[0];

  const { data, error } = await client
    .from("bulk_commission_codes")
    .insert({
      code,
      name: params.name,
      earliest_completion_date: dateString,
    })
    .select()
    .single();

  if (error) throw error;

  return data as BulkCommissionCode;
}

export async function fetchOrdersByBulkCode(bulkCodeId: string) {
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
      created_at,
      customers (
        name,
        email,
        phone
      ),
      order_details (
        id,
        quantity,
        type
      )
    `
    )
    .eq("bulk_commission_code_id", bulkCodeId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}
