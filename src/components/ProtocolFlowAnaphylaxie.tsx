"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { computeDose } from "@/lib/dosing";
import { DOSING_RULES, WEIGHT_OVERRIDES } from "@/data/drugs";
import { formatMg } from "@/lib/units";
import { estimateAgeFromWeight } from "@/components/AgeWeightPicker";

type Branch = "cv" | "resp";

const ACCENT = {
  red:    { header: "bg-[#E53935]", body: "bg-[#FDEAEA]", border: "border-[#E53935]" },
  orange: { header: "bg-[#EF6C00]", body: "bg-[#FFF1E7]", border: "border-[#EF6C00]" },
  yellow: { header: "bg-[#F9A825]", body: "bg-[#FFF8E1]", border: "border-[#F9A825]" },
  violet: { header: "bg-[#6A1B9A]", body: "bg-[#F3E5F5]", border: "border-[#6A1B9A]" },
  grey:   { header: "bg-[#455A64]", body: "bg-[#ECEFF1]", border: "border-[#455A64]" },
  green:  { header: "bg-[#2E7D32]", body: "bg-[#E8F5E9]", border: "border-[#2E7D32]" },
  pink:   { header: "bg-[#D81B60]", body: "bg-[#FCE4EC]", border: "border-[#D81B60]" },
} as const;

const MIN_W = 3;
const MAX_W = 60;
const clampW = (v: number) => Math.min(Math.max(v, MIN_W), MAX_W);

const formatMl = (v: number) =>
  Number.isFinite(v) ? (v >= 1 ? `${Number(v.toFixed(1))} mL` : `${Number(v.toFixed(2))} mL`) : "—";
const formatDose = (v: number) => (Number.isFinite(v) ? formatMg(v) : "—");
const formatUg   = (v: number) => (Number.isFinite(v) ? `${Number(v.toFixed(v < 10 ? 1 : 0))} µg` : "—");

function Arrow() {
  return (
    <div className="flex justify-center" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-400">
        <path d="M12 4v16m0 0l-5-5m5 5l5-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-center text-[13px] font-semibold text-slate-700 shadow-sm">
      {children}
    </div>
  );
}

