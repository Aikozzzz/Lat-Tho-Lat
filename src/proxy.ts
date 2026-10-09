import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "lat-tho-lat-session";

function isProtectedPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/") || pathname === "/admin" || pathname.startsWith("/admin/");
}

export default function proxy(request: NextRequest) {
  if (!isProtectedPath(request.nextUrl.pathname) || request.cookies.has(SESSION_COOKIE_NAME)) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/api/(.*)"],
};
