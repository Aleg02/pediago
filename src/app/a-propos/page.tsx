import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos de PediaGo",
  description: "Présentation, objectifs et conditions d'utilisation de PediaGo",
};

const sections = [
  {
    title: "1. Présentation générale",
    content: (
      <>
        <p>
          PediaGo est une application dédiée aux professionnels de santé intervenant en contexte d’urgence pédiatrique. Elle offre
          un accès rapide, structuré et ergonomique aux principaux protocoles d’urgence, avec un calcul automatique des posologies
          fondé sur l’âge et/ou le poids de l’enfant.
        </p>
        <p className="mt-3">
          L’outil a été conçu pour améliorer la réactivité, la sécurité et la standardisation de la prise en charge lors de situations
          critiques où chaque seconde compte. Il s’adresse aux médecins urgentistes, pédiatres, anesthésistes-réanimateurs,
          infirmiers, paramédicaux et à tout personnel habilité.
        </p>
      </>
    ),
  },
  {
    title: "2. Objectifs de l’application",
    content: (
      <ul className="list-disc space-y-2 pl-6">
        <li>Faciliter l’accès immédiat aux protocoles d’urgence pédiatrique sur mobile.</li>
        <li>Réduire le risque d’erreurs de calcul concernant les posologies dépendantes du poids ou de l’âge.</li>
        <li>Standardiser les pratiques grâce aux recommandations officielles en vigueur.</li>
        <li>Offrir un support opérationnel utilisable pendant l’action ou en préparation.</li>
        <li>Garantir une expérience fluide même en environnement clinique difficile.</li>
      </ul>
    ),
  },
  {
    title: "3. Fonctionnement",
    content: (
      <ul className="list-disc space-y-2 pl-6">
        <li>Sélection rapide de l’âge ou du poids.</li>
        <li>Accès instantané aux protocoles pertinents.</li>
        <li>Calcul automatisé des doses et volumes selon les référentiels disponibles.</li>
        <li>Structuration en blocs adaptés aux situations d’urgence.</li>
      </ul>
    ),
  },
  {
    title: "4. Atouts de PediaGo",
    content: (
      <ul className="list-disc space-y-2 pl-6">
        <li>Interface pensée par et pour les cliniciens.</li>
        <li>Lisibilité optimisée sur mobile.</li>
        <li>Mises à jour régulières des protocoles.</li>
        <li>Simplicité d’usage sans navigation complexe.</li>
        <li>Ergonomie d’urgence (codes couleur, blocs logiques, dosage automatique).</li>
        <li>Accès hors connexion (selon les évolutions futures de l’architecture).</li>
      </ul>
    ),
  },
  {
    title: "5. Limites d’utilisation",
    content: (
      <>
        <p>PediaGo est un outil d’aide et ne remplace jamais :</p>
        <ul className="mt-2 list-disc space-y-2 pl-6">
          <li>le jugement clinique ;</li>
          <li>l’expertise médicale ;</li>
          <li>les protocoles internes à l’établissement ;</li>
          <li>la responsabilité du professionnel de santé.</li>
        </ul>
      </>
    ),
  },
  {
    title: "6. Disclaimer — Limitation de responsabilité",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-slate-900">6.1 Absence de responsabilité médicale</h4>
          <p className="mt-2">
            PediaGo ne fournit ni avis médical, ni diagnostic, ni prise en charge personnalisée. L’application ne se substitue pas
            à une décision clinique prise par un professionnel compétent.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">6.2 Exactitude des données</h4>
          <p className="mt-2">
            Malgré la rigueur rédactionnelle, PediaGo ne peut garantir l’exhaustivité, l’absence d’erreur ou l’actualisation
            permanente des informations. Le professionnel reste responsable de l’interprétation, de la vérification des posologies,
            de la conformité aux protocoles internes et de la décision thérapeutique finale.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">6.3 Usage réservé aux professionnels</h4>
          <p className="mt-2">
            L’application est destinée exclusivement à des utilisateurs qualifiés, formés et habilités. Toute utilisation en dehors
            de ce cadre engage l’utilisateur, pas PediaGo.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">6.4 Limites techniques</h4>
          <p className="mt-2">
            PediaGo ne pourra être tenue responsable en cas de dysfonctionnement technique, d’absence de réseau, de données erronées
            saisies par l’utilisateur ou de tout incident résultant d’un usage inapproprié.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">6.5 Absence de responsabilité légale</h4>
          <p className="mt-2">
            En utilisant PediaGo, vous acceptez que l’équipe ne puisse être tenue responsable des conséquences directes ou indirectes
            liées à l’utilisation de l’application. L’utilisateur reste seul responsable de ses actes médicaux.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "7. Engagement qualité",
    content: (
      <ul className="list-disc space-y-2 pl-6">
        <li>Amélioration continue de l’ergonomie.</li>
        <li>Veille scientifique régulière.</li>
        <li>Mises à jour des contenus selon les recommandations accessibles.</li>
      </ul>
    ),
  },
  {
    title: "8. Contact",
    content: (
      <p>
        Pour toute remarque, correction ou suggestion :
        <a className="ml-1 font-semibold text-[#2563eb]" href="mailto:contact@pediago.app">
          contact@pediago.app
        </a>
      </p>
    ),
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="h-1 w-full bg-gradient-to-r from-[#8b5cf6] via-[#3b82f6] to-[#22c55e]" />
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <Link href="/" className="text-sm font-medium text-[#2563eb] underline">
          ← Retour à l’accueil
        </Link>
        <header className="mt-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">PediaGo</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">À propos de PediaGo</h1>
          <p className="text-base text-slate-600">Présentation, objectifs et conditions d’utilisation.</p>
        </header>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.title} className="space-y-4 rounded-3xl border border-slate-100 bg-slate-50/50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
              <div className="text-sm leading-6 text-slate-700">{section.content}</div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
