// src/data/drugs.ts
import type { DosingRule, WeightOverride } from "@/lib/dosing";

/** =========================
 *  💊 Catalogue médicaments
 *  ========================= */
export type Drug = {
  id: string;
  name: string;
  unit?: string;   // unité principale affichée (mg, µg/kg/min, g…)
  route?: string;  // voie (IM, IV, IVSE, AE, PO…)
  note?: string;
};

export const DRUGS: Drug[] = [
  // Anaphylaxie / ACR / AAG / EME (déjà présents)
  { id: "adrenaline-im",        name: "Adrénaline",                          unit: "mg",        route: "IM" },
  { id: "adrenaline-ivse",      name: "Adrénaline",                          unit: "µg/kg/min", route: "IVSE" },
  { id: "adrenaline-bolus-acr", name: "Adrénaline (bolus ACR)",              unit: "mg",        route: "IV/IO" },
  { id: "amiodarone",           name: "Amiodarone",                          unit: "mg",        route: "IV" },
  { id: "salbutamol-ae",        name: "Salbutamol (nébulisation)",           unit: "mg",        route: "AE" },
  { id: "solumedrol",           name: "Solumédrol (méthylprednisolone)",     unit: "mg",        route: "IV" },
  { id: "mgso4",                name: "Sulfate de magnésium (MgSO₄)",        unit: "mg",        route: "IV" },
  { id: "exacyl",               name: "Exacyl (acide tranexamique)",         unit: "mg",        route: "IV" },
  { id: "clonazepam",           name: "Clonazépam (Rivotril®)",              unit: "mg",        route: "IV" },
  { id: "midazolam-buccal",     name: "Midazolam (Buccolam® / PO)",          unit: "mg",        route: "PO/BU" },
  { id: "phenytoin",            name: "Phénytoïne (Dilantin®)",              unit: "mg",        route: "IV" },
  { id: "phenobarbital",        name: "Phénobarbital (Gardénal®)",           unit: "mg",        route: "IV" },
  { id: "levetiracetam",        name: "Lévétiracétam (Keppra®)",             unit: "mg",        route: "IV" },

  // 🔸 Nouveaux (structure + affichage prêts ; doses à coller via cartes)
  { id: "naloxone",             name: "Naloxone",                            unit: "mg",        route: "IV/IM/IN" },
  { id: "flumazenil",           name: "Flumazénil",                          unit: "mg",        route: "IV" },
  { id: "morphine",             name: "Morphine",                            unit: "mg",        route: "IV" },
  { id: "adenosine",            name: "Adénosine",                           unit: "mg",        route: "IV" },
  { id: "ceftriaxone",          name: "Céftriaxone",                         unit: "mg",        route: "IV" },
];

/** =========================
 *  ⚖️ Règles de calcul
 *  =========================
 *  NOTE IMPORTANTE: pour les 5 nouveaux, on met volontairement
 *  des règles "range" textuelles (aucun chiffre inventé).
 *  Dès que tu m’envoies les posologies exactes des cartes,
 *  on remplace par mg_per_kg / fixed + overrides si besoin.
 */
