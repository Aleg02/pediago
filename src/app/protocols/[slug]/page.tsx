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

export default function ProtocolPage() {
  const router = useRouter();
  const { slug } = useParams() as { slug: string };

  const protocol = PROTOCOLS.find((p) => p.slug === slug);
  const sections = PROTOCOL_DETAILS[slug] ?? [];
  const drugIds = PROTOCOL_DRUGS[slug] ?? [];

  // âge (pour salbutamol AE, 2,5 mg ≤ 6 ans ; 5 mg > 6 ans)
  const ageLabel = useAppStore((s) => s.ageLabel);
  const ageMonths = ageLabelToMonths(ageLabel);

  // onglet
  const [tab, setTab] = useState<"protocole" | "posologie">("protocole");

  // poids global
  const weightKg = useAppStore((s) => s.weightKg) ?? 10;
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  // liste des médicaments du protocole
  const drugs = useMemo(() => DRUGS.filter((d) => drugIds.includes(d.id)), [drugIds]);

  // mapping slug -> composant flow
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
    <main className="min-h-screen w-full flex flex-col items-center">
      <div className="w-full max-w-[420px] px-6 py-8">
        <button onClick={() => router.push("/")} className="text-sm text-slate-500 underline mb-4">
          ← Retour
        </button>

        <h1 className="text-2xl font-semibold mb-2">{protocol.title}</h1>
        {protocol.version && <p className="text-slate-500 text-sm mb-4">Version {protocol.version}</p>}

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setTab("protocole")}
            className={`px-4 py-2 rounded-full ${
              tab === "protocole" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            Protocole
          </button>
          <button
            onClick={() => setTab("posologie")}
            className={`px-4 py-2 rounded-full ${
              tab === "posologie" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            Posologie
          </button>
        </div>

        {tab === "protocole" ? (
          Flow ? (
            // 🔸 Rendu spécifique “carte bandes + chevrons”
            <Flow />
          ) : (
            // Rendu générique (fallback)
            <div className="space-y-4">
              {sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-white border border-black/10 shadow-sm px-4 py-3"
                >
                  <p className="font-medium mb-2">{sec.title}</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {sec.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
              {sections.length === 0 && (
                <p className="text-sm text-slate-500">Contenu détaillé à venir.</p>
              )}
            </div>
          )
        ) : (
          // 🔸 Onglet POSOLOGIE — V2 UI (dose + prépa + durée + précautions)
          <div className="space-y-4">
            {/* Poids global */}
            <div>
              <label className="text-slate-600 text-sm">Poids (kg)</label>
              <input
                type="number"
                min="1"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="mt-1 w-full rounded-full border border-black/10 shadow-sm px-4 py-2"
              />
            </div>

            {/* Doses + infos d’administration */}
            {drugs.map((d) => {
              const rule = DOSING_RULES[d.id];
              const overrides = WEIGHT_OVERRIDES[d.id] ?? [];
              let result = rule ? computeDose(weightKg, rule, overrides) : null;

              // Cas particulier : Salbutamol AE → dose selon âge si connu
              if (d.id === "salbutamol-ae" && ageMonths != null) {
                const mg = ageMonths <= 72 ? 2.5 : 5; // ≤6 ans = 2,5 mg ; >6 ans = 5 mg
                result = {
                  ...result,
                  doseMg: mg,
                  source: "rule" as const,
                  note: "Dose liée à l’âge (≤6 ans: 2,5 mg ; >6 ans: 5 mg)",
                  route: "AE",
                };
              }

              const info = DRUG_INFOS[d.id];

              return (
                <div
                  key={d.id}
                  className="rounded-xl bg-white border border-black/10 shadow-sm px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">
                      {d.name} {d.route ? <span className="text-slate-500">— {d.route}</span> : null}
                    </p>
                  </div>

                  {/* Ligne dose */}
                  {!result ? (
                    <p className="text-sm text-slate-600 mt-1">Règle non définie.</p>
                  ) : Number.isNaN(result.doseMg) ? (
                    <p className="text-sm text-slate-600 mt-1">
                      {result.note ?? "Voir protocole."}
                    </p>
                  ) : (
                    <div className="text-sm text-slate-800 mt-1">
                      Dose : <strong>{formatMg(result.doseMg)}</strong> pour {weightKg} kg
                      {result.frequency && (
                        <>
                          {" "}
                          — <span className="text-slate-500">{result.frequency}</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Méta-infos (prépa / durée / précautions) */}
                  <div className="mt-2 text-xs text-slate-600 space-y-1">
                    {info?.prep && <div>• Prépa : {info.prep}</div>}
                    {info?.admin && <div>• Admin : {info.admin}</div>}
                    {info?.duration && <div>• Durée : {info.duration}</div>}
                    {info?.caution && <div>• ⚠️ {info.caution}</div>}
                    <div className="text-[11px] text-slate-500">
                      source: {result ? result.source : "rule"}
                      {result?.note ? ` — ${result.note}` : ""}
                      {result?.route ? ` — voie ${result.route}` : ""}
                      {result?.maxDailyMg ? ` — max/jour: ${Math.round(result.maxDailyMg)} mg` : ""}
                    </div>
                  </div>
                </div>
              );
            })}

            {drugs.length === 0 && (
              <p className="text-sm text-slate-500">
                Aucun médicament lié à ce protocole (à compléter).
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
