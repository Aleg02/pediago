"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";

import AgeWeightPicker from "@/components/AgeWeightPicker";
import { useAppStore } from "@/store/useAppStore";

const ACCENT = {
  blue: {
    header: "bg-[#2563EB]",
    body: "bg-[#DBEAFE]",
    border: "border-[#2563EB]",
  },
  teal: {
    header: "bg-[#0D9488]",
    body: "bg-[#CCFBF1]",
    border: "border-[#0D9488]",
  },
  amber: {
    header: "bg-[#D97706]",
    body: "bg-[#FEF3C7]",
    border: "border-[#D97706]",
  },
  rose: {
    header: "bg-[#E11D48]",
    body: "bg-[#FFE4E6]",
    border: "border-[#E11D48]",
  },
  slate: {
    header: "bg-[#475569]",
    body: "bg-[#E2E8F0]",
    border: "border-[#475569]",
  },
  purple: {
    header: "bg-[#7C3AED]",
    body: "bg-[#EDE9FE]",
    border: "border-[#7C3AED]",
  },
} as const;

type AccentKey = keyof typeof ACCENT;

const Card = ({
  title,
  accent,
  subtitle,
  children,
}: {
  title: string;
  accent: AccentKey;
  subtitle?: string;
  children: ReactNode;
}) => {
  const palette = ACCENT[accent];
  return (
    <section className={`rounded-3xl overflow-hidden border ${palette.border}`}>
      <header className={`px-4 py-2 text-white font-semibold ${palette.header}`}>
        <p className="text-sm tracking-wide uppercase">{title}</p>
        {subtitle ? (
          <p className="text-xs text-white/90 font-normal">{subtitle}</p>
        ) : null}
      </header>
      <div className={`px-4 py-3 text-sm text-slate-900 ${palette.body}`}>{children}</div>
    </section>
  );
};

const pickEffectiveWeight = (w?: number | null) => {
  if (!Number.isFinite(w as number) || (w as number) <= 0) return undefined;
  return Number((w as number).toFixed(1));
};

const computeDose = (
  weight: number | undefined,
  perKg: number,
  options: { max?: number; round?: number } = {}
) => {
  if (!Number.isFinite(weight)) return undefined;
  let value = (weight as number) * perKg;
  if (options.max) value = Math.min(value, options.max);
  if (options.round) value = Math.round(value / options.round) * options.round;
  return value;
};

const formatNumber = (value: number) => {
  if (value >= 100) return value.toFixed(0);
  if (value >= 10) return value.toFixed(1);
  return value.toFixed(2);
};

const formatDose = (value?: number, unit = "mg") => {
  if (!Number.isFinite(value ?? NaN)) return "—";
  return `${Number(formatNumber(value as number))} ${unit}`;
};

const formatVolume = (value?: number) => {
  if (!Number.isFinite(value ?? NaN)) return "—";
  const num = value as number;
  return `${Number(num.toFixed(num >= 10 ? 1 : 2))} mL`;
};

