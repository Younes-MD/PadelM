import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { racketSchema } from "@/lib/validators";
import { apiSuccess, apiError } from "@/lib/api-helpers";

// GET all rackets (admin view includes sold)
export async function GET() {
  try {
    const rackets = await prisma.racket.findMany({
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(rackets);
  } catch (error) {
    console.error("GET /api/admin/rackets error:", error);
    return apiError("Failed to fetch rackets", 500);
  }
}

// POST create new racket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = racketSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(
        parsed.error.issues.map((i) => `${i.path}: ${i.message}`).join(", "),
        400
      );
    }

    const racket = await prisma.racket.create({ data: parsed.data });
    return apiSuccess(racket, 201);
  } catch (error) {
    console.error("POST /api/admin/rackets error:", error);
    return apiError("Failed to create racket", 500);
  }
}

// PUT update racket
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) return apiError("Racket ID is required");

    const parsed = racketSchema.partial().safeParse(data);
    if (!parsed.success) {
      return apiError(
        parsed.error.issues.map((i) => i.message).join(", "),
        400
      );
    }

    const racket = await prisma.racket.update({
      where: { id },
      data: parsed.data,
    });

    return apiSuccess(racket);
  } catch (error) {
    console.error("PUT /api/admin/rackets error:", error);
    return apiError("Failed to update racket", 500);
  }
}

// DELETE racket
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return apiError("Racket ID is required");

    await prisma.racket.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("DELETE /api/admin/rackets error:", error);
    return apiError("Failed to delete racket", 500);
  }
}
