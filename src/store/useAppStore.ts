"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 👇 utilitaire: on est côté client ?
const isClient = typeof window !== "undefined";

type AppState = {
  weightKg: number | null;
  setWeightKg: (v: number) => void;

  ageLabel: string | null;
  setAgeLabel: (v: string) => void;

  // ... garde ici les autres champs de ton store
};

const INITIAL_STATE: Pick<AppState, "weightKg" | "ageLabel"> = {
  weightKg: 10,
  ageLabel: "",
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setWeightKg: (v) => set({ weightKg: v }),
      setAgeLabel: (v) => set({ ageLabel: v }),

      // ... tes autres actions
    }),
    {
      name: "pediago-store",
      /**
       * ⚠️ IMPORTANT :
       * - côté client → on utilise localStorage
       * - côté serveur → on laisse `storage` undefined pour désactiver la rehydratation SSR
       */
      storage: isClient
        ? createJSONStorage(() => window.localStorage)
        : undefined,

      // (optionnel) utile si tu écoutes l’hydratation
      // skipHydration: true,
    }
  )
);
