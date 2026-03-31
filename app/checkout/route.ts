import { env } from "@/lib/env";
import { Checkout } from "@creem_io/nextjs";

export const GET = Checkout({
  apiKey: env.CREEM_API_KEY,
  testMode: env.CREEM_TEST_MODE, // flip to false in production
  defaultSuccessUrl: "/thank-you",
});
