"use client";
import type { Protocol } from "@/data/protocols";

type Props = {
  item: Protocol;
  onOpen?: (slug: string) => void;
};

export default function ProtocolCard({ item, onOpen }: Props) {
  return (
    <button
      onClick={() => onOpen?.(item.slug)}
      className="w-full text-left rounded-2xl bg-white border border-black/10 shadow-sm px-4 py-3 hover:border-black/20 active:scale-[0.99] transition"
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">{item.title}</div>
        {item.version && (
          <span className="text-xs text-slate-500 border border-black/10 rounded-full px-2 py-0.5">
            {item.version}
          </span>
        )}
      </div>
      {item.tags && item.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <span key={t} className="text-xs text-slate-600 bg-slate-100 rounded-full px-2 py-0.5">
              {t}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
