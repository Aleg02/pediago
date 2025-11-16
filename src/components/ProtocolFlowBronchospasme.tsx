"use client";

import { useMemo, useState, type ReactNode } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { useAppStore } from "@/store/useAppStore";

const severityPalettes = {
  "léger": { badge: "bg-emerald-500", border: "border-emerald-200", text: "text-emerald-900", bg: "bg-emerald-50" },
  "modéré": { badge: "bg-amber-500", border: "border-amber-200", text: "text-amber-900", bg: "bg-amber-50" },
  "sévère": { badge: "bg-rose-600", border: "border-rose-200", text: "text-rose-900", bg: "bg-rose-50" },
};

type Severity = keyof typeof severityPalettes;

type ToggleOption<T extends string> = { value: T; label: string; helper?: string };

type ToggleGroupProps<T extends string> = {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: ToggleOption<T>[];
};

function ToggleGroup<T extends string>({ label, value, onChange, options }: ToggleGroupProps<T>) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`rounded-2xl border px-3 py-2 text-left text-sm transition ${
                active
                  ? "border-slate-900 bg-slate-900 text-white shadow"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              <span className="font-medium">{opt.label}</span>
              {opt.helper && <span className="block text-xs text-slate-500 mt-0.5">{opt.helper}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TogglePill({
  label,
  helper,
  active,
  onToggle,
}: {
  label: string;
  helper?: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-2xl border px-4 py-2 text-left text-sm transition ${
        active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
      }`}
    >
      <span className="font-medium">{label}</span>
      {helper && <span className="block text-xs opacity-80">{helper}</span>}
    </button>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="mb-3">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="space-y-4 text-sm text-slate-700">{children}</div>
    </div>
  );
}

function formatValue(value?: number, unit = "mg", digits = 1) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  const formatted = value >= 10 ? value.toFixed(0) : value.toFixed(digits);
  return `${Number(formatted)} ${unit}`;
}

function parseAgeInMonths(label: string | null) {
  if (!label) return null;
  if (label.toLowerCase() === "naissance") return 0;
  const moisMatch = label.match(/(\d+)\s*mois/i);
  if (moisMatch) return Number(moisMatch[1]);
  const ansMatch = label.match(/(\d+)\s*ans?/i);
  if (ansMatch) return Number(ansMatch[1]) * 12;
  return null;
}

function severitySummary(severity: Severity) {
  if (severity === "sévère") return "GEU, tirage marqué, SpO₂ < 92 % ou signes de fatigue";
  if (severity === "modéré") return "Tirage intercostal, difficultés alimentaires, SpO₂ 92–94 %";
  return "Polypnée modérée, alimentation conservée, SpO₂ ≥ 94 %";
}

