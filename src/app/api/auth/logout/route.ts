import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  const cookieHeaders = clearAuthCookie();
  response.headers.set("Set-Cookie", cookieHeaders["Set-Cookie"]);
  return response;
}
