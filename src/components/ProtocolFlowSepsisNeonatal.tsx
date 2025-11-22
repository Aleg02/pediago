"use client";

import AgeWeightPicker from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 1;
const MAX_W = 8;
const DEFAULT_W = 3.2;

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

const formatMcg = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return "—";
  const v = value as number;
  if (v < 1) return `${Number(v.toFixed(2))} µg`;
  if (v < 10) return `${Number(v.toFixed(1))} µg`;
  return `${Math.round(v)} µg`;
};

export default function ProtocolFlowSepsisNeonatal() {
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  const weightKg = clampWeight(weightFromStore);

  const bolus10 = weightKg * 10; // mL
  const dextrose = weightKg * 2; // mL of G10%

  const ampiDose = weightKg * 100; // mg per dose q12h
  const ampiDay = weightKg * 200; // mg/day
  const ampiMeningiteLow = weightKg * 200;
  const ampiMeningiteHigh = weightKg * 300;

  const gentaLow = weightKg * 4;
  const gentaHigh = weightKg * 5;

  const cefotaximeDose = weightKg * 50;
  const cefotaximeDay = weightKg * 150;

  const adrenalineLow = weightKg * 0.05;
  const adrenalineHigh = weightKg * 0.3;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-[#0B3954] via-[#1B4965] to-[#247BA0] px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Infectieux · Nouveau-né</p>
        <h1 className="text-2xl font-extrabold tracking-wide leading-tight">Sepsis néonatal précoce (≤ 72 h)</h1>
        <p className="text-sm text-white/85 mt-1">
          Identifier rapidement le risque, démarrer l’antibiothérapie IV sans délai et stabiliser l’hémodynamique.
        </p>
        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>
        <p className="mt-3 text-[13px] text-white/80">
          Nouveau-né ≤ 72 h : conduite standardisée de la suspicion au traitement empirique.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Évaluation initiale ABCDE"
            subtitle="Stabiliser avant prélèvements"
            gradient="from-sky-500 via-indigo-500 to-blue-500"
          />
          <FlowBlock
            title="A – Airway"
            items={[
              "Libérer les VAS, aspiration des sécrétions si besoin.",
              "Ventilation assistée si apnées ou hypotonie marquée.",
            ]}
          />
          <FlowBlock
            title="B – Breathing"
            items={[
              "FR > 60/min, geignement, tirage ou apnées = signes évocateurs.",
              "O₂ titré pour SpO₂ 94–98 % (MHC si détresse).",
            ]}
          />
          <FlowBlock
            title="C – Circulation"
            items={[
              "TRC > 3 s, marbrures, tachycardie > 180/min, hypotension tardive.",
              <span key="bolus">
                Perfusion : <strong>{formatMl(bolus10)}</strong> de NaCl 0,9 % (10 mL/kg) en 10–20 min, réévaluer et répéter 1
                fois si besoin.
              </span>,
            ]}
          />
          <FlowBlock
            title="D – Disability"
            items={["Irritabilité, léthargie, troubles du tonus, convulsions."]}
          />
          <FlowBlock
            title="E – Exposition"
            items={["Instabilité thermique &lt; 36 °C ou &gt; 38 °C, rechercher purpura/nécrose."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Facteurs de risque maternels (HAS 2020)"
            subtitle="Augmentent le risque de sepsis précoce"
            gradient="from-amber-500 via-orange-500 to-yellow-400"
          />
          <FlowBlock
            title="Très significatifs"
            items={[
              "Chorioamniotite clinique, fièvre maternelle ≥ 38 °C.",
              "Colonisation SGB non couverte, ATB maternels inadaptés.",
              "RPM ≥ 18 h, prématurité &lt; 37 SA, infection urinaire maternelle à entérobactéries non traitée.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Signes cliniques évocateurs"
            subtitle="Chez le nouveau-né ≤ 72 h"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <FlowBlock
            title="Respiratoire"
            items={["Tachypnée, tirage, geignement, apnées."]}
          />
          <FlowBlock
            title="Neurologique / cardio"
            items={["Irritabilité, convulsions, léthargie, tachycardie, TRC > 3 s, marbrures."]}
          />
          <FlowBlock
            title="Digestif / température"
            items={["Vomissements, ballonnement, mauvaise succion, hypo ou hyperthermie, pâleur/ictère précoce."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Stratification du risque"
            subtitle="Selon symptômes et facteurs maternels"
            gradient="from-emerald-500 via-teal-500 to-green-500"
          />
          <FlowBlock
            title="Nouveau-né symptomatique"
            items={["Antibiothérapie IV immédiate + bilan complet (hémoc, FNS/CRP, gaz, glycémie, ± LCR stable)."]}
          />
          <FlowBlock
            title="Nouveau-né à haut risque (facteurs majeurs HAS/SFN)"
            items={["Hémoculture + FNS/CRP + antibiothérapie immédiate, surveillance rapprochée en milieu hospitalier."]}
          />
          <FlowBlock
            title="À risque mais asymptomatique"
            items={["Hémoculture, FNS/CRP à 12–24 h, surveillance clinique continue 48 h."]}
          />
          <FlowBlock
            title="Faible risque asymptomatique"
            items={["Surveillance clinique rapprochée ≥ 48 h, pas d’antibiotiques systématiques."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Bilan diagnostique"
            subtitle="Adapter aux symptômes"
            gradient="from-indigo-500 via-violet-500 to-purple-500"
          />
          <FlowBlock
            title="Symptomatique"
            items={[
              "Hémoculture, FNS + CRP, ionogramme, gaz du sang, glycémie capillaire.",
              "± LCR si état stable (si purpura/instabilité : ATB avant LCR), ± Rx thorax.",
            ]}
          />
          <FlowBlock
            title="À risque asymptomatique"
            items={["Hémoculture immédiate, FNS/CRP différées (12–24 h)."]}
          />
          <FlowBlock
            title="Faible risque"
            items={["Surveillance clinique sans examens invasifs si évolution favorable."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Antibiothérapie empirique IV"
            subtitle="HAS + SFN"
            gradient="from-emerald-500 via-lime-500 to-green-500"
          />
          <FlowBlock
            title="Association recommandée"
            items={[
              <span key="ampi">
                Ampicilline / Amoxicilline : <strong>{formatMg(ampiDose)}</strong> toutes les 12 h ({formatMg(ampiDay)} /j). Si
                méningite : {formatMg(ampiMeningiteLow)} à {formatMg(ampiMeningiteHigh)} /j en 3–4 injections.
              </span>,
              <span key="genta">
                Gentamicine IV : dose unique quotidienne <strong>{formatMg(gentaLow)}</strong> à <strong>{formatMg(gentaHigh)}</strong>.
              </span>,
            ]}
          />
          <FlowBlock
            title="Escalade si E. coli sévère / sepsis choc"
            items={[
              <span key="cefo">
                Céfotaxime : <strong>{formatMg(cefotaximeDose)}</strong> toutes les 8 h (≈ {formatMg(cefotaximeDay)} /j), surtout
                si méningite ou sepsis sévère.
              </span>,
            ]}
          />
          <FlowBlock
            title="Risque Listeria"
            items={["Ampicilline 200–300 mg/kg/j + gentamicine."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Autres mesures thérapeutiques"
            subtitle="Stabilisation et support"
            gradient="from-slate-800 via-slate-700 to-slate-900"
          />
          <FlowBlock
            title="Oxygène & remplissage"
            items={[
              "Cible SpO₂ 94–98 %.",
              <span key="bolus2">
                Remplissage choc : <strong>{formatMl(bolus10)}</strong> de NaCl 0,9 % (10 mL/kg), à répéter 1 fois si besoin.
              </span>,
            ]}
          />
          <FlowBlock
            title="Vaso-actifs (réanimation)"
            items={[
              <span key="adreno">
                Adrénaline : <strong>
                  {formatMcg(adrenalineLow)} – {formatMcg(adrenalineHigh)}
                </strong>{" "}
                µg/min (0,05–0,3 µg/kg/min).
              </span>,
            ]}
          />
          <FlowBlock
            title="Glycémie"
            items={[
              <span key="g10">
                Hypoglycémie (&lt; 2,5 mmol/L) : <strong>{formatMl(dextrose)}</strong> de glucose 10 % IV (2 mL/kg).
              </span>,
            ]}
          />
          <FlowBlock
            title="Thermorégulation"
            items={[
              "Maintien en incubateur ou peau à peau, éviter hypothermie/hyperthermie.",
              "Pas d’AINS ; paracétamol rarement utilisé chez nouveau-né instable.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Surveillance et orientation"
            subtitle="Hospitalisation systématique si ATB ou risque élevé"
            gradient="from-cyan-500 via-blue-500 to-indigo-500"
          />
          <FlowBlock
            title="Hospitalisation"
            items={[
              "Obligatoire si symptômes, facteurs de risque majeurs, instabilité thermique ou ATB initiés.",
              "Réanimation si choc, détresse respiratoire, convulsions, acidose sévère, méningite probable.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "Enfant asymptomatique, surveillance 48 h complète, examens normaux si réalisés.",
              "Environnement familial fiable et consultation d’urgence accessible ; suivi pédiatrique programmé.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
