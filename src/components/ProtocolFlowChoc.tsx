"use client";

import type { ReactNode } from "react";

import AgeWeightPicker from "@/components/AgeWeightPicker";
import { useAppStore } from "@/store/useAppStore";
import { ageLabelToMonths } from "@/lib/age";
import { formatMg } from "@/lib/units";

const COLUMN_TONES = {
  blue: {
    header: "bg-gradient-to-r from-[#1976D2] to-[#1E88E5]",
    body: "bg-[#E3F2FD]",
    border: "border-[#1E88E5]",
  },
  red: {
    header: "bg-gradient-to-r from-[#C62828] to-[#E53935]",
    body: "bg-[#FFEBEE]",
    border: "border-[#E53935]",
  },
  yellow: {
    header: "bg-gradient-to-r from-[#F9A825] to-[#FDD835]",
    body: "bg-[#FFF8E1]",
    border: "border-[#FBC02D]",
  },
} as const;

const DEFAULT_WEIGHT = 25;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_WEIGHT;
  return Math.min(Math.max(value as number, 3), 100);
};

const formatMl = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return "—";
  const v = value as number;
  if (v >= 1000) return `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)} L`;
  if (v >= 100) return `${Math.round(v)} mL`;
  return `${Number(v.toFixed(1))} mL`;
};

const formatUg = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return "—";
  const v = value as number;
  return `${Number(v.toFixed(v < 10 ? 2 : 1))} µg/min`;
};

const formatMgRange = (min?: number | null, max?: number | null) => {
  if (!Number.isFinite(min ?? NaN) && !Number.isFinite(max ?? NaN)) return "—";
  const m = Number.isFinite(min ?? NaN) ? formatMg(min as number) : null;
  const M = Number.isFinite(max ?? NaN) ? formatMg(max as number) : null;
  if (m && M) return `${m} – ${M}`;
  return m ?? M ?? "—";
};

type ColumnTone = keyof typeof COLUMN_TONES;

function Column({
  tone,
  title,
  subtitle,
  children,
}: {
  tone: ColumnTone;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const palette = COLUMN_TONES[tone];
  return (
    <div className={`rounded-[28px] overflow-hidden border shadow-sm ${palette.border}`}>
      <div className={`${palette.header} px-4 py-3 text-white`}>
        <p className="text-sm font-semibold tracking-wide uppercase">{title}</p>
        {subtitle && <p className="text-[12px] text-white/90">{subtitle}</p>}
      </div>
      <div className={`${palette.body} px-4 py-4 text-sm text-slate-800 space-y-4`}>{children}</div>
    </div>
  );
}

function BubbleSection({
  title,
  children,
  accent,
}: {
  title: string;
  children: ReactNode;
  accent?: "left" | "center" | "right";
}) {
  const accentCls =
    accent === "center"
      ? "border-red-200 bg-white/70"
      : accent === "right"
      ? "border-amber-200 bg-white/70"
      : "border-sky-200 bg-white/70";

  return (
    <div className={`rounded-2xl border ${accentCls} px-3 py-3 space-y-2 shadow-sm`}>
      <p className="text-[13px] font-semibold text-slate-900 uppercase tracking-wide">{title}</p>
      <div className="text-[13px] text-slate-700 space-y-1.5">{children}</div>
    </div>
  );
}

function TargetPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-[12px] font-semibold text-slate-800">
      {label}
    </span>
  );
}

