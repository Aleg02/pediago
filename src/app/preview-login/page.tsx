// src/app/preview-login/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const dynamic = "force-static";

type PreviewLoginPageProps = {
  searchParams?: {
    error?: string;
    from?: string;
  };
};

// ----- Server action d'authentification -----
export async function authenticatePreview(
  formData: FormData
): Promise<never> {
  "use server";

  const password = formData.get("password");
  const from = (formData.get("from") as string | null) || "/";

  const expectedPassword = process.env.PREVIEW_PASSWORD;

  if (!expectedPassword) {
    // Si la variable n'est pas configurée, on laisse passer (évite de tout casser)
    cookies().set("pediago_preview_auth", "1", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    redirect(from);
  }

  if (password === expectedPassword) {
    cookies().set("pediago_preview_auth", "1", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 jours
    });
    redirect(from);
  }

  // Mot de passe incorrect → on revient sur la page avec un flag d'erreur
  redirect(`/preview-login?error=1&from=${encodeURIComponent(from)}`);
}

// ----- Page “Coming soon + Auth” -----
export default function PreviewLoginPage({ searchParams }: PreviewLoginPageProps) {
  const error = searchParams?.error === "1";
  const from = searchParams?.from || "/";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl p-8 space-y-8">
        {/* Logo + titre */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center rounded-2xl bg-slate-800 px-4 py-2">
            <span className="text-lg font-semibold tracking-tight">
              <span className="text-slate-50">Pedia</span>
              <span className="text-[#ef4444]">Go</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-4">Coming soon</h1>
          <p className="text-sm text-slate-400">
            Assistant d&apos;urgence pédiatrique en cours de construction.
            Accès réservé aux tests internes.
          </p>
        </div>

        {/* Highlights / fonctionnalités */}
        <div className="space-y-3 text-sm text-slate-300">
          <p className="font-medium text-slate-200">
            Fonctionnalités prévues&nbsp;:
          </p>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>
                Protocoles d&apos;urgence pédiatrique structurés (ACR, anaphylaxie,
                asthme aigu grave, sepsis, etc.).
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
              <span>
                Calcul automatique des posologies en fonction de l&apos;âge et du
                poids.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>
                Interface pensée pour les urgences&nbsp;: claire, rapide, adaptée
                au terrain.
              </span>
            </li>
          </ul>
        </div>

        {/* Formulaire de mot de passe */}
        <form action={authenticatePreview} className="space-y-4">
          <input type="hidden" name="from" value={from} />

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-200"
            >
              Accès privé
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="off"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent"
              placeholder="Mot de passe de prévisualisation"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">
              Mot de passe incorrect. Merci de réessayer.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-[#ef4444] px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-red-500 transition"
          >
            Accéder à la préversion
          </button>

          <p className="text-[11px] text-slate-500 text-center leading-snug">
            Cette version est destinée exclusivement aux tests. Ne pas utiliser
            pour une prise en charge réelle de patients.
          </p>
        </form>
      </div>
    </div>
  );
}
