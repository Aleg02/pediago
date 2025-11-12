"use client";

import { useMemo, useState } from "react";
import AgeWeightPicker from "@/components/AgeWeightPicker";
import SearchBar from "@/components/SearchBar";
import ProtocolCard from "@/components/ProtocolCard";
import Fuse from "fuse.js";
import { PROTOCOLS } from "@/data/protocols";
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
  const [query, setQuery] = useState("");

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

  // On ne déclenche la recherche que si l'utilisateur saisit une requête.
  const trimmedQuery = query.trim();
  const hits = useMemo(() => {
    if (trimmedQuery.length === 0) {
      return [];
    }
    return fuse.search(trimmedQuery).map((r) => r.item);
  }, [fuse, trimmedQuery]);

  const openProtocol = (slug: string) => {
    router.push(`/protocols/${slug}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 pb-16 pt-12">
        <header className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">PediaGo</h1>
          <p className="mt-3 text-base text-slate-500">Le bon geste, maintenant !</p>
        </header>

        <div className="mt-10 flex w-full justify-center">
          <AgeWeightPicker
            ageLabel={ageLabel}
            setAgeLabel={setAgeLabel}
            weightKg={weightKg}
            setWeightKg={setWeightKg}
          />
        </div>

        <SearchBar className="mt-10" onChange={setQuery} autoFocus={false} value={query} />

        <div className="mt-4 w-full max-w-[360px] rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none">⚠️</span>
            <p className="text-left text-sm font-medium">
              Ces informations ne remplacent pas le jugement clinique.
            </p>
          </div>
        </div>

        {trimmedQuery.length > 0 && (
          <div className="mt-10 w-full max-w-[420px] space-y-3">
            {hits.length > 0 ? (
              <div className="space-y-3">
                {hits.map((p) => (
                  <ProtocolCard key={p.slug} item={p} onOpen={openProtocol} />
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-500 text-sm">
                Aucun protocole ne correspond à « {trimmedQuery} ».
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
