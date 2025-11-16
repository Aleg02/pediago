"use client";

import { useEffect, useMemo, useState } from "react";

import AgeWeightPicker from "@/components/AgeWeightPicker";
import { estimateAgeFromWeight } from "@/lib/ageWeightModels";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 5;
const MAX_W = 80;
const clampW = (value: number) => Math.min(Math.max(value, MIN_W), MAX_W);

const hydrationRates = [4, 5, 6];

const formatNumber = (value: number, digits = 1) =>
  Number.isFinite(value) ? Number(value.toFixed(digits)).toString() : "—";

const formatMl = (value: number, digits = value >= 100 ? 0 : 1) =>
  Number.isFinite(value) ? `${Number(value.toFixed(digits))} mL` : "—";

const formatMlPerHour = (value: number) =>
  Number.isFinite(value)
    ? `${Number(value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2))} mL/h`
    : "—";

const formatUnitsPerHour = (value: number) =>
  Number.isFinite(value) ? `${Number(value.toFixed(2))} U/h` : "—";

const formatMmolPerHour = (value: number) =>
  Number.isFinite(value) ? `${Number(value.toFixed(2))} mmol/h` : "—";

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

const toggleBase =
  "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2";

export default function ProtocolFlowAcidocetose() {
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);

  const weightKg = clampW(
    Number.isFinite(weightFromStore ?? NaN) ? (weightFromStore as number) : 25
  );

  useEffect(() => {
    if (!ageLabel) {
      const estimated = estimateAgeFromWeight(weightKg);
      if (estimated) setAgeLabel(estimated);
    }
  }, [ageLabel, setAgeLabel, weightKg]);

  const [isShock, setIsShock] = useState(false);
  const [hydrationRate, setHydrationRate] = useState<number>(5);

  const bolusMin = weightKg * 10;
  const bolusMax = weightKg * 20;
  const hydrationMlPerHour = weightKg * hydrationRate;
  const hydrationMl24h = hydrationMlPerHour * 24;
  const hydrationMl48h = hydrationMlPerHour * 48;
  const hydrationLPerHour = hydrationMlPerHour / 1000;

  const insulinLow = weightKg * 0.05;
  const insulinHigh = weightKg * 0.1;

  const potassium40 = 40 * hydrationLPerHour;
  const potassium60 = 60 * hydrationLPerHour;

  const bicarbonateLow = weightKg * 1;
  const bicarbonateHigh = weightKg * 2;

  const mannitol05 = weightKg * 0.5;
  const mannitol1 = weightKg * 1;
  const hypertonicDose = weightKg * 5;

  const insulinCalc = useMemo(
    () => `0,05–0,1 × ${formatNumber(weightKg, 1)} = ${formatUnitsPerHour(insulinLow)} – ${formatUnitsPerHour(insulinHigh)}`,
    [insulinHigh, insulinLow, weightKg]
  );

  return (
    <div className="w-full pb-6">
      <div className="rounded-3xl bg-gradient-to-b from-rose-500 to-rose-700 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Urgence métabolique</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide">Acidocétose diabétique</h1>
        <p className="text-sm text-white/80">Hydratation raisonnée + insuline IV continue</p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampW(v ?? weightKg))}
          />
        </div>

        <p className="mt-4 text-sm text-white/80">
          Confirmer l’ACD (hyperglycémie + cétonémie + acidose) et stratifier la gravité (pH
          &lt; 7,1 = sévère). Priorité : éviter l’œdème cérébral via une réhydratation lente et une
          insuline IVSE sans bolus.
        </p>
      </div>

      <div className="mt-4 px-4 space-y-5">
        <SectionCard title="Évaluation initiale" subtitle="ABCDE + prévention œdème cérébral">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>PLS / intubation si coma, aspiration si besoin.</li>
            <li>SpO₂ 94–98 % (O₂ 10 L/min si &lt; 94 %), surveiller la polypnée de Kussmaul.</li>
            <li>Scope : TA, FC, TRC, recherche choc et déshydratation, 2 VVP.</li>
            <li>GCS, signes d’alerte œdème cérébral (céphalées, bradycardie, HTA, baisse vigilance).</li>
            <li>Température, foyer infectieux, ECG si troubles du K⁺.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Examens initiaux">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Glycémie capillaire + gaz veineux (pH, HCO₃⁻, cétonémie).</li>
            <li>Ionogramme, fonction rénale, NFS, bandelette urinaire (cétonurie).</li>
            <li>CRP ± hémocultures selon contexte, ECBU si fièvre.</li>
            <li>ECG si suspicion dyskaliémie.</li>
          </ul>
        </SectionCard>

        <div className="rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Options de PEC</p>
          <div className="mt-2 grid grid-cols-1 gap-2">
            <button
              type="button"
              className={`${toggleBase} ${
                isShock
                  ? "border-rose-600 bg-rose-600 text-white shadow"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              }`}
              onClick={() => setIsShock((prev) => !prev)}
            >
              {isShock ? "Choc présent" : "Choc absent"}
              <span className="block text-xs font-normal text-white/80">
                {isShock ? "Bolus NaCl 0,9 % recommandé" : "Remplissage initial non nécessaire"}
              </span>
            </button>
          </div>
          <div className="mt-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-2">
              Débit de réhydratation (NaCl 0,9 %)
            </p>
            <div className="grid grid-cols-3 gap-2">
              {hydrationRates.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  className={`${toggleBase} ${
                    hydrationRate === rate
                      ? "border-rose-600 bg-rose-600 text-white shadow"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                  } px-3 py-2 text-center`}
                  onClick={() => setHydrationRate(rate)}
                >
                  {rate} mL/kg/h
                </button>
              ))}
            </div>
          </div>
        </div>

        {isShock && (
          <SectionCard title="Remplissage initial" subtitle="Choc hypovolémique">
            <p>NaCl 0,9 % 10–20 mL/kg en 15–30 min.</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Volume 10 mL/kg : <strong>{formatMl(bolusMin)}</strong>
                <Calc>10 × {formatNumber(weightKg, 1)} = {formatMl(bolusMin)}</Calc>
              </li>
              <li>
                Volume 20 mL/kg : <strong>{formatMl(bolusMax)}</strong>
                <Calc>20 × {formatNumber(weightKg, 1)} = {formatMl(bolusMax)}</Calc>
              </li>
            </ul>
          </SectionCard>
        )}

        <SectionCard title="Réhydratation contrôlée" subtitle="Objectif 24–48 h">
          <p>Soluté principal : NaCl 0,9 % ± ajout de glucose selon la glycémie.</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              Débit sélectionné : <strong>{formatMlPerHour(hydrationMlPerHour)}</strong>
              <Calc>
                {hydrationRate} × {formatNumber(weightKg, 1)} = {formatMlPerHour(hydrationMlPerHour)}
              </Calc>
            </li>
            <li>
              Volume sur 24 h : <strong>{formatMl(hydrationMl24h)}</strong>
            </li>
            <li>
              Volume sur 48 h : <strong>{formatMl(hydrationMl48h)}</strong>
            </li>
            <li>Si glycémie &lt; 2,5 g/L : ajouter G5 % (ou G10 % si chute rapide).</li>
          </ul>
        </SectionCard>

        <SectionCard title="Insulinothérapie" subtitle="Débuter 1–2 h après perfusion">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Insuline régulière IVSE, jamais de bolus.</li>
            <li>
              Débit 0,05 U/kg/h : <strong>{formatUnitsPerHour(insulinLow)}</strong>
            </li>
            <li>
              Débit 0,1 U/kg/h : <strong>{formatUnitsPerHour(insulinHigh)}</strong>
            </li>
            <li>Objectif : baisse glycémie ≤ 0,5 g/L/h.</li>
          </ul>
          <Calc>{insulinCalc}</Calc>
        </SectionCard>

        <SectionCard title="Supplémentation en potassium" subtitle="Dès reprise de diurèse">
          <p>Adapter selon le K⁺ plasmatique. Calcul basé sur le débit de réhydratation sélectionné.</p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            <div className="grid grid-cols-2 gap-2 font-semibold uppercase tracking-wide text-[11px] text-slate-500">
              <span>Scénario</span>
              <span>Apport</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 rounded-2xl bg-white px-3 py-2 text-slate-800">
              <span className="text-sm font-semibold">K⁺ 3,5–5,5 mmol/L → 40 mmol/L</span>
              <span className="text-sm font-bold">
                {formatMmolPerHour(potassium40)}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 rounded-2xl bg-white px-3 py-2 text-slate-800">
              <span className="text-sm font-semibold">K⁺ &lt; 3,5 mmol/L → 60 mmol/L</span>
              <span className="text-sm font-bold">
                {formatMmolPerHour(potassium60)}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Apport (mmol/h) = concentration (mmol/L) × débit (L/h) = {formatNumber(hydrationLPerHour, 2)} L/h × {" "}
              [40 ou 60]. Contrôle K⁺ toutes les 2–4 h.
            </p>
          </div>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>K⁺ &gt; 5,5 mmol/L : ne pas supplémenter, recontrôle 1 h.</li>
            <li>K⁺ &lt; 3,5 mmol/L : retarder l’insuline le temps de remonter le K⁺.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Bicarbonates" subtitle="À éviter sauf pH &lt; 6,9 + instabilité">
          <p>Si indication : NaHCO₃ 1–2 mmol/kg à diluer dans NaCl 0,9 % sur 60 min.</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              Dose 1 mmol/kg : <strong>{formatNumber(bicarbonateLow, 1)} mmol</strong>
            </li>
            <li>
              Dose 2 mmol/kg : <strong>{formatNumber(bicarbonateHigh, 1)} mmol</strong>
            </li>
          </ul>
        </SectionCard>

        <SectionCard title="Prévention œdème cérébral" subtitle="Détection + traitement immédiat">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Surveiller toutes les 30 min : céphalées, bradycardie, HTA, pupilles, GCS.</li>
            <li>
              Mannitol 0,5–1 g/kg IV en 20 min : <strong>{formatNumber(mannitol05, 1)} – {formatNumber(mannitol1, 1)} g</strong>
            </li>
            <li>
              Hypertonique 3 % 5 mL/kg en 10 min : <strong>{formatMl(hypertonicDose)}</strong>
            </li>
            <li>Maintenir insuline + ralentir la réhydratation si signes d’alerte.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Surveillance & orientation">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Glycémie toutes les 30 min puis 1 h ; ionogramme toutes les 2–4 h.</li>
            <li>Diurèse horaire, scope continu, température.</li>
            <li>Hospitalisation systématique, réanimation si pH &lt; 7,1, choc, altération conscience ou œdème cérébral.</li>
            <li>Transition vers insuline SC seulement après correction de la cétose et reprise orale.</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
