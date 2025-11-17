"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Protocol } from "@/data/protocols";

type Props = {
  item: Protocol;
  onOpen?: (slug: string) => void;
  highlightQuery?: string;
  isLocked?: boolean;
};

export default function ProtocolCard({
  item,
  onOpen,
  highlightQuery,
  isLocked,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const highlightedTitle = useMemo(
    () => highlightText(item.title, highlightQuery),
    [item.title, highlightQuery]
  );

  const tagBackground = useMemo(
    () => withAlpha(item.accentColor, "1a"),
    [item.accentColor]
  );

  const badgeLabel = useMemo(() => {
    if (isLocked) {
      return "🔒 Premium";
    }
    if (item.accessLevel === "premium") {
      return "Premium";
    }
    if (item.accessLevel === "free") {
      return "Gratuit";
    }
    return null;
  }, [isLocked, item.accessLevel]);

  const badgeClassName = useMemo(() => {
    if (isLocked) {
      return "border border-rose-200/80 bg-white/80 text-rose-600";
    }
    if (item.accessLevel === "premium") {
      return "border border-amber-200 bg-amber-50 text-amber-800";
    }
    return "border border-emerald-200 bg-emerald-50 text-emerald-700";
  }, [isLocked, item.accessLevel]);

  return (
    <button
      ref={cardRef}
      onClick={() => onOpen?.(item.slug)}
      data-testid={`protocol-card-${item.slug}`}
      className={`group relative w-full overflow-hidden rounded-3xl border border-slate-200/60 bg-white/90 px-5 py-4 text-left shadow-[0_20px_40px_rgba(15,23,42,0.12)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_24px_45px_rgba(15,23,42,0.16)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/60`}
      style={{
        background: `linear-gradient(135deg, ${withAlpha(
          item.accentColor,
          "12"
        )} 0%, ${withAlpha(item.accentColor, "05")} 100%)`,
      }}
    >
      {isLocked && (
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl bg-white/5 backdrop-blur-[1px]"
          aria-hidden
        />
      )}
      {badgeLabel && (
        <span
          className={`pointer-events-none absolute right-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-sm ${badgeClassName}`}
        >
          {badgeLabel}
        </span>
      )}
      <div
        className={`flex items-start gap-3 transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-[0_12px_20px_rgba(15,23,42,0.14)] transition-transform duration-500 group-hover:scale-105"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${withAlpha(
              item.accentColor,
              "2e"
            )} 0%, ${withAlpha(item.accentColor, "18")} 100%)`,
          }}
          aria-hidden
        >
          {item.icon}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="text-base font-semibold leading-tight text-slate-900">
              {highlightedTitle}
            </div>
            {item.version && (
              <span className="rounded-full border border-white/70 bg-white/60 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-500 shadow-sm">
                {item.version}
              </span>
            )}
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-600"
                  style={{
                    backgroundColor: tagBackground,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function highlightText(text: string, query?: string): ReactNode {
  const cleanQuery = query?.trim();
  if (!cleanQuery) {
    return text;
  }

  const escaped = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!escaped) {
    return text;
  }

  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <mark
          key={`${part}-${index}`}
          className="rounded-sm bg-white/80 px-0.5 text-[#2563eb]"
        >
          {part}
        </mark>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function withAlpha(hexColor: string, alphaHex: string) {
  if (!hexColor.startsWith("#")) {
    return hexColor;
  }

  const normalized = hexColor.length === 4 ? expandShortHex(hexColor) : hexColor;
  if (normalized.length !== 7) {
    return normalized;
  }

  return `${normalized}${alphaHex}`;
}

function expandShortHex(hexColor: string) {
  if (hexColor.length !== 4 || !hexColor.startsWith("#")) {
    return hexColor;
  }

  const [r, g, b] = hexColor
    .slice(1)
    .split("")
    .map((char) => `${char}${char}`);

  return `#${r}${g}${b}`;
}
