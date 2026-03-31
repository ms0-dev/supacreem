"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tables } from "@/supabase/types";
import { CreemPortal } from "@creem_io/nextjs";
import type { Transaction, TransactionList } from "creem_io";
import { WalletCards } from "lucide-react";
import { useState } from "react";

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-green-100 text-green-700" },
  trialing: { label: "Trialing", color: "bg-blue-100 text-blue-700" },
  past_due: { label: "Past Due", color: "bg-yellow-100 text-yellow-700" },
  paused: { label: "Paused", color: "bg-orange-100 text-orange-700" },
  canceled: { label: "Canceled", color: "bg-red-100 text-red-700" },
  expired: { label: "Expired", color: "bg-gray-100 text-gray-700" },
  scheduled_cancel: {
    label: "Canceling",
    color: "bg-yellow-100 text-yellow-700",
  },
};

export function BillingSection({
  subscription,
  customerId,
  transactions,
}: {
  subscription: Tables<"subscriptions"> | null;
  customerId: string;
  transactions: TransactionList | null;
}) {
  const [canceling, setCanceling] = useState(false);

  const status = subscription?.status ?? "no_subscription";
  const config = statusConfig[status] ?? {
    label: status,
    color: "bg-gray-100 text-gray-700",
  };
  const nextPayment = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString()
    : null;

  const handleCancel = async () => {
    if (
      !confirm(
        "Cancel your subscription? You keep access until the end of your billing period.",
      )
    )
      return;
    setCanceling(true);
    try {
      const res = await fetch("/api/creem/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: subscription?.creem_subscription_id,
        }),
      });
      if (!res.ok) throw new Error();
      alert(
        "Subscription canceled. You keep access until the end of your billing period.",
      );
    } catch {
      alert("Failed to cancel subscription.");
    } finally {
      setCanceling(false);
    }
  };

  console.log(subscription);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-balance">Billing</h1>
      </div>

      {subscription ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <span className="font-semibold text-green-600">⚡</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Status</h3>
                    <Badge className={config.color}>{config.label}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {nextPayment
                      ? `Next payment on ${nextPayment}`
                      : "Billing period ended"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {subscription.cancel_at_period_end ? (
                  <Button variant="outline" disabled>
                    Canceling...
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={canceling}
                  >
                    {canceling ? "Canceling..." : "Cancel Subscription"}
                  </Button>
                )}
                {customerId && (
                  <CreemPortal customerId={customerId}>
                    <Button>Manage Plan</Button>
                  </CreemPortal>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">No active subscription</h3>
                <p className="text-muted-foreground text-sm">
                  Subscribe to access premium features.
                </p>
              </div>
              <Button asChild>
                <a href="/dashboard/plans">View Plans</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Payment method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {customerId ? (
            <CreemPortal customerId={customerId}>
              <Button variant="outline" className="w-full bg-transparent">
                <WalletCards />
                Manage Payment Methods
              </Button>
            </CreemPortal>
          ) : (
            <p className="text-muted-foreground text-sm">
              No payment method on file.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction history</CardTitle>
        </CardHeader>
        <CardContent>
          {!transactions?.items.length ? (
            <p className="text-muted-foreground text-sm">
              No transactions yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="space-y-4">
                  <div className="text-muted-foreground grid grid-cols-5 gap-4 border-b pb-2 text-sm font-medium">
                    <div>TYPE</div>
                    <div>PRODUCT</div>
                    <div>STATUS</div>
                    <div>DATE</div>
                    <div className="text-right">AMOUNT</div>
                  </div>

                  {transactions.items.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="grid grid-cols-5 gap-4 py-2 text-sm"
                    >
                      <div className="font-medium">{transaction.type}</div>
                      <div>{transaction.description}</div>
                      <div>
                        <Badge className={getBadgeColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                      <div>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-right font-medium">
                        $
                        {(
                          (transaction.amountPaid ?? transaction.amount) / 100
                        ).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getBadgeColor(status: Transaction["status"]) {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700";
    case "void":
      return "bg-gray-100 text-gray-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "refunded":
      return "bg-blue-100 text-blue-700";
    case "partialRefund":
      return "bg-purple-100 text-purple-700";
    case "chargedBack":
      return "bg-red-100 text-red-700";
    case "uncollectible":
      return "bg-orange-100 text-orange-700";
    case "declined":
      return "bg-black-100 text-black-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
