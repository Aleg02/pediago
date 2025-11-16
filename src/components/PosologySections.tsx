"use client";

import { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import {
  POSOLOGY,
  findPosoByWeight,
  entriesOfSection,
  unitLine,
  formatNum,
  calcVolumeFromConc,
} from "@/data/posology";
import type { DoseCommon, PosologyWeightEntry } from "@/types/posology";

/* ===============================
   Sections par protocole (posologie)
   =============================== */
const SECTION_MAP: Record<string, string[]> = {
  // Asthme aigu grave
  "aag": [
    "constantes",
    "iot",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
    "exacerbation_asthme",
  ],

  // Arrêt cardio-respiratoire (enfant)
  "acr-enfant": [
    "constantes",
    "iot",
    "acr",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
  ],

  // Anaphylaxie
  "anaphylaxie": [
    "constantes",
    "iot",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
  ],

  // Antalgiques (tolère les deux slugs)
  "antalgique": [
    "constantes",
    "antalgiques",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
  ],
  "antalgiques": [
    "constantes",
    "antalgiques",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
  ],

  // Choc hémorragique
  "choc-hemorragique": [
    "constantes",
    "iot",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
  ],

  // État de mal épileptique
  "eme": [
    "constantes",
    "iot",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
    "eme",
  ],

  // Bronchiolite du nourrisson
  "bronchiolite": [
    "constantes",
    "iot",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
    "divers",
  ],

  // Fièvre / sepsis / purpura fulminans
  "fievre-sepsis-purpura": [
    "constantes",
    "iot",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
    "purpura_fulminans",
  ],

  // Traumatisme crânien
  "traumatisme-cranien": [
    "constantes",
    "iot",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
  ],
};

/* ===============================
   Titres lisibles
   =============================== */
const TITLES: Record<string, string> = {
  constantes: "CONSTANTES",
  iot: "IOT",
  isr: "ISR",
  perfusion_transfusion: "PERF / TRANSF",
  sedation: "SÉDATION",
  etat_de_choc: "ÉTAT DE CHOC",
  exacerbation_asthme: "EXACERBATION ASTHME",
  acr: "ACR",
  eme: "EME",
  divers: "DIVERS",
  purpura_fulminans: "PURPURA FULMINANS",
};

const WEIGHT_VALUES = Array.from(new Set(POSOLOGY?.weights?.map((w) => w.kg) ?? [])).sort((a, b) => a - b);
const DEFAULT_MIN_WEIGHT = WEIGHT_VALUES.length > 0 ? WEIGHT_VALUES[0] : 1;
const DEFAULT_MAX_WEIGHT =
  WEIGHT_VALUES.length > 0 ? WEIGHT_VALUES[WEIGHT_VALUES.length - 1] : Math.max(DEFAULT_MIN_WEIGHT, 60);

const TONE_STYLES = {
  slate: {
    border: "border-slate-200/80",
    shadow: "shadow-sm",
    headerBg: "bg-gradient-to-r from-slate-900 to-slate-800",
    headerText: "text-white",
    bodyBg: "bg-white",
    label: "text-slate-400",
    muted: "text-slate-600",
    bodyText: "text-slate-800",
    strong: "text-slate-900",
    divide: "divide-slate-100",
  },
  teal: {
    border: "border-emerald-200/80",
    shadow: "shadow-[0_18px_36px_-24px_rgba(16,185,129,0.8)]",
    headerBg: "bg-gradient-to-r from-emerald-500 to-teal-500",
    headerText: "text-white",
    bodyBg: "bg-emerald-50",
    label: "text-emerald-600",
    muted: "text-emerald-700",
    bodyText: "text-emerald-900",
    strong: "text-emerald-900",
    divide: "divide-emerald-100",
  },
  azure: {
    border: "border-sky-200/80",
    shadow: "shadow-[0_18px_36px_-24px_rgba(14,165,233,0.8)]",
    headerBg: "bg-gradient-to-r from-sky-500 to-blue-600",
    headerText: "text-white",
    bodyBg: "bg-sky-50",
    label: "text-sky-600",
    muted: "text-sky-700",
    bodyText: "text-slate-900",
    strong: "text-slate-900",
    divide: "divide-sky-100",
  },
  indigo: {
    border: "border-indigo-200/80",
    shadow: "shadow-[0_18px_36px_-24px_rgba(79,70,229,0.6)]",
    headerBg: "bg-gradient-to-r from-indigo-500 to-indigo-600",
    headerText: "text-white",
    bodyBg: "bg-indigo-50",
    label: "text-indigo-600",
    muted: "text-indigo-700",
    bodyText: "text-slate-900",
    strong: "text-slate-900",
    divide: "divide-indigo-100",
  },
  amber: {
    border: "border-amber-200/80",
    shadow: "shadow-[0_18px_36px_-24px_rgba(245,158,11,0.7)]",
    headerBg: "bg-gradient-to-r from-amber-500 to-orange-500",
    headerText: "text-white",
    bodyBg: "bg-amber-50",
    label: "text-amber-600",
    muted: "text-amber-700",
    bodyText: "text-slate-900",
    strong: "text-slate-900",
    divide: "divide-amber-100",
  },
  rose: {
    border: "border-rose-200/80",
    shadow: "shadow-[0_18px_36px_-24px_rgba(244,114,182,0.7)]",
    headerBg: "bg-gradient-to-r from-rose-500 to-pink-500",
    headerText: "text-white",
    bodyBg: "bg-rose-50",
    label: "text-rose-600",
    muted: "text-rose-700",
    bodyText: "text-slate-900",
    strong: "text-slate-900",
    divide: "divide-rose-100",
  },
} as const;

type ToneKey = keyof typeof TONE_STYLES;

const SECTION_TONE: Record<string, ToneKey> = {
  constantes: "teal",
  iot: "indigo",
  isr: "azure",
  perfusion_transfusion: "amber",
  sedation: "rose",
  etat_de_choc: "rose",
  exacerbation_asthme: "amber",
  acr: "indigo",
  eme: "indigo",
};

function toneForSection(sectionKey: string): ToneKey {
  return SECTION_TONE[sectionKey] ?? "slate";
}

type Props = { slug: string };

export default function PosologySections({ slug }: Props) {
  const weightKg = useAppStore((s) => s.weightKg) ?? 10;
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  const entry = useMemo(() => findPosoByWeight(weightKg), [weightKg]);
  const sectionsToShow = SECTION_MAP[slug] ?? [];
  const minWeight = DEFAULT_MIN_WEIGHT;
  const maxWeight = DEFAULT_MAX_WEIGHT;

  const updateWeight = (next: number) => {
    if (Number.isNaN(next)) return;
    const clamped = Math.min(Math.max(next, minWeight), maxWeight);
    setWeightKg(Number(clamped.toFixed(1)));
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Barre de poids en haut */}
      <div className="sticky top-0 z-30 -mx-6 px-6 pt-1 pb-5 bg-slate-50/95 backdrop-blur">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold tracking-[0.18em] text-slate-500 uppercase">Poids</p>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-semibold text-slate-900">{formatNum(weightKg, 1)}</span>
                <span className="text-sm font-medium text-slate-500 mb-1">kg</span>
              </div>
            </div>
            <input
              type="number"
              inputMode="decimal"
              min={minWeight}
              max={maxWeight}
              step="0.5"
              value={weightKg}
              onChange={(e) => {
                const raw = e.target.value.replace(",", ".");
                if (raw === "") return;
                updateWeight(Number(raw));
              }}
              onBlur={(e) => {
                const raw = e.target.value.replace(",", ".");
                updateWeight(Number(raw));
              }}
              className="h-11 w-[110px] rounded-xl border border-slate-200 bg-slate-50 px-3 text-right text-lg font-semibold text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
          <div className="mt-4">
            <input
              type="range"
              min={minWeight}
              max={maxWeight}
              step="1"
              value={Math.min(maxWeight, Math.max(minWeight, Math.round(weightKg)))}
              onChange={(e) => updateWeight(Number(e.target.value))}
              className="w-full accent-slate-900"
            />
          </div>
        </div>
      </div>

      {!entry ? (
        <div className="text-sm text-slate-500">
          Aucune donnée posologique disponible pour {formatNum(weightKg, 0)} kg.
        </div>
      ) : (
        sectionsToShow.map((secKey) => (
          <SectionBlock key={secKey} entry={entry} sectionKey={secKey} />
        ))
      )}
    </div>
  );
}

