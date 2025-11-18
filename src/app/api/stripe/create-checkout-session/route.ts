import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import Stripe from "stripe";

export const runtime = "nodejs";

// Plan par défaut (tu adapteras quand ta logique d'abonnement sera en place)
const DEFAULT_PLAN_CODE = "premium";

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
    mode: "subscription", // ou "payment" selon ton modèle
    customer_email: args.email,
    line_items: [
      {
        price: args.priceId,
        quantity: 1,
      },
    ],
    success_url: args.successUrl,
    cancel_url: args.cancelUrl,
    metadata: {
      user_id: args.userId,
      plan_code: args.planCode,
    },
  });

  return { url: session.url };
}

export async function POST(request: Request) {
  // Cast explicite pour contourner le type 'unknown' retourné par createRouteHandlerClient
  const supabase = createRouteHandlerClient({ cookies }) as any;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Erreur Supabase auth.getUser :", authError);
  }

  if (!user) {
    return NextResponse.json(
      { error: "Authentification requise." },
      { status: 401 },
    );
  }

  const priceId = process.env.STRIPE_PRICE_PREMIUM_ID;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!priceId || !secretKey) {
    return NextResponse.json(
      {
        error:
          "Stripe n'est pas configuré (STRIPE_PRICE_PREMIUM_ID / STRIPE_SECRET_KEY).",
      },
      { status: 500 },
    );
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const successUrl =
    `${origin}/subscribe?status=success&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/subscribe?status=cancel`;

  try {
    const session = await createStripeCheckoutSession({
      userId: user.id,
      email: user.email ?? undefined,
      successUrl,
      cancelUrl,
      priceId,
      planCode: DEFAULT_PLAN_CODE,
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
