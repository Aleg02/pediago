"use client";

import { useEffect, useMemo, useState } from "react";

// --- MOCKS (Pour l'affichage dans cet éditeur) ---
// Remplacez ces blocs par vos imports réels :
// import { useSession } from "@supabase/auth-helpers-react";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { useUserEntitlements } from "@/hooks/useUserEntitlements";

const Link = ({ href, children, className, ...props }: any) => (
  <a href={href} className={className} {...props}>
    {children}
  </a>
);
const useSession = () => ({ user: { id: "123" } }); // Simule un user connecté
const useSearchParams = () => ({ get: (key: string) => null });
const useUserEntitlements = () => ({
  canViewPremium: false,
  subscriptionStatus: null,
  loading: false,
  refreshEntitlements: () => {},
});
// --- FIN MOCKS ---

type PlanId = "monthly" | "yearly";

const PREMIUM_PLANS: {
  id: PlanId;
  name: string;
  badge: string;
  price: string;
  priceDetail: string;
}[] = [
  {
    id: "monthly",
    name: "Premium mensuel",
    badge: "Le plus flexible",
    price: "4,90 € TTC / mois",
    priceDetail: "Sans engagement, résilier à tout moment.",
  },
  {
    id: "yearly",
    name: "Premium annuel",
    badge: "Le plus économique",
    price: "29,90 € TTC / an",
    priceDetail: "Soit ~2,49 € TTC / mois, payé en une fois.",
  },
];

const PREMIUM_PERKS = [
  "Accès illimité à tous les protocoles",
  "Calculs automatiques poids/âge pour limiter les erreurs de posologie",
  "Accès anticipé aux nouvelles fiches validées par l’équipe médicale",
  "Export PDF des protocoles pour archivage ou partage sécurisé",
  "Assistant IA à venir (Aide au diagnostique, recherche avancée)",
];

