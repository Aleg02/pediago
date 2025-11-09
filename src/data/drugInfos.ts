// src/data/drugInfos.ts
// Métadonnées d’affichage : préparation, mode, durée, précautions.

export type DrugInfo = {
  prep?: string;     // préparation / dilution (texte)
  admin?: string;    // mode / voie
  duration?: string; // durée (ex. "sur 10 min", "sur 30 min")
  caution?: string;  // précautions / surveillance
};

export const DRUG_INFOS: Record<string, DrugInfo> = {
  // Anaphylaxie / ACR
  "adrenaline-im": {
    admin: "IM face latéro-externe cuisse",
    prep: "Non diluée (ampoule standard), utiliser seringue IM.",
    caution: "Peut répéter selon protocole si absence d’amélioration.",
  },
  "adrenaline-ivse": {
    admin: "IVSE, débit titré à l’effet",
    prep: "Préparation selon protocole local (ex. 1 mg dans 50 mL = 20 µg/mL).",
    caution: "Monitorage continu (TA/ECG/SpO₂).",
  },
  "adrenaline-bolus-acr": {
    admin: "IV/IO en bolus",
    prep: "Dilution protocolaire (ex. 0,1 mg/mL ou 0,09 mg/mL).",
    duration: "Bolus toutes les 4 min",
    caution: "ACR : respecter l’algorithme et le timing RCP/défi.",
  },
  "amiodarone": {
    admin: "IV (bolus lent)",
    prep: "Utiliser la solution prête / diluer selon protocole.",
    caution: "ACR rythme choquable : administrer après chocs appropriés.",
  },

  // AAG / choc
  "salbutamol-ae": {
    admin: "Nébulisation (AE)",
    prep: "Ampoules 2,5 mg/2,5 mL ou 5 mg/2,5 mL selon âge.",
    caution: "Peut répéter selon protocole (surveillance FC).",
  },
  "solumedrol": {
    admin: "IV",
    prep: "Reconstituer selon notice (ex. 40 mg/mL) et administrer en IVD lent.",
    caution: "Dose unique puis réévaluation clinique.",
  },
  "mgso4": {
    admin: "IV",
    prep: "Diluer dans NaCl 0,9% pour perfusion.",
    duration: "Sur 30 min",
    caution: "Surveillance TA/ECG ; possible IVSE 10 mg/kg/h ensuite.",
  },
  "exacyl": {
    admin: "IV",
    prep: "Diluer dans NaCl 0,9% si nécessaire.",
    duration: "Sur 10 min",
    caution: "Débuter < 3 h après le traumatisme.",
  },

  // EME
  "clonazepam": {
    admin: "IV lent",
    prep: "Dilution selon carte (ex. 0,5 mg/mL).",
    caution: "Surveillance respi ; 1ère ligne EME.",
  },
  "midazolam-buccal": {
    admin: "Buccal/PO",
    prep: "Seringues Buccolam® adaptées au poids/âge.",
    caution: "Alternative si IV non disponible.",
  },
  "phenytoin": {
    admin: "IV",
    prep: "Solution prête ; éviter mélange avec glucose.",
    duration: "Sur 30 min",
    caution: "Surveillance ECG/TA pendant la perfusion.",
  },
  "phenobarbital": {
    admin: "IV",
    prep: "Solution prête ou reconstituée.",
    duration: "Sur 10 min",
    caution: "Surveillance respi.",
  },
  "levetiracetam": {
    admin: "IV",
    prep: "Solution prête à l’emploi (ex. 100 mg/mL) diluée dans NaCl 0,9%.",
    duration: "Sur 10 min",
    caution: "Bien calculer le volume à administrer.",
  },

  // Nouveaux
  "naloxone": {
    admin: "IV/IM/IN",
    prep: "Ampoules prêtes à l’emploi. IN via atomiseur nasal si dispo.",
    caution: "Surveillance ventilatoire — risque de récidive si demi-vie opioïde longue.",
  },
  "flumazenil": {
    admin: "IV",
    prep: "Solution prête. Administrer lentement.",
    caution: "⚠️ Risque de convulsions/sevrage en cas d’intoxication mixte ou épilepsie.",
  },
  "morphine": {
    admin: "IV (bolus ± IVSE)",
    prep: "Dilution selon protocole local (ex. 1 mg/mL).",
    caution: "Surveillance respi/TA, titration antalgique.",
  },
  "adenosine": {
    admin: "IV en bolus RAPIDE + rinçage immédiat",
    prep: "Voie proximale, 3 voies en Y idéalement.",
    caution: "Pause/brady cardie transitoire attendue ; ECG continu.",
  },
  "ceftriaxone": {
    admin: "IV",
    prep: "Reconstituer/diluer selon notice pour perfusion.",
    caution: "Respecter les doses selon indication (sepsis/meningite).",
  },
};
