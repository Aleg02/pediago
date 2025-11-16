"use client";

import { useEffect, useId, useState } from "react";

type DisclaimerProps = {
  className?: string;
};

export default function Disclaimer({ className }: DisclaimerProps) {
  const [showModal, setShowModal] = useState(false);
  const dialogTitleId = useId();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowModal(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className={className}>
      <div
        role="note"
        aria-label="Avertissement"
        className="rounded-2xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-[13px] leading-5 text-slate-700 sm:px-4 sm:py-3 sm:text-sm sm:leading-6"
      >
        <p>
          <span className="font-semibold">⚠️ PediaGo</span> est une aide à la décision et ne remplace pas le jugement clinique.
        </p>
        <p className="mt-2 text-[11px] leading-4 text-slate-500 sm:text-xs sm:leading-5">
          En cas d’urgence, appelez le <span className="font-semibold">15</span> (ou{" "}
          <span className="font-semibold">112</span>).
        </p>
        <button
          type="button"
          className="mt-2 text-[11px] font-semibold text-[#7c3aed] underline underline-offset-2 sm:text-xs"
          onClick={() => setShowModal(true)}
        >
          Lire les CGU
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div
            className="absolute inset-0 bg-slate-900/70"
            aria-hidden="true"
            onClick={() => setShowModal(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 text-left shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mentions légales</p>
                <h2 id={dialogTitleId} className="mt-1 text-2xl font-bold text-slate-900">
                  Conditions Générales d’Utilisation (CGU)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
                aria-label="Fermer la fenêtre"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6l-12 12" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500">Dernière mise à jour : à compléter</p>

            <div className="mt-6 space-y-6 text-sm leading-6 text-slate-700">
              <section>
                <h3 className="font-semibold text-slate-900">1. Objet de l’Application</h3>
                <p className="mt-2">
                  PediaGo est une application d’aide à la décision et de support opérationnel destinée exclusivement aux professionnels de santé habilités à prendre en charge des situations d’urgence pédiatrique. Elle propose des protocoles d’urgence, un affichage structuré des conduites à tenir et un calcul automatisé des dosages basés sur l’âge et/ou le poids.
                </p>
                <p className="mt-2">PediaGo n’est pas un dispositif médical et ne remplace pas le jugement clinique.</p>
              </section>
              <section>
                <h3 className="font-semibold text-slate-900">2. Champ d’application</h3>
                <p className="mt-2">
                  Les présentes CGU s’appliquent à toutes les interfaces éditées par PediaSquare (web, Android, iOS et futures extensions). Toute utilisation implique l’adhésion pleine et entière aux CGU.
                </p>
              </section>
              <section>
                <h3 className="font-semibold text-slate-900">3. Accès et utilisateurs autorisés</h3>
                <p className="mt-2">
                  L’application est réservée aux médecins, infirmiers diplômés d’État, paramédicaux habilités, étudiants en santé sous supervision et à tout personnel formé à l’urgence pédiatrique. Toute utilisation hors de ce cadre engage exclusivement l’utilisateur.
                </p>
              </section>
              <section>
                <h3 className="font-semibold text-slate-900">4. Nature des informations fournies</h3>
                <p className="mt-2">
                  Les contenus proposés sont informatifs, pédagogiques, standardisés et non personnalisés. Ils ne constituent ni prescription médicale, ni avis clinique, ni protocole adapté à un patient spécifique. L’utilisateur doit vérifier la conformité avec les protocoles locaux.
                </p>
              </section>
              <section>
                <h3 className="font-semibold text-slate-900">5. Responsabilité médicale et limites</h3>
                <p className="mt-2">
                  L’Éditeur, les auteurs et les contributeurs ne peuvent être tenus responsables d’erreurs de calcul, d’interprétation ou de données saisies par l’utilisateur. Ce dernier reste entièrement responsable de ses décisions cliniques, de la vérification des doses et du respect des réglementations.
                </p>
              </section>
              <section>
                <h3 className="font-semibold text-slate-900">6. Exactitude et mise à jour</h3>
                <p className="mt-2">
                  Les protocoles sont élaborés à partir de recommandations officielles et de publications scientifiques. PediaSquare ne peut toutefois garantir l’absence d’erreur ou l’actualisation permanente des contenus. L’utilisateur vérifie systématiquement la validité des informations.
                </p>
              </section>
              <section>
                <h3 className="font-semibold text-slate-900">7. Conditions d’accès</h3>
                <p className="mt-2">
                  L’accès peut nécessiter une connexion internet, un équipement compatible et éventuellement la création d’un compte. L’Éditeur n’est pas responsable en cas d’interruption, de maintenance ou de dysfonctionnement technique.
                </p>
              </section>
              <section>
                <h3 className="font-semibold text-slate-900">8. Obligations de l’utilisateur</h3>
                <p className="mt-2">
                  L’utilisateur s’engage à utiliser PediaGo dans un cadre professionnel, à saisir des données exactes, à ne pas détourner l’usage prévu et à respecter l’ensemble des lois en vigueur.
                </p>
              </section>
              <section>
                <h3 className="font-semibold text-slate-900">9. Propriété intellectuelle</h3>
                <p className="mt-2">
                  Les contenus, protocoles, algorithmes, interface et identité PediaGo sont la propriété exclusive de PediaSquare. Toute reproduction ou adaptation sans autorisation est interdite.
                </p>
              </section>
              <section>
                <h3 className="font-semibold text-slate-900">10. Données personnelles</h3>
                <p className="mt-2">
                  Selon les fonctionnalités, l’application peut nécessiter un compte. Les données collectées sont limitées au strict nécessaire et aucune donnée médicale personnelle de patients n’est collectée. La politique de confidentialité détaillée est disponible séparément.
                </p>
              </section>
              <section>
                <h3 className="font-semibold text-slate-900">11. Abonnements et paiements</h3>
                <p className="mt-2">
                  Certaines fonctionnalités peuvent être payantes. Les modalités d’abonnement, de renouvellement ou de résiliation seront précisées dans la section « Mon compte / Abonnement » et l’utilisateur s’engage à un usage personnel et non transférable.
                </p>
              </section>
              <section>
                <h3 className="font-semibold text-slate-900">12. Suspension et résiliation</h3>
                <p className="mt-2">
                  L’Éditeur peut suspendre ou résilier l’accès en cas d’utilisation frauduleuse, de non-respect des CGU ou d’atteinte à la sécurité du service.
                </p>
              </section>
              <section>
                <h3 className="font-semibold text-slate-900">13. Modifications des CGU</h3>
                <p className="mt-2">
                  PediaSquare peut mettre à jour les CGU à tout moment. L’utilisation continue après modification vaut acceptation des nouvelles dispositions.
                </p>
              </section>
              <section>
                <h3 className="font-semibold text-slate-900">14. Droit applicable</h3>
                <p className="mt-2">
                  Les CGU sont régies par le droit français. En cas de litige, seul le tribunal compétent du ressort du siège de PediaSquare est compétent.
                </p>
              </section>
              <section>
                <h3 className="font-semibold text-slate-900">15. Contact</h3>
                <p className="mt-2">
                  Pour toute question relative aux CGU ou à l’application : <a className="font-semibold text-[#2563eb]" href="mailto:contact@pediasquare.com">contact@pediasquare.com</a>.
                </p>
              </section>
              <p className="text-[13px] italic text-slate-600">
                PediaGo est un outil d’aide, non un outil de décision. L’utilisateur reste responsable de son acte de soin.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
