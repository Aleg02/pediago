"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import type SupabaseClient from "@supabase/supabase-js/dist/module/SupabaseClient";
import { useUserEntitlements } from "@/hooks/useUserEntitlements";
import { logoutAction } from "@/app/actions/auth";
import type { Database } from "@/types/database";

// Menu pour utilisateur non connecté
const MENU_ITEMS_LOGGED_OUT = [
  {
    label: "À propos de PediaGo",
    description: "Présentation, objectifs, conditions d'utilisation, contact",
    href: "/a-propos",
  },
];

// Menu pour utilisateur connecté (la carte supérieure propose déjà Mon compte)
const MENU_ITEMS_LOGGED_IN = [
  {
    label: "À propos de PediaGo",
    description: "Présentation, objectifs, conditions d'utilisation, contact",
    href: "/a-propos",
  },
];

const statusLabels: Record<string, string> = {
  active: "Actif",
  trialing: "Essai",
  inactive: "Inactif",
  past_due: "À régulariser",
};

function formatStatus(status?: string | null) {
  if (!status) return "Indisponible";
  return statusLabels[status] ?? status;
}

export default function TopMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonId = "global-menu-button";
  const panelId = "global-menu-panel";

  // État d'authentification via Supabase
  const session = useSession();
  const sessionUser = (session as { user?: { id?: string; email?: string | null } } | null)?.user;
  const { canViewPremium, subscriptionStatus, subscriptionTier, loading: entitlementLoading } = useUserEntitlements();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = useSupabaseClient() as unknown as SupabaseClient<Database>;

  // On choisit les items en fonction de la présence d'une session
  const menuItems = session ? MENU_ITEMS_LOGGED_IN : MENU_ITEMS_LOGGED_OUT;

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (!isOpen) return;
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen]);

  const handleLogout = () => {
    startTransition(async () => {
      await supabase.auth.signOut();
      await logoutAction();
      setIsOpen(false);
      router.refresh();
    });
  };

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-40 flex items-start gap-3 sm:right-6 sm:top-6">
      <div ref={menuRef} className="pointer-events-auto">
        <button
          id={buttonId}
          aria-haspopup="true"
          aria-controls={panelId}
          aria-expanded={isOpen}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-md shadow-slate-900/5 transition hover:border-slate-300 hover:text-slate-900"
        >
          <span className="sr-only">Ouvrir le menu</span>
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M5 7h14M5 12h14M5 17h14" />
          </svg>
        </button>

        {isOpen && (
          <div
            id={panelId}
            role="menu"
            aria-labelledby={buttonId}
            className="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200/80 bg-white/95 p-3 text-left shadow-xl shadow-slate-900/10 backdrop-blur"
          >
            {sessionUser ? (
              <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                    {sessionUser.email?.[0]?.toUpperCase() ?? "U"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Compte</p>
                    <p className="truncate text-sm font-semibold text-slate-900">{sessionUser.email}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Statut : {entitlementLoading ? "Vérification..." : formatStatus(subscriptionStatus)} - Formule {subscriptionTier ?? "free"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {!canViewPremium && (
                    <Link
                      href="/subscribe"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                      Passer Premium
                    </Link>
                  )}
                    <Link
                    href="/mon-compte"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                  >
                    Mon compte
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isPending}
                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending ? "Déconnexion..." : "Se déconnecter"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Bienvenue sur PediaGo</p>
                <p className="mt-1 text-xs text-slate-600">Connectez-vous pour retrouver vos protocoles et votre abonnement.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-slate-800"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/subscribe"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                  >
                    Découvrir Premium
                  </Link>
                </div>
              </div>
            )}
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex flex-col rounded-xl px-3 py-2 transition hover:bg-slate-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-sm font-semibold text-slate-900">{item.label}</span>
                    <span className="text-xs text-slate-500">{item.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
