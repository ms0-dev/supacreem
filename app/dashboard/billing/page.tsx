import { BillingSection } from "@/components/billing-section";
import { creem } from "@/lib/creem";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const [{ data: userRow }, { data: subscription }] = await Promise.all([
    supabase
      .from("users")
      .select("creem_customer_id")
      .eq("id", user.id)
      .single(),
    supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .in("status", ["active", "trialing"])
      .maybeSingle(),
  ]);

  const transactions = await creem.transactions.list().catch(() => null);

  return (
    <BillingSection
      subscription={subscription}
      customerId={userRow?.creem_customer_id ?? ""}
      transactions={transactions}
    />
  );
}
