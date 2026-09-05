import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

const SECRET_LOGIN = "/YM02YT03-SECURE/YM02YT03-secure";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith(SECRET_LOGIN)) {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) return NextResponse.redirect(new URL(SECRET_LOGIN, request.url));
    const session = await verifyToken(token);
    if (!session) {
      const response = NextResponse.redirect(new URL(SECRET_LOGIN, request.url));
      response.cookies.delete("admin_token");
      return response;
    }
  }

  if (pathname.startsWith("/api/admin")) {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await verifyToken(token);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
