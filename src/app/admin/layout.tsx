"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const ADMIN_NAV = [
  {
    href: "/admin", label: "Tableau de Bord",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    href: "/admin/rackets", label: "Raquettes",
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><ellipse cx="12" cy="12" rx="5" ry="8" /><line x1="12" y1="4" x2="12" y2="20" /></svg>,
  },
  {
    href: "/admin/submissions", label: "Soumissions",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  },
  {
    href: "/admin/brands", label: "Marques",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>,
  },
  {
    href: "/admin/analytics", label: "Analytiques",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/YM02YT03-secure") return <>{children}</>;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/YM02YT03-secure");
    router.refresh();
  }

  return (
    <div data-admin className="min-h-screen flex" style={{ background: "#0f1117" }}>

      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col border-r border-white/8" style={{ background: "#13151c" }}>

        {/* Logo */}
        <div className="p-5 border-b border-white/8">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gold-500 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/25">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#0f1117]" stroke="currentColor" strokeWidth={2.5}>
                <ellipse cx="12" cy="12" rx="5" ry="8" />
                <line x1="12" y1="4" x2="12" y2="20" />
                <line x1="7.5" y1="8" x2="16.5" y2="8" />
                <line x1="7.5" y1="16" x2="16.5" y2="16" />
              </svg>
            </div>
            <div>
              <p className="font-display text-base text-white leading-none">
                Padel<span className="text-gold-400">Market</span>
              </p>
              <p className="text-xs text-white/25 mt-0.5">Administration</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {ADMIN_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-gold-500/10 text-gold-400 border border-gold-500/20"
                    : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                }`}>
                <span className={active ? "text-gold-400" : "text-white/30"}>{item.icon}</span>
                {item.label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/8 space-y-0.5">
          <a href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/35 hover:text-white hover:bg-white/5 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Voir le site
          </a>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/35 hover:text-red-400 hover:bg-red-500/8 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Mobile header */}
        <header className="md:hidden border-b border-white/8 px-4 py-3 flex items-center justify-between" style={{ background: "#13151c" }}>
          <span className="font-display text-lg text-white">
            Padel<span className="text-gold-400">Market</span>
          </span>
          <div className="flex items-center gap-1">
            {ADMIN_NAV.map((item) => (
              <Link key={item.href} href={item.href}
                className={`p-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-gold-500/10 text-gold-400"
                    : "text-white/30 hover:bg-white/5 hover:text-white"
                }`}>
                {item.icon}
              </Link>
            ))}
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 md:p-8" style={{ color: "#e8e8e8" }}>

          {/* Top bar */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/8">
            <div className="flex items-center gap-2 text-sm text-white/30">
              <span>Admin</span>
              <span>/</span>
              <span className="text-white/60 capitalize">
                {pathname === "/admin" ? "Tableau de Bord" : pathname.split("/admin/")[1] || ""}
              </span>
            </div>
            <button onClick={handleLogout}
              className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-red-400 hover:bg-red-500/8 border border-white/8 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
              Quitter
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}