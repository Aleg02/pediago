"use client";

import type { ReactNode } from "react";

import AgeWeightPicker from "@/components/AgeWeightPicker";
import { useAppStore } from "@/store/useAppStore";
import { formatMg } from "@/lib/units";

const MIN_WEIGHT = 3;
const MAX_WEIGHT = 100;
const DEFAULT_WEIGHT = 25;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_WEIGHT;
  return Math.min(Math.max(value as number, MIN_WEIGHT), MAX_WEIGHT);
};

const formatMl = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return "—";
  const v = value as number;
  if (v >= 1000) return `${Number((v / 1000).toFixed(v >= 10000 ? 0 : 1))} L`;
  if (v >= 100) return `${Math.round(v)} mL`;
  return `${Number(v.toFixed(v >= 10 ? 1 : 2))} mL`;
};

const formatMlRange = (min: number, max: number) => `${formatMl(min)} – ${formatMl(max)}`;

function SectionCard({
  title,
  subtitle,
  tone = "slate",
  children,
}: {
  title: string;
  subtitle?: string;
  tone?: "slate" | "red" | "blue" | "emerald" | "amber";
  children: ReactNode;
}) {
  const palette = {
    slate: { header: "from-slate-800 to-slate-900", body: "bg-white border-slate-200" },
    red: { header: "from-rose-500 to-red-500", body: "bg-rose-50 border-rose-200" },
    blue: { header: "from-sky-500 to-blue-500", body: "bg-sky-50 border-sky-200" },
    emerald: { header: "from-emerald-500 to-teal-500", body: "bg-emerald-50 border-emerald-200" },
    amber: { header: "from-amber-500 to-orange-500", body: "bg-amber-50 border-amber-200" },
  }[tone];

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

function HighlightCard({ title, items }: { title: string; items: ReactNode[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <ul className="mt-2 list-disc pl-4 space-y-1 text-[13px] text-slate-700">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ProtocolFlowPolytrauma() {
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  const weightKg = clampWeight(weightFromStore);

  const ketamineDose = weightKg * 2; // mg
  const rocuroniumDose = weightKg * 1; // mg
  const naclBolus = weightKg * 20; // mL
  const morphineBolus = weightKg * 0.1; // mg
  const morphineTitration = weightKg * 0.025; // mg
  const rbcMin = weightKg * 10;
  const rbcMax = weightKg * 15;
  const pfcMin = weightKg * 10;
  const pfcMax = weightKg * 15;
  const plateletMin = weightKg * 10;
  const plateletMax = weightKg * 20;
  const midazolamIv = weightKg * 0.1;
  const midazolamIn = weightKg * 0.2;
  const glucoseBolus = weightKg * 2; // mL of G10%

  return (
    <div className="pb-10">
      <div className="rounded-3xl bg-gradient-to-b from-[#7f1d1d] via-[#b91c1c] to-[#f87171] px-4 pt-6 pb-5 text-white shadow-sm">
        <h1 className="text-2xl font-extrabold leading-tight">Polytraumatisme pédiatrique</h1>
        <p className="text-sm text-white/85 mt-1">
          Filtre polytrauma activé, ABCDE strict, gestes vitaux immédiats. Calculs pondérés pour chaque dose clé selon les
          recommandations HAS / SFP / SFAR / ATLS pédiatrique.
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
        <SectionCard title="Activation & priorisation" subtitle="Arbre décisionnel" tone="blue">
          <ul className="list-disc pl-4 space-y-1.5">
            <li>Déclencher la filière polytrauma, notifier radiologie / bloc / réa.</li>
            <li>ABCDE systématique, évaluations répétées toutes les 5 min ou après chaque geste.</li>
            <li>Instabilité → gestes vitaux immédiats + FAST au lit ; stabilité → imagerie ciblée / scanner TAP.</li>
            <li>Réanimation damage control : corriger hypoxie, hypovolémie, hypothermie, coagulopathie.</li>
            <li>Décision partagée : réanimation, chirurgie ou transfert vers trauma center, puis surveillance continue.</li>
          </ul>
        </SectionCard>

        <SectionCard title="A — Airway" subtitle="Immobilisation rachis + ISR" tone="red">
          <div className="grid gap-3 sm:grid-cols-2">
            <HighlightCard
              title="Contrôle des VAS"
              items={[
                "Immobilisation tête–cou–tronc (collier adapté + plan dur).",
                "Aspiration si encombrement, oxygène 10–15 L/min si SpO₂ < 94 %.",
                "Intubation si GCS ≤ 8, détresse respiratoire, trauma facial majeur ou hypoxie réfractaire.",
              ]}
            />
            <HighlightCard
              title="Séquence rapide"
              items={[
                (
                  <>
                    Kétamine IV : <strong>{formatMg(ketamineDose)}</strong> (2 mg/kg).
                  </>
                ),
                (
                  <>
                    Rocuronium IV : <strong>{formatMg(rocuroniumDose)}</strong> (1 mg/kg).
                  </>
                ),
                "Préoxygéner 3 min si possible, maintenir immobilisation cervicale stricte.",
              ]}
            />
          </div>
        </SectionCard>

        <SectionCard title="B — Breathing" subtitle="Ventilation / thorax" tone="amber">
          <div className="grid gap-3 sm:grid-cols-2">
            <HighlightCard
              title="Gestes vitaux"
              items={[
                "Rechercher pneumothorax suffocant, hémothorax massif, volet costal.",
                "Décompression à l’aiguille 14–18G au 2e EIC MCL ou 5e EIC antérieur si pneumothorax suffocant.",
                "Drain thoracique si hémothorax massif, ventilation assistée si hypoxémie persistante ou contusion bilatérale.",
              ]}
            />
            <HighlightCard
              title="Analgésie"
              items={[
                (
                  <>
                    Morphine IV initiale : <strong>{formatMg(morphineBolus)}</strong> (0,1 mg/kg).
                  </>
                ),
                (
                  <>
                    Titration : <strong>{formatMg(morphineTitration)}</strong> (0,025 mg/kg) toutes les 5 min selon EVA.
                  </>
                ),
                "Adapter avec MEOPA / blocs si disponibles, surveiller ventilation.",
              ]}
            />
          </div>
        </SectionCard>

        <SectionCard title="C — Circulation" subtitle="Choc & hémorragie" tone="emerald">
          <div className="grid gap-3 sm:grid-cols-3 text-[13px]">
            <div className="rounded-2xl border border-emerald-200 bg-white/80 px-3 py-3">
              <p className="text-xs font-semibold text-emerald-800 uppercase">Remplissage</p>
              <ul className="mt-2 space-y-1">
                <li>
                  NaCl 0,9 % : <strong>{formatMl(naclBolus)}</strong> (20 mL/kg) en bolus si enfant stable/modérément instable.
                </li>
                <li>IO si VVP impossible, limiter cristalloïdes répétés.</li>
                <li>Diurèse cible : 1 mL/kg/h.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-white/80 px-3 py-3">
              <p className="text-xs font-semibold text-emerald-800 uppercase">Transfusion</p>
              <ul className="mt-2 space-y-1">
                <li>
                  CGR : <strong>{formatMlRange(rbcMin, rbcMax)}</strong> (10–15 mL/kg).
                </li>
                <li>
                  PFC : <strong>{formatMlRange(pfcMin, pfcMax)}</strong> (10–15 mL/kg).
                </li>
                <li>
                  Plaquettes : <strong>{formatMlRange(plateletMin, plateletMax)}</strong> (10–20 mL/kg).
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-white/80 px-3 py-3">
              <p className="text-xs font-semibold text-emerald-800 uppercase">Objectifs</p>
              <ul className="mt-2 space-y-1">
                <li>PAM ≥ 60 mmHg (nourrisson) / ≥ 70 mmHg (enfant).</li>
                <li>Température ≥ 36 °C, calcium ionisé &gt; 0,9 mmol/L.</li>
                <li>Acide tranexamique si &lt; 3 h, ceinture pelvienne si suspicion de fracture du bassin.</li>
              </ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="D — Disability" subtitle="Neurologique" tone="slate">
          <div className="grid gap-3 sm:grid-cols-2">
            <HighlightCard
              title="Surveillance"
              items={[
                "Évaluer GCS/AVPU, pupilles, déficit focal.",
                "Traquer hypoglycémie et convulsions précoces.",
                "Prévenir l’hypertension intracrânienne : éviter hypoxie et hypotension.",
              ]}
            />
            <HighlightCard
              title="Traitements"
              items={[
                (
                  <>
                    Midazolam IV : <strong>{formatMg(midazolamIv)}</strong> (0,1 mg/kg) si convulsions.
                  </>
                ),
                (
                  <>
                    Midazolam IN : <strong>{formatMg(midazolamIn)}</strong> (0,2 mg/kg) si pas d’accès.
                  </>
                ),
                (
                  <>
                    Hypoglycémie → Glucose 10 % : <strong>{formatMl(glucoseBolus)}</strong> (2 mL/kg) IV.
                  </>
                ),
              ]}
            />
          </div>
        </SectionCard>

        <SectionCard title="E — Exposure" subtitle="Inspection complète" tone="amber">
          <ul className="list-disc pl-4 space-y-1.5 text-[13px]">
            <li>Déshabillage complet, contrôle hémorragies externes, pansement compressif si besoin.</li>
            <li>Prévention de l’hypothermie : couverture isotherme, fluides réchauffés, température de salle ≥ 24 °C.</li>
            <li>Recherche d’ecchymoses / plaies pénétrantes / déformations, prélèvement sanguin complet.</li>
          </ul>
        </SectionCard>

        <SectionCard title="FAST & imagerie" subtitle="Choisir la bonne modalité" tone="slate">
          <div className="grid gap-3 sm:grid-cols-2">
            <HighlightCard
              title="FAST"
              items={[
                "Fenêtres : péricarde, hépatique, splénique, Douglas.",
                "FAST + instable → bloc / chirurgie immédiate.",
                "FAST + stable → scanner TAP dès que possible ; FAST − instable → rechercher autre cause (thorax/bassin/neuro).",
              ]}
            />
            <HighlightCard
              title="Scanner"
              items={[
                "Enfant stable : scanner corps entier si mécanisme violent ou lésions multiples suspectées.",
                "Sinon imagerie ciblée (TDM crâne, rachis ou abdomen selon clinique).",
                "Instable : pas de scanner, geste vital puis bloc / transfert.",
              ]}
            />
          </div>
        </SectionCard>

        <SectionCard title="Conduites spécifiques" subtitle="Thorax / abdomen / crâne / rachis" tone="blue">
          <div className="grid gap-3 sm:grid-cols-2">
            <HighlightCard
              title="Thorax & abdomen"
              items={[
                "Drain thoracique si hémothorax massif, ventilation si contusion bilatérale.",
                "Chirurgie si instabilité + FAST positif, sinon PEC conservatrice foie/rate avec surveillance stricte.",
                "Damage control surgery si hémorragie non contrôlable malgré transfusion.",
              ]}
            />
            <HighlightCard
              title="Crâne & rachis"
              items={[
                "Suivre protocole TCC dédié, imagerie selon PECARN / clinique.",
                "Maintien de l’immobilisation rachidienne jusqu’à imagerie.",
                "Scanner rachis selon mécanisme ou déficit neurologique.",
              ]}
            />
          </div>
        </SectionCard>

        <SectionCard title="Situations particulières" subtitle="Adapter volumes et vigilance" tone="amber">
          <ul className="list-disc pl-4 space-y-1.5 text-[13px]">
            <li>Nourrisson : choc masqué, privilégier transfusion précoce et limitation des cristalloïdes.</li>
            <li>Prématurés / pathologies chroniques : ajuster volumes, surveiller surcharge.</li>
            <li>Traumatisme pénétrant : forte probabilité de chirurgie urgente.</li>
            <li>Suspicion de maltraitance (&lt; 2 ans) : imagerie systématique (TDM crâne + squelette).</li>
          </ul>
        </SectionCard>

        <SectionCard title="Orientation & surveillance" subtitle="Hospitalisation obligatoire" tone="slate">
          <ul className="list-disc pl-4 space-y-1.5 text-[13px]">
            <li>Hospitaliser en soins intensifs tout polytrauma (instabilité, lésion thoracique/abdominale/cérébrale, ventilation, transfusion, trouble de conscience).</li>
            <li>Surveillance continue : scope, SpO₂, diurèse, température, examens répétés.</li>
            <li>Sortie exceptionnelle uniquement si trauma mineur finalement confirmé, examen/imagerie normaux et surveillance 4–6 h rassurante avec parents fiables.</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
