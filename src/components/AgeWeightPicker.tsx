"use client";
import { useMemo } from "react";

export type TheoreticalAge = { label: string; weightKg: number; };

const THEORETICAL_WEIGHTS: TheoreticalAge[] = [
  { label: "Naissance", weightKg: 3 },
  { label: "3 mois", weightKg: 6 },
  { label: "6 mois", weightKg: 7.5 },
  { label: "9 mois", weightKg: 9 },
  { label: "10 mois", weightKg: 10 }, // pour coller au mockup
  { label: "1 an", weightKg: 10 },
  { label: "2 ans", weightKg: 12 },
  { label: "3 ans", weightKg: 14 },
  { label: "4 ans", weightKg: 16 },
  { label: "5 ans", weightKg: 18 },
  { label: "6 ans", weightKg: 20 },
  { label: "7 ans", weightKg: 22 },
  { label: "8 ans", weightKg: 24 },
  { label: "9 ans", weightKg: 26 },
  { label: "10 ans", weightKg: 30 },
  { label: "11 ans", weightKg: 34 },
  { label: "12 ans", weightKg: 38 },
  { label: "13 ans", weightKg: 42 },
  { label: "14 ans", weightKg: 46 },
  { label: "15 ans", weightKg: 50 },
];

export function getTheoreticalWeight(ageLabel: string | null) {
  if (!ageLabel) return null;
  const found = THEORETICAL_WEIGHTS.find(a => a.label.toLowerCase() === ageLabel.toLowerCase());
  return found?.weightKg ?? null;
}

type Props = {
  ageLabel: string | null;
  setAgeLabel: (v: string) => void;
  weightKg: number | null;
  setWeightKg: (v: number) => void;
};

export default function AgeWeightPicker({ ageLabel, setAgeLabel, weightKg, setWeightKg }: Props) {
  const ageOptions = useMemo(() => THEORETICAL_WEIGHTS.map(a => a.label), []);

  const onAgeChange = (value: string) => {
    setAgeLabel(value);
    const w = getTheoreticalWeight(value);
    if (w !== null) setWeightKg(w); // règle: âge → poids
  };

  const onWeightChange = (value: string) => {
    const n = Number(value.replace(",", "."));
    if (!Number.isNaN(n)) setWeightKg(n);
  };

  const labelCls = "text-slate-500 text-sm mb-1";

  const pillCls =
    "rounded-full px-4 py-2 bg-white border border-black/10 shadow-sm text-[16px] leading-6 w-full";

  return (
    <div className="w-full max-w-[360px] mx-auto grid grid-cols-2 gap-3 mt-6">
      <div>
        <div className={labelCls}>Âge</div>
        <select
          className={pillCls}
          value={ageLabel ?? ""}
          onChange={(e) => onAgeChange(e.target.value)}
        >
          <option value="" disabled>Choisir…</option>
          {ageOptions.map((label) => (<option key={label} value={label}>{label}</option>))}
        </select>
      </div>

      <div>
        <div className={labelCls}>Poids</div>
        <div className="relative">
          <input
            inputMode="decimal"
            className={`${pillCls} pr-12`}
            value={weightKg ?? ""}
            onChange={(e) => onWeightChange(e.target.value)}
            placeholder="ex : 10"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 select-none">kg</span>
        </div>
      </div>
    </div>
  );
}
