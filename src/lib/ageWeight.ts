// src/lib/ageWeight.ts
/**
 * Retourne un label d'âge approximatif à partir d'un poids (kg).
 * Valeurs purement indicatives pour l’UI (mockup).
 */
export function estimateAgeFromWeight(weightKg: number | null): string {
  if (weightKg == null || Number.isNaN(weightKg)) return "Âge inconnu";
  const w = Math.max(0, weightKg);

  // Petites bornes indicatives
  if (w < 4) return "Nouveau-né";
  if (w < 6) return "1–2 mois";
  if (w < 8) return "3–5 mois";
  if (w < 10) return "6–8 mois";
  if (w < 12) return "9–12 mois";
  if (w < 14) return "12–18 mois";
  if (w < 18) return "2–3 ans";
  if (w < 22) return "4–5 ans";
  if (w < 30) return "6–8 ans";
  if (w < 40) return "9–11 ans";
  if (w < 50) return "12–13 ans";
  return "≥ 14 ans";
}
