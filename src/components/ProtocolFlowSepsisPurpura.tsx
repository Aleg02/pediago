"use client";

import type { ReactNode } from "react";

import AgeWeightPicker from "@/components/AgeWeightPicker";
import { useAppStore } from "@/store/useAppStore";
import { formatMg } from "@/lib/units";

const MIN_W = 3;
const MAX_W = 80;
const DEFAULT_W = 15;

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

// Plafond de ceftriaxone en fonction de l’âge sélectionné
// Règle : Naissance → 11 ans = 1 g max ; 12 → 15 ans = 2 g max
function getCeftriaxoneMaxMg(ageLabel: string | null | undefined): number {
  const label = (ageLabel ?? "").trim();

  if (!label) {
    // Par défaut, on reste prudent : 1 g max
    return 1000;
  }

  const teenLabels = new Set([
    "12 ans",
    "13 ans",
    "14 ans",
    "15 ans",
  ]);

  if (teenLabels.has(label)) {
    return 2000; // 2 g max pour l’adolescent
  }

  return 1000; // 1 g max pour tous les autres (nourrisson + enfant)
}

function SectionCard({
  title,
  subtitle,
  tone = "rose",
  children,
}: {
  title: string;
  subtitle?: string;
  tone?: "rose" | "amber" | "indigo" | "emerald" | "slate";
  children: ReactNode;
}) {
  const toneMap = {
    rose: {
      header: "from-rose-500 to-pink-500",
      body: "bg-rose-50 border-rose-100",
    },
    amber: {
      header: "from-amber-500 to-orange-500",
      body: "bg-amber-50 border-amber-100",
    },
    indigo: {
      header: "from-indigo-500 to-purple-500",
      body: "bg-indigo-50 border-indigo-100",
    },
    emerald: {
      header: "from-emerald-500 to-teal-500",
      body: "bg-emerald-50 border-emerald-100",
    },
    slate: {
      header: "from-slate-800 to-slate-900",
      body: "bg-white border-slate-200",
    },
  } as const;
  const palette = toneMap[tone];
  return (
    <div className={`rounded-3xl border ${palette.body} shadow-sm overflow-hidden`}>
      <div className={`bg-gradient-to-r ${palette.header} px-4 py-3 text-white`}>
        <p className="text-sm font-semibold tracking-wide uppercase">{title}</p>
        {subtitle && <p className="text-xs text-white/80">{subtitle}</p>}
      </div>
      <div className="px-4 py-4 text-sm text-slate-800 space-y-3">{children}</div>
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-[12px] font-semibold text-slate-700">
      {children}
    </span>
  );
}

