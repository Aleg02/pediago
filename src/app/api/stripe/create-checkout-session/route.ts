import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import { createStripeCheckoutSession } from "@/lib/stripeServer";
import type { Database } from "@/types/database";

export const runtime = "nodejs";

type PlanId = "monthly" | "yearly";

type CreateCheckoutBody = {
  plan?: PlanId;
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const PLAN_CONFIG: Record<
  PlanId,
  { priceId: string | undefined; planCode: string }
> = {
  monthly: {
    priceId: process.env.STRIPE_PRICE_PREMIUM_MONTHLY_ID,
    planCode: "premium-monthly",
  },
  yearly: {
    priceId: process.env.STRIPE_PRICE_PREMIUM_YEARLY_ID,
    planCode: "premium-yearly",
  },
};

export async function POST(request: Request) {
  // 1. Auth utilisateur via Supabase
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  }) as any;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Erreur Supabase auth.getUser :", authError);
    return NextResponse.json(
      { error: "Utilisateur non authentifié" },
      { status: 401 },
    );
  }

  // 2. Lecture du body et choix du plan
  let body: CreateCheckoutBody = {};
  try {
    body = (await request.json()) as CreateCheckoutBody;
  } catch {
    // body vide → on laissera le plan par défaut
  }

  const requestedPlan: PlanId =
    body.plan === "yearly" ? "yearly" : "monthly";

  const config = PLAN_CONFIG[requestedPlan];

  if (!config.priceId) {
    console.error(
      "Price Stripe manquant pour le plan",
      requestedPlan,
      config,
    );
    return NextResponse.json(
      { error: "Configuration Stripe incomplète pour ce plan." },
      { status: 500 },
    );
  }

  // 3. Création de la session Checkout Stripe
  try {
    const successUrl = `${SITE_URL}/subscribe?status=success&plan=${requestedPlan}`;
    const cancelUrl = `${SITE_URL}/subscribe?status=cancel&plan=${requestedPlan}`;

    const session = await createStripeCheckoutSession({
      userId: user.id,
      email: user.email ?? undefined,
      successUrl,
      cancelUrl,
      priceId: config.priceId,
      planCode: config.planCode,
    });

    if (!session.url) {
      console.error("Stripe session créée sans URL", session);
      return NextResponse.json(
        { error: "URL de session Stripe absente." },
        { status: 500 },
      );
    }

    // IMPORTANT : le front attend data.checkoutUrl
    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error(
      "Erreur lors de la création de la session Stripe :",
      error,
    );
    return NextResponse.json(
      { error: "Impossible de créer la session Stripe." },
      { status: 500 },
    );
  }
}
