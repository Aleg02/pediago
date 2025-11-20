// src/app/api/stripe/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Optionnel, juste pour tracer côté Stripe
const DEFAULT_PLAN_CODE_MONTHLY =
  process.env.STRIPE_PREMIUM_PLAN_CODE ?? "premium-monthly";
const DEFAULT_PLAN_CODE_YEARLY = "premium-yearly";

type BillingPeriod = "monthly" | "yearly";

type CreateStripeCheckoutSessionArgs = {
  userId: string;
  email?: string;
  successUrl: string;
  cancelUrl: string;
  priceId: string;
  planCode: string;
};

async function createStripeCheckoutSession(
  args: CreateStripeCheckoutSessionArgs,
): Promise<{ url: string | null }> {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY n'est pas configurée dans l'environnement.",
    );
  }

  const stripe = new Stripe(stripeSecretKey);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: args.email,
    line_items: [
      {
        price: args.priceId,
        quantity: 1,
      },
    ],
    success_url: args.successUrl,
    cancel_url: args.cancelUrl,

    // *************** CORRECTION ***************
    metadata: {
      supabase_user_id: args.userId, // <<< LA CLÉ ATTENDUE PAR LE WEBHOOK
      plan_code: args.planCode,
    },
    // ******************************************
  });

  return { url: session.url };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Erreur Supabase auth.getUser :", authError);
      return NextResponse.json(
        { error: "Erreur d'authentification." },
        { status: 401 },
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "Authentification requise." },
        { status: 401 },
      );
    }

    let billingPeriod: BillingPeriod = "monthly";

    if (request.headers.get("content-type")?.includes("application/json")) {
      const body = (await request.json().catch(() => null)) as
        | { billingPeriod?: BillingPeriod; plan?: BillingPeriod }
        | null;
      const requested = body?.billingPeriod ?? body?.plan;
      if (requested === "yearly" || requested === "monthly") {
        billingPeriod = requested;
      }
    }

    const monthlyPriceId = process.env.STRIPE_PRICE_PREMIUM_MONTHLY_ID;
    const yearlyPriceId = process.env.STRIPE_PRICE_PREMIUM_YEARLY_ID;

    const priceId =
      billingPeriod === "yearly" ? yearlyPriceId : monthlyPriceId;

    if (!priceId) {
      return NextResponse.json(
        {
          error:
            "Stripe n'est pas configuré correctement (STRIPE_PRICE_PREMIUM_MONTHLY_ID / STRIPE_PRICE_PREMIUM_YEARLY_ID).",
        },
        { status: 500 },
      );
    }

    const planCode =
      billingPeriod === "yearly"
        ? DEFAULT_PLAN_CODE_YEARLY
        : DEFAULT_PLAN_CODE_MONTHLY;

    const origin = request.nextUrl.origin;
    const successUrl =
      `${origin}/subscribe?status=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/subscribe?status=cancel`;

    const session = await createStripeCheckoutSession({
      userId: user.id,
      email: user.email ?? undefined,
      successUrl,
      cancelUrl,
      priceId,
      planCode,
    });

    if (!session.url) {
      throw new Error("Stripe a renvoyé une session sans URL.");
    }

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Erreur Stripe checkout", error);
    return NextResponse.json(
      { error: "Impossible de créer la session de paiement." },
      { status: 500 },
    );
  }
}
