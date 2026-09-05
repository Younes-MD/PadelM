"use client";
import { useLang } from "@/context/LangContext";

export default function NoResults() {
  const { t } = useLang();

  return (
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
      <h3 className="text-lg font-semibold text-surface-700 mb-2">{t.browse.noResults}</h3>
      <p className="text-surface-500">{t.browse.adjustFilters}</p>
    </div>
  );
}