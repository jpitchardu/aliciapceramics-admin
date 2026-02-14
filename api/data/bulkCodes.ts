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

function generateBulkCode(name: string, date: Date): string {
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const safeName = name.replace(/\s+/g, "");
  return `${safeName}${yy}${mm}${dd}`;
}

export async function createBulkCommissionCode(
  params: CreateBulkCommissionCodeParams
) {
  const client = getAliciapCeramicsSubaseClient();

  const code = generateBulkCode(params.name, params.earliestCompletionDate);
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

export async function deleteBulkCommissionCode(id: string) {
  const client = getAliciapCeramicsSubaseClient();

  const { error } = await client
    .from("bulk_commission_codes")
    .delete()
    .eq("id", id);

  if (error) throw error;
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