export default function ProtocolFlowBronchospasme() {
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);

  const weightKg = typeof weightFromStore === "number" && !Number.isNaN(weightFromStore) ? weightFromStore : 10;
  const ageInMonths = useMemo(() => {
    const parsed = parseAgeInMonths(ageLabel);
    if (parsed != null) return parsed;
    const estimated = estimateAgeFromWeight(weightKg);
    return parseAgeInMonths(estimated ?? null);
  }, [ageLabel, weightKg]);

  const isUnder6Months = ageInMonths != null && ageInMonths < 6;
  const isUnder12Months = ageInMonths != null && ageInMonths < 12;

  const [spo2, setSpo2] = useState<"ge94" | "92-94" | "lt92">("ge94");
  const [tirage, setTirage] = useState<"minime" | "modere" | "marque">("minime");
  const [feeding, setFeeding] = useState<"ok" | "difficile" | "refus">("ok");
  const [fatigue, setFatigue] = useState(false);
  const [geu, setGeu] = useState(false);
  const [fragility, setFragility] = useState(false);
  const [suspectAsthma, setSuspectAsthma] = useState(false);
  const [laryngeal, setLaryngeal] = useState(false);

  const severity = useMemo<Severity>(() => {
    if (spo2 === "lt92" || tirage === "marque" || fatigue || geu) return "sévère";
    if (spo2 === "92-94" || tirage === "modere" || feeding !== "ok") return "modéré";
    return "léger";
  }, [spo2, tirage, fatigue, geu, feeding]);

  const palette = severityPalettes[severity];

  const prednisoneLow = Math.min(weightKg * 1, 40);
  const prednisoneHigh = Math.min(weightKg * 2, 40);
  const fillNaCl = weightKg * 10;
  const highFlow = Math.min(weightKg * 2, 50);

  const allowSalbutamol = ageInMonths == null ? true : ageInMonths >= 6;
  const allowCortico = suspectAsthma || (!isUnder12Months && ageInMonths !== null);

  const hospitalCriteria = [
    { label: "SpO₂ < 94 % persistante", active: spo2 !== "ge94" },
    { label: "Apports < 50 % ou refus", active: feeding !== "ok" },
    { label: "Détresse respiratoire / tirage marqué", active: tirage === "marque" || geu || fatigue },
    { label: "Âge < 6 mois", active: isUnder6Months },
    { label: "Terrain fragile (prématuré, BPC, cardiopathie)", active: fragility },
    { label: "Absence d’amélioration après test thérapeutique", active: severity !== "léger" },
  ];

  const triggeredCriteria = hospitalCriteria.filter((c) => c.active).length;

  return (
    <div className="w-full pb-10">
      <div className="rounded-3xl bg-gradient-to-b from-sky-600 to-cyan-500 px-4 pt-6 pb-5 text-white shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-wide">Bronchospasme du nourrisson</h1>
        <p className="text-sm text-white/80">Hors asthme connu · HAS / SFP / SPLF / NICE / AAP</p>
        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => {
              if (typeof v === "number" && !Number.isNaN(v)) {
                setWeightKg(v);
              }
            }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-5 px-1">
        {isUnder6Months && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-semibold">Nourrisson &lt; 6 mois</p>
            <p>Surveillance hospitalière privilégiée (risque d’apnées et aggravation rapide).</p>
          </div>
        )}

        <SectionCard title="1. Évaluation initiale (ABCDE)">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Position semi-assise, désobstruction rhinopharyngée systématique.</li>
            <li>FR, tirage, geignement, SpO₂ continue. O₂ lunettes {" "}
              <strong>1–2 L/min</strong> si SpO₂ &lt; 94 % (cible 94–98 %).</li>
            <li>FC, TRC, signes de déshydratation, difficulté alimentaire.</li>
            <li>Tonus / éveil, recherche fièvre et signes infectieux associés.</li>
          </ul>
        </SectionCard>

        <SectionCard title="2. Classer la sévérité" subtitle="Sélectionner les paramètres clés">
          <div className="space-y-4">
            <ToggleGroup
              label="SpO₂"
              value={spo2}
              onChange={setSpo2}
              options={[
                { value: "ge94", label: "≥ 94 %" },
                { value: "92-94", label: "92–94 %" },
                { value: "lt92", label: "< 92 %" },
              ]}
            />
            <ToggleGroup
              label="Tirage"
              value={tirage}
              onChange={setTirage}
              options={[
                { value: "minime", label: "Faible" },
                { value: "modere", label: "Intercostal" },
                { value: "marque", label: "Marqué" },
              ]}
            />
            <ToggleGroup
              label="Alimentation"
              value={feeding}
              onChange={setFeeding}
              options={[
                { value: "ok", label: "Conservée" },
                { value: "difficile", label: "< 50 %" },
                { value: "refus", label: "Refus" },
              ]}
            />
            <div className="grid grid-cols-2 gap-2">
              <TogglePill label="GEU / geignement" active={geu} onToggle={() => setGeu((v) => !v)} />
              <TogglePill label="Fatigue / cyanose" active={fatigue} onToggle={() => setFatigue((v) => !v)} />
              <TogglePill
                label="Terrain fragile"
                helper="Prématuré, cardiopathie, BPC…"
                active={fragility}
                onToggle={() => setFragility((v) => !v)}
              />
              <TogglePill
                label="Suspic. asthme débutant"
                helper="≥ 12 mois"
                active={suspectAsthma}
                onToggle={() => setSuspectAsthma((v) => !v)}
              />
              <TogglePill
                label="Susp. composante laryngée"
                helper="Stridor / cornage"
                active={laryngeal}
                onToggle={() => setLaryngeal((v) => !v)}
              />
            </div>
          </div>

          <div className={`mt-4 rounded-2xl border px-4 py-3 ${palette.border} ${palette.bg} ${palette.text}`}>
            <p className="text-xs font-semibold uppercase tracking-wide">Sévérité</p>
            <p className="text-lg font-semibold">{severity.toUpperCase()}</p>
            <p className="text-sm">{severitySummary(severity)}</p>
          </div>
        </SectionCard>

        <SectionCard title="3. Actions prioritaires selon la sévérité">
          {severity === "léger" && (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Désobstruction nasale répétée + fractionnement des repas.</li>
              <li>Hydratation orale, surveillance rapprochée 1–2 h.</li>
              <li>Sortie possible si SpO₂ stable ≥ 94 % et parents fiables.</li>
            </ul>
          )}
          {severity === "modéré" && (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>O₂ lunettes <strong>1–2 L/min</strong> si SpO₂ &lt; 94 %, saturation cible 94–98 %.</li>
              <li>
                Test salbutamol (≥ 6 mois) : {allowSalbutamol ? (
                  <strong>2–4 bouffées (200–400 µg)</strong>
                ) : (
                  <span className="font-semibold text-amber-700">non recommandé &lt; 6 mois</span>
                )} {" "}
                via chambre, répéter ×3 max toutes les 20 min.
              </li>
              <li>Réévaluation systématique après 20–30 min, discuter hospitalisation selon apports / contexte.</li>
            </ul>
          )}
          {severity === "sévère" && (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>O₂ immédiat <strong>1–2 L/min</strong> + monitorage, objectif SpO₂ ≥ 94 %.</li>
              <li>
                {laryngeal ? "Adrénaline nébulisée" : "Adrénaline nébulisée à discuter"}: {" "}
                <strong>5 mL (1 mg/mL)</strong> → répétable à 20 min si besoin.
              </li>
              <li>
                Support ventilatoire : HFNC {" "}
                <strong>{formatValue(highFlow, "L/min")}</strong> (2 L/kg/min) ou CPAP si échec O₂.
              </li>
              <li>Hospitalisation + alerter réanimateur, préparer VAS difficile.</li>
            </ul>
          )}
        </SectionCard>

        <SectionCard title="4. Posologies calculées">
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-slate-900">Oxygénothérapie</p>
              <p>Bas débit lunettes : <strong>1–2 L/min</strong> (objectif 94–98 %).</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Salbutamol en test thérapeutique</p>
              <p>
                {allowSalbutamol ? (
                  <>
                    <strong>2 à 4 bouffées</strong> via chambre (100 µg/bouffée) → total <strong>200 à 400 µg</strong>. Répéter toutes les 20 min (×3)
                    si réponse.
                  </>
                ) : (
                  <span className="font-semibold text-amber-700">Non recommandé avant 6 mois (bronchiolite typique).</span>
                )}
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Corticoïdes systémiques (si ≥ 12 mois ou suspicion asthme)</p>
              {allowCortico ? (
                <p>
                  Prednisone/Prednisolone : <strong>{formatValue(prednisoneLow)}</strong> (1 mg/kg) à {" "}
                  <strong>{formatValue(prednisoneHigh)}</strong> (2 mg/kg, max 40 mg) per os.
                </p>
              ) : (
                <p className="text-amber-700 font-semibold">Réserver aux nourrissons ≥ 12 mois ou si suspicion d’asthme débutant.</p>
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-900">Remplissage si déshydratation</p>
              <p>
                NaCl 0,9 % : <strong>{formatValue(fillNaCl, "mL")}</strong> (10 mL/kg) IVL, répéter si besoin.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Adrénaline nébulisée (formes sévères)</p>
              <p>
                5 mL de L(+) 1 mg/mL (soit <strong>5 mg</strong>) en nébulisation, répétable après 20 min si réponse partielle.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="5. Orientation & hospitalisation">
          <p className="text-sm">Critères (actifs en gras) :</p>
          <ul className="space-y-1.5">
            {hospitalCriteria.map((crit) => (
              <li key={crit.label} className={crit.active ? "font-semibold text-slate-900" : "text-slate-600"}>
                {crit.label}
              </li>
            ))}
          </ul>
          <p>
            {triggeredCriteria > 0
              ? "Hospitalisation recommandée : au moins un critère présent."
              : "Surveillance possible si parents fiables et accès aux soins."}
          </p>
        </SectionCard>

        <SectionCard title="6. À éviter (recommandations HAS / SPLF)">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Antibiotiques sans suspicion de surinfection.</li>
            <li>Antitussifs, mucolytiques, fluidifiants ou bronchodilatateurs IV.</li>
            <li>Corticoïdes inhalés en phase aiguë.</li>
            <li>Kinésithérapie respiratoire systématique (hors désencombrement doux).</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
