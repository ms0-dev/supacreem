import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { creem } from "@/lib/creem";
import { createClient } from "@/supabase/server";
import { CreemPortal } from "@creem_io/nextjs";
import Link from "next/link";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/sign-in");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", data.claims.sub)
    .single();

  if (!subscription) {
    redirect("/dashboard/plans");
  }

  const { data: customer } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.claims.sub)
    .single();

  let status: string;
  try {
    const result = await creem.subscriptions.get({
      subscriptionId: subscription.creem_subscription_id,
    });
    status = result.status;
  } catch {
    // subscription does not exist
    status = "inactive";
  }

  if (status !== "active") {
    redirect("/dashboard/plans");
  }

  return (
    <div className="flex h-svh w-full items-center justify-center gap-2">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <p>
            Subscription:{" "}
            <span>{status === "active" ? "Active" : "Inactive"}</span>
          </p>
          <CreemPortal customerId={customer?.creem_customer_id ?? ""}>
            <Button>Manage</Button>
          </CreemPortal>
        </div>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
