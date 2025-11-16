"use client";

import { useMemo, useState, type ReactNode } from "react";

import AgeWeightPicker from "@/components/AgeWeightPicker";
import { useAppStore } from "@/store/useAppStore";

type Severity = "légère" | "modérée" | "grave";

const severityStyles: Record<Severity, { bg: string; text: string; badge: string }> = {
  "légère": { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-900", badge: "bg-emerald-600 text-white" },
  "modérée": { bg: "bg-amber-50 border-amber-200", text: "text-amber-900", badge: "bg-amber-600 text-white" },
  "grave": { bg: "bg-rose-50 border-rose-200", text: "text-rose-900", badge: "bg-rose-600 text-white" },
};

type Option<T extends string> = { value: T; label: string; helper?: string };

type ToggleGroupProps<T extends string> = {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
};

function ToggleGroup<T extends string>({ label, value, onChange, options }: ToggleGroupProps<T>) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">{label}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`rounded-2xl border px-3 py-2 text-left text-sm transition ${
                active
                  ? "border-slate-900 bg-slate-900 text-white shadow"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              <span className="font-medium">{opt.label}</span>
              {opt.helper && <span className="block text-xs text-slate-500 mt-0.5">{opt.helper}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="mb-3">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="space-y-4 text-sm text-slate-700">{children}</div>
    </div>
  );
}

type OrientationInfo = {
  label: string;
  tone: "green" | "amber" | "red" | "blue";
  bullets: string[];
  footnote?: string;
};

const toneStyles: Record<OrientationInfo["tone"], { badge: string; text: string; border: string }> = {
  green: { badge: "bg-emerald-600", text: "text-emerald-900", border: "border-emerald-200" },
  amber: { badge: "bg-amber-500", text: "text-amber-900", border: "border-amber-200" },
  red: { badge: "bg-rose-600", text: "text-rose-900", border: "border-rose-200" },
  blue: { badge: "bg-sky-600", text: "text-sky-900", border: "border-sky-200" },
};

const vulnerabilityOptions = [
  "Prématurité < 36 SA",
  "Âge < 2 mois",
  "Cardiopathie / DBP",
  "Immunodépression",
  "Pathologie neuro-musculaire / polyhandicap",
  "Trisomie 21 / indication palivizumab",
];

const environmentOptions = [
  "Précarité / accès difficile aux soins",
  "Tabagisme passif majeur",
  "Crèche ou fratrie en pleine épidémie",
];

