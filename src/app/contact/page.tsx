"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ContactForm() {
  const searchParams = useSearchParams();
  const racketId = searchParams.get("racket") || "";
  const racketTitle = searchParams.get("title") || "";

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
      racketId: racketId || undefined,
      message: form.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to send message");
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
        <h1 className="section-title mb-4">Message Sent!</h1>
        <p className="text-surface-600 text-lg mb-8">
          We&apos;ll get back to you as soon as possible.
        </p>
        <a href="/rackets" className="btn-primary">Browse More Rackets</a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      <div className="mb-10">
        <h1 className="section-title mb-2">Contact Us</h1>
        <p className="text-surface-500">
          {racketTitle
            ? `Interested in the ${racketTitle}? Send us a message.`
            : "Have a question? We'd love to hear from you."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Message *</label>
          <textarea
            name="message"
            required
            rows={5}
            className="input-field resize-none"
            defaultValue={
              racketTitle
                ? `Hi, I'm interested in the ${racketTitle}. Is it still available?`
                : ""
            }
          />
        </div>

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
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>
      </form>

      {/* Alternative contact */}
      <div className="mt-12 p-6 bg-surface-50 rounded-xl text-center">
        <p className="text-surface-600 mb-3">Prefer to chat directly?</p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || ""}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex"
        >
          Message us on WhatsApp
        </a>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-16 text-center text-surface-400">Loading...</div>}>
      <ContactForm />
    </Suspense>
  );
}
