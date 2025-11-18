import { NextResponse } from "next/server";
import {
  retrieveStripeSubscription,
  type StripeSubscription,
} from "@/lib/stripeServer";
import { verifyStripeSignature } from "@/lib/stripeWebhook";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

const PREMIUM_PLAN_CODE =
  process.env.STRIPE_PREMIUM_PLAN_CODE ?? "premium-monthly";

export const runtime = "nodejs";

function normalizeStatus(status: string) {
  switch (status) {
    case "trialing":
      return { status: "trialing", tier: "premium" } as const;
    case "active":
      return { status: "active", tier: "premium" } as const;
    case "past_due":
      return { status: "past_due", tier: "free" } as const;
    default:
      return { status: "inactive", tier: "free" } as const;
  }
}

function secondsToIso(value: number | null | undefined) {
  if (!value) {
    return null;
  }
  return new Date(value * 1000).toISOString();
}

function normalizeMetadata(
  ...records: Array<Record<string, string | null | undefined> | undefined>
) {
  const result: Record<string, string> = {};
  for (const record of records) {
    if (!record) continue;

    for (const [key, value] of Object.entries(record)) {
      if (typeof value === "string" && value.length > 0 && result[key] == null) {
        result[key] = value;
      }
    }
  }
  return result;
}

async function persistSubscription(
  subscription: StripeSubscription,
  fallbackMetadata?: Record<string, string>,
) {
  const metadata = normalizeMetadata(subscription.metadata, fallbackMetadata);
  const userId = metadata.supabase_user_id;

  if (!userId) {
    console.warn(
      "Stripe webhook: utilisateur Supabase manquant",
      subscription.id,
    );
    return;
  }

  const planCode = metadata.plan_code ?? PREMIUM_PLAN_CODE;
  const currentPeriodEnd = secondsToIso(subscription.current_period_end);
  const cancelAt = secondsToIso(subscription.cancel_at);
  const { status, tier } = normalizeStatus(subscription.status);
  const supabase = getSupabaseAdminClient();

  const { error: subscriptionError } = await supabase
    .from("subscriptions")
    .upsert(
      {
        profile_id: userId,
        provider: "stripe",
        provider_customer_id: subscription.customer ?? null,
        plan_code: planCode,
        status,
        current_period_end: currentPeriodEnd,
        cancel_at: cancelAt,
        metadata,
      },
      { onConflict: "profile_id,provider,plan_code" },
    );

  if (subscriptionError) {
    console.error("Erreur Supabase subscriptions", subscriptionError);
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      subscription_status: status,
      subscription_tier: tier === "premium" ? "premium" : "free",
      expires_at: currentPeriodEnd,
    })
    .eq("id", userId);

  if (profileError) {
    console.error("Erreur Supabase profiles", profileError);
  }
}

async function syncSubscriptionById(
  subscriptionId: string,
  fallbackMetadata?: Record<string, string>,
) {
  try {
    const subscription = await retrieveStripeSubscription(subscriptionId);
    await persistSubscription(subscription, fallbackMetadata);
  } catch (error) {
    console.error(
      "Impossible de synchroniser l'abonnement Stripe",
      error,
    );
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook Stripe non configuré" },
      { status: 500 },
    );
  }

  // Récupération du payload brut (obligatoire pour Stripe)
  const payload = await request.text();

  // Utilisation directe des headers de la requête
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Signature Stripe manquante" },
      { status: 400 },
    );
  }

  if (!verifyStripeSignature(payload, signature, webhookSecret)) {
    return NextResponse.json(
      { error: "Signature Stripe invalide" },
      { status: 400 },
    );
  }

  const event = JSON.parse(payload) as {
    type: string;
    data: { object: Record<string, any> };
  };

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkout = event.data.object;
        const subscriptionId = checkout.subscription as string | undefined;
        if (subscriptionId) {
          await syncSubscriptionById(subscriptionId, checkout.metadata);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await persistSubscription(event.data.object as StripeSubscription);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        if (typeof invoice.subscription === "string") {
          await syncSubscriptionById(invoice.subscription);
        }
        break;
      }
      default:
        console.log(`Stripe event ignoré: ${event.type}`);
    }
  } catch (error) {
    console.error("Erreur lors du traitement du webhook Stripe", error);
    return NextResponse.json(
      { error: "Webhook Stripe en erreur" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
