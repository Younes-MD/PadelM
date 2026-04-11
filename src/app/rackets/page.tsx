import { prisma } from "@/lib/prisma";
import { BRANDS, CONDITIONS } from "@/lib/validators";
import RacketCard from "@/components/RacketCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Rackets",
  description:
    "Browse our collection of quality pre-owned padel rackets. Filter by brand, condition, and price.",
};

export const revalidate = 30;

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

export default async function RacketsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const rackets = await getRackets(params);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      <div className="mb-10">
        <h1 className="section-title mb-2">Browse Rackets</h1>
        <p className="text-surface-500">
          {rackets.length} racket{rackets.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Filters */}
      <form className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              name="q"
              defaultValue={params.q}
              placeholder="Search rackets..."
              className="input-field"
            />
          </div>

          {/* Brand */}
          <select name="brand" defaultValue={params.brand || "all"} className="input-field">
            <option value="all">All Brands</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Condition */}
          <select
            name="condition"
            defaultValue={params.condition || "all"}
            className="input-field"
          >
            <option value="all">All Conditions</option>
            {Object.entries(CONDITIONS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select name="sort" defaultValue={params.sort || "newest"} className="input-field">
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>

          {/* Submit */}
          <button type="submit" className="btn-primary">
            Filter
          </button>
        </div>
      </form>

      {/* Results */}
      {rackets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rackets.map((racket) => (
            <RacketCard key={racket.id} {...racket} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <svg
            className="w-16 h-16 mx-auto text-surface-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-surface-700 mb-2">
            No rackets found
          </h3>
          <p className="text-surface-500">
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}
    </div>
  );
}