export const DOSING_RULES: Record<string, DosingRule> = {
  // --- existants (inchangés) ---
  "adrenaline-im": { basis: "mg_per_kg", mg_per_kg: 0.01, per_dose: true, max_dose_mg: 0.5, rounding_step_mg: 0.01, frequency_text: "IM, à répéter selon protocole clinique", route: "IM" },
  "adrenaline-ivse": { basis: "fixed", per_dose: false, route: "IVSE", notes: "Débit titré à l'effet, monitoré. Voir protocole." },
  "adrenaline-bolus-acr": { basis: "mg_per_kg", mg_per_kg: 0.01, per_dose: true, rounding_step_mg: 0.01, route: "IV/IO", frequency_text: "Bolus toutes les 4 min", notes: "Dilution protocolaire." },
  "amiodarone": { basis: "mg_per_kg", mg_per_kg: 5, per_dose: true, rounding_step_mg: 5, route: "IV", notes: "ACR rythme choquable : 5 mg/kg en bolus lent." },
  "solumedrol": { basis: "mg_per_kg", mg_per_kg: 2, per_dose: true, rounding_step_mg: 10, route: "IV", notes: "2 mg/kg IV (AAG/anaphylaxie)." },
  "salbutamol-ae": { basis: "range", per_dose: true, route: "AE", notes: "2,5 mg ≤6 ans ; 5 mg >6 ans (lié à l’âge dans l’UI)." },
  "mgso4": { basis: "mg_per_kg", mg_per_kg: 50, per_dose: true, max_dose_mg: 2000, rounding_step_mg: 50, route: "IV", notes: "50 mg/kg (max 2 g) sur 30 min." },
  "exacyl": { basis: "mg_per_kg", mg_per_kg: 15, per_dose: true, max_dose_mg: 1000, rounding_step_mg: 50, route: "IV", notes: "15 mg/kg (max 1 g) sur 10 min (<3h trauma)." },
  "clonazepam": { basis: "mg_per_kg", mg_per_kg: 0.015, per_dose: true, rounding_step_mg: 0.005, route: "IV", notes: "EME 1ère ligne." },
  "midazolam-buccal": { basis: "mg_per_kg", mg_per_kg: 0.3, per_dose: true, rounding_step_mg: 0.5, route: "PO/BU", notes: "Altern. si IV non dispo (EME)." },
  "phenytoin": { basis: "mg_per_kg", mg_per_kg: 20, per_dose: true, rounding_step_mg: 25, route: "IV", notes: "Charge sur 30 min (EME)." },
  "phenobarbital": { basis: "mg_per_kg", mg_per_kg: 15, per_dose: true, rounding_step_mg: 25, route: "IV", notes: "Charge sur 10 min (EME)." },
  "levetiracetam": { basis: "mg_per_kg", mg_per_kg: 40, per_dose: true, rounding_step_mg: 50, route: "IV", notes: "Charge sur 10 min (EME)." },

  // --- nouveaux (placeholder sécurisés) ---
  "naloxone":   { basis: "range", per_dose: true, route: "IV/IM/IN", notes: "Posologie exacte à coller depuis tes cartes (dépression respi/overdose opioïdes)." },
  "flumazenil": { basis: "range", per_dose: true, route: "IV",       notes: "Posologie exacte à coller depuis tes cartes (antagoniste benzodiazépines). ⚠️ Sevrage/convulsions : utiliser avec prudence." },
  "morphine":   { basis: "range", per_dose: true, route: "IV",       notes: "Antalgie : posologie exacte à coller depuis tes cartes (bolus/IVSE, dilution)." },
  "adenosine":  { basis: "range", per_dose: true, route: "IV",       notes: "TSV : posologie exacte à coller depuis tes cartes (bolus rapide + rinçage)." },
  "ceftriaxone":{ basis: "range", per_dose: true, route: "IV",       notes: "Sepsis/Méningite : posologie exacte à coller depuis tes cartes (mg/kg et fréquences)." },
};

/** =========================
 *  📊 Overrides (cartes)
 *  =========================
 *  Adrénaline IM 3→50 kg = 0,01 mg/kg (valeurs sûres).
 */
const adrenalineIM_3_50: WeightOverride[] = Array.from({ length: 48 }, (_, i) => {
  const kg = i + 3; // 3 → 50
  return { min_kg: kg, max_kg: kg, dose_mg: Number((kg * 0.01).toFixed(2)), note: `Carte ${kg} kg` };
});

export const WEIGHT_OVERRIDES: Record<string, WeightOverride[]> = {
  "adrenaline-im": adrenalineIM_3_50,

  // Les suivants restent sur la règle générique / range
  "adrenaline-ivse": [],
  "adrenaline-bolus-acr": [],
  "amiodarone": [],
  "salbutamol-ae": [],
  "solumedrol": [],
  "mgso4": [],
  "exacyl": [],
  "clonazepam": [],
  "midazolam-buccal": [],
  "phenytoin": [],
  "phenobarbital": [],
  "levetiracetam": [],

  // nouveaux
  "naloxone": [],
  "flumazenil": [],
  "morphine": [],
  "adenosine": [],
  "ceftriaxone": [],
};

/** =========================
 *  🩺 Médicaments par protocole
 *  =========================
 *  NOTE: mapping minimal conservateur (on n’active pas d’écrans
 *  sans avoir les protocoles correspondants en place).
 */
export const PROTOCOL_DRUGS: Record<string, string[]> = {
  "anaphylaxie":       ["adrenaline-im", "adrenaline-ivse", "solumedrol"],
  "aag":               ["salbutamol-ae", "solumedrol", "mgso4"],
  "choc-hemorragique": ["exacyl", "adrenaline-im"],
  "acr-enfant":        ["adrenaline-bolus-acr", "amiodarone"],
  "eme":               ["clonazepam", "midazolam-buccal", "phenytoin", "phenobarbital", "levetiracetam"],

  // Tu activeras ces lignes dès que tu auras les protocoles correspondants :
  // "intoxication-opioides": ["naloxone"],
  // "intoxication-bzd": ["flumazenil"],
  // "douleur-aigue": ["morphine"],
  // "tsv": ["adenosine"],
  // "sepsis-meningite": ["ceftriaxone"],
};
