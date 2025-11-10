"use client";

import type { ComponentType } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { PROTOCOLS } from "@/data/protocols";
import { PROTOCOL_DETAILS } from "@/data/protocolDetails";
import { DRUGS, DOSING_RULES, WEIGHT_OVERRIDES, PROTOCOL_DRUGS } from "@/data/drugs";
import { computeDose } from "@/lib/dosing";
import { useAppStore } from "@/store/useAppStore";
import { DRUG_INFOS } from "@/data/drugInfos";
import { formatMg } from "@/lib/units";
import { ageLabelToMonths } from "@/lib/age";

// Flows (bandes + chevrons)
import ProtocolFlowAAG from "@/components/ProtocolFlowAAG";
import ProtocolFlowAnaphylaxie from "@/components/ProtocolFlowAnaphylaxie";
import ProtocolFlowChoc from "@/components/ProtocolFlowChoc";
import ProtocolFlowACR from "@/components/ProtocolFlowACR";
import ProtocolFlowEME from "@/components/ProtocolFlowEME";

// Sections posologie (NOUVEAU rendu V2 depuis le JSON)
import PosologySections from "@/components/PosologySections";

export default function ProtocolPage() {
  const router = useRouter();
  const { slug } = useParams() as { slug: string };

  const protocol = PROTOCOLS.find((p) => p.slug === slug);
  const sections = PROTOCOL_DETAILS[slug] ?? [];
  const drugIds = PROTOCOL_DRUGS[slug] ?? [];

  const ageLabel = useAppStore((s) => s.ageLabel);
  const ageMonths = ageLabelToMonths(ageLabel);

  const [tab, setTab] = useState<"protocole" | "posologie">("protocole");

  const drugs = useMemo(() => DRUGS.filter((d) => drugIds.includes(d.id)), [drugIds]);

  const FlowBySlug: Record<string, ComponentType | undefined> = {
    aag: ProtocolFlowAAG,
    anaphylaxie: ProtocolFlowAnaphylaxie,
    "choc-hemorragique": ProtocolFlowChoc,
    "acr-enfant": ProtocolFlowACR,
    eme: ProtocolFlowEME,
  };
  const Flow = FlowBySlug[slug];

  if (!protocol) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Protocole introuvable 😕</p>
          <button onClick={() => router.push("/")} className="underline text-slate-700">
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
          onClick={() => router.push("/")}
          className="text-sm text-slate-500 inline-flex items-center gap-2 mb-5 hover:text-slate-700 transition"
        >
          ← Retour
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">{protocol.title}</h1>
          {protocol.version && <p className="text-slate-500 text-sm">Version {protocol.version}</p>}
        </div>

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
              {sections.map((sec, idx) => (
                <div key={idx} className="rounded-xl bg-white border border-black/10 shadow-sm px-4 py-3">
                  <p className="font-medium mb-2">{sec.title}</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {sec.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
              {sections.length === 0 && <p className="text-sm text-slate-500">Contenu détaillé à venir.</p>}
            </div>
          )
        ) : (
          // ✅ Rendu POSOLOGIE V2 (depuis posology_normalized.json)
          <PosologySections slug={slug} />
        )}
      </div>
    </main>
  );
}
