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

export function useConversation(customerId: string | undefined): ConversationResponse & { refresh: () => Promise<void> } {
  const [data, setData] = useState<ConversationWithMessages | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | undefined>(undefined);

  const fetchConversation = useCallback(async () => {
    if (!customerId) {
      setLoading(false);
      setError({ message: "Customer ID is required", code: "MISSING_ID", hint: "", details: "" } as PostgrestError);
      return;
    }

    setLoading(true);
    setError(undefined);

    const client = getAliciapCeramicsSubaseClient();
    const { data, error } = await client
      .from("conversations")
      .select(`
        *,
        messages (*)
      `)
      .eq("customer_id", customerId)
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
  }, [customerId]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  const refresh = async () => {
    await fetchConversation();
  };

  if (loading) return { status: "loading", data: undefined, error: undefined, refresh };
  if (error) return { status: "error", error, data: undefined, refresh };
  if (!data) return { status: "no_conversation", data: undefined, error: undefined, refresh };

  return { status: "success", data, error: undefined, refresh };
}