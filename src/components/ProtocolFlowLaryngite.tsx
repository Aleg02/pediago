"use client";

import { useMemo, useState } from "react";

import AgeWeightPicker from "@/components/AgeWeightPicker";
import { useAppStore } from "@/store/useAppStore";
import { formatMg } from "@/lib/units";

const MIN_W = 5;
const MAX_W = 40;
const clampWeight = (value: number) => Math.min(Math.max(value, MIN_W), MAX_W);

const pillBase =
  "rounded-2xl border px-4 py-2 text-left text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2";

type Stridor = "aucun" | "effort" | "repos" | "silence";
type Tirage = "absent" | "modere" | "marque";
type Spo2 = "ge94" | "lt94";
type Agitation = "calme" | "agite";
type Severity = "légère" | "modérée" | "sévère";

type OrientationCard = {
  title: string;
  tone: "green" | "amber" | "red";
  bullets: string[];
  footnote?: string;
};

const toneStyles: Record<OrientationCard["tone"], { badge: string; border: string; text: string }> = {
  green: { badge: "bg-emerald-500", border: "border-emerald-200", text: "text-emerald-900" },
  amber: { badge: "bg-amber-500", border: "border-amber-200", text: "text-amber-900" },
  red: { badge: "bg-rose-600", border: "border-rose-200", text: "text-rose-900" },
};

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
      <div className="mt-2 grid grid-cols-2 gap-2">
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