/* =======================
   Rendu d’une section
   ======================= */
function SectionBlock({ entry, sectionKey }: { entry: PosologyWeightEntry; sectionKey: string }) {
  const title = TITLES[sectionKey] ?? sectionKey.toUpperCase();
  const tone = toneForSection(sectionKey);
  const toneStyles = TONE_STYLES[tone];

  // CONSTANTES
  if (sectionKey === "constantes") {
    const c = entry.constantes ?? entry.data?.constantes;
    const fcStr =
      c?.fc_min && c?.fc_max
        ? `${c.fc_min}-${c.fc_max}/min`
        : typeof c?.fc === "string"
        ? c.fc
        : "—";
    const frStr =
      c?.fr_min && c?.fr_max
        ? `${c.fr_min}-${c.fr_max}/min`
        : c?.fr
        ? `${c.fr}/min`
        : c?.fr_text ?? "—";

    return (
      <Card title={title} tone={tone}>
        <Rows tone={tone}>
          <Row tone={tone} label="FC" value={fcStr} />
          <Row tone={tone} label="PAS" value={c?.pas ? `${c.pas} mmHg` : "—"} />
          <Row tone={tone} label="FR" value={frStr} />
        </Rows>
      </Card>
    );
  }

  // IOT
  if (sectionKey === "iot") {
    const i = entry.iot ?? entry.data?.iot;
    const tubeText =
      i?.tube?.size || i?.tube?.type
        ? `${i.tube.type ?? ""} ${i.tube.size ?? ""}`.trim()
        : i?.sit ?? "—";

    const distanceText =
      typeof i?.distance_cm === "number" || typeof i?.distance_cm_min === "number"
        ? i?.distance_cm_min && i?.distance_cm_max
          ? `${i.distance_cm_min}-${i.distance_cm_max} cm`
          : i?.distance_cm
          ? `${i.distance_cm} cm`
          : "—"
        : i?.distance ?? "—";

    const sngText =
      typeof i?.sng_ch === "number" ? `${i.sng_ch} CH` : i?.sng ?? "—";

    return (
      <Card title={title} tone={tone}>
        <Rows tone={tone}>
          <Row tone={tone} label="Lame" value={i?.lame ?? "—"} />
          <Row tone={tone} label="Tube" value={tubeText} />
          <Row tone={tone} label="Distance" value={distanceText} />
          <Row tone={tone} label="SNG" value={sngText} />
        </Rows>
      </Card>
    );
  }

  // Récup brute (permet de gérer les sections “clé → texte”)
  const raw =
    (entry.sections && entry.sections[sectionKey]) ??
    entry[sectionKey] ??
    (entry.data && entry.data[sectionKey]) ??
    null;

  // 1) Cas “clé → texte” (ex. perfusion_transfusion dans certaines fiches)
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const entries = Object.entries(raw);
    const allStrings = entries.length > 0 && entries.every(([, v]) => typeof v === "string");
    if (allStrings) {
      return (
        <Card title={title} tone={tone} divided>
          {entries.map(([k, v]) => (
            <SimpleLine key={k} tone={tone} name={labelize(k)} text={String(v)} />
          ))}
        </Card>
      );
    }
  }

  // 2) Cas “médicaments / sous-objets”
  const pairs = entriesOfSection(entry, sectionKey);
  if (pairs.length > 0) {
    return (
      <Card title={title} tone={tone} divided>
        {pairs.map(([key, obj]) => (
          <DrugLine key={key} tone={tone} name={labelize(key)} data={obj} />
        ))}
      </Card>
    );
  }

  // 3) Fallback : affiche JSON lisible (utile tant que tout n’est pas normalisé)
  return (
    <Card title={title} tone={tone}>
      <pre className={`px-4 py-3 text-xs ${toneStyles.muted} whitespace-pre-wrap`}>
        {raw ? (typeof raw === "object" ? JSON.stringify(raw, null, 2) : String(raw)) : "—"}
      </pre>
    </Card>
  );
}

