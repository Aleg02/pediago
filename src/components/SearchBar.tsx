"use client";
import { useState } from "react";

type Props = {
  onFocus?: () => void;
  onBlur?: () => void;
  onChange?: (q: string) => void;
  autoFocus?: boolean;
  value?: string;
  className?: string;
};

export default function SearchBar({ onFocus, onBlur, onChange, autoFocus, value, className }: Props) {
  const [internalValue, setInternalValue] = useState(value ?? "");
  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : internalValue;
  const containerClass = ["w-full max-w-[360px] mx-auto", className ?? "mt-8"].join(" ");

  return (
    <div className={containerClass}>
      <div className="relative">
        <input
          className="rounded-full px-4 py-2 bg-white border border-black/10 shadow-sm text-[16px] leading-6 w-full pl-10"
          placeholder="Rechercher un protocole d'urgence"
          value={inputValue}
          autoFocus={autoFocus}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e) => {
            const nextValue = e.target.value;
            setInternalValue(nextValue);
            onChange?.(nextValue);
          }}
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 select-none">🔎</span>
      </div>
    </div>
  );
}
