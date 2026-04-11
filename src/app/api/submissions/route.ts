import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { submissionSchema } from "@/lib/validators";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { apiSuccess, apiError, apiRateLimited } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 submissions per hour per IP
    const ip = getClientIp(request);
    const { success } = rateLimit(`submission:${ip}`, {
      maxRequests: 3,
      windowMs: 60 * 60 * 1000,
    });
    if (!success) return apiRateLimited();

    const body = await request.json();
    const parsed = submissionSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(
        parsed.error.issues.map((i) => i.message).join(", "),
        400
      );
    }

    const submission = await prisma.submission.create({
      data: {
        ...parsed.data,
        images: body.images || [],
      },
    });

    return apiSuccess(
      { id: submission.id, message: "Submission received" },
      201
    );
  } catch (error) {
    console.error("POST /api/submissions error:", error);
    return apiError("Failed to submit racket", 500);
  }
}
