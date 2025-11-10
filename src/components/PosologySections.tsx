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

// Protocole → sections à afficher (ajuste si besoin)
const SECTION_MAP: Record<string, string[]> = {
  aag: [
    "constantes",
    "iot",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
    "exacerbation_asthme",
  ],
  anaphylaxie: ["constantes", "iot", "etat_de_choc", "divers"],
  "choc-hemorragique": ["constantes", "perfusion_transfusion", "etat_de_choc"],
  "acr-enfant": ["constantes", "acr"],
  eme: ["constantes", "eme", "sedation"],
};

// Titres lisibles
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
};

const WEIGHT_VALUES = Array.from(new Set(POSOLOGY?.weights?.map((w) => w.kg) ?? [])).sort((a, b) => a - b);
const DEFAULT_MIN_WEIGHT = WEIGHT_VALUES.length > 0 ? WEIGHT_VALUES[0] : 1;
const DEFAULT_MAX_WEIGHT =
  WEIGHT_VALUES.length > 0 ? WEIGHT_VALUES[WEIGHT_VALUES.length - 1] : Math.max(DEFAULT_MIN_WEIGHT, 60);
const DEFAULT_PRESETS =
  WEIGHT_VALUES.length > 0
    ? computePresetWeights(WEIGHT_VALUES, DEFAULT_MIN_WEIGHT, DEFAULT_MAX_WEIGHT)
    : [5, 10, 15, 20];

type Props = { slug: string };

