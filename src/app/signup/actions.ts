// src/app/signup/actions.ts
"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/database";

export type SignupActionState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export const initialSignupState: SignupActionState = { status: "idle" };

function getSupabaseServerClient() {
  return createServerActionClient<Database>({ cookies });
}

export async function signupAction(
  _prevState: SignupActionState,
  formData: FormData
): Promise<SignupActionState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirm = formData.get("confirmPassword");

  // Validations basiques
  if (typeof email !== "string" || !email) {
    return { status: "error", message: "Email requis." };
  }
  if (typeof password !== "string" || password.length < 6) {
    return { status: "error", message: "Mot de passe trop court (6 caractères min.)." };
  }
  if (password !== confirm) {
    return { status: "error", message: "Les mots de passe ne correspondent pas." };
  }

  const supabase = getSupabaseServerClient();
  // Crée l’utilisateur Supabase
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data?.user) {
    return { status: "error", message: error?.message ?? "Erreur d’inscription." };
  }

  // Insère le profil (RLS doit permettre à l’utilisateur d’insérer son profil)
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    subscription_tier: "free",
    subscription_status: "active",
    full_name: null,
    expires_at: null,
  });

  if (profileError) {
    return { status: "error", message: profileError.message ?? "Erreur de création du profil." };
  }

  // Rafraîchit les pages sensibles
  revalidatePath("/mon-compte");
  revalidatePath("/");
  return { status: "success" };
}
