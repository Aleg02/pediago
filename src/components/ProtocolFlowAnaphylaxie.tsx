"use client";

import { useMemo, type ReactNode } from "react";

import { useAppStore } from "@/store/useAppStore";
import { ageLabelToMonths } from "@/lib/age";
import { computeDose } from "@/lib/dosing";
import { DOSING_RULES, WEIGHT_OVERRIDES } from "@/data/drugs";
import { formatMg } from "@/lib/units";
import { estimateAgeFromWeight } from "@/components/AgeWeightPicker";

const ACCENT_COLORS = {
  red: {
    header: "bg-[#C62828]",
    body: "bg-[#FCE6E6]",
    border: "border-[#C62828]",
  },
  yellow: {
    header: "bg-[#F9A825]",
    body: "bg-[#FFF8E1]",
    border: "border-[#F9A825]",
  },
  violet: {
    header: "bg-[#6A1B9A]",
    body: "bg-[#F3E5F5]",
    border: "border-[#6A1B9A]",
  },
  orange: {
    header: "bg-[#EF6C00]",
    body: "bg-[#FBE9E7]",
    border: "border-[#EF6C00]",
  },
  grey: {
    header: "bg-[#455A64]",
    body: "bg-[#ECEFF1]",
    border: "border-[#455A64]",
  },
};

const MIN_WEIGHT_KG = 3;
const MAX_WEIGHT_KG = 60;
const DEFAULT_WEIGHT_KG = 10;

function formatMl(volumeMl: number) {
  if (!Number.isFinite(volumeMl)) return "-";
  if (volumeMl >= 1) {
    return `${Number(volumeMl.toFixed(1))} mL`;
  }
  return `${Number(volumeMl.toFixed(2))} mL`;
}

function formatUg(valueUg: number) {
  if (!Number.isFinite(valueUg)) return "-";
  return `${Number(valueUg.toFixed(valueUg < 10 ? 1 : 0))} µg`;
}

const formatDose = (value: number) => {
  return Number.isFinite(value) ? formatMg(value) : "—";
};

type BlockProps = {
  tone: keyof typeof ACCENT_COLORS;
  title: string;
  subtitle?: string;
  bullets?: string[];
  aside?: string;
  footer?: string;
  children?: ReactNode;
};

