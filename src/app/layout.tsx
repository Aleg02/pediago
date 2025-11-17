import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Session } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import "./globals.css";
import "@fontsource-variable/inter"; // charge la VF localement
import TopMenu from "@/components/TopMenu";
import SupabaseProvider from "@/components/SupabaseProvider";


export const metadata: Metadata = {
  title: "PediaGo",
  description: "Le bon geste, maintenant !",
};

const inter = Inter({ subsets: ["latin"], display: "swap" });

async function getInitialSession(): Promise<Session | null> {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getInitialSession();

  return (
    <html lang="fr">
      <body className={`${inter.className} bg-neutral-100 text-slate-900`}>
        <SupabaseProvider initialSession={session}>
          <TopMenu />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
