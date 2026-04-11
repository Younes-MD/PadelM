import { NextRequest } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { apiSuccess, apiError, apiRateLimited } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 20 uploads per hour per IP
    const ip = getClientIp(request);
    const { success } = rateLimit(`upload:${ip}`, {
      maxRequests: 20,
      windowMs: 60 * 60 * 1000,
    });
    if (!success) return apiRateLimited();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) return apiError("No file provided");

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return apiError("Only JPEG, PNG, WebP, and AVIF images are allowed");
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return apiError("Image must be under 5MB");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage(buffer);

    return apiSuccess(result, 201);
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return apiError("Image upload failed", 500);
  }
}