export default function ProtocolFlowBronchiolite() {
  const weightKg = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);

  const [stateGeneral, setStateGeneral] = useState<"normal" | "altered">("normal");
  const [respRate, setRespRate] = useState<"lt60" | "60-69" | "ge70" | "lt30">("lt60");
  const [lutte, setLutte] = useState<"aucune" | "moderee" | "intense">("aucune");
  const [spo2, setSpo2] = useState<"gt92" | "90-92" | "lt90">("gt92");
  const [feeding, setFeeding] = useState<"gt50" | "lt50" | "refus">("gt50");
  const [fc, setFc] = useState<"normal" | "high" | "low">("normal");
  const [apnea, setApnea] = useState(false);
  const [vulnerabilities, setVulnerabilities] = useState<string[]>([]);
  const [environment, setEnvironment] = useState<"favorable" | "defavorable">("favorable");
  const [envDetails, setEnvDetails] = useState<string[]>([]);

  const toggleArrayValue = (value: string, list: string[], setter: (next: string[]) => void) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const hasVulnerability = vulnerabilities.length > 0;
  const hasEnvRisk = environment === "defavorable" || envDetails.length > 0;

  const severity = useMemo<Severity>(() => {
    const hasGrave =
      stateGeneral === "altered" ||
      respRate === "ge70" ||
      respRate === "lt30" ||
      lutte === "intense" ||
      spo2 === "lt90" ||
      feeding === "refus" ||
      fc === "high" ||
      fc === "low" ||
      apnea;
    if (hasGrave) return "grave";
    const hasModerate = respRate === "60-69" || lutte === "moderee" || spo2 === "90-92" || feeding === "lt50";
    return hasModerate ? "modérée" : "légère";
  }, [stateGeneral, respRate, lutte, spo2, feeding, fc, apnea]);

  const orientation = useMemo<OrientationInfo>(() => {
    const needsO2 = spo2 !== "gt92";
    const needsNutrition = feeding !== "gt50";
    if (severity === "grave") {
      return {
        label: "Hospitalisation USC / réanimation",
        tone: "red",
        bullets: [
          "Transport médicalisé coordonné avec le 15",
          "Surveillance continue : apnées, hypercapnie, aggravation rapide",
          "HFNC / CPAP d'emblée si échec O₂ bas débit",
        ],
        footnote: "Privilégier SMUR néonatal pour < 2 mois, couchage adapté.",
      };
    }
    if (severity === "modérée" && (needsO2 || needsNutrition || hasVulnerability || hasEnvRisk)) {
      return {
        label: "Hospitalisation UHCD / unité conventionnelle",
        tone: "amber",
        bullets: [
          needsO2 ? "Oxygénothérapie si SpO₂ ≤ 92 % (cible > 92 % à l'éveil)" : "Surveillance cardio-respiratoire",
          needsNutrition
            ? "Support nutritionnel : fractionner, entéral prioritaire si apports < 50 %"
            : "Apports satisfaisants, surveiller",
          hasVulnerability ? "Vulnérabilité identifiée → seuil d'hospitalisation abaissé" : "",
          hasEnvRisk ? "Contexte social défavorable → surveillance hospitalière" : "",
        ].filter(Boolean),
        footnote: "Réévaluation rapprochée pour décider de la montée en charge thérapeutique.",
      };
    }
    if (severity === "modérée") {
      return {
        label: "Surveillance ambulatoire encadrée",
        tone: "blue",
        bullets: [
          "Parents fiables + accès facile aux soins",
          "SpO₂ ≥ 92 % et alimentation proche des apports habituels",
          "Réévaluation dans les 24–48 h (surtout J1-J2)",
        ],
      };
    }
    if (severity === "légère" && (hasVulnerability || hasEnvRisk)) {
      return {
        label: "Discussion hospitalisation / avis spécialisé",
        tone: "amber",
        bullets: [
          hasVulnerability ? "Vulnérabilité (prématurité, < 2 mois, comorbidité)" : "",
          hasEnvRisk ? "Environnement défavorable → surveillance difficile" : "",
          "Baisse du seuil d'admission même si signes légers",
        ].filter(Boolean),
      };
    }
    return {
      label: "Retour domicile + surveillance",
      tone: "green",
      bullets: [
        "DRP pluriquotidienne + fractionnement des repas",
        "Informer sur signes d'alerte (apnées, difficultés alimentaires, cyanose)",
        "Contrôle programmé sous 24–48 h",
      ],
    };
  }, [severity, spo2, feeding, hasVulnerability, hasEnvRisk]);

  const highFlow = useMemo(() => {
    if (typeof weightKg !== "number" || Number.isNaN(weightKg)) return undefined;
    return Number((weightKg * 2).toFixed(1));
  }, [weightKg]);

  const displayFlow = typeof highFlow === "number" ? `${highFlow} L/min` : "—";

  const formatList = (items: string[]) => (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item, idx) => (
        <li key={`${item}-${idx}`}>{item}</li>
      ))}
    </ul>
  );

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-sky-500 to-cyan-500 px-4 pt-6 pb-5 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">{"< 12 mois"}</p>
            <h1 className="text-2xl font-extrabold">Bronchiolite aiguë</h1>
            <p className="text-sm text-white/90">DRP, classification HAS, orientation guidée</p>
          </div>
          <div className="text-3xl" aria-hidden>
            👶💨
          </div>
        </div>
        <div className="mt-4 bg-white text-slate-900 rounded-3xl p-3 shadow-sm">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightKg === "number" ? weightKg : null}
            setWeightKg={(v) => setWeightKg(v ?? 0)}
          />
          <p className="mt-2 text-xs text-slate-500">
            Calculs adaptés au poids pour HFNC (2 L/kg/min) et support nutritionnel.
          </p>
        </div>
      </div>

      <div className="mt-4 px-4 space-y-5">
        <SectionCard title="Évaluation clinique (après DRP)" subtitle="Sélectionne les critères observés">
          <ToggleGroup
            label="État général"
            value={stateGeneral}
            onChange={setStateGeneral}
            options={[
              { value: "normal", label: "Normal" },
              { value: "altered", label: "Altéré", helper: "Hypotonie, mauvaise impression" },
            ]}
          />
          <ToggleGroup
            label="Fréquence respiratoire"
            value={respRate}
            onChange={setRespRate}
            options={[
              { value: "lt60", label: "< 60/min" },
              { value: "60-69", label: "60–69/min" },
              { value: "ge70", label: "≥ 70/min", helper: "Critère grave" },
              { value: "lt30", label: "< 30/min", helper: "Bradypnée" },
            ]}
          />
          <ToggleGroup
            label="Signes de lutte"
            value={lutte}
            onChange={setLutte}
            options={[
              { value: "aucune", label: "Absents / légers" },
              { value: "moderee", label: "Modérés" },
              { value: "intense", label: "Intenses" },
            ]}
          />
          <ToggleGroup
            label="SpO₂ en air ambiant (éveil)"
            value={spo2}
            onChange={setSpo2}
            options={[
              { value: "gt92", label: "> 92 %" },
              { value: "90-92", label: "90–92 %" },
              { value: "lt90", label: "≤ 90 %", helper: "ou cyanose" },
            ]}
          />
          <ToggleGroup
            label="Apports alimentaires"
            value={feeding}
            onChange={setFeeding}
            options={[
              { value: "gt50", label: "> 50 %" },
              { value: "lt50", label: "< 50 % sur 3 prises" },
              { value: "refus", label: "Refus / apports nuls" },
            ]}
          />
          <ToggleGroup
            label="Fréquence cardiaque"
            value={fc}
            onChange={setFc}
            options={[
              { value: "normal", label: "80–180/min" },
              { value: "high", label: "> 180/min" },
              { value: "low", label: "< 80/min" },
            ]}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setApnea((prev) => !prev)}
              className={`rounded-2xl px-3 py-2 text-sm font-medium border transition ${
                apnea ? "border-rose-400 bg-rose-50 text-rose-700" : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {apnea ? "✓" : ""} Apnées observées
            </button>
            <p className="text-xs text-slate-500">Inclut bradypnée {"< 30/min"}</p>
          </div>
        </SectionCard>

        <SectionCard title="Vulnérabilités & environnement">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">Critères de vulnérabilité</p>
            <div className="flex flex-wrap gap-2">
              {vulnerabilityOptions.map((item) => {
                const active = vulnerabilities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleArrayValue(item, vulnerabilities, setVulnerabilities)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition border ${
                      active
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-600 bg-white"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">Environnement</p>
            <div className="flex gap-2">
              {["favorable", "defavorable"].map((opt) => {
                const active = environment === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setEnvironment(opt as "favorable" | "defavorable");
                      if (opt === "favorable") {
                        setEnvDetails([]);
                      }
                    }}
                    className={`flex-1 rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    {opt === "favorable" ? "Favorable" : "Défavorisé"}
                  </button>
                );
              })}
            </div>
            {environment === "defavorable" && (
              <div className="mt-3 flex flex-wrap gap-2">
                {environmentOptions.map((item) => {
                  const active = envDetails.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleArrayValue(item, envDetails, setEnvDetails)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition border ${
                        active
                          ? "border-amber-500 bg-amber-50 text-amber-700"
                          : "border-slate-200 text-slate-600 bg-white"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Prématurés et {"< 2 mois"} : risque d’apnées → seuil d’admission bas, transport pédiatrique spécialisé.
          </p>
        </SectionCard>

        <div className={`rounded-3xl border px-4 py-4 shadow-sm ${severityStyles[severity].bg} ${severityStyles[severity].text}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest">Gravité</p>
              <p className="text-2xl font-extrabold">Forme {severity}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${severityStyles[severity].badge}`}>
              HAS 2019
            </span>
          </div>
          <p className="mt-2 text-sm">
            {severity === "grave"
              ? "Au moins un critère grave présent (apnées, FR ≥ 70/min, SpO₂ ≤ 90 %, état général altéré, FC extrêmes...)."
              : severity === "modérée"
              ? "Au moins un critère modéré sans critère grave (FR 60–69/min, SpO₂ 90–92 %, apports < 50 %...)."
              : "Tous les critères de légèreté sont présents."}
          </p>
        </div>

        <div className={`rounded-3xl border px-4 py-4 shadow-sm ${toneStyles[orientation.tone].border} ${toneStyles[orientation.tone].text}`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Orientation proposée</p>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${toneStyles[orientation.tone].badge}`}>
              {orientation.label}
            </span>
          </div>
          {formatList(orientation.bullets)}
          {orientation.footnote && <p className="mt-2 text-xs text-slate-600">{orientation.footnote}</p>}
        </div>

        <SectionCard title="Oxygénothérapie & ventilation" subtitle="Cibles et calculs">
          {formatList([
            "Indication d'O₂ si SpO₂ ≤ 92 % (cibles > 92 % à l'éveil, > 90 % au sommeil)",
            "Cardiopathie : viser la saturation habituelle du patient",
            "Sevrage quand SpO₂ ≥ 92 % en air ambiant, sans désaturations",
          ])}
          <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-900">
            <p className="text-sm font-semibold">HFNC (lunettes à haut débit)</p>
            <p className="text-xs text-sky-700">Débit recommandé : 2 L/kg/min</p>
            <p className="mt-1 text-lg font-extrabold">{displayFlow}</p>
            <p className="text-xs text-slate-500">Débit = 2 × {Number.isFinite(weightKg) ? `${weightKg} kg` : "poids"}</p>
          </div>
          <p className="text-xs text-slate-500">
            Mise en route HFNC/CPAP en environnement monitoré (UHCD/USC) avec personnel formé.
          </p>
        </SectionCard>

        <SectionCard title="Support nutritionnel & soins de base">
          {formatList([
            "Fractionner les repas, poursuivre l'allaitement (tirer le lait si besoin)",
            "Apports < 50 % persistants → privilégier entéral (sonde) ; VVP en 2ᵉ intention",
            "Hydratation adaptée, maintien des apports caloriques",
            "DRP douce pluriquotidienne, décubitus dorsal (prévention MIN)",
          ])}
        </SectionCard>

        <SectionCard title="Examens complémentaires">
          {formatList([
            "Pas d'examens systématiques (bio, radio, viro) même si fièvre",
            "Gaz du sang si forme grave ou doute hypercapnie",
            "Radio thorax uniquement en cas de doute diagnostique ou aggravation",
            "PCR virale pour raisons épidémiologiques/cohorting uniquement",
          ])}
        </SectionCard>

        <SectionCard title="Traitements non recommandés">
          {formatList([
            "Bronchodilatateurs, adrénaline nébulisée, sérum salé hypertonique systématique",
            "Corticoïdes (IV ou inhalés)",
            "Antibiotiques sans signe bactérien documenté",
            "Caféine, fluidifiants bronchiques, antitussifs, anti-reflux systématiques",
            "Kinésithérapie respiratoire hors DRP douce (AFE/clapping contre-indiqués)",
          ])}
        </SectionCard>

        <SectionCard title="Critères de sortie d'hospitalisation">
          {formatList([
            "Amélioration clinique stable, parents formés aux signes d'alerte",
            "SpO₂ ≥ 92 % en air ambiant",
            "Apports > 50 % des ingesta habituels et reprise de poids",
            "Organisation du suivi ville (pédiatre / médecin traitant)",
            "Toux résiduelle isolée possible jusqu'à 4 semaines",
          ])}
        </SectionCard>
      </div>
    </div>
  );
}
