import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, decryptSession } from "@/lib/auth/jwt";

/**
 * Checagem otimista de sessao (apenas leitura do cookie assinado). A validacao
 * definitiva acontece no Data Access Layer (`requireAdmin`) proximo aos dados.
 */
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoginRoute = pathname === "/admin/login";

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await decryptSession(token);

  if (!isLoginRoute && !session) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  if (isLoginRoute && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