export default function ProtocolFlowChoc() {
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  const weightKg = clampWeight(weightFromStore);
  const ageMonths = ageLabelToMonths(ageLabel);
  const ageYears = ageMonths != null ? ageMonths / 12 : null;
  const estimatedAgeYears =
    ageYears ?? (Number.isFinite(weightKg) ? Math.min(Math.max((weightKg as number) / 3.5, 0), 18) : null);

  const crystalloidMin = weightKg * 10;
  const crystalloidMax = weightKg * 20;

  const noradUg = weightKg * 0.1;
  const pasTarget = estimatedAgeYears != null && estimatedAgeYears > 1 ? Math.round(70 * estimatedAgeYears) : null;

  const fibrinoMin = weightKg * 30;
  const fibrinoMax = weightKg * 50;

  const calciumMg = weightKg * 20;
  const calciumMl = weightKg * 0.2; // CaCl2 10% = 100 mg/mL

  const isTwelveOrMore = (estimatedAgeYears ?? 0) >= 12;
  const exacylBolusMg = isTwelveOrMore ? 1000 : weightKg * 10;
  const exacylInfusionMgPerH = isTwelveOrMore ? 125 : weightKg * 10;

  return (
    <div className="pb-6">
      {/* HEADER */}
      <div className="rounded-3xl bg-gradient-to-b from-[#C62828] to-[#FF7043] px-4 pt-6 pb-5 text-white shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-wide">CHOC HÉMORRAGIQUE 🩸</h1>
        <p className="text-sm text-white/90 mt-1">
          Objectif ultime : <span className="font-semibold">stopper l’hémorragie le plus vite possible</span>
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

      <div className="mt-5 px-2 sm:px-4">
        {/* Hint swipe uniquement mobile */}
        <div className="mb-3 px-1 sm:hidden">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
            <span>👆</span>
            <span>Balayez horizontalement pour voir les 3 colonnes</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="min-w-[920px] grid grid-cols-3 gap-4 pr-2">
            {/* Colonne gauche */}
            <Column tone="blue" title="Réanimation initiale" subtitle="Stabiliser et perfuser">
              <BubbleSection title="Débuter immédiatement" accent="left">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Libérer les VAS</li>
                  <li>Oxygène — SpO₂ &gt; 95 %</li>
                  <li>2 VVP gros calibre ou IO</li>
                  <li>Bilan biologique complet</li>
                </ul>
              </BubbleSection>

              <BubbleSection title="Remplissage vasculaire" accent="left">
                <p>
                  Cristalloïdes <strong>10–20 mL/kg</strong> ± colloïdes
                  <br />
                  Volume calculé :
                  <strong className="ml-1">{formatMl(crystalloidMin)}</strong>
                  {" – "}
                  <strong>{formatMl(crystalloidMax)}</strong>
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="rounded-xl bg-white/80 px-3 py-2">
                    <p className="text-[12px] font-semibold text-[#1E88E5] uppercase tracking-wide">
                      Sans traumatisme crânien
                    </p>
                    <ul className="mt-1 list-disc pl-4 space-y-0.5">
                      <li>
                        PAM ≥ 45 mmHg <span className="text-[11px] text-slate-600">(≤ 2 ans)</span>
                      </li>
                      <li>
                        PAM ≥ 55 mmHg <span className="text-[11px] text-slate-600">({'>'} 2 ans)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-xl bg-white/80 px-3 py-2">
                    <p className="text-[12px] font-semibold text-[#1E88E5] uppercase tracking-wide">
                      Traumatisme crânien grave
                    </p>
                    <ul className="mt-1 list-disc pl-4 space-y-0.5">
                      <li>
                        PAM ≥ 50 mmHg <span className="text-[11px] text-slate-600">(≤ 2 ans)</span>
                      </li>
                      <li>
                        PAM ≥ 65 mmHg <span className="text-[11px] text-slate-600">({'>'} 2 ans)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </BubbleSection>

              <BubbleSection title="Si PAS insuffisante après remplissage" accent="left">
                <p>
                  Noradrénaline <strong>0,1 µg/kg/min</strong>
                  <br />
                  Débit calculé : <strong>{formatUg(noradUg)}</strong>
                </p>
                <p>
                  Objectif PAS{" "}
                  <TargetPill
                    label={
                      pasTarget
                        ? `> ${pasTarget} mmHg`
                        : "> 70 × âge (ans)"
                    }
                  />
                </p>
              </BubbleSection>
            </Column>

            {/* Colonne centrale */}
            <Column tone="red" title="Évaluation E-FAST" subtitle="Identifier la source hémorragique">
              <BubbleSection title="Scanner ciblé par l’écho" accent="center">
                <p>
                  E-FAST au lit du patient : abdomen, thorax, péricarde, pelvis.
                  Orientation immédiate vers le geste d’hémostase adapté.
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Chirurgie d’hémostase</li>
                  <li>Embolisation radiologique</li>
                  <li>Endoscopie / tamponnement</li>
                </ul>
              </BubbleSection>

              <div className="rounded-2xl border border-red-300 bg-white/80 px-4 py-3 shadow-sm">
                <p className="text-sm font-semibold text-red-700 uppercase tracking-wide">
                  Objectif central
                </p>
                <p className="mt-1 text-[13px] text-slate-800">
                  <strong>STOPPER LE SAIGNEMENT</strong> le plus vite possible.
                </p>
                <ul className="mt-2 list-disc pl-4 text-[13px] text-slate-700 space-y-1">
                  <li>Garrot, pansement compressif ou hémostatique</li>
                  <li>Ceinture pelvienne si suspicion de fracture</li>
                  <li>Chirurgie, embolisation, endoscopie selon le foyer</li>
                </ul>
              </div>
            </Column>

            {/* Colonne droite */}
            <Column tone="yellow" title="Hémostase pharmacologique" subtitle="Transfusion massive guidée">
              <BubbleSection title="Acide tranexamique (EXACYL)" accent="right">
                <p>
                  À administrer idéalement <strong>&lt; 3 h</strong> après le traumatisme.
                </p>
                <p className="text-[13px]">
                  Bolus : <strong>{formatMg(exacylBolusMg)}</strong> sur 10 min
                  <br />
                  Perfusion : <strong>{formatMg(exacylInfusionMgPerH)}</strong>/h
                </p>
                <p className="text-[12px] text-amber-700">
                  {isTwelveOrMore ? "≥ 12 ans : 1 g puis 1 g/8 h" : "< 12 ans : 10 mg/kg puis 10 mg/kg/h"}
                </p>
              </BubbleSection>

              <BubbleSection title="Transfusion massive" accent="right">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Ratio PFC : CGR = 1:2 → 1:1</li>
                  <li>Hb cible : 7–10 g/dL (sans TC) · {'>'} 10 g/dL (TC grave)</li>
                  <li>Plaquettes : {'>'} 50 G/L (sans TC) · {'>'} 100 G/L (TC grave)</li>
                </ul>
              </BubbleSection>

              <BubbleSection title="Fibrinogène" accent="right">
                <p>
                  Clottafact <strong>30–50 mg/kg</strong>
                  <br />Objectif &gt; 1,5 g/L
                </p>
                <p>
                  Dose calculée : <strong>{formatMgRange(fibrinoMin, fibrinoMax)}</strong>
                </p>
              </BubbleSection>

              <BubbleSection title="Triade létale" accent="right">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Température ≥ 36 °C</li>
                  <li>pH &gt; 7,20</li>
                  <li>
                    Ca ionisé &gt; 0,9 mmol/L → CaCl₂ 20 mg/kg
                    <br />
                    <span className="text-[12px] text-slate-600">
                      {formatMg(calciumMg)} ≈ {formatMl(calciumMl)} (10 %)
                    </span>
                  </li>
                </ul>
              </BubbleSection>
            </Column>
          </div>
        </div>

        <div className="mt-3">
          <div className="rounded-3xl border border-red-400 bg-gradient-to-r from-red-500 via-red-500/90 to-orange-500 text-white px-5 py-4 text-center shadow">
            <p className="text-sm font-semibold tracking-wide uppercase">Action prioritaire</p>
            <p className="mt-1 text-lg font-extrabold">STOPPER LE SAIGNEMENT</p>
            <p className="mt-1 text-[13px] text-white/90">
              Garrot · Pansement hémostatique · Ceinture pelvienne · Chirurgie / Endoscopie / Embolisation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
