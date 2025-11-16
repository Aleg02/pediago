"use client";

import { useMemo, useState } from "react";

import AgeWeightPicker from "@/components/AgeWeightPicker";
import { useAppStore } from "@/store/useAppStore";
import { formatMg } from "@/lib/units";

const MIN_W = 4;
const MAX_W = 80;
const clampWeight = (value: number) => Math.min(Math.max(value, MIN_W), MAX_W);

const pillBase =
  "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2";

const toneStyles = {
  green: {
    border: "border-emerald-200",
    badge: "bg-emerald-500",
    text: "text-emerald-900",
  },
  amber: {
    border: "border-amber-200",
    badge: "bg-amber-500",
    text: "text-amber-900",
  },
  red: {
    border: "border-rose-200",
    badge: "bg-rose-600",
    text: "text-rose-900",
  },
} as const;

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="mb-3">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="space-y-3 text-sm text-slate-700">{children}</div>
    </div>
  );
}

function Calc({ children }: { children: React.ReactNode }) {
  return <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">{children}</span>;
}

function formatMl(value: number) {
  return `${Number(value.toFixed(value >= 10 ? 0 : 1))} mL`;
}

function formatRange(low: number, high: number) {
  if (low === high) return formatMg(low);
  return `${formatMg(low)} – ${formatMg(high)}`;
}

type Severity = "légère" | "modérée" | "sévère";

type Orientation = {
  tone: keyof typeof toneStyles;
  title: string;
  bullets: string[];
};

const severityCards: Record<Severity, Orientation> = {
  "légère": {
    tone: "green",
    title: "PCB légère (enfant stable)",
    bullets: [
      "Fièvre modérée, respiration conservée, prise orale possible.",
      "Amoxicilline PO standard, pas d'examens systématiques.",
      "Surveillance à domicile avec réévaluation médicale à 24–48 h.",
    ],
  },
  "modérée": {
    tone: "amber",
    title: "PCB modérée",
    bullets: [
      "Polypnée franche, tirage modéré, alimentation réduite.",
      "O₂ si SpO₂ < 94 %, amoxicilline haute dose.",
      "Radio thoracique ou biologie si absence d'amélioration à 48 h.",
    ],
  },
  "sévère": {
    tone: "red",
    title: "PCB sévère / hospitalisation",
    bullets: [
      "Tirage marqué, SpO₂ < 92–94 %, incapacité à boire.",
      "O₂ haut débit, VVP, antibiothérapie IV (amoxicilline ou céphalosporines).",
      "Indications d'hospitalisation : < 3 mois, comorbidités, complications.",
    ],
  },
};

function ToggleGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; helper?: string }[];
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">{label}</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              type="button"
              key={opt.value}
              className={`${pillBase} ${
                active
                  ? "border-slate-900 bg-slate-900 text-white shadow"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              }`}
              onClick={() => onChange(opt.value)}
            >
              <span className="font-semibold">{opt.label}</span>
              {opt.helper && (
                <span className="block text-xs font-normal text-slate-500 mt-0.5">{opt.helper}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OrientationCard({ severity }: { severity: Severity }) {
  const data = severityCards[severity];
  const styles = toneStyles[data.tone];
  return (
    <div
      className={`rounded-3xl border-l-8 ${styles.border} bg-white px-4 py-4 shadow-sm ${styles.text}`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className={`inline-flex h-3 w-3 rounded-full ${styles.badge}`} aria-hidden />
        <p className="text-sm font-semibold uppercase tracking-wide">{data.title}</p>
      </div>
      <ul className="list-disc pl-5 space-y-1 text-sm text-slate-800">
        {data.bullets.map((bullet, idx) => (
          <li key={idx}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}

function TreatmentCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <div className="mt-2 space-y-2 text-sm text-slate-700">{children}</div>
    </div>
  );
}

export default function ProtocolFlowPCB() {
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);

  const safeWeight = clampWeight(
    typeof weightFromStore === "number" && !Number.isNaN(weightFromStore) ? weightFromStore : 15
  );

  const [severity, setSeverity] = useState<Severity>("modérée");

  const amoxDailyLow = safeWeight * 80;
  const amoxDailyHigh = safeWeight * 100;
  const amoxDoseLow = amoxDailyLow / 3;
  const amoxDoseHigh = amoxDailyHigh / 3;

  const amoxIvDaily = safeWeight * 100;
  const amoxIvDose3 = amoxIvDaily / 3;
  const amoxIvDose4 = amoxIvDaily / 4;

  const cefotaximeDailyLow = safeWeight * 100;
  const cefotaximeDailyHigh = safeWeight * 150;
  const cefotaximeDose3Low = cefotaximeDailyLow / 3;
  const cefotaximeDose3High = cefotaximeDailyHigh / 3;
  const cefotaximeDose4Low = cefotaximeDailyLow / 4;
  const cefotaximeDose4High = cefotaximeDailyHigh / 4;

  const ceftriaxoneDailyLow = safeWeight * 50;
  const ceftriaxoneDailyHigh = safeWeight * 75;

  const azithroDay1 = safeWeight * 10;
  const azithroDay2 = safeWeight * 5;
  const clarithroDaily = safeWeight * 15;
  const clarithroDose = clarithroDaily / 2;

  const paracetamolDose = safeWeight * 15;
  const bolusLow = safeWeight * 10;
  const bolusHigh = safeWeight * 20;

  const hospitalTriggers = useMemo(
    () => [
      "SpO₂ < 94 % malgré O₂", 
      "détresse respi / tirage sévère",
      "âge < 3 mois ou comorbidités cardio-respi",
      "incapacité à s'alimenter / déshydratation",
      "absence d'amélioration à 48 h",
    ],
    []
  );

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-sky-500 to-sky-700 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Infection respiratoire</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide">
          Pneumopathie communautaire bactérienne
        </h1>
        <p className="text-sm text-white/80">Objectif SpO₂ 94–98 %, antibiothérapie adaptée & réévaluation à 48 h</p>

        <div className="mt-4 rounded-3xl bg-white/95 p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? safeWeight))}
          />
        </div>

        <p className="mt-4 text-sm text-white/85">
          Installer l’enfant en position confortable, aspiration rhinopharyngée si besoin. O₂ nasal 1–2 L/min
          si SpO₂ &lt; 94 %, objectif <strong>94–98 %</strong>.
        </p>
      </div>

      <div className="mt-4 px-4 space-y-5">
        <SectionCard title="Déterminer la sévérité" subtitle="Clinique + signes vitaux">
          <ToggleGroup
            label="Sévérité clinique"
            value={severity}
            onChange={setSeverity}
            options={[
              { value: "légère", label: "Légère", helper: "Fièvre, peu de tirage" },
              { value: "modérée", label: "Modérée", helper: "Polypnée, SpO₂ ≥ 94 %" },
              { value: "sévère", label: "Sévère", helper: "SpO₂ < 94 %, AEG" },
            ]}
          />
          <OrientationCard severity={severity} />
        </SectionCard>

        <SectionCard title="ABCDE initial" subtitle="Stabiliser avant examens">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>A – Libérer les VAS, aspiration douce, position demi-assise.</li>
            <li>B – Compter la FR selon l’âge, écouter crépitants / MV diminué.</li>
            <li>C – FC, TRC, rechercher signes de déshydratation.</li>
            <li>D – Vigilance, tonus, score AVPU.</li>
            <li>E – Température, signes extra-respiratoires et comorbidités.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Signes de gravité" subtitle="→ O₂ + avis hospitalier">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>SpO₂ &lt; 92–94 % ou besoin d’O₂ élevé.</li>
            <li>Tirage marqué, geignement, polypnée sévère.</li>
            <li>Déshydratation, incapacité à boire, vomissements.</li>
            <li>Âge &lt; 3 mois, comorbidité respiratoire ou immunodépression.</li>
            <li>Altération de l’état général ou suspicion complication.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Examens & monitoring" subtitle="À adapter selon la clinique">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Radiographie thoracique si doute diagnostique, gravité ou non-réponse à 48 h.</li>
            <li>Biologie non systématique : NFS/CRP/hémoc ultures si hospitalisation ou complications.</li>
            <li>Gaz du sang si hypoxémie sévère ou suspicion de SDRA.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Antibiothérapie pondérée" subtitle="Résultats calculés automatiquement">
          <div className="space-y-3">
            <TreatmentCard title="1ère intention : Amoxicilline per os (3 prises)">
              <p>
                Dose quotidienne 80–100 mg/kg/j → <strong>{formatRange(amoxDailyLow, amoxDailyHigh)}</strong> / jour.
              </p>
              <p>
                Dose par prise (3/j) → <strong>{formatRange(amoxDoseLow, amoxDoseHigh)}</strong>.
              </p>
              <Calc>80–100 × {safeWeight} kg ÷ 3 prises</Calc>
            </TreatmentCard>

            <TreatmentCard title="Allergie β-lactamines / germes atypiques">
              <p>
                Azithromycine J1 10 mg/kg → <strong>{formatMg(azithroDay1)}</strong> ; J2–J5 5 mg/kg → <strong>
                  {formatMg(azithroDay2)}
                </strong>.
              </p>
              <Calc>J1 : 10 × {safeWeight} ; J2–5 : 5 × {safeWeight}</Calc>
              <p>
                Clarithromycine 15 mg/kg/j en 2 prises → <strong>{formatMg(clarithroDaily)}</strong> / jour
                ({formatMg(clarithroDose)} par prise).
              </p>
              <Calc>15 × {safeWeight} ÷ 2</Calc>
            </TreatmentCard>

            <TreatmentCard title="Formes sévères / hospitalisation">
              <p>
                Amoxicilline IV 100 mg/kg/j (3–4 inj) → <strong>{formatMg(amoxIvDaily)}</strong> / jour
                ({formatMg(amoxIvDose3)} à {formatMg(amoxIvDose4)} par injection).
              </p>
              <Calc>100 × {safeWeight} ÷ 3 ou 4</Calc>
              <p>
                Cefotaxime 100–150 mg/kg/j (3–4 inj) →
                <strong> {formatRange(cefotaximeDailyLow, cefotaximeDailyHigh)}</strong> / jour.
              </p>
              <p>
                Soit {formatRange(cefotaximeDose3Low, cefotaximeDose3High)} par 3 inj ou {""}
                {formatRange(cefotaximeDose4Low, cefotaximeDose4High)} par 4 inj.
              </p>
              <Calc>(100–150 × {safeWeight}) ÷ 3 ou 4</Calc>
              <p>
                Ceftriaxone 50–75 mg/kg/j en injection unique → <strong>
                  {formatRange(ceftriaxoneDailyLow, ceftriaxoneDailyHigh)}
                </strong>.
              </p>
              <Calc>50–75 × {safeWeight}</Calc>
            </TreatmentCard>
          </div>
        </SectionCard>

        <SectionCard title="Traitements associés" subtitle="Symptômes & support">
          <TreatmentCard title="Antipyrétique">
            <p>
              Paracétamol 15 mg/kg/dose → <strong>{formatMg(paracetamolDose)}</strong>.
            </p>
            <Calc>15 × {safeWeight}</Calc>
          </TreatmentCard>
          <TreatmentCard title="Hydratation IV si besoin">
            <p>
              NaCl 0,9 % 10–20 mL/kg → <strong>
                {formatMl(bolusLow)} – {formatMl(bolusHigh)}
              </strong> par bolus.
            </p>
            <Calc>10–20 × {safeWeight}</Calc>
          </TreatmentCard>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>O₂ titré pour garder une SpO₂ 94–98 % ; VVP + scope si oxygénorequérance.</li>
            <li>Pas de β2 ni de corticoïdes systémiques hors comorbidité asthmatique.</li>
            <li>Pas d’antibiotique en cas de tableau viral isolé, pas de kiné respiratoire systématique.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Critères d'hospitalisation" subtitle="Réévaluation quotidienne">
          <ul className="list-disc space-y-1.5 pl-5">
            {hospitalTriggers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-sm text-slate-600">
            Sortie envisagée si amélioration clinique, apyréxie ou fièvre décroissante, SpO₂ ≥ 94 % en air ambiant
            et alimentation suffisante.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
