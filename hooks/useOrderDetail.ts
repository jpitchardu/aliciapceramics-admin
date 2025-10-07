import { getAliciapCeramicsSubaseClient } from "@/api/aliciapCeramicsClient";
import { Tables } from "@/api/dbTypes";
import { PostgrestError } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export type OrderWithDetails = Tables<"orders"> & {
  customers: Tables<"customers">;
  order_details: Tables<"order_details">[];
};

type SuccessfulOrderDetailResponse = {
  status: "success";
  data: OrderWithDetails;
  error: undefined;
};

type LoadingOrderDetailResponse = {
  status: "loading";
  data: undefined;
  error: undefined;
};

type ErrorOrderDetailResponse = {
  status: "error";
  data: undefined;
  error: PostgrestError;
};

export type OrderDetailResponse =
  | SuccessfulOrderDetailResponse
  | LoadingOrderDetailResponse
  | ErrorOrderDetailResponse;

export function useOrderDetail(orderId: string | undefined): OrderDetailResponse {
  const [data, setData] = useState<OrderWithDetails | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | undefined>(undefined);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError({ message: "Order ID is required", code: "MISSING_ID", hint: "", details: "" } as PostgrestError);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError(undefined);

      const client = getAliciapCeramicsSubaseClient();
      const { data, error } = await client
        .from("orders")
        .select(`
          *,
          customers (*),
          order_details (*)
        `)
        .eq("id", orderId)
        .single();

      setLoading(false);

      if (error) {
        setError(error);
        return;
      }

      setData(data as OrderWithDetails);
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return { status: "loading", data: undefined, error: undefined };
  if (error) return { status: "error", error, data: undefined };
  if (!data) return { status: "error", error: { message: "Order not found", code: "NOT_FOUND", hint: "", details: "" } as PostgrestError, data: undefined };

  return { status: "success", data, error: undefined };
}