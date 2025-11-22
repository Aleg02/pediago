"use client";

import type { ComponentType } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { Protocol } from "@/data/protocols";
import { PROTOCOLS } from "@/data/protocols";
import type { ProtocolSection } from "@/data/protocolDetails";
import { PROTOCOL_DETAILS } from "@/data/protocolDetails";
import { fetchCardBySlug } from "@/lib/cardsClient";
import { useUserEntitlements } from "@/hooks/useUserEntitlements";

// Flows (bandes + chevrons)
import ProtocolFlowAAG from "@/components/ProtocolFlowAAG";
import ProtocolFlowAnaphylaxie from "@/components/ProtocolFlowAnaphylaxie";
import ProtocolFlowChoc from "@/components/ProtocolFlowChoc";
import ProtocolFlowACR from "@/components/ProtocolFlowACR";
import ProtocolFlowEME from "@/components/ProtocolFlowEME";
import ProtocolFlowCFS from "@/components/ProtocolFlowCFS";
import ProtocolFlowHypoglycemie from "@/components/ProtocolFlowHypoglycemie";
import ProtocolFlowAcidocetose from "@/components/ProtocolFlowAcidocetose";
import ProtocolFlowAntalgiques from "@/components/ProtocolFlowAntalgiques";
import ProtocolFlowBronchiolite from "@/components/ProtocolFlowBronchiolite";
import ProtocolFlowBronchospasme from "@/components/ProtocolFlowBronchospasme";
import ProtocolFlowSepsisPurpura from "@/components/ProtocolFlowSepsisPurpura";
import ProtocolFlowTCC from "@/components/ProtocolFlowTCC";
import ProtocolFlowLaryngite from "@/components/ProtocolFlowLaryngite";
import ProtocolFlowPCB from "@/components/ProtocolFlowPCB";
import ProtocolFlowPneumopathieMyco from "@/components/ProtocolFlowPneumopathieMyco";
import ProtocolFlowMeningite from "@/components/ProtocolFlowMeningite";
import ProtocolFlowTSV from "@/components/ProtocolFlowTSV";
import ProtocolFlowFAST from "@/components/ProtocolFlowFAST";
import ProtocolFlowPolytrauma from "@/components/ProtocolFlowPolytrauma";
import ProtocolFlowNoyade from "@/components/ProtocolFlowNoyade";
import ProtocolFlowBrulures from "@/components/ProtocolFlowBrulures";
import ProtocolFlowBruluresChimiques from "@/components/ProtocolFlowBruluresChimiques";
import ProtocolFlowInhalationCO from "@/components/ProtocolFlowInhalationCO";
import ProtocolFlowTraumatismeThoracique from "@/components/ProtocolFlowTraumatismeThoracique";

// Sections posologie (NOUVEAU rendu V2 depuis le JSON)
import PosologySections from "@/components/PosologySections";

