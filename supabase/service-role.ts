import { env } from "@/lib/env";
import { Database } from "@/supabase/types";
import { createClient } from "@supabase/supabase-js";

export function createServiceRoleClient() {
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );
}
