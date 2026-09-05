"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { CONDITIONS } from "@/lib/validators";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  brand: string;
  model: string;
  condition: string;
  askingPrice?: number;
  description: string;
  images: string[];
  status: string;
  createdAt: string;
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    const res = await fetch("/api/admin/submissions");
    const data = await res.json();
    setSubmissions(data.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  async function handleAction(id: string, status: "approved" | "rejected") {
    const action = status === "approved" ? "approve" : "reject";
    if (!confirm(`Are you sure you want to ${action} this submission?`)) return;

    await fetch("/api/admin/submissions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    fetchSubmissions();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this submission permanently?")) return;
    await fetch(`/api/admin/submissions?id=${id}`, { method: "DELETE" });
    fetchSubmissions();
  }

  const filtered =
    filter === "all"
      ? submissions
      : submissions.filter((s) => s.status === filter);

  const counts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-surface-400">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Submissions</h1>
        <p className="text-surface-500 text-sm">Review rackets submitted by sellers</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-surface-100 p-1 rounded-lg w-fit">
        {(["pending", "approved", "rejected", "all"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
              filter === tab
                ? "bg-white text-surface-900 shadow-sm"
                : "text-surface-500 hover:text-surface-700"
            }`}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Submissions list */}
      <div className="space-y-4">
        {filtered.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-xl border border-surface-100 overflow-hidden"
          >
            <div
              className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-surface-50 transition-colors"
              onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium text-surface-900">
                    {sub.brand} {sub.model}
                  </p>
                  <p className="text-xs text-surface-400">
                    by {sub.name} · {sub.email} ·{" "}
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`badge ${
                    sub.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : sub.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {sub.status}
                </span>
                {sub.askingPrice && (
                  <span className="font-semibold text-surface-900">
                    €{sub.askingPrice}
                  </span>
                )}
                <svg
                  className={`w-5 h-5 text-surface-400 transition-transform ${
                    expandedId === sub.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {expandedId === sub.id && (
              <div className="px-5 pb-5 border-t border-surface-100 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-surface-500">Condition</p>
                      <span className={`badge badge-condition-${sub.condition}`}>
                        {CONDITIONS[sub.condition as keyof typeof CONDITIONS]}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-surface-500 mb-1">Description</p>
                      <p className="text-sm text-surface-700 whitespace-pre-line">
                        {sub.description}
                      </p>
                    </div>
                    {sub.phone && (
                      <div>
                        <p className="text-xs text-surface-500">Phone</p>
                        <p className="text-sm">{sub.phone}</p>
                      </div>
                    )}
                  </div>

                  {sub.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {sub.images.map((img, i) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-lg overflow-hidden bg-surface-100"
                        >
                          <Image
                            src={img}
                            alt=""
                            fill
                            sizes="150px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {sub.status === "pending" && (
                  <div className="flex gap-3 mt-5 pt-4 border-t border-surface-100">
                    <button
                      onClick={() => handleAction(sub.id, "approved")}
                      className="btn-primary text-sm py-2"
                    >
                      ✓ Approve & List
                    </button>
                    <button
                      onClick={() => handleAction(sub.id, "rejected")}
                      className="btn-secondary text-sm py-2 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}

                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="text-xs text-surface-400 hover:text-red-500 transition-colors"
                  >
                    Delete permanently
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-surface-400">
            No {filter === "all" ? "" : filter} submissions.
          </div>
        )}
      </div>
    </div>
  );
}
