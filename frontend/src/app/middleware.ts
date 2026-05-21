import { NextRequest, NextResponse } from "next/server";

// Rotas públicas — não precisam de autenticação
const PUBLIC_ROUTES = ["/login", "/register"];

// Mapeamento de prefixo de rota → tipo de utilizador permitido
const PROTECTED_ROUTES: Record<string, string[]> = {
  "/admin": ["admin"],
  "/servicos": ["provedor"],
  "/recomendacoes": ["utilizador"],
  "/onboarding": ["utilizador"],
  "/historico": ["utilizador"],
  "/perfil": ["utilizador"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Deixa passar rotas públicas
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Lê o auth store do cookie (Zustand persist usa localStorage,
  // mas para SSR precisamos de um cookie espelho — ver nota abaixo)
  const authCookie = request.cookies.get("srf_auth");

  if (!authCookie?.value) {
    // Não autenticado → redireciona para login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const auth = JSON.parse(authCookie.value);
    const tipo: string = auth?.state?.user?.tipo;

    if (!tipo || !auth?.state?.isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verifica permissão por prefixo de rota
    for (const [prefix, allowedTipos] of Object.entries(PROTECTED_ROUTES)) {
      if (pathname.startsWith(prefix)) {
        if (!allowedTipos.includes(tipo)) {
          // Tipo errado → redireciona para a área correcta
          return NextResponse.redirect(
            new URL(getHomeForTipo(tipo), request.url)
          );
        }
        break;
      }
    }

    return NextResponse.next();
  } catch {
    // Cookie inválido → limpa e redireciona
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("srf_auth");
    return response;
  }
}

function getHomeForTipo(tipo: string): string {
  switch (tipo) {
    case "admin":
      return "/admin/dashboard";
    case "provedor":
      return "/servicos";
    default:
      return "/recomendacoes";
  }
}

export const config = {
  matcher: [
    /*
     * Aplica middleware a todas as rotas excepto:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - ficheiros estáticos (imagens, fontes, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};