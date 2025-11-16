// src/lib/units.ts

/** Affiche automatiquement en µg si < 1 mg, sinon en mg (1 ou 2 décimales). */
export function formatMg(mg: number) {
  if (mg < 1) return `${Math.round(mg * 1000)} µg`;
  return `${Number(mg.toFixed(mg < 10 ? 2 : 1))} mg`;
}

