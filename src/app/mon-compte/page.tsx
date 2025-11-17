import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mon compte / Abonnement",
  description: "Informations à venir concernant l'abonnement PediaGo",
};

type AccountPageProps = {
  searchParams?: {
    reason?: string;
    slug?: string;
  };
};

export default function AccountPage({ searchParams }: AccountPageProps) {
  const reason = searchParams?.reason;
  const redirectedSlug = searchParams?.slug;
  const showPremiumNotice = reason === "premium";

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="h-1 w-full bg-gradient-to-r from-[#8b5cf6] via-[#3b82f6] to-[#22c55e]" />
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <Link href="/" className="text-sm font-medium text-[#2563eb] underline">
          ← Retour à l’accueil
        </Link>
        <header className="mt-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">PediaGo</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mon compte / Abonnement</h1>
          <p className="text-base text-slate-600">
            Centralisation des informations liées à l’abonnement professionnel et aux licences.
          </p>
        </header>

        {showPremiumNotice && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-900">
            <p className="font-semibold">Abonnement requis pour cette fiche premium.</p>
            <p className="mt-1">
              {redirectedSlug
                ? `Pour consulter la fiche « ${redirectedSlug} », connectez-vous avec un compte abonné ou souscrivez à PediaGo+.`
                : "Connectez-vous avec un compte abonné ou souscrivez à PediaGo+ pour débloquer les fiches premium."}
            </p>
          </div>
        )}

        <section className="mt-10 rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center text-slate-600">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Bientôt disponible</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Espace abonnement</h2>
          <p className="mt-4 text-sm leading-6">
            Les détails sur les formules, la gestion des licences, la facturation et les renouvellements seront publiés ici.
            L’équipe travaille actuellement sur les parcours d’inscription et de souscription.
          </p>
          <p className="mt-4 text-sm">
            Une question ? Contactez-nous sur {" "}
            <a className="font-semibold text-[#2563eb]" href="mailto:contact@pediago.app">
              contact@pediago.app
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
