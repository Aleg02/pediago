const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type SupabaseRestConfig = {
  baseUrl: string;
  headers: HeadersInit;
};

let cachedConfig: SupabaseRestConfig | null = null;

function buildConfig(): SupabaseRestConfig | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }

  if (!cachedConfig) {
    cachedConfig = {
      baseUrl: `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1`,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: "application/json",
      },
    };
  }

  return cachedConfig;
}

export type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

export async function supabaseFetch<T>(path: string, init?: RequestInit): Promise<SupabaseResponse<T>> {
  const config = buildConfig();

  if (!config) {
    return {
      data: null,
      error: new Error("Supabase non configuré (NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY manquants)."),
    };
  }

  const url = `${config.baseUrl}${path}`;
  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        ...config.headers,
        ...(init?.headers ?? {}),
      },
      cache: init?.cache ?? "no-store",
    });

    if (!response.ok) {
      const message = await response.text();
      return {
        data: null,
        error: new Error(message || `Erreur Supabase (${response.status})`),
      };
    }

    const data = (await response.json()) as T;
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Erreur réseau Supabase"),
    };
  }
}
