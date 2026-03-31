import { env } from "@/lib/env";
import { Portal } from "@creem_io/nextjs";

export const GET = Portal({
  apiKey: env.CREEM_API_KEY,
  testMode: env.CREEM_TEST_MODE,
});
