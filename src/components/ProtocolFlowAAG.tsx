"use client";

import { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { computeDose } from "@/lib/dosing";
import { DOSING_RULES, WEIGHT_OVERRIDES } from "@/data/drugs";
import { formatMg } from "@/lib/units";
import { estimateAgeFromWeight } from "@/lib/ageWeight"; // info UI facultative
import { ageLabelToMonths } from "@/lib/age";             // ← pour convertir le label en mois
import AgeWeightPicker from "@/components/AgeWeightPicker";

/* ---------- Couleurs ---------- */
const ACCENT = {
  yellow: { header: "bg-[#F9A825]", body: "bg-[#FFF8E1]", border: "border-[#F9A825]" },
  gray:   { header: "bg-[#455A64]", body: "bg-[#ECEFF1]", border: "border-[#455A64]" },
  blue:   { header: "bg-[#1E88E5]", body: "bg-[#E3F2FD]", border: "border-[#1E88E5]" },
  green:  { header: "bg-[#43A047]", body: "bg-[#E8F5E9]", border: "border-[#43A047]" },
  teal:   { header: "bg-[#00897B]", body: "bg-[#E0F2F1]", border: "border-[#00897B]" },
  orange: { header: "bg-[#EF6C00]", body: "bg-[#FFF3E0]", border: "border-[#EF6C00]" },
  red:    { header: "bg-[#E53935]", body: "bg-[#FFEBEE]", border: "border-[#E53935]" },
  dark:   { header: "bg-[#263238]", body: "bg-[#ECEFF1]", border: "border-[#263238]" },
} as const;

/* ---------- UI helpers ---------- */
const BoldDose: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="font-extrabold text-gray-900">{children}</span>
);

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="ml-2 text-[10px] tracking-wider uppercase bg-black/15 text-black/70 rounded-md px-2 py-0.5">
    {children}
  </span>
);

const Card: React.FC<{
  title: string;
  accent: keyof typeof ACCENT;
  subtitle?: string;
  rightBadge?: string;
  children?: React.ReactNode;
}> = ({ title, accent, subtitle, rightBadge, children }) => {
  const c = ACCENT[accent];
  return (
    <div className={`rounded-3xl overflow-hidden border ${c.border}`}>
      <div className={`px-4 py-2 text-white font-semibold flex items-center justify-between ${c.header} rounded-t-3xl`}>
        <span>{title}</span>
        {rightBadge && <Badge>{rightBadge}</Badge>}
      </div>
      <div className={`px-4 py-3 ${c.body}`}>
        {subtitle && <div className="text-sm text-gray-700 mb-1">{subtitle}</div>}
        {children}
      </div>
    </div>
  );
};

/* ---------- Helpers poids/overrides/421 ---------- */
function pickEffectiveWeight(w?: number | null) {
  if (!Number.isFinite(w as number) || (w as number) <= 0) return undefined;
  const rounded = Math.round(w as number);
  const override = (WEIGHT_OVERRIDES as any)?.[rounded];
  return Number.isFinite(override) ? override : (w as number);
}
function maintenance421(kg?: number) {
  const w = pickEffectiveWeight(kg);
  if (!Number.isFinite(w)) return undefined;
  let rate = 0;
  const a = Math.min(w as number, 10);
  rate += 4 * a;
  if ((w as number) > 10) {
    const b = Math.min((w as number) - 10, 10);
    rate += 2 * b;
  }
  if ((w as number) > 20) {
    rate += 1 * ((w as number) - 20);
  }
  return Math.round(rate);
}

