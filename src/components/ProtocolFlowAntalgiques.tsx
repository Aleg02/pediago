"use client";

import { useMemo, useState } from "react";
import AgeWeightPicker from "@/components/AgeWeightPicker";
import { useAppStore } from "@/store/useAppStore";
import { formatMg } from "@/lib/units";

const ACCENT = {
  blue: { header: "bg-[#1E88E5]", body: "bg-[#E3F2FD]", border: "border-[#1E88E5]" },
  teal: { header: "bg-[#00897B]", body: "bg-[#E0F2F1]", border: "border-[#00897B]" },
  orange: { header: "bg-[#F57C00]", body: "bg-[#FFF3E0]", border: "border-[#F57C00]" },
  red: { header: "bg-[#E53935]", body: "bg-[#FFEBEE]", border: "border-[#E53935]" },
  yellow: { header: "bg-[#F9A825]", body: "bg-[#FFF8E1]", border: "border-[#F9A825]" },
  gray: { header: "bg-[#455A64]", body: "bg-[#ECEFF1]", border: "border-[#455A64]" },
  purple: { header: "bg-[#8E24AA]", body: "bg-[#F3E5F5]", border: "border-[#8E24AA]" },
  green: { header: "bg-[#43A047]", body: "bg-[#E8F5E9]", border: "border-[#43A047]" },
} as const;

type Accent = keyof typeof ACCENT;

type DoseContext = {
  weightKg?: number;
  paracetamolRange?: { min: number; max: number };
  ibuprofenRange?: { min: number; max: number };
  aspirinRange?: { min: number; max: number };
  tramadolDose?: number;
  morphineBolus?: number;
  morphinePo?: number;
  morphinePerf?: number;
  nubainDose?: number;
  hypnovelRange?: { min: number; max: number };
  hypnovelPerf?: number;
  flumazenilDose?: number;
  ketamineIvRange?: { min: number; max: number };
  ketamineImRange?: { min: number; max: number };
  ketaminePerf?: number;
  ketaminePic?: number;
};

type Block = {
  id: string;
  title: string;
  accent: Accent;
  badge?: string;
  description?: string;
  render: (ctx: DoseContext) => React.ReactNode;
};

type Palier = {
  id: string;
  title: string;
  accent: Accent;
  badge?: string;
  description?: string;
  blocks: Block[];
};

const BoldDose: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="font-semibold text-gray-900">{children}</span>
);

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="ml-2 text-[10px] uppercase tracking-wide rounded-md bg-black/10 text-black/70 px-2 py-0.5">
    {children}
  </span>
);

const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.23 7.21a.75.75 0 011.06.02L10 10.207l3.71-2.978a.75.75 0 01.94 1.17l-4.25 3.41a.75.75 0 01-.94 0l-4.25-3.41a.75.75 0 01.02-1.189z"
      fill="currentColor"
    />
  </svg>
);

const PalierCard: React.FC<{
  palier: Palier;
  isOpen: boolean;
  onToggle: () => void;
  blocksState: Record<string, boolean>;
  onToggleBlock: (id: string) => void;
  ctx: DoseContext;
}> = ({ palier, isOpen, onToggle, blocksState, onToggleBlock, ctx }) => {
  const colors = ACCENT[palier.accent];
  return (
    <div className={`rounded-3xl border ${colors.border} overflow-hidden`}> 
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-5 py-3 text-left text-white ${colors.header}`}
        aria-expanded={isOpen}
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.08em] uppercase opacity-80">{palier.title}</p>
          {palier.description && <p className="text-sm font-medium mt-0.5 text-white/90">{palier.description}</p>}
        </div>
        <div className="flex items-center">
          {palier.badge && <Badge>{palier.badge}</Badge>}
          <Chevron open={isOpen} />
        </div>
      </button>
      {isOpen && (
        <div className={`px-5 py-4 space-y-3 ${colors.body}`}>
          {palier.blocks.map((block) => (
            <BlockCard
              key={block.id}
              block={block}
              isOpen={blocksState[block.id] ?? true}
              onToggle={() => onToggleBlock(block.id)}
              ctx={ctx}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const BlockCard: React.FC<{
  block: Block;
  isOpen: boolean;
  onToggle: () => void;
  ctx: DoseContext;
}> = ({ block, isOpen, onToggle, ctx }) => {
  const colors = ACCENT[block.accent];
  return (
    <div className={`rounded-2xl border ${colors.border} overflow-hidden bg-white shadow-sm`}>
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-2 text-left font-semibold text-white ${colors.header}`}
        aria-expanded={isOpen}
      >
        <span>{block.title}</span>
        <div className="flex items-center gap-2">
          {block.badge && <Badge>{block.badge}</Badge>}
          <Chevron open={isOpen} />
        </div>
      </button>
      {isOpen && (
        <div className={`px-4 py-3 text-sm text-slate-700 space-y-2 ${colors.body}`}>
          {block.description && <p>{block.description}</p>}
          {block.render(ctx)}
        </div>
      )}
    </div>
  );
};

