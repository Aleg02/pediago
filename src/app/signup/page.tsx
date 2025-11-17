// src/app/signup/page.tsx
"use client";

import { useActionState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signupAction, type SignupActionState, initialSignupState } from "./actions";
import { useEffect, useState } from "react";

/**
 * Formulaire d’inscription. Utilise une server action (signupAction)
 * pour créer l’utilisateur Supabase puis son profil.
 */
export default function SignupPage() {
  const [state, action] = useActionState<SignupActionState, FormData>(
    signupAction,
    initialSignupState
  );
  const [showPassword, setShowPassword] = useState(false);

  // Redirection après succès
  useEffect(() => {
    if (state.status === "success") {
      redirect("/mon-compte");
    }
  }, [state.status]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-slate-900">
          Créer un compte
        </h1>
        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-800">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm shadow-sm
                         border-slate-200 focus:border-[#2563eb] focus:ring-[#2563eb]/30"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-slate-800">Mot de passe</label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm shadow-sm
                         border-slate-200 focus:border-[#2563eb] focus:ring-[#2563eb]/30"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-800">Confirmation</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm shadow-sm
                         border-slate-200 focus:border-[#2563eb] focus:ring-[#2563eb]/30"
            />
          </div>
          {state.status === "error" && (
            <p className="text-sm text-rose-600">{state.message}</p>
          )}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8]"
          >
            Créer un compte
          </button>
        </form>
        <p className="text-center text-sm text-slate-600">
          Déjà inscrit ?{" "}
          <Link href="/login" className="font-semibold text-slate-900 underline">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
