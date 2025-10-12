import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Database } from "./dbTypes";

let supabaseCient: SupabaseClient<Database>;

function initClient() {
  if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
    throw new Error("supabase url missing");
  }

  if (!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("supabase anon key missing");
  }

  supabaseCient = createClient<Database>(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
      auth: {
        persistSession: false,
      },
    }
  );
}

export function getAliciapCeramicsSubaseClient() {
  if (!supabaseCient) {
    initClient();
  }

  return supabaseCient;
}
