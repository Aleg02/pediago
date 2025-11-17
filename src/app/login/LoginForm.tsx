"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { initialAuthState, passwordLoginAction, magicLinkAction, type AuthActionState } from "./actions";

function FormButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

function AuthMessage({ state }: { state: AuthActionState }) {
  if (state.status === "idle") {
    return null;
  }

  const tone = state.status === "success" ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50";
  return (
    <p className={`rounded-lg px-3 py-2 text-sm ${tone}`}>
      {state.message ?? (state.status === "success" ? "Action réussie." : "Une erreur est survenue.")}
    </p>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [passwordState, passwordAction] = useFormState(passwordLoginAction, initialAuthState);
  const [magicState, magicAction] = useFormState(magicLinkAction, initialAuthState);

  useEffect(() => {
    if (passwordState.status === "success") {
      router.push("/mon-compte");
      router.refresh();
    }
  }, [passwordState.status, router]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-900/5">
      <section>
        <h2 className="text-lg font-semibold text-slate-900">Connexion email / mot de passe</h2>
        <p className="mt-1 text-sm text-slate-600">Identifiez-vous avec vos identifiants habituels.</p>
        <form action={passwordAction} className="mt-4 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email professionnel
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              placeholder="prenom.nom@hopital.fr"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              placeholder="••••••••"
            />
          </div>
          <AuthMessage state={passwordState} />
          <FormButton label="Se connecter" pendingLabel="Connexion..." />
        </form>
      </section>

      <section className="border-t border-slate-100 pt-6">
        <h2 className="text-lg font-semibold text-slate-900">Connexion rapide (magic link)</h2>
        <p className="mt-1 text-sm text-slate-600">
          Recevez un lien sécurisé par email. Accessible même sans mot de passe.
        </p>
        <form action={magicAction} className="mt-4 space-y-4">
          <div>
            <label htmlFor="magicEmail" className="text-sm font-medium text-slate-700">
              Email professionnel
            </label>
            <input
              id="magicEmail"
              name="magicEmail"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              placeholder="prenom.nom@hopital.fr"
            />
          </div>
          <AuthMessage state={magicState} />
          <FormButton label="Envoyer le lien" pendingLabel="Envoi..." />
        </form>
      </section>
    </div>
  );
}
