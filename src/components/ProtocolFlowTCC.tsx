"use client";

import { useState } from "react";

import AgeWeightPicker from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { useAppStore } from "@/store/useAppStore";
import { formatMg } from "@/lib/units";

const MIN_W = 3;
const MAX_W = 120;
const DEFAULT_W = 20;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

const formatMl = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return "—";
  const v = value as number;
  if (v >= 1000) return `${Number((v / 1000).toFixed(v >= 10000 ? 0 : 1))} L`;
  if (v >= 100) return `${Math.round(v)} mL`;
  return `${Number(v.toFixed(v >= 10 ? 1 : 2))} mL`;
};

const formatDose = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return "—";
  return formatMg(value as number);
};

const formatG = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return "—";
  const v = value as number;
  return `${Number(v.toFixed(v >= 10 ? 0 : 1))} g`;
};

const SEVERITY_META = {
  leger: {
    label: "TCC léger",
    badge: "GCS 14–15",
    subtitle: "PECARN et surveillance rapprochée",
    bg: "bg-emerald-50",
  },
  modere: {
    label: "TCC modéré",
    badge: "GCS 9–13",
    subtitle: "Scanner + avis spécialisé",
    bg: "bg-amber-50",
  },
  severe: {
    label: "TCC sévère",
    badge: "GCS ≤ 8",
    subtitle: "Réanimation et traitement HTIC",
    bg: "bg-rose-50",
  },
} as const;

type SeverityKey = keyof typeof SEVERITY_META;