export default function ProtocolFlowCFS() {
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);
  const weightKg = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  const effWeight = useMemo(() => pickEffectiveWeight(weightKg), [weightKg]);

  const glucose10Ml = useMemo(
    () => computeDose(effWeight, 2, { round: 0.2 }),
    [effWeight]
  );
  const midazolamInMg = useMemo(
    () => computeDose(effWeight, 0.2, { max: 10, round: 0.1 }),
    [effWeight]
  );
  const midazolamBuccalMg = useMemo(
    () => computeDose(effWeight, 0.3, { max: 10, round: 0.1 }),
    [effWeight]
  );
  const midazolamIvMg = useMemo(
    () => computeDose(effWeight, 0.1, { max: 4, round: 0.05 }),
    [effWeight]
  );
  const paracetamolMg = useMemo(
    () => computeDose(effWeight, 15, { round: 5 }),
    [effWeight]
  );

  return (
    <div className="pb-6">
      <div className="rounded-3xl bg-gradient-to-b from-[#4338CA] to-[#7C3AED] px-4 pt-6 pb-5 text-white shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-wide flex items-center gap-2">
          <span>CONVULSION FÉBRILE SIMPLE</span>
          <span aria-hidden className="text-2xl">
            🌡️
          </span>
        </h1>
        <p className="text-sm text-white/90 mt-1">
          Enfant 6 mois – 5 ans, crise généralisée &lt; 15 min sans déficit post-critique.
        </p>
        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(value) => setAgeLabel(value)}
            weightKg={Number.isFinite(weightKg as number) ? (weightKg as number) : null}
            setWeightKg={(value) => setWeightKg(value ?? 0)}
          />
          <p className="mt-2 text-xs text-gray-500">
            Calculs automatiques pour un poids effectif {Number.isFinite(effWeight) ? `${effWeight} kg` : "—"}.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4 px-4">
        <Card accent="blue" title="Repérage rapide" subtitle="Critères de CFS (HAS/SFP/AAP)">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Âge 6 mois à 5 ans, fièvre &gt; 38 °C, terrain sain.</li>
            <li>Crise tonico-clonique bilatérale, durée &lt; 15 min, unique sur 24 h.</li>
            <li>Examen neurologique normal après récupération, pas d’argument pour infection SNC.</li>
            <li>Si un critère manque → convulsion fébrile compliquée ou autre étiologie.</li>
          </ul>
        </Card>

        <Card accent="teal" title="ABCDEF initial" subtitle="Sécurité + recherche cause">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>A :</strong> Mettre en PLS, libérer les VAS, aspirer si encombrement.
            </li>
            <li>
              <strong>B :</strong> SpO₂ cible 94–98 % ; O₂ 10 L/min au masque si SpO₂ &lt; 94 %.
            </li>
            <li>
              <strong>C :</strong> Scope complet, temps de recoloration, TA adaptée à l’âge, VVP si crise &gt; 5 min ou signe de gravité.
            </li>
            <li>
              <strong>D :</strong> GCS/AVPU, pupilles, glycémie capillaire systématique → si &lt; 0,7 g/L : Glucose 10 % {formatVolume(glucose10Ml)} IV ({`2 mL/kg`}).
            </li>
            <li>
              <strong>E :</strong> Déshabiller, prendre T°, rechercher foyer infectieux, signes méningés ou purpura.
            </li>
            <li>
              <strong>F :</strong> Fièvre : traiter cause, hydratation, noter ATCD (prématurité, drépanocytose, épilepsie, neurodéveloppement).
            </li>
          </ul>
        </Card>

        <Card accent="amber" title="Signes de gravité" subtitle="Imposent PEC avancée / autre protocole">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Crise &gt; 15 min, récidive &lt; 24 h, focalité ou déficit persistant &gt; 1 h.</li>
            <li>Âge &lt; 6 mois, état général altéré, hypotonie prolongée.</li>
            <li>Suspicion méningite/encéphalite (raideur nucale, purpura, irritabilité majeure).</li>
            <li>Terrain particulier : drépanocytose, trouble neurodéveloppemental, épilepsie connue.</li>
          </ul>
        </Card>

        <Card accent="rose" title="Arrêt de la crise" subtitle="Si convulsion en cours ≥ 5 min">
          <ul className="space-y-2">
            <li>
              <strong>1ʳᵉ intention benzodiazépine :</strong>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Midazolam IN : {formatDose(midazolamInMg)} (0,2 mg/kg, max 10 mg) répartis entre les narines.</li>
                <li>Midazolam buccal : {formatDose(midazolamBuccalMg)} (0,3 mg/kg).</li>
                <li>Midazolam IV : {formatDose(midazolamIvMg)} (0,1 mg/kg, max 4 mg) si VVP en place.</li>
              </ul>
            </li>
            <li>Surveiller FR/SpO₂, aspiration possible, ventilation assistée si dépression respi.</li>
            <li>Si persistance à 5 min → répéter même dose une fois.</li>
            <li>Échec de 2 doses ou détresse respiratoire → algorithme statut convulsif pédiatrique.</li>
          </ul>
        </Card>

        <Card accent="slate" title="Évaluation post-critique">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Confirmer critères de CFS : généralisation, durée, absence récidive/déficit.</li>
            <li>Aucun examen systématique si examen neuro normal (pas d’EEG, imagerie ou biologie).</li>
            <li>Examens ciblés : PL si suspicion infection SNC, ionogramme si vomissements/diarrhée/troubles hydroélectrolytiques.</li>
            <li>Réévaluer fièvre, hydratation, rechercher foyer ORL/pulmonaire/urinaire.</li>
          </ul>
        </Card>

        <Card accent="purple" title="Traitement de la fièvre">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Paracétamol PO/IV {formatDose(paracetamolMg)} (15 mg/kg/dose). Pas d’alternance systématique avec ibuprofène.</li>
            <li>Objectif confort : antipyrétiques ne préviennent pas les récidives de CFS.</li>
            <li>Pas de diazépam prophylactique hors cas particuliers discutés avec la neurologie.</li>
          </ul>
        </Card>

        <Card accent="amber" title="Orientation & hospitalisation">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Hospitaliser si &lt; 1 an, crise avant 6 mois, critères complexes, doute diagnostic, impossibilité de surveillance.</li>
            <li>Autres motifs : suspicion infection SNC, déshydratation, convulsions répétées, difficultés sociales.</li>
            <li>Sortie possible si examen neurologique redevenu normal, état général correct, fièvre contrôlée et parents rassurés.</li>
          </ul>
        </Card>

        <Card accent="teal" title="Consignes parents & réévaluation">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Risque de récidive ≈ 30 %, surtout la première année ; informer sur conduite à tenir.</li>
            <li>Reconsulter si crise &gt; 5 min, répétée sur 24 h, déficit focal, troubles de vigilance ou vomissements persistants.</li>
            <li>Ne pas restreindre les mouvements pendant la crise, noter l’heure de début, sécuriser l’environnement.</li>
            <li>Proposer fiche écrite + formation à l’administration de midazolam si ordonnance de secours.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
