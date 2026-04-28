import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/auth";

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) return null;
  return new TextEncoder().encode(s);
}

export async function middleware(request: NextRequest) {
  const sec = secret();
  if (!sec) return NextResponse.next();

  const path = request.nextUrl.pathname;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  const needsAuth = path.startsWith("/dashboard") || path.startsWith("/admin");
  if (!needsAuth) return NextResponse.next();

  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(token, sec);
    const role = payload.role as string;
    if (path.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (path.startsWith("/dashboard") && role !== "RESTAURANT") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
