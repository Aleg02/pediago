import { FlowBlock, FlowRibbon, FlowChevron } from "./flow/FlowParts";

export default function ProtocolFlowEME() {
  return (
    <div className="w-full space-y-3">
      <FlowBlock
        title="ABC — Sécuriser"
        items={["O₂, voie veineuse, glycémie capillaire"]}
      />
      <FlowChevron />

      <FlowRibbon
        title="1ʳᵉ ligne — Clonazépam 0,015 mg/kg IV"
        subtitle="(ou Midazolam 0,3 mg/kg buccal/PO si IV non dispo)"
        gradient="from-rose-500 to-red-600"
        rightBadge="1ʳᵉ ligne"
      />
      <FlowChevron />

      <FlowRibbon
        title="2ᵉ ligne"
        subtitle="Phénytoïne 20 mg/kg sur 30′ • Phénobarbital 15 mg/kg sur 10′ • Lévétiracétam 40 mg/kg sur 10′"
        gradient="from-amber-500 to-yellow-600"
        rightBadge="2ᵉ ligne"
      />
      <FlowChevron />

      <FlowBlock
        title="Escalade / Référer"
        items={["Voie aérienne si nécessaire", "Réa si réfractaire"]}
        bg="bg-blue-50"
      />
    </div>
  );
}
