"use client";

import Link from "next/link";

type PremiumAccessDialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string | null;
};

export default function PremiumAccessDialog({ open, onClose, title }: PremiumAccessDialogProps) {
  if (!open) {
    return null;
  }

  const headingId = "premium-access-heading";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/60" aria-hidden onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-slate-900/30"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-slate-200 p-1 text-slate-500 transition hover:text-slate-900"
          aria-label="Fermer la fenêtre"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" fill="none" strokeWidth={1.8}>
            <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
          </svg>
        </button>
        <div className="flex flex-col gap-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl">🔒</div>
          <div>
            <p id={headingId} className="text-lg font-semibold text-slate-900">
              Accès réservé aux abonnés
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {title ? (
                <>
                  La fiche <span className="font-semibold">{title}</span> est réservée aux abonnés PediaGo+.
                </>
              ) : (
                "Connectez-vous ou créez un compte pour débloquer les fiches premium PediaGo+."
              )}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-300"
              onClick={onClose}
            >
              Se connecter
            </Link>
            <Link
              href="/mon-compte"
              className="flex-1 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={onClose}
            >
              Découvrir les formules
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

