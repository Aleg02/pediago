"use client";

import { useEffect, useMemo, useState } from "react";

import AgeWeightPicker from "@/components/AgeWeightPicker";
import { useAppStore } from "@/store/useAppStore";
import { estimateAgeFromWeight } from "@/lib/ageWeightModels";
import { formatMg } from "@/lib/units";

const MIN_W = 3;
const MAX_W = 60;
const clampW = (value: number) => Math.min(Math.max(value, MIN_W), MAX_W);

type Scenario = "severe" | "moderate";

const toggleBase =
  "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2";

const formatNumber = (value: number, digits = 1) =>
  Number.isFinite(value) ? Number(value.toFixed(digits)).toString() : "—";

const formatMl = (value: number) =>
  Number.isFinite(value) ? `${Number(value.toFixed(value >= 10 ? 0 : 1))} mL` : "—";

const formatMlPerHour = (value: number) =>
  Number.isFinite(value) ? `${Number(value.toFixed(value >= 100 ? 0 : 1))} mL/h` : "—";

const formatGrams = (value: number) =>
  Number.isFinite(value) ? `${Number(value.toFixed(value < 10 ? 1 : 0))} g` : "—";

function Calc({ children }: { children: React.ReactNode }) {
  return <span className="block text-xs text-slate-500 font-semibold">{children}</span>;
}

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

type InfusionRate = { label: string; mgPerMin: number; mlPerHour: number };

