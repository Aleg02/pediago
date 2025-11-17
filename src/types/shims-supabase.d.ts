declare module "@supabase/auth-helpers-nextjs" {
  export function createServerComponentClient(config: { cookies: unknown }): unknown;
  export function createServerActionClient(config: { cookies: unknown }): unknown;
  export function createRouteHandlerClient(config: { cookies: unknown }): unknown;
  export function createClientComponentClient(): unknown;
}

declare module "@supabase/auth-helpers-react" {
  import type { ReactNode } from "react";
  export const SessionContextProvider: ({
    children,
    supabaseClient,
    initialSession,
  }: {
    children: ReactNode;
    supabaseClient: unknown;
    initialSession: unknown;
  }) => ReactNode;
  export function useSession(): unknown;
  export function useSupabaseClient(): unknown;
}

declare module "@supabase/supabase-js" {
  export type Session = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at?: number;
    token_type: string;
    user: {
      id: string;
      email?: string;
      app_metadata?: Record<string, unknown>;
      user_metadata?: Record<string, unknown>;
    };
  };
}
