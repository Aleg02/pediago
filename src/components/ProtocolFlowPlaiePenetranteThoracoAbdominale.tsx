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

const formatRange = (min: number, max: number, formatter: (value: number) => string) =>
  `${formatter(min)} – ${formatter(max)}`;

const formatWeight = (value: number) => Number(value.toFixed(value >= 10 ? 0 : 1));

export default function ProtocolFlowPlaiePenetranteThoracoAbdominale() {
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
  const naclBolusMl = weightKg * 20;
  const secondBolusLowMl = weightKg * 10;
  const secondBolusHighMl = weightKg * 20;
  const adrenalineLowMcgMin = weightKg * 0.05;
  const adrenalineHighMcgMin = weightKg * 0.3;
  const ceftriaxoneLowMg = weightKg * 50;
  const ceftriaxoneHighMg = weightKg * 75;
  const metronidazoleMg = weightKg * 15;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-[#111827] via-[#0ea5e9] to-[#1d4ed8] px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Trauma thoraco-abdominal</p>
        <h1 className="text-2xl font-extrabold tracking-wide leading-tight">Plaie pénétrante thoracique ou abdominale – enfant</h1>
        <p className="text-sm text-white/85 mt-1">
          Stabiliser rapidement, identifier les signes de gravité, sécuriser l&apos;objet empalé et orienter vers le bloc si
          instabilité.
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
          Abdomen peu protecteur, risque de choc hémorragique rapide. Contrôle des hémorragies et prévention
          hypothermie/contamination.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Objectif & définition"
            subtitle="Standardiser la conduite pour toute plaie pénétrante"
            gradient="from-sky-500 via-cyan-500 to-blue-500"
          />
          <FlowBlock
            title="Objectif"
            items={[
              "Prise en charge rapide et sécurisée des plaies pénétrantes thoraciques/abdominales pédiatriques.",
              "Limiter la décompensation hémodynamique et la contamination viscérale.",
            ]}
          />
          <FlowBlock
            title="Définition succincte"
            items={[
              "Lésion par arme blanche, objet perforant ou projectile; empalement avec objet planté.",
              "Complications : pneumo/hémothorax, hémorragie intra-abdominale, perforation viscérale, choc.",
            ]}
          />
          <FlowBlock
            title="Spécificités pédiatriques"
            items={["Paroi fine, abdomen peu protecteur → décompensation plus rapide, vigilance maximale."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="ABCDE immédiat"
            subtitle="Stabiliser avant d&apos;évaluer la trajectoire"
            gradient="from-emerald-500 via-teal-500 to-lime-500"
          />
          <FlowBlock
            title="A – Airway"
            items={[
              "Libérer les VAS, aspiration sang/vomissements.",
              "Intubation si détresse respiratoire ou GCS ≤ 8; maintien axial si suspicion rachis.",
            ]}
          />
          <FlowBlock
            title="B – Breathing"
            items={[
              "SpO₂, FR, asymétrie thoracique, murmure vésiculaire.",
              "O₂ titré pour SpO₂ 94–98 % ou MHC 12–15 L/min si détresse.",
            ]}
          />
          <FlowBlock
            title="C – Circulation"
            items={[
              "FC, TRC, TA (hypotension tardive), température.",
              "2 VVP ou IO, contrôle hémorragie externe (compression directe).",
              <>
                Bolus NaCl 0,9 %/RL : <strong>{formatMl(naclBolusMl)}</strong> (20 mL/kg).
              </>,
            ]}
          />
          <FlowBlock title="D/E" items={["GCS, douleur, déficit neuro.", "Exposition complète, repérage orifices d’entrée et saignement."]} />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Signes de gravité immédiats"
            subtitle="Identifier la détresse vitale"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <FlowBlock
            title="Thorax"
            items={[
              "Respiration paradoxale, tirage/cyanose, murmure diminué, hypersonorité ou matité.",
              "Plaie soufflante, bruit d’air; déviation trachéale en faveur d’un pneumothorax compressif.",
            ]}
          />
          <FlowBlock
            title="Abdomen"
            items={[
              "Défense/contracture, abdomen aigu, eviscération, hémorragie active.",
              "Signes de choc : TRC > 3 s, extrémités froides, tachycardie.",
            ]}
          />
          <FlowBlock
            title="Systémiques"
            items={["Tachycardie inexpliquée, agitation ou léthargie, pâleur intense."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures plaie thoracique"
            subtitle="Décompression et protection immédiates"
            gradient="from-indigo-500 via-blue-500 to-sky-500"
          />
          <FlowBlock
            title="Pansement occlusif 3 côtés"
            items={["Valve artisanale sur 3 bords; jamais occlusif complet sur plaie soufflante (risque pneumo compressif)."]}
          />
          <FlowBlock
            title="Pneumothorax compressif"
            items={["Exsufflation immédiate 4ᵉ–5ᵉ EIC, ligne axillaire antérieure, aiguille 14–18G.", "Drain thoracique en relais systématique."]}
          />
          <FlowBlock
            title="Hémothorax"
            items={[
              "Instable : drainage thoracique.",
              "Taille drain : < 1 an 12–14 Fr; 1–6 ans 16–20 Fr; > 6 ans 20–24 Fr.",
              "Volume évacué > 10–15 mL/kg = indication chirurgicale urgente.",
            ]}
          />
          <FlowBlock
            title="Objet empalé"
            items={["Ne jamais retirer; immobiliser et stabiliser avec compresses; transfert bloc/réa."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Plaie abdominale"
            subtitle="Protéger viscères et prioriser chirurgie si choc"
            gradient="from-amber-500 via-orange-500 to-red-500"
          />
          <FlowBlock
            title="Eviscération"
            items={["Ne pas réintroduire; couvrir de compresses stériles humides (NaCl 0,9 %)."]}
          />
          <FlowBlock
            title="Indications opératoires immédiates"
            items={[
              "Instabilité hémodynamique malgré remplissage, saignement actif externe.",
              "Eviscération, saignement rectal/vaginal/urinaire post-traumatique, transfusion > 40 mL/kg.",
            ]}
          />
          <FlowBlock
            title="Enfant stable"
            items={["Écho FAST en première intention; scanner abdomino-pelvien injecté si stable."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Imagerie & orientation"
            subtitle="Documenter la trajectoire et décider du bloc"
            gradient="from-cyan-500 via-blue-500 to-indigo-500"
          />
          <FlowBlock
            title="Imagerie"
            items={["Écho FAST (hémopéritoine/hémothorax)", "Rx thorax (pneumo/hémothorax, corps étranger)", "Scanner thorax-abdomen injecté si stable"]}
          />
          <FlowBlock
            title="Conduite"
            items={["Instable → bloc opératoire / réanimation.", "Lésion d’organe → chirurgie ou drainage selon localisation.", "Stable sans pénétration → surveillance hospitalière."]}
          />
          <FlowBlock
            title="Hospitalisation / sortie"
            items={[
              "Hospitalisation obligatoire pour toute plaie pénétrante thoracique ou abdominale, eviscération, pneumo/hémothorax, objet empalé, choc, < 3 ans traumatisme violent.",
              "Pas de sortie pour plaie pénétrante vraie. Sortie uniquement si plaie superficielle non pénétrante confirmée, douleur contrôlée, famille fiable, reconsigne < 24 h.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitements & posologies"
            subtitle="Calculs automatiques selon le poids"
            gradient="from-emerald-500 via-teal-500 to-green-500"
          />
          <FlowBlock
            title="Oxygène"
            items={["Titrer SpO₂ 94–98 %; détresse respiratoire → MHC 12–15 L/min (FiO₂ 1)."]}
          />
          <FlowBlock
            title="Remplissage"
            items={[
              <>
                Bolus NaCl 0,9 % ou RL : <strong>{formatMl(naclBolusMl)}</strong> (20 mL/kg) puis réévaluation.
              </>,
              <>
                Si choc persistant : second bolus <strong>{formatMl(secondBolusLowMl)}</strong> à <strong>{formatMl(secondBolusHighMl)}</strong> (10–20 mL/kg).
              </>,
            ]}
          />
          <FlowBlock
            title="Analgésie"
            items={[
              <>
                Paracétamol : <strong>{formatMg(paracetamolMg)}</strong> (15 mg/kg/6 h).
              </>,
              <>
                Morphine IV : <strong>{formatMg(morphineInitialMg)}</strong> (0,05 mg/kg) puis bolus <strong>{formatMg(morphineBolusMg)}</strong> (0,01 mg/kg) toutes les 5–7 min.
              </>,
              <>
                Kétamine analgésique : <strong>{formatRange(ketamineLowMg, ketamineHighMg, formatMg)}</strong> (0,25–0,5 mg/kg IV).
              </>,
              "Éviter les AINS en contexte de saignement; benzodiazépine uniquement sur indication.",
            ]}
          />
          <FlowBlock
            title="Vasopresseur (réa pédiatrique)"
            items={[
              <>
                Adrénaline IVSE 0,05–0,3 µg/kg/min : <strong>{formatRange(adrenalineLowMcgMin, adrenalineHighMcgMin, formatMcg)}</strong> µg/min pour <strong>{formatWeight(weightKg)}</strong> kg.
              </>,
            ]}
          />
          <FlowBlock
            title="Antibioprophylaxie"
            items={[
              "Indiquée si eviscération, plaie pénétrante viscérale ou contamination digestive.",
              <>
                Ceftriaxone 50–75 mg/kg/j IV : <strong>{formatRange(ceftriaxoneLowMg, ceftriaxoneHighMg, formatMg)}</strong> /j.
              </>,
              <>
                Métronidazole 15 mg/kg/j IV : <strong>{formatMg(metronidazoleMg)}</strong> /j.
              </>,
            ]}
          />
        </div>
      </div>
    </div>
  );
}

