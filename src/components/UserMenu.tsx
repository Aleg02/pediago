"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import type SupabaseClient from "@supabase/supabase-js/dist/module/SupabaseClient";
import type { Database } from "@/types/database";
import { logoutAction } from "@/app/actions/auth";

// Mapping of subscription statuses to user-friendly labels.
const statusLabels: Record<string, string> = {
  active: "Actif",
  trialing: "Essai",
  inactive: "Inactif",
  past_due: "À régulariser",
};

/**
 * Utility to format the subscription status label. If the status is undefined
 * or null, we fall back to a generic label. Otherwise we map the status to
 * its French representation defined above.
 */
function formatStatus(status?: string | null) {
  if (!status) {
    return "Indisponible";
  }
  return statusLabels[status] ?? status;
}

export default function UserMenu() {
  // Grab the current session from Supabase. When `session` is null the user
  // is not authenticated. We'll use this to determine what to render.
  const session = useSession();
  const sessionUser = (session as { user?: { id?: string; email?: string | null } } | null)?.user;
  const router = useRouter();
  const supabase = useSupabaseClient() as unknown as SupabaseClient<Database>;
  const [profile, setProfile] = useState<Database["public"]["Tables"]["profiles"]["Row"] | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Fetch the user's profile when a session exists. This populates subscription
  // information for the menu. If there's no session we reset the profile to null.
  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      const userId = sessionUser?.id ?? null;
      if (!userId) {
        setProfile(null);
        return;
      }

      setLoadingProfile(true);
      setError(null);
      // Use limit(1) + maybeSingle to avoid Supabase's "Cannot coerce..." error when duplicates exist.
      const { data, error: queryError } = await supabase
        .from("profiles")
        .select("id, subscription_tier, subscription_status, expires_at")
        .eq("id", userId)
        .limit(1)
        .maybeSingle();

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

  // Close the dropdown when clicking outside of it.
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

  // Trigger a logout via a server action and refresh the page once complete.
  const handleLogout = () => {
    startTransition(async () => {
      await supabase.auth.signOut();
      await logoutAction();
      setOpen(false);
      router.refresh();
    });
  };

  // If there's no authenticated session we intentionally render nothing.
  // The login link previously displayed here has been removed because the
  // navigation menu now provides a dedicated entry for authentication.
  if (!sessionUser) {
    return null;
  }

  // When authenticated, render the user avatar button and the dropdown menu.
  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-md shadow-slate-900/5 hover:border-slate-300"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
          {sessionUser.email?.[0]?.toUpperCase() ?? "U"}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-xs font-medium text-slate-500">Compte</span>
          <span className="block leading-tight">{sessionUser.email}</span>
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
            {profile?.subscription_tier !== "premium" && (
              <Link
                href="/subscribe"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-900/10 bg-slate-900 text-white px-3 py-2 text-center text-xs font-semibold transition hover:bg-slate-800"
              >
                Passer Premium
              </Link>
            )}
            <Link
              href="/mon-compte"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Mon compte
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
