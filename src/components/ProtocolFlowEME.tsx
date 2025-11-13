"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import AgeWeightPicker from "@/components/AgeWeightPicker";
import { useAppStore } from "@/store/useAppStore";

const ACCENT = {
  slate:  { header: "bg-[#546E7A]", body: "bg-[#ECEFF1]", border: "border-[#546E7A]" },
  amber:  { header: "bg-[#F9A825]", body: "bg-[#FFF8E1]", border: "border-[#F9A825]" },
  blue:   { header: "bg-[#1E88E5]", body: "bg-[#E3F2FD]", border: "border-[#1E88E5]" },
  magenta:{ header: "bg-[#D81B60]", body: "bg-[#FCE4EC]", border: "border-[#D81B60]" },
  orange: { header: "bg-[#FB8C00]", body: "bg-[#FFF3E0]", border: "border-[#FB8C00]" },
  teal:   { header: "bg-[#00897B]", body: "bg-[#E0F2F1]", border: "border-[#00897B]" },
  red:    { header: "bg-[#C62828]", body: "bg-[#FFEBEE]", border: "border-[#C62828]" },
  purple: { header: "bg-[#6A1B9A]", body: "bg-[#F3E5F5]", border: "border-[#6A1B9A]" },
} as const;

type AccentKey = keyof typeof ACCENT;

const BoldDose = ({ children }: { children: ReactNode }) => (
  <span className="font-semibold text-gray-900">{children}</span>
);

const Badge = ({ children }: { children: ReactNode }) => (
  <span className="ml-2 text-[10px] tracking-wider uppercase bg-black/15 text-black/70 rounded-md px-2 py-0.5">
    {children}
  </span>
);

type CardProps = {
  title: string;
  accent: AccentKey;
  subtitle?: string;
  rightBadge?: string;
  children?: ReactNode;
};

function Card({ title, accent, subtitle, rightBadge, children }: CardProps) {
  const palette = ACCENT[accent];
  return (
    <div className={`rounded-3xl overflow-hidden border ${palette.border}`}>
      <div className={`px-4 py-2 text-white font-semibold flex items-center justify-between ${palette.header} rounded-t-3xl`}>
        <span>{title}</span>
        {rightBadge ? <Badge>{rightBadge}</Badge> : null}
      </div>
      <div className={`px-4 py-3 text-sm ${palette.body}`}>
        {subtitle ? <p className="text-gray-800/90 mb-2">{subtitle}</p> : null}
        {children}
      </div>
    </div>
  );
}

function pickEffectiveWeight(w?: number | null) {
  if (!Number.isFinite(w as number) || (w as number) <= 0) return undefined;
  return Number((w as number).toFixed(1));
}

function roundTo(value: number, step: number) {
  if (!step) return value;
  return Math.round(value / step) * step;
}

function computeDose(
  weight: number | undefined,
  mgPerKg: number,
  options: { max?: number; round?: number } = {}
) {
  if (!Number.isFinite(weight)) return undefined;
  let value = (weight as number) * mgPerKg;
  if (options.max) value = Math.min(value, options.max);
  if (options.round) value = roundTo(value, options.round);
  return value;
}

function formatNumber(value: number) {
  if (value >= 100) return value.toFixed(0);
  if (value >= 10) return value.toFixed(1);
  return value.toFixed(2);
}

function formatDose(value: number | undefined, unit = "mg") {
  if (!Number.isFinite(value)) return "—";
  return `${Number(formatNumber(value as number))} ${unit}`;
}

function formatRange(
  min: number | undefined,
  max: number | undefined,
  unit = "mg"
) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return "—";
  return `${Number(formatNumber(min as number))}–${Number(formatNumber(max as number))} ${unit}`;
}