export default function ProtocolFlowAAG() {
  /* ---- Store (scalaires) ---- */
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);
  const weightKg = useAppStore((s) => s.weightKg);
  const setWeightKgStore = useAppStore((s) => s.setWeightKg);

  /* ---- Conversions et dérivés ---- */
  const ageMonths = useMemo(() => ageLabelToMonths(ageLabel), [ageLabel]);
  const ageYears = useMemo(
    () => (Number.isFinite(ageMonths) ? Math.floor((ageMonths as number) / 12) : undefined),
    [ageMonths]
  );
  const effWeight = pickEffectiveWeight(weightKg);

  // Doses “selon l’âge”
  const doseSalbutamolNebMg = useMemo(() => {
    if (ageYears === undefined) return undefined;
    return ageYears < 6 ? 2.5 : 5; // <6 ans : 2,5 mg ; ≥6 ans : 5 mg
  }, [ageYears]);
  const doseIpratropiumNebMg = useMemo(() => {
    if (ageYears === undefined) return undefined;
    return ageYears <= 6 ? 0.25 : 0.5; // ≤6 ans : 0,25 mg ; >6 ans : 0,5 mg
  }, [ageYears]);

  // Doses pondérales (computeDose si dispo, sinon fallback)
  const solumedrolMg = useMemo(() => {
    if (!Number.isFinite(effWeight)) return undefined;
    try {
      const computed = computeDose?.(DOSING_RULES, "methylprednisolone_iv", effWeight as number);
      if (computed?.valueMg) return Math.round(computed.valueMg);
    } catch {}
    return Math.round((effWeight as number) * 2);
  }, [effWeight]);

  const mgso4BolusMg = useMemo(() => {
    if (!Number.isFinite(effWeight)) return undefined;
    return Math.round((effWeight as number) * 20);
  }, [effWeight]);
  const mgso4PerfMgPerHour = useMemo(() => {
    if (!Number.isFinite(effWeight)) return undefined;
    return Math.round((effWeight as number) * 10);
  }, [effWeight]);

  const m421 = useMemo(() => maintenance421(effWeight), [effWeight]);
  const vtRange = useMemo(() => {
  if (!Number.isFinite(effWeight)) return undefined;
  const w = effWeight as number;
  return {
    min: Math.round(w * 6), // mL
    max: Math.round(w * 8), // mL
  };
}, [effWeight]);

  /* ---------- Rendu ---------- */
  return (
    <div className="pb-6">
      {/* Header + Picker (style anaphylaxie) */}
      <div className="rounded-3xl bg-gradient-to-b from-[#FF7F66] to-[#FFA07A] px-4 pt-6 pb-5 text-white shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-wide">ASTHME SÉVÈRE 💨</h1>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}                 // ← on passe le setter du store
            weightKg={Number.isFinite(weightKg) ? (weightKg as number) : null}
            setWeightKg={(v) => setWeightKgStore(v ?? 0)}       // adapter null → 0 (ou choisis ta stratégie)
          />
          {/* Indice visuel facultatif : */}
          {/* <p className="mt-2 text-xs text-gray-500">
            Indice d’âge d’après le poids : {estimateAgeFromWeight(weightKg ?? null)}
          </p> */}
        </div>
      </div>

      {/* Corps du protocole */}
      <div className="mt-4 space-y-3 px-4">
        <Card title="≥ 3ᵉ épisode de dyspnée sifflante chez NRS" accent="yellow" />

        <Card title="½ assis, scope, O₂ titrée" accent="gray" subtitle="Objectif SpO₂ 94–98 %" />

        <Card
          title="Aérosols en continu 1h + Ipratropium (1 dose/8h)"
          accent="blue"
          subtitle="Sous O₂ 6–8 L/min"
          rightBadge="1ʳᵉ ligne"
        >
          <ul className="text-sm leading-6">
            <li>
              Salbutamol (nébuliseur) :{" "}
              <BoldDose>
                {Number.isFinite(doseSalbutamolNebMg as number) ? `${doseSalbutamolNebMg} mg` : "—"}
              </BoldDose>{" "}
              par séance{" "}
              <span className="text-gray-600">(&#60; 6 ans : 2,5 mg ; ≥ 6 ans : 5 mg)</span>
            </li>
            <li>
              Ipratropium (nébuliseur) :{" "}
              <BoldDose>
                {Number.isFinite(doseIpratropiumNebMg as number) ? `${doseIpratropiumNebMg} mg` : "—"}
              </BoldDose>{" "}
              toutes les 8 h{" "}
              <span className="text-gray-600">(≤ 6 ans : 0,25 mg ; &#62; 6 ans : 0,5 mg)</span>
            </li>
          </ul>
        </Card>

        <Card title="Solumédrol IV" accent="green">
          <div className="text-sm">
            Dose :{" "}
            <BoldDose>
              {Number.isFinite(solumedrolMg as number) ? formatMg(solumedrolMg as number) : "—"}
            </BoldDose>{" "}
            <span className="text-gray-700">(2 mg/kg)</span>
          </div>
        </Card>

        <Card title="Hydratation G5%" accent="teal" subtitle="Règle 4–2–1 « 421 » ; adapter +1/3 si besoin">
          <div className="text-sm">
            Débit d’entretien ≈{" "}
            <BoldDose>{Number.isFinite(m421 as number) ? `${m421} mL/h` : "—"}</BoldDose>{" "}
            <span className="text-gray-700">
              ({Number.isFinite(effWeight) ? `${(effWeight as number).toFixed(1)} kg` : "—"} • 4–2–1)
            </span>
          </div>
        </Card>

        <Card title="Sulfate de Magnésium IV" accent="orange" rightBadge="2ᵉ ligne">
          <ul className="text-sm leading-6">
            <li>
              Bolus <span className="text-gray-700">sur 30 min</span> :{" "}
              <BoldDose>
                {Number.isFinite(mgso4BolusMg as number) ? formatMg(mgso4BolusMg as number) : "—"}
              </BoldDose>{" "}
              <span className="text-gray-700">(20 mg/kg)</span>
            </li>
            <li>
              Entretien :{" "}
              <BoldDose>
                {Number.isFinite(mgso4PerfMgPerHour as number) ? `${mgso4PerfMgPerHour} mg/h` : "—"}
              </BoldDose>{" "}
              <span className="text-gray-700">(10 mg/kg/h)</span>
            </li>
          </ul>
        </Card>

        <Card
          title="Intubation Orotrachéale (IOT)"
          accent="red"
          rightBadge="3ᵉ ligne"
          subtitle="ISR : Kétamine + Célocurine si pas de CI (SIT à ballonnet)"
        >
          <div className="text-sm text-gray-800">
            <div className="text-sm text-gray-800">
              Ventilation : FiO₂ 100 %, I/E 1/3–1/5, PEP 0–2, VT{" "}
              <span className="font-extrabold text-gray-900">
                {vtRange ? `${vtRange.min}–${vtRange.max} mL` : "—"}
              </span>{" "}
              (6–8 mL/kg). Sédation profonde ± curarisation.
            </div>
          </div>
        </Card>

        <Card title="ECMO ?" accent="dark" subtitle="Hypoxémie majeure réfractaire / acidose" />
      </div>
    </div>
  );
}
