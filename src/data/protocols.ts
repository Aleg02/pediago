// src/data/protocols.ts
export type Protocol = {
  slug: string;
  title: string;
  version?: string;
  tags?: string[];
  icon: string;
  accentColor: string;
  sources?: { label: string; url?: string }[];
};

export const PROTOCOLS: Protocol[] = [
  {
    slug: "eme",
    title: "État de mal épileptique (EME)",
    version: "V0.1",
    tags: ["neuro", "urgence"],
    icon: "⚡️",
    accentColor: "#6366f1",
    sources: [
      {
        label: "HAS – Prise en charge des crises convulsives prolongées de l'enfant (2016)",
        url: "https://www.has-sante.fr/jcms/c_2724683",
      },
      {
        label: "SFNP – Recommandations sur l'état de mal épileptique pédiatrique (2022)",
        url: "https://www.societe-neurologie-pediatrique.com/",
      },
    ],
  },
  {
    slug: "convulsion-febrile-simple",
    title: "Convulsion fébrile simple (CFS)",
    version: "V0.1",
    tags: ["neuro", "urgence"],
    icon: "🌡️",
    accentColor: "#9333ea",
    sources: [
      {
        label: "HAS – Convulsions fébriles de l'enfant",
        url: "https://www.has-sante.fr",
      },
      {
        label: "Société Française de Pédiatrie – Recommandations CFS",
        url: "https://www.sfpediatrie.com",
      },
      {
        label: "AAP – Febrile Seizures Clinical Report (2021)",
        url: "https://publications.aap.org",
      },
      {
        label: "NICE – Fever in under 5s",
        url: "https://www.nice.org.uk/guidance",
      },
    ],
  },
  {
    slug: "hypoglycemie",
    title: "Hypoglycémie du nourrisson & de l'enfant",
    version: "V0.1",
    tags: ["metabolique", "urgence"],
    icon: "🍬",
    accentColor: "#0ea5e9",
    sources: [
      {
        label: "HAS – Urgences pédiatriques : hypoglycémie",
        url: "https://www.has-sante.fr",
      },
      {
        label: "Société Française de Pédiatrie – Recommandations hypoglycémie",
        url: "https://www.sfpediatrie.com",
      },
      {
        label: "NICE – Hypoglycaemia in children",
        url: "https://www.nice.org.uk",
      },
      {
        label: "Annales d'Endocrinologie – Guidelines hypoglycémie pédiatrique (2021)",
      },
    ],
  },
  {
    slug: "fievre-sepsis-purpura",
    title: "Fièvre sévère / Sepsis / Purpura fulminans",
    version: "V0.1",
    tags: ["infectieux", "urgence"],
    icon: "🌡️",
    accentColor: "#db2777",
    sources: [
      {
        label: "HAS – Sepsis (2025)",
        url: "https://www.has-sante.fr/jcms/p_3587144/",
      },
      {
        label: "HCSP – Conduite à tenir devant un purpura fulminans",
        url: "https://sante.gouv.fr/IMG/html/Avis_du_CSHPF_du_10_mars_2000_sur_la_conduite_immediate_a_tenir_en_cas_de_suspicion_clinique_de_purpura_fulminans_et_sur_la_definition_des_cas_de_meningite_a_meningocoque_et_de_meningoc.html",
      },
      {
        label: "Société Française de Pédiatrie – Sepsis pédiatrique",
        url: "https://www.sfpediatrie.com/sites/www.sfpediatrie.com/files/medias/documents/Presentation%20sepsis%20enfant%20CGL%2016.09.25.pdf",
      },
      {
        label: "RéPias / Surviving Sepsis Campaign – Pediatrics",
        url: "https://pubmed.ncbi.nlm.nih.gov/36328442",
      },
      {
        label: "Santé Publique France – Purpura fulminans & Méningocoque",
        url: "https://www.santepubliquefrance.fr",
      },
    ],
  },
  {
    slug: "acr-enfant",
    title: "Arrêt cardiorespiratoire (enfant)",
    version: "V0.1",
    tags: ["réa"],
    icon: "❤️‍🩹",
    accentColor: "#ef4444",
    sources: [
      {
        label: "European Resuscitation Council – Pediatric Life Support Guidelines (2021)",
        url: "https://cprguidelines.eu/",
      },
      {
        label: "American Heart Association – Pediatric Advanced Life Support (2020)",
        url: "https://cpr.heart.org/",
      },
    ],
  },
  {
    slug: "choc-hemorragique",
    title: "Choc hémorragique (enfant)",
    version: "V0.1",
    tags: ["hémorragie"],
    icon: "🩸",
    accentColor: "#f97316",
    sources: [
      {
        label: "SFAR – Prise en charge du choc hémorragique sévère (2019)",
        url: "https://sfar.org/pratiques-reanimation/choc-hemorragique/",
      },
      {
        label: "ATLS – Advanced Trauma Life Support 10e édition (section pédiatrique)",
        url: "https://www.facs.org/quality-programs/trauma/atls/",
      },
    ],
  },
  {
    slug: "anaphylaxie",
    title: "Anaphylaxie (enfant)",
    version: "V0.1",
    tags: ["allergie"],
    icon: "🌿",
    accentColor: "#22c55e",
    sources: [
      {
        label: "HAS – Diagnostic et prise en charge de l'anaphylaxie (2021)",
        url: "https://www.has-sante.fr/jcms/c_2789769",
      },
      {
        label: "EAACI – Anaphylaxis Guidelines Update (2021)",
        url: "https://www.eaaci.org/resources/guidelines",
      },
    ],
  },
  {
    slug: "aag",
    title: "Asthme aigu grave (AAG)",
    version: "V0.1",
    tags: ["respiratoire"],
    icon: "💨",
    accentColor: "#0ea5e9",
    sources: [
      {
        label: "Groupe de Pneumologie Pédiatrique – Asthme aigu grave (2020)",
        url: "https://www.sfpediatrie.com/",
      },
      {
        label: "GINA – Global Strategy for Asthma Management (section pédiatrique 2023)",
        url: "https://ginasthma.org/",
      },
    ],
  },
  {
    slug: "antalgiques",
    title: "Antalgiques (pédiatrie)",
    version: "V0.1",
    tags: ["douleur"],
    icon: "💊",
    accentColor: "#f59e0b",
    sources: [
      {
        label: "SFETD – Douleur de l'enfant : protocoles antalgiques (2022)",
        url: "https://www.sfetd-douleur.org/",
      },
      {
        label: "OMS – Lignes directrices sur la douleur aiguë chez l'enfant (2012)",
        url: "https://www.who.int/publications/i/item/9789241548120",
      },
    ],
  },
  {
    slug: "bronchiolite",
    title: "Bronchiolite aiguë du nourrisson (< 12 mois)",
    version: "V0.1",
    tags: ["respiratoire", "nourrisson"],
    icon: "👶",
    accentColor: "#0ea5e9",
    sources: [
      {
        label:
          "HAS – Prise en charge du 1er épisode de bronchiolite aiguë chez le nourrisson de moins de 12 mois (2019)",
        url: "https://www.has-sante.fr/jcms/p_3118113",
      },
      {
        label: "HAS – Texte complet des recommandations bronchiolite (PDF)",
        url: "https://www.has-sante.fr/upload/docs/application/pdf/2019-11/hascnpp_bronchiolite_texte_recommandations_2019.pdf",
      },
      {
        label: "HAS – Fiches outils évaluation et conseils parents",
        url: "https://www.has-sante.fr/jcms/p_3118175",
      },
      {
        label: "NICE Guideline NG9 – Bronchiolitis in children",
        url: "https://www.nice.org.uk/guidance/ng9",
      },
      {
        label: "AAP – Clinical Practice Guideline: Bronchiolitis (2014)",
        url: "https://pubmed.ncbi.nlm.nih.gov/25349312/",
      },
      {
        label: "VIDAL – Bronchiolite aiguë du nourrisson (2024)",
        url: "https://www.vidal.fr/maladies/recommandations/bronchiolite-aigue-du-nourrisson-4058.html",
      },
      {
        label: "Société Française de Pédiatrie – Bronchiolite / stratégie de prévention VRS",
        url: "https://www.sfpediatrie.com/",
      },
    ],
  },
  {
    slug: "traumatisme-cranien",
    title: "Traumatisme crânien (enfant)",
    version: "V0.1",
    tags: ["trauma", "neuro"],
    icon: "🧠",
    accentColor: "#3b82f6",
    sources: [
      {
        label: "HAS – Traumatisme crânien léger",
        url: "https://www.has-sante.fr/jcms/p_3225285/fr/traumatismes-craniens-legers",
      },
      {
        label: "SFP – Urgences pédiatriques",
        url: "https://www.sfpediatrie.com",
      },
      {
        label: "PECARN – Kuppermann 2009",
        url: "https://www.nejm.org/doi/full/10.1056/NEJMoa080457",
      },
      {
        label: "NICE – Head Injury Guidelines",
        url: "https://www.nice.org.uk/guidance/cg176",
      },
      {
        label: "American Academy of Pediatrics",
        url: "https://publications.aap.org",
      },
    ],
  },
];
