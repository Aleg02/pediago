import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion | PediaGo",
  description: "Accédez aux calculateurs sécurisés via Supabase Auth.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-24">
      <div className="mx-auto mb-8 max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Sécurité Supabase</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Connexion à PediaGo</h1>
        <p className="mt-3 text-base text-slate-600">
          Identifiez-vous pour retrouver vos protocoles personnalisés, vos abonnements et vos alertes.
        </p>
      </div>
      <LoginForm />
    </main>
  );
}
