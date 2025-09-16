import { getAliciapCeramicsSubaseClient } from "@/api/aliciapCeramicsClient";
import { Tables } from "@/api/dbTypes";
import { PostgrestError } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";

export type ConversationWithMessages = Tables<"conversations"> & {
  messages: Tables<"messages">[];
};

type SuccessfulConversationResponse = {
  status: "success";
  data: ConversationWithMessages;
  error: undefined;
};

type LoadingConversationResponse = {
  status: "loading";
  data: undefined;
  error: undefined;
};

type ErrorConversationResponse = {
  status: "error";
  data: undefined;
  error: PostgrestError;
};

type NoConversationResponse = {
  status: "no_conversation";
  data: undefined;
  error: undefined;
};

export type ConversationResponse =
  | SuccessfulConversationResponse
  | LoadingConversationResponse
  | ErrorConversationResponse
  | NoConversationResponse;

export function useConversation(orderId: string | undefined): ConversationResponse & { refresh: () => Promise<void> } {
  const [data, setData] = useState<ConversationWithMessages | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | undefined>(undefined);

  const client = getAliciapCeramicsSubaseClient();

  const fetchConversation = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      setError({ message: "Order ID is required", code: "MISSING_ID", hint: "", details: "" } as PostgrestError);
      return;
    }

    setLoading(true);
    setError(undefined);

    const { data, error } = await client
      .from("conversations")
      .select(`
        *,
        messages (*)
      `)
      .eq("order_id", orderId)
      .order("created_at", { ascending: true, referencedTable: "messages" })
      .single();

    setLoading(false);

    if (error) {
      if (error.code === "PGRST116") {
        return;
      }
      setError(error);
      return;
    }

    setData(data as ConversationWithMessages);
  }, [client, orderId]);

  useEffect(() => {
    fetchConversation();
  }, [client, fetchConversation, orderId]);

  const refresh = async () => {
    await fetchConversation();
  };

  if (loading) return { status: "loading", data: undefined, error: undefined, refresh };
  if (error) return { status: "error", error, data: undefined, refresh };
  if (!data) return { status: "no_conversation", data: undefined, error: undefined, refresh };

  return { status: "success", data, error: undefined, refresh };
}