export default function ProtocolFlowTCC() {
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);
  const [severity, setSeverity] = useState<SeverityKey>("leger");

  const weightKg = clampWeight(weightFromStore);

  const bolus20 = weightKg * 20;
  const paracetamolMg = Math.min(weightKg * 15, 1000);
  const midazolamIvMg = Math.min(weightKg * 0.1, 4);
  const ketamineMg = weightKg * 2;
  const rocuroniumMg = weightKg * 1;
  const mannitolLowG = weightKg * 0.5;
  const mannitolHighG = weightKg * 1;
  const naclHypertonicMl = weightKg * 5;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#1D4ED8] to-[#1E3A8A] px-4 pt-6 pb-5 text-white shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-wide leading-tight">Traumatisme crânien pédiatrique</h1>
        <p className="text-sm text-white/90 mt-1">
          Stabiliser ABCDE, identifier les signes de gravité et appliquer la conduite adaptée à la sévérité (PECARN).
        </p>
        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Évaluation initiale : ABCDE + GCS"
            subtitle="Stabiliser d’abord, catégoriser ensuite"
            gradient="from-blue-500 via-sky-500 to-cyan-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A – Airway"
              items={[
                "Libération des voies aériennes + immobilisation rachidienne si mécanisme violent.",
                "GCS ≤ 8 : intubation orotrachéale d’emblée.",
              ]}
            />
            <FlowBlock
              title="B – Breathing"
              items={[
                "Objectif SpO₂ 94–98 % avec capnographie si ventilé.",
                "O₂ masque haute concentration 10–15 L/min si détresse ou TCC sévère.",
              ]}
            />
            <FlowBlock
              title="C – Circulation"
              items={[
                `Remplissage : NaCl 0,9 % ${formatMl(bolus20)} (20 mL/kg) si choc ou hypovolémie.`,
                "Prévenir toute hypotension : maintenir une PAM adaptée à l’âge.",
              ]}
            />
            <FlowBlock
              title="D – Disability"
              items={[
                "Évaluer GCS, pupilles (symétrie, réactivité) et déficit focal.",
                `Convulsions : Midazolam IV ${formatDose(midazolamIvMg)} (0,1 mg/kg, max 4 mg) ou IN 0,2 mg/kg.`,
              ]}
            />
            <FlowBlock
              title="E – Exposure"
              items={[
                "Déshabiller, rechercher plaies, hématome, signe du casque.",
                "Mesurer glycémie capillaire et température.",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Signes imposant imagerie urgente + avis neurochir"
            subtitle="Scanner et évacuation rapide"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <FlowBlock
            title="Gravité clinique"
            items={[
              "GCS < 15 persistant ou ≤ 13 d’emblée.",
              "Déficit focal, anisocorie / mydriase, convulsions post-traumatiques.",
              "Vomissements incoercibles, altération de conscience > 2 h.",
              "Fracture ouverte/embarrure, hématome scalp massif < 2 ans, suspicion de maltraitance ou mécanisme violent.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Catégoriser le TCC"
            subtitle="Conduite spécifique selon la sévérité"
            gradient="from-emerald-500 via-lime-500 to-teal-500"
          />
          <div className="rounded-3xl border border-black/10 bg-white/90 p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(SEVERITY_META) as SeverityKey[]).map((key) => {
                const meta = SEVERITY_META[key];
                const active = severity === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSeverity(key)}
                    className={`flex flex-col rounded-2xl border px-3 py-2 text-left text-sm font-semibold transition ${
                      active
                        ? "border-slate-900 bg-slate-900 text-white shadow"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    <span>{meta.label}</span>
                    <span className={active ? "text-white/80 text-xs" : "text-slate-500 text-xs"}>{meta.badge}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4">
              <FlowBlock
                title={`${SEVERITY_META[severity].label} (${SEVERITY_META[severity].badge})`}
                subtitle={SEVERITY_META[severity].subtitle}
                items={
                  severity === "leger"
                    ? [
                        "Appliquer strictement la règle PECARN (< 2 ans / ≥ 2 ans).",
                        "Scanner si facteur de risque majeur, sinon surveillance 3–6 h (neuro toutes 30 min).",
                        `Douleur : Paracétamol ${formatDose(paracetamolMg)} (15 mg/kg, max 1 g).`,
                        "Pas d’AINS ni benzodiazépine en routine.",
                      ]
                    : severity === "modere"
                    ? [
                        "Scanner cérébral en urgence + avis spécialisé.",
                        "O₂ 10–15 L/min, VVP, remplissage selon état, calme et analgésie contrôlée.",
                        "Surveillance continue sur scope, transfert en unité neuro/pédiat dédiée.",
                      ]
                    : [
                        `Séquence rapide : kétamine ${formatDose(ketamineMg)} (2 mg/kg) + rocuronium ${formatDose(rocuroniumMg)} (1 mg/kg).`,
                        "Ventilation : normocapnie (PaCO₂ 35–40 mmHg), hyperventilation uniquement si signes d’engagement.",
                        "Deux VVP, monitorage complet, glycémie > 0,7 g/L, avis neurochir et scanner prioritaire.",
                      ]
                }
                bg={SEVERITY_META[severity].bg}
              />
            </div>
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Prévention HTIC & traitements adjuvants"
            subtitle="Limiter l’œdème et protéger le cerveau"
            gradient="from-indigo-500 via-purple-500 to-slate-600"
          />
          <FlowBlock
            title="Mesures générales"
            items={[
              "Élever le buste à 30°, aligner la tête, éviter hyperthermie, hypoxie et hypoTA.",
              "Sédation/analgésie continue adaptée, contrôle strict de la capnie et de la natremie.",
            ]}
          />
          <FlowBlock
            title="Osmothérapie"
            items={[
              `Mannitol ${formatG(mannitolLowG)} – ${formatG(mannitolHighG)} (0,5–1 g/kg IV en 20 min) si signes d’HTIC.`,
              `NaCl hypertonique 3 % : ${formatMl(naclHypertonicMl)} (5 mL/kg en 10 min).`,
            ]}
          />
          <FlowBlock
            title="Situations particulières"
            items={[
              "< 1 an : haut risque de lésions occultes, hématome scalp = facteur PECARN.",
              "Trouble de coagulation / anticoagulant : scanner systématique + avis hématologie.",
              "Polytraumatisme : FAST ± scanner corps entier selon état hémodynamique.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation, hospitalisation et sortie"
            subtitle="Sécuriser la surveillance"
            gradient="from-slate-500 via-slate-600 to-slate-800"
          />
          <FlowBlock
            title="Hospitalisation / transfert"
            items={[
              "GCS < 15 persistant, facteurs PECARN, lésions scanner, convulsions, vomissements multiples.",
              "Suspicion de traumatisme non accidentel ou contexte social défavorable.",
              "Transfert en réanimation si TCC sévère, besoin de ventilation ou traitement spécifique HTIC.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "GCS = 15, examen normal, aucun facteur de risque PECARN.",
              "Enfant surveillable à domicile, parents informés avec consignes écrites.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
