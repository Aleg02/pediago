import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database";
import { createStripeCheckoutSession } from "@/lib/stripeServer";

const DEFAULT_PLAN_CODE = process.env.STRIPE_PREMIUM_PLAN_CODE ?? "premium-monthly";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const priceId = process.env.STRIPE_PRICE_PREMIUM_ID;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!priceId || !secretKey) {
    return NextResponse.json({ error: "Stripe n'est pas configuré." }, { status: 500 });
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const successUrl = `${origin}/subscribe?status=success&session_id={CHECKOUT_SESSION_ID}`;
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
    return NextResponse.json({ error: "Impossible de créer la session de paiement." }, { status: 500 });
  }
}
