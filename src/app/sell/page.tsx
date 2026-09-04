"use client";

import { useState, useEffect } from "react";
import { CONDITIONS } from "@/lib/validators";
import ImageUpload from "@/components/ImageUpload";
import { useLang } from "@/context/LangContext";

export default function SellPage() {
  const { t } = useLang();
  const [images, setImages] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data.data || []))
      .catch(() => setBrands([]));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      phone: (form.get("phone") as string) || undefined,
      brand: form.get("brand") as string,
      model: form.get("model") as string,
      condition: form.get("condition") as string,
      askingPrice: form.get("askingPrice")
        ? parseFloat(form.get("askingPrice") as string)
        : undefined,
      description: form.get("description") as string,
      images,
    };

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Submission failed");
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="section-title mb-4">{t.sell.successTitle}</h1>
        <p className="text-surface-600 text-lg mb-8">{t.sell.successMsg}</p>
        <a href="/rackets" className="btn-primary">{t.sell.browseRackets}</a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      <div className="mb-10">
        <h1 className="section-title mb-2">{t.sell.title}</h1>
        <p className="text-surface-500">{t.sell.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact info */}
        <fieldset className="space-y-4">
          <legend className="font-semibold text-surface-900 text-lg mb-2">{t.sell.yourInfo}</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">{t.sell.name} *</label>
              <input name="name" required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">{t.sell.email} *</label>
              <input name="email" type="email" required className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">{t.sell.phoneOptional}</label>
            <input name="phone" type="tel" className="input-field" />
          </div>
        </fieldset>

        {/* Racket info */}
        <fieldset className="space-y-4">
          <legend className="font-semibold text-surface-900 text-lg mb-2">{t.sell.racketDetails}</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">{t.sell.brand} *</label>
              <select name="brand" required className="input-field">
                <option value="">{t.sell.selectBrand}</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">{t.sell.model} *</label>
              <input name="model" required className="input-field" placeholder={t.sell.modelPlaceholder} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">{t.sell.condition} *</label>
              <select name="condition" required className="input-field">
                <option value="">{t.sell.selectCondition}</option>
                {Object.entries(CONDITIONS).map(([k]) => (
                  <option key={k} value={k}>
                    {t.conditions[k as keyof typeof t.conditions]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">{t.sell.askingPrice}</label>
              <input name="askingPrice" type="number" min="0" step="1" className="input-field" placeholder={t.sell.optional} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">{t.sell.description} *</label>
            <textarea
              name="description"
              required
              rows={4}
              className="input-field resize-none"
              placeholder={t.sell.descriptionPlaceholder}
            />
          </div>
        </fieldset>

        {/* Images */}
        <fieldset>
          <legend className="font-semibold text-surface-900 text-lg mb-3">{t.sell.photos}</legend>
          <ImageUpload images={images} onChange={setImages} maxImages={5} />
          <p className="text-xs text-surface-400 mt-2">{t.sell.photosHint}</p>
        </fieldset>

        {status === "error" && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary w-full py-4 text-base"
        >
          {status === "loading" ? t.sell.submitting : t.sell.submit}
        </button>
      </form>
    </div>
  );
}
