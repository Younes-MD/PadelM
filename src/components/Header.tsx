"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLang } from "@/context/LangContext";
import { Lang } from "@/lib/i18n";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") router.push("/YM02YT03-SECURE/YM02YT03-secure");
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [router]);

  if (pathname.startsWith("/YM02YT03-SECURE")) return null;

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/rackets", label: t.nav.browse },
    { href: "/sell", label: t.nav.sell },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-[#050a14]/95 backdrop-blur-lg border-b border-white/10 shadow-lg shadow-black/30"
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          <Link href="/" className="flex items-center">
            <span className="font-display text-xl text-white">
               Padel<span className="text-gold-400">Ocaz</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-gold-500/10 text-gold-400 border border-gold-500/20"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language toggle */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              {(["fr", "en"] as Lang[]).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                    lang === l
                      ? "bg-gold-500 text-[#050a14]"
                      : "text-white/40 hover:text-white"
                  }`}>
                  {l}
                </button>
              ))}
            </div>

            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || ""}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-primary text-sm py-2.5">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10" aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-white/10 pt-3 space-y-1 bg-[#050a14]/95 backdrop-blur-lg">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-gold-500/10 text-gold-400"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}>
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 px-4 mt-2 pt-3 border-t border-white/10">
              {(["fr", "en"] as Lang[]).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-3 py-1 text-xs font-bold uppercase rounded-md transition-all ${
                    lang === l
                      ? "bg-gold-500 text-[#050a14]"
                      : "text-white/40 bg-white/5 hover:text-white"
                  }`}>
                  {l}
                </button>
              ))}
            </div>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || ""}`}
              target="_blank" rel="noopener noreferrer"
              className="block mx-4 mt-2 btn-primary text-sm text-center">
              WhatsApp
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}