export default function ProtocolFlowLaryngite() {
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);

  const safeWeight = clampWeight(
    typeof weightFromStore === "number" && !Number.isNaN(weightFromStore)
      ? weightFromStore
      : 12
  );

  const [stridor, setStridor] = useState<Stridor>("effort");
  const [tirage, setTirage] = useState<Tirage>("absent");
  const [spo2, setSpo2] = useState<Spo2>("ge94");
  const [agitation, setAgitation] = useState<Agitation>("calme");

  const severity = useMemo<Severity>(() => {
    if (spo2 === "lt94" || stridor === "silence" || tirage === "marque") return "sévère";
    if (stridor === "repos" || tirage === "modere" || agitation === "agite") return "modérée";
    return "légère";
  }, [stridor, tirage, agitation, spo2]);

  const orientation = useMemo<OrientationCard>(() => {
    if (severity === "sévère") {
      return {
        title: "Croup sévère / menace vitale",
        tone: "red",
        bullets: [
          "O₂ 10 L/min (cible SpO₂ 94–98 %) + VVP, scope, préparation VAS difficile.",
          "Adrénaline nébulisée immédiate + surveillance continue ≥ 2 h.",
          "Dexaméthasone IV si PO impossible, avis anesthésie / réanimation.",
        ],
        footnote: "Intubation si épuisement, hypoxémie persistante ou altération majeure de vigilance.",
      };
    }
    if (severity === "modérée") {
      return {
        title: "Croup modéré",
        tone: "amber",
        bullets: [
          "Stridor au repos, tirage modéré, SpO₂ ≥ 94 %.",
          "Dexaméthasone PO + adrénaline nébulisée, surveillance rapprochée 2–4 h.",
          "Répéter l'adrénaline à 20 min si reprise du stridor au repos.",
        ],
        footnote: "Hospitalisation si besoin répété d'adrénaline ou terrain fragile (< 6 mois, comorbidité).",
      };
    }
    return {
      title: "Croup léger",
      tone: "green",
      bullets: [
        "Stridor uniquement à l'effort, pas de tirage, enfant calme.",
        "Dexaméthasone PO dose unique, hydratation orale et antalgie si fièvre.",
        "Observation 1–2 h puis sortie avec consignes si disparition du stridor au repos.",
      ],
      footnote: "Informer les parents des signes d'alerte : tirage, dyspnée, cyanose, fièvre persistante.",
    };
  }, [severity]);

  const dexDose = Math.min(safeWeight * 0.6, 10);
  const dexLow = safeWeight * 0.15;
  const paracetamol = safeWeight * 15;

  const ageIsUnderSixMonths = ageLabel?.includes("mois")
    ? (() => {
        const match = ageLabel.match(/(\d+)/);
        if (!match) return false;
        const months = Number(match[1]);
        return !Number.isNaN(months) && months < 6;
      })()
    : false;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-sky-500 to-sky-700 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Voies aériennes</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide">Laryngite aiguë (croup)</h1>
        <p className="text-sm text-white/80">Calmer l’enfant, évaluer ABCDE, corticoïde systématique</p>

        <div className="mt-4 rounded-3xl bg-white/95 p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? safeWeight))}
          />
        </div>

          <p className="mt-4 text-sm text-white/85">
            Laisser l’enfant dans les bras du parent, éviter les gestes anxiogènes. SpO₂ &lt; 94 % → oxygène au
            masque 10 L/min.
          </p>
      </div>

      <div className="mt-4 px-4 space-y-5">
        <SectionCard title="Déterminer la sévérité" subtitle="Stridor, tirage, agitation, SpO₂">
          <div className="grid gap-4">
            <ToggleGroup
              label="Stridor"
              value={stridor}
              onChange={setStridor}
              options={[
                { value: "aucun", label: "Absent" },
                { value: "effort", label: "À l'effort" },
                { value: "repos", label: "Au repos" },
                { value: "silence", label: "Silence / bruyant", helper: "épuisement" },
              ]}
            />
            <ToggleGroup
              label="Tirage"
              value={tirage}
              onChange={setTirage}
              options={[
                { value: "absent", label: "Aucun" },
                { value: "modere", label: "Modéré" },
                { value: "marque", label: "Marqué" },
              ]}
            />
            <ToggleGroup
              label="Agitation / état général"
              value={agitation}
              onChange={setAgitation}
              options={[
                { value: "calme", label: "Calme" },
                { value: "agite", label: "Agité / fatigué" },
              ]}
            />
            <ToggleGroup
              label="SpO₂"
              value={spo2}
              onChange={setSpo2}
              options={[
                { value: "ge94", label: "≥ 94 %" },
                { value: "lt94", label: "&lt; 94 %", helper: "donner O₂" },
              ]}
            />
          </div>

          <div
            className={`rounded-2xl border px-4 py-3 ${toneStyles[orientation.tone].border} ${toneStyles[orientation.tone].text}`}
          >
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase text-white ${toneStyles[orientation.tone].badge}`}>
                {severity}
              </span>
              <p className="text-sm font-semibold">{orientation.title}</p>
            </div>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              {orientation.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            {orientation.footnote && (
              <p className="mt-2 text-xs font-semibold">{orientation.footnote}</p>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Traitement systémique" subtitle="Dexaméthasone prioritaire">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              Dexaméthasone 0,6 mg/kg PO dose unique (max 10 mg) :
              <strong className="ml-1">{formatMg(dexDose)}</strong>
              <span className="block text-xs text-slate-500">
                0,6 × {safeWeight.toFixed(1)} = {formatMg(safeWeight * 0.6)} → limité à 10 mg
              </span>
            </li>
            <li>
              Plage possible 0,15–0,6 mg/kg :
              <strong className="ml-1">{formatMg(dexLow)}</strong> à {formatMg(safeWeight * 0.6)}
            </li>
            <li>Dexaméthasone IV même dose si vomissements / impossibilité de la voie orale.</li>
            <li>Budesonide nébulisé 2 mg en alternative si corticoïde inhalé souhaité.</li>
            <li>
              Paracétamol 15 mg/kg si fièvre ou inconfort :
              <strong className="ml-1">{formatMg(paracetamol)}</strong>
            </li>
          </ul>
        </SectionCard>

        <SectionCard title="Adrénaline nébulisée" subtitle="Modéré à sévère">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Indications : stridor au repos, tirage, agitation, SpO₂ &lt; 94 %.</li>
            <li>
              Adrénaline L(+) 1 mg/mL : <strong>5 mL pur</strong> en nébulisation (ou racémique 2,25 % : 0,5 mL + 2,5 mL
              NaCl 0,9 %).
            </li>
            <li>Répéter après 20 min si nécessaire. Surveillance continue ≥ 2 h après chaque nébulisation.</li>
            <li>Pas de β2-mimétiques ni d’antibiotiques systématiques (étiologie virale).</li>
          </ul>
        </SectionCard>

        <SectionCard title="Orientation & situations particulières">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              Critères d’hospitalisation : stridor au repos persistant, SpO₂ &lt; 94 %, multiples nébulisations,
              <span className="font-semibold"> âge &lt; 6 mois</span>, terrain cardio-neuro-immuno fragile, doute sur
              épiglottite ou inhalation.
            </li>
            <li>Surveillance 1–2 h pour les formes légères, 2–4 h pour les formes modérées.</li>
            <li>Sortie après 2 h post-adrénaline si SpO₂ ≥ 94 %, absence de tirage/stridor, parents fiables + consignes écrites.</li>
            <li>
              Consignes domicile : humidifier l’air, laisser l’enfant calmé, consulter en urgence si réapparition du
              stridor au repos, tirage ou cyanose.
            </li>
            <li>
              Suspicion inhalation corps étranger → pas de nébulisation, imagerie / avis ORL. Immunodéprimé ou &lt; 6 mois →
              hospitalisation systématique.
            </li>
          </ul>
          {ageIsUnderSixMonths && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
              Âge estimé &lt; 6 mois → hospitalisation recommandée même si signes légers.
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
