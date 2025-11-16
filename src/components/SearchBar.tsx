"use client";
import { useState, type RefObject } from "react";

type Props = {
  onFocus?: () => void;
  onChange?: (q: string) => void;
  onClear?: () => void;
  autoFocus?: boolean;
  value?: string;
  className?: string;
  inputRef?: RefObject<HTMLInputElement>;
};

export default function SearchBar({
  onFocus,
  onChange,
  onClear,
  autoFocus,
  value,
  className,
  inputRef,
}: Props) {
  const [internalValue, setInternalValue] = useState(value ?? "");
  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : internalValue;
  const showClear = inputValue.length > 0;

  return (
    <div className={`w-full max-w-[360px] mx-auto ${className ?? "mt-8"}`}>
      <div className="relative overflow-hidden rounded-full border border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(37,99,235,0.1)] transition focus-within:border-[#2563eb]/40 focus-within:ring-2 focus-within:ring-[#2563eb]/20">
        <input
          ref={inputRef}
          type="search"
          className="w-full rounded-full border-none bg-transparent px-5 py-3 pl-11 text-[15px] leading-6 placeholder:text-slate-400 focus:outline-none"
          placeholder="Rechercher un protocole"
          value={inputValue}
          autoFocus={autoFocus}
          onFocus={onFocus}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              inputRef?.current?.blur();
              event.currentTarget.blur();
            }
          }}
          onChange={(e) => {
            const nextValue = e.target.value;
            setInternalValue(nextValue);
            onChange?.(nextValue);
          }}
          aria-label="Rechercher un protocole"
        />
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#2563eb]">🔎</span>

        {showClear && (
          <button
            type="button"
            onClick={() => {
              setInternalValue("");
              onChange?.("");
              onClear?.();
              inputRef?.current?.focus();
            }}
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-[13px] text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
            aria-label="Effacer la recherche"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
