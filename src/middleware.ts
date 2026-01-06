import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Izinkan halaman tanpa login:
  const publicPaths = ["/signin", "/signup", "/"];
  const isPublicPath = publicPaths.includes(pathname);

  // 1. Jika TIDAK ada token (belum login)
  if (!token) {
    // Jika mencoba akses halaman publik → IZINKAN
    if (isPublicPath) {
      return NextResponse.next();
    }
    // Jika mencoba akses halaman lain (termasuk /signout) → REDIRECT ke login
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // 2. Jika ADA token (sudah login)
  // IZINKAN semua akses kecuali halaman login/register
  if (token && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|.*\\..*).*)"],
};