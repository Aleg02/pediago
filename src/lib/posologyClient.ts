"use client";

/**
 * Chargement robuste du JSON depuis /public (fetch côté client),
 * avec cache en mémoire et helpers (closest weight + extraction section).
 */

export type AnyDict = Record<string, unknown>;
export type PosologyPerWeight = AnyDict; // un bloc "9kg": {...}
export type PosologyData = Record<string, PosologyPerWeight>;

let _cache: PosologyData | null = null;
let _loading: Promise<PosologyData> | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readSection(container: unknown, key: string): unknown {
  return isRecord(container) ? container[key] : undefined;
}

export async function loadPosology(): Promise<PosologyData> {
  if (_cache) return _cache;
  if (_loading) return _loading;

  _loading = fetch("/data/posology_normalized.json", {
    // on veut toujours la dernière version quand on relance
    cache: "no-store",
  })
    .then(async (r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = (await r.json()) as PosologyData;
      _cache = data ?? {};
      return _cache;
    })
    .finally(() => {
      _loading = null;
    });

  return _loading;
}

// ───────────── Helpers d’affichage ─────────────
export function formatNum(n: number | undefined | null, digits = 0) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toLocaleString("fr-FR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function unitLine(value: number | undefined, unit?: string) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return `${formatNum(value, value < 1 ? 2 : 0)}${unit ? ` ${unit}` : ""}`;
}

export function calcVolumeFromConc(
  doseMg?: number,
  concMgPerMl?: number
): number | undefined {
  if (
    typeof doseMg !== "number" ||
    typeof concMgPerMl !== "number" ||
    doseMg <= 0 ||
    concMgPerMl <= 0
  ) {
    return undefined;
  }
  return doseMg / concMgPerMl;
}

// ───────────── Recherche par poids ─────────────
function parseKeyToKg(k: string): number | null {
  const m = k.trim().toLowerCase().replace(/\s+/g, "").match(/^(\d+)kg$/);
  return m ? Number(m[1]) : null;
}

export function availableKg(data: PosologyData): number[] {
  return Object.keys(data)
    .map(parseKeyToKg)
    .filter((v): v is number => typeof v === "number")
    .sort((a, b) => a - b);
}

export function findClosestPoso(
  data: PosologyData,
  weightKg: number
): { kg: number; entry: PosologyPerWeight } | null {
  const list = availableKg(data);
  if (!list.length) return null;

  const exact = data[`${Math.round(weightKg)}kg`];
  if (exact) return { kg: Math.round(weightKg), entry: exact };

  const target = Math.round(weightKg);
  let best = list[0];
  let bestDiff = Math.abs(best - target);
  for (const kg of list) {
    const d = Math.abs(kg - target);
    if (d < bestDiff) {
      best = kg;
      bestDiff = d;
    }
  }
  return { kg: best, entry: data[`${best}kg`] };
}

export function entriesOfSection(
  entry: PosologyPerWeight,
  sectionKey: string
): Array<[string, AnyDict]> {
  const viaSections = readSection(entry["sections"], sectionKey);

  const direct = readSection(entry, sectionKey);

  const viaData = readSection(entry["data"], sectionKey);

  const candidate = viaSections ?? direct ?? viaData;
  if (!isRecord(candidate)) return [];

  const result: Array<[string, AnyDict]> = [];

  for (const [key, value] of Object.entries(candidate)) {
    if (isRecord(value)) {
      result.push([key, value]);
    }
  }

  return result;
}