function ColoredBlock({ tone, title, subtitle, bullets, aside, footer, children }: BlockProps) {
  const palette = ACCENT_COLORS[tone];

  return (
    <div className={`rounded-3xl overflow-hidden shadow-md border ${palette.border}`}>
      <div className={`${palette.header} px-4 py-3 text-white`}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em]">{title}</p>
        {subtitle && <p className="mt-1 text-sm text-white/85">{subtitle}</p>}
      </div>
      <div className={`${palette.body} px-5 py-4 text-sm text-slate-800 space-y-3`}>
        {aside && (
          <p className="text-[13px] font-semibold text-slate-700/90">{aside}</p>
        )}
        {bullets && bullets.length > 0 && (
          <ul className="space-y-1.5 list-disc pl-5">
            {bullets.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
        {children}
        {footer && <p className="text-xs text-slate-600">{footer}</p>}
      </div>
    </div>
  );
}

function ArrowConnector() {
  return (
    <div className="flex justify-center" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-400">
        <path
          d="M12 3v16m0 0l-5-5m5 5l5-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function ProtocolFlowAnaphylaxie() {
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);
  const ageLabel = useAppStore((s) => s.ageLabel);

  const weightKg =
    weightFromStore != null && Number.isFinite(weightFromStore)
      ? Math.min(Math.max(weightFromStore, MIN_WEIGHT_KG), MAX_WEIGHT_KG)
      : DEFAULT_WEIGHT_KG;

  const estimatedAgeLabel = estimateAgeFromWeight(weightKg);

  const onWeightChange = (value: number) => {
    const clamped = Math.min(Math.max(value, MIN_WEIGHT_KG), MAX_WEIGHT_KG);
    setWeightKg(clamped);
    setAgeLabel(estimateAgeFromWeight(clamped));
  };

  const ageMonths = ageLabelToMonths(ageLabel);
  const ageYears = ageMonths != null ? ageMonths / 12 : null;

  const adrenalineIm = useMemo(
    () =>
      computeDose(weightKg, DOSING_RULES["adrenaline-im"], WEIGHT_OVERRIDES["adrenaline-im"]),
    [weightKg]
  );

  const adrenalineImDoseMg = Number.isFinite(adrenalineIm.doseMg) ? adrenalineIm.doseMg : NaN;
  const adrenalineImVolume = Number.isFinite(adrenalineImDoseMg) ? adrenalineImDoseMg / 1 : NaN; // 1 mg/mL

  const solumedrolRange = useMemo(() => {
    const min = weightKg * 1;
    const max = weightKg * 2;
    return { min, max };
  }, [weightKg]);

  const polaramineDoseMg = useMemo(() => weightKg * 0.1, [weightKg]);

  const adrenalineIvseUgPerMin = useMemo(() => weightKg * 0.1, [weightKg]);
  const adrenalineIvseMlPerMin = Number.isFinite(adrenalineIvseUgPerMin)
    ? adrenalineIvseUgPerMin / 20
    : NaN;

  const glucagonDoseMg = useMemo(() => {
    if (weightKg < 20) return 0.5;
    if (weightKg <= 30) return 1;
    return 1; // max dose 1 mg IM/IV
  }, [weightKg]);

  return (
    <div className="w-full">
      <div className="rounded-[32px] border border-slate-200 bg-[#F9F9F9] shadow-xl overflow-hidden">
        <div className="bg-[#C62828] px-6 py-6 text-white">
          <p className="text-xs uppercase tracking-[0.28em] font-semibold text-white/80">Protocole</p>
          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">ANAPHYLAXIE</h2>
            <span className="text-sm text-white/80">Gestion pédiatrique immédiate</span>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-7 sm:py-7 space-y-6">
          <div className="rounded-3xl border border-[#C62828]/30 bg-white/90 px-5 py-5 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C62828]">Poids</p>
                <p className="text-xl font-semibold text-slate-900">{Number(weightKg.toFixed(1))} kg</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C62828]">Âge estimé</p>
                <p className="text-xl font-semibold text-slate-900">
                  {estimatedAgeLabel ?? "-"}
                  {ageYears != null && ageYears > 0
                    ? ` (${ageYears < 1 ? `${Math.round(ageMonths ?? 0)} mois` : `${Number(ageYears.toFixed(1))} ans`})`
                    : ""}
                </p>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C62828]" htmlFor="weight-slider">
                Ajuster le poids
              </label>
              <div className="mt-2">
                <input
                  id="weight-slider"
                  type="range"
                  min={MIN_WEIGHT_KG}
                  max={MAX_WEIGHT_KG}
                  step={0.5}
                  value={weightKg}
                  onChange={(event) => onWeightChange(Number(event.target.value))}
                  className="w-full accent-[#C62828]"
                />
                <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                  <span>{MIN_WEIGHT_KG} kg</span>
                  <span>{MAX_WEIGHT_KG} kg</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-slate-600">
              <p>Les doses ci-dessous se mettent à jour automatiquement selon le poids ajusté ci-dessus.</p>
            </div>
          </div>

          <div className="space-y-5">
            <ColoredBlock
              tone="red"
              title="ATTEINTE CARDIO-VASCULAIRE OU RESPIRATOIRE"
              subtitle="Adrénaline IM 0,01 mg/kg (max 0,5 mg)"
              bullets={[
                "Injection face latéro-externe cuisse",
                "Éviction allergène immédiate",
              ]}
              footer={`Dose calculée : ${formatDose(adrenalineImDoseMg)}${
                Number.isFinite(adrenalineImVolume) ? ` (${formatMl(adrenalineImVolume)} de solution 1 mg/mL)` : ""
              }`}
            />

            <ColoredBlock
              tone="yellow"
              title="SYMPTÔMES GASTRO-INTESTINAUX IMPORTANTS OU PERSISTANTS ?"
              bullets={["Adrénaline IM + surveillance rapprochée"]}
            />

            <div className="grid gap-5 lg:grid-cols-2">
              <ColoredBlock
                tone="grey"
                title="DÉTRESSE CARDIO-VASCULAIRE"
                bullets={[
                  "O₂ haute concentration, scope, VVP, ECG",
                  "Remplissage NaCl 0,9 % 20 mL/kg",
                  "Préparer amines vasopressives / intubation",
                ]}
              />
              <ColoredBlock
                tone="violet"
                title="DÉTRESSE RESPIRATOIRE"
                bullets={[
                  "Adrénaline nébulisée 0,1 mg/kg (max 5 mg)",
                  "Salbutamol aérosol répété, O₂ humidifié",
                  "Envisager VNI / IOT si épuisement",
                ]}
              />
            </div>

            <ArrowConnector />

            <ColoredBlock
              tone="orange"
              title="ABSENCE DE RÉPONSE APRÈS 5–10 MIN"
              bullets={["Contacter réanimateur, préparer voie centrale", "Monitorage continu renforcé"]}
            />

            <div className="grid gap-5 lg:grid-cols-2">
              <ColoredBlock
                tone="yellow"
                title="ADRÉNALINE IVSE : 0,1 µG/KG/MIN (MAX 0,5 MG)"
              >
                <div className="space-y-2 text-sm text-slate-800">
                  <p>
                    Débit calculé : <strong>{formatUg(adrenalineIvseUgPerMin)}</strong> par minute pour {Number(weightKg.toFixed(1))} kg.
                  </p>
                  {Number.isFinite(adrenalineIvseMlPerMin) && (
                    <p className="text-xs text-slate-600">
                      Solution 1 mg/50 mL = 20 µg/mL soit {adrenalineIvseMlPerMin.toFixed(2)} mL/min.
                    </p>
                  )}
                </div>
              </ColoredBlock>
              <ColoredBlock
                tone="grey"
                title="POURSUITE AÉROSOLS"
                bullets={[
                  "Adrénaline nébulisée alternée ± salbutamol",
                  "Ipratropium si bronchospasme sévère",
                  "Kinésithérapie respiratoire à discuter",
                ]}
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <ColoredBlock
                tone="red"
                title="ADRÉNALINE IVSE + NAD 0,2 µG/KG/MIN"
                bullets={[
                  "Réévaluer TA toutes les 2-3 minutes",
                  "Associer vasopresseurs selon réponse",
                ]}
              />
              <ColoredBlock
                tone="grey"
                title="SURVEILLANCE & SORTIE"
                bullets={[
                  "Observation minimale 6 h (risque biphasique)",
                  "Cardio-monitoring ± saturométrie continue",
                  "Prescription kit adrénaline auto-injectable",
                ]}
              />
            </div>

            <ColoredBlock
              tone="orange"
              title="ANTIHISTAMINIQUE & CORTICOÏDE"
            >
              <ul className="space-y-2 text-sm text-slate-800 list-disc pl-5">
                <li>
                  Solumédrol : <strong>{formatDose(solumedrolRange.min)}</strong> – <strong>{formatDose(solumedrolRange.max)}</strong>
                  <span className="text-xs text-slate-600 block">(1–2 mg/kg IV)</span>
                </li>
                <li>
                  Polaramine : <strong>{formatDose(polaramineDoseMg)}</strong> (0,1 mg/kg)
                </li>
              </ul>
            </ColoredBlock>

            <ColoredBlock
              tone="red"
              title="ESCALADE & ANTIDOTES"
            >
              <div className="space-y-1 text-sm text-slate-800">
                <p>
                  Glucagon IM/IV : <strong>{formatDose(glucagonDoseMg)}</strong> (répéter une fois si patient sous bêta-bloquant).
                </p>
                <p className="text-xs text-slate-600">
                  Surveillance invasive si possible, gaz du sang et lactates répétés, prévenir réanimation.
                </p>
              </div>
            </ColoredBlock>
          </div>
        </div>
      </div>
    </div>
  );
}
