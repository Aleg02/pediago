"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import AgeWeightPicker from "@/components/AgeWeightPicker";
import SearchBar from "@/components/SearchBar";
import ProtocolCard from "@/components/ProtocolCard";
import Fuse from "fuse.js";
import { PROTOCOLS, type Protocol } from "@/data/protocols";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import Disclaimer from "@/components/Disclaimer";

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
      searchInputRef.current?.blur();
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
    <main className="min-h-screen bg-white text-slate-900">
      {/* fine barre de couleur en haut comme accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#8b5cf6] via-[#3b82f6] to-[#22c55e]" />

      <div className="flex min-h-[calc(100vh-4px)] flex-col items-center">
        {/* HEADER : logo + titre + slogan */}
        <header className="w-full max-w-[420px] px-6 pt-10 text-center">
          <Image
            src="/logo.svg"
            alt="PediaGo"
            width={160}
            height={160}
            priority
            className="mx-auto h-20 w-auto"
          />
          <h1 className="mt-7 text-[64px] leading-none font-semibold tracking-tight text-slate-900">
            <span>Pedia</span>
            <span className="text-[#ef4444]">Go</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">Le bon geste, maintenant&nbsp;!</p>
        </header>

        {/* CONTENU PRINCIPAL */}
        <section className="w-full max-w-[420px] flex-1 px-6 pb-14">
          {/* Bloc Âge / Poids + recherche */}
          <div className="mt-10 space-y-4">
            {/* Âge / Poids : le composant interne gère déjà le layout */}
            <AgeWeightPicker
              ageLabel={ageLabel}
              setAgeLabel={setAgeLabel}
              weightKg={weightKg}
              setWeightKg={setWeightKg}
              className="max-w-none"
            />

            {/* Barre de recherche : style champ texte simple comme sur le mockup */}
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
              className="mt-1"
              inputRef={searchInputRef}
            />
          </div>

          {/* HOME : disclaimer + CTA */}
          {!searchMode && (
            <>
              <Disclaimer className="mt-5" />
              <button
                type="button"
                onClick={() => {
                  const shouldFocusInput =
                    typeof window !== "undefined" &&
                    !window.matchMedia("(pointer: coarse)").matches;

                  searchModeTrigger.current = shouldFocusInput ? "button" : null;
                  setSearchMode(true);
                  if (!shouldFocusInput) {
                    searchInputRef.current?.blur();
                  }
                }}
                className="mt-14 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(37,99,235,0.45)] transition hover:from-[#1d4ed8] hover:to-[#6d28d9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb]"
              >
                Accéder aux protocoles
              </button>
            </>
          )}

          {/* MODE RECHERCHE : résultats sous les champs */}
          {searchMode && (
            <div ref={resultsRef} className="mt-8 space-y-4">
              {hits.length > 0 ? (
                hits.map((p) => (
                  <ProtocolCard key={p.slug} item={p} onOpen={openProtocol} />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-500">
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
                  className="mt-2 text-sm font-medium text-slate-600 underline underline-offset-4"
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
