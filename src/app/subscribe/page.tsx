"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUserEntitlements } from "@/hooks/useUserEntitlements";

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
    price: "6,90 € TTC / mois",
    priceDetail: "Sans engagement, renouvelé automatiquement.",
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
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }), // "monthly" ou "yearly"
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
    <main className="min-h-screen bg-white text-slate-900">
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
          <div className="grid gap-4 sm:grid-cols-2">
            {PREMIUM_PLANS.map((plan) => (
              <div
                key={plan.id}
                className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm"
              >
                <div className="space-y-2">
                  <p className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {plan.badge}
                  </p>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {plan.name}
                  </h2>
                  <p className="text-2xl font-bold text-slate-900">
                    {plan.price}
                  </p>
                  <p className="text-xs text-slate-500">{plan.priceDetail}</p>
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
            ))}
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

          <p className="font-semibold text-slate-900">Comment ça marche ?</p>
          <ol className="mt-3 space-y-2 list-decimal pl-5">
            <li>
              Sélectionnez la formule mensuelle ou annuelle pour ouvrir le
              checkout Stripe sécurisé.
            </li>
            <li>
              Stripe confirme le paiement et renvoie l’évènement à PediaGo via
              un webhook.
            </li>
            <li>
              Supabase met à jour votre profil et l’accès Premium est disponible
              instantanément.
            </li>
          </ol>
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
