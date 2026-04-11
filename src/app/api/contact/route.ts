import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validators";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { apiSuccess, apiError, apiRateLimited } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 contact requests per hour per IP
    const ip = getClientIp(request);
    const { success } = rateLimit(`contact:${ip}`, {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000,
    });
    if (!success) return apiRateLimited();

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(
        parsed.error.issues.map((i) => i.message).join(", "),
        400
      );
    }

    const contact = await prisma.contactRequest.create({
      data: parsed.data,
    });

    return apiSuccess({ id: contact.id, message: "Message sent" }, 201);
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return apiError("Failed to send message", 500);
  }
}
