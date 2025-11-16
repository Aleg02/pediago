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
  "hypoglycemie": [
    {
      title: "Objectif",
      bullets: [
        "Stabiliser rapidement toute glycémie < 0,7 g/L et sécuriser la correction du glucose.",
        "Limiter les erreurs de calcul grâce aux volumes/grammages pondérés et orienter l'enfant selon la gravité.",
      ],
    },
    {
      title: "Définition",
      bullets: [
        "Hypoglycémie pédiatrique : glycémie plasmatique < 0,7 g/L (3,9 mmol/L).",
        "Hypoglycémie sévère si < 0,4 g/L ou présence de signes neurologiques.",
      ],
    },
    {
      title: "Arbre décisionnel",
      bullets: [
        "Confirmer la glycémie capillaire → si doute, recontrôler sur gaz/veineux.",
        "Signes de gravité ou glycémie < 0,4 g/L → voie IV urgente (bolus G10 %).",
        "Enfant conscient, 0,4–0,7 g/L → resucrage oral 0,3 g/kg + contrôle à 15 min.",
        "Identifier la cause (jeûne, infection, intoxication) et planifier la surveillance.",
      ],
    },
    {
      title: "Évaluation initiale",
      bullets: [
        "ABCDE : PLS si inconscient, aspiration si encombrement, O₂ titré (94–98 %).",
        "SpO₂ < 94 % → O₂ 10 L/min, pose VVP/IO si signes de gravité.",
        "GCS/AVPU, recherche signes neuro (tremblements, convulsions, coma).",
        "Inspection complète : déshydratation, foyer infectieux, toxiques.",
      ],
    },
    {
      title: "Signes de gravité",
      bullets: [
        "Glycémie < 0,4 g/L ou évolution rapide malgré resucrage.",
        "Convulsions, troubles de conscience, hypotonie, incapacité à boire.",
        "Suspicion intoxication (insuline, bêtabloquant, alcool) ou trouble neuro persistant.",
      ],
    },
    {
      title: "Traitement sévère",
      bullets: [
        "Bolus G10 % 2 mL/kg IV suivi d'une perfusion 6–8 mg/kg/min.",
        "Si IV impossible : glucagon IM 0,5 mg (< 25 kg) ou 1 mg (≥ 25 kg).",
        "Convulsions : midazolam IN 0,2 mg/kg ou IV 0,1 mg/kg.",
        "Surveillance glycémique toutes les 15 min + recherche de cause.",
      ],
    },
    {
      title: "Traitement modéré / léger",
      bullets: [
        "Resucrage oral 0,3 g/kg (gel glucosé, jus, sucre) + recontrôle à 15 min.",
        "Si glycémie toujours < 0,7 g/L ou symptômes persistants → répétition ou voie IV.",
        "Hypoglycémie légère asymptomatique : même correction orale + surveillance 1–2 h.",
      ],
    },
    {
      title: "Situations particulières",
      bullets: [
        "Nourrisson < 1 an ou suspicion EIIM → hospitalisation + perfusion continue.",
        "Déshydratation / gastroentérite : réhydratation + glucose.",
        "Suspicion intoxication → avis centre antipoison, monitoring continu.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation : hypoglycémie sévère, convulsions, perfusion continue, intoxication, terrain à risque.",
        "Sortie : glycémie > 0,7 g/L stable ≥ 4 h, asymptomatique, cause identifiée, parents formés.",
      ],
    },
  ],
  "acidocetose-diabetique": [
    {
      title: "Objectif",
      bullets: [
        "Standardiser la PEC de l'ACD pédiatrique pour limiter les variations d'hydratation et sécuriser les calculs d'insuline.",
        "Prévenir l'œdème cérébral en assurant un remplissage raisonné et une correction lente de la glycémie.",
      ],
    },
    {
      title: "Définition & gravité",
      bullets: [
        "ACD = glycémie > 11 mmol/L + cétonémie ≥ 3 mmol/L (ou cétonurie ++/+++) + acidose pH < 7,3 ou HCO₃⁻ < 15 mmol/L.",
        "Gravité modérée si pH 7,1–7,3 ; sévère si pH < 7,1 ; risque majeur d'œdème cérébral.",
      ],
    },
    {
      title: "Arbre décisionnel",
      bullets: [
        "Confirmer l'ACD et éliminer les diagnostics différentiels.",
        "Réhydratation prudente ± bolus NaCl 0,9 % si choc.",
        "Insuline IV continue 0,05–0,1 U/kg/h (pas de bolus).",
        "Ajouter glucose quand glycémie < 2,5 g/L, corriger le potassium systématiquement.",
        "Surveiller neuro + biologique rapproché, hospitaliser en réanimation si pH < 7,1 ou signes neurologiques.",
      ],
    },
    {
      title: "Surveillance",
      bullets: [
        "Glycémie toutes les 30 min puis 1 h, ionogramme toutes les 2–4 h.",
        "Scope continu, diurèse horaire, recherche signes d'œdème cérébral.",
        "Hospitalisation systématique avec transition vers insuline SC après correction de la cétose.",
      ],
    },
  ],
  "pneumopathie-communautaire-bacterienne": [
    {
      title: "Objectif",
      bullets: [
        "PEC standardisée d'une pneumopathie communautaire bactérienne selon HAS/SFP/SPLF/NICE/AAP.",
        "Aider à titrer l'oxygène, choisir l'antibiothérapie pondérée et sécuriser la réévaluation à 48 h.",
      ],
    },
    {
      title: "Définition succincte",
      bullets: [
        "Infection aiguë du parenchyme pulmonaire hors milieu hospitalier, souvent Streptococcus pneumoniae.",
        "Clinique évocatrice : fièvre élevée, polypnée, tirage, crépitants / souffle tubaire, altération de l'état général.",
      ],
    },
    {
      title: "Résumé décisionnel",
      bullets: [
        "Évaluer la sévérité (légère, modérée, sévère) puis initier ABCDE + O₂ si SpO₂ < 94 %.",
        "Amoxicilline PO en 1ère intention, macrolides si allergie, IV si gravité, contrôle à 48 h.",
        "Hospitaliser si critères de gravité, sortie si amélioration clinique et SpO₂ ≥ 94 %.",
      ],
    },
    {
      title: "Évaluation initiale",
      bullets: [
        "A – VAS libres, position confortable, désobstruction rhinopharyngée.",
        "B – FR selon âge, tirage, geignement, SpO₂, auscultation (crépitants, MV diminué).",
        "C – FC, TRC, recherche de déshydratation.",
        "D – Vigilance, tonus, score AVPU.",
        "E – Température, recherche de signes extra-respiratoires / comorbidités.",
      ],
    },
    {
      title: "Signes de gravité",
      bullets: [
        "SpO₂ < 92–94 %, besoin d'O₂ élevé.",
        "Tirage marqué, polypnée sévère, geignement.",
        "Déshydratation, incapacité à s'alimenter, vomissements.",
        "Âge < 3 mois ou comorbidités respiratoires / immunitaires.",
        "Altération de l'état général ou suspicion de complication (SDRA, sepsis).",
      ],
    },
    {
      title: "Examens",
      bullets: [
        "Radiographie thoracique si doute diagnostique, gravité ou non-amélioration à 48 h.",
        "Biologie ciblée (NFS, CRP, hémocultures) si hospitalisation ou complication.",
        "Gaz du sang si hypoxémie, suspicion SDRA.",
      ],
    },
    {
      title: "Antibiothérapie",
      bullets: [
        "Amoxicilline PO 80–100 mg/kg/j en 3 prises (1ère intention).",
        "Allergie β-lactamines : azithromycine (10 mg/kg J1 puis 5 mg/kg J2–J5) ou clarithromycine 15 mg/kg/j en 2 prises.",
        "Formes sévères : amoxicilline IV 100 mg/kg/j (3–4 inj) ou céfotaxime 100–150 mg/kg/j ou ceftriaxone 50–75 mg/kg/j.",
      ],
    },
    {
      title: "Traitements associés",
      bullets: [
        "O₂ si SpO₂ < 94 % (objectif 94–98 %).",
        "Paracétamol 15 mg/kg/dose, hydratation IV NaCl 0,9 % 10–20 mL/kg si déshydratation.",
        "Pas de β2 ni de corticoïdes systémiques hors terrain asthmatique, pas de kiné systématique.",
      ],
    },
    {
      title: "Hospitalisation / sortie",
      bullets: [
        "Critères : SpO₂ < 94 %, détresse respi, difficulté d'hydratation, < 3 mois, comorbidités, absence d'amélioration 48 h.",
        "Sortie si amélioration clinique, apyréxie ou fièvre décroissante, SpO₂ ≥ 94 % en air ambiant, alimentation correcte.",
      ],
    },
  ],
  "pneumopathie-atypique-mycoplasma": [
    {
      title: "Objectif",
      bullets: [
        "Décrire une PEC immédiate, pondérée au poids, pour les pneumopathies atypiques à Mycoplasma (HAS/SFP/SPLF/NICE/AAP).",
        "Focus sur enfants ≥ 5 ans : titrer l’O₂, sécuriser l’antibiothérapie par macrolide et la réévaluation à 48 h.",
      ],
    },
    {
      title: "Définition succincte",
      bullets: [
        "Toux sèche prolongée, fièvre modérée, céphalées/myalgies, auscultation souvent pauvre, atteinte interstitielle à la radio.",
        "Principal germe : Mycoplasma pneumoniae, sensible aux macrolides.",
      ],
    },
    {
      title: "Résumé décisionnel",
      bullets: [
        "Identifier la sévérité (léger / modéré / sévère) puis réaliser ABCDE.",
        "SpO₂ < 94 % → O₂ 1–2 L/min ; antibiothérapie par azithromycine ou clarithromycine adaptée au poids.",
        "Réévaluation clinique à 48 h, hospitalisation si critères de gravité ou évolution défavorable.",
      ],
    },
    {
      title: "ABCDE",
      bullets: [
        "A – Désobstruction rhinopharyngée, VAS libres.",
        "B – FR selon l’âge, auscultation discrète (MV ↓, rares sibilants), SpO₂ continue.",
        "C – FC, TRC, TA, rechercher signes de déshydratation.",
        "D – Évaluer état général, vigilance, signes neuro.",
        "E – Température, recherche autres foyers infectieux.",
      ],
    },
    {
      title: "Signes de gravité",
      bullets: [
        "SpO₂ < 94 %, tirage ou polypnée nette.",
        "Altération de l’état général, asthénie majeure.",
        "Vomissements empêchant la prise orale.",
        "Âge < 5 ans avec forte suspicion, ou comorbidités / immunodépression.",
        "Suspicion atteinte extrapulmonaire (myocardite, neurologique).",
      ],
    },
    {
      title: "Examens",
      bullets: [
        "Radio thoracique si gravité, fièvre prolongée (> 72 h) ou absence d’amélioration.",
        "Biologie ciblée : CRP modérée, PCR Mycoplasma si doute.",
        "Gaz du sang si hypoxémie ou détresse respiratoire.",
      ],
    },
    {
      title: "Antibiothérapie",
      bullets: [
        "Azithromycine : 10 mg/kg J1 puis 5 mg/kg J2–J5.",
        "Clarithromycine : 15 mg/kg/j en 2 prises.",
        "Allergie vraie aux macrolides : discussion spécialisée, pas d’alternative simple.",
      ],
    },
    {
      title: "Traitements associés",
      bullets: [
        "Paracétamol 15 mg/kg/dose en cas de fièvre ou inconfort.",
        "Hydratation IV NaCl 0,9 % 10–20 mL/kg si intolérance orale.",
        "O₂ lunettes 1–2 L/min si SpO₂ < 94 %, objectif 94–98 %.",
        "Pas de β2, corticoïdes ou β-lactamines seuls en routine.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Léger : traitement PO + surveillance à domicile, contrôle 48 h.",
        "Modéré : réévaluation 24–48 h, O₂ si besoin, imagerie si complication.",
        "Sévère : O₂, VVP, hydratation IV, hospitalisation.",
        "Sortie si amélioration clinique, SpO₂ ≥ 94 %, alimentation possible, parents aptes.",
      ],
    },
  ],
  "laryngite-aigue": [
    {
      title: "Objectif",
      bullets: [
        "PEC rapide de la laryngite aiguë virale (croup) avec calcul immédiat des posologies et guidance clinique.",
        "Limiter les stimulations, rassurer l'enfant et suivre les recommandations HAS/SFP/SPLF/NICE/AAP.",
      ],
    },
    {
      title: "Définition rapide",
      bullets: [
        "Inflammation laryngo-trachéale virale (parainfluenza majoritaire) → toux aboyante, enrouement, stridor.",
        "Signes de gravité : stridor au repos, tirage, agitation, hypoxémie, balancement thoraco-abdominal, épuisement.",
      ],
    },
    {
      title: "Évaluation initiale ABCDE",
      bullets: [
        "A : installer l'enfant calmement dans les bras du parent, éviter toute agitation inutile.",
        "B : monitorer SpO₂ ; O₂ haut débit si < 94 % (objectif 94–98 %).",
        "C : FC, TRC, TA ; rechercher signes de choc ou déshydratation.",
        "D : état de vigilance, agitation, signes d'épuisement.",
        "E : température, écoute des VAS, rechercher corps étranger / épiglottite.",
      ],
    },
    {
      title: "Classer la sévérité",
      bullets: [
        "Légère : stridor uniquement à l'effort, pas de tirage ni d'agitation.",
        "Modérée : stridor au repos, tirage modéré, +/- agitation, SpO₂ ≥ 94 %.",
        "Sévère / menace vitale : stridor très bruyant voire silence, tirage marqué, SpO₂ < 94 %, cyanose, obnubilation.",
      ],
    },
    {
      title: "Traitements essentiels",
      bullets: [
        "Dexaméthasone PO ou IV 0,6 mg/kg (0,15–0,6 mg/kg possibles) dose unique, max 10 mg.",
        "Adrénaline nébulisée si modéré à sévère : 5 mL L(+) 1 mg/mL (ou racémique 0,5 mL + NaCl).",
        "Budesonide nébulisé 2 mg si corticoïde inhalé préféré, surveillance 2 h post-adrénaline.",
        "Paracétamol 15 mg/kg si fièvre / inconfort, hydratation orale si possible.",
      ],
    },
    {
      title: "Orientation & surveillance",
      bullets: [
        "Légère : dexaméthasone PO, observation 1–2 h, sortie avec consignes si disparition du stridor.",
        "Modérée : dexaméthasone + adrénaline, surveillance 2–4 h, répéter nébulisation si reprise des signes.",
        "Sévère : O₂ 10 L/min, adrénaline immédiate, corticoïde IV si besoin, préparation VAS difficile, appel réanimation.",
        "Hospitalisation si < 6 mois, SpO₂ < 94 %, stridor au repos persistant, multiples nébulisations, terrain fragile ou surveillance parentale difficile.",
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
  "bronchospasme-nourrisson": [
    {
      title: "Objectif",
      bullets: [
        "Standardiser la PEC d'un bronchospasme aigu non asthmatique chez le nourrisson en situation d'urgence.",
        "Fournir un support dynamique pour les posologies (O₂, salbutamol, corticoïdes, remplissage) et l'orientation clinique.",
      ],
    },
    {
      title: "Définition",
      bullets: [
        "Obstruction bronchique aiguë liée le plus souvent à une infection virale type bronchiolite, sans asthme connu.",
        "Tableau associant sibilants expiratoires, polypnée, tirage, toux et difficultés alimentaires (diagnostic clinique).",
      ],
    },
    {
      title: "ABCDE initial",
      bullets: [
        "A : position semi-assise, désobstruction rhinopharyngée systématique.",
        "B : FR, tirage, geignement, SpO₂ continue ; O₂ 1–2 L/min si SpO₂ < 94 % (objectif 94–98 %).",
        "C : FC, TRC, évaluer la déshydratation et les apports.",
        "D : tonus, éveil, signes de fatigue ou hypotonie.",
        "E : température, contexte infectieux, comorbidités / terrain fragile.",
      ],
    },
    {
      title: "Classer la sévérité",
      bullets: [
        "Léger : polypnée modérée, peu ou pas de tirage, alimentation conservée, SpO₂ ≥ 94 %.",
        "Modéré : tirage intercostal, sibilants audibles, difficultés alimentaires, SpO₂ 92–94 %.",
        "Sévère : GEU/tirage marqué, fatigue, cyanose, SpO₂ < 92 %, hypotonie ou apnées.",
      ],
    },
    {
      title: "Traitements essentiels",
      bullets: [
        "Désobstruction rhinopharyngée avant tout geste, hydratation fractionnée.",
        "Oxygène bas débit 1–2 L/min si SpO₂ < 94 % (objectif 94–98 %).",
        "Test thérapeutique salbutamol ≥ 6 mois : 2–4 bouffées (100 µg/bouffée) ×3 max toutes les 20 min.",
        "Corticoïdes systémiques (prednisone/prednisolone 1–2 mg/kg, max 40 mg) si ≥ 12 mois ou suspicion asthme débutant.",
        "Adrénaline nébulisée 5 mL (1 mg/mL) si forme sévère ou composante laryngée, support ventilatoire (HFNC/CPAP) si échec O₂.",
        "Remplissage NaCl 0,9 % 10 mL/kg IV si déshydratation.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Léger : désobstruction + hydratation, retour à domicile si surveillance parentale fiable.",
        "Modéré : O₂, test salbutamol, réévaluation 20–30 min ; hospitalisation si SpO₂ < 94 %, apports < 50 % ou terrain fragile.",
        "Sévère : O₂ immédiat, adrénaline, HFNC/CPAP, appel réanimateur et hospitalisation systématique.",
      ],
    },
    {
      title: "Critères d'hospitalisation / sortie",
      bullets: [
        "Hospitaliser si SpO₂ < 94 %, apports < 50 %, détresse respiratoire, < 6 mois, terrain à risque ou échec du test thérapeutique.",
        "Sortie si SpO₂ ≥ 94 % en air ambiant, apports corrects, tirage minime et parents aptes à surveiller.",
      ],
    },
    {
      title: "Situations particulières",
      bullets: [
        "< 6 mois ou prématurés : seuil d'hospitalisation abaissé (risque d'apnées).",
        "Pathologies pulmonaires chroniques / cardiopathies : avis spécialisé, monitorage prolongé.",
      ],
    },
    {
      title: "Non recommandés",
      bullets: [
        "Antibiotiques (hors surinfection avérée), antitussifs/mucolytiques, bronchodilatateurs IV.",
        "Kinésithérapie respiratoire systématique et corticoïdes inhalés en phase aiguë.",
      ],
    },
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
  "meningite-bacterienne-purulente": [
    {
      title: "Objectif",
      bullets: [
        "Méningite purulente = urgence vitale : ATB IV immédiate + hospitalisation spécialisée.",
        "Identifier rapidement l’âge (< 3 mois vs ≥ 3 mois) pour adapter l’antibiothérapie.",
      ],
    },
    {
      title: "Diagnostic express",
      bullets: [
        "Fièvre + céphalées/vomissements, raideur méningée, altération de conscience, purpura fulminans si méningococcémie.",
        "ABCDE, glycémie capillaire, monitorage SpO₂, recherche convulsions (Midazolam si nécessaire).",
      ],
    },
    {
      title: "Signes de gravité (ATB sans attendre la PL)",
      bullets: [
        "Purpura, choc, instabilité hémodynamique, Glasgow < 11, convulsions persistantes, détresse respiratoire.",
        "Remplissage NaCl 0,9 % 20 mL/kg si choc, O₂ 10–15 L/min si SpO₂ < 94 %.",
      ],
    },
    {
      title: "Ponction lombaire",
      bullets: [
        "Possible seulement si patient stable, sans signe d’HTIC ni trouble de coagulation.",
        "CI : instabilité, purpura, crise convulsive persistante, signes d’engagement, trouble hémostase.",
      ],
    },
    {
      title: "Antibiothérapie IV",
      bullets: [
        "< 3 mois : Cefotaxime 200 mg/kg/j + Amoxicilline 200 mg/kg/j en 3–4 injections.",
        "≥ 3 mois : Cefotaxime 200 mg/kg/j (3–4 inj) ou Ceftriaxone 100 mg/kg/j (max 4 g). Ajouter Vancomycine 60 mg/kg/j si pneumocoque à CMI élevée, Amoxicilline si suspicion Listeria.",
      ],
    },
    {
      title: "Corticothérapie",
      bullets: [
        "Dexaméthasone 0,15 mg/kg IV toutes les 6 h pendant 48 h si suspicion pneumocoque ≥ 3 mois (avant/avec 1ère dose d’ATB).",
      ],
    },
    {
      title: "Traitements associés",
      bullets: [
        "Antipyrétiques (Paracétamol 15 mg/kg), remplissage, monitorage neurologique.",
        "Convulsions : Midazolam 0,1 mg/kg IV ou 0,2 mg/kg IN, puis protocole EME si échec.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation obligatoire. Réanimation si choc, SpO₂ < 94 %, altération de conscience, purpura fulminans ou convulsions réfractaires.",
        "Sortie uniquement après hospitalisation complète : apyrexie, amélioration neuro, relais ATB défini.",
      ],
    },
  ],
  "tachycardie-supraventriculaire": [
    {
      title: "Objectif",
      bullets: [
        "Identifier rapidement la TSV pédiatrique et sécuriser la réversion du rythme sans erreur de calcul.",
        "Limiter l'escalade thérapeutique aux situations nécessaires et anticiper l'orientation cardiopédiatrique.",
      ],
    },
    {
      title: "Diagnostic",
      bullets: [
        "Tachycardie régulière à QRS fins (< 80 ms), FC > 220 bpm nourrisson / > 180 bpm enfant.",
        "Onde P rétrograde ± masquée, démarrage/arrêt abrupt, exclusion tachycardie sinusale.",
      ],
    },
    {
      title: "Instabilité",
      bullets: [
        "Hypotension, altération conscience, signes de choc ou insuffisance cardiaque.",
        "Cardioversion synchronisée immédiate 0,5–2 J/kg (sédation si conscience).",
      ],
    },
    {
      title: "Enfant stable",
      bullets: [
        "Manœuvres vagales adaptées à l'âge (immersion eau glacée, Valsalva modifié).",
        "Adénosine 0,1 mg/kg puis 0,2 mg/kg IV rapide (max 6/12 mg) avant antiarythmiques.",
        "Amiodarone 5 mg/kg ou procaïnamide 10–15 mg/kg si échec, puis cardioversion.",
      ],
    },
    {
      title: "Surveillance & orientation",
      bullets: [
        "Monitoring ECG continu, correction facteurs déclenchants, traitement de la fièvre.",
        "Hospitalisation pour toute TSV traitée, cardiopathie congénitale, suspicion WPW ou récidive.",
      ],
    },
  ],
  "traumatisme-thoraco-abdominal-fast": [
    {
      title: "Objectif",
      bullets: [
        "Prise en charge standardisée des traumatismes thoraciques et/ou abdominaux graves avec intégration systématique du FAST.",
        "Limiter les erreurs de calcul sur les bolus de remplissage, transfusions et agents d'induction pédiatriques.",
      ],
    },
    {
      title: "ABCDE",
      bullets: [
        "Immobilisation tête-cou, aspiration PRN, O₂ 10–15 L/min si SpO₂ < 94 %.",
        "2 VVP larges ± IO, NaCl 0,9 % 20 mL/kg avant transfusion équilibrée.",
        "Glycémie systématique : G10 % 2 mL/kg si < 0,7 g/L.",
      ],
    },
    {
      title: "Airway/Breathing",
      bullets: [
        "Induction séquence rapide : kétamine 2 mg/kg IV + rocuronium 1 mg/kg (immobilisation cervicale maintenue).",
        "Décompression immédiate des pneumothorax suffocants, drain thoracique si hémothorax massif.",
        "Morphine 0,1 mg/kg IV puis titration 0,025 mg/kg toutes les 5 min selon EVA.",
      ],
    },
    {
      title: "Circulation",
      bullets: [
        "Transfusion damage control : CGR 10–15 mL/kg, PFC 10–15 mL/kg, plaquettes 10–20 mL/kg.",
        "Objectifs : PAM ≥ 60–70 mmHg selon âge, température > 36 °C, calcium ionisé > 0,9 mmol/L.",
        "Adjoints : acide tranexamique < 3 h, ceinture pelvienne, contrôle mécanique du saignement.",
      ],
    },
    {
      title: "FAST pédiatrique",
      bullets: [
        "Fenêtres : péricarde, hépatique droite, splénique gauche, cul-de-sac de Douglas.",
        "FAST + instable → bloc opératoire immédiat / damage control ; FAST + stable → scanner TAP.",
        "FAST − mais instable → rechercher autre cause (tamponnade, hémorragie thoracique, fracture de bassin).",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Thorax : O₂ haut débit, drains, ventilation assistée si volet thoracique.",
        "Abdomen : chirurgie si instabilité persistante, PEC conservatrice si lésions hépatiques/spléniques stables.",
        "Situations particulières (nourrisson, pénétrant, polytrauma) → damage control resuscitation et transfusion précoce.",
      ],
    },
  ],
  "polytraumatisme-pediatrique": [
    {
      title: "Objectif",
      bullets: [
        "PEC opérationnelle du polytrauma pédiatrique avec ABCDE systématique et décisions rapides bloc / imagerie / transfert.",
        "Garantir les calculs pondérés des bolus, transfusions et drogues d’induction pour éviter toute règle de trois au lit du patient.",
      ],
    },
    {
      title: "Définition & triage",
      bullets: [
        "Atteinte d’au moins deux régions dont une engage potentiellement le pronostic vital : traiter comme urgence vitale.",
        "Activation de la filière polytrauma, FAST immédiat si instabilité, imagerie ciblée si stable.",
      ],
    },
    {
      title: "ABCDE",
      bullets: [
        "A : immobilisation tête–cou, aspiration, oxygène 10–15 L/min, IOT si GCS ≤ 8 ou détresse respiratoire.",
        "B : recherche pneumothorax suffocant, décompression 14–18G, drainage thoracique si hémothorax massif.",
        "C : NaCl 0,9 % 20 mL/kg avant transfusion (CGR/PFC 10–15 mL/kg, plaquettes 10–20 mL/kg).",
        "D : GCS, pupilles, convulsions → midazolam 0,1 mg/kg IV ou 0,2 mg/kg IN, glycémie → G10 % 2 mL/kg.",
        "E : déshabillage complet, prévention hypothermie, recherche hémorragie externe.",
      ],
    },
    {
      title: "Imagerie & orientation",
      bullets: [
        "FAST + instable → bloc immédiat ; FAST + stable → scanner TAP ; FAST − instable → chercher thorax / bassin / neuro.",
        "Scanner corps entier si mécanisme violent, sinon ciblé ; patient instable → pas de scanner avant geste vital.",
        "Décision conjointe réa/chirurgie/transfert + surveillance continue.",
      ],
    },
    {
      title: "Situations particulières",
      bullets: [
        "Nourrisson : choc masqué, transfusion précoce ; prématuré ou pathologie chronique : adapter volumes.",
        "Traumatisme pénétrant : forte probabilité de geste chirurgical ; suspicion maltraitance < 2 ans → imagerie systématique.",
        "Hospitalisation en soins intensifs pour tout polytrauma, sortie uniquement si trauma mineur confirmé après 4–6 h d’observation.",
      ],
    },
  ],
};
