// src/components/ProtocolFlowAAG.tsx
import { FlowBlock, FlowRibbon, FlowChevron } from "./flow/FlowParts";

export default function ProtocolFlowAAG() {
  return (
    <div className="w-full space-y-3">
      <FlowBlock
        title="≥ 3ᵉ épisode de dyspnée sifflante chez NRS"
        bg="bg-white"
      />
      <FlowChevron />

      <FlowBlock
        title="Mesures initiales"
        items={["½ assis, scope, O₂ titrée (sat 94–98%)"]}
      />
      <FlowChevron />

      <FlowRibbon
        title="AE SALBUTAMOL en continu 1 h + 1 AE IPRATROPIUM / 8 h"
        subtitle="Sous 6–8 L/min O₂"
        gradient="from-indigo-400 via-sky-400 to-cyan-400"
        rightBadge="1ʳᵉ ligne"
      />
      <FlowChevron />

      <FlowBlock title="SOLUMÉDROL IV 2 mg/kg" bg="bg-green-100" />
      <FlowChevron />

      <FlowBlock title="HYDRATATION Dextrion G5% 421 + 1/3" bg="bg-blue-50" />
      <FlowChevron />

      <FlowRibbon
        title="MgSO₄ IV"
        subtitle="≥ 20 mg/kg en 30′ puis 10 mg/kg/h IVSE"
        gradient="from-orange-400 to-amber-500"
        rightBadge="2ᵉ ligne (si échec)"
      />
      <FlowChevron />

      <FlowBlock
        title="IOT / VNI si besoin — réglages protecteurs"
        items={[
          "ISR : kétamine + célocurine si pas de CI",
          "Sédation profonde ± curarisation",
        ]}
        bg="bg-teal-100"
      />
      <FlowChevron />

      <FlowBlock
        title="ECMO ?"
        subtitle="Hypoxémie majeure réfractaire / acidose"
        bg="bg-red-50"
      />
    </div>
  );
}
