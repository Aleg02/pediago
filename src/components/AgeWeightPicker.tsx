"use client";

import * as React from "react";
import { useMemo, useState } from "react";

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
  const found = THEORETICAL_WEIGHTS.find(
    (a) => a.label.toLowerCase() === ageLabel.toLowerCase()
  );
  return found?.weightKg ?? null;
}

/** Estime le *label* d'âge le plus proche pour un poids donné */
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
  className?: string;
};

const formatWeight = (value: number | null) =>
  value == null ? "" : String(value).replace(".", ",");

export default function AgeWeightPicker({
  ageLabel,
  setAgeLabel,
  weightKg,
  setWeightKg,
  className,
}: Props) {
  const ageOptions = useMemo(() => THEORETICAL_WEIGHTS.map((a) => a.label), []);

  // État local pour permettre la saisie progressive (ex: "10," ou "10.")
  const [weightDraft, setWeightDraft] = useState<string | null>(null);

  const onAgeChange = (value: string) => {
    setAgeLabel(value);

    const w = getTheoreticalWeight(value);
    if (w !== null) {
      setWeightKg(w); // règle: âge → poids
      setWeightDraft(null);
    } else {
      setWeightKg(null);
      setWeightDraft(null);
    }
  };

  const onWeightChange = (value: string) => {
    setWeightDraft(value);

    const normalized = value.replace(/,/g, ".").trim();

    if (normalized === "") {
      setWeightKg(null);
      return;
    }

    // Si l'utilisateur est en train de taper une décimale, on attend (ex: "10.")
    if (/[.,]$/.test(normalized)) {
      return;
    }

    const parsed = Number(normalized);
    if (!Number.isNaN(parsed)) {
      setWeightKg(parsed);

      // Optionnel : ajuster l'âge si non cohérent avec le poids saisi
      const nearest = estimateAgeFromWeight(parsed);
      if (nearest && nearest !== ageLabel) {
        setAgeLabel(nearest);
      }
    }
  };

  const onWeightBlur = () => {
    setWeightDraft(null);
  };

  const weightInput = weightDraft ?? formatWeight(weightKg);

  const labelCls = "text-slate-600 text-sm mb-1";
  const pillBase =
    "rounded-full px-4 py-2 bg-white border border-black/10 shadow-sm text-[16px] leading-6 w-full";
  // Forcer un texte sombre sur les champs, même si le parent est en texte blanc
  const pillText = "text-gray-900 placeholder:text-gray-400 font-semibold";
  const pillCls = `${pillBase} ${pillText}`;

  return (
    <div className={`w-full max-w-[420px] mx-auto grid grid-cols-2 gap-3 ${className ?? ""}`}>
      {/* Sélecteur Âge */}
      <div>
        <div className={labelCls}>Âge</div>
        <select
          className={pillCls}
          value={ageLabel ?? ""}
          onChange={(e) => onAgeChange(e.target.value)}
        >
          <option value="" disabled>
            Choisir…
          </option>
          {ageOptions.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Saisie Poids */}
      <div>
        <div className={labelCls}>Poids</div>
        <div className="relative">
          <input
            inputMode="decimal"
            className={`${pillCls} pr-12`}
            value={weightInput}
            onChange={(e) => onWeightChange(e.target.value)}
            onBlur={onWeightBlur}
            placeholder="ex : 10"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 select-none">
            kg
          </span>
        </div>
      </div>
    </div>
  );
}