export default function ProtocolFlowAntalgiques() {
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);
  const weightKgStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  const weightKg = useMemo(() => (Number.isFinite(weightKgStore) ? (weightKgStore as number) : undefined), [weightKgStore]);

  const ctx = useMemo<DoseContext>(() => {
    if (!Number.isFinite(weightKg)) {
      return { weightKg: undefined };
    }
    const w = weightKg as number;
    const round = (value: number, digits = 1) => {
      const factor = Math.pow(10, digits);
      return Math.round(value * factor) / factor;
    };
    const range = (min: number, max: number, digits = 1) => ({
      min: round(min, digits),
      max: round(max, digits),
    });

    return {
      weightKg: w,
      paracetamolRange: range(w * 10, w * 15, 0),
      ibuprofenRange: range(w * 5, w * 10, 0),
      aspirinRange: range(w * 3, w * 5, 0),
      tramadolDose: round(w * 1, 1),
      morphineBolus: round(w * 0.1, 2),
      morphinePo: round(w * 1, 1),
      morphinePerf: round(w * 0.02, 3),
      nubainDose: round(w * 0.2, 2),
      hypnovelRange: range(w * 0.05, w * 0.1, 2),
      hypnovelPerf: round(w * 0.05, 2),
      flumazenilDose: round(w * 0.01, 2),
      ketamineIvRange: range(w * 0.5, w * 1, 2),
      ketamineImRange: range(w * 2, w * 4, 1),
      ketaminePerf: round(w * 0.05, 2),
      ketaminePic: round(w * 0.5, 2),
    };
  }, [weightKg]);

  const paliers = useMemo<Palier[]>(() => [
    {
      id: "palier1",
      title: "Palier 1",
      accent: "blue",
      badge: "Douleur légère",
      description: "Analgésie de première intention",
      blocks: [
        {
          id: "solutions-sucrees",
          title: "Solutions sucrées",
          accent: "yellow",
          render: () => (
            <ul className="space-y-1 list-disc pl-4">
              <li><BoldDose>2 mL</BoldDose> de solution glucosée 30 % à faire téter.</li>
              <li>Analgésie courte durée idéale pour le nourrisson &lt; 4 mois.</li>
            </ul>
          ),
        },
        {
          id: "meopa",
          title: "MEOPA",
          accent: "teal",
          render: () => (
            <ul className="space-y-1 list-disc pl-4">
              <li>Gaz équimolaire O₂/N₂O en inhalation continue sous surveillance.</li>
              <li>Action rapide, parfait pour gestes courts ou douleurs procédurales.</li>
            </ul>
          ),
        },
        {
          id: "emla",
          title: "EMLA®",
          accent: "teal",
          render: () => (
            <ul className="space-y-1 list-disc pl-4">
              <li>Crème lidocaïne/prilocaïne épaisse sur peau saine, sous pansement occlusif.</li>
              <li>Application 45–60 min avant geste cutané (VVP, PL…).</li>
            </ul>
          ),
        },
        {
          id: "paracetamol",
          title: "Paracétamol",
          accent: "green",
          badge: "≥ 4 kg",
          render: (info) => (
            <ul className="space-y-1 list-disc pl-4">
              <li>
                PO ou IV : {info.paracetamolRange ? (
                  <BoldDose>
                    {formatMg(info.paracetamolRange.min)} – {formatMg(info.paracetamolRange.max)}
                  </BoldDose>
                ) : (
                  <BoldDose>10–15 mg/kg</BoldDose>
                )} toutes les 6 h.
              </li>
              <li>Max 60 mg/kg/j (attention IR, hépatopathie).</li>
            </ul>
          ),
        },
        {
          id: "ibuprofene",
          title: "Ibuprofène",
          accent: "green",
          badge: "> 3 mois",
          render: (info) => (
            <ul className="space-y-1 list-disc pl-4">
              <li>
                PO : {info.ibuprofenRange ? (
                  <BoldDose>
                    {formatMg(info.ibuprofenRange.min)} – {formatMg(info.ibuprofenRange.max)}
                  </BoldDose>
                ) : (
                  <BoldDose>5–10 mg/kg</BoldDose>
                )} toutes les 6–8 h.
              </li>
              <li>Max 30 mg/kg/j, éviter si déshydratation ou pathologie rénale.</li>
            </ul>
          ),
        },
        {
          id: "aspirine",
          title: "Aspirine",
          accent: "green",
          badge: "> 3 mois",
          render: (info) => (
            <ul className="space-y-1 list-disc pl-4">
              <li>
                PO : {info.aspirinRange ? (
                  <BoldDose>
                    {formatMg(info.aspirinRange.min)} – {formatMg(info.aspirinRange.max)}
                  </BoldDose>
                ) : (
                  <BoldDose>3–5 mg/kg</BoldDose>
                )} toutes les 6 h.
              </li>
              <li>Indiquer si contre-indications virales/saignement absentes.</li>
            </ul>
          ),
        },
      ],
    },
    {
      id: "palier2",
      title: "Palier 2",
      accent: "orange",
      badge: "Douleur modérée",
      description: "Tramadol ou palier 1 renforcé",
      blocks: [
        {
          id: "tramadol",
          title: "Tramadol",
          accent: "orange",
          badge: "> 3 ans",
          render: (info) => (
            <ul className="space-y-1 list-disc pl-4">
              <li>
                PO ou IV : {info.tramadolDose ? (
                  <BoldDose>{formatMg(info.tramadolDose)}</BoldDose>
                ) : (
                  <BoldDose>1 mg/kg</BoldDose>
                )} toutes les 6 h.
              </li>
              <li>Max 8 mg/kg/j. Surveiller somnolence et nausées.</li>
            </ul>
          ),
        },
      ],
    },
    {
      id: "palier3",
      title: "Palier 3",
      accent: "red",
      badge: "Douleur sévère",
      description: "Opioïdes ± sédation",
      blocks: [
        {
          id: "morphine",
          title: "Morphine",
          accent: "red",
          render: (info) => (
            <ul className="space-y-1 list-disc pl-4">
              <li>
                IV lente : {info.morphineBolus ? (
                  <BoldDose>{formatMg(info.morphineBolus)}</BoldDose>
                ) : (
                  <BoldDose>0,1 mg/kg</BoldDose>
                )} toutes les 6 h.
              </li>
              <li>
                PO : {info.morphinePo ? (
                  <BoldDose>{formatMg(info.morphinePo)}</BoldDose>
                ) : (
                  <BoldDose>1 mg/kg</BoldDose>
                )} toutes les 6 h.
              </li>
              <li>
                PIC : {info.morphinePerf ? (
                  <BoldDose>{formatMg(info.morphinePerf)}/h</BoldDose>
                ) : (
                  <BoldDose>0,02 mg/kg/h</BoldDose>
                )} après titration.
              </li>
              <li>Enfant &lt; 6 mois : surveillance rapprochée. Antagoniste : Naloxone.</li>
            </ul>
          ),
        },
        {
          id: "nubain",
          title: "Nubain® (nalbuphine)",
          accent: "purple",
          render: (info) => (
            <ul className="space-y-1 list-disc pl-4">
              <li>
                IVL sur 20 min : {info.nubainDose ? (
                  <BoldDose>{formatMg(info.nubainDose)}</BoldDose>
                ) : (
                  <BoldDose>0,2 mg/kg</BoldDose>
                )}.
              </li>
              <li>Alternative si morphine insuffisante. Antagoniste : Naloxone.</li>
            </ul>
          ),
        },
        {
          id: "hypnovel",
          title: "Hypnovel® (midazolam)",
          accent: "gray",
          render: (info) => (
            <ul className="space-y-1 list-disc pl-4">
              <li>
                Bolus IV : {info.hypnovelRange ? (
                  <BoldDose>
                    {formatMg(info.hypnovelRange.min)} – {formatMg(info.hypnovelRange.max)}
                  </BoldDose>
                ) : (
                  <BoldDose>0,05–0,1 mg/kg</BoldDose>
                )} toutes les 30 min (max 4 mg).
              </li>
              <li>
                IVL : {info.hypnovelPerf ? (
                  <BoldDose>{formatMg(info.hypnovelPerf)}/h</BoldDose>
                ) : (
                  <BoldDose>0,05 mg/kg/h</BoldDose>
                )} selon surveillance.
              </li>
              <li>Antagoniste : Flumazénil {info.flumazenilDose ? (
                <BoldDose>{formatMg(info.flumazenilDose)}</BoldDose>
              ) : (
                <BoldDose>0,01 mg/kg</BoldDose>
              )} (max 1 mg) en titration lente.</li>
            </ul>
          ),
        },
        {
          id: "ketamine",
          title: "Kétamine",
          accent: "teal",
          badge: "Pas d'AMM",
          render: (info) => (
            <ul className="space-y-1 list-disc pl-4">
              <li>
                IV lente : {info.ketamineIvRange ? (
                  <BoldDose>
                    {formatMg(info.ketamineIvRange.min)} – {formatMg(info.ketamineIvRange.max)}
                  </BoldDose>
                ) : (
                  <BoldDose>0,5–1 mg/kg</BoldDose>
                )} sur 5 min (max 2 mg/kg).
              </li>
              <li>
                IM : {info.ketamineImRange ? (
                  <BoldDose>
                    {formatMg(info.ketamineImRange.min)} – {formatMg(info.ketamineImRange.max)}
                  </BoldDose>
                ) : (
                  <BoldDose>2–4 mg/kg</BoldDose>
                )} pour gestes rapides.
              </li>
              <li>
                IVL : {info.ketaminePerf ? (
                  <BoldDose>{formatMg(info.ketaminePerf)}/min</BoldDose>
                ) : (
                  <BoldDose>0,05 mg/kg/min</BoldDose>
                )} ; PIC analgésique : {info.ketaminePic ? (
                  <BoldDose>{formatMg(info.ketaminePic)}/h</BoldDose>
                ) : (
                  <BoldDose>0,5 mg/kg/h</BoldDose>
                )}.
              </li>
              <li>Surveillance respi et tensionnelle continue.</li>
            </ul>
          ),
        },
      ],
    },
  ], []);

  const [openPaliers, setOpenPaliers] = useState<Record<string, boolean>>({
    palier1: true,
    palier2: true,
    palier3: true,
  });

  const [openBlocks, setOpenBlocks] = useState<Record<string, boolean>>({
    "solutions-sucrees": true,
    meopa: true,
    emla: true,
    paracetamol: true,
    ibuprofene: false,
    aspirine: false,
    tramadol: true,
    morphine: true,
    nubain: false,
    hypnovel: false,
    ketamine: false,
  });

  const togglePalier = (id: string) =>
    setOpenPaliers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

  const toggleBlock = (id: string) =>
    setOpenBlocks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

  return (
    <div className="pb-6">
      <div className="rounded-3xl bg-gradient-to-b from-[#5C6BC0] to-[#7E57C2] px-4 pt-6 pb-5 text-white shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-wide">ANTALGIQUES 🎯</h1>
        <p className="text-sm text-white/80 mt-1">Adapter la stratégie selon le palier et la réévaluation clinique.</p>
        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(value) => setAgeLabel(value)}
            weightKg={Number.isFinite(weightKg) ? (weightKg as number) : null}
            setWeightKg={(value) => setWeightKg(value ?? 0)}
          />
        </div>
      </div>

      <div className="relative mt-6 px-4">
        <div className="absolute left-9 top-0 bottom-4 w-px bg-slate-200" />
        <div className="space-y-6">
          {paliers.map((palier, index) => (
            <div key={palier.id} className="relative pl-12">
              <div className="absolute left-[18px] top-3 flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-300 shadow-sm font-semibold text-slate-700">
                {index + 1}
              </div>
              <PalierCard
                palier={palier}
                isOpen={openPaliers[palier.id] ?? true}
                onToggle={() => togglePalier(palier.id)}
                blocksState={openBlocks}
                onToggleBlock={toggleBlock}
                ctx={ctx}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
