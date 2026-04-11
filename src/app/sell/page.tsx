"use client";

import { useState } from "react";
import { BRANDS, CONDITIONS } from "@/lib/validators";
import ImageUpload from "@/components/ImageUpload";
import type { Metadata } from "next";

export default function SellPage() {
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
        <h1 className="section-title mb-4">Racket Submitted!</h1>
        <p className="text-surface-600 text-lg mb-8">
          Thanks for your submission. We&apos;ll review it and get back to you within 24 hours.
        </p>
        <a href="/rackets" className="btn-primary">Browse Rackets</a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      <div className="mb-10">
        <h1 className="section-title mb-2">Sell Your Racket</h1>
        <p className="text-surface-500">
          Fill in the details below and we&apos;ll review your submission. Listing is completely free.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact info */}
        <fieldset className="space-y-4">
          <legend className="font-semibold text-surface-900 text-lg mb-2">Your Information</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Name *</label>
              <input name="name" required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Email *</label>
              <input name="email" type="email" required className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Phone (optional)</label>
            <input name="phone" type="tel" className="input-field" />
          </div>
        </fieldset>

        {/* Racket info */}
        <fieldset className="space-y-4">
          <legend className="font-semibold text-surface-900 text-lg mb-2">Racket Details</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Brand *</label>
              <select name="brand" required className="input-field">
                <option value="">Select brand</option>
                {BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Model *</label>
              <input name="model" required className="input-field" placeholder="e.g. Hack 03" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Condition *</label>
              <select name="condition" required className="input-field">
                <option value="">Select condition</option>
                {Object.entries(CONDITIONS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Asking Price (€)</label>
              <input name="askingPrice" type="number" min="0" step="1" className="input-field" placeholder="Optional" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Description *</label>
            <textarea
              name="description"
              required
              rows={4}
              className="input-field resize-none"
              placeholder="Describe the racket's condition, how long you've used it, any notable features..."
            />
          </div>
        </fieldset>

        {/* Images */}
        <fieldset>
          <legend className="font-semibold text-surface-900 text-lg mb-3">Photos</legend>
          <ImageUpload images={images} onChange={setImages} maxImages={5} />
          <p className="text-xs text-surface-400 mt-2">Upload up to 5 photos. Clear, well-lit photos help sell faster.</p>
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
          {status === "loading" ? "Submitting..." : "Submit Racket"}
        </button>
      </form>
    </div>
  );
}