/* =======================
   Lignes de rendu
   ======================= */
function SimpleLine({ name, text, tone }: { name: string; text: string; tone: ToneKey }) {
  const toneStyles = TONE_STYLES[tone] ?? TONE_STYLES.slate;
  return (
    <div className={`px-5 py-4 text-sm ${toneStyles.bodyText}`}>
      <div className={`text-sm font-semibold ${toneStyles.strong}`}>{name}</div>
      <div className={`mt-1 text-xs leading-relaxed ${toneStyles.muted}`}>{text}</div>
    </div>
  );
}

function DrugLine({ name, data, tone }: { name: string; data: DoseCommon; tone: ToneKey }) {
  // 1) Affichage numérique si présent (JSON normalisé)
  const dose =
    data?.dose_mg ??
    data?.dose_ug ??
    data?.dose_mg_per_h ??
    data?.dose_ug_per_min ??
    data?.dose_ug_per_kg_per_min ??
    data?.dose_mg_per_kg ??
    undefined;

  const doseUnit =
    typeof data?.dose_mg === "number" ? "mg" :
    typeof data?.dose_ug === "number" ? "µg" :
    typeof data?.dose_mg_per_h === "number" ? "mg/h" :
    typeof data?.dose_ug_per_min === "number" ? "µg/min" :
    typeof data?.dose_ug_per_kg_per_min === "number" ? "µg/kg/min" :
    typeof data?.dose_mg_per_kg === "number" ? "mg/kg" :
    undefined;

  const vol = data?.volume_ml as number | undefined;
  const rate = data?.rate_ml_per_h as number | undefined;
  const conc =
    data?.prep?.final_conc_mg_per_ml ??
    data?.prep?.stock_conc_mg_per_ml ??
    undefined;
  const computedVol = vol == null ? calcVolumeFromConc(data?.dose_mg, conc) : undefined;

  // 2) Champs texte (issus des cartes quand pas encore normalisés)
  const textFields: { label: string; key: string }[] = [
    { label: "Dose", key: "dose" },
    { label: "Bolus", key: "bolus" },
    { label: "Continu", key: "continu" },
    { label: "Volume", key: "volume" },
    { label: "Débit", key: "debit" },
    { label: "Dilution", key: "dilution" },
    { label: "Forme", key: "forme" },
    { label: "Prépa", key: "prep_text" },
    { label: "Durée", key: "duration" },
    { label: "Note", key: "note" },
    { label: "Dose", key: "dose_text" },
    { label: "Débit", key: "rate_text" },
  ];

  const hasNumeric =
    typeof dose === "number" ||
    typeof vol === "number" ||
    typeof rate === "number" ||
    typeof computedVol === "number";

  const toneStyles = TONE_STYLES[tone] ?? TONE_STYLES.slate;

  return (
    <div className={`px-5 py-4 text-sm ${toneStyles.bodyText}`}>
      <div className={`text-sm font-semibold ${toneStyles.strong}`}>{name}</div>

      {/* Bloc numérique (si dispo) */}
      {hasNumeric && (
        <div className={`mt-2 grid grid-cols-1 gap-2 text-[13px] ${toneStyles.muted}`}>
          {typeof dose === "number" && (
            <div>
              <span className={toneStyles.label}>Dose&nbsp;:&nbsp;</span>
              <strong>{unitLine(dose, doseUnit)}</strong>
              {typeof data?.admin_over_min === "number" && (
                <span className={toneStyles.muted}> sur {formatNum(data.admin_over_min, 0)} min</span>
              )}
            </div>
          )}

          {(typeof vol === "number" || typeof computedVol === "number") && (
            <div>
              <span className={toneStyles.label}>Volume&nbsp;:&nbsp;</span>
              <strong>{formatNum(vol ?? computedVol, 2)} mL</strong>
              {typeof conc === "number" && (
                <span className={toneStyles.muted}> @ {formatNum(conc, 2)} mg/mL</span>
              )}
            </div>
          )}

          {typeof rate === "number" && (
            <div>
              <span className={toneStyles.label}>Débit&nbsp;:&nbsp;</span>
              <strong>{formatNum(rate, 2)} mL/h</strong>
            </div>
          )}
        </div>
      )}

      {/* Bloc texte (si présent) */}
      <div className={`mt-3 space-y-1.5 text-xs ${toneStyles.muted}`}>
        {textFields.map(({ label, key }) =>
          typeof data?.[key] === "string" && data[key].trim() !== "" ? (
            <div key={key}>
              <span className={`font-semibold ${toneStyles.label}`}>{label}</span>
              <span className={toneStyles.muted}> : </span>
              <span className={toneStyles.bodyText}>{data[key]}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

/* =======================
   Composants UI de base
   ======================= */
function Card({
  title,
  children,
  divided = false,
  tone = "slate",
}: {
  title: string;
  children: React.ReactNode;
  divided?: boolean;
  tone?: ToneKey;
}) {
  const toneStyles = TONE_STYLES[tone] ?? TONE_STYLES.slate;
  return (
    <div
      className={`rounded-2xl overflow-hidden border ${toneStyles.border} ${toneStyles.shadow} bg-white/60 backdrop-blur-[1px]`}
    >
      <div
        className={`px-5 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase ${toneStyles.headerBg} ${toneStyles.headerText}`}
      >
        {title}
      </div>
      <div className={`${toneStyles.bodyBg} ${divided ? `divide-y ${toneStyles.divide}` : ""}`}>{children}</div>
    </div>
  );
}

function Rows({ children, tone }: { children: React.ReactNode; tone: ToneKey }) {
  const toneStyles = TONE_STYLES[tone] ?? TONE_STYLES.slate;
  return <div className={`px-5 py-4 text-sm space-y-2 ${toneStyles.bodyText}`}>{children}</div>;
}

function Row({ label, value, tone }: { label: string; value: string; tone: ToneKey }) {
  const toneStyles = TONE_STYLES[tone] ?? TONE_STYLES.slate;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={`text-xs font-semibold tracking-[0.16em] uppercase ${toneStyles.label}`}>{label}</span>
      <span className={`text-sm font-semibold ${toneStyles.strong}`}>{value}</span>
    </div>
  );
}

/* =======================
   Helpers libellés
   ======================= */
function labelize(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\bivse\b/i, "IVSE")
    .replace(/\bae\b/i, "AE")
    .replace(/\biv\b/i, "IV")
    .replace(/\bmgso4\b/i, "MgSO₄")
    .replace(/\bcee\b/i, "CEE")
    .replace(/\bid\b/i, "ID")
    .replace(/\bch\b/i, "CH")
    .replace(/\bpas\b/i, "PAS")
    .replace(/\bfr\b/i, "FR")
    .replace(/^\w/, (m) => m.toUpperCase());
}
