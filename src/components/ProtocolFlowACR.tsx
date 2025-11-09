import { FlowBlock, FlowRibbon, FlowChevron } from "./flow/FlowParts";

export default function ProtocolFlowACR() {
  return (
    <div className="w-full space-y-3">
      <FlowBlock
        title="RCP de haute qualité"
        items={["Compressions 100–120/min, ventilation, monitoring", "Défibrillation si rythme choquable"]}
      />
      <FlowChevron />

      <FlowRibbon
        title="Adrénaline bolus — 10 µg/kg (0,01 mg/kg) IV/IO"
        subtitle="Toutes les 4 min (dilution protocolaire)"
        gradient="from-slate-800 to-slate-600"
        rightBadge="Médic"
      />
      <FlowChevron />

      <FlowRibbon
        title="Amiodarone — 5 mg/kg IV"
        subtitle="Rythme choquable"
        gradient="from-indigo-500 to-blue-600"
        rightBadge="Si chocable"
      />
      <FlowChevron />

      <FlowBlock
        title="Réversibles (H & T)"
        items={["Hypoxie, Hypovolémie, Hypo/hyperK+, Hypothermie", "Tamponnade, Tension pneumothorax, Thrombose, Toxiques"]}
        bg="bg-yellow-50"
      />
    </div>
  );
}