export default function SubscribePage() {
  const session = useSession();
  const searchParams = useSearchParams();
  const { canViewPremium, subscriptionStatus, loading, refreshEntitlements } =
    useUserEntitlements();

  const [creatingCheckout, setCreatingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusParam = searchParams.get("status");
  const reason = searchParams.get("reason");
  const blockedSlug = searchParams.get("slug");
  const successMessage = statusParam === "success";
  const cancelMessage = statusParam === "cancel";

  useEffect(() => {
    if (successMessage) {
      refreshEntitlements();
    }
  }, [successMessage, refreshEntitlements]);

  const baseCtaLabel = useMemo(() => {
    if (!session) {
      return "Connectez-vous pour souscrire";
    }
    if (canViewPremium) {
      return "Vous êtes déjà Premium";
    }
    if (creatingCheckout) {
      return "Redirection vers Stripe...";
    }
    return null; // on spécialise ensuite par formule
  }, [session, canViewPremium, creatingCheckout]);

  const getPlanCtaLabel = (planId: PlanId): string => {
    if (baseCtaLabel) return baseCtaLabel;
    return planId === "monthly"
      ? "Choisir l’abonnement mensuel"
      : "Choisir l’abonnement annuel";
  };

  const handleCheckout = async (plan: PlanId) => {
    if (!session) {
      // Pas connecté : on ne lance pas Stripe
      return;
    }

    setError(null);
    setCreatingCheckout(true);

    try {
      // Simulation pour la preview
      console.log("Checkout lancé pour", plan);
      setTimeout(() => setCreatingCheckout(false), 2000);
      
      /* Code réel conservé :
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billingPeriod: plan, plan }), // "monthly" ou "yearly"
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Impossible de créer la session Stripe.");
      }

      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
        return;
      }

      throw new Error("Réponse Stripe inattendue.");
      */
    } catch (checkoutError) {
      console.error(checkoutError);
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Erreur inconnue."
      );
      setCreatingCheckout(false);
    }
  };

  const showCheckoutButtons = Boolean(session) && !canViewPremium;

  const loginHref = "/login?redirect=/subscribe";

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-[#8b5cf6] via-[#3b82f6] to-[#22c55e]" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-12">
        <Link
          href="/"
          className="text-sm font-medium text-[#2563eb] underline"
        >
          ← Retour à l’accueil
        </Link>

        <header className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Abonnement
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Passer en Premium
          </h1>
          <p className="text-base text-slate-600">
            Débloquez l’ensemble des fiches critiques PediaGo+ et laissez
            l’application calculer les posologies pour vous, avec des outils
            avancés adaptés à l’urgence pédiatrique.
          </p>
        </header>

        {(successMessage || cancelMessage) && (
          <div
            className={`rounded-2xl border px-5 py-4 text-sm ${
              successMessage
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {successMessage
              ? "Paiement confirmé par Stripe. Votre accès sera rafraîchi automatiquement sous quelques secondes."
              : "Retour Stripe annulé. Vous pouvez relancer la souscription quand vous le souhaitez."}
          </div>
        )}

        {!session && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Compte requis</p>
            <p className="mt-1">
              Créez un compte ou connectez-vous avant de lancer le paiement
              Stripe afin de rattacher l’abonnement à votre profil.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
              <Link
                className="rounded-full border border-slate-200 px-4 py-2"
                href="/login"
              >
                Se connecter / créer un compte
              </Link>
            </div>
          </div>
        )}

        {reason === "premium" && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            <p className="font-semibold">Fiche réservée aux abonnés</p>
            <p className="mt-1">
              {blockedSlug
                ? `La fiche « ${blockedSlug} » est incluse dans la formule Premium.`
                : "La ressource demandée fait partie des contenus Premium."}
            </p>
          </div>
        )}

        {/* Cartes d’abonnement */}
        <section className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 shadow-inner shadow-slate-200/50">
          {/* Bandeau Offre de lancement */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-emerald-600 px-10 py-2.5 text-sm md:text-base font-semibold uppercase tracking-[0.32em] text-white shadow-lg">
              Offre de lancement
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PREMIUM_PLANS.map((plan) => {
              const isMonthly = plan.id === "monthly";
              const cardHoverShadow = isMonthly
                ? "hover:shadow-[0_0_0_3px_rgba(16,185,129,0.35)] hover:border-emerald-400"
                : "hover:shadow-[0_0_0_3px_rgba(37,99,235,0.35)] hover:border-[#2563eb]";
              const cardHoverBg = isMonthly
                ? "hover:bg-emerald-50/60"
                : "hover:bg-blue-50/50";

              return (
                <div
                  key={plan.id}
                  className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 ${cardHoverShadow} ${cardHoverBg}`}
                >
                  {/* CORRECTION ICI : 
                      Remplacement de la logique de padding (px-8) par une largeur fixe (w-[170px]) et text-center
                      Ajustement du top/right pour bien caler le bandeau dans le coin
                  */}
                  {isMonthly ? (
                    <div className="pointer-events-none absolute -right-10 top-6 w-[170px] rotate-45 bg-emerald-500 py-1 text-center text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-white shadow-md">
                      1er mois offert
                    </div>
                  ) : (
                    <div className="pointer-events-none absolute -right-10 top-6 w-[170px] rotate-45 bg-emerald-500 py-1 text-center text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-white shadow-md">
                      Promo - 33,44 %
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Badge principal */}
                    <p className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {plan.badge}
                    </p>

                    <h2 className="text-xl font-semibold text-slate-900">
                      {plan.name}
                    </h2>

                    {/* Bloc pricing spécifique par formule */}
                    {isMonthly ? (
                      <div className="space-y-1">
                        <p className="text-base text-slate-900">
                          <span className="mr-2 align-middle text-sm text-slate-400 line-through">
                            4,90 € TTC / mois
                          </span>
                          <span className="align-middle font-semibold">
                            0 € par mois pendant 1 mois
                          </span>
                        </p>
                        <p className="text-sm text-slate-500">
                          Puis{" "}
                          <span className="font-semibold text-slate-900">
                            4,90 € TTC / mois
                          </span>
                          .
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {plan.priceDetail}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-base text-slate-900">
                          <span className="mr-2 align-middle text-sm text-slate-400 line-through">
                            29,90 € TTC / an
                          </span>
                          <span className="align-middle font-semibold">
                            19,90 € TTC la première année
                          </span>
                        </p>
                        <p className="text-sm text-slate-500">
                          Puis{" "}
                          <span className="font-semibold text-slate-900">
                            29,90 € TTC / an
                          </span>
                          .
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {plan.priceDetail}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    {!session ? (
                      <Link
                        href={loginHref}
                        className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#2563eb] underline-offset-2 hover:text-[#1d4ed8]"
                      >
                        {getPlanCtaLabel(plan.id)}
                      </Link>
                    ) : showCheckoutButtons ? (
                      <button
                        type="button"
                        onClick={() => handleCheckout(plan.id)}
                        disabled={creatingCheckout || loading}
                        className="w-full rounded-full bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {getPlanCtaLabel(plan.id)}
                      </button>
                    ) : (
                      <div className="w-full rounded-full border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-500">
                        {getPlanCtaLabel(plan.id)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {canViewPremium && (
            <p className="mt-4 text-center text-sm text-emerald-700">
              Votre abonnement est actif (statut :{" "}
              {subscriptionStatus ?? "active"}).
            </p>
          )}
          {error && (
            <p className="mt-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          )}
        </section>

        {/* Avantages détaillés */}
        <section className="rounded-3xl border border-dashed border-slate-200/80 bg-white/70 p-6 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">
            Ce que vous débloquez avec PediaGo+ Premium
          </p>
          <ul className="mt-3 space-y-2">
            {PREMIUM_PERKS.map((perk) => (
              <li key={perk} className="flex gap-2">
                <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[10px] leading-none text-emerald-700">
                  ✓
                </span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>

          <hr className="my-5 border-dashed border-slate-200" />

          <p className="mt-3">
            Besoin d’aide ? Contactez{" "}
            <a
              className="font-semibold text-[#2563eb]"
              href="mailto:contact@pediago.app"
            >
              contact@pediago.app
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}