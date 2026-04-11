"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Analytics {
  rackets: { total: number; active: number; sold: number };
  submissions: { total: number; pending: number; recentWeek: number };
  contacts: { total: number; unread: number; recentWeek: number };
  revenue: number;
  recentActivity: Array<{
    id: string;
    name: string;
    email: string;
    message: string;
    read: boolean;
    createdAt: string;
  }>;
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl p-5 ${accent ? "bg-brand-600 text-white" : "bg-white border border-surface-100"}`}>
      <p className={`text-sm ${accent ? "text-brand-100" : "text-surface-500"}`}>{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      {sub && (
        <p className={`text-xs mt-1 ${accent ? "text-brand-200" : "text-surface-400"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-surface-400">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16 text-red-500">
        Failed to load analytics.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
        <p className="text-surface-500 text-sm">Overview of your marketplace</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Active Listings"
          value={data.rackets.active}
          sub={`${data.rackets.sold} sold`}
          accent
        />
        <StatCard
          label="Pending Submissions"
          value={data.submissions.pending}
          sub={`${data.submissions.recentWeek} this week`}
        />
        <StatCard
          label="Unread Messages"
          value={data.contacts.unread}
          sub={`${data.contacts.recentWeek} this week`}
        />
        <StatCard
          label="Revenue (Sold)"
          value={`€${data.revenue.toLocaleString()}`}
          sub={`${data.rackets.total} total rackets`}
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/admin/rackets"
          className="bg-white border border-surface-100 rounded-xl p-5 hover:border-brand-300 transition-colors group"
        >
          <h3 className="font-semibold text-surface-900 group-hover:text-brand-600">
            Manage Rackets →
          </h3>
          <p className="text-sm text-surface-500 mt-1">
            Add, edit, or remove racket listings
          </p>
        </Link>
        <Link
          href="/admin/submissions"
          className="bg-white border border-surface-100 rounded-xl p-5 hover:border-brand-300 transition-colors group"
        >
          <h3 className="font-semibold text-surface-900 group-hover:text-brand-600">
            Review Submissions →
          </h3>
          <p className="text-sm text-surface-500 mt-1">
            {data.submissions.pending} pending review
          </p>
        </Link>
      </div>

      {/* Recent contacts */}
      <div className="bg-white border border-surface-100 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100">
          <h2 className="font-semibold text-surface-900">Recent Messages</h2>
        </div>
        {data.recentActivity.length > 0 ? (
          <div className="divide-y divide-surface-100">
            {data.recentActivity.map((item) => (
              <div key={item.id} className="px-5 py-3 flex items-start gap-3">
                {!item.read && (
                  <span className="w-2 h-2 bg-brand-500 rounded-full mt-2 shrink-0" />
                )}
                <div className={`flex-1 ${item.read ? "ml-5" : ""}`}>
                  <p className="text-sm font-medium text-surface-900">
                    {item.name}{" "}
                    <span className="text-surface-400 font-normal">
                      ({item.email})
                    </span>
                  </p>
                  <p className="text-sm text-surface-500 line-clamp-1 mt-0.5">
                    {item.message}
                  </p>
                  <p className="text-xs text-surface-400 mt-1">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-8 text-center text-surface-400 text-sm">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