export default function ProtocolFlowHypoglycemie() {
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);

  const weightKg = clampW(
    Number.isFinite(weightFromStore ?? NaN) ? (weightFromStore as number) : 10
  );

  useEffect(() => {
    if (!ageLabel) {
      const estimated = estimateAgeFromWeight(weightKg);
      if (estimated) setAgeLabel(estimated);
    }
  }, [ageLabel, setAgeLabel, weightKg]);

  const [scenario, setScenario] = useState<Scenario>("severe");
  const [hasIvAccess, setHasIvAccess] = useState(true);

  const bolusMl = weightKg * 2;
  const oralGlucose = weightKg * 0.3;
  const glucagonDose = weightKg < 25 ? 0.5 : 1;
  const glucagonLabel = weightKg < 25 ? "< 25 kg" : "≥ 25 kg";
  const midazolamIn = weightKg * 0.2;
  const midazolamIv = weightKg * 0.1;

  const infusionRows: InfusionRate[] = useMemo(() => {
    const concMgPerMl = 100; // G10 % = 100 mg/mL
    return [6, 7, 8].map((rate) => {
      const mgPerMin = weightKg * rate;
      const mlPerHour = (mgPerMin * 60) / concMgPerMl;
      return { label: `${rate} mg/kg/min`, mgPerMin, mlPerHour };
    });
  }, [weightKg]);

  return (
    <div className="w-full pb-6">
      <div className="rounded-3xl bg-gradient-to-b from-sky-500 to-sky-700 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Urgence métabolique</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide">HYPOGLYCÉMIE</h1>
        <p className="text-sm text-white/80">Nourrisson & enfant — cible glycémie ≥ 0,7 g/L</p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampW(v ?? weightKg))}
          />
        </div>

        <p className="mt-4 text-sm text-white/80">
          Confirmer la glycémie capillaire &gt; refaire un contrôle veineux si doute. Toute valeur
          <span className="font-semibold text-white"> &lt; 0,7 g/L</span> impose une prise en charge immédiate.
        </p>
      </div>

      <div className="mt-4 px-4 space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
            Scénario en cours
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              className={`${toggleBase} ${
                scenario === "severe"
                  ? "border-slate-900 bg-slate-900 text-white shadow"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              }`}
              onClick={() => setScenario("severe")}
            >
              Hypoglycémie sévère
              <span className="block text-xs font-normal text-white/80">
                &lt; 0,4 g/L ou symptômes
              </span>
            </button>
            <button
              type="button"
              className={`${toggleBase} ${
                scenario === "moderate"
                  ? "border-slate-900 bg-slate-900 text-white shadow"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              }`}
              onClick={() => setScenario("moderate")}
            >
              Hypoglycémie modérée
              <span className="block text-xs font-normal text-white/80">
                0,4–0,7 g/L, enfant conscient
              </span>
            </button>
          </div>
        </div>

        <SectionCard title="Évaluation initiale" subtitle="ABCDE en moins de 5 min">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>A – Enfant inconscient → PLS, aspiration si encombrement.</li>
            <li>B – SpO₂ cible 94–98 % ; O₂ 10 L/min si SpO₂ &lt; 94 %.</li>
            <li>C – VVP/IO d&rsquo;emblée si signes de gravité, monitorer TA + ECG.</li>
            <li>D – GCS/AVPU, recherche signes neuro (tremblements, coma, convulsions).</li>
            <li>E – Rechercher foyer infectieux, déshydratation, intoxication.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Signes de gravité" subtitle="→ protocole sévère et voie IV prioritaire">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Glycémie &lt; 0,4 g/L ou chute rapide malgré resucrage.</li>
            <li>Convulsions, coma, altération de conscience, hypotonie.</li>
            <li>Incapacité à boire / vomissements incoercibles.</li>
            <li>Suspicion intoxication (insuline, bêtabloquants, alcool).</li>
            <li>Troubles neurologiques persistants après correction.</li>
          </ul>
        </SectionCard>

        {scenario === "severe" ? (
          <SectionCard
            title="Hypoglycémie sévère"
            subtitle="Symptomatique ou glycémie &lt; 0,4 g/L"
          >
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-slate-900">Glucose IV immédiat</p>
                <ul className="mt-1 list-disc space-y-1.5 pl-5">
                  <li>
                    Bolus G10 % 2 mL/kg : <strong>{formatMl(bolusMl)}</strong>
                    <Calc>2 × {formatNumber(weightKg, 1)} = {formatMl(bolusMl)}</Calc>
                  </li>
                  {hasIvAccess ? (
                    <li>
                      Perfusion G10 % 6–8 mg/kg/min après bolus :
                      <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                        <div className="grid grid-cols-3 gap-2 font-semibold text-slate-500 uppercase tracking-wide">
                          <span>Intensité</span>
                          <span>mg/min</span>
                          <span>Débit</span>
                        </div>
                        {infusionRows.map((row) => (
                          <div key={row.label} className="mt-1 grid grid-cols-3 gap-2 rounded-xl bg-white px-3 py-2 text-slate-800">
                            <span className="text-[13px] font-semibold">{row.label}</span>
                            <span className="text-sm font-bold">{formatNumber(row.mgPerMin, 1)} mg/min</span>
                            <span className="text-sm font-bold">{formatMlPerHour(row.mlPerHour)}</span>
                          </div>
                        ))}
                        <Calc>
                          Débit (mL/h) = (mg/kg/min × poids × 60) / 100 — G10 % = 100 mg/mL
                        </Calc>
                      </div>
                    </li>
                  ) : (
                    <li>
                      Voie IV impossible → Glucagon IM : <strong>{glucagonDose} mg</strong>
                      <Calc>{glucagonLabel}</Calc>
                      <p className="text-xs text-slate-500">
                        Efficacité moindre si jeûne prolongé : prévoir voie IV dès que possible.
                      </p>
                    </li>
                  )}
                </ul>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  <span>Voie IV disponible ?</span>
                  <button
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      hasIvAccess
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-600 border border-slate-300"
                    }`}
                    onClick={() => setHasIvAccess(true)}
                  >
                    Oui
                  </button>
                  <button
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      !hasIvAccess
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-600 border border-slate-300"
                    }`}
                    onClick={() => setHasIvAccess(false)}
                  >
                    Non
                  </button>
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-900">Convulsions ou agitation neuro</p>
                <ul className="mt-1 list-disc space-y-1.5 pl-5">
                  <li>
                    Midazolam IN 0,2 mg/kg → <strong>{formatMg(midazolamIn)}</strong>
                  </li>
                  <li>
                    Midazolam IV 0,1 mg/kg → <strong>{formatMg(midazolamIv)}</strong>
                  </li>
                  <li>Surveillance cardio-respiratoire continue.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-slate-900">Surveillance renforcée</p>
                <ul className="mt-1 list-disc space-y-1.5 pl-5">
                    <li>Contrôler la glycémie capillaire toutes les 15 min jusqu&rsquo;à stabilisation.</li>
                  <li>Rechercher et corriger la cause (jeûne, infection, EIIM, intoxication).</li>
                  <li>Préparer hospitalisation si perfusion continue ou critères de gravité.</li>
                </ul>
              </div>
            </div>
          </SectionCard>
        ) : (
          <SectionCard
            title="Hypoglycémie modérée"
            subtitle="0,4 à 0,7 g/L — enfant conscient"
          >
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Resucrage oral 0,3 g/kg : <strong>{formatGrams(oralGlucose)}</strong>
                <Calc>0,3 × {formatNumber(weightKg, 1)} = {formatGrams(oralGlucose)}</Calc>
              </li>
              <li>
                Exemples : gel glucosé (5–10 g/tube), 150 mL jus = 15 g → adapter aux besoins calculés.
              </li>
              <li>Recontrôler la glycémie à 15 min.</li>
              <li>
                Si &lt; 0,7 g/L après 15 min → répéter resucrage oral ou passer en IV selon tolérance.
              </li>
              <li>Hydrater + surveillance clinique 1–2 h même en cas d&rsquo;amélioration.</li>
            </ul>
          </SectionCard>
        )}

        <SectionCard title="Hypoglycémie légère" subtitle="Asymptomatique / découverte fortuite">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Correction orale identique (0,3 g/kg) + collation lente (féculents).</li>
            <li>Surveillance clinique et glycémique au moins 1 à 2 h.</li>
            <li>Informer les parents sur les signes d&rsquo;alerte et consignes de recontrôle.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Situations particulières">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Nourrisson &lt; 1 an : hospitalisation quasi systématique + perfusion G10 % continue.</li>
            <li>Déshydratation / gastro-entérite : réhydrater (ORS/IV) + supplément glucose.</li>
            <li>Suspicion intoxication : avis centre antipoison, monitoring continu.</li>
            <li>Prématurés ou terrain complexe : privilégier perfusion vs resucrage oral.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Critères d'hospitalisation">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Hypoglycémie sévère, convulsions ou troubles de conscience.</li>
            <li>Besoin de perfusion continue / persistance &lt; 0,7 g/L malgré correction.</li>
            <li>Nourrisson &lt; 1 an, suspicion intoxication, terrain à risque.</li>
          </ul>
          <p className="text-xs text-slate-500">
            Sortie possible si glycémie &gt; 0,7 g/L stable pendant ≥ 4 h sans perfusion, enfant asymptomatique,
            cause identifiée et parents formés à la surveillance.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
