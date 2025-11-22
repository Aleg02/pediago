"use client";

import { useEffect, useMemo, useState } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 3;
const MAX_W = 120;
const DEFAULT_W = 20;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

const toggleBase =
  "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2";

const formatG = (mg: number) => `${Number((mg / 1000).toFixed(mg >= 1000 ? 1 : 2))} g`;

export default function ProtocolFlowInhalationCO() {
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);

  const weightKg = clampWeight(weightFromStore);

  useEffect(() => {
    if (!ageLabel) {
      const estimated = estimateAgeFromWeight(weightKg);
      if (estimated) setAgeLabel(estimated);
    }
  }, [ageLabel, setAgeLabel, weightKg]);

  const [severity, setSeverity] = useState<"critique" | "severe" | "moderee" | "legere">("severe");

  const hydroxoMg = Math.min(weightKg * 70, 5000);
  const paracetamolDose = weightKg * 15;
  const paracetamolDailyMax = weightKg * 60;
  const morphineInit = weightKg * 0.05;
  const morphineBolus = weightKg * 0.01;

  const severityCard = useMemo(() => {
    if (severity === "critique") {
      return {
        title: "Détresse vitale / arrêt respi",
        tone: "bg-rose-100 border-rose-200 text-rose-900",
        bullets: [
          "Apnée ou coma, signes d’obstruction VAS, stridor sévère.",
          "O₂ 100 % immédiat au BAVU, intubation si incapacité à protéger les VAS.",
          "Remplissage IV/IO, préparation transfert réanimation + hyperbarie si critères.",
        ],
      } as const;
    }
    if (severity === "severe") {
      return {
        title: "Intoxication sévère",
        tone: "bg-amber-100 border-amber-200 text-amber-900",
        bullets: [
          "COHb ≥ 20–25 % ou signes neuro/cardio (coma, convulsions, ischémie).",
          "O₂ 100 % non titré, contacter centre hyperbare, surveillance continue.",
          "Rechercher cyanures si incendie en espace clos + lactate > 8 mmol/L.",
        ],
      } as const;
    }
    if (severity === "moderee") {
      return {
        title: "Forme modérée",
        tone: "bg-sky-100 border-sky-200 text-sky-900",
        bullets: [
          "Céphalées, vomissements, confusion légère, COHb intermédiaire.",
          "O₂ 100 % au masque haute concentration, GDS + ECG, surveillance 6–12 h.",
          "Hydratation, antalgie, vigilance sur œdème des VAS retardé.",
        ],
      } as const;
    }
    return {
      title: "Forme légère / sortie possible",
      tone: "bg-emerald-100 border-emerald-200 text-emerald-900",
      bullets: [
        "Symptômes résolus sous O₂, COHb < 3 %.",
        "Examen respiratoire strictement normal, environnement sécurisé.",
        "Informer parents des signes d’alerte et programmer un contrôle.",
      ],
    } as const;
  }, [severity]);

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-800 to-rose-700 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Inhalation de fumées / CO</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">Oxygène 100 % immédiat</h1>
        <p className="text-sm text-white/85 mt-1">
          Standardiser la prise en charge des inhalations de fumées et intoxications au CO pédiatriques : ABCDE, O₂ 100 % non
          titré, dépistage des cyanures et indications d’hyperbarie.
        </p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">Orientation rapide</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {["critique", "severe", "moderee", "legere"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSeverity(level as typeof severity)}
                  className={`${toggleBase} border-white/40 bg-white/90 text-slate-900 hover:bg-white focus-visible:ring-white/70 ${
                    severity === level ? "ring-2 ring-white" : ""
                  }`}
                >
                  {level === "critique"
                    ? "Détresse vitale"
                    : level === "severe"
                      ? "Sévérité CO"
                      : level === "moderee"
                        ? "Modérée"
                        : "Légère / sortie"}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">Notes critiques</p>
            <ul className="mt-1 list-disc pl-4 space-y-1 text-sm text-white">
              <li>Ne pas titrer l’O₂ : objectif = élimination maximale du CO.</li>
              <li>SpO₂ peu fiable (surestime) → se fier au COHb et à la clinique.</li>
              <li>Anticiper œdème VAS : intubation précoce si brûlures cervico-faciales.</li>
            </ul>
          </div>
        </div>

        <div className={`mt-4 rounded-2xl border ${severityCard.tone} p-3 shadow-sm bg-white/80`}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-800">Situation actuelle</p>
          <p className="mt-1 text-base font-bold text-slate-900">{severityCard.title}</p>
          <ul className="mt-1 list-disc pl-4 space-y-1 text-sm text-slate-800">
            {severityCard.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="ABCDE + oxygène 100 % immédiat"
            subtitle="Sécuriser les VAS et ventiler en FiO₂ = 1 sans délai"
            gradient="from-slate-900 via-slate-800 to-rose-700"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A - Airway"
              items={[
                "Brûlure visage/barbe nasale, suies oropharyngées, voix rauque, stridor, toux.",
                "Intubation précoce si détresse respi, brûlures cervico-faciales avec risque d’œdème, suies + altération conscience, Glasgow ≤ 8.",
                "Extraction du milieu toxique, retirer vêtements imprégnés, sécuriser l’équipe (EPI).",
              ]}
            />
            <FlowBlock
              title="B - Breathing"
              items={[
                "SpO₂ monitorée mais peu fiable en cas de CO (surestime).",
                "Gaz du sang + COHb (co-oxymétrie) = examen clé ; suspicion cyanures si lactate > 8 mmol/L.",
                "Ventilation assistée au BAVU avec O₂ 100 % si besoin, préparation intubation si signe d’épuisement.",
              ]}
            />
            <FlowBlock
              title="C - Circulation"
              items={[
                "TA, FC, TRC, perfusion périphérique ; VVP/IO si critique.",
                "Si incendie en espace clos + choc : penser intoxication aux cyanures (lactate > 8–10 mmol/L).",
              ]}
            />
            <FlowBlock
              title="D - Neurologique"
              items={["Confusion, agitation, convulsions, coma = marqueur de gravité du CO."]}
            />
            <FlowBlock
              title="E - Exposition"
              items={["Rechercher brûlures associées, retirer vêtements imprégnés, surveiller hypothermie."]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Critères d’intoxication sévère (CO)"
            subtitle="Déterminer l’indication d’oxygénothérapie hyperbare"
            gradient="from-rose-600 via-amber-500 to-yellow-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="Signes majeurs"
              items={[
                "COHb ≥ 25 % (≥ 20 % si enfant) ou grossesse : hyperbarie dès COHb ≥ 15 %.",
                "Troubles neurologiques : coma, convulsions, confusion sévère.",
                "Signes cardiaques : ischémie, arythmie, collapsus ; acidose métabolique sévère.",
              ]}
            />
            <FlowBlock
              title="Décision hyperbare"
              items={[
                "Si critère présent → appel centre hyperbare + transfert dédié après stabilisation.",
                "Poursuivre O₂ 100 % en continu pendant l’attente et le transport.",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Oxygénothérapie (traitement principal)"
            subtitle="FiO₂ = 1 au masque haute concentration 12–15 L/min"
            gradient="from-sky-500 via-cyan-500 to-emerald-500"
          />
          <div className="space-y-3">
            <FlowBlock
              title="Effet attendu"
              items={[
                "La FiO₂ = 1 divise par ~3 la demi-vie du COHb (≈ 60–90 min vs 4–6 h en air ambiant).",
                "En hyperbare (2,5 ATA) : demi-vie ~20–30 min (si disponible et critères remplis).",
              ]}
            />
            <FlowBlock
              title="Modalités"
              items={[
                "Masque haute concentration 12–15 L/min, ne pas titrer avant élimination du CO.",
                "Surveillance continue : conscience, ECG, capnie, COHb répétée, vigilance œdème VAS (jusqu’à 24 h).",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Suspicion de cyanures associés"
            subtitle="Incendie en espace clos + coma/choc + lactate > 8 mmol/L"
            gradient="from-purple-600 via-rose-500 to-orange-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="Signes évocateurs"
              items={[
                "Incendie appartement/pièce fermée, suies oropharyngées, coma + collapsus, lactate > 8–10 mmol/L.",
              ]}
            />
            <FlowBlock
              title="Traitement antidote"
              items={[
                <span key="hydroxo">
                  Hydroxocobalamine (Cyanokit®) 70 mg/kg IV (max 5 g) en 15 min : <strong>{formatMg(hydroxoMg)}</strong>{" "}
                  (≈ <strong>{formatG(hydroxoMg)}</strong>), renouvelable 1× si choc persistant.
                </span>,
                "Poursuivre remplissage, avis réanimation, compatibilité avec hyperbarie selon centre.",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Examens & traitements complémentaires"
            subtitle="Adapter à la présentation clinique et au terrain"
            gradient="from-slate-800 via-slate-700 to-slate-600"
          />
          <div className="space-y-3">
            <FlowBlock
              title="Examens clés"
              items={[
                "COHb (co-oxymétrie), gaz du sang + lactate.",
                "ECG + troponine si signes cardiaques ; ionogramme ; radio thorax si inhalation suspectée.",
              ]}
            />
            <FlowBlock
              title="Antalgie / confort"
              items={[
                <span key="para">
                  Paracétamol 15 mg/kg toutes 6 h (max 60 mg/kg/j) : <strong>{formatMg(paracetamolDose)}</strong> par prise,
                  max <strong>{formatMg(paracetamolDailyMax)}</strong>/j.
                </span>,
                <span key="morph">
                  Morphine IV titrée : dose initiale <strong>{formatMg(morphineInit)}</strong> (0,05 mg/kg) puis bolus
                  <strong>{formatMg(morphineBolus)}</strong> toutes 5–7 min selon réponse, avec surveillance respiratoire.
                </span>,
              ]}
            />
            <FlowBlock
              title="À éviter"
              items={[
                "Pas de bêta2 systématique (Ventoline) sauf bronchospasme avéré.",
                "Pas de charbon activé pour l’intoxication au CO.",
                "Pas d’antibiotiques prophylactiques (hors infection documentée).",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation & critères de sortie"
            subtitle="Hospitaliser toute exposition significative ou symptôme"
            gradient="from-emerald-500 via-green-500 to-lime-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="Hospitalisation pédiatrique"
              items={[
                "Symptômes persistants (céphalées, vomissements, confusion), COHb initial ≥ 10 %.",
                "Brûlures associées, suspicion inhalation de fumées (œdème VAS possible jusqu’à 24 h).",
                "Critères sociaux ou surveillance parentale incertaine.",
              ]}
            />
            <FlowBlock
              title="Réanimation"
              items={[
                "Détresse respiratoire, GCS < 13, signes cardiaques, lactate > 8 mmol/L, nécessité d’intubation ou d’hydroxocobalamine.",
              ]}
            />
            <FlowBlock
              title="Sortie possible si TOUT"
              items={[
                "Symptômes complètement résolus, COHb < 3 % chez l’enfant.",
                "ECG normal, pas d’acidose, aucune suspicion de brûlure/inhalation VAS.",
                "Étiologie maîtrisée (logement sécurisé), surveillance parentale fiable, rendez-vous de contrôle programmé.",
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
