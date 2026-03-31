import { env } from "@/lib/env";
import { createServiceRoleClient } from "@/supabase/service-role";
import { Webhook } from "@creem_io/nextjs";

export const POST = Webhook({
  webhookSecret: env.CREEM_WEBHOOK_SECRET,
  onCheckoutCompleted: async ({
    customer,
    subscription,
    product,
    metadata,
    webhookEventType,
    webhookId,
  }) => {
    const supabase = createServiceRoleClient();
    const userId = metadata?.referenceId as string;

    if (!userId || !webhookId) return;

    const { data: existing } = await supabase
      .from("webhook_events")
      .select("id, processed")
      .eq("id", webhookId)
      .single();
    if (existing?.processed) return;

    // 1. Link Creem customer ID to user
    if (customer) {
      const { error } = await supabase
        .from("users")
        .update({ creem_customer_id: customer.id })
        .eq("id", userId);
      if (error) {
        console.error("[webhook] onCheckoutCompleted: failed to update user", {
          webhookId,
          userId,
          customerId: customer.id,
          error,
        });
      }
    }

    // 2. Upsert subscription atomically
    if (subscription) {
      const { error } = await supabase.rpc("upsert_subscription", {
        p_user_id: userId,
        p_creem_subscription_id: subscription.id,
        p_creem_product_id: product?.id ?? subscription.product,
        p_status: subscription.status,
        p_current_period_start:
          subscription.current_period_start_date as unknown as string,
        p_current_period_end:
          subscription.current_period_end_date as unknown as string,
        p_cancel_at_period_end: false,
        p_canceled_at: (subscription.canceled_at as string | null) ?? undefined,
      });
      if (error) {
        console.error(
          "[webhook] onCheckoutCompleted: upsert_subscription failed",
          {
            webhookId,
            userId,
            subscriptionId: subscription.id,
            error,
          },
        );
        return;
      }
    }

    await supabase.from("webhook_events").upsert(
      {
        id: webhookId,
        event_type: webhookEventType,
        payload: null,
        processed: true,
        processed_at: new Date().toISOString(),
      },
      { onConflict: "id", ignoreDuplicates: true },
    );
  },
  onSubscriptionActive: async (data) => {
    await handleSubscriptionEvent(data, "subscription.active");
  },
  onSubscriptionTrialing: async (data) => {
    await handleSubscriptionEvent(data, "subscription.trialing");
  },
  onSubscriptionPaid: async (data) => {
    await handleSubscriptionEvent(data, "subscription.paid");
    const userId = data.metadata?.referenceId as string;
    if (userId) {
      await grantCreditsOnRenewal(userId, data.product.id);
    }
  },
  onSubscriptionPastDue: async (data) => {
    await handleSubscriptionEvent(data, "subscription.past_due");
  },
  onSubscriptionUpdate: async (data) => {
    await handleSubscriptionEvent(data, "subscription.update");
  },
  onSubscriptionCanceled: async (data) => {
    await handleSubscriptionEvent(data, "subscription.canceled");
  },
  onSubscriptionExpired: async (data) => {
    await handleSubscriptionEvent(data, "subscription.expired");
  },
  onSubscriptionPaused: async (data) => {
    await handleSubscriptionEvent(data, "subscription.paused");
  },
  onSubscriptionUnpaid: async (data) => {
    await handleSubscriptionEvent(data, "subscription.unpaid");
  },
});

async function handleSubscriptionEvent(
  data: {
    webhookId: string;
    webhookEventType: string;
    id: string;
    status: string;
    product: { id: string };
    current_period_start_date: string | Date;
    current_period_end_date: string | Date;
    canceled_at: string | Date | null;
    metadata?: Record<string, unknown>;
  },
  eventType: string,
) {
  const supabase = createServiceRoleClient();
  const userId = data.metadata?.referenceId as string;
  if (!data.webhookId || !userId) return;
  const { data: existing } = await supabase
    .from("webhook_events")
    .select("id, processed")
    .eq("id", data.webhookId)
    .single();
  if (existing?.processed) return;
  const { error } = await supabase.rpc("upsert_subscription", {
    p_user_id: userId,
    p_creem_subscription_id: data.id,
    p_creem_product_id: data.product.id,
    p_status: data.status,
    p_current_period_start: data.current_period_start_date as string,
    p_current_period_end: data.current_period_end_date as string,
    p_cancel_at_period_end: false,
    p_canceled_at: (data.canceled_at as string | null) ?? undefined,
  });
  if (error) {
    console.error(
      "[webhook] handleSubscriptionEvent: upsert_subscription failed",
      {
        webhookId: data.webhookId,
        subscriptionId: data.id,
        error,
      },
    );
    return;
  }
  await supabase.from("webhook_events").upsert(
    {
      id: data.webhookId,
      event_type: eventType,
      payload: null,
      processed: true,
      processed_at: new Date().toISOString(),
    },
    { onConflict: "id", ignoreDuplicates: true },
  );
}

async function grantCreditsOnRenewal(userId: string, productId: string) {
  const supabase = createServiceRoleClient();

  const { data: plan, error: planError } = await supabase
    .from("credit_plans")
    .select("credits_per_cycle")
    .eq("creem_product_id", productId)
    .single();

  if (planError) {
    console.error("[webhook] grantCreditsOnRenewal: failed to fetch plan", {
      productId,
      error: planError,
    });
    return;
  }

  const credits = plan?.credits_per_cycle ?? 0;
  if (!credits) return;

  const { error: rpcError } = await supabase.rpc("grant_credits", {
    p_user_id: userId,
    p_amount: credits,
    p_type: "subscription_grant",
    p_reference: productId,
    p_description: "Credits renewal",
  });

  if (rpcError) {
    console.error("[webhook] grantCreditsOnRenewal: grant_credits failed", {
      userId,
      productId,
      credits,
      error: rpcError,
    });
  }
}
