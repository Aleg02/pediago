"use client";

type DisclaimerProps = {
  className?: string;
};

export default function Disclaimer({ className }: DisclaimerProps) {
  return (
    <div className={className}>
      <div
        role="note"
        aria-label="Avertissement"
        className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-slate-700"
      >
        <p className="mb-1 font-medium">⚠️ Avertissement </p>
        <p>
          <span className="font-semibold">PediaGo</span> est une aide à la décision et ne remplace
          pas le jugement clinique.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          En cas d’urgence, appelez le <span className="font-semibold">15</span> (ou{" "}
          <span className="font-semibold">112</span>).
        </p>
      </div>
    </div>
  );
}
