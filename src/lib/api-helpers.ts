import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function apiUnauthorized() {
  return apiError("Unauthorized", 401);
}

export function apiRateLimited() {
  return apiError("Too many requests. Please try again later.", 429);
}
