import type { Protocol } from "@/data/protocols";
import type { ProtocolSection } from "@/data/protocolDetails";
import { supabaseFetch } from "./supabaseClient";

type CardRow = {
  id: string;
  slug: string;
  protocol: string | null;
  title: string;
  version: string | null;
  tags: string[] | null;
  icon: string | null;
  accent_color: string | null;
  sources: { label: string; url?: string }[] | null;
  content: Record<string, unknown> | null;
  is_premium: boolean;
};

type CardWithSectionsRow = CardRow & {
  card_sections?: SupabaseCardSectionRow[] | null;
};

type SupabaseCardSectionRow = {
  id: string;
  title: string;
  body: string | null;
  content: { bullets?: unknown } | null;
  position: number | null;
};

export async function fetchCardsList() {
  const query =
    "/cards?select=id,slug,protocol,title,version,tags,icon,accent_color,sources,content,is_premium&order=title";
  const { data, error } = await supabaseFetch<CardRow[]>(query);

  if (error || !data) {
    return { data: null, error };
  }

  return { data: data.map(mapCardRow), error: null };
}

export async function fetchCardBySlug(slug: string) {
  const params = new URLSearchParams({
    select:
      "id,slug,protocol,title,version,tags,icon,accent_color,sources,content,is_premium,card_sections(id,title,body,content,position)",
    slug: `eq.${slug}`,
  });
  const { data, error } = await supabaseFetch<CardWithSectionsRow[]>(`/cards?${params.toString()}`);

  if (error || !data) {
    return { protocol: null, sections: null, error };
  }

  const row = data[0];
  if (!row) {
    return { protocol: null, sections: null, error: null };
  }

  return {
    protocol: mapCardRow(row),
    sections: mapSections(row.card_sections ?? []),
    error: null,
  };
}

function mapCardRow(row: CardRow): Protocol {
  return {
    slug: row.slug || row.protocol || row.id,
    title: row.title,
    version: row.version ?? undefined,
    tags: row.tags ?? undefined,
    icon: row.icon ?? "🩺",
    accentColor: row.accent_color ?? "#0ea5e9",
    accessLevel: row.is_premium ? "premium" : "free",
    sources: Array.isArray(row.sources) && row.sources.length > 0 ? row.sources : undefined,
  };
}

function mapSections(rows: SupabaseCardSectionRow[]): ProtocolSection[] {
  return rows
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((row) => ({
      title: row.title,
      bullets: extractBullets(row),
    }))
    .filter((section) => section.bullets.length > 0);
}

function extractBullets(row: SupabaseCardSectionRow): string[] {
  const fromContent = Array.isArray(row.content?.bullets)
    ? (row.content?.bullets as unknown[]).filter((item): item is string => typeof item === "string")
    : [];

  if (fromContent.length > 0) {
    return fromContent;
  }

  return row.body ? [row.body] : [];
}
