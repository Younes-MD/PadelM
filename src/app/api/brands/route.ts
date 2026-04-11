import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const FALLBACK = ["Adidas", "Babolat", "Bullpadel", "Head", "Nox", "StarVie", "Varlion", "Wilson"];

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { name: true } });
    return apiSuccess(brands.length ? brands.map((b) => b.name) : FALLBACK);
  } catch {
    return apiSuccess(FALLBACK);
  }
}