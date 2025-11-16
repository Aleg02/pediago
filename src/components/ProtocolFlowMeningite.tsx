"use client";

import type { ReactNode } from "react";

import AgeWeightPicker from "@/components/AgeWeightPicker";
import { useAppStore } from "@/store/useAppStore";
import { formatMg } from "@/lib/units";

const MIN_W = 3;
const MAX_W = 80;
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

const parseAgeInMonths = (label: string | null | undefined): number | null => {
  if (!label) return null;
  if (label.trim().toLowerCase() === "naissance") return 0;
  const normalized = label.trim().toLowerCase();
  const parsed = Number.parseInt(normalized, 10);
  if (Number.isNaN(parsed)) return null;
  if (normalized.includes("mois")) return parsed;
  if (normalized.includes("an")) return parsed * 12;
  return null;
};

function SectionCard({
  title,
  subtitle,
  tone = "indigo",
  children,
}: {
  title: string;
  subtitle?: string;
  tone?: "indigo" | "rose" | "emerald" | "amber" | "slate";
  children: ReactNode;
}) {
  const toneMap = {
    indigo: { header: "from-indigo-500 to-violet-500", body: "bg-indigo-50 border-indigo-100" },
    rose: { header: "from-rose-500 to-pink-500", body: "bg-rose-50 border-rose-100" },
    emerald: { header: "from-emerald-500 to-teal-500", body: "bg-emerald-50 border-emerald-100" },
    amber: { header: "from-amber-500 to-orange-500", body: "bg-amber-50 border-amber-100" },
    slate: { header: "from-slate-800 to-slate-900", body: "bg-white border-slate-200" },
  } as const;
  const palette = toneMap[tone];
  return (
    <div className={`rounded-3xl border ${palette.body} shadow-sm overflow-hidden`}>
      <div className={`bg-gradient-to-r ${palette.header} px-4 py-3 text-white`}>
        <p className="text-sm font-semibold uppercase tracking-wide">{title}</p>
        {subtitle && <p className="text-xs text-white/80">{subtitle}</p>}
      </div>
      <div className="px-4 py-4 text-sm text-slate-800 space-y-3">{children}</div>
    </div>
  );
}

function Metric({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-center">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-900">
        <span className="font-bold">{value}</span>
        {unit ? <span className="text-sm font-medium text-slate-600 ml-1">{unit}</span> : null}
      </p>
    </div>
  );
}

