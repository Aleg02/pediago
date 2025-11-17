"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database";

export async function logoutAction() {
  const supabase = createServerActionClient<Database>({ cookies });
  await supabase.auth.signOut();
  revalidatePath("/");
  revalidatePath("/mon-compte");
}
