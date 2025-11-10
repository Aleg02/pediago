/* eslint-disable @typescript-eslint/no-explicit-any */
export type PrepInfo = {
  stock_conc_mg_per_ml?: number; // ex: propofol 10 mg/mL
  final_conc_mg_per_ml?: number; // ex: dilution finale 0.1 mg/mL
  drug_mg?: number;              // mg de substance ajoutée
  diluent_ml?: number;           // mL de solvant ajouté
};

export type DoseCommon = {
  // numéros "bruts" quand disponibles (mg, µg, débits, durées…)
  dose_mg_per_kg?: number;
  dose_mg?: number;
  dose_ug_per_kg?: number;
  dose_ug?: number;
  dose_mg_per_kg_per_h?: number;
  dose_ug_per_kg_per_min?: number;
  dose_mg_per_h?: number;
  dose_ug_per_min?: number;

  admin_over_min?: number;   // durée d’administration (bolus perf) en minutes
  volume_ml?: number;        // volume final à administrer (si déjà calculé/carte)
  rate_ml_per_h?: number;    // débit mL/h (si déjà calculé/carte)

  prep?: PrepInfo;           // infos de préparation/dilution/concentration
  note?: string;             // texte libre, précision clinique
  [k: string]: any;          // tolère clés additionnelles (p.ex. texte carte)
};

export type PosologySections = Record<string, Record<string, DoseCommon>>;

export type PosologyWeightEntry = {
  kg: number;

  // sections fréquentes extraites en tête (si présentes)
  constantes?: { fc_min?: number; fc_max?: number; pas?: number; fr?: number; [k: string]: any };
  iot?: { lame?: string; tube?: { type?: string; size?: number }; distance_cm?: string; sng_ch?: string; [k: string]: any };

  // toutes les autres sections (isr, sedation, état de choc, etc.)
  sections?: PosologySections;

  // bloc brut original (pour retrouver les champs non mappés)
  data?: any;
};

export type PosologyFile = {
  __meta?: Record<string, any>;
  weights: PosologyWeightEntry[];
};
