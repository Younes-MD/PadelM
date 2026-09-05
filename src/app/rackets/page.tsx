import { prisma } from "@/lib/prisma";
import RacketCard from "@/components/RacketCard";
import BrowseFilters from "@/components/BrowseFilters";
import NoResults from "@/components/NoResults";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parcourir les Raquettes",
  description:
    "Parcourez notre collection de raquettes de padel d'occasion de qualité. Filtrez par marque, état et prix.",
};

export const revalidate = 30;

const FALLBACK_BRANDS = ["Adidas", "Babolat", "Bullpadel", "Head", "Nox", "StarVie", "Varlion", "Wilson"];

interface SearchParams {
  q?: string;
  brand?: string;
  condition?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

async function getRackets(params: SearchParams) {
  const where: any = {};

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { brand: { contains: params.q, mode: "insensitive" } },
      { model: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
    ];
  }

  if (params.brand && params.brand !== "all") {
    where.brand = params.brand;
  }

  if (params.condition && params.condition !== "all") {
    where.condition = params.condition;
  }

  if (params.minPrice) {
    where.price = { ...where.price, gte: parseFloat(params.minPrice) };
  }
  if (params.maxPrice) {
    where.price = { ...where.price, lte: parseFloat(params.maxPrice) };
  }

  const orderBy: any =
    params.sort === "price_asc"
      ? { price: "asc" }
      : params.sort === "price_desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  return prisma.racket.findMany({ where, orderBy });
}

async function getBrands(): Promise<string[]> {
  try {
    const brands = await prisma.brand.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { name: true },
    });
    return brands.length ? brands.map((b) => b.name) : FALLBACK_BRANDS;
  } catch {
    return FALLBACK_BRANDS;
  }
}

export default async function RacketsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const [rackets, brands] = await Promise.all([getRackets(params), getBrands()]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      <BrowseFilters
        brands={brands}
        defaultQ={params.q}
        defaultBrand={params.brand}
        defaultCondition={params.condition}
        defaultSort={params.sort}
        count={rackets.length}
      />

      {rackets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rackets.map((racket) => (
            <RacketCard key={racket.id} {...racket} />
          ))}
        </div>
      ) : (
        <NoResults />
      )}
    </div>
  );
}