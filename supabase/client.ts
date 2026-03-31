import { env } from "@/lib/env";
import { Database } from "@/supabase/types";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
