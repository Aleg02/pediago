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
        className="rounded-2xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-[13px] leading-5 text-slate-700 sm:px-4 sm:py-3 sm:text-sm sm:leading-6"
      >
        <p className="mb-1 font-medium">⚠️ Avertissement </p>
        <p>
          <span className="font-semibold">PediaGo</span> est une aide à la décision et ne remplace
          pas le jugement clinique.
        </p>
        <p className="mt-2 text-[11px] leading-4 text-slate-500 sm:text-xs sm:leading-5">
          En cas d’urgence, appelez le <span className="font-semibold">15</span> (ou{" "}
          <span className="font-semibold">112</span>).
        </p>
      </div>
    </div>
  );
}
