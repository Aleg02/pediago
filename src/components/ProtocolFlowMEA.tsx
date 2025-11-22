"use client";

import type { ReactNode } from "react";

import AgeWeightPicker from "@/components/AgeWeightPicker";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

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

const formatMicro = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return "—";
  const v = value as number;
  if (v >= 1000) return `${Number((v / 1000).toFixed(v >= 10000 ? 0 : 1))} mg`;
  return `${Number(v.toFixed(v >= 10 ? 1 : 2))} µg`;
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

export default function ProtocolFlowMEA() {
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
  const clonazepamIv = weightKg * 0.05;
  const paracetamolDose = weightKg * 15;
  const dexamethasoneDose = weightKg * 0.15;

  const cefotaximeDose = weightKg * 50;
  const cefotaximeDay = cefotaximeDose * 3;
  const ceftriaxoneLow = Math.min(weightKg * 50, 2000);
  const ceftriaxoneHigh = Math.min(weightKg * 75, 2000);
  const vancomycineDose = weightKg * 15;
  const vancomycineDay = vancomycineDose * 4;
  const ampicillineLow = weightKg * 75;
  const ampicillineHigh = weightKg * 100;
  const ampicillineDayLow = ampicillineLow * 4;
  const ampicillineDayHigh = ampicillineHigh * 4;
  const aciclovirDose = weightKg * 20;
  const aciclovirDay = aciclovirDose * 3;

  const adrenalineLow = weightKg * 0.05;
  const adrenalineHigh = weightKg * 0.3;

  return (
    <div className="pb-10">
      <div className="rounded-3xl bg-gradient-to-b from-[#0F172A] to-[#1E293B] px-4 pt-6 pb-5 text-white shadow-sm">
        <h1 className="text-2xl font-extrabold leading-tight">Méningo-encéphalite aiguë (enfant)</h1>
        <p className="text-sm text-white/80 mt-1">
          Urgence neuro-infectieuse : identifier la gravité, débuter ATB/antiviral sans délai, hospitalisation spécialisée.
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
        <SectionCard title="Évaluation initiale (ABCDE)" subtitle="Stabilisation rapide" tone="indigo">
          <ul className="list-disc pl-4 space-y-1.5">
            <li>A : perméabilité VAS, prévenir inhalation. Intubation si GCS ≤ 8, convulsions prolongées ou détresse.</li>
            <li>B : objectif SpO₂ 94–98 %. O₂ titré ou 10–15 L/min si détresse respiratoire.</li>
            <li>C : TRC, FC, TA, recherche purpura. Si choc : <strong>NaCl 0,9 % {formatMl(naclBolus)}</strong> (20 mL/kg).</li>
            <li>D : GCS, convulsions, raideur méningée, irritabilité.</li>
            <li>E : température, lésions cutanées, purpura.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Signes de gravité" subtitle="ATB immédiats" tone="rose">
          <div className="grid gap-2 text-[13px]">
            <div className="rounded-2xl border border-rose-200 bg-white/90 px-3 py-2">Troubles de conscience, coma, agitation extrême.</div>
            <div className="rounded-2xl border border-rose-200 bg-white/90 px-3 py-2">Convulsions prolongées ou répétées.</div>
            <div className="rounded-2xl border border-rose-200 bg-white/90 px-3 py-2">Purpura extensif / choc, TRC &gt; 3 s, marbrures.</div>
            <div className="rounded-2xl border border-rose-200 bg-white/90 px-3 py-2">Détresse respiratoire ou instabilité hémodynamique.</div>
            <div className="rounded-2xl border border-rose-200 bg-white/90 px-3 py-2">Fontanelle bombée (nourrisson).</div>
          </div>
        </SectionCard>

        <SectionCard title="Ponction lombaire" subtitle="Si pas de contre-indication" tone="amber">
          <ul className="list-disc pl-4 space-y-1.5">
            <li>PL immédiate si enfant stable sans signe d’HTIC ni trouble de coagulation.</li>
            <li>CI : instabilité, purpura avec choc, convulsions non contrôlées, signes d’engagement, déficit focal, immunodépression sévère.</li>
            <li>Si CI : débuter ATB + Acyclovir avant imagerie.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Examens initiaux" subtitle="Prélèvements systématiques" tone="slate">
          <ul className="list-disc pl-4 space-y-1.5">
            <li>Hémocultures obligatoires, NFS, CRP/PCT, ionogramme, glycémie, gaz du sang, lactates.</li>
            <li>PL : cellules, protéines, glucose (avec glycémie), examen direct, culture, PCR virales (HSV, entérovirus, VZV).</li>
            <li>± PCR méningite/encéphalite, ± Rx thorax si sepsis.</li>
          </ul>
        </SectionCard>

        <SectionCard
          title="Antibiothérapie empirique"
          subtitle={isYoungInfant ? "< 3 mois" : "Enfant ≥ 3 mois"}
          tone="emerald"
        >
          {isYoungInfant ? (
            <div className="space-y-3">
              <p className="font-semibold text-emerald-800">Ampicilline + Céfotaxime (Listeria, Strepto B, entérobactéries).</p>
              <div className="grid grid-cols-2 gap-3">
                <Metric label="Ampicilline / dose (75 mg/kg)" value={formatDose(ampicillineLow)} />
                <Metric label="Ampicilline / dose (100 mg/kg)" value={formatDose(ampicillineHigh)} />
                <Metric label="Ampicilline / jour" value={`${formatDose(ampicillineDayLow)} – ${formatDose(ampicillineDayHigh)}`} />
                <Metric label="Céfotaxime / dose" value={formatDose(cefotaximeDose)} />
              </div>
              <p className="text-xs text-slate-600">Schéma IV toutes les 6 h (ampicilline 75–100 mg/kg) + céfotaxime 50 mg/kg/8 h.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-semibold text-emerald-800">Céfotaxime 50 mg/kg/8 h (150 mg/kg/j) ou Ceftriaxone dose unique.</p>
              <div className="grid grid-cols-2 gap-3">
                <Metric label="Céfotaxime / dose" value={formatDose(cefotaximeDose)} />
                <Metric label="Céfotaxime / jour" value={formatDose(cefotaximeDay)} />
                <Metric label="Ceftriaxone" value={`${formatDose(ceftriaxoneLow)} – ${formatDose(ceftriaxoneHigh)}`} unit="/ j (max 2 g)" />
                <Metric label="Vancomycine / dose" value={formatDose(vancomycineDose)} />
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-white/80 px-3 py-2 text-[13px]">
                Couverture pneumocoque C3G-R : Vancomycine {formatDose(vancomycineDay)} /j (15 mg/kg/6 h). Suspicion Listeria → ajouter Ampicilline.
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Traitement antiviral (HSV suspect)" subtitle="Débuter avant imagerie si CI PL" tone="indigo">
          <div className="space-y-3">
            <p className="font-semibold text-indigo-800">Aciclovir IV 20 mg/kg/8 h (60 mg/kg/j).</p>
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Aciclovir / dose" value={formatDose(aciclovirDose)} />
              <Metric label="Aciclovir / jour" value={formatDose(aciclovirDay)} />
            </div>
            <ul className="list-disc pl-4 space-y-1.5 text-[13px]">
              <li>Indications : convulsions focales, altération conscience, LCR lymphocytaire, lésions vésiculeuses.</li>
              <li>Nourrisson &lt; 3 mois fébrile + signes neuro : aciclovir systématique.</li>
            </ul>
          </div>
        </SectionCard>

        <SectionCard title="Corticothérapie" subtitle="Suspicion pneumocoque ≥ 3 mois" tone="slate">
          <ul className="list-disc pl-4 space-y-1.5">
            <li>
              <strong>Dexaméthasone {formatDose(dexamethasoneDose)}</strong> IV toutes les 6 h. À débuter avant ou avec la 1ère dose d’ATB.
            </li>
            <li>Durée : 2 jours.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Symptomatique & support" subtitle="Convulsions, fièvre, perfusion" tone="amber">
          <ul className="list-disc pl-4 space-y-1.5">
            <li>Convulsions : Midazolam {formatDose(midazolamIv)} IV ou {formatDose(midazolamIn)} IN. Clonazépam {formatDose(clonazepamIv)} IV.</li>
            <li>Fièvre : Paracétamol <strong>{formatDose(paracetamolDose)}</strong> toutes les 6 h.</li>
            <li>Perfusion/choc : NaCl 0,9 % {formatMl(naclBolus)} (20 mL/kg).</li>
            <li>Vasopresseur si besoin : Adrénaline {formatMicro(adrenalineLow)} – {formatMicro(adrenalineHigh)} /min (0,05–0,3 µg/kg/min).</li>
          </ul>
        </SectionCard>

        <SectionCard title="Orientation" subtitle="Hospitalisation / réanimation" tone="rose">
          <ul className="list-disc pl-4 space-y-1.5">
            <li>Hospitalisation obligatoire pour toute méningite/MEA suspectée.</li>
            <li>Réanimation si coma, convulsions réfractaires, choc, instabilité respiratoire ou purpura.</li>
            <li>Sortie uniquement après diagnostic non bactérien confirmé, amélioration clinique, apyrexie ≥ 24 h et suivi fiable.</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