export default function PosologySections({ slug }: Props) {
  const weightKg = useAppStore((s) => s.weightKg) ?? 10;
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  const entry = useMemo(() => findPosoByWeight(weightKg), [weightKg]);
  const sectionsToShow = SECTION_MAP[slug] ?? [];
  const minWeight = DEFAULT_MIN_WEIGHT;
  const maxWeight = DEFAULT_MAX_WEIGHT;
  const presets = DEFAULT_PRESETS;

  const updateWeight = (next: number) => {
    if (Number.isNaN(next)) return;
    const clamped = Math.min(Math.max(next, minWeight), maxWeight);
    setWeightKg(Number(clamped.toFixed(1)));
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Barre de poids en haut */}
      <div className="sticky top-0 -mx-6 px-6 pt-1 pb-5 bg-slate-50/95 backdrop-blur">
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
          <div className="mt-4 flex flex-wrap gap-2">
            {presets.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => updateWeight(val)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                  Math.round(weightKg) === Math.round(val)
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-100 text-slate-600 hover:border-slate-300 hover:bg-white"
                }`}
              >
                {formatNum(val, 0)} kg
              </button>
            ))}
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

  // CONSTANTES
  if (sectionKey === "constantes") {
    const c = entry.constantes ?? entry.data?.constantes;
    return (
      <Card title={title}>
        <Rows>
          <Row label="FC" value={c?.fc_min && c?.fc_max ? `${c.fc_min}-${c.fc_max}/min` : c?.fc ?? "—"} />
          <Row label="PAS" value={c?.pas ? `${c.pas} mmHg` : "—"} />
          <Row label="FR" value={c?.fr ? `${c.fr}/min` : c?.fr_text ?? "—"} />
        </Rows>
      </Card>
    );
  }

  // IOT
  if (sectionKey === "iot") {
    const i = entry.iot ?? entry.data?.iot;
    return (
      <Card title={title}>
        <Rows>
          <Row label="Lame" value={i?.lame ?? "—"} />
          <Row
            label="Tube"
            value={i?.tube ? `${i.tube.type ?? ""} ${i.tube.size ?? ""}`.trim() : i?.sit ?? "—"}
          />
          <Row label="Distance" value={i?.distance_cm ? `${i.distance_cm} cm` : i?.distance ?? "—"} />
          <Row label="SNG" value={i?.sng_ch ? `${i.sng_ch} CH` : i?.sng ?? "—"} />
        </Rows>
      </Card>
    );
  }

  // Récupérer la section "brute" (pour détecter si ce sont des valeurs texte)
  const raw =
    (entry.sections && entry.sections[sectionKey]) ??
    entry[sectionKey] ??
    (entry.data && entry.data[sectionKey]) ??
    null;

  // 1) Cas “liste clé → texte” (ex. perfusion_transfusion)
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const entries = Object.entries(raw);
    const allStrings = entries.length > 0 && entries.every(([, v]) => typeof v === "string");
    if (allStrings) {
      return (
        <Card title={title} divided>
          {entries.map(([k, v]) => (
            <SimpleLine key={k} name={labelize(k)} text={String(v)} />
          ))}
        </Card>
      );
    }
  }

  // 2) Cas “sous-objets” (médicaments, posologies détaillées)
  const pairs = entriesOfSection(entry, sectionKey);
  if (pairs.length > 0) {
    return (
      <Card title={title} divided>
          {pairs.map(([key, obj]) => (
            <DrugLine key={key} name={labelize(key)} data={obj} />
          ))}
        </Card>
      );
  }

  // 3) Fallback texte si structure atypique
  return (
    <Card title={title}>
      <pre className="px-4 py-3 text-xs text-slate-600 whitespace-pre-wrap">
        {raw ? (typeof raw === "object" ? JSON.stringify(raw, null, 2) : String(raw)) : "—"}
      </pre>
    </Card>
  );
}

/* =======================
   Lignes de rendu
   ======================= */

function SimpleLine({ name, text }: { name: string; text: string }) {
  return (
    <div className="px-5 py-4 text-sm">
      <div className="text-sm font-semibold text-slate-900">{name}</div>
      <div className="mt-1 text-xs leading-relaxed text-slate-600">{text}</div>
    </div>
  );
}

function DrugLine({ name, data }: { name: string; data: DoseCommon }) {
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

  // 2) Si pas de champs numériques, afficher les champs texte de tes cartes
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
    // suffixes *text génériques
    { label: "Dose", key: "dose_text" },
    { label: "Débit", key: "rate_text" },
  ];
  const hasNumeric =
    typeof dose === "number" ||
    typeof vol === "number" ||
    typeof rate === "number" ||
    typeof computedVol === "number";

  return (
    <div className="px-5 py-4 text-sm text-slate-800">
      <div className="text-sm font-semibold text-slate-900">{name}</div>

      {/* Bloc numérique (si dispo) */}
      {hasNumeric && (
        <div className="mt-2 grid grid-cols-1 gap-2 text-[13px] text-slate-700">
          {typeof dose === "number" && (
            <div>
              <span className="text-slate-500">Dose&nbsp;:&nbsp;</span>
              <strong>{unitLine(dose, doseUnit)}</strong>
              {typeof data?.admin_over_min === "number" && (
                <span className="text-slate-500">
                  {" "}
                  sur {formatNum(data.admin_over_min, 0)} min
                </span>
              )}
            </div>
          )}

          {(typeof vol === "number" || typeof computedVol === "number") && (
            <div>
              <span className="text-slate-500">Volume&nbsp;:&nbsp;</span>
              <strong>{formatNum(vol ?? computedVol, 2)} mL</strong>
              {typeof conc === "number" && (
                <span className="text-slate-500"> @ {formatNum(conc, 2)} mg/mL</span>
              )}
            </div>
          )}

          {typeof rate === "number" && (
            <div>
              <span className="text-slate-500">Débit&nbsp;:&nbsp;</span>
              <strong>{formatNum(rate, 2)} mL/h</strong>
            </div>
          )}
        </div>
      )}

      {/* Bloc texte (si présent) */}
      <div className="mt-3 space-y-1.5 text-xs text-slate-600">
        {textFields.map(({ label, key }) =>
          typeof data?.[key] === "string" && data[key].trim() !== "" ? (
            <div key={key}>
              <span className="font-semibold text-slate-500">{label}</span>
              <span className="text-slate-500"> : </span>
              <span className="text-slate-600">{data[key]}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

/* =======================
   Composants UI
   ======================= */
function Card({ title, children, divided = false }: { title: string; children: React.ReactNode; divided?: boolean }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
        {title}
      </div>
      <div className={divided ? "divide-y divide-slate-100" : ""}>{children}</div>
    </div>
  );
}
function Rows({ children }: { children: React.ReactNode }) {
  return <div className="px-5 py-4 text-sm text-slate-800 space-y-2">{children}</div>;
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-semibold tracking-[0.16em] text-slate-400 uppercase">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

/* =======================
   Helpers libellés
   ======================= */
function computePresetWeights(weights: number[], min: number, max: number): number[] {
  if (!weights.length) return [];
  const unique = Array.from(new Set(weights)).sort((a, b) => a - b);
  const evenlySpaced: number[] = [];
  const segments = 5;
  for (let i = 0; i <= segments; i += 1) {
    const target = min + ((max - min) / segments) * i;
    const nearest = unique.reduce((prev, curr) =>
      Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
    );
    if (!evenlySpaced.includes(nearest)) evenlySpaced.push(nearest);
  }
  return evenlySpaced.slice(0, 6);
}

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
