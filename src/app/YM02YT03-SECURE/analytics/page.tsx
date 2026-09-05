"use client";

import { useEffect, useState } from "react";

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

export default function AdminAnalyticsPage() {
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
    return <div className="flex items-center justify-center h-64 text-surface-400">Loading...</div>;
  }

  if (!data) {
    return <div className="text-center py-16 text-red-500">Failed to load analytics.</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Analytics</h1>
        <p className="text-surface-500 text-sm">Platform performance overview</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Rackets",
            value: data.rackets.total,
            detail: `${data.rackets.active} active · ${data.rackets.sold} sold`,
            color: "bg-blue-50 text-blue-700",
          },
          {
            label: "Total Revenue",
            value: `€${data.revenue.toLocaleString()}`,
            detail: `From ${data.rackets.sold} sold rackets`,
            color: "bg-emerald-50 text-emerald-700",
          },
          {
            label: "Submissions",
            value: data.submissions.total,
            detail: `${data.submissions.pending} pending · ${data.submissions.recentWeek} this week`,
            color: "bg-amber-50 text-amber-700",
          },
          {
            label: "Contact Requests",
            value: data.contacts.total,
            detail: `${data.contacts.unread} unread · ${data.contacts.recentWeek} this week`,
            color: "bg-purple-50 text-purple-700",
          },
        ].map((metric) => (
          <div key={metric.label} className={`rounded-xl p-5 ${metric.color}`}>
            <p className="text-sm font-medium opacity-80">{metric.label}</p>
            <p className="text-3xl font-bold mt-1">{metric.value}</p>
            <p className="text-xs mt-2 opacity-70">{metric.detail}</p>
          </div>
        ))}
      </div>

      {/* Conversion funnel */}
      <div className="bg-white rounded-xl border border-surface-100 p-6 mb-8">
        <h2 className="font-semibold text-surface-900 mb-4">Funnel Overview</h2>
        <div className="space-y-3">
          {[
            { label: "Total Listings", value: data.rackets.total, pct: 100 },
            {
              label: "Contact Requests",
              value: data.contacts.total,
              pct: data.rackets.total
                ? Math.round((data.contacts.total / data.rackets.total) * 100)
                : 0,
            },
            {
              label: "Sold",
              value: data.rackets.sold,
              pct: data.rackets.total
                ? Math.round((data.rackets.sold / data.rackets.total) * 100)
                : 0,
            },
          ].map((step) => (
            <div key={step.label} className="flex items-center gap-4">
              <div className="w-36 text-sm text-surface-600">{step.label}</div>
              <div className="flex-1 bg-surface-100 rounded-full h-6 overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                  style={{ width: `${Math.max(step.pct, 5)}%` }}
                >
                  <span className="text-xs font-medium text-white">{step.value}</span>
                </div>
              </div>
              <div className="w-12 text-right text-sm text-surface-500">
                {step.pct}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent messages */}
      <div className="bg-white rounded-xl border border-surface-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
          <h2 className="font-semibold text-surface-900">Recent Messages</h2>
          <span className="badge bg-brand-100 text-brand-700">
            {data.contacts.unread} unread
          </span>
        </div>
        {data.recentActivity.length > 0 ? (
          <div className="divide-y divide-surface-100">
            {data.recentActivity.map((item) => (
              <div key={item.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-surface-900">
                      {item.name}
                      {!item.read && (
                        <span className="ml-2 w-2 h-2 bg-brand-500 rounded-full inline-block" />
                      )}
                    </p>
                    <p className="text-xs text-surface-400">{item.email}</p>
                    <p className="text-sm text-surface-600 mt-1 line-clamp-2">
                      {item.message}
                    </p>
                  </div>
                  <p className="text-xs text-surface-400 whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center text-surface-400 text-sm">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
