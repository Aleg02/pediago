"use client";

import { useState } from "react";

import { PlanCheckoutButton } from "./PlanCheckoutButton";

function mergeClasses(base: string, extra?: string) {
  return extra ? `${base} ${extra}` : base;
}

type BillingPortalButtonProps = {
  className?: string;
  label?: string;
  fallbackPlan?: "monthly" | "yearly";
};

export function BillingPortalButton({
  className,
  label = "Gérer l'abonnement (Stripe)",
  fallbackPlan,
}: BillingPortalButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPortal = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(
          payload.error ?? "Impossible d'ouvrir le portail Stripe.",
        );
      }

      const data = await response.json();
      if (data.portalUrl) {
        window.location.assign(data.portalUrl);
        return;
      }

      throw new Error("URL du portail Stripe manquante.");
    } catch (portalError) {
      console.error(portalError);
      setError(
        portalError instanceof Error
          ? portalError.message
          : "Une erreur est survenue.",
      );
      setLoading(false);
    }
  };

  if (fallbackPlan) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={openPortal}
          disabled={loading}
          className={mergeClasses(
            "inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70",
            className,
          )}
        >
          {loading ? "Ouverture du portail..." : label}
        </button>
        {error && <p className="text-xs text-amber-700">{error}</p>}
        <p className="text-xs text-slate-500">
          En cas d’échec du portail, vous pouvez aussi relancer un checkout Stripe pour basculer de formule :
        </p>
        <PlanCheckoutButton
          plan={fallbackPlan}
          label={
            fallbackPlan === "yearly"
              ? "Basculer vers l'offre annuelle"
              : "Basculer vers l'offre mensuelle"
          }
          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={openPortal}
        disabled={loading}
        className={mergeClasses(
          "inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70",
          className,
        )}
      >
        {loading ? "Ouverture du portail..." : label}
      </button>
      {error && <p className="text-xs text-amber-700">{error}</p>}
    </div>
  );
}
