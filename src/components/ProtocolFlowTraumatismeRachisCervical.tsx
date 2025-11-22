"use client";

import AgeWeightPicker from "@/components/AgeWeightPicker";
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

const formatWeight = (value: number) => Number(value.toFixed(value >= 10 ? 0 : 1));

const formatRange = (low: number, high: number) => `${formatMg(low)} – ${formatMg(high)}`;

export default function ProtocolFlowTraumatismeRachisCervical() {
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);

  const weightKg = clampWeight(weightFromStore);

  const paracetamolMg = weightKg * 15;
  const morphineInitialMg = weightKg * 0.05;
  const morphineBolusMg = weightKg * 0.01;
  const ketamineLowMg = weightKg * 0.25;
  const ketamineHighMg = weightKg * 0.5;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-[#0f172a] via-[#4b5563] to-[#1f2937] px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Trauma &amp; neuro</p>
        <h1 className="text-2xl font-extrabold tracking-wide leading-tight">Traumatisme du rachis cervical (enfant)</h1>
        <p className="text-sm text-white/85 mt-1">
          Immobilisation immédiate, évaluation ABCDE sans mobilisation, imagerie graduée selon PECARN/NICE et
          analgésie sécurisée.
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
          L’enfant est vulnérable (gros crâne, hyperlaxité, rachis très mobile) avec risque de lésion médullaire même
          si imagerie normale (SCIWORA).
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Immobilisation immédiate"
            subtitle="Aucune mobilisation avant évaluation complète"
            gradient="from-slate-500 via-slate-600 to-gray-700"
          />
          <FlowBlock
            title="Immobilisation sans délai"
            items={[
              "Alignement tête–cou–tronc, position neutre, pas d’hyperextension.",
              "Minerve rigide pédiatrique ou maintien manuel en ligne si pas de matériel.",
              "Retrait casque moto à deux opérateurs avec maintien axial continu.",
            ]}
          />
          <FlowBlock
            title="ABCDE sans mobilisation"
            items={[
              "A : maintien axial obligatoire; intubation avec maintien en ligne, vidéo-laryngoscope si possible.",
              "B : FR, tirage, asymétries; attention atteinte diaphragmatique si lésion haute (C3–C5).",
              "C : FC, TA, TRC (hypotension tardive en pédiatrie).",
              "D : GCS, mobilité/sensibilité des 4 membres, signes médullaires (anesthésie en selle, priapisme).",
              "E : rechercher polytrauma associé, exposition complète.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Signes de gravité &amp; mécanismes"
            subtitle="Déficit neurologique ou mécanisme à haute énergie"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <FlowBlock
            title="Signes cliniques"
            items={[
              "Paralysie, déficit moteur ou paresthésie.",
              "Douleur cervicale aiguë ou torticolis post-traumatique.",
              "Trouble de conscience, anomalies respiratoires (atteinte C3–C5).",
            ]}
          />
          <FlowBlock
            title="Mécanismes haute énergie"
            items={[
              "Accident routier, projection/décélération, chute > 1–2 m, plongée ou impact axial.",
              "Suspicion de maltraitance ou chocs répétés discordants.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Imagerie selon PECARN / NICE"
            subtitle="Adapter au niveau de risque"
            gradient="from-cyan-500 via-blue-500 to-indigo-500"
          />
          <FlowBlock
            title="Faible risque (pas d’imagerie)"
            items={[
              "Pas de douleur cervicale ni palpation douloureuse de la ligne médiane.",
              "Pas de déficit neurologique, état mental normal, mécanisme faible énergie.",
              "Enfant déambulant, mobilisant le cou, pas de torticolis post-traumatique → retrait minerve après examen complet.",
            ]}
          />
          <FlowBlock
            title="Risque intermédiaire"
            items={[
              "Radiographies cervicales (face, profil, transbouche C1–C2).",
              "Examen douteux ou non contributif → scanner de recours.",
            ]}
          />
          <FlowBlock
            title="Haut risque"
            items={[
              "Scanner rachis cervical d’emblée si déficit neuro, douleur intense, palpation médiane douloureuse, traumatisme haute énergie, trouble de conscience ou polytrauma.",
            ]}
          />
          <FlowBlock
            title="IRM"
            items={[
              "Si suspicion de SCIWORA (déficit neuro + scanner normal).",
              "Douleur persistante malgré imagerie normale ou suspicion lésion ligamentaire.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures thérapeutiques immédiates"
            subtitle="Analgésie, immobilisation, conduite à tenir"
            gradient="from-emerald-500 via-teal-500 to-lime-500"
          />
          <FlowBlock
            title="Analgésie sécurisée"
            items={[
              <>
                Paracétamol : <strong>{formatMg(paracetamolMg)}</strong> (15 mg/kg toutes les 6 h) pour un poids de{" "}
                <strong>{formatWeight(weightKg)}</strong> kg.
              </>,
              <>
                Morphine IV titrée : dose initiale <strong>{formatMg(morphineInitialMg)}</strong> (0,05 mg/kg), puis bolus{" "}
                <strong>{formatMg(morphineBolusMg)}</strong> (0,01 mg/kg) toutes les 5–7 min.
              </>,
              <>
                Kétamine analgésique IV : <strong>{formatRange(ketamineLowMg, ketamineHighMg)}</strong> (0,25–0,5 mg/kg)
                {" "}en complément possible sans dépression respiratoire.
              </>,
            ]}
          />
          <FlowBlock
            title="Immobilisation définitive"
            items={[
              "Lésion instable : minerve + plan dur, maintien strict et transfert spécialisé (neurochirurgie).",
              "Lésion stable : minerve rigide + surveillance clinique et respiratoire.",
            ]}
          />
          <FlowBlock
            title="À ne pas faire"
            items={[
              "Pas de corticoïdes (SCIWORA : inefficacité démontrée).",
              "Pas de traction crânienne avant avis neurochirurgical.",
              "Pas de retrait de minerve sans critères stricts PECARN/NICE; pas de manipulation cervicale.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Adapter la prudence selon l’âge et le contexte"
            gradient="from-purple-500 via-fuchsia-500 to-pink-500"
          />
          <FlowBlock
            title="Nourrisson"
            items={[
              "Rachis très mobile → SCIWORA fréquent, signes discrets (irritabilité, torticolis).",
              "Imagerie plus libérale, seuil de vigilance bas.",
            ]}
          />
          <FlowBlock
            title="Comorbidités / maltraitance"
            items={[
              "Chutes répétées, mécanismes non concordants : imagerie complète recommandée.",
              "Adapter la protection de l’enfant et documenter.",
            ]}
          />
          <FlowBlock
            title="Polytrauma"
            items={[
              "Priorité : voies aériennes et ventilation; maintien en ligne pendant gestes vitaux.",
              "Scanner corps entier si enfant stable.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation et sortie"
            subtitle="Critères d’hospitalisation ou de retour sécurisé"
            gradient="from-amber-500 via-yellow-500 to-orange-400"
          />
          <FlowBlock
            title="Hospitalisation"
            items={[
              "Lésion stable, douleur nécessitant morphine ou surveillance respiratoire.",
              "Réanimation pédiatrique si déficit neurologique, lésion instable, trouble respiratoire (atteinte médullaire haute) ou polytrauma.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "Mécanisme faible énergie, examen neuro normal, aucune douleur cervicale, mobilité normale du cou.",
              "Radiographies normales si réalisées, minerve retirée en sécurité, environnement familial fiable et reconsultation < 24 h.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
