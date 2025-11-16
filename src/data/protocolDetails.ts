// Contenu résumé (sections + puces). Tu pourras enrichir au fur et à mesure.
export type ProtocolSection = { title: string; bullets: string[] };
export const PROTOCOL_DETAILS: Record<string, ProtocolSection[]> = {
  "anaphylaxie": [
    { title: "Priorités", bullets: [
      "O2, scope, VVP, ECG",
      "Position demi-assise si détresse respi, Trendelenburg si hypotension",
      "Éviction de l'allergène"
    ]},
    { title: "Traitement initial", bullets: [
      "Adrénaline IM 0,01 mg/kg (max 0,5 mg) face latéro-externe cuisse",
      "Remplissage : NaCl 0,9% 20 mL/kg si hypoTA",
      "Aérosol adrénaline 0,1 mg/kg (max 5 mg) si atteinte VAS"
    ]},
    { title: "Si échec / aggravation", bullets: [
      "Adrénaline IVSE 0,1 µg/kg/min (monitorée) ou bolus 1 µg/kg dilué",
      "Solumédrol 1–2 mg/kg + Polaramine 0,1 mg/kg",
      "Glucagon si bêta-bloquant",
      "Surveillance 6–24h (biphasique)"
    ]},
  ],
  "choc-hemorragique": [
    { title: "Prise en charge initiale", bullets: [
      "Libération VA, O2 MHC (sat>95%), 2 VVP gros calibre ± IO",
      "Bilan biologique complet, E-FAST",
    ]},
    { title: "Traitements", bullets: [
      "Remplissage : cristalloïdes 10–20 mL/kg ± colloïdes",
      "Noradrénaline si échec (objectifs PAS/PAM selon âge/TC)",
      "Exacyl < 3h",
      "Transfusions PFC:CGR (1:2 à 1:1), plaquettes, fibrinogène",
      "Triade létale : réchauffer, Ca2+ ionisé >0,9, pH>7,2"
    ]},
    { title: "Contrôle du saignement", bullets: [
      "Garrot, pansement hémostatique, ceinture pelvienne",
      "Chirurgie / endoscopie / embolisation"
    ]},
  ],
  "aag": [
    { title: "Mesures initiales", bullets: [
      "Demi-assis, O2 titrée (sat 94–98%), scope",
      "AE salbutamol continu 1h + ipratropium",
      "Solumédrol IV 2 mg/kg"
    ]},
    { title: "Si échec / sévérité", bullets: [
      "MgSO4 IV (≥20 mg/kg/30') puis 10 mg/kg/h",
      "VNI / IOT (ISR si besoin), réglages protecteurs",
      "Réévaluation rapprochée"
    ]},
  ],
  "acr-enfant": [
    { title: "Réanimation de base", bullets: [
      "Appel aide, RCP, défibrillation si indiqué",
      "Voies aériennes, oxygène, accès vasculaire",
    ]},
    { title: "Réanimation avancée", bullets: [
      "Adrénaline IV/IO 0,01 mg/kg à intervalles recommandés",
      "Traiter les causes réversibles (H & T)"
    ]},
  ],
  "eme": [
    { title: "Critères", bullets: [
      "Convulsions ≥ 5 min ou répétées sans reprise de conscience",
    ]},
    { title: "Traitement", bullets: [
      "Clonazépam 0,015 mg/kg IVD ou Diazépam 0,5 mg/kg IR ou Midazolam 0,3 mg/kg VB",
      "Si persistance : répéter, puis 2ème ligne (phénytoïne/levetiracétam/PHB)",
      "EME réfractaire : coma thérapeutique (hypnovel/propofol) 24 h"
    ]},
  ],
  "convulsion-febrile-simple": [
    {
      title: "Objectif",
      bullets: [
        "Standardiser la PEC des convulsions fébriles simples (6 mois – 5 ans) pour sécuriser gestes et calculs.",
        "Limiter les examens inutiles tout en dépistant les formes compliquées / infections du SNC.",
      ],
    },
    {
      title: "Définition",
      bullets: [
        "Crise généralisée tonico-clonique < 15 min, unique en 24 h, examen neuro normal ensuite.",
        "Pas d'antécédent neurologique significatif, pas d'argument pour infection du SNC.",
      ],
    },
    {
      title: "Arbre décisionnel",
      bullets: [
        "Crise en cours ? → ABC + benzodiazépine si ≥ 5 min.",
        "Tous les critères CFS réunis ? → PEC simple + surveillance courte.",
        "Sinon → convulsion fébrile compliquée / autre protocole.",
      ],
    },
    {
      title: "ABC initial",
      bullets: [
        "PLS, libération des VAS, O₂ titré (94–98 %), VVP si crise prolongée.",
        "TA, TRC, glycémie systématique (corriger si < 0,7 g/L par glucose 10 % 2 mL/kg).",
        "Recherche foyer infectieux, T°, signes méningés ou purpura.",
      ],
    },
    {
      title: "Traitement crise",
      bullets: [
        "Midazolam IN 0,2 mg/kg (max 10 mg) ou buccal 0,3 mg/kg.",
        "Si VVP : midazolam IV 0,1 mg/kg (max 4 mg). Répéter une fois à 5 min.",
        "Échec x2 → protocole statut convulsif.",
      ],
    },
    {
      title: "Post-critique",
      bullets: [
        "Pas d'examens systématiques si clinique rassurante (pas de scanner, EEG ou biologie).",
        "PL si suspicion méningite, ionogramme si troubles hydroélectrolytiques.",
        "Traiter la fièvre : paracétamol 15 mg/kg, pas d’alternance systématique.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitaliser si < 1 an, crise avant 6 mois, critères complexes, mauvaise tolérance ou surveillance impossible.",
        "Sortie si examen neuro redevenu normal, fièvre contrôlée, parents rassurés + consignes écrites.",
      ],
    },
  ],
  "antalgiques": [
    { title: "Évaluation", bullets: [
      "Identifier le palier adapté à la douleur (EVA/EVENDOL)",
      "Réévaluer systématiquement après chaque étape"
    ]},
    { title: "Palier 1", bullets: [
      "Solutions sucrées pour nourrisson, MEOPA/EMLA pour gestes douloureux",
      "Antalgiques de base : paracétamol ± AINS si absence de contre-indications"
    ]},
    { title: "Palier 2", bullets: [
      "Tramadol PO/IV 1 mg/kg/6 h (>3 ans) en complément du palier 1"
    ]},
    { title: "Palier 3", bullets: [
      "Morphine titrée IV/PO ± perfusion continue",
      "Nalbuphine ou kétamine selon contexte, prévoir antagonistes"
    ]},
  ],
  "bronchiolite": [
    { title: "Évaluation initiale", bullets: [
      "DRP douce + installation avant toute mesure",
      "FR/FC/SpO₂, état général, signes de lutte, apports sur 3 prises",
      "Classer légère/modérée/grave selon critères HAS"
    ]},
    { title: "Vulnérabilités", bullets: [
      "Prématurité < 36 SA, âge < 2 mois, cardiopathie, DBP",
      "Immunodépression, neuro-musculaire, polyhandicap, trisomie 21",
      "Environnement défavorable : accès aux soins, précarité, tabagisme"
    ]},
    { title: "Orientation", bullets: [
      "Grave : hospitalisation USC/réa, transport médicalisé",
      "Modérée : UHCD/conventionnel si SpO₂ ≤ 92 %, apports < 50 %, vulnérabilité ou contexte défavorable",
      "Légère : domicile + surveillance si environnement favorable"
    ]},
    { title: "Traitements", bullets: [
      "Oxygène si SpO₂ ≤ 92 % (cible > 92 % à l'éveil)",
      "Support nutritionnel entéral prioritaire si apports < 50 %",
      "HFNC 2 L/kg/min ou CPAP si échec O₂ bas débit"
    ]},
    { title: "À éviter", bullets: [
      "Bronchodilatateurs, adrénaline, corticoïdes, antibiotiques systématiques",
      "Caféine, fluidifiants, antitussifs, anti-reflux systématiques",
      "Kinésithérapie respiratoire hors DRP douce"
    ]},
  ],
  "fievre-sepsis-purpura": [
    { title: "Objectif", bullets: [
      "Reconnaître très tôt les sepsis/purpuras fulminans, déclencher l'ATB IV sans délai",
      "Standardiser l'évaluation ABC + peau + contexte à risque",
      "Transport médicalisé rapide si signe de gravité"
    ]},
    { title: "Évaluation initiale ≤ 5 min", bullets: [
      "Constantes vitales complètes (FC, FR, SpO₂, TA ≥1 an, T°, TRC)",
      "Examen cutané systématique : purpura non blanchissant, extension, nécrose",
      "Examen neurologique : AVPU, convulsions, irritabilité",
      "Contexte : <3 mois, asplénie/drépanocytose, immunodépression, vaccins méningocoque/pneumocoque"
    ]},
    { title: "Signes de gravité", bullets: [
      "Perfusion altérée : TRC >3s, marbrures, extrémités froides, hypotension tardive",
      "Tachycardie persistante, polypnée sévère, SpO₂ <92 %",
      "Altération neurologique (AVPU = P/U, convulsions)",
      "Diurèse <1 mL/kg/h",
      "Purpura extensif ou nécrotique → purpura fulminans"
    ]},
    { title: "Mesures immédiates", bullets: [
      "Oxygénothérapie : cible SpO₂ 94–98 %",
      "VVP/IO en <90 s",
      "Remplissage NaCl 0,9 % 10–20 mL/kg, répéter jusqu'à 40–60 mL/kg",
      "Antibiothérapie IV dans l'heure, jamais retardée",
      "Vasopresseur (noradrénaline/adrénaline) si hypotension persistante"
    ]},
    { title: "Antibiothérapie", bullets: [
      "Purpura fulminans : Ceftriaxone 100 mg/kg (max 1–2 g) IV dose unique",
      "Alternative : Céfotaxime 150–200 mg/kg/j en 3–4 doses",
      "Sepsis sévère sans purpura : Céfotaxime 150 mg/kg/j ou Amox + Ac. clav selon foyer",
      "Nourrisson <3 mois : protocole spécifique élargi",
      "Notification obligatoire si méningocoque + prophylaxie des contacts"
    ]},
    { title: "Hospitalisation / réanimation", bullets: [
      "Tous purpuras et sepsis suspect/confirmé",
      "Réa directe si choc septique, besoin vaso-actif, polypnée sévère, apnées",
      "Autres critères : remplissage >20 mL/kg, SpO₂ <94 % malgré O₂, TRC >3s, tachycardie >2 SDS, âge <3 mois",
      "Sortie seulement après 24 h de stabilité, apyrésie, hémodynamique stable sans O₂, absence d'extension du purpura"
    ]},
    { title: "Situations particulières", bullets: [
      "<3 mois : hospitalisation systématique et bilan complet",
      "Asplénie / drépanocytose : risque fulminant pneumocoque → ATB immédiate",
      "Immunodépression : adapter l'ATB selon protocole d'hémato-oncologie"
    ]},
  ],
  "traumatisme-cranien": [
    {
      title: "Objectif",
      bullets: [
        "Stabiliser l’enfant selon ABCDE, évaluer le Glasgow et repérer les signes menaçants.",
        "Appliquer les règles PECARN pour l’imagerie et adapter la conduite au niveau de gravité.",
      ],
    },
    {
      title: "Évaluation initiale",
      bullets: [
        "A : VA + immobilisation ; GCS ≤ 8 → intubation.",
        "B : SpO₂ 94–98 %, O₂ MHC 10–15 L/min si détresse.",
        "C : prévenir hypotension, remplissage 20 mL/kg si choc.",
        "D : GCS, pupilles, convulsions (midazolam 0,1 mg/kg IV).",
        "E : examen complet, glycémie, température.",
      ],
    },
    {
      title: "Signes imposant scanner / avis neurochir",
      bullets: [
        "GCS < 15 persistant ou ≤ 13 d’emblée.",
        "Déficit focal, anisocorie/mydriase, convulsions post-traumatiques.",
        "Vomissements incoercibles, altération de conscience > 2 h, mécanisme violent, fracture ouverte/embarrure.",
      ],
    },
    {
      title: "Conduite selon la sévérité",
      bullets: [
        "Léger : PECARN, surveillance 3–6 h, paracétamol 15 mg/kg (max 1 g).",
        "Modéré : scanner en urgence, O₂, VVP, transferts spécialisés.",
        "Sévère : intubation (kétamine 2 mg/kg + rocuronium 1 mg/kg), ventilation normocapnique, double VVP, scanner prioritaire.",
      ],
    },
    {
      title: "Prévention HTIC & orientation",
      bullets: [
        "Buste 30°, normothermie, osmothérapie : mannitol 0,5–1 g/kg ou NaCl 3 % 5 mL/kg.",
        "< 1 an, trouble coagulation, polytrauma : imagerie systématique + avis spé.",
        "Hospitalisation si GCS < 15, facteurs PECARN ou lésion ; sortie seulement si examen normal + parents informés.",
      ],
    },
  ],
};
