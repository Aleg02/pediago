// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Routes publiques autorisées sans authentification
  const publicPaths = [
    "/preview-login",
    "/robots.txt",
    "/favicon.ico",
  ];

  const isPublic =
    publicPaths.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/health") || // éventuel endpoint public
    pathname.startsWith("/images") || // selon ton arborescence
    pathname.startsWith("/public");

  if (isPublic) {
    return NextResponse.next();
  }

  // Vérifie le cookie d'auth de prévisualisation
  const cookie = req.cookies.get("pediago_preview_auth");

  if (cookie?.value === "1") {
    return NextResponse.next();
  }

  // Pas authentifié → redirection vers la page preview-login
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/preview-login";
  loginUrl.searchParams.set("from", pathname);

  return NextResponse.redirect(loginUrl);
}

// On applique le middleware sur toutes les routes applicatives
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
