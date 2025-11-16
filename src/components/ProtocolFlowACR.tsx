"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import AgeWeightPicker from "@/components/AgeWeightPicker";
import { WEIGHT_OVERRIDES } from "@/data/drugs";
import { formatMg } from "@/lib/units";

/* ---------- UI helpers ---------- */
const ACCENT = {
  gray:   { header: "bg-[#455A64]", body: "bg-[#ECEFF1]", border: "border-[#455A64]" },
  blue:   { header: "bg-[#1E88E5]", body: "bg-[#E3F2FD]", border: "border-[#1E88E5]" },
  green:  { header: "bg-[#43A047]", body: "bg-[#E8F5E9]", border: "border-[#43A047]" },
  teal:   { header: "bg-[#00897B]", body: "bg-[#E0F2F1]", border: "border-[#00897B]" },
  orange: { header: "bg-[#EF6C00]", body: "bg-[#FFF3E0]", border: "border-[#EF6C00]" },
  red:    { header: "bg-[#E53935]", body: "bg-[#FFEBEE]", border: "border-[#E53935]" },
  yellow: { header: "bg-[#F9A825]", body: "bg-[#FFF8E1]", border: "border-[#F9A825]" },
  dark:   { header: "bg-[#263238]", body: "bg-[#ECEFF1]", border: "border-[#263238]" },
} as const;

const BoldDose: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="font-extrabold text-gray-900">{children}</span>
);

const Card: React.FC<{
  title: string;
  accent: keyof typeof ACCENT;
  subtitle?: string;
  rightBadge?: string;
  children?: React.ReactNode;
}> = ({ title, accent, subtitle, rightBadge, children }) => {
  const c = ACCENT[accent];
  return (
    <div className={`rounded-3xl overflow-hidden border ${c.border}`}>
      <div className={`px-4 py-2 text-white font-semibold flex items-center justify-between ${c.header} rounded-t-3xl`}>
        <span>{title}</span>
        {rightBadge && (
          <span className="ml-2 text-[10px] tracking-wider uppercase bg-black/15 text-black/70 rounded-md px-2 py-0.5">
            {rightBadge}
          </span>
        )}
      </div>
      <div className={`px-4 py-3 ${c.body}`}>
        {subtitle && <div className="text-sm text-gray-700 mb-1">{subtitle}</div>}
        {children}
      </div>
    </div>
  );
};

/* ---------- helpers médicaux ---------- */
function pickEffectiveWeight(w?: number | null) {
  if (!Number.isFinite(w as number) || (w as number) <= 0) return undefined;
  const rounded = Math.round(w as number);
  const overridesByKg = WEIGHT_OVERRIDES as unknown as Record<number, unknown>;
  const override = overridesByKg?.[rounded];
  return typeof override === "number" && Number.isFinite(override) ? override : (w as number);
}

function calcVT(w?: number) {
  if (!Number.isFinite(w)) return undefined;
  const kg = w as number;
  return { min: Math.round(kg * 6), max: Math.round(kg * 8) };
}

/* ---------- side tags ---------- */
type SideTagId = "5h5t" | "iot" | "ett" | "ecmo";

const SIDE_TAGS: { id: SideTagId; label: string; gradient: string; icon?: React.ReactNode }[] = [
  { id: "5h5t", label: "5H5T", gradient: "from-yellow-300 to-white" },
  { id: "iot", label: "IOT", gradient: "from-yellow-300 to-white" },
  { id: "ett", label: "ETT ?", gradient: "from-yellow-300 to-white" },
  {
    id: "ecmo",
    label: "ECMO ?",
    gradient: "from-orange-400 to-red-400",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V21a1 1 0 01-1 1C11.85 22 2 12.15 2 1a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
      </svg>
    ),
  },
];

/* Couleurs + contraste des bulles */
const BUBBLE_COLORS: Record<SideTagId, string> = {
  "5h5t": "bg-yellow-50/95 border-yellow-500",
  iot: "bg-yellow-50/95 border-yellow-500",
  ett: "bg-yellow-50/95 border-yellow-500",
  ecmo: "bg-red-50/95 border-red-500",
};

