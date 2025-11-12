// src/lib/age.ts

export function ageLabelToMonths(label: unknown): number | null {
  // Sécurité : si ce n’est pas une string → on ignore
  if (typeof label !== "string") return null;

  const lower = label.trim().toLowerCase();

  // "nouveau-né"
  if (lower.includes("nouveau")) return 0;

  // "10 mois" / "1 mois"
  const m = lower.match(/(\d+)\s*mois?/);
  if (m) return parseInt(m[1], 10);

  // "2 ans" / "1 an"
  const y = lower.match(/(\d+)\s*ans?/);
  if (y) return parseInt(y[1], 10) * 12;

  return null;
}
