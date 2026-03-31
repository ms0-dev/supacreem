import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    CREEM_API_KEY: z.string().min(1).startsWith("creem_"),
    CREEM_WEBHOOK_SECRET: z.string().min(1).startsWith("whsec_"),
    CREEM_TEST_MODE: z
      .string()
      .toLowerCase()
      .refine((s) => s === "true" || s === "false", {
        message:
          "Must be true or false. Test in testMode before switching the adapter to production.",
      })
      .transform((s) => s === "true"),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CREEM_SUCCESS_URL: z.string().min(1).startsWith("/"),
    // products
    NEXT_PUBLIC_CREEM_STARTER_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_CREEM_PRO_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_CREEM_ENTERPRISE_PLAN_ID: z.string().min(1),
  },
  // you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CREEM_SUCCESS_URL: process.env.NEXT_PUBLIC_CREEM_SUCCESS_URL,
    // products
    NEXT_PUBLIC_CREEM_STARTER_PLAN_ID:
      process.env.NEXT_PUBLIC_CREEM_STARTER_PLAN_ID,
    NEXT_PUBLIC_CREEM_PRO_PLAN_ID: process.env.NEXT_PUBLIC_CREEM_PRO_PLAN_ID,
    NEXT_PUBLIC_CREEM_ENTERPRISE_PLAN_ID:
      process.env.NEXT_PUBLIC_CREEM_ENTERPRISE_PLAN_ID,
  },
});
