import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    // cast en any pour contourner le type 'unknown' de createRouteHandlerClient
    const supabase = createRouteHandlerClient({ cookies }) as any;
    await supabase.auth.exchangeCodeForSession(code);
  }

  // On permet éventuellement un paramètre redirect_to, sinon on renvoie vers la home
  const redirectTo = url.searchParams.get("redirect_to") ?? "/";
  return NextResponse.redirect(new URL(redirectTo, url.origin));
}
