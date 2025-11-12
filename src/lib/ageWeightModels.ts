export type WeightModel = "table" | "apls";

const TABLE_POINTS: Array<[months: number, kg: number]> = [
  [0, 3], [3, 6], [6, 7.5], [9, 9], [12, 10],
  [24, 12], [36, 14], [48, 16], [60, 18], [72, 20],
  [84, 22], [96, 24], [108, 26], [120, 30], [132, 34],
  [144, 38], [156, 42], [168, 46], [180, 50],
];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function interpolateFromTable(months: number): number {
  const m = clamp(months, 0, 180);
  for (let i = 0; i < TABLE_POINTS.length - 1; i++) {
    const [m1, w1] = TABLE_POINTS[i];
    const [m2, w2] = TABLE_POINTS[i + 1];
    if (m >= m1 && m <= m2) {
      const t = (m - m1) / (m2 - m1);
      return +(w1 + t * (w2 - w1)).toFixed(1);
    }
  }
  return TABLE_POINTS[TABLE_POINTS.length - 1][1];
}

function aplsFromMonths(months: number): number {
  const y = clamp(months, 0, 180) / 12;
  if (y < 1) return +(3 + 7 * y).toFixed(1);
  if (y <= 6) return Math.round(2 * y + 8);
  return Math.round(3 * y + 7);
}

export function estimateWeightFromAge(months: number, model: WeightModel): number {
  const w = model === "table" ? interpolateFromTable(months) : aplsFromMonths(months);
  return clamp(w, 1, 50); // ← borne haute 50 kg
}

/** Optionnel : si tu utilises l’inversion ailleurs */
export function estimateAgeFromWeight(kg: number, model: WeightModel): number {
  const w = clamp(kg, 1, 50);
  if (model === "table") {
    for (let i = 0; i < TABLE_POINTS.length - 1; i++) {
      const [m1, w1] = TABLE_POINTS[i];
      const [m2, w2] = TABLE_POINTS[i + 1];
      if ((w >= w1 && w <= w2) || (w >= w2 && w <= w1)) {
        const t = (w - w1) / (w2 - w1);
        return Math.round(m1 + t * (m2 - m1));
      }
    }
    return 180;
  }
  if (w < 10) return Math.round(((w - 3) / 7) * 12);
  if (w <= 20) return Math.round(((w - 8) / 2) * 12);
  return Math.round(((w - 7) / 3) * 12);
}
