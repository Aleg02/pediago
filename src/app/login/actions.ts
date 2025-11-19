"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import type { AuthActionState } from "./state";

function getSupabaseServerClient() {
  // cast en any car le helper est typé pour retourner unknown sans générique
  return createServerActionClient({ cookies }) as any;
}

export async function passwordLoginAction(
  _: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { status: "error", message: "Email et mot de passe requis." };
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/mon-compte");
  revalidatePath("/");
  return { status: "success", message: "Connexion réussie." };
}

export async function magicLinkAction(
  _: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("magicEmail");

  if (typeof email !== "string" || !email) {
    return { status: "error", message: "Veuillez saisir une adresse email." };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL;

  const redirectUrl = baseUrl?.startsWith("http")
    ? baseUrl
    : baseUrl
    ? `https://${baseUrl}`
    : "http://localhost:3000";

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${redirectUrl.replace(/\/$/, "")}/auth/callback`,
    },
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  return {
    status: "success",
    message: "Lien magique envoyé. Consultez votre boîte mail.",
  };
}
