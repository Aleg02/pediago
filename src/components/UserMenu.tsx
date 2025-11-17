"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import type { Database } from "@/types/database";
import { logoutAction } from "@/app/actions/auth";

const statusLabels: Record<string, string> = {
  active: "Actif",
  trialing: "Essai",
  inactive: "Inactif",
  past_due: "À régulariser",
};

function formatStatus(status?: string | null) {
  if (!status) {
    return "Indisponible";
  }
  return statusLabels[status] ?? status;
}

export default function UserMenu() {
  const session = useSession();
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();
  const [profile, setProfile] = useState<Database["public"]["Tables"]["profiles"]["Row"] | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      if (!session) {
        setProfile(null);
        return;
      }

      setLoadingProfile(true);
      setError(null);
      const { data, error: queryError } = await supabase
        .from("profiles")
        .select("id, subscription_tier, subscription_status, expires_at")
        .eq("id", session.user.id)
        .single();

      if (!isMounted) {
        return;
      }

      if (queryError) {
        setError(queryError.message);
        setProfile(null);
      } else {
        setProfile(data);
      }
      setLoadingProfile(false);
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [session, supabase]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
      setOpen(false);
      router.refresh();
    });
  };

  if (!session) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-md shadow-slate-900/5 transition hover:text-indigo-500"
      >
        Se connecter
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-md shadow-slate-900/5 hover:border-slate-300"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
          {session.user.email?.[0]?.toUpperCase() ?? "U"}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-xs font-medium text-slate-500">Compte</span>
          <span className="block leading-tight">{session.user.email}</span>
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200/80 bg-white/95 p-4 text-sm shadow-xl shadow-slate-900/10">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Statut</p>
          <p className="mt-1 font-semibold text-slate-900">{formatStatus(profile?.subscription_status)}</p>
          <p className="text-xs text-slate-500">
            Formule {profile?.subscription_tier ?? "free"}
            {profile?.expires_at ? ` · valide jusqu'au ${new Date(profile.expires_at).toLocaleDateString("fr-FR")}` : ""}
          </p>
          {error && <p className="mt-2 rounded-lg bg-rose-50 px-3 py-1 text-xs text-rose-600">{error}</p>}
          {loadingProfile && <p className="mt-2 text-xs text-slate-500">Chargement du profil...</p>}
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/mon-compte"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Gérer mon abonnement
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Déconnexion..." : "Se déconnecter"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
