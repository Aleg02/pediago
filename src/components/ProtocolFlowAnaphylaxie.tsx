import { FlowBlock, FlowRibbon, FlowChevron } from "./flow/FlowParts";

export default function ProtocolFlowAnaphylaxie() {
  return (
    <div className="w-full space-y-3">
      <FlowBlock
        title="Suspicion d’anaphylaxie"
        items={["Scope, O₂, accès veineux, arrêt exposition allergène"]}
      />
      <FlowChevron />

      <FlowRibbon
        title="ADRÉNALINE IM — 0,01 mg/kg"
        subtitle="Face latéro-externe de cuisse. Répéter si besoin."
        gradient="from-pink-500 to-rose-600"
        rightBadge="Immédiat"
      />
      <FlowChevron />

      <FlowBlock
        title="Mesures associées"
        items={[
          "Solumédrol IV 2 mg/kg",
          "Salbutamol AE si bronchospasme",
          "Remplissage si hypotension",
        ]}
        bg="bg-white"
      />
      <FlowChevron />

      <FlowRibbon
        title="Réfractaire ?"
        subtitle="Adrénaline IVSE titrée à l’effet + réanimation (remplissage/vasopresseur)"
        gradient="from-slate-800 to-slate-600"
        rightBadge="Escalade"
      />
      <FlowChevron />

      <FlowBlock
        title="Surveillance / Observation"
        items={["Risque biphasique", "Durée selon sévérité et évolution"]}
        bg="bg-yellow-50"
      />
    </div>
  );
}
