"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import RacketCard from "@/components/RacketCard";
import { useLang } from "@/context/LangContext";

interface Racket { id: string; title: string; brand: string; condition: string; price: number; images: string[]; sold: boolean; certified: boolean; featured: boolean; }

export default function HomePage() {
  const { t } = useLang();
  const [rackets, setRackets] = useState<Racket[]>([]);

  useEffect(() => {
    fetch("/api/rackets")
      .then(r => r.json())
      .then(r => {
        const all: Racket[] = r.data || [];
        setRackets(all.filter(x => x.featured && !x.sold).slice(0, 6));
      });
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Dark blue overlay on top of body background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#050a14]/80 via-[#070d1a]/60 to-[#050a14]/80" />

        {/* Subtle light glows — blue only */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl animate-float" />
          <div className="absolute bottom-1/3 left-1/5 w-60 h-60 rounded-full bg-blue-400/4 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full bg-gold-500/4 blur-2xl animate-pulse-slow" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-36 z-10 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-400 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
              {t.hero.trusted}
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.05] mb-6">
              {t.hero.findYour}
              <br />
              <span className="text-gold-400">{t.hero.perfectRacket}</span>
            </h1>

            <p className="text-white/55 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/rackets" className="btn-primary text-base px-8 py-4">{t.hero.browse}</Link>
              <Link href="/sell" className="btn-secondary text-base px-8 py-4">{t.hero.sell}</Link>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 max-w-xs">
              {[{ v: "100+", l: "Raquettes" }, { v: "100%", l: "Vérifié" }].map(s => (
                <div key={s.l} className="text-center">
                  <p className="text-2xl font-bold text-gold-400">{s.v}</p>
                  <p className="text-xs text-white/35 mt-0.5 uppercase tracking-wider">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050a14] to-transparent" />
      </section>

      {/* Trust signals */}
      <section className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {t.trust.map((item) => (
              <div key={item.label} className="text-center group cursor-default">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                <p className="font-semibold text-white text-sm">{item.label}</p>
                <p className="text-white/35 text-xs mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rackets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-gold-400 font-medium text-sm uppercase tracking-wider mb-2">{t.featured.label}</p>
            <h2 className="section-title">{t.featured.title}</h2>
          </div>
          <Link href="/rackets" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors">
            {t.featured.viewAll}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {rackets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rackets.map(r => <RacketCard key={r.id} {...r} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-white/30">
            <p className="text-lg">{t.featured.empty}</p>
          </div>
        )}

        <div className="sm:hidden mt-8 text-center">
          <Link href="/rackets" className="btn-secondary">{t.featured.viewAllMobile}</Link>
        </div>
      </section>

      {/* Sell CTA */}
      <section className="relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050a14]/90 to-[#070d1a]/90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" /> Gratuit
          </div>
          <h2 className="font-display text-3xl md:text-5xl text-white mb-4">{t.sellCta.title}</h2>
          <p className="text-white/45 max-w-md mx-auto mb-8 text-lg">{t.sellCta.sub}</p>
          <Link href="/sell" className="btn-primary text-base px-8 py-4">{t.sellCta.cta}</Link>
        </div>
      </section>
    </>
  );
}