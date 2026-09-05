"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password"),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de connexion");

      router.push("/YM02YT03-SECURE");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0f1117" }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold-500/25">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#0f1117]"
              stroke="currentColor" strokeWidth={2.5}>
              <ellipse cx="12" cy="12" rx="5" ry="8" />
              <line x1="12" y1="4" x2="12" y2="20" />
              <line x1="7.5" y1="8" x2="16.5" y2="8" />
              <line x1="7.5" y1="16" x2="16.5" y2="16" />
            </svg>
          </div>
          <h1 className="font-display text-2xl text-white">
            Padel<span className="text-gold-400">Market</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.30)" }}>
            Accès administration
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-white/10 overflow-hidden"
          style={{ background: "#13151c" }}>

          <div className="px-6 pt-6 pb-2">
            <h2 className="text-base font-semibold text-white">Connexion</h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>
              Entrez vos identifiants
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                style={{ color: "rgba(255,255,255,0.40)" }}>
                Nom d'utilisateur
              </label>
              <input
                name="username"
                required
                autoComplete="username"
                className="input-field"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                style={{ color: "rgba(255,255,255,0.40)" }}>
                Mot de passe
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="input-field"
                placeholder="••••••••••••••••"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl text-sm"
                style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", color: "#fca5a5" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>

        {/* Back link */}
        <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.20)" }}>
          <a href="/" className="hover:text-white transition-colors">
            ← Retour au site
          </a>
        </p>

      </div>
    </div>
  );
}