"use client";
import { useLang } from "@/context/LangContext";
import { CONDITIONS } from "@/lib/validators";

interface Props {
  brands: string[];
  defaultQ?: string;
  defaultBrand?: string;
  defaultCondition?: string;
  defaultSort?: string;
  count: number;
}

export default function BrowseFilters({
  brands,
  defaultQ,
  defaultBrand,
  defaultCondition,
  defaultSort,
  count,
}: Props) {
  const { t } = useLang();

  return (
    <>
      <div className="mb-10">
        <h1 className="section-title mb-2">{t.browse.title}</h1>
        <p className="text-surface-500">{t.browse.available(count)}</p>
      </div>

      <form className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="lg:col-span-2">
            <input
              type="text"
              name="q"
              defaultValue={defaultQ}
              placeholder={t.browse.search}
              className="input-field"
            />
          </div>

          <select name="brand" defaultValue={defaultBrand || "all"} className="input-field">
            <option value="all">{t.browse.allBrands}</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select name="condition" defaultValue={defaultCondition || "all"} className="input-field">
            <option value="all">{t.browse.allConditions}</option>
            {Object.entries(CONDITIONS).map(([k, v]) => (
              <option key={k} value={k}>
                {t.conditions[k as keyof typeof t.conditions] || v}
              </option>
            ))}
          </select>

          <select name="sort" defaultValue={defaultSort || "newest"} className="input-field">
            <option value="newest">{t.browse.newest}</option>
            <option value="price_asc">{t.browse.priceLow}</option>
            <option value="price_desc">{t.browse.priceHigh}</option>
          </select>

          <button type="submit" className="btn-primary">
            {t.browse.filter}
          </button>
        </div>
      </form>
    </>
  );
}