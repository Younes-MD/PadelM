import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { apiError, apiRateLimited } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 login attempts per 15 minutes
    const ip = getClientIp(request);
    const { success } = rateLimit(`login:${ip}`, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!success) return apiRateLimited();

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return apiError("Invalid credentials");

    const result = await authenticateAdmin(
      parsed.data.username,
      parsed.data.password
    );

    if (!result) return apiError("Invalid credentials", 401);

    const response = NextResponse.json({
      success: true,
      data: { admin: result.admin },
    });

    // Set HttpOnly cookie
    const cookieHeaders = setAuthCookie(result.token);
    response.headers.set("Set-Cookie", cookieHeaders["Set-Cookie"]);

    return response;
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return apiError("Login failed", 500);
  }
}