export default function ProtocolFlowSepsisPurpura() {
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  const weightKg = clampWeight(weightFromStore);

  const bolus10 = weightKg * 10;
  const bolus20 = weightKg * 20;
  const bolus40 = weightKg * 40;
  const bolus60 = weightKg * 60;

  // Plafond ceftriaxone selon âge (et non plus selon poids)
  const ceftriaxoneMax = getCeftriaxoneMaxMg(ageLabel);
  const ceftriaxoneMg = Math.min(weightKg * 100, ceftriaxoneMax);

  const cefotaximeDay = weightKg * 150;
  const cefotaximeDose = cefotaximeDay / 3; // 3 perfusions/jour

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-[#8B1F41] to-[#D7263D] px-4 pt-6 pb-5 text-white shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-wide leading-tight">
          Fièvre sévère · Sepsis · Purpura fulminans
        </h1>
        <p className="text-sm text-white/90 mt-1">
          Priorité absolue : reconnaître la gravité, déclencher l’antibiothérapie IV en &lt; 60 min et assurer le transport adapté.
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
        <SectionCard
          title="Évaluation initiale ≤ 5 min"
          subtitle="ABC + peau + contexte"
          tone="indigo"
        >
          <ul className="list-disc pl-4 space-y-1.5">
            <li>Constantes : FC, FR, SpO₂, TA (&ge; 1 an), température, TRC.</li>
            <li>Peau : purpura non blanchissant, nécrose, vitesse d’extension.</li>
            <li>Neurologique : alerte/AVPU, convulsions, irritabilité inhabituelle.</li>
            <li>
              Contexte à risque : &lt; 3 mois, asplénie, drépanocytose, immunodépression,
              absence de vaccination méningocoque/pneumocoque.
            </li>
          </ul>
        </SectionCard>

        <SectionCard
          title="Arbre décisionnel"
          subtitle="Orienter immédiatement"
          tone="amber"
        >
          <div className="grid gap-3 text-[13px]">
            <div className="rounded-2xl border border-amber-200 bg-white/80 px-3 py-3">
              <p className="font-semibold text-amber-800">Purpura non blanchissant ?</p>
              <p>Oui → urgence absolue : ceftriaxone IV immédiate, appel 15/SMUR, réanimation.</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-white/80 px-3 py-3">
              <p className="font-semibold text-amber-800">Pas de purpura mais signes de sepsis ?</p>
              <p>Perfusion/IO + remplissage + ATB dans l’heure → USI/Réa.</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-white/80 px-3 py-3">
              <p className="font-semibold text-amber-800">Aucun critère de gravité</p>
              <p>
                Fièvre simple : PEC adaptée (mais surveillance stricte si &lt; 3 mois ou contexte
                défavorable).
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Signes de gravité = Sepsis"
          subtitle="Déclenchent remplissage + ATB"
          tone="rose"
        >
          <div className="flex flex-wrap gap-2">
            <Pill>TRC &gt; 3 s / extrémités froides</Pill>
            <Pill>Hypotension ou tachycardie persistante</Pill>
            <Pill>Polypnée, tirage, SpO₂ &lt; 92 %</Pill>
            <Pill>AVPU = P ou U / convulsions</Pill>
            <Pill>Diurèse &lt; 1 mL/kg/h</Pill>
            <Pill>Purpura extensif / nécrotique</Pill>
          </div>
        </SectionCard>

        <SectionCard
          title="Mesures immédiates ≤ 15 min"
          subtitle="Toutes réalisées en parallèle"
          tone="emerald"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-white/70 px-3 py-3">
              <p className="font-semibold text-emerald-900 mb-1">Oxygène</p>
              <p className="text-[13px]">Adapter pour SpO₂ 94–98 % (HFNC/CPAP si besoin).</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-white/70 px-3 py-3">
              <p className="font-semibold text-emerald-900 mb-1">Accès vasculaire</p>
              <p className="text-[13px]">VVP immédiate, IO si &gt; 90 s d’échec.</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-white/70 px-3 py-3">
              <p className="font-semibold text-emerald-900 mb-1">Remplissage NaCl 0,9 %</p>
              <p className="text-[13px]">
                Bolus 10–20 mL/kg → <strong>{formatMl(bolus10)}</strong> –{" "}
                <strong>{formatMl(bolus20)}</strong>.
                <br />
                Répéter jusqu’à 40–60 mL/kg selon réponse ({formatMl(bolus40)} –{" "}
                {formatMl(bolus60)}).
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-white/70 px-3 py-3">
              <p className="font-semibold text-emerald-900 mb-1">Vasopresseur</p>
              <p className="text-[13px]">
                Si hypotension après 40–60 mL/kg : noradrénaline (ou adrénaline) titrée en
                réanimation.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Antibiothérapie IV dans l’heure"
          subtitle="Ne jamais retarder"
          tone="slate"
        >
          <div className="space-y-3 text-[13px]">
            <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
              <p className="font-semibold text-slate-900">Purpura fulminans</p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>
                  Ceftriaxone dose unique : <strong>{formatDose(ceftriaxoneMg)}</strong>
                  <span className="text-xs text-slate-500">
                    {" "}
                    (100 mg/kg, max {ceftriaxoneMax >= 2000 ? "2 g" : "1 g"} selon l’âge)
                  </span>
                </li>
                <li>Alternative : Céfotaxime 150–200 mg/kg/j en 3–4 injections.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
              <p className="font-semibold text-slate-900">Sepsis sévère sans purpura</p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>
                  Céfotaxime total/jour : <strong>{formatDose(cefotaximeDay)}</strong> (
                  {formatDose(cefotaximeDose)} par dose si 3 injections).
                </li>
                <li>
                  OU Amoxicilline + Acide clavulanique selon foyer (adapter au contexte &lt; 3
                  mois).
                </li>
              </ul>
            </div>
            <p className="text-xs text-slate-500">
              Toujours documenter : hémocultures, PCR, notification obligatoire si méningocoque +
              prophylaxie des contacts.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="Orientation & hospitalisation"
          subtitle="Décisions HAS/HCSP"
          tone="amber"
        >
          <ul className="list-disc pl-4 space-y-1.5 text-[13px]">
            <li>Tous les purpuras, sepsis suspect ou confirmé → hospitalisation.</li>
            <li>
              Réanimation directe si purpura fulminans, choc septique, besoin vaso-actif, polypnée
              sévère ou apnées.
            </li>
            <li>
              Indications fortes : remplissage &gt; 20 mL/kg, SpO₂ &lt; 94 % malgré O₂, TRC &gt; 3 s,
              tachycardie &gt; 2 SDS, âge &lt; 3 mois.
            </li>
            <li>
              Critères de sortie : stabilité &gt; 24 h, apyrétique, hémodynamique stable sans O₂,
              pas d’extension du purpura, suivi programmé.
            </li>
          </ul>
        </SectionCard>

        <SectionCard
          title="Situations particulières"
          subtitle="Surveillance renforcée"
          tone="indigo"
        >
          <ul className="list-disc pl-4 space-y-1.5 text-[13px]">
            <li>&lt; 3 mois : hospitalisation systématique avec bilan complet.</li>
            <li>
              Asplénie / drépanocytose : risque fulminant pneumocoque → ATB immédiate et transport
              médicalisé.
            </li>
            <li>
              Immunodépression : élargir l’antibiothérapie selon protocole hémato-oncologie.
            </li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
