import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";

// GET all submissions
export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(submissions);
  } catch (error) {
    console.error("GET /api/admin/submissions error:", error);
    return apiError("Failed to fetch submissions", 500);
  }
}

// PUT update submission status (approve/reject)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) return apiError("Submission ID is required");
    if (!["approved", "rejected"].includes(status)) {
      return apiError("Status must be 'approved' or 'rejected'");
    }

    const submission = await prisma.submission.update({
      where: { id },
      data: { status },
    });

    // If approved, create a racket listing from the submission
    if (status === "approved") {
      await prisma.racket.create({
        data: {
          title: `${submission.brand} ${submission.model}`,
          brand: submission.brand,
          model: submission.model,
          condition: submission.condition,
          price: submission.askingPrice || 0,
          description: submission.description,
          images: submission.images,
          featured: false,
        },
      });
    }

    return apiSuccess(submission);
  } catch (error) {
    console.error("PUT /api/admin/submissions error:", error);
    return apiError("Failed to update submission", 500);
  }
}

// DELETE submission
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return apiError("Submission ID is required");

    await prisma.submission.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("DELETE /api/admin/submissions error:", error);
    return apiError("Failed to delete submission", 500);
  }
}
