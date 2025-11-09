import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@fontsource-variable/inter"; // charge la VF localement


export const metadata: Metadata = {
  title: "PediaGo",
  description: "Le bon geste, maintenant !",
};

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-neutral-100 text-slate-900`}>{children}</body>
    </html>
  );
}