export default function ProtocolFlowACR() {
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);
  const weightKg = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  const [rythme, setRythme] = useState<"choquable" | "non-choquable">("non-choquable");

  const [activeTag, setActiveTag] = useState<SideTagId | null>(null);
  const [closingTag, setClosingTag] = useState<SideTagId | null>(null);

  const effWeight = pickEffectiveWeight(weightKg);
  const vt = calcVT(effWeight);
  const ceeJ = effWeight ? Math.round(effWeight * 4) : null;
  const adrenalineUg = effWeight ? Math.round(effWeight * 10) : null;
  const adrenalineMg = adrenalineUg ? adrenalineUg / 1000 : null;
  const amiodaroneMg = effWeight ? Math.min(300, Math.round(effWeight * 5)) : null;

  /* Gestion ouverture / fermeture avec fade-out */
  const openTag = (id: SideTagId) => {
    setClosingTag(null);
    setActiveTag(id);
  };

  const closeTag = () => {
    if (!activeTag) return;
    setClosingTag(activeTag);
    setActiveTag(null);
    setTimeout(() => setClosingTag(null), 160); // durée de l’animation de sortie
  };

  const toggleTag = (id: SideTagId) => {
    if (activeTag === id) {
      closeTag();
    } else {
      openTag(id);
    }
  };

  const currentTag = activeTag ?? closingTag;
  const showOverlay = !!currentTag;
  const animClass = closingTag ? "bubble-animate-out" : "bubble-animate-in";

  return (
    <div className="pb-6">
      {/* HEADER */}
      <div className="rounded-3xl bg-gradient-to-b from-[#E53935] to-[#FF7043] px-4 pt-6 pb-5 text-white shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-wide">ARRÊT CARDIO-RESPIRATOIRE 💗</h1>
        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightKg === "number" ? weightKg : null}
            setWeightKg={(v) => setWeightKg(v ?? 0)}
          />
        </div>
      </div>

      {/* CONTAINER PRINCIPAL */}
      <div className="relative mt-4 px-4">
        {/* Flèche + étiquettes */}
        <div className="absolute right-2 top-0 bottom-0 w-16 z-[10] pointer-events-none">
          {/* shaft */}
          <div
            className="absolute top-0 bottom-7 left-1/2 -translate-x-1/2
                       w-6 sm:w-7 rounded-full
                       bg-gradient-to-b from-indigo-600/35 via-fuchsia-500/30 to-red-500/35
                       pointer-events-none"
          />
          {/* head */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0
                       border-l-[14px] border-r-[14px] border-t-[20px]
                       border-l-transparent border-r-transparent border-t-red-500/45
                       pointer-events-none"
          />

          {/* pile d’étiquettes (cliquables) */}
          <div className="relative z-[20] flex flex-col justify-evenly items-center h-full gap-4 pointer-events-auto">
            {SIDE_TAGS.map((t) => {
              const isOpen = activeTag === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTag(t.id)}
                  className={`w-16 h-16 rounded-xl shadow-sm ring-1 ring-black/10 text-[11px] font-semibold
                              flex flex-col items-center justify-center gap-1 transition
                              bg-gradient-to-b ${t.gradient} text-gray-900
                              ${isOpen ? "scale-105 ring-2 ring-black/20" : "opacity-95 hover:opacity-100"}`}
                >
                  {t.icon && <span className="text-gray-700">{t.icon}</span>}
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="space-y-3 relative z-[5] pr-16 sm:pr-20">
          <Card title="Absence de signe de vie ?" accent="gray">
            <div className="text-sm text-gray-700 whitespace-pre-line">
              {`• Plan dur, LVAS, Guedel, BAVU FiO₂ 100 %
                • 5 VMF puis MCE 15/2
                • DSA/moniteur, IO, SNG`}
            </div>
          </Card>
          <div className="bg-white border border-slate-200 rounded-full shadow-sm p-1 flex gap-1">
            <button
              onClick={() => setRythme("choquable")}
              className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition ${
                rythme === "choquable" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ⚡ Rythme choquable (TV/FV)
            </button>
            <button
              onClick={() => setRythme("non-choquable")}
              className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition ${
                rythme === "non-choquable" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              💔 Rythme non choquable (asystolie, AESP, brady ext)
            </button>
          </div>

          {rythme === "choquable" && (
            <>
              <Card title="CEE 4 J/kg + RCP 2 min" accent="blue" rightBadge="Cycle choc x3">
                <div className="text-sm">
                  Énergie : <BoldDose>{ceeJ ? `${ceeJ} J` : "—"}</BoldDose>{" "}
                  • <span className="text-gray-700">RCP 2 min scope ? pouls ?</span>
                </div>
              </Card>

              <Card title="Adrénaline + Amiodarone" accent="orange">
                <ul className="text-sm leading-6">
                  <li>
                    Adrénaline :{" "}
                    <BoldDose>
                      {adrenalineUg ? `${adrenalineUg} µg (${adrenalineMg?.toFixed(2)} mg)` : "—"}
                    </BoldDose>
                  </li>
                  <li>
                    Amiodarone :{" "}
                    <BoldDose>{amiodaroneMg ? formatMg(amiodaroneMg) : "—"}</BoldDose> (5 mg/kg, max 300 mg)
                  </li>
                </ul>
              </Card>

              <Card title="CEE 4 J/kg + RCP 2 min" accent="blue" rightBadge="Cycle choc x2">
                <div className="text-sm">
                  Énergie : <BoldDose>{ceeJ ? `${ceeJ} J` : "—"}</BoldDose>{" "}
                  • <span className="text-gray-700">RCP 2 min scope ? pouls ?</span>
                </div>
              </Card>

              <Card title="Adrénaline + Amiodarone" accent="orange">
                <ul className="text-sm leading-6">
                  <li>
                    Adrénaline :{" "}
                    <BoldDose>
                      {adrenalineUg ? `${adrenalineUg} µg (${adrenalineMg?.toFixed(2)} mg)` : "—"}
                    </BoldDose>
                  </li>
                  <li>
                    Amiodarone :{" "}
                    <BoldDose>{amiodaroneMg ? formatMg(amiodaroneMg) : "—"}</BoldDose> (5 mg/kg, max 300 mg)
                  </li>
                </ul>
              </Card>

            <Card title="CEE 200 J + RCP 2 min" accent="blue" rightBadge="Cycle choc x2">
                <div className="text-sm">
                  Énergie : <strong>200 J </strong>
                  • <span className="text-gray-700">RCP 2 min scope ? pouls ?</span>
                </div>
              </Card>

            <Card title="Adrénaline 10 µg/kg toutes les 4 min" accent="orange">
              <div className="text-sm">
                Dose :{" "}
                <BoldDose>
                  {adrenalineUg ? `${adrenalineUg} µg (${adrenalineMg?.toFixed(2)} mg)` : "—"}
                </BoldDose>{" "}
                + flush 10 mL NaCl 0,9 %.
              </div>
              <div className="text-sm text-gray-700 mt-1">
                RCP 2 min → scope ? pouls ? Réévaluer le rythme.
              </div>
            </Card>

            </>
          )}

          {rythme === "non-choquable" && (
            <Card title="Adrénaline 10 µg/kg toutes les 4 min" accent="orange">
              <div className="text-sm">
                Dose :{" "}
                <BoldDose>
                  {adrenalineUg ? `${adrenalineUg} µg (${adrenalineMg?.toFixed(2)} mg)` : "—"}
                </BoldDose>{" "}
                + flush 10 mL NaCl 0,9 %.
              </div>
              <div className="text-sm text-gray-700 mt-1">
                RCP 2 min → scope ? pouls ? Réévaluer le rythme.
              </div>
            </Card>
          )}

          <Card title="Post-réanimation" accent="teal">
            <ul className="text-sm leading-6 text-gray-800">
              <li>•Sat ≥ 95 % et normocapnie.</li>
              <li>•PAS normale : remplissage ± adrénaline IVSE.</li>
              <li>•ECG + réévaluation hémodynamique.</li>
              <li>•Hypothermie thérapeutique ± curarisation.</li>
              <li>•Surveillance SG, aspiration, diurèse.</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* ----------------- OVERLAY BULLE CENTRÉE ----------------- */}
      {showOverlay && currentTag && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          onClick={(e) => {
            // clic sur le fond -> fermeture
            if (e.target === e.currentTarget) {
              closeTag();
            }
          }}
        >
          {/* fond sombre + blur */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* bulle centrale */}
          <div
            className={`relative max-w-[420px] w-full rounded-3xl border shadow-2xl px-5 py-4
                        leading-relaxed text-[15px] text-gray-900
                        ${BUBBLE_COLORS[currentTag]}
                        ${animClass}`}
            onClick={(e) => e.stopPropagation()} // clic dans la bulle = pas de fermeture
          >
            {/* contenu selon la pastille */}
            {currentTag === "5h5t" && (
              <>
                <p className="font-semibold mb-2 text-lg">Causes réversibles à rechercher</p>
                <ul className="text-[15px] grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-gray-800">
                  <li>Hypoxie / Hypercapnie</li>
                  <li>Hypovolémie</li>
                  <li>Hypo-/Hyperkaliémie</li>
                  <li>Hypothermie</li>
                  <li>Hypoglycémie</li>
                  <li>Thromboses (SCA/EP)</li>
                  <li>Pneumothorax</li>
                  <li>Tamponnade</li>
                  <li>Toxiques</li>
                  <li>Embolie pulmonaire</li>
                </ul>
              </>
            )}

            {currentTag === "iot" && (
              <>
                <p className="font-semibold mb-2 text-lg">IOT</p>
                <p className="text-[15px] text-gray-800">
                  ETCO₂, MCE continu. <br />
                  Ventilation : FiO₂ 100 %, I/E 1/3–1/5, PEP 0–2, VT{" "}
                  <BoldDose>{vt ? `${vt.min}–${vt.max} mL` : "—"}</BoldDose> (6–8 mL/kg).
                </p>
              </>
            )}

            {currentTag === "ett" && (
              <>
                <p className="font-semibold mb-2 text-lg">ETT ?</p>
                <p className="text-[15px] text-gray-800">
                  Recherche de cause réversible, guidage thérapeutique.
                </p>
              </>
            )}

            {currentTag === "ecmo" && (
              <>
                <p className="font-semibold mb-3 text-lg flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V21a1 1 0 01-1 1C11.85 22 2 12.15 2 1a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
                    </svg>
                  </span>
                  ECMO — contacts
                </p>
                <p className="font-semibold text-[15px]">Poitiers • 05 49 44 43 94</p>
                <p className="font-semibold text-[15px]">Bordeaux • 05 57 65 67 19</p>
              </>
            )}

            {/* Bouton de fermeture pour le confort mobile */}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={closeTag}
                className="text-sm font-medium text-slate-700 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white shadow-sm border border-black/5"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
