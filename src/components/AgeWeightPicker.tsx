"use client";

import { useEffect, useMemo } from "react";

export type TheoreticalAge = { label: string; weightKg: number };

export const THEORETICAL_WEIGHTS: TheoreticalAge[] = [
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
  const found = THEORETICAL_WEIGHTS.find((a) => a.label.toLowerCase() === ageLabel.toLowerCase());
  return found?.weightKg ?? null;
}

export function estimateAgeFromWeight(weightKg: number | null) {
  if (weightKg == null) return null;

  let bestMatch: TheoreticalAge | null = null;
  let smallestDiff = Number.POSITIVE_INFINITY;

  for (const candidate of THEORETICAL_WEIGHTS) {
    const diff = Math.abs(candidate.weightKg - weightKg);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      bestMatch = candidate;
    }
  }

  return bestMatch?.label ?? null;
}

type Props = {
  ageLabel: string | null;
  setAgeLabel: (v: string) => void;
  weightKg: number | null;
  setWeightKg: (v: number | null) => void;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const formatWeight = (value: number | null) =>
  value == null ? "--" : `${Number.isInteger(value) ? value : value.toString().replace(".", ",")} kg`;

export default function AgeWeightPicker({ ageLabel, setAgeLabel, weightKg, setWeightKg }: Props) {
  const ageOptions = useMemo(() => THEORETICAL_WEIGHTS.map((a) => a.label), []);

  useEffect(() => {
    if (ageLabel != null && weightKg != null) return;
    const first = THEORETICAL_WEIGHTS[0];
    if (!first) return;
    if (ageLabel == null) {
      setAgeLabel(first.label);
    }
    if (weightKg == null) {
      setWeightKg(first.weightKg);
    }
  }, [ageLabel, weightKg, setAgeLabel, setWeightKg]);

  useEffect(() => {
    if (weightKg == null) return;
    const estimated = estimateAgeFromWeight(weightKg);
    if (estimated && estimated !== ageLabel) {
      setAgeLabel(estimated);
    }
  }, [weightKg, ageLabel, setAgeLabel]);

  const currentLabel = useMemo(() => {
    if (ageLabel) {
      return ageLabel;
    }
    const estimated = estimateAgeFromWeight(weightKg);
    if (estimated) return estimated;
    return ageOptions[0];
  }, [ageLabel, weightKg, ageOptions]);

  const currentIndex = useMemo(() => {
    const idx = ageOptions.findIndex((label) => label === currentLabel);
    return idx === -1 ? 0 : idx;
  }, [ageOptions, currentLabel]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < ageOptions.length - 1;

  const goToIndex = (index: number) => {
    const clamped = clamp(index, 0, ageOptions.length - 1);
    const item = THEORETICAL_WEIGHTS[clamped];
    if (!item) return;
    setAgeLabel(item.label);
    setWeightKg(item.weightKg);
  };

  const handleAgeStep = (delta: number) => {
    goToIndex(currentIndex + delta);
  };

  const handleWeightStep = (delta: number) => {
    const inferredIndex = (() => {
      if (ageLabel) {
        const idx = ageOptions.findIndex((label) => label === ageLabel);
        if (idx >= 0) return idx;
      }
      if (weightKg != null) {
        const estimated = estimateAgeFromWeight(weightKg);
        const idx = estimated ? ageOptions.findIndex((label) => label === estimated) : -1;
        if (idx >= 0) return idx;
      }
      return currentIndex;
    })();
    goToIndex(inferredIndex + delta);
  };

  const prevAge = hasPrev ? ageOptions[currentIndex - 1] : null;
  const nextAge = hasNext ? ageOptions[currentIndex + 1] : null;

  const prevWeight = hasPrev ? THEORETICAL_WEIGHTS[currentIndex - 1].weightKg : null;
  const nextWeight = hasNext ? THEORETICAL_WEIGHTS[currentIndex + 1].weightKg : null;
  const displayWeight = weightKg ?? THEORETICAL_WEIGHTS[currentIndex]?.weightKg ?? null;

  return (
    <div className="w-full max-w-[360px] mx-auto bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-lg shadow-slate-200/70 rounded-3xl px-6 py-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">Âge</span>
          <div className="mt-4 w-full space-y-2">
            <button
              type="button"
              onClick={() => handleAgeStep(-1)}
              disabled={!hasPrev}
              className="w-full py-2 rounded-2xl text-sm font-medium text-slate-400 disabled:text-slate-200 transition-colors"
            >
              {prevAge ?? ""}
            </button>
            <div className="w-full py-3 rounded-2xl bg-white text-slate-900 text-lg font-semibold border border-slate-900/10 shadow-inner">
              {currentLabel}
            </div>
            <button
              type="button"
              onClick={() => handleAgeStep(1)}
              disabled={!hasNext}
              className="w-full py-2 rounded-2xl text-sm font-medium text-slate-400 disabled:text-slate-200 transition-colors"
            >
              {nextAge ?? ""}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">Poids</span>
          <div className="mt-4 w-full space-y-2">
            <button
              type="button"
              onClick={() => handleWeightStep(-1)}
              disabled={!hasPrev}
              className="w-full py-2 rounded-2xl text-sm font-medium text-slate-400 disabled:text-slate-200 transition-colors"
            >
              {prevWeight != null ? formatWeight(prevWeight) : ""}
            </button>
            <div className="w-full py-3 rounded-2xl bg-white text-slate-900 text-lg font-semibold border border-slate-900/10 shadow-inner">
              {formatWeight(displayWeight)}
            </div>
            <button
              type="button"
              onClick={() => handleWeightStep(1)}
              disabled={!hasNext}
              className="w-full py-2 rounded-2xl text-sm font-medium text-slate-400 disabled:text-slate-200 transition-colors"
            >
              {nextWeight != null ? formatWeight(nextWeight) : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
