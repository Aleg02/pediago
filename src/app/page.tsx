"use client";

import { useState, useEffect, useMemo } from "react";
import AgeWeightPicker from "@/components/AgeWeightPicker";
import SearchBar from "@/components/SearchBar";
import ProtocolCard from "@/components/ProtocolCard";
import Fuse from "fuse.js";
import { PROTOCOLS, type Protocol } from "@/data/protocols";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export default function HomePage() {
  const router = useRouter();

  // store global
  const ageLabel = useAppStore((s) => s.ageLabel);
  const weightKg = useAppStore((s) => s.weightKg);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  // état page
  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState("");

  // valeurs par défaut
  useEffect(() => {
    if (ageLabel == null && weightKg == null) {
      setAgeLabel("10 mois");
      setWeightKg(10);
    }
  }, [ageLabel, weightKg, setAgeLabel, setWeightKg]);

  // index Fuse
  const fuse = useMemo(
    () =>
      new Fuse(PROTOCOLS, {
        keys: ["title", "slug"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    []
  );

  // 🔎 NOUVEAU: si query vide ⇒ on affiche tout (trié A→Z). Sinon ⇒ résultats Fuse.
  const hits: Protocol[] = useMemo(() => {
    const q = query.trim();
    if (q.length === 0) {
      return [...PROTOCOLS].sort((a, b) =>
        a.title.localeCompare(b.title, "fr", { sensitivity: "base" })
      );
    }
    return fuse.search(q).map((r) => r.item);
  }, [fuse, query]);

  const openProtocol = (slug: string) => {
    router.push(`/protocols/${slug}`);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-[420px] mx-auto px-6">
        {/* Titre + sous-titre */}
        <div className={`text-center ${searchMode ? "mt-2" : "mt-6"}`}>
          <h1 className="text-[36px] leading-[1.1] font-semibold tracking-tight">PediaGo</h1>
          <p className="text-slate-500 mt-2">Le bon geste, maintenant !</p>
        </div>

        {/* Âge / Poids */}
        <div className={`${searchMode ? "mt-2" : "mt-6"}`}>
          <AgeWeightPicker
            ageLabel={ageLabel}
            setAgeLabel={setAgeLabel}
            weightKg={weightKg}
            setWeightKg={setWeightKg}
          />
        </div>

        {/* Barre de recherche */}
        <SearchBar
          onFocus={() => setSearchMode(true)}
          onChange={setQuery}
          autoFocus={false}
          value={query}
        />

        {/* Zone “Search mode” */}
        {searchMode && (
          <div className="w-full max-w-[420px] mx-auto mt-6 space-y-3">
            {hits.length > 0 ? (
              <div className="space-y-3">
                {hits.map((p) => (
                  <ProtocolCard key={p.slug} item={p} onOpen={openProtocol} />
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-500 text-sm">
                Aucun protocole ne correspond à « {query} ».
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => {
                  setSearchMode(false);
                  setQuery("");
                }}
                className="mt-6 text-slate-600 underline underline-offset-4"
              >
                Quitter le mode recherche
              </button>
            </div>
          </div>
        )}

        <div className="h-16" />
      </div>
    </main>
  );
}
