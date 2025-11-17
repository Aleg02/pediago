"use client";

import { useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database";

interface SupabaseProviderProps {
  children: ReactNode;
  initialSession: Session | null;
}

export default function SupabaseProvider({ children, initialSession }: SupabaseProviderProps) {
  const [supabaseClient] = useState(() => createClientComponentClient<Database>());

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  );
}
