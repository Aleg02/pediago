import type { Metadata } from "next";
import Link from "next/link";

import { PlanCheckoutButton } from "@/components/PlanCheckoutButton";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export const metadata: Metadata = {
  title: "Mon compte / Abonnement",
  description: "Gérez votre abonnement PediaGo+ et vos accès premium",
};

type AccountPageProps = {
  searchParams?:
    | Promise<{
        reason?: string;
        slug?: string;
      }>
    | {
        reason?: string;
        slug?: string;
      };
};

const statusLabels: Record<string, string> = {
  active: "Actif",
  trialing: "Essai",
  inactive: "Inactif",
  past_due: "À régulariser",
};

type ProfileRow = Pick<Database["public"]["Tables"]["profiles"]["Row"], "subscription_status" | "subscription_tier" | "expires_at">;
type UserEntitlementsRow = Pick<
  Database["public"]["Views"]["user_entitlements"]["Row"],
  "can_view_premium" | "subscription_status" | "subscription_tier" | "expires_at"
>;
type SubscriptionRow = Pick<Database["public"]["Tables"]["subscriptions"]["Row"], "plan_code" | "status">;

function formatStatus(status?: string | null) {
  if (!status) return "Indisponible";
  return statusLabels[status] ?? status;
}

function formatDate(value?: string | null) {
  if (!value) return "Non renseigné";
  return new Date(value).toLocaleDateString("fr-FR");
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const resolvedParams = await Promise.resolve(searchParams ?? {});
  const reason = resolvedParams?.reason;
  const redirectedSlug = resolvedParams?.slug;
  const showPremiumNotice = reason === "premium";

  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  let profile: ProfileRow | null = null;
  let entitlements: UserEntitlementsRow | null = null;
  let subscription: SubscriptionRow | null = null;

  if (userId) {
    const [profileResult, entitlementsResult, subscriptionResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("subscription_status, subscription_tier, expires_at")
        .eq("id", userId)
        .maybeSingle<ProfileRow>(),
      supabase
        .from("user_entitlements")
        .select("can_view_premium, subscription_status, subscription_tier, expires_at")
        .eq("user_id", userId)
        .maybeSingle<UserEntitlementsRow>(),
      supabase
        .from("subscriptions")
        .select("plan_code, status")
        .eq("profile_id", userId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle<SubscriptionRow>(),
    ]);

    profile = profileResult.data ?? null;
    entitlements = entitlementsResult.data ?? null;
    subscription = subscriptionResult.data ?? null;
  }

  const hasSession = Boolean(session);

  const canViewPremium = Boolean(entitlements?.can_view_premium);
  const subscriptionStatus = entitlements?.subscription_status ?? profile?.subscription_status;
  const subscriptionTier = entitlements?.subscription_tier ?? profile?.subscription_tier ?? "free";
  const expiresAt = entitlements?.expires_at ?? profile?.expires_at ?? null;
  const planCode = subscription?.plan_code ?? null;
  const isMonthlyPlan = Boolean(planCode && planCode.includes("monthly"));

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="h-1 w-full bg-gradient-to-r from-[#8b5cf6] via-[#3b82f6] to-[#22c55e]" />
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <Link href="/" className="text-sm font-medium text-[#2563eb] underline">
          ← Retour à l'accueil
        </Link>
        <header className="mt-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">PediaGo</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mon compte / Abonnement</h1>
          <p className="text-base text-slate-600">
            Centralisation des informations liées à l'abonnement professionnel et aux licences.
          </p>
        </header>

        {showPremiumNotice && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-900">
            <p className="font-semibold">Accès réservé aux membres Premium.</p>
            <p className="mt-1">
              {canViewPremium
                ? "Votre abonnement est actif. Vous pouvez rouvrir la fiche demandée."
                : redirectedSlug
                  ? `Pour consulter la fiche « ${redirectedSlug} », connectez-vous avec un compte abonné ou souscrivez à PediaGo+.`
                  : "Connectez-vous avec un compte abonné ou souscrivez à PediaGo+ pour débloquer les fiches premium."}
            </p>
          </div>
        )}

        <section className="mt-8 space-y-4 rounded-3xl border border-slate-200 bg-white px-5 py-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Statut</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{formatStatus(subscriptionStatus)}</p>
              <p className="text-sm text-slate-600">Formule {subscriptionTier}</p>
            </div>
            {hasSession && (
              <div className="rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700">
                {userEmail ?? "Compte connecté"}
              </div>
            )}
          </div>

          {!hasSession && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <p>Connectez-vous pour consulter vos informations d'abonnement.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/login?redirect=/mon-compte"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-slate-800"
                >
                  Se connecter
                </Link>
                <Link
                  href="/subscribe"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-slate-400"
                >
                  Découvrir PediaGo+
                </Link>
              </div>
            </div>
          )}

          {hasSession && (
            <div className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm text-slate-700">
              <div className="flex items-start justify-between">
                <p className="font-semibold text-slate-900">Renouvellement</p>
                <p>{formatDate(expiresAt)}</p>
              </div>
              <div className="flex items-start justify-between">
                <p className="font-semibold text-slate-900">Plan Stripe</p>
                <p>{planCode ?? "Non renseigné"}</p>
              </div>
              <div className="flex items-start justify-between">
                <p className="font-semibold text-slate-900">Droits Premium</p>
                <p>{canViewPremium ? "Actifs" : "Non actifs"}</p>
              </div>
            </div>
          )}

          {hasSession && (
            <div className="flex flex-wrap gap-2">
              {!canViewPremium && (
                <Link
                  href="/subscribe"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-slate-800"
                >
                  Passer à PediaGo+ Premium
                </Link>
              )}

              {canViewPremium && isMonthlyPlan && (
                <PlanCheckoutButton
                  plan="yearly"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-70"
                  label="Basculer sur l'offre annuelle"
                />
              )}

              <Link
                href="mailto:contact@pediago.app"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-slate-400"
              >
                Besoin d'aide ?
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
