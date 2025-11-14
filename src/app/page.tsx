"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import AgeWeightPicker from "@/components/AgeWeightPicker";
import SearchBar from "@/components/SearchBar";
import ProtocolCard from "@/components/ProtocolCard";
import Fuse from "fuse.js";
import { PROTOCOLS, type Protocol } from "@/data/protocols";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import Disclaimer from "@/components/Disclaimer";

function HeroIllustration() {
  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <div
        className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white via-white to-[#f2f6ff] shadow-[0_25px_50px_rgba(15,23,42,0.18)]"
        aria-hidden="true"
      />
      <svg
        viewBox="0 0 160 160"
        className="relative h-24 w-24 drop-shadow-[0_12px_25px_rgba(239,68,68,0.35)]"
        aria-hidden="true"
      >
        <rect x="56" y="16" width="48" height="128" rx="16" fill="#ef4444" />
        <rect x="16" y="56" width="128" height="48" rx="16" fill="#ef4444" />
        <circle cx="108" cy="88" r="44" fill="#fff" />
        <path d="M108 56c-16 0-30 12-32 28h64c-2-16-16-28-32-28z" fill="#ef4444" />
        <circle cx="96" cy="88" r="6" fill="#ef4444" />
        <circle cx="120" cy="88" r="6" fill="#ef4444" />
        <path
          d="M96 104c4 6 12 10 12 10s8-4 12-10"
          stroke="#ef4444"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span className="sr-only">Illustration d’un enfant sur une croix médicale</span>
    </div>
  );
}

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
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const searchModeTrigger = useRef<"button" | null>(null);

  // valeurs par défaut
  useEffect(() => {
    if (ageLabel == null && weightKg == null) {
      setAgeLabel("10 mois");
      setWeightKg(10);
    }
  }, [ageLabel, weightKg, setAgeLabel, setWeightKg]);

  useEffect(() => {
    if (searchMode && searchModeTrigger.current === "button") {
      const raf = requestAnimationFrame(() => {
        searchInputRef.current?.focus();
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        searchModeTrigger.current = null;
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [searchMode]);

  useEffect(() => {
    if (!searchMode) {
      searchModeTrigger.current = null;
    }
  }, [searchMode]);

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
    <main className="min-h-screen bg-gradient-to-b from-[#eef4ff] via-white to-white text-slate-900">
      <div className="flex min-h-screen flex-col items-center">
        <header className="w-full max-w-[420px] px-6 pt-12 text-center">
          <h1 className="text-[40px] leading-none font-semibold tracking-tight text-slate-900">
            Pedia<span className="text-[#ef4444]">Go</span>
          </h1>
          <p className="mt-2 text-base text-slate-500">Le bon geste, maintenant !</p>
        </header>

        <section className="w-full max-w-[420px] flex-1 px-6 pb-24">
          <div className="flex justify-center pt-6">
            <HeroIllustration />
          </div>

          <div className="mt-10 rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-[0_25px_50px_rgba(15,23,42,0.15)] backdrop-blur">
            {/* Âge / Poids */}
            <AgeWeightPicker
              ageLabel={ageLabel}
              setAgeLabel={setAgeLabel}
              weightKg={weightKg}
              setWeightKg={setWeightKg}
              className="max-w-none"
            />

            {/* Barre de recherche */}
            <SearchBar
              onFocus={() => {
                searchModeTrigger.current = null;
                setSearchMode(true);
              }}
              onChange={(value) => {
                setQuery(value);
                if (value.trim().length === 0) {
                  setSearchMode(false);
                } else {
                  setSearchMode(true);
                }
              }}
              autoFocus={false}
              value={query}
              className="mt-6"
              inputRef={searchInputRef}
            />
          </div>

          {/* HOME : disclaimer + CTA */}
          {!searchMode && (
            <>
              <Disclaimer className="mt-6" />
              <button
                type="button"
                onClick={() => {
                  searchModeTrigger.current = "button";
                  setSearchMode(true);
                }}
                className="mt-8 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] px-6 py-4 text-base font-semibold text-white shadow-[0_20px_35px_rgba(37,99,235,0.35)] transition hover:from-[#1d4ed8] hover:to-[#6d28d9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb]"
              >
                Accéder aux protocoles adaptés
              </button>
            </>
          )}

          {/* MODE RECHERCHE : résultats sous la carte */}
          {searchMode && (
            <div ref={resultsRef} className="mt-10 space-y-4">
              {hits.length > 0 ? (
                hits.map((p) => (
                  <ProtocolCard key={p.slug} item={p} onOpen={openProtocol} />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 px-6 py-8 text-center text-sm text-slate-500">
                  Aucun protocole ne correspond à « {query} ».
                </div>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setSearchMode(false);
                    setQuery("");
                  }}
                  className="mt-4 text-sm font-medium text-slate-600 underline underline-offset-4"
                >
                  Quitter le mode recherche
                </button>
              </div>
            </div>
          )}
        </section>

        {/* MODE RECHERCHE : disclaimer collé en bas */}
        {searchMode && (
          <footer className="w-full max-w-[420px] px-6 pb-8">
            <Disclaimer className="mt-0" />
          </footer>
        )}
      </div>
    </main>
  );
}
