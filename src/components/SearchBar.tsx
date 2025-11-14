"use client";
import { useState, type RefObject } from "react";

type Props = {
  onFocus?: () => void;
  onChange?: (q: string) => void;
  autoFocus?: boolean;
  value?: string;
  className?: string;
  inputRef?: RefObject<HTMLInputElement>;
};

export default function SearchBar({
  onFocus,
  onChange,
  autoFocus,
  value,
  className,
  inputRef,
}: Props) {
  const [internalValue, setInternalValue] = useState(value ?? "");
  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : internalValue;

  return (
    <div className={`w-full max-w-[360px] mx-auto ${className ?? "mt-8"}`}>
      <div className="relative">
        <input
          ref={inputRef}
          className="rounded-full border border-slate-200 bg-white px-5 py-3 text-[15px] leading-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 w-full pl-11"
          placeholder="Rechercher un protocole"
          value={inputValue}
          autoFocus={autoFocus}
          onFocus={onFocus}
          onChange={(e) => {
            const nextValue = e.target.value;
            setInternalValue(nextValue);
            onChange?.(nextValue);
          }}
        />
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#2563eb]">
          🔎
        </span>
      </div>
    </div>
  );
}