function Block({
  tone,
  title,
  subtitle,
  children,
}: {
  tone: keyof typeof ACCENT;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  const p = ACCENT[tone];
  return (
    <div className={`rounded-3xl overflow-hidden shadow-md border ${p.border}`}>
      <div className={`${p.header} px-4 py-3 text-white`}>
        <p className="text-[13px] font-semibold">{title}</p>
        {subtitle && <p className="text-[12px] text-white/90">{subtitle}</p>}
      </div>
      <div className={`${p.body} px-5 py-4 text-sm text-slate-800`}>{children}</div>
    </div>
  );
}

export default function ProtocolFlowAnaphylaxie() {
  // --- store
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg     = useAppStore((s) => s.setWeightKg);
  const ageLabel        = useAppStore((s) => s.ageLabel);
  const setAgeLabel     = useAppStore((s) => s.setAgeLabel);

  const weightKg = clampW(Number.isFinite(weightFromStore ?? NaN) ? (weightFromStore as number) : 10);

  // --- selectors (recalcul auto via store updates)
  const weightOptions = Array.from({ length: (MAX_W - MIN_W) * 2 + 1 }, (_, i) =>
    (MIN_W + i * 0.5).toFixed(1)
  );
  const ageOptions = [
    "Nouveau-né","1 mois","2 mois","3 mois","4 mois","5 mois","6 mois","9 mois","12 mois",
    "18 mois","2 ans","3 ans","4 ans","5 ans","6 ans","8 ans","10 ans","12 ans",
  ];

  const onChangeWeight = (val: string) => {
    const w = clampW(parseFloat(val));
    setWeightKg(w);
    if (!ageLabel) setAgeLabel(estimateAgeFromWeight(w) ?? "");
  };
  const onChangeAge = (val: string) => setAgeLabel(val);

  // --- doses
  const adrenalineIm = useMemo(
    () => computeDose(weightKg, DOSING_RULES["adrenaline-im"], WEIGHT_OVERRIDES["adrenaline-im"]),
    [weightKg]
  );
  const adrIMmg      = Number.isFinite(adrenalineIm.doseMg) ? adrenalineIm.doseMg : NaN;
  const adrIMvol     = Number.isFinite(adrIMmg) ? adrIMmg / 1 : NaN; // 1 mg/mL

  const solumedrolMin           = weightKg * 1;
  const solumedrolMax           = weightKg * 2;
  const polaramineMg            = weightKg * 0.1;
  const remplissageVolumeMl     = weightKg * 20; // 20 mL/kg
  const adrenalineNebuliseeDoseMg = Math.min(weightKg * 0.1, 5);

  const ivseUgPerMin            = weightKg * 0.1;
  const ivseMlPerMin            = Number.isFinite(ivseUgPerMin) ? ivseUgPerMin / 20 : NaN; // 1 mg/50 mL = 20 µg/mL
  const adrenalineIvseUgPerMin  = ivseUgPerMin;
  const adrenalineIvseMlPerMin  = ivseMlPerMin;
  const nadIvseUgPerMin         = weightKg * 0.2;

  const glucagonMg              = weightKg < 20 ? 0.5 : 1;
  const methyleneBlue           = weightKg * 1.5; // mg (1.5 mg/kg IVL)

  // --- UI state
  const [branch, setBranch] = useState<Branch | null>(null);

  const cardioSteps: FlowCardProps[] = [
    {
      tone: "grey",
      eyebrow: "Voie cardio-vasculaire",
      title: "Détresse cardio-vasculaire",
      badge: "Stabilisation",
      bullets: [
        "O₂ haute concentration, scope, VVP, ECG",
        `Remplissage NaCl 0,9 % ${formatMl(remplissageVolumeMl)} (20 mL/kg)`,
        "Position Trendelenburg, préparer amines vasopressives / intubation",
      ],
    },
    {
      tone: "yellow",
      eyebrow: "Escalade cardio-vasculaire",
      title: "Adrénaline IVSE 0,1 µg/kg/min",
      bullets: ["Surveillance continue, titrer selon réponse clinique"],
      children: (
        <>
          <p>
            Débit calculé : <strong>{formatUg(adrenalineIvseUgPerMin)}</strong> par minute pour {Number(weightKg.toFixed(1))} kg.
          </p>
          {Number.isFinite(adrenalineIvseMlPerMin) && (
            <p className="text-xs text-slate-500">
              Solution 1 mg/50 mL = 20 µg/mL → {Number(adrenalineIvseMlPerMin.toFixed(2))} mL/min.
            </p>
          )}
        </>
      ),
      footer: "Dose maximale cumulée : 0,5 mg.",
    },
    {
      tone: "red",
      eyebrow: "Renforcement hémodynamique",
      title: "Adrénaline IVSE + NAD 0,2 µg/kg/min",
      bullets: [
        "Réévaluer tension artérielle toutes les 2–3 minutes",
        "Associer autres vasopresseurs selon l’évolution",
      ],
      children: (
        <p>
          Débit NAD recommandé : <strong>{formatUg(nadIvseUgPerMin)}</strong> par minute (à adapter selon concentration).
        </p>
      ),
    },
  ];

  const respiratorySteps: FlowCardProps[] = [
    {
      tone: "violet",
      eyebrow: "Voie respiratoire",
      title: "Détresse respiratoire",
      badge: "Aérosols",
      bullets: [
        "Adrénaline nébulisée 0,1 mg/kg (max 5 mg)",
        "Salbutamol en aérosols répétés, O₂ humidifié",
        "Envisager VNI / IOT si épuisement",
      ],
      children: (
        <p>
          Dose calculée : <strong>{formatDose(adrenalineNebuliseeDoseMg)}</strong>.
        </p>
      ),
    },
    {
      tone: "orange",
      eyebrow: "Escalade respiratoire",
      title: "Poursuite des aérosols",
      bullets: [
        "Adrénaline nébulisée alternée ± salbutamol",
        "Ipratropium si bronchospasme sévère",
        "Kinésithérapie respiratoire à discuter",
      ],
    },
    {
      tone: "grey",
      eyebrow: "Réévaluation",
      title: "Surveillance & sortie",
      bullets: [
        "Observation minimale 6 h (risque biphasique)",
        "Cardio-monitoring ± saturométrie continue",
        "Prescription kit d’adrénaline auto-injectable",
      ],
    },
  ];

  const cardioInitialStep = cardioSteps[0]!;
  const cardioEscaladeSteps = cardioSteps.slice(1);
  const respiratoryInitialStep = respiratorySteps[0]!;
  const respiratoryEscaladeSteps = respiratorySteps.slice(1);

  return (
    <div className="w-full">
      <div className="rounded-[32px] border border-slate-200 bg-[#F9F9F9] shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-[#E53935] px-6 py-5 text-white">
          <h1 className="text-center text-[22px] font-semibold tracking-wide">ANAPHYLAXIE</h1>
        </div>

        <div className="px-5 py-6 sm:px-6 sm:py-7 space-y-6">
          {/* Sélecteurs compacts (pas de carte Données patient) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Âge</label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-[14px] shadow-sm"
                  value={ageLabel || estimateAgeFromWeight(weightKg) || "12 mois"}
                  onChange={(e) => onChangeAge(e.target.value)}
                >
                  {ageOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Poids</label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-[14px] shadow-sm"
                  value={weightKg.toFixed(1)}
                  onChange={(e) => onChangeWeight(e.target.value)}
                >
                  {weightOptions.map((w) => (
                    <option key={w} value={w}>{w} kg</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
              </div>
            </div>
          </div>

          {/* Colonne info gauche (Solumédrol/Polaramine)  */}
          <Block tone="orange" title="Antihistaminique & Corticoïde">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Solumédrol : <strong>{formatDose(solumedrolMin)}</strong> – <strong>{formatDose(solumedrolMax)}</strong> (1–2 mg/kg IV)
              </li>
              <li>
                Polaramine : <strong>{formatDose(polaramineMg)}</strong> (0,1 mg/kg) <span className="text-xs text-rose-700">— ⚠️ hypoTA</span>
              </li>
            </ul>
          </Block>

          <Banner>Atteinte cardio-vasculaire ou respiratoire</Banner>

          {/* Bloc central Adrénaline IM + éviction */}
          <div className="rounded-3xl overflow-hidden shadow-md border border-[#E53935]">
            <div className="bg-[#E53935] px-4 py-3 text-white">
              <p className="text-[13px] font-semibold">Adrénaline IM 0,01 mg/kg</p>
              <p className="text-[12px] text-white/90">pure — (max 0,5 mg) · Face latéro-externe 1/3 moyen cuisse</p>
              <p className="text-[12px] mt-1">
                Dose calculée : {formatDose(adrIMmg)}
                {Number.isFinite(adrIMvol) && <> — {formatMl(adrIMvol)} (1 mg/mL)</>}
              </p>
            </div>
            <div className="bg-[#FDEAEA] px-5 py-3">
              <span className="inline-flex items-center rounded-full bg-[#F9A825] px-3 py-1 text-[12px] font-medium text-black/90 shadow-sm">
                éviction allergène
              </span>
            </div>
          </div>

          {/* Encadré symptômes GI */}
          <Block tone="yellow" title="Symptômes gastro-intestinaux importants ou persistants ?">
            <p className="text-[13px]">+/− éviction allergène + surveillance</p>
          </Block>

          {/* --- Sélecteur de branche --- */}
          <div className="flex gap-2">
            <button
              onClick={() => setBranch("cv")}
              className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm ring-1 ring-slate-300 ${
                branch === "cv" ? "bg-slate-900 text-white" : "bg-white text-slate-700"
              }`}
            >
              Si détresse cardio-vasculaire
            </button>
            <button
              onClick={() => setBranch("resp")}
              className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm ring-1 ring-slate-300 ${
                branch === "resp" ? "bg-slate-900 text-white" : "bg-white text-slate-700"
              }`}
            >
              Si détresse respiratoire
            </button>
          </div>

          {/* --- Chemin CV --- */}
          {branch === "cv" && (
            <>
              <Block tone="violet" title="Détresse cardio-vasculaire">
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>O₂, scope, VVP, ECG</li>
                  <li>Trendelenburg</li>
                  <li>Remplissage NaCl 20 mL/kg</li>
                </ul>
              </Block>

              <Arrow />
              <Banner>Absence de réponse après 5–10 min</Banner>

              <Block tone="orange" title="Adrénaline IVSE : 0,1 µg/kg/min OU Adrénaline IV bolus">
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>Bolus : 1 µg/kg toutes les 1–2’ (dilué)</li>
                  <li>
                    Débit IVSE (calcul) : <strong>{formatUg(ivseUgPerMin)}</strong>/min
                    {Number.isFinite(ivseMlPerMin) && (
                      <span className="text-xs text-slate-600"> — 1 mg/50 mL (20 µg/mL) → {ivseMlPerMin.toFixed(2)} mL/min</span>
                    )}
                  </li>
                </ul>
              </Block>

              <Block tone="green" title="Poursuite remplissage">
                <p>NaCl 0,9 % selon réponse hémodynamique</p>
              </Block>

              <Block tone="red" title="Adrénaline IVSE">
                <p>Titrer selon clinique et TA.</p>
              </Block>

              <Block tone="grey" title="Appel réanimateur">
                <p>Escalade de prise en charge.</p>
              </Block>

              <Block
                tone="pink"
                title="↑ Adrénaline IVSE +/− NAD ≥ 0,1 µg/kg/min +/− Glucagon +/− Bleu de méthylène"
              >
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>NAD ≥ 0,1 µg/kg/min si hypotension réfractaire</li>
                  <li>
                    Glucagon (si bêta-bloquant) : <strong>{formatDose(glucagonMg)}</strong> — 0,03–0,1 mg/kg toutes 5’ (max 1 mg/dose)
                  </li>
                  <li>
                    Bleu de méthylène : <strong>{formatDose(methyleneBlue)}</strong> IVL (1,5 mg/kg)
                  </li>
                </ul>
              </Block>
            </>
          )}

          {/* --- Chemin RESP --- */}
          {branch === "resp" && (
            <>
              <Block tone="violet" title="Détresse respiratoire">
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>O₂, scope, VVP, ECG</li>
                  <li>½ assis</li>
                  <li>VAS : aérosol adrénaline 0,1 mg/kg (max 5 mg)</li>
                  <li>VAI : aérosol β₂</li>
                </ul>
              </Block>

              <Arrow />
              <Banner>Absence de réponse après 5–10 min</Banner>

              <Block tone="red" title="Adrénaline IM 0,01 mg/kg (max 0,5 mg)">
                <p>Poursuite aérosols</p>
              </Block>

              <Block tone="grey" title="Préparer IT + appel anesthésiste">
                <p>Anticiper voie aérienne difficile · Matériel prêt</p>
              </Block>
            </>
          )}

          {/* --- Bloc biologie / surveillance / sortie (communs finaux) --- */}
          <Block tone="grey" title="Biologie & Surveillance">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Tryptase : entre 30’ et H2 (tube sec) après début des symptômes puis H24</li>
              <li>Surveillance scopée : min 6 h (risque biphasique) — 12–24 h si atteinte sévère</li>
            </ul>
          </Block>

          <Block tone="grey" title="Sortie">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Kit de 2 stylos auto-injecteurs (Anapen®)</li>
              <li>150 µg de 7,5 à 25 kg — 300 µg si &gt; 25 kg</li>
              <li>β₂ mimétiques inhalés (si bronchospasme)</li>
              <li>Corticoïdes oraux 1 mg/kg (max 60 mg) 3 j</li>
              <li>Antihistaminiques 5 j</li>
              <li>Consultation allergologique (CR urgences)</li>
              <li>Conseils écrits / éviction allergène</li>
            </ul>
          </Block>
        </div>
      </div>
    </div>
  );
}
