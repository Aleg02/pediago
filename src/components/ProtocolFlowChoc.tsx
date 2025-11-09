import { FlowBlock, FlowRibbon, FlowChevron } from "./flow/FlowParts";

export default function ProtocolFlowChoc() {
  return (
    <div className="w-full space-y-3">
      <FlowBlock
        title="Évaluation initiale (ABC)"
        items={["O₂, deux VVP, scope, bilan lésionnel rapide"]}
      />
      <FlowChevron />

      <FlowRibbon
        title="EXACYL — 15 mg/kg IV sur 10′ (max 1 g)"
        subtitle="À débuter < 3 h après trauma"
        gradient="from-fuchsia-500 to-purple-600"
        rightBadge="Immédiat"
      />
      <FlowChevron />

      <FlowBlock
        title="Contrôle hémorragie"
        items={["Compression / Garrot / Pansement hémostatique", "Chirurgie / Embolisation si besoin"]}
        bg="bg-white"
      />
      <FlowChevron />

      <FlowRibbon
        title="Remplissage / Transfusion"
        subtitle="Stratégie hémostatique, selon protocole local"
        gradient="from-amber-500 to-yellow-600"
        rightBadge="Réanimation"
      />
      <FlowChevron />

      <FlowBlock
        title="Cibles & Surveillance"
        items={["TA, fréquence, lactates", "Température, coagulopathie", "Réevaluation rapprochée"]}
        bg="bg-blue-50"
      />
    </div>
  );
}
