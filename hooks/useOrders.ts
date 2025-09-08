import { getAliciapCeramicsSubaseClient } from "@/api/aliciapCeramicsClient";
import { PostgrestError } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type SuccessfulOrdersResponse = {
  status: "success";
  data: Order[];
  error: undefined;
};
type LoadingOrdersResponse = {
  status: "loading";
  data: undefined;
  error: undefined;
};
type ErrorOrdersResponse = {
  status: "error";
  data: undefined;
  error: PostgrestError;
};

export type OrdersResponse =
  | SuccessfulOrdersResponse
  | LoadingOrdersResponse
  | ErrorOrdersResponse;

export type Order = {
  id: string;
  status: string | null;
  customers: { name: string };
  order_details: { id: string; quantity: number; type: string }[];
};

export function useOrders(): OrdersResponse {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError>();

  const client = getAliciapCeramicsSubaseClient();

  useEffect(() => {
    client
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
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        setLoading(false);

        if (error) return setError(error);

        setData(data);
      });
  }, [client]);

  if (loading) return { status: "loading", data: undefined, error: undefined };
  if (error) return { status: "error", error, data: undefined };

  return { status: "success", data, error: undefined };
}
