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

const formatMcgRange = (min: number, max: number) => `${formatMcg(min)} – ${formatMcg(max)}`;

const formatWeight = (value: number) => Number(value.toFixed(value >= 10 ? 0 : 1));

export default function ProtocolFlowTraumatismeThoracique() {
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);

  const weightKg = clampWeight(weightFromStore);

  const paracetamolMg = weightKg * 15;
  const morphineInitialMg = weightKg * 0.05;
  const morphineBolusMg = weightKg * 0.01;
  const naclBolusMl = weightKg * 20;
  const adrenalineLowMcgMin = weightKg * 0.05;
  const adrenalineHighMcgMin = weightKg * 0.3;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-[#0f172a] via-[#1d4ed8] to-[#2563eb] px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Respiration &amp; trauma</p>
        <h1 className="text-2xl font-extrabold tracking-wide leading-tight">Traumatisme thoracique pédiatrique</h1>
        <p className="text-sm text-white/85 mt-1">
          ABCDE, recherche des lésions (contusion, pneumo/hémothorax), décompression en urgence si pneumothorax
          compressif.
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
          Thorax très souple chez l’enfant : contusion sévère possible sans signe externe. Surveiller SpO₂, TA, TRC.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="ABCDE immédiat"
            subtitle="Stabiliser avant de catégoriser la lésion"
            gradient="from-sky-500 via-indigo-500 to-blue-500"
          />
          <FlowBlock
            title="A – Airway"
            items={[
              "Libérer les VAS (aspiration sang/vomissements).",
              "GCS < 9 ou détresse respi → intubation orotrachéale.",
            ]}
          />
          <FlowBlock
            title="B – Breathing"
            items={[
              "FR, SpO₂, tirage, asymétrie thoracique, murmure vésiculaire.",
              "O₂ titré pour SpO₂ 94–98 % si pneumothorax non compressif; MHC 10–15 L/min si détresse.",
            ]}
          />
          <FlowBlock
            title="C – Circulation"
            items={[
              "TA, TRC, recherche de choc associé (tachycardie, hypotension).",
              "2 VVP ± IO, prélèvements, prévention hypothermie.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Signes de gravité imposant action immédiate"
            subtitle="Décompression / drainage sans attendre l’imagerie"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <FlowBlock
            title="Pneumothorax compressif"
            items={[
              "Asymétrie thoracique majeure, distension, murmure absent, hypotension, déviation trachéale.",
              "Ponction exsufflative immédiate (4ᵉ–5ᵉ EIC, ligne axillaire antérieure), puis drain thoracique.",
            ]}
          />
          <FlowBlock
            title="Contusion pulmonaire sévère"
            items={[
              "Hypoxie malgré O₂, polypnée, tirage, geignement, râles diffus.",
              "Gaz du sang : PaO₂ < 60 mmHg sous O₂ → VNI ou intubation selon épuisement.",
            ]}
          />
          <FlowBlock
            title="Hémothorax sévère"
            items={[
              "Matité franche, murmure diminué + signes de choc.",
              "Écho/Rx : collection importante → drainage + remplissage transfusionnel si besoin.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures immédiates"
            subtitle="Oxygène, décompression, analgésie, remplissage"
            gradient="from-emerald-500 via-teal-500 to-lime-500"
          />
          <FlowBlock
            title="Oxygène"
            items={[
              "Détresse ou polytrauma : O₂ 15 L/min (FiO₂=1).",
              "Sinon titrer SpO₂ 94–98 %.",
            ]}
          />
          <FlowBlock
            title="Décompression pneumothorax compressif"
            items={[
              "Aiguille 14–18G au 4ᵉ–5ᵉ EIC ligne axillaire antérieure.",
              "Drain thoracique systématique après exsufflation.",
            ]}
          />
          <FlowBlock
            title="Analgésie"
            items={[
              <>
                Paracétamol : <strong>{formatMg(paracetamolMg)}</strong> (15 mg/kg/6 h).
              </>,
              <>
                Morphine IV dose initiale : <strong>{formatMg(morphineInitialMg)}</strong> (0,05 mg/kg), puis titration{" "}
                <strong>{formatMg(morphineBolusMg)}</strong> (0,01 mg/kg) toutes les 5–7 min.
              </>,
            ]}
          />
          <FlowBlock
            title="Remplissage / vasopresseurs"
            items={[
              <>
                NaCl 0,9 % ou RL : <strong>{formatMl(naclBolusMl)}</strong> (20 mL/kg), réévaluer et répéter 1 fois si
                besoin.
              </>,
              <>
                Adrénaline IVSE 0,05–0,3 µg/kg/min : <strong>{formatMcgRange(adrenalineLowMcgMin, adrenalineHighMcgMin)}</strong>
                {" "}µg/min pour <strong>{formatWeight(weightKg)}</strong> kg.
              </>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Conduite selon la lésion"
            subtitle="Adapter geste et drainage"
            gradient="from-cyan-500 via-blue-500 to-indigo-500"
          />
          <FlowBlock
            title="Contusion pulmonaire"
            items={[
              "O₂ titré (94–98 %), position demi-assise, analgésie pour éviter l’hypoventilation.",
              "Limiter les apports hydriques. VNI si hypoxie persistante; intubation si PaO₂ < 60 mmHg ou épuisement.",
              "Pas de corticoïdes ni d’antibiothérapie prophylactique.",
            ]}
          />
          <FlowBlock
            title="Pneumothorax"
            items={[
              "Compressif : décompression immédiate puis drainage (pas d’attente radiologique).",
              "Simple stable : O₂ titré + surveillance; Rx de contrôle. Si volume ≥ 20–30 % ou dyspnée → drainage.",
              "Taille du drain (pneumothorax) : < 1 an 10–12 Fr; 1–6 ans 12–16 Fr; > 6 ans 16–20 Fr (antéro-supérieur).",
            ]}
          />
          <FlowBlock
            title="Hémothorax"
            items={[
              "Matité + murmure diminué, écho FAST utile; Rx : opacité basale.",
              "Indication drainage si > 20 % volume thoracique, instabilité, progression, ou ponction initiale > 10–15 mL/kg.",
              "Taille du drain : 16–24 Fr selon âge/poids, position antéro-inférieure. Associer remplissage ± transfusion (Hb < 8 g/dL ou choc persistant).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Imagerie et orientation"
            subtitle="Radiographie initiale, échographie, scanner si besoin"
            gradient="from-amber-500 via-orange-500 to-yellow-400"
          />
          <FlowBlock
            title="Imagerie"
            items={[
              "Rx thorax en première intention; échographie thoracique/FAST si disponible.",
              "Scanner thoracique si polytrauma, doute lésionnel ou Rx/écho non concluants.",
            ]}
          />
          <FlowBlock
            title="Hospitalisation"
            items={[
              "Toute contusion pulmonaire (même minime), pneumothorax simple, hémothorax modéré.",
              "Douleur nécessitant morphine; réanimation si détresse respiratoire, pneumothorax compressif ou hémothorax majeur, choc ou polytrauma.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "Examen clinique strictement normal + Rx thorax normale (pas d’infiltrat, pas de pneumothorax résiduel).",
              "Douleur contrôlée par paracétamol seul, pas de traumatisme associé, environnement fiable, possibilité de revoir l’enfant en 24–48 h.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
