"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import AgeWeightPicker from "@/components/AgeWeightPicker";
import { estimateAgeFromWeight } from "@/lib/ageWeightModels";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 3;
const MAX_W = 80;
const clampWeight = (value: number) => Math.min(Math.max(value, MIN_W), MAX_W);

const toggleBase =
  "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2";

const formatNumber = (value: number, digits?: number) => {
  const precision = typeof digits === "number" ? digits : value >= 10 ? 0 : 1;
  return Number(value.toFixed(precision));
};

const formatMl = (value: number) => `${formatNumber(value)} mL`;
const formatMlRange = (min: number, max: number) => `${formatNumber(min)} – ${formatNumber(max)} mL`;

function Calc({ children }: { children: ReactNode }) {
  return <span className="block text-xs font-semibold text-slate-500">{children}</span>;
}

type SectionCardProps = { title: string; subtitle?: string; children: ReactNode };

function SectionCard({ title, subtitle, children }: SectionCardProps) {
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

type OrientationCard = {
  title: string;
  tone: "green" | "amber" | "red";
  bullets: ReactNode[];
  footnote?: ReactNode;
};

const toneStyles: Record<OrientationCard["tone"], { badge: string; border: string; text: string }> = {
  green: { badge: "bg-emerald-500", border: "border-emerald-200", text: "text-emerald-900" },
  amber: { badge: "bg-amber-500", border: "border-amber-200", text: "text-amber-900" },
  red: { badge: "bg-rose-600", border: "border-rose-200", text: "text-rose-900" },
};

export default function ProtocolFlowNoyade() {
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);

  const weightKg = clampWeight(
    Number.isFinite(weightFromStore ?? NaN) ? (weightFromStore as number) : 18
  );

  useEffect(() => {
    if (!ageLabel) {
      const estimated = estimateAgeFromWeight(weightKg);
      if (estimated) setAgeLabel(estimated);
    }
  }, [ageLabel, setAgeLabel, weightKg]);

  const [scenario, setScenario] = useState<"acr" | "severe" | "resp" | "light">("severe");

  const ketamineMg = weightKg * 2;
  const rocuroniumMg = weightKg * 1;
  const glucoseBolusMl = weightKg * 2;
  const vtMin = weightKg * 6;
  const vtMax = weightKg * 8;
  const naclBolus20 = weightKg * 20;
  const naclBolus40 = weightKg * 40;
  const adrenalineAcrMg = weightKg * 0.01;
  const nebAdrenalineMl = Math.min(weightKg * 0.5, 5);
  const salbutamolMg = Math.min(Math.max(weightKg * 0.15, 2.5), 5);

  const orientation = useMemo<OrientationCard>(() => {
    if (scenario === "acr") {
      return {
        title: "Arrêt cardio-respiratoire / apnée",
        tone: "red",
        bullets: [
          "RCP pédiatrique complète, ventilation BAVU + O₂ 100 % dès l’extraction.",
          <span key="adr">
            Adrénaline IV/IO 0,01 mg/kg toutes 3–5 min : <strong>{formatMg(adrenalineAcrMg)}</strong> (≈
            <strong> {formatMl(adrenalineAcrMg)}</strong> à 1 mg/mL).
          </span>,
          "Réchauffer activement, recherche étiologies réversibles (hypoxie, hypothermie).",
        ],
        footnote: "RCP prolongée possible si immersion eau froide + hypothermie sévère.",
      };
    }
    if (scenario === "severe") {
      return {
        title: "Détresse respiratoire sévère",
        tone: "red",
        bullets: [
          "SpO₂ < 94 %, tirage majeur, GCS < 8 ou incapacité à protéger les VAS.",
          "Intubation séquence rapide : kétamine + curare, ventilation protectrice.",
          "Surveillance continue + préparation SDRA, avis réanimation.",
        ],
        footnote: "Intuber tôt si épuisement respiratoire ou suspicion de SDRA.",
      };
    }
    if (scenario === "resp") {
      return {
        title: "Symptômes respiratoires modérés",
        tone: "amber",
        bullets: [
          "Toux, râles, SpO₂ 90–94 %, respiration spontanée efficace.",
          "O₂ titré au masque haute concentration + nébulisations ciblées.",
          "Monitorage scope, radio thorax, surveillance ≥ 6 h.",
        ],
        footnote: "Hospitalisation si signes persistants, radio anormale ou terrain fragile.",
      };
    }
    return {
      title: "Forme légère / surveillance",
      tone: "green",
      bullets: [
        "Toux isolée, auscultation presque normale, SpO₂ ≥ 95 %.",
        "Observation 6–8 h avec saturométrie, pas d’O₂ systématique.",
        "Informer parents sur les signes d’alerte et consignes de réchauffement.",
      ],
      footnote: "Sortie si examen strictement normal après 6 h sans oxygène.",
    };
  }, [adrenalineAcrMg, scenario]);

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-sky-600 to-blue-800 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Respiration &amp; réanimation</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide">Noyade / Submersion</h1>
        <p className="text-sm text-white/80">Stabiliser l’oxygénation, prévenir le SDRA et les rechutes</p>

        <div className="mt-4 rounded-3xl bg-white/95 p-3 text-gray-900 shadow-sm">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>

        <p className="mt-4 text-sm text-white/85">
          Extraire, sécher, réchauffer activement. Toute SpO₂ &lt; 94 % impose une oxygénothérapie au masque 10–15
          L/min.
        </p>
      </div>

      <div className="mt-4 px-4 space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Présentation</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              className={`${toggleBase} ${
                scenario === "acr"
                  ? "border-slate-900 bg-slate-900 text-white shadow"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              }`}
              onClick={() => setScenario("acr")}
            >
              ACR / apnée
              <span className="block text-xs font-normal text-white/80">RCP + BAVU</span>
            </button>
            <button
              type="button"
              className={`${toggleBase} ${
                scenario === "severe"
                  ? "border-slate-900 bg-slate-900 text-white shadow"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              }`}
              onClick={() => setScenario("severe")}
            >
              Détresse sévère
              <span className="block text-xs font-normal text-white/80">Intubation</span>
            </button>
            <button
              type="button"
              className={`${toggleBase} ${
                scenario === "resp"
                  ? "border-slate-900 bg-slate-900 text-white shadow"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              }`}
              onClick={() => setScenario("resp")}
            >
              Symptômes respi
              <span className="block text-xs font-normal text-white/80">SpO₂ 90–94 %</span>
            </button>
            <button
              type="button"
              className={`${toggleBase} ${
                scenario === "light"
                  ? "border-slate-900 bg-slate-900 text-white shadow"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              }`}
              onClick={() => setScenario("light")}
            >
              Forme légère
              <span className="block text-xs font-normal text-white/80">Surveillance</span>
            </button>
          </div>
        </div>

        <div
          className={`rounded-3xl border ${toneStyles[orientation.tone].border} bg-white px-4 py-4 shadow-sm ${
            toneStyles[orientation.tone].text
          }`}
        >
          <div className="mb-2 flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${toneStyles[orientation.tone].badge}`} />
            <p className="text-sm font-semibold">{orientation.title}</p>
          </div>
          <ul className="list-disc space-y-1.5 pl-5 text-sm">
            {orientation.bullets.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          {orientation.footnote && (
            <p className="mt-2 text-xs font-medium text-slate-500">{orientation.footnote}</p>
          )}
        </div>

        <SectionCard title="ABCDE initial" subtitle="Stabiliser en quelques minutes">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>A – Aspirer eau/sable, PLS si inconscient, collier si trauma.</li>
            <li>B – SpO₂ cible 94–98 %, O₂ 10–15 L/min si &lt; 94 %, BAVU si apnée.</li>
            <li>C – Pouls, TRC, TA, 1–2 VVP (ou IO), prélèvements gaz/iono.</li>
            <li>D – GCS, pupilles, glycémie capillaire, corriger hypoglycémie.</li>
            <li>E – Déshabiller, sécher, réchauffer activement, rechercher traumatismes.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Voies aériennes &amp; intubation" subtitle="Séquence rapide si GCS &lt; 8 ou détresse">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Kétamine 2 mg/kg IV : <strong>{formatMg(ketamineMg)}</strong>
              <Calc>2 × {formatNumber(weightKg, 1)} kg = {formatMg(ketamineMg)}</Calc>
            </li>
            <li>
              Rocuronium 1 mg/kg IV : <strong>{formatMg(rocuroniumMg)}</strong>
              <Calc>1 × {formatNumber(weightKg, 1)} kg = {formatMg(rocuroniumMg)}</Calc>
            </li>
            <li>Pré-oxygéner, aspiration rapide, prévoir sonde calibre supérieur (œdème).</li>
            <li>
              Hypoglycémie (&lt; 0,7 g/L) → Glucose 10 % 2 mL/kg : <strong>{formatMl(glucoseBolusMl)}</strong>
              <Calc>2 × {formatNumber(weightKg, 1)} kg = {formatMl(glucoseBolusMl)}</Calc>
            </li>
          </ul>
        </SectionCard>

        <SectionCard title="Ventilation &amp; oxygénation" subtitle="Objectif SpO₂ 94–98 %">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Masque haute concentration 10–15 L/min si SpO₂ &lt; 94 %.</li>
            <li>Ventiler au BAVU si apnée ou respirations inefficaces.</li>
            <li>
              Si intubé → ventilation protectrice : Vt 6–8 mL/kg = <strong>{formatMlRange(vtMin, vtMax)}</strong>, PEEP
              5–8 cmH₂O, FiO₂ titrée.
            </li>
            <li>Surveiller signes de SDRA : compliance basse, hypoxémie persistante.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Circulation &amp; remplissage" subtitle="Corriger hypovolémie et hypoxie">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              NaCl 0,9 % en bolus 20 mL/kg : <strong>{formatMl(naclBolus20)}</strong>
              <Calc>20 × {formatNumber(weightKg, 1)} kg = {formatMl(naclBolus20)}</Calc>
            </li>
            <li>
              Répéter jusqu’à 40 mL/kg max si besoin : <strong>{formatMl(naclBolus40)}</strong>
            </li>
            <li>
              En ACR : Adrénaline 0,01 mg/kg IV/IO : <strong>{formatMg(adrenalineAcrMg)}</strong> (≈
              <strong>{formatMl(adrenalineAcrMg)}</strong> à 1 mg/mL).
            </li>
            <li>Réchauffer, surveiller TA/PAM, envisager transfusion si choc hémorragique associé.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Traitements inhalés / bronchospasme" subtitle="Selon clinique">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Laryngospasme suspecté → Adrénaline 1 mg/mL nébulisée 0,5 mL/kg (max 5 mL) :
              <strong> {formatMl(nebAdrenalineMl)}</strong>
              <Calc>0,5 × {formatNumber(weightKg, 1)} kg = {formatMl(nebAdrenalineMl)} (cap 5 mL)</Calc>
            </li>
            <li>
              Bronchospasme → Salbutamol 0,15 mg/kg (min 2,5 mg, max 5 mg) : <strong>{formatMg(salbutamolMg)}</strong>
            </li>
            <li>Répéter si besoin et monitorer la saturation en continu.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Examens &amp; orientation" subtitle="Adapter au risque">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Monitorage SpO₂/ECG/TA d’emblée, GDS si détresse respiratoire.</li>
            <li>Radio thorax si toux, tirage ou désaturation persistante.</li>
            <li>Iono, lactates, fonction rénale selon gravité, ECG si hypothermie.</li>
            <li>Pas d’antibiotique ou corticoïde systématique, sauf indication spécifique.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Orientation &amp; critères" subtitle="Hospitalisation vs sortie">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Hospitaliser si SpO₂ &lt; 95 % à 1 h, signes respiratoires persistants, radio anormale.</li>
            <li>Autres critères : hypothermie, GCS &lt; 15, réanimation initiale, fièvre ou toux importante.</li>
            <li>Sortie si asymptomatique, SpO₂ ≥ 95 % ≥ 6 h sans O₂, examen pulmonaire normal, parents fiables.</li>
            <li>Signaler hypothermie sévère (réchauffement actif) et suspicion maltraitance &lt; 2 ans.</li>
            <li>Eau douce vs salée → conduite identique (recommandations AAP/ERC).</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
