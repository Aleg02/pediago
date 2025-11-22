import { NextRequest, NextResponse } from "next/server";

import { createStripeBillingPortalSession } from "@/lib/stripeServer";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export const runtime = "nodejs";

type SubscriptionRow = Pick<
  Database["public"]["Tables"]["subscriptions"]["Row"],
  "provider" | "provider_customer_id"
>;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Erreur Supabase auth.getUser :", authError);
      return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
    }

    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("provider, provider_customer_id")
      .eq("profile_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle<SubscriptionRow>();

    if (subscriptionError) {
      console.error("Erreur Supabase subscriptions", subscriptionError);
      return NextResponse.json({ error: "Impossible de récupérer l'abonnement." }, { status: 500 });
    }

    if (!subscription || subscription.provider !== "stripe") {
      return NextResponse.json(
        { error: "Aucun abonnement Stripe actif n'est associé à ce compte." },
        { status: 400 },
      );
    }

    if (!subscription.provider_customer_id) {
      return NextResponse.json(
        { error: "Aucun client Stripe n'est associé à ce compte." },
        { status: 400 },
      );
    }

    const origin = request.nextUrl.origin;
    const returnUrl = `${origin}/mon-compte?portal=return`;

    const portalSession = await createStripeBillingPortalSession({
      customerId: subscription.provider_customer_id,
      returnUrl,
    });

    if (!portalSession.url) {
      throw new Error("Stripe a renvoyé une session de portail sans URL.");
    }

    return NextResponse.json({ portalUrl: portalSession.url });
  } catch (error) {
    console.error("Erreur Stripe portal", error);
    return NextResponse.json(
      {
        error:
          "Impossible d'ouvrir le portail de facturation Stripe. Réessayez ou contactez le support.",
      },
      { status: 500 },
    );
  }
}