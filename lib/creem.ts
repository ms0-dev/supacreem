import { createCreem } from "creem_io";
import { env } from "./env";

export const creem = createCreem({
  apiKey: env.CREEM_API_KEY,
  webhookSecret: env.CREEM_WEBHOOK_SECRET,
  testMode: env.CREEM_TEST_MODE, // set to true for test mode
});
