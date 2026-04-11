import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
    return apiSuccess(brands);
  } catch { return apiError("Failed to fetch brands", 500); }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name?.trim()) return apiError("Brand name required");
    const brand = await prisma.brand.create({ data: { name: name.trim() } });
    return apiSuccess(brand, 201);
  } catch (e: any) {
    if (e.code === "P2002") return apiError("Cette marque existe déjà");
    return apiError("Failed to create brand", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, active, name } = await request.json();
    const brand = await prisma.brand.update({ where: { id }, data: { ...(active !== undefined && { active }), ...(name && { name }) } });
    return apiSuccess(brand);
  } catch { return apiError("Failed to update brand", 500); }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return apiError("ID requis");
    await prisma.brand.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch { return apiError("Failed to delete brand", 500); }
}