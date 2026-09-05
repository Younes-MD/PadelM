"use client";
import { useEffect, useState, useCallback } from "react";

interface Brand { id: string; name: string; active: boolean; }

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBrand, setNewBrand] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const fetchBrands = useCallback(async () => {
    const res = await fetch("/api/admin/brands");
    const data = await res.json();
    setBrands(data.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  async function handleAdd() {
    if (!newBrand.trim()) return;
    setAdding(true); setError("");
    const res = await fetch("/api/admin/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newBrand.trim() }),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Erreur");
    else setNewBrand("");
    setAdding(false);
    fetchBrands();
  }

  async function handleToggle(id: string, active: boolean) {
    await fetch("/api/admin/brands", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !active }),
    });
    fetchBrands();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer "${name}"?`)) return;
    await fetch(`/api/admin/brands?id=${id}`, { method: "DELETE" });
    fetchBrands();
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64" style={{ color: "rgba(255,255,255,0.3)" }}>
      Chargement...
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="admin-title">Marques</h1>
        <p className="admin-subtitle">Gérez les marques disponibles sur le site</p>
      </div>

      {/* Add brand */}
      <div className="rounded-2xl border border-white/8 p-5 mb-5" style={{ background: "rgba(255,255,255,0.04)" }}>
        <h2 className="text-sm font-semibold text-white mb-3">Ajouter une marque</h2>
        <div className="flex gap-3">
          <input
            className="input-field flex-1"
            placeholder="Nom de la marque (ex: Nike)"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button onClick={handleAdd} disabled={adding || !newBrand.trim()} className="btn-primary px-6">
            {adding ? "..." : "+ Ajouter"}
          </button>
        </div>
        {error && (
          <p className="text-sm mt-2" style={{ color: "#fca5a5" }}>{error}</p>
        )}
      </div>

      {/* Brands list */}
      <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
        <div className="px-5 py-3 border-b border-white/8">
          <h2 className="text-sm font-semibold text-white">
            Toutes les marques ({brands.length})
          </h2>
        </div>

        {brands.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm" style={{ color: "rgba(255,255,255,0.20)" }}>
            Aucune marque. Ajoutez-en une ci-dessus.
          </div>
        ) : (
          <div>
            {brands.map((brand) => (
              <div key={brand.id}
                className="px-5 py-3 flex items-center justify-between border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${brand.active ? "bg-emerald-400" : "bg-white/20"}`} />
                  <span className={`font-medium text-sm ${brand.active ? "text-white" : "text-white/30 line-through"}`}>
                    {brand.name}
                  </span>
                  <span className="badge" style={brand.active
                    ? { background: "rgba(16,185,129,0.12)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.25)" }
                    : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.30)", border: "1px solid rgba(255,255,255,0.10)" }
                  }>
                    {brand.active ? "Actif" : "Désactivé"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggle(brand.id, brand.active)}
                    className="px-3 py-1 text-xs rounded-lg border border-white/10 transition-all hover:border-white/25"
                    style={{ color: "rgba(255,255,255,0.50)", background: "rgba(255,255,255,0.04)" }}>
                    {brand.active ? "Désactiver" : "Activer"}
                  </button>
                  <button onClick={() => handleDelete(brand.id, brand.name)}
                    className="p-1.5 rounded-lg transition-all hover:bg-red-500/10 text-white/20 hover:text-red-400">
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
