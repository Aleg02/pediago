import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support / Contact",
  description: "Remonter un bug, signaler une erreur ou demander une amélioration",
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="h-1 w-full bg-gradient-to-r from-[#8b5cf6] via-[#3b82f6] to-[#22c55e]" />
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <Link href="/" className="text-sm font-medium text-[#2563eb] underline">
          ← Retour à l’accueil
        </Link>
        <header className="mt-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">PediaGo</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Support / Contact</h1>
          <p className="text-base text-slate-600">
            Signalez un bug, une erreur médicale ou proposez une amélioration directement à l’équipe.
          </p>
        </header>

        <section className="mt-10 rounded-3xl border border-slate-100 bg-slate-50/70 p-6">
          <h2 className="text-xl font-semibold text-slate-900">Nous écrire</h2>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            Remontez un bug, signalez une erreur médicale ou partagez vos idées d’amélioration en nous écrivant sur {" "}
            <a className="font-semibold text-[#2563eb]" href="mailto:contact@pediago.app">
              contact@pediago.app
            </a>
            . Chaque message est lu par l’équipe produit afin d’améliorer continuellement PediaGo.
          </p>
        </section>
      </div>
    </main>
  );
}
