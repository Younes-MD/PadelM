"use client";

import { useEffect, useState, useCallback } from "react";
import ImageUpload from "@/components/ImageUpload";
import { CONDITIONS, SHAPES } from "@/lib/validators";

interface Racket {
  id: string;
  title: string;
  brand: string;
  model: string;
  condition: string;
  price: number;
  description: string;
  images: string[];
  weight?: string;
  shape?: string;
  featured: boolean;
  sold: boolean;
  certified: boolean;
  createdAt: string;
}

const EMPTY_FORM = {
  title: "",
  brand: "",
  model: "",
  condition: "good" as string,
  price: 0,
  description: "",
  images: [] as string[],
  weight: "",
  shape: "" as string,
  featured: false,
  sold: false,
  certified: false,
};

const labelClass = "block text-xs font-medium uppercase tracking-wider mb-1.5" ;
const labelStyle = { color: "rgba(255,255,255,0.40)" };

export default function AdminRacketsPage() {
  const [rackets, setRackets] = useState<Racket[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchRackets = useCallback(async () => {
    const res = await fetch("/api/admin/rackets");
    const data = await res.json();
    setRackets(data.data || []);
    setLoading(false);
  }, []);

  const fetchBrands = useCallback(async () => {
    const res = await fetch("/api/admin/brands");
    const data = await res.json();
    setBrands((data.data || []).filter((b: any) => b.active).map((b: any) => b.name));
  }, []);

  useEffect(() => {
    fetchRackets();
    fetchBrands();
  }, [fetchRackets, fetchBrands]);

  function startEdit(racket: Racket) {
    setForm({
      title: racket.title,
      brand: racket.brand,
      model: racket.model,
      condition: racket.condition,
      price: racket.price,
      description: racket.description,
      images: racket.images,
      weight: racket.weight || "",
      shape: racket.shape || "",
      featured: racket.featured,
      sold: racket.sold,
      certified: racket.certified ?? false,
    });
    setEditing(racket.id);
    setShowForm(true);
  }

  function startNew() {
    setForm(EMPTY_FORM);
    setEditing(null);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        shape: form.shape || undefined,
        weight: form.weight || undefined,
      };
      if (editing) {
        await fetch("/api/admin/rackets", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing, ...payload }),
        });
      } else {
        await fetch("/api/admin/rackets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setShowForm(false);
      setEditing(null);
      fetchRackets();
    } catch {
      alert("Échec de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette raquette définitivement?")) return;
    await fetch(`/api/admin/rackets?id=${id}`, { method: "DELETE" });
    fetchRackets();
  }

  async function toggleSold(racket: Racket) {
    await fetch("/api/admin/rackets", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: racket.id, sold: !racket.sold }),
    });
    fetchRackets();
  }

  async function toggleFeatured(racket: Racket) {
    await fetch("/api/admin/rackets", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: racket.id, featured: !racket.featured }),
    });
    fetchRackets();
  }

  async function toggleCertified(racket: Racket) {
    await fetch("/api/admin/rackets", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: racket.id, certified: !racket.certified }),
    });
    fetchRackets();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" style={{ color: "rgba(255,255,255,0.3)" }}>
        Chargement...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="admin-title">Raquettes</h1>
          <p className="admin-subtitle">{rackets.length} annonces au total</p>
        </div>
        <button onClick={startNew} className="btn-primary">+ Ajouter</button>
      </div>

      {/* ── Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
          <div className="w-full max-w-2xl my-8 rounded-2xl border border-white/10 overflow-hidden"
            style={{ background: "#13151c" }}>

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <h2 className="text-lg font-bold text-white">
                {editing ? "Modifier la Raquette" : "Ajouter une Raquette"}
              </h2>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all">
                ✕
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-5">

              <div>
                <label className={labelClass} style={labelStyle}>Titre *</label>
                <input className="input-field" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="ex: Bullpadel Hack 03 2024" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} style={labelStyle}>Marque *</label>
                  <select className="input-field" value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}>
                    <option value="">Sélectionner</option>
                    {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Modèle *</label>
                  <input className="input-field" value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass} style={labelStyle}>État *</label>
                  <select className="input-field" value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value })}>
                    {Object.entries(CONDITIONS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Prix (MAD) *</label>
                  <input type="number" className="input-field" value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Poids</label>
                  <input className="input-field" value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    placeholder="ex: 365g" />
                </div>
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Forme</label>
                <select className="input-field" value={form.shape}
                  onChange={(e) => setForm({ ...form, shape: e.target.value })}>
                  <option value="">Non spécifié</option>
                  {Object.entries(SHAPES).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Description *</label>
                <textarea className="input-field resize-none" rows={4} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Photos</label>
                <ImageUpload images={form.images}
                  onChange={(images) => setForm({ ...form, images })} />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-5 pt-1">
                {[
                  { key: "featured", label: "⭐ En Vedette" },
                  { key: "sold", label: "✓ Vendu" },
                  { key: "certified", label: "🏅 Certifié" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      form[key as keyof typeof form]
                        ? "bg-gold-500 border-gold-500"
                        : "border-white/20 bg-white/5 group-hover:border-white/40"
                    }`}
                      onClick={() => setForm({ ...form, [key]: !form[key as keyof typeof form] })}>
                      {form[key as keyof typeof form] && (
                        <svg className="w-3 h-3 text-[#0f1117]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.60)" }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/8">
              <button onClick={() => setShowForm(false)} className="btn-admin-secondary">
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? "Sauvegarde..." : editing ? "Mettre à jour" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Raquette</th>
                <th>Prix</th>
                <th>État</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rackets.map((racket) => (
                <tr key={racket.id}>
                  <td>
                    <p className="font-medium text-white">{racket.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>
                      {racket.brand} · {racket.model}
                    </p>
                  </td>
                  <td className="font-semibold text-white">
                    {racket.price.toLocaleString("fr-MA")} <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem" }}>MAD</span>
                  </td>
                  <td>
                    <span className={`badge badge-condition-${racket.condition}`}>
                      {CONDITIONS[racket.condition as keyof typeof CONDITIONS]}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {racket.sold && (
                        <span className="badge" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.12)" }}>Vendu</span>
                      )}
                      {racket.featured && (
                        <span className="badge" style={{ background: "rgba(249,204,74,0.12)", color: "#fcd34d", border: "1px solid rgba(249,204,74,0.25)" }}>⭐ Vedette</span>
                      )}
                      {racket.certified && (
                        <span className="badge badge-certified">🏅 Certifié</span>
                      )}
                      {!racket.sold && !racket.featured && !racket.certified && (
                        <span className="badge" style={{ background: "rgba(16,185,129,0.12)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.25)" }}>Actif</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => toggleCertified(racket)}
                        className={`p-1.5 rounded-lg transition-all ${racket.certified ? "text-amber-400 bg-amber-500/10" : "text-white/20 hover:text-amber-400 hover:bg-amber-500/10"}`}
                        title="Certifier">🏅</button>
                      <button onClick={() => toggleFeatured(racket)}
                        className={`p-1.5 rounded-lg transition-all ${racket.featured ? "text-gold-400 bg-gold-500/10" : "text-white/20 hover:text-gold-400 hover:bg-gold-500/10"}`}
                        title="Vedette">★</button>
                      <button onClick={() => toggleSold(racket)}
                        className="p-1.5 rounded-lg text-white/20 hover:text-white hover:bg-white/8 transition-all"
                        title={racket.sold ? "Disponible" : "Vendu"}>
                        {racket.sold ? "↩" : "✓"}
                      </button>
                      <button onClick={() => startEdit(racket)}
                        className="p-1.5 rounded-lg text-white/20 hover:text-white hover:bg-white/8 transition-all"
                        title="Modifier">✎</button>
                      <button onClick={() => handleDelete(racket.id)}
                        className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Supprimer">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rackets.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-16" style={{ color: "rgba(255,255,255,0.20)" }}>
                    Aucune raquette. Cliquez sur &quot;Ajouter&quot; pour créer votre première annonce.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}