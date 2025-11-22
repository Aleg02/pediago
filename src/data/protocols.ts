// src/data/protocols.ts
export type Protocol = {
  slug: string;
  title: string;
  version?: string;
  tags?: string[];
  icon: string;
  accentColor: string;
  accessLevel: "free" | "premium";
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
    accessLevel: "free",
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
    accessLevel: "free",
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
    accessLevel: "free",
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
    slug: "acidocetose-diabetique",
    title: "Acidocétose diabétique de l'enfant",
    version: "V1.0",
    tags: ["metabolique", "urgence"],
    icon: "🧪",
    accentColor: "#f43f5e",
    accessLevel: "free",
    sources: [
      { label: "HAS – Diabète", url: "https://www.has-sante.fr" },
      { label: "Société Française de Pédiatrie", url: "https://www.sfpediatrie.com" },
      { label: "ISPAD Clinical Practice Guidelines 2022", url: "https://www.ispad.org" },
      { label: "NICE – Diabetic ketoacidosis", url: "https://www.nice.org.uk/guidance/ng18" },
      { label: "AAP – Diabetes Guidelines", url: "https://publications.aap.org" },
    ],
  },
  {
    slug: "laryngite-aigue",
    title: "Laryngite aiguë (Croup)",
    version: "V0.1",
    tags: ["respiratoire", "urgence"],
    icon: "🌬️",
    accentColor: "#3b82f6",
    accessLevel: "free",
    sources: [
      { label: "HAS – Laryngite aiguë de l'enfant", url: "https://www.has-sante.fr" },
      {
        label: "Société Française de Pédiatrie – Recommandations laryngite",
        url: "https://www.sfpediatrie.com",
      },
      { label: "SPLF – Urgences respiratoires", url: "https://splf.fr" },
      { label: "NICE – Croup: assessment and management", url: "https://www.nice.org.uk/guidance/ng9" },
      {
        label: "American Academy of Pediatrics – Croup Clinical Report",
        url: "https://publications.aap.org",
      },
    ],
  },
  {
    slug: "inhalation-fumees-co",
    title: "Inhalation de fumées / intoxication CO",
    version: "V0.1",
    tags: ["respiratoire", "toxicologie", "urgence"],
    icon: "🔥",
    accentColor: "#f97316",
    accessLevel: "free",
    sources: [
      {
        label: "Ministère de la Santé – Intoxication au CO",
        url: "https://solidarites-sante.gouv.fr/sante-et-environnement/intoxications-au-monoxyde-de-carbone/",
      },
      { label: "SFAR–SFMU – Recommandations brûlés (2019)", url: "https://www.sfmu.org/upload/consensus/rpp_brule_2019.pdf" },
      { label: "HAS – Cyanures (2017)", url: "https://www.has-sante.fr/upload/docs/application/pdf/2017-07/fiche_diagnostic_cyanure.pdf" },
      { label: "CDC – Carbon Monoxide Poisoning (2024)", url: "https://www.cdc.gov/co" },
      { label: "AAP – Pediatric CO Poisoning (2023)", url: "https://www.aap.org/en/patient-care/environmental-health/" },
      { label: "SPLF – Fiches inhalation fumées / CO", url: "https://splf.fr" },
    ],
  },
  {
    slug: "noyade-submersion",
    title: "Noyade / Submersion",
    version: "V0.1",
    tags: ["respiratoire", "urgence"],
    icon: "🌊",
    accentColor: "#0284c7",
    accessLevel: "free",
    sources: [
      { label: "HAS – Urgences pédiatriques", url: "https://www.has-sante.fr" },
      { label: "Société Française de Pédiatrie – Recommandations noyade", url: "https://www.sfpediatrie.com" },
      { label: "SPLF – Urgences respiratoires", url: "https://splf.fr" },
      { label: "European Resuscitation Council 2021", url: "https://www.cprguidelines.eu" },
      { label: "American Academy of Pediatrics – Drowning", url: "https://publications.aap.org" },
    ],
  },
  {
    slug: "pneumopathie-communautaire-bacterienne",
    title: "Pneumopathie communautaire bactérienne",
    version: "V0.1",
    tags: ["respiratoire", "infectieux"],
    icon: "🫁",
    accentColor: "#0ea5e9",
    accessLevel: "free",
    sources: [
      { label: "HAS – Pneumopathie aiguë", url: "https://www.has-sante.fr" },
      { label: "Société Française de Pédiatrie", url: "https://www.sfpediatrie.com" },
      { label: "SPLF – Infections respiratoires", url: "https://splf.fr" },
      { label: "NICE – Pneumonia (NG138)", url: "https://www.nice.org.uk/guidance/ng138" },
      { label: "AAP – Community-Acquired Pneumonia", url: "https://publications.aap.org" },
    ],
  },
  {
    slug: "pneumopathie-atypique-mycoplasma",
    title: "Pneumopathie atypique (Mycoplasma)",
    version: "V0.1",
    tags: ["respiratoire", "infectieux"],
    icon: "🧬",
    accentColor: "#2563eb",
    accessLevel: "free",
    sources: [
      { label: "HAS – Infections respiratoires", url: "https://www.has-sante.fr" },
      { label: "Société Française de Pédiatrie", url: "https://www.sfpediatrie.com" },
      { label: "SPLF – Pneumonies atypiques", url: "https://splf.fr" },
      { label: "NICE – Atypical Pneumonia (NG138)", url: "https://www.nice.org.uk/guidance/ng138" },
      { label: "AAP – Mycoplasma pneumoniae", url: "https://publications.aap.org" },
    ],
  },
  {
    slug: "meningite-bacterienne-purulente",
    title: "Méningite bactérienne purulente",
    version: "V0.1",
    tags: ["infectieux", "urgence"],
    icon: "🧠",
    accentColor: "#8b5cf6",
    accessLevel: "free",
    sources: [
      { label: "HAS – Méningites bactériennes", url: "https://www.has-sante.fr" },
      { label: "Société Française de Pédiatrie", url: "https://www.sfpediatrie.com" },
      { label: "RéPias – Infections invasives", url: "https://www.preventioninfection.fr" },
      { label: "SPLF – Urgences respiratoires", url: "https://splf.fr" },
      { label: "NICE – Meningitis (NG143)", url: "https://www.nice.org.uk/guidance/ng143" },
      { label: "AAP – Bacterial Meningitis", url: "https://publications.aap.org" },
    ],
  },
  {
    slug: "meningo-encephalite-aigue",
    title: "Méningo-encéphalite aiguë (enfant)",
    version: "V0.1",
    tags: ["infectieux", "neuro", "urgence"],
    icon: "🧠",
    accentColor: "#0f172a",
    accessLevel: "free",
    sources: [
      { label: "HAS – Méningites bactériennes (2021)", url: "https://www.has-sante.fr" },
      { label: "SPILF – Recommandations infectiologie pédiatrique (2022)", url: "https://www.infectiologie.com" },
      { label: "IDSA – Bacterial Meningitis Guidelines (2018)", url: "https://www.idsociety.org" },
      { label: "AAP – CNS infections (2021)", url: "https://publications.aap.org" },
      { label: "NICE – CNS infections (2022)", url: "https://www.nice.org.uk/guidance" },
    ],
  },
  {
    slug: "fievre-nourrisson-moins-3-mois",
    title: "Fièvre du nourrisson < 3 mois",
    version: "V0.1",
    tags: ["infectieux", "urgence"],
    icon: "🍼",
    accentColor: "#6d28d9",
    accessLevel: "free",
    sources: [
      { label: "HAS – Infections néonatales et nourrisson fébrile", url: "https://www.has-sante.fr" },
      { label: "AAP Clinical Practice Guideline 2021", url: "https://publications.aap.org" },
      { label: "NICE Fever Under 5s (2021)", url: "https://www.nice.org.uk/guidance/ng143" },
      { label: "HAS – Infections néonatales précoces (2020)", url: "https://www.has-sante.fr/jcms/p_3237281/fr/infections-neonatales-bacteriennes" },
      { label: "Société Française de Pédiatrie / Néonatalogie", url: "https://www.societe-neonatalogie.fr" },
      { label: "CDC Neonatal Sepsis", url: "https://www.cdc.gov/sepsis" },
    ],
  },
  {
    slug: "fievre-sepsis-purpura",
    title: "Fièvre sévère / Sepsis / Purpura fulminans",
    version: "V0.1",
    tags: ["infectieux", "urgence"],
    icon: "🌡️",
    accentColor: "#db2777",
    accessLevel: "free",
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
    slug: "sepsis-neonatal-precoce",
    title: "Sepsis néonatal précoce (≤ 72 h)",
    version: "V0.1",
    tags: ["infectieux", "neonat"],
    icon: "🍼",
    accentColor: "#0ea5e9",
    accessLevel: "free",
    sources: [
      {
        label: "HAS – Infections néonatales bactériennes précoces (2020)",
        url: "https://www.has-sante.fr/jcms/p_3237281/fr/infections-neonatales-bacteriennes",
      },
      {
        label: "Société Française de Néonatalogie – Recommandations SNP (2021)",
        url: "https://www.societe-neonatalogie.fr/",
      },
      { label: "AAP – Early Onset Sepsis (2018, MAJ 2023)", url: "https://publications.aap.org" },
      { label: "NICE NG195 – Sepsis néonatal (2021)", url: "https://www.nice.org.uk/guidance/ng195" },
      {
        label: "CDC – Group B Streptococcus neonatal guidelines (2024)",
        url: "https://www.cdc.gov/groupbstrep/index.html",
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
    accessLevel: "free",
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
    slug: "tachycardie-supraventriculaire",
    title: "Tachycardie supraventriculaire (TSV)",
    version: "V0.1",
    tags: ["cardio", "rythme"],
    icon: "💗",
    accentColor: "#ec4899",
    accessLevel: "free",
    sources: [
      { label: "HAS – Urgences pédiatriques : tachycardies supraventriculaires", url: "https://www.has-sante.fr" },
      { label: "Société Française de Pédiatrie", url: "https://www.sfpediatrie.com" },
      { label: "Société Française de Cardiologie", url: "https://www.sfcardio.fr" },
      { label: "AHA/PALS Tachycardia Algorithm", url: "https://cpr.heart.org" },
      { label: "NICE – Supraventricular Tachycardia", url: "https://www.nice.org.uk" },
    ],
  },
  {
    slug: "choc-hemorragique",
    title: "Choc hémorragique (enfant)",
    version: "V0.1",
    tags: ["hémorragie"],
    icon: "🩸",
    accentColor: "#f97316",
    accessLevel: "free",
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
    accessLevel: "free",
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
    accessLevel: "premium",
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
    accessLevel: "free",
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
    accessLevel: "free",
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
    slug: "bronchospasme-nourrisson",
    title: "Bronchospasme du nourrisson (hors asthme)",
    version: "V0.1",
    tags: ["respiratoire", "urgence"],
    icon: "🫁",
    accentColor: "#06b6d4",
    accessLevel: "free",
    sources: [
      { label: "HAS – Bronchiolite / bronchospasme du nourrisson", url: "https://www.has-sante.fr" },
      { label: "Société Française de Pédiatrie – Recommandations urgences respiratoires", url: "https://www.sfpediatrie.com" },
      { label: "SPLF – Obstruction aiguë des voies aériennes", url: "https://splf.fr" },
      { label: "NICE – Bronchiolitis in children (NG9)", url: "https://www.nice.org.uk/guidance/ng9" },
      { label: "AAP – Bronchiolitis Clinical Report", url: "https://publications.aap.org" },
    ],
  },
  {
    slug: "traumatisme-cranien",
    title: "Traumatisme crânien (enfant)",
    version: "V0.1",
    tags: ["trauma", "neuro"],
    icon: "🧠",
    accentColor: "#3b82f6",
    accessLevel: "free",
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
  {
    slug: "traumatisme-thoraco-abdominal-fast",
    title: "Traumatisme thoraco-abdominal grave – FAST",
    version: "V1.0",
    tags: ["trauma", "urgence"],
    icon: "🛡️",
    accentColor: "#dc2626",
    accessLevel: "free",
    sources: [
      { label: "HAS – Trauma pédiatrique", url: "https://www.has-sante.fr" },
      { label: "Société Française de Pédiatrie", url: "https://www.sfpediatrie.com" },
      { label: "SFAR – Trauma et réanimation", url: "https://sfar.org" },
      { label: "NICE – Trauma Guidelines", url: "https://www.nice.org.uk" },
      { label: "ATLS Pédiatrique – American College of Surgeons", url: "https://www.facs.org" },
    ],
  },
  {
    slug: "plaie-penetrante-thoraco-abdominale",
    title: "Plaie pénétrante thoracique ou abdominale – enfant",
    version: "V1.0",
    tags: ["trauma", "urgence"],
    icon: "🗡️",
    accentColor: "#dc2626",
    accessLevel: "free",
    sources: [
      { label: "SFMU/SFAR – Traumatisme grave (2019)", url: "https://www.sfmu.org/upload/consensus/rpp_traumatisme_grave.pdf" },
      { label: "ATLS Pediatric Trauma (AAP 2022)", url: "https://www.aap.org" },
      { label: "NICE – Injury Guidance (2023)", url: "https://www.nice.org.uk" },
      { label: "HAS – Urgences pédiatriques", url: "https://www.has-sante.fr" },
    ],
  },
  {
    slug: "traumatisme-thoracique-pediatrique",
    title: "Traumatisme thoracique pédiatrique",
    version: "V1.0",
    tags: ["trauma", "respiratoire", "urgence"],
    icon: "🫁",
    accentColor: "#2563eb",
    accessLevel: "free",
    sources: [
      {
        label: "SFAR/SFMU – Traumatisme thoracique (2016–2019)",
        url: "https://www.sfmu.org/upload/consensus/rpp_traumatisme_grave.pdf",
      },
      { label: "HAS – Traumatisme de l’enfant", url: "https://www.has-sante.fr" },
      { label: "SPLF – Traumatisme thoracique (2023)", url: "https://splf.fr" },
      { label: "NICE – Thoracic trauma (2023)", url: "https://www.nice.org.uk/guidance/" },
      { label: "ATLS Pediatric Trauma (AAP 2022)", url: "https://www.aap.org" },
    ],
  },
  {
    slug: "traumatisme-rachis-cervical",
    title: "Traumatisme du rachis cervical – enfant",
    version: "V1.0",
    tags: ["trauma", "neuro", "urgence"],
    icon: "🦴",
    accentColor: "#6b7280",
    accessLevel: "free",
    sources: [
      { label: "HAS – Traumatisme de l’enfant (2024)", url: "https://www.has-sante.fr" },
      {
        label: "SFMU/SFAR – Traumatisme grave (2019)",
        url: "https://www.sfmu.org/upload/consensus/rpp_traumatisme_grave.pdf",
      },
      { label: "PECARN – Cervical Spine Rule (2019)", url: "https://pecarn.org" },
      { label: "NICE – Cervical Spine Injury NG41 (2023)", url: "https://www.nice.org.uk/guidance/ng41" },
      { label: "AAP – Pediatric Cervical Spine Trauma (2022)", url: "https://www.aap.org" },
    ],
  },
  {
    slug: "polytraumatisme-pediatrique",
    title: "Polytraumatisme pédiatrique",
    version: "V1.0",
    tags: ["trauma", "urgence"],
    icon: "🚑",
    accentColor: "#ef4444",
    accessLevel: "free",
    sources: [
      { label: "HAS – Urgences pédiatriques", url: "https://www.has-sante.fr" },
      { label: "Société Française de Pédiatrie", url: "https://www.sfpediatrie.com" },
      { label: "SFAR – Trauma", url: "https://sfar.org" },
      { label: "ATLS pédiatrique – American College of Surgeons", url: "https://www.facs.org" },
      { label: "NICE Trauma Guidelines", url: "https://www.nice.org.uk" },
    ],
  },
  {
    slug: "brulures-thermiques-etendues",
    title: "Brûlures thermiques étendues (≥ 10 % SCB) – enfant",
    version: "V1.0",
    tags: ["trauma", "urgence"],
    icon: "🔥",
    accentColor: "#f97316",
    accessLevel: "free",
    sources: [
      {
        label: "GFRUP / Société Française de Pédiatrie – Brûlure de l'enfant : prise en charge préhospitalière (2014)",
        url: "https://gfrup.sfpediatrie.com",
      },
      {
        label: "SFAR / SFMU / CTB – Prise en charge du brûlé grave (2019)",
        url: "https://www.sfmu.org",
      },
      {
        label: "Fiches CTB – Urgences-lecongrès.org (2023)",
        url: "https://urgences-lecongres.org",
      },
      {
        label: "Hôpitaux Universitaires de Genève – Prise en charge des brûlures (2024)",
        url: "https://www.hug.ch",
      },
      {
        label: "HAS – Prise en charge de la douleur chez l'enfant (2016)",
        url: "https://www.has-sante.fr",
      },
    ],
  },
  {
    slug: "brulures-chimiques-pediatriques",
    title: "Brûlures chimiques pédiatriques – urgence cutanée/oculaire",
    version: "V1.0",
    tags: ["trauma", "urgence"],
    icon: "🧪",
    accentColor: "#10b981",
    accessLevel: "free",
    sources: [
      { label: "ameli.fr – Brûlures de la peau (2025)", url: "https://www.ameli.fr" },
      { label: "MSD Manuals – Brûlures chimiques (2024)", url: "https://www.msdmanuals.com" },
      { label: "Securimed – Décontamination des brûlures chimiques (2025)", url: "https://www.securimed.fr" },
      { label: "SFAR/SFMU – Prise en charge du brûlé grave (2019)", url: "https://www.sfmu.org" },
    ],
  },
];