export default function ProtocolPage() {
  const router = useRouter();
  const { slug } = useParams() as { slug: string };

  const fallbackProtocol = useMemo(
    () => PROTOCOLS.find((p) => p.slug === slug),
    [slug]
  );
  const fallbackSections = useMemo(
    () => PROTOCOL_DETAILS[slug] ?? [],
    [slug]
  );

  const [remoteProtocols, setRemoteProtocols] = useState<Record<string, Protocol>>({});
  const [remoteSections, setRemoteSections] = useState<Record<string, ProtocolSection[]>>({});
  const [tab, setTab] = useState<"protocole" | "posologie">("protocole");
  const [showSources, setShowSources] = useState(false);
  const [cardErrors, setCardErrors] = useState<Record<string, string | null>>({});
  const { canViewPremium, loading: entitlementLoading } = useUserEntitlements();
  const [redirecting, setRedirecting] = useState(false);

  const protocol = remoteProtocols[slug] ?? fallbackProtocol;
  const protocolTitle = protocol?.title;
  const sectionBlocks = remoteSections[slug] ?? fallbackSections;
  const cardError = cardErrors[slug] ?? null;

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { protocol: remoteProtocol, sections, error } = await fetchCardBySlug(slug);
      if (!active) {
        return;
      }
      if (remoteProtocol) {
        setRemoteProtocols((prev) => ({ ...prev, [slug]: remoteProtocol }));
      }
      if (sections && sections.length > 0) {
        setRemoteSections((prev) => ({ ...prev, [slug]: sections }));
      }
      setCardErrors((prev) => ({ ...prev, [slug]: error ? error.message : null }));
    };

    load();
    return () => {
      active = false;
    };
  }, [slug]);

  const FlowBySlug: Record<string, ComponentType | undefined> = {
    aag: ProtocolFlowAAG,
    anaphylaxie: ProtocolFlowAnaphylaxie,
    "choc-hemorragique": ProtocolFlowChoc,
    "acr-enfant": ProtocolFlowACR,
    eme: ProtocolFlowEME,
    "convulsion-febrile-simple": ProtocolFlowCFS,
    hypoglycemie: ProtocolFlowHypoglycemie,
    "acidocetose-diabetique": ProtocolFlowAcidocetose,
    antalgiques: ProtocolFlowAntalgiques,
    bronchiolite: ProtocolFlowBronchiolite,
    "bronchospasme-nourrisson": ProtocolFlowBronchospasme,
    "fievre-sepsis-purpura": ProtocolFlowSepsisPurpura,
    "traumatisme-cranien": ProtocolFlowTCC,
    "laryngite-aigue": ProtocolFlowLaryngite,
    "pneumopathie-communautaire-bacterienne": ProtocolFlowPCB,
    "pneumopathie-atypique-mycoplasma": ProtocolFlowPneumopathieMyco,
    "meningite-bacterienne-purulente": ProtocolFlowMeningite,
    "tachycardie-supraventriculaire": ProtocolFlowTSV,
    "traumatisme-thoraco-abdominal-fast": ProtocolFlowFAST,
    "polytraumatisme-pediatrique": ProtocolFlowPolytrauma,
    "noyade-submersion": ProtocolFlowNoyade,
    "brulures-thermiques-etendues": ProtocolFlowBrulures,
    "brulures-chimiques-pediatriques": ProtocolFlowBruluresChimiques,
    "inhalation-fumees-co": ProtocolFlowInhalationCO,
    "traumatisme-thoracique-pediatrique": ProtocolFlowTraumatismeThoracique,
  };
  const Flow = FlowBySlug[slug];
  const requiresPremium = protocol?.accessLevel === "premium";

  useEffect(() => {
    if (!requiresPremium || entitlementLoading) {
      return;
    }

    if (!canViewPremium) {
      setRedirecting(true);
      const target = protocolTitle ?? slug;
      router.replace(`/subscribe?reason=premium&slug=${encodeURIComponent(target)}`);
    }
  }, [requiresPremium, entitlementLoading, canViewPremium, router, slug, protocolTitle]);

  if (requiresPremium && (entitlementLoading || redirecting)) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white/90 px-6 py-5 text-center text-sm text-slate-600">
          {entitlementLoading ? "Vérification de l'abonnement en cours..." : "Redirection vers la page d'abonnement..."}
        </div>
      </main>
    );
  }

  if (!protocol) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Protocole introuvable 😕</p>
          <button onClick={() => router.push("/?mode=search")} className="underline text-slate-700">
            Retour
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center bg-slate-50">
      <div className="w-full max-w-[440px] px-6 py-8">
        <button
          onClick={() => router.push("/?mode=search")}
          className="text-sm text-slate-500 inline-flex items-center gap-2 mb-5 hover:text-slate-700 transition"
        >
          ← Retour
        </button>

        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {protocol.icon ? (
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-sm"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${protocol.accentColor}22 0%, ${protocol.accentColor}10 100%)`,
                }}
                aria-hidden
              >
                {protocol.icon}
              </div>
            ) : null}
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{protocol.title}</h1>
              {protocol.version && <p className="text-slate-500 text-sm">Version {protocol.version}</p>}
            </div>
          </div>
          {protocol.sources?.length ? (
            <button
              onClick={() => setShowSources(true)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
            >
              📚 Sources
            </button>
          ) : null}
        </div>

        {cardError && (
          <div className="mb-6 rounded-2xl border border-rose-200/70 bg-rose-50/80 px-4 py-3 text-sm text-rose-700">
            Impossible de synchroniser la fiche depuis Supabase. Affichage du contenu local.
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white border border-slate-200 rounded-full shadow-sm p-1 flex gap-1">
            <button
              onClick={() => setTab("protocole")}
              className={`flex-1 px-5 py-2.5 rounded-full text-sm font-medium transition ${
                tab === "protocole"
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Protocole
            </button>
            <button
              onClick={() => setTab("posologie")}
              className={`flex-1 px-5 py-2.5 rounded-full text-sm font-medium transition ${
                tab === "posologie"
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Posologie
            </button>
          </div>
        </div>

        {tab === "protocole" ? (
          Flow ? (
            <Flow />
          ) : (
            <div className="space-y-4">
              {sectionBlocks.map((sec, idx) => (
                <div key={idx} className="rounded-xl bg-white border border-black/10 shadow-sm px-4 py-3">
                  <p className="font-medium mb-2">{sec.title}</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {sec.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
              {sectionBlocks.length === 0 && <p className="text-sm text-slate-500">Contenu détaillé à venir.</p>}
            </div>
          )
        ) : (
          // ✅ Rendu POSOLOGIE V2 (depuis posology_normalized.json)
          <PosologySections slug={slug} />
        )}
        {showSources && protocol.sources?.length ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-lg font-semibold text-slate-900">Sources</p>
                <button
                  onClick={() => setShowSources(false)}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200"
                >
                  Fermer
                </button>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                {protocol.sources.map((source, idx) => (
                  <li key={idx} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-dotted underline-offset-2 hover:text-slate-900"
                      >
                        {source.label}
                      </a>
                    ) : (
                      <span>{source.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