export default function ProtocolFlowMeningite() {
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  const weightKg = clampWeight(weightFromStore);
  const ageInMonths = parseAgeInMonths(ageLabel);
  const isYoungInfant = ageInMonths != null ? ageInMonths < 3 : weightKg <= 5;

  const naclBolus = weightKg * 20;
  const midazolamIv = weightKg * 0.1;
  const midazolamIn = weightKg * 0.2;
  const paracetamolDose = weightKg * 15;
  const dexamethasoneDose = weightKg * 0.15;

  const cefotaximeDay = weightKg * 200;
  const cefotaximeDose = cefotaximeDay / 4;
  const ceftriaxoneDose = Math.min(weightKg * 100, 4000);
  const vancomycineDay = weightKg * 60;
  const vancomycineDose = vancomycineDay / 4;
  const amoxicillineDay = weightKg * 200;
  const amoxicillineDose = amoxicillineDay / 4;

  return (
    <div className="pb-10">
      <div className="rounded-3xl bg-gradient-to-b from-[#4C1D95] to-[#7C3AED] px-4 pt-6 pb-5 text-white shadow-sm">
        <h1 className="text-2xl font-extrabold leading-tight">Méningite bactérienne purulente</h1>
        <p className="text-sm text-white/80 mt-1">
          Urgence vitale : ATB IV immédiate, surveillance neuro-respiratoire, hospitalisation spécialisée.
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
        <SectionCard title="Évaluation initiale (ABCDE)" subtitle="Neuro + hémodynamique" tone="indigo">
          <ul className="list-disc pl-4 space-y-1.5">
            <li>A : VA neutre, aspiration PRN, matériel d’IOT prêt si Glasgow &lt; 9.</li>
            <li>B : FR, travail respiratoire, SpO₂. <strong>O₂ 10–15 L/min</strong> si SpO₂ &lt; 94 %.</li>
            <li>C : FC, TA, TRC, perfusion. <strong>NaCl 0,9 % {formatMl(naclBolus)}</strong> (20 mL/kg) si choc.</li>
            <li>D : GCS, pupilles. Convulsions → <strong>Midazolam {formatDose(midazolamIv)}</strong> IV ou <strong>{formatDose(midazolamIn)}</strong> IN.</li>
            <li>E : Température, recherche purpura, glycémie capillaire.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Signes de gravité" subtitle="ATB immédiate sans PL" tone="rose">
          <div className="grid gap-2 text-[13px]">
            <div className="rounded-2xl border border-rose-200 bg-white/90 px-3 py-2">
              Purpura fulminans ou choc avec marbrures persistantes.
            </div>
            <div className="rounded-2xl border border-rose-200 bg-white/90 px-3 py-2">
              GCS &lt; 11, convulsions prolongées, signes d’engagement.
            </div>
            <div className="rounded-2xl border border-rose-200 bg-white/90 px-3 py-2">
              Détresse respiratoire, SpO₂ &lt; 94 % malgré O₂, instabilité hémodynamique.
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Ponction lombaire" subtitle="À faire uniquement si patient stable" tone="amber">
          <ul className="list-disc pl-4 space-y-1.5">
            <li>Indiquée si pas de signe de gravité, pas d’HTIC, pas de trouble coagulation.</li>
            <li>CI : choc, purpura, convulsions persistantes, coma, signes d’engagement, anticoagulation.</li>
            <li>Si CI : traiter sans PL, prélèvements sanguins (hémoc, CRP) avant ATB si possible.</li>
          </ul>
        </SectionCard>

        <SectionCard
          title="Antibiothérapie IV immédiate"
          subtitle={isYoungInfant ? "Nouveau-né / < 3 mois" : "Enfant ≥ 3 mois"}
          tone="emerald"
        >
          {isYoungInfant ? (
            <div className="space-y-3">
              <p className="font-semibold text-emerald-800">
                Céfotaxime + Amoxicilline (streptocoque B, Listeria, Gram −).
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Metric label="Céfotaxime / jour" value={formatDose(cefotaximeDay)} />
                <Metric label="≈ dose / injection" value={formatDose(cefotaximeDose)} />
                <Metric label="Amoxicilline / jour" value={formatDose(amoxicillineDay)} />
                <Metric label="≈ dose / injection" value={formatDose(amoxicillineDose)} />
              </div>
              <p className="text-xs text-slate-600">Schéma IV en 3–4 perfusions par 24 h. Débuter avant transfert.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-semibold text-emerald-800">Céfotaxime 1ère intention ou Ceftriaxone dose unique.</p>
              <div className="grid grid-cols-2 gap-3">
                <Metric label="Céfotaxime / jour" value={formatDose(cefotaximeDay)} />
                <Metric label="≈ dose / injection" value={formatDose(cefotaximeDose)} />
                <Metric label="Ceftriaxone" value={formatDose(ceftriaxoneDose)} unit="/ jour (max 4 g)" />
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-white/80 px-3 py-2 text-[13px]">
                Pneumocoque CMI élevée → ajouter Vancomycine {formatDose(vancomycineDay)} /jour ({formatDose(vancomycineDose)} par dose).
                Suspicion Listeria (nourrisson, immunodéprimé) → ajouter Amoxicilline {formatDose(amoxicillineDay)} /jour.
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Corticothérapie adjuvante" subtitle="Si suspicion pneumocoque ≥ 3 mois" tone="slate">
          <ul className="list-disc pl-4 space-y-1.5">
            <li>
              <strong>Dexaméthasone {formatDose(dexamethasoneDose)}</strong> IV toutes les 6 h pendant 2 jours.
            </li>
            <li>À administrer avant ou en même temps que la 1ère dose d’antibiotique.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Mesures associées" subtitle="Symptômes & support" tone="indigo">
          <ul className="list-disc pl-4 space-y-1.5">
            <li>
              Antipyrétique : <strong>Paracétamol {formatDose(paracetamolDose)}</strong> (15 mg/kg/dose).
            </li>
            <li>
              Convulsions : Midazolam {formatDose(midazolamIv)} IV ou {formatDose(midazolamIn)} IN, suivre protocole EME si échec.
            </li>
            <li>Surveillance hémodynamique continue, glycémie régulière, prévention de l’HTIC.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Orientation" subtitle="Hospitalisation obligatoire" tone="rose">
          <ul className="list-disc pl-4 space-y-1.5">
            <li>Réanimation si choc, besoin d’oxygène élevé, purpura fulminans, troubles de conscience ou convulsions réfractaires.</li>
            <li>Transport médicalisé après stabilisation initiale, prophylaxie des contacts si méningocoque.</li>
            <li>Sortie uniquement après traitement hospitalier complet, apyrexie et surveillance neurologique satisfaisante.</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
