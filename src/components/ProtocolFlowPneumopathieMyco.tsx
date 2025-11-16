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

type Severity = "léger" | "modéré" | "sévère";

type Orientation = {
  tone: keyof typeof toneStyles;
  title: string;
  bullets: string[];
};

const severityCards: Record<Severity, Orientation> = {
  léger: {
    tone: "green",
    title: "Pneumopathie atypique légère",
    bullets: [
      "Enfant stable ≥ 5 ans, toux sèche traînante, prise orale préservée.",
      "Azithromycine PO, surveillance à domicile avec réévaluation à 48 h.",
      "Education des parents sur les signes d’aggravation.",
    ],
  },
  modéré: {
    tone: "amber",
    title: "Forme modérée",
    bullets: [
      "Polypnée, tirage léger, alimentation réduite, SpO₂ ≥ 94 %.",
      "Azithromycine + O₂ si besoin, radio ou biologie si évolution atypique.",
      "Réévaluation rapprochée (24–48 h).",
    ],
  },
  sévère: {
    tone: "red",
    title: "Forme sévère / hospitalisation",
    bullets: [
      "SpO₂ < 94 %, tirage marqué, vomissements, comorbidités ou atteinte extrapulmonaire.",
      "O₂ haut débit, hydratation IV, antibiothérapie discutée avec spécialiste.",
      "Hospitalisation pour monitoring + examens complémentaires.",
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
              {opt.helper && <span className="block text-xs font-normal text-slate-500 mt-0.5">{opt.helper}</span>}
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
    <div className={`rounded-3xl border-l-8 ${styles.border} bg-white px-4 py-4 shadow-sm ${styles.text}`}>
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

export default function ProtocolFlowPneumopathieMyco() {
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);

  const safeWeight = clampWeight(
    typeof weightFromStore === "number" && !Number.isNaN(weightFromStore) ? weightFromStore : 20
  );

  const [severity, setSeverity] = useState<Severity>("modéré");

  const azithroDay1 = safeWeight * 10;
  const azithroDay2 = safeWeight * 5;
  const clarithroDaily = safeWeight * 15;
  const clarithroDose = clarithroDaily / 2;
  const paracetamolDose = safeWeight * 15;
  const bolusLow = safeWeight * 10;
  const bolusHigh = safeWeight * 20;

  const hospitalTriggers = useMemo(
    () => [
      "SpO₂ < 94 % ou besoin d’O₂ élevé",
      "Tirage/polypnée sévères, AEG ou vomissements empêchant la voie orale",
      "Âge < 5 ans avec forte suspicion clinique",
      "Comorbidités respiratoires, cardiopathie, immunodépression",
      "Suspicion atteinte extrapulmonaire (myocardite, neurologique)",
    ],
    []
  );

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-indigo-500 to-cyan-600 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Infection atypique</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide">
          Pneumopathie atypique à Mycoplasma
        </h1>
        <p className="text-sm text-white/80">
          Titrer l’oxygène (objectif <strong>94–98 %</strong>) et adapter les macrolides selon le poids.
        </p>

        <div className="mt-4 rounded-3xl bg-white/95 p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? safeWeight))}
          />
        </div>

        <p className="mt-4 text-sm text-white/85">
          Réservé surtout à l’enfant ≥ 5 ans présentant toux sèche rebelle. O₂ lunettes 1–2 L/min si SpO₂ &lt; 94 %.
        </p>
      </div>

      <div className="mt-4 px-4 space-y-5">
        <SectionCard title="Classer la sévérité" subtitle="Guide conduite immédiate">
          <ToggleGroup
            label="Sévérité clinique"
            value={severity}
            onChange={setSeverity}
            options={[
              { value: "léger", label: "Léger", helper: "Toux isolée" },
              { value: "modéré", label: "Modéré", helper: "Polypnée modérée" },
              { value: "sévère", label: "Sévère", helper: "SpO₂ < 94 %" },
            ]}
          />
          <OrientationCard severity={severity} />
        </SectionCard>

        <SectionCard title="ABCDE initial" subtitle="Stabilisation rapide">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>A – Libérer VAS, aspiration rhinopharyngée douce si IVAS.</li>
            <li>B – FR selon âge, auscultation pauvre (MV diminué, râles discrets), SpO₂ continue.</li>
            <li>C – FC, TRC, tension, rechercher déshydratation.</li>
            <li>D – Évaluer état général, vigilance, céphalées / myalgies.</li>
            <li>E – Rechercher autres foyers infectieux ou éruptions.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Signes de gravité" subtitle="→ Hospitalisation / avis spécialisé">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>SpO₂ &lt; 94 %, tirage ou polypnée nette.</li>
            <li>Altération de l’état général marqué, asthénie majeure.</li>
            <li>Vomissements empêchant la prise orale ou déshydratation.</li>
            <li>Âge &lt; 5 ans avec suspicion forte ou comorbidités.</li>
            <li>Suspicion atteinte extra-pulmonaire (myocardite, neuro).</li>
          </ul>
        </SectionCard>

        <SectionCard title="Examens complémentaires" subtitle="À cibler selon la clinique">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Radiographie thoracique si gravité, fièvre &gt; 72 h ou absence d’amélioration sous traitement.</li>
            <li>Biologie non systématique : CRP modérée fréquente, PCR Mycoplasma si doute diagnostique.</li>
            <li>Gaz du sang si hypoxémie ou signes de détresse.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Antibiothérapie macrolides" subtitle="Calculs automatiques">
          <div className="space-y-3">
            <TreatmentCard title="1ère intention : Azithromycine">
              <p>
                J1 10 mg/kg → <strong>{formatMg(azithroDay1)}</strong>.
              </p>
              <p>
                J2–J5 5 mg/kg/j → <strong>{formatMg(azithroDay2)}</strong> par jour.
              </p>
              <Calc>J1 : 10 × {safeWeight} kg • J2–5 : 5 × {safeWeight} kg</Calc>
            </TreatmentCard>
            <TreatmentCard title="Alternative : Clarithromycine">
              <p>
                15 mg/kg/j en 2 prises → <strong>{formatMg(clarithroDaily)}</strong> / jour
                ({formatMg(clarithroDose)} par prise).
              </p>
              <Calc>15 × {safeWeight} ÷ 2</Calc>
              <p>Allergie vraie aux macrolides : avis spécialisé, pas d’alternative simple.</p>
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
          <TreatmentCard title="Hydratation IV si intolérance orale">
            <p>
              NaCl 0,9 % 10–20 mL/kg → <strong>
                {formatMl(bolusLow)} – {formatMl(bolusHigh)}
              </strong> par bolus.
            </p>
            <Calc>10–20 × {safeWeight}</Calc>
          </TreatmentCard>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>O₂ lunettes 1–2 L/min si SpO₂ &lt; 94 %, objectif <strong>94–98 %</strong>.</li>
            <li>Pas de β2 ni corticoïdes systématiques ; antibiotiques β-lactamines seuls inefficaces sur Mycoplasma.</li>
            <li>Pas de macrolides en prophylaxie.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Conduite / orientation" subtitle="Réévaluation systématique">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Léger : macrolide PO, surveillance domicile, contrôle 48 h.</li>
            <li>Modéré : macrolide PO + O₂ si besoin, réévaluation 24–48 h, radio si suspicion complication.</li>
            <li>Sévère : O₂, hydratation IV, hospitalisation, discussion spécialiste.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Critères d’hospitalisation" subtitle="Décision partagée">
          <ul className="list-disc space-y-1.5 pl-5">
            {hospitalTriggers.map((item) => (
              <li key={item}>{item}</li>
            ))}
            <li>Absence d’amélioration après 48 h de traitement.</li>
          </ul>
          <p className="text-sm text-slate-600">
            Sortie si amélioration clinique, SpO₂ ≥ 94 % en air ambiant, alimentation tolérée et parents aptes à la
            surveillance.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
