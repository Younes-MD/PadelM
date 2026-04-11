"use client";
import { useEffect, useState, useCallback } from "react";

interface Brand { id: string; name: string; active: boolean; createdAt: string; }

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
    if (!res.ok) { setError(data.error || "Erreur"); }
    else { setNewBrand(""); }
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
    if (!confirm(`Supprimer la marque "${name}"?`)) return;
    await fetch(`/api/admin/brands?id=${id}`, { method: "DELETE" });
    fetchBrands();
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-surface-400">Chargement...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Marques</h1>
        <p className="text-surface-500 text-sm">Gérez les marques disponibles sur le site</p>
      </div>

      {/* Add brand */}
      <div className="bg-white rounded-xl border border-surface-100 p-5 mb-6">
        <h2 className="font-semibold text-surface-900 mb-3">Ajouter une marque</h2>
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
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Brands list */}
      <div className="bg-white rounded-xl border border-surface-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-surface-100 flex items-center justify-between">
          <h2 className="font-semibold text-surface-900">Toutes les marques ({brands.length})</h2>
        </div>
        <div className="divide-y divide-surface-100">
          {brands.map((brand) => (
            <div key={brand.id} className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${brand.active ? "bg-emerald-500" : "bg-surface-300"}`} />
                <span className={`font-medium ${brand.active ? "text-surface-900" : "text-surface-400 line-through"}`}>
                  {brand.name}
                </span>
                <span className={`badge text-xs ${brand.active ? "bg-emerald-100 text-emerald-700" : "bg-surface-100 text-surface-500"}`}>
                  {brand.active ? "Actif" : "Désactivé"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggle(brand.id, brand.active)}
                  className="px-3 py-1 text-xs rounded-lg border border-surface-200 text-surface-600 hover:bg-surface-50 transition-colors">
                  {brand.active ? "Désactiver" : "Activer"}
                </button>
                <button onClick={() => handleDelete(brand.id, brand.name)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-500 transition-colors">
                  🗑
                </button>
              </div>
            </div>
          ))}
          {brands.length === 0 && (
            <div className="px-5 py-10 text-center text-surface-400 text-sm">
              Aucune marque. Ajoutez-en une ci-dessus.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}