"use client";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { env } from "@/lib/env";
import { createClient } from "@/supabase/client";
import { CreemCheckout } from "@creem_io/nextjs";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

const plans = [
  {
    id: env.NEXT_PUBLIC_CREEM_STARTER_PLAN_ID,
    title: "Starter",
    description: "For hobby projects and personal websites",
    price: 12,
    features: ["Basic models", "500 credits", "Regular updates"],
  },
  {
    id: env.NEXT_PUBLIC_CREEM_PRO_PLAN_ID,
    title: "Professional",
    description: "For freelancers and individual developers",
    price: 24,
    features: [
      "Everything in Starter plan",
      "Advanced models",
      "2000 credits",
      "Email support",
    ],
  },
  {
    id: env.NEXT_PUBLIC_CREEM_ENTERPRISE_PLAN_ID,
    title: "Enterprise",
    description: "For growing teams and businesses",
    price: 99,
    features: [
      "Everything in Pro plan",
      "Unlimited credits",
      "5 team seats included",
      "Team management dashboard",
      "Advanced analytics",
      "Priority email support",
    ],
  },
];

export function PricingSection() {
  const { email, name, uid } = useCurrentUser();
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getCurrentPlan() {
      if (!uid) return;
      const supabase = createClient();
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", uid)
        .in("status", ["active", "trialing"])
        .maybeSingle();
      if (error) {
        console.error(error);
        return;
      }
      console.log("data", data);
      setCurrentPlan(data?.creem_product_id || null);
      setLoading(false);
    }
    getCurrentPlan();
  }, [uid]);

  return (
    <section className="my-auto">
      <div className="mx-auto w-full max-w-2xl lg:max-w-7xl">
        <div className="mx-auto max-w-2xl text-center [&>p]:mx-auto [&>p]:max-w-xl">
          <h2 className="text-xl/tight lg:text-4xl/tight font-bold tracking-tight">
            Choose your plan
          </h2>
          <p className="text-muted-foreground mt-4 lg:text-lg/8 text-sm">
            Choose from a variety of completely real supacreem products
          </p>
        </div>
        <div className="mx-auto mt-12 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-card rounded-2xl border shadow-xs">
              <div className="p-8 sm:p-12 h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="space-y-2">
                      <h3 className="text-xl/snug font-semibold tracking-tight">
                        {plan.title}
                      </h3>
                      <p className="text-muted-foreground text-sm/6">
                        {plan.description}
                      </p>
                    </div>
                    <div className="mt-8">
                      <span className="text-4xl font-bold sm:text-5xl">
                        ${plan.price}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        / month
                      </span>
                    </div>
                    <ul className="mt-8 space-y-4 text-sm">
                      {plan.features.map((feature, i) => (
                        <li
                          key={i}
                          className="text-muted-foreground flex items-center"
                        >
                          <Check className="mr-4 h-4 w-4 text-green-700" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {loading ? (
                    <Button size="lg" className="w-full mt-8" disabled>
                      Loading...
                    </Button>
                  ) : currentPlan !== plan.id ? (
                    <CreemCheckout
                      productId={plan.id}
                      successUrl="/thank-you"
                      customer={{ email: email || "", name: name || "" }}
                      metadata={{ source: "web" }}
                      referenceId={uid || ""}
                      key={`checkout-${plan.id}`}
                    >
                      <Button size="lg" className="w-full mt-8">
                        Purchase {plan.title}
                      </Button>
                    </CreemCheckout>
                  ) : (
                    <Button size="lg" className="w-full mt-8" disabled>
                      Current Plan
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
