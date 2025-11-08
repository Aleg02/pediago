// src/data/protocols.ts
export type Protocol = {
  slug: string;
  title: string;
  version?: string;
  tags?: string[];
};

export const PROTOCOLS: Protocol[] = [
  { slug: "eme",               title: "État de mal épileptique (EME)", version: "V1",  tags: ["neuro", "urgence"] },
  { slug: "acr-enfant",        title: "Arrêt cardiorespiratoire (enfant)", version: "V++", tags: ["réa"] },
  { slug: "choc-hemorragique", title: "Choc hémorragique (enfant)", version: "V1",  tags: ["hémorragie"] },
  { slug: "anaphylaxie",       title: "Anaphylaxie (enfant)",        version: "V1",  tags: ["allergie"] },
  { slug: "aag",               title: "Asthme aigu grave (AAG)",     version: "V1",  tags: ["respiratoire"] },
];
