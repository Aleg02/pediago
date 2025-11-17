"use client";

import { useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import type { Database } from "@/types/database";

type EntitlementsState = {
  loading: boolean;
  canViewPremium: boolean;
  subscriptionStatus: string | null;
  subscriptionTier: string | null;
  error: string | null;
};

const initialState: EntitlementsState = {
  loading: false,
  canViewPremium: false,
  subscriptionStatus: null,
  subscriptionTier: null,
  error: null,
};

export function useUserEntitlements() {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();
  const [state, setState] = useState<EntitlementsState>(initialState);

  useEffect(() => {
    let isActive = true;

    if (!session) {
      setState({ ...initialState });
      return () => {
        isActive = false;
      };
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    const fetchEntitlements = async () => {
      const { data, error } = await supabase
        .from("user_entitlements")
        .select("can_view_premium, subscription_status, subscription_tier")
        .eq("user_id", session.user.id)
        .single();

      if (!isActive) {
        return;
      }

      if (error || !data) {
        setState({
          loading: false,
          canViewPremium: false,
          subscriptionStatus: null,
          subscriptionTier: null,
          error: error?.message ?? "Impossible de vérifier les droits.",
        });
        return;
      }

      setState({
        loading: false,
        canViewPremium: Boolean(data.can_view_premium),
        subscriptionStatus: data.subscription_status ?? null,
        subscriptionTier: data.subscription_tier ?? null,
        error: null,
      });
    };

    fetchEntitlements();

    return () => {
      isActive = false;
    };
  }, [session, supabase]);

  return {
    loading: state.loading,
    canViewPremium: state.canViewPremium,
    subscriptionStatus: state.subscriptionStatus,
    subscriptionTier: state.subscriptionTier,
    error: state.error,
    hasSession: Boolean(session),
  };
}

