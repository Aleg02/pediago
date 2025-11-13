// src/data/protocols.ts
export type Protocol = {
  slug: string;
  title: string;
  version?: string;
  tags?: string[];
};

export const PROTOCOLS: Protocol[] = [
  { slug: "eme",               title: "État de mal épileptique (EME)", version: "V0.1",  tags: ["neuro", "urgence"] },
  { slug: "acr-enfant",        title: "Arrêt cardiorespiratoire (enfant)", version: "V0.1", tags: ["réa"] },
  { slug: "choc-hemorragique", title: "Choc hémorragique (enfant)", version: "V0.1",  tags: ["hémorragie"] },
  { slug: "anaphylaxie",       title: "Anaphylaxie (enfant)",        version: "V0.1",  tags: ["allergie"] },
  { slug: "aag",               title: "Asthme aigu grave (AAG)",     version: "V0.1",  tags: ["respiratoire"] },
  { slug: "antalgiques",       title: "Antalgiques (pédiatrie)",     version: "V0.1",  tags: ["douleur"] },
];
