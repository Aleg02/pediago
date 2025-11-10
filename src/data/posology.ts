/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PosologyFile, PosologyWeightEntry, DoseCommon } from "@/types/posology";
import POSOLOGY_JSON from "./posology_normalized.json";

// Cast propre du JSON
export const POSOLOGY: PosologyFile = POSOLOGY_JSON as unknown as PosologyFile;

// Cherche l’entrée par poids (exacte, sinon la plus proche)
export function findPosoByWeight(kg: number): PosologyWeightEntry | undefined {
  if (!POSOLOGY?.weights?.length) return undefined;
  const sorted = [...POSOLOGY.weights].sort((a, b) => a.kg - b.kg);
  const exact = sorted.find((w) => w.kg === Math.round(kg));
  if (exact) return exact;
  // sinon la plus proche
  let nearest = sorted[0];
  let best = Math.abs(sorted[0].kg - kg);
  for (const w of sorted) {
    const d = Math.abs(w.kg - kg);
    if (d < best) {
      nearest = w;
      best = d;
    }
  }
  return nearest;
}

// Helpers d’affichage

export function formatNum(n?: number, digits = 2): string {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  const s = n.toFixed(digits);
  // supprime trailing zeros
  return s.replace(/\.?0+$/, "");
}

export function unitLine(val?: number, unit?: string, digits = 2): string {
  if (typeof val !== "number") return "—";
  return `${formatNum(val, digits)}${unit ? " " + unit : ""}`;
}

export function calcVolumeFromConc(doseMg?: number, concMgPerMl?: number): number | undefined {
  if (typeof doseMg !== "number" || typeof concMgPerMl !== "number" || concMgPerMl <= 0) return undefined;
  return doseMg / concMgPerMl;
}

// Liste les sous-éléments d’une section (ex: isr.ketamine, isr.propofol…)
export function entriesOfSection(entry: PosologyWeightEntry, sectionKey: string): [string, DoseCommon][] {
  // 1) section au niveau hoisté (entry[sectionKey] si c’est un objet de paires)
  const hoisted: any = (entry as any)[sectionKey];
  if (hoisted && typeof hoisted === "object" && !Array.isArray(hoisted)) {
    const pairs = Object.entries(hoisted).filter(([, v]) => typeof v === "object" && v != null);
    if (pairs.length > 0) return pairs as [string, DoseCommon][];
  }
  // 2) sinon via entry.sections
  const sec = entry.sections?.[sectionKey];
  if (sec) return Object.entries(sec) as [string, DoseCommon][];
  // 3) sinon via data brut
  const raw = entry.data?.[sectionKey];
  if (raw && typeof raw === "object") return Object.entries(raw) as [string, DoseCommon][];
  return [];
}
