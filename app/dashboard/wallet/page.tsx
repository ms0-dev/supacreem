import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/supabase/server";
import { CreemPortal } from "@creem_io/nextjs";
import { redirect } from "next/navigation";

export default async function CreditsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const [{ data: userRow }, { data: subscription }, { data: balance }] =
    await Promise.all([
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
      supabase
        .from("credit_balances")
        .select("balance")
        .eq("user_id", user.id)
        .single(),
    ]);

  const { data: plan } = subscription?.creem_product_id
    ? await supabase
        .from("credit_plans")
        .select("credits_per_cycle, name")
        .eq("creem_product_id", subscription.creem_product_id)
        .maybeSingle()
    : { data: null };

  const daysRemaining = subscription?.current_period_end
    ? Math.ceil(
        (new Date(subscription.current_period_end).getTime() -
          new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const creditsTotal = plan?.credits_per_cycle ?? 0;
  const creditsUsed = creditsTotal - (balance?.balance ?? 0);
  const usagePercent =
    creditsTotal > 0 ? (creditsUsed / creditsTotal) * 100 : 0;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Wallet</CardTitle>
        <CardDescription>
          {daysRemaining} days remaining in cycle
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Field className="w-full max-w-sm">
          <FieldLabel htmlFor="credits-used">
            <span>Credits Used</span>
            <span className="ml-auto">
              {creditsUsed}/{creditsTotal}
            </span>
          </FieldLabel>
          <Progress value={usagePercent} id="credits-used" />
        </Field>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <CreemPortal
          customerId={userRow?.creem_customer_id ?? ""}
          className="w-full"
        >
          <Button className="w-full">Manage Plan</Button>
        </CreemPortal>
      </CardFooter>
    </Card>
  );
}