export default function ProtocolFlowEME() {
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);
  const weightKg = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  const effWeight = useMemo(() => pickEffectiveWeight(weightKg), [weightKg]);

  const clonazepamMg = useMemo(
    () => computeDose(effWeight, 0.015, { round: 0.005 }),
    [effWeight]
  );
  const diazepamIrMg = useMemo(
    () => computeDose(effWeight, 0.5, { max: 10, round: 0.5 }),
    [effWeight]
  );
  const midazolamBuccalMg = useMemo(
    () => computeDose(effWeight, 0.3, { max: 10, round: 0.5 }),
    [effWeight]
  );

  const phenytoinMg = useMemo(
    () => computeDose(effWeight, 20, { max: 1000, round: 25 }),
    [effWeight]
  );
  const phenobarbitalMg = useMemo(
    () => computeDose(effWeight, 15, { max: 1000, round: 25 }),
    [effWeight]
  );
  const levetiracetamMg = useMemo(
    () => computeDose(effWeight, 40, { max: 3000, round: 50 }),
    [effWeight]
  );

  const midazolamBolusMg = useMemo(
    () => computeDose(effWeight, 0.1, { round: 0.05 }),
    [effWeight]
  );
  const midazolamPerfMin = useMemo(
    () => computeDose(effWeight, 3),
    [effWeight]
  );
  const midazolamPerfMax = useMemo(
    () => computeDose(effWeight, 4),
    [effWeight]
  );

  const propofolBolusMin = useMemo(
    () => computeDose(effWeight, 1),
    [effWeight]
  );
  const propofolBolusMax = useMemo(
    () => computeDose(effWeight, 3),
    [effWeight]
  );
  const propofolPerfMin = useMemo(
    () => computeDose(effWeight, 3),
    [effWeight]
  );
  const propofolPerfMax = useMemo(
    () => computeDose(effWeight, 4),
    [effWeight]
  );

  return (
    <div className="pb-6">
      <div className="rounded-3xl bg-gradient-to-b from-[#7B1FA2] to-[#AB47BC] px-4 pt-6 pb-5 text-white shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-wide flex items-center gap-2">
          <span>ÉTAT DE MAL ÉPILEPTIQUE</span>
          <span className="text-[22px]">⚡</span>
        </h1>
        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(value) => setAgeLabel(value)}
            weightKg={Number.isFinite(weightKg as number) ? (weightKg as number) : null}
            setWeightKg={(value) => setWeightKg(value ?? 0)}
          />
          <p className="mt-2 text-xs text-gray-500">
            Calculs automatiques pour un poids effectif {Number.isFinite(effWeight) ? `${effWeight} kg` : "—"}.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4 px-4">
        <Card accent="slate" title="Définition">
          <ul className="list-disc space-y-1.5 pl-5 text-gray-800">
            <li>Crise convulsive ≥ 5 minutes ou ≥ 2 crises successives sans reprise de conscience.</li>
            <li>Absence de réponse durable aux mesures de 1ʳᵉ intention = EME confirmé.</li>
          </ul>
        </Card>

        <Card accent="amber" title="ABC immédiat" subtitle="Sécuriser la situation clinique">
          <ul className="list-disc space-y-1.5 pl-5 text-gray-800">
            <li>LVA, aspiration ± canule de Guedel, ventilation assistée si besoin.</li>
            <li>O₂ MHC 15 L/min, VVP rapide (± IO) et sérum salé 0,9 %.</li>
            <li>Glycémie capillaire : corriger toute hypoglycémie.</li>
            <li>Scope ECG, PA, SpO₂, température ; bilans sanguins systématiques.</li>
          </ul>
        </Card>

        <Card accent="blue" title="Surveillance & étiologies">
          <ul className="list-disc space-y-1.5 pl-5 text-gray-800">
            <li>EEG continu si disponible, imagerie cérébrale urgente selon contexte.</li>
            <li>Rechercher et traiter la cause : fièvre, infection SNC, sevrage, intoxication, trouble métabolique.</li>
            <li>Prévenir hypoxie, hypotension, hyperthermie et troubles hydro-électrolytiques.</li>
          </ul>
        </Card>

        <Card accent="magenta" title="Benzodiazépine" rightBadge="1ʳᵉ ligne">
          <ul className="list-disc space-y-1.5 pl-5 text-gray-800">
            <li>
              Clonazépam IV lent : <BoldDose>{formatDose(clonazepamMg)}</BoldDose> (0,015 mg/kg).
            </li>
            <li>
              Si IV non disponible → Diazépam IR : <BoldDose>{formatDose(diazepamIrMg)}</BoldDose> (0,5 mg/kg, max 10 mg).
            </li>
            <li>
              Alternative buccale : Midazolam : <BoldDose>{formatDose(midazolamBuccalMg)}</BoldDose> (0,3 mg/kg, max 10 mg).
            </li>
            <li>Répéter une fois à 5 minutes si convulsions persistantes.</li>
          </ul>
        </Card>

        <Card accent="orange" title="Si persistance après 2 bolus BZD">
          <p className="text-gray-800">
            Prévenir la réanimation, préparer les traitements anti-épileptiques de 2ᵉ ligne et assurer une voie sécurisée.
          </p>
        </Card>

        <Card accent="purple" title="Anti-épileptiques de 2ᵉ ligne" rightBadge="2ᵉ ligne">
          <ul className="list-disc space-y-1.5 pl-5 text-gray-800">
            <li>
              Phénytoïne (20 mg/kg sur 30 min) : <BoldDose>{formatDose(phenytoinMg)}</BoldDose>.
            </li>
            <li>
              ou Phénobarbital (15 mg/kg sur 10 min) : <BoldDose>{formatDose(phenobarbitalMg)}</BoldDose>.
            </li>
            <li>
              ou Lévétiracétam (40 mg/kg sur 10 min) : <BoldDose>{formatDose(levetiracetamMg)}</BoldDose>.
            </li>
            <li>Surveiller ECG, TA et fonctions respiratoires durant les perfusions.</li>
          </ul>
        </Card>

        <Card accent="teal" title="Protection cérébrale">
          <ul className="list-disc space-y-1.5 pl-5 text-gray-800">
            <li>Normothermie, normoglycémie, normocapnie (contrôle gaz du sang).</li>
            <li>Privilégier décubitus dorsal tête 30°, prévenir œdème cérébral.</li>
            <li>Limiter stimulations, antalgiques adaptés, surveillance neurologique rapprochée.</li>
          </ul>
        </Card>

        <Card
          accent="red"
          title="EME réfractaire / Intubation"
          subtitle="Si convulsions persistantes après la 2ᵉ ligne ou détresse respiratoire"
        >
          <ul className="list-disc space-y-1.5 pl-5 text-gray-800">
            <li>Intubation en séquence rapide (ISR) avec protection des VA ; ventilation FiO₂ 100 %.</li>
            <li>
              Hypnovel® bolus : <BoldDose>{formatDose(midazolamBolusMg)}</BoldDose> puis
              <BoldDose>{` ${formatRange(midazolamPerfMin, midazolamPerfMax, "mg/h")}`}</BoldDose> (coma thérapeutique 24 h).
            </li>
            <li>
              Propofol bolus : <BoldDose>{formatRange(propofolBolusMin, propofolBolusMax)}</BoldDose> puis
              <BoldDose>{` ${formatRange(propofolPerfMin, propofolPerfMax, "mg/h")}`}</BoldDose>.
            </li>
            <li>Discussion réanimation spécialisée ± autres agents (kétamine, curarisation, EEG continu).</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
