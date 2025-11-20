// src/app/login/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AuthActionState } from "./state";

export async function passwordLoginAction(
  _: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { status: "error", message: "Email et mot de passe requis." };
  }

  // Crée le client Supabase côté serveur en gérant les cookies
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { status: "error", message: error.message };
  }

  // Invalider les pages protégées
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  const redirectUrl = baseUrl?.startsWith("http")
    ? baseUrl
    : baseUrl
    ? `https://${baseUrl}`
    : "http://localhost:3000";

  const supabase = await createServerSupabaseClient();
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
