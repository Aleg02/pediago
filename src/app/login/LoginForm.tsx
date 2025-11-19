"use client";

import { useEffect, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  passwordLoginAction,
} from "./actions";
import { initialAuthState, type AuthActionState } from "./state";

function FormButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {pending ? pendingLabel : label}
    </button>
  );
}

function AuthMessage({ state }: { state: AuthActionState }) {
  if (state.status === "idle") {
    return null;
  }

  const tone =
    state.status === "success"
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : "text-rose-700 bg-rose-50 border-rose-200";

  const icon =
    state.status === "success" ? (
      <svg
        className="h-5 w-5 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        className="h-5 w-5 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    );

  return (
    <div
      className={`mt-2 flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${tone}`}
    >
      {icon}
      <p>
        {state.message ??
          (state.status === "success"
            ? "Action réussie."
            : "Une erreur est survenue.")}
      </p>
    </div>
  );
}

/* Icônes providers */

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36 16.8 36 11 30.2 11 23s5.8-13 13-13c3.3 0 6.3 1.2 8.6 3.3l5.7-5.7C34.6 4.1 29.6 2 24 2 12.3 2 3 11.3 3 23s9.3 21 21 21 21-9.3 21-21c0-1.3-.1-2.5-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.4 15.6 18.8 13 24 13c3.3 0 6.3 1.2 8.6 3.3l5.7-5.7C34.6 7.1 29.6 5 24 5 16.2 5 9.6 9.2 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 41c5.2 0 10.1-2 13.7-5.3l-6.3-5.3C29.2 32.8 26.8 34 24 34c-5.2 0-9.6-3.3-11.2-7.8l-6.6 5.1C9.6 38.8 16.2 43 24 43z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3C34.8 31.5 29.9 35 24 35c-5.2 0-9.6-3.3-11.2-7.8l-6.6 5.1C9.6 38.8 16.2 43 24 43c8.7 0 19-6.3 19-20 0-1.3-.1-2.5-.4-3.5z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-900">
      <path
        fill="currentColor"
        d="M19.665 17.157c-.33.76-.726 1.45-1.19 2.07-.626.84-1.139 1.42-1.54 1.74-.616.57-1.277.865-1.98.88-.506 0-1.118-.144-1.834-.43-.716-.287-1.374-.43-1.974-.43-.635 0-1.312.144-2.03.43-.717.286-1.301.437-1.753.452-.676.029-1.348-.277-2.016-.92-.43-.377-.962-1.003-1.597-1.88-.684-.94-1.246-2.034-1.686-3.28C1.64 14.42 1.42 13.23 1.42 12.09c0-1.19.257-2.22.77-3.09.402-.7.937-1.257 1.607-1.67.67-.413 1.394-.627 2.173-.642.427 0 .987.166 1.68.498.692.333 1.135.5 1.33.5.146 0 .64-.19 1.48-.57.793-.356 1.463-.504 2.01-.446 1.487.12 2.606.706 3.36 1.76-1.335.81-1.997 1.94-1.988 3.39.01 1.13.42 2.07 1.225 2.82.364.345.77.61 1.217.8-.098.29-.202.57-.312.84zM15.7 4.27c0 .89-.325 1.72-.973 2.48-.783.915-1.73 1.44-2.757 1.36a2.73 2.73 0 01-.02-.33c0-.85.33-1.76.98-2.51.313-.36.71-.66 1.19-.9.48-.24.94-.37 1.38-.39.02.08.03.16.03.25z"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7">
      <rect x="2" y="2" width="9" height="9" fill="#f25022" />
      <rect x="13" y="2" width="9" height="9" fill="#7fba00" />
      <rect x="2" y="13" width="9" height="9" fill="#00a4ef" />
      <rect x="13" y="13" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}

export default function LoginForm() {
  const router = useRouter();

  const [passwordState, passwordAction] = useActionState(
    passwordLoginAction,
    initialAuthState
  );

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pediago_saved_email") !== null;
    }
    return false;
  });
  const [savedEmail, setSavedEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pediago_saved_email") || "";
    }
    return "";
  });

  // Animation fade + zoom
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (passwordState.status === "success") {
      router.push("/mon-compte");
      router.refresh();
    }
  }, [passwordState.status, router]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    if (rememberMe) {
      localStorage.setItem("pediago_saved_email", email);
    }
  };

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
    if (!checked) {
      localStorage.removeItem("pediago_saved_email");
      setSavedEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative">
      {/* Lien retour en haut à gauche */}
      <Link
        href="/"
        className="absolute left-4 top-4 inline-flex items-center gap-1 text-xs font-medium text-[#2563eb] underline"
      >
        <span aria-hidden>←</span>
        <span>Retour à l&apos;accueil</span>
      </Link>

      {/* Bloc central animé */}
      <div
        className={`w-full max-w-md space-y-10 transform transition-all duration-300 ease-out ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
         {/* Logo + slogan, sans encadré 
        <div className="flex justify-center -mt-3">
          <Link href="/" className="block text-center">
            <p className="text-5xl font-bold leading-tight tracking-tight">
              <span className="text-slate-900">Pedia</span>
              <span className="text-[#ef4444]">Go</span>
            </p>
            <p className="mt-1 text-[11px] font-medium normal-case tracking-[0.05em] text-slate-500">
              Le bon geste, maintenant !
            </p>
          </Link>
       </div> */}

        {/* Formulaire email / mot de passe */}
        <div className="space-y-4">
          <form action={passwordAction} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-800"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  required
                  defaultValue={savedEmail}
                  onChange={handleEmailChange}
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm shadow-sm transition focus:outline-none focus:ring-2 ${
                    passwordState.status === "error"
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/30"
                      : "border-slate-200 focus:border-[#2563eb] focus:ring-[#2563eb]/30"
                  }`}
                  placeholder="email@exemple.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-800"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  minLength={6}
                  className={`w-full rounded-xl border px-3 py-2.5 pr-10 text-sm shadow-sm transition focus:outline-none focus:ring-2 ${
                    passwordState.status === "error"
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/30"
                      : "border-slate-200 focus:border-[#2563eb] focus:ring-[#2563eb]/30"
                  }`}
                  placeholder="Mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z"
                        clipRule="evenodd"
                      />
                      <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                      <path
                        fillRule="evenodd"
                        d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => handleRememberMeChange(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/30"
                />
                <span className="text-xs text-slate-600">
                  Se souvenir de moi
                </span>
              </label>
              <span className="text-xs font-medium text-[#2563eb] opacity-70">
                Mot de passe oublié ?
              </span>
            </div>

            <AuthMessage state={passwordState} />

            <FormButton label="Se connecter" pendingLabel="Connexion..." />
          </form>

          <p className="mt-2 text-center text-xs text-slate-600">
            Pas encore de compte ?{" "}
            <Link
              href="/signup"
              className="font-semibold text-slate-900 underline"
            >
              Créer un compte
            </Link>
          </p>
        </div>

        {/* Bloc social agrandi */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <span className="h-px w-12 bg-slate-200" />
            <span>Ou continuer avec</span>
            <span className="h-px w-12 bg-slate-200" />
          </div>
          <div className="flex justify-center gap-5">
            <button
              type="button"
              className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50"
              aria-label="Continuer avec Google"
            >
              <GoogleIcon />
            </button>
            <button
              type="button"
              className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50"
              aria-label="Continuer avec Apple"
            >
              <AppleIcon />
            </button>
            <button
              type="button"
              className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50"
              aria-label="Continuer avec Microsoft"
            >
              <MicrosoftIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
