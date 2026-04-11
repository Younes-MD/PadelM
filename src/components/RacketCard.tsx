"use client";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/context/LangContext";

interface RacketCardProps {
  id: string; title: string; brand: string; condition: string;
  price: number; images: string[]; sold?: boolean; certified?: boolean;
}

export default function RacketCard({ id, title, brand, condition, price, images, sold, certified }: RacketCardProps) {
  const { t } = useLang();
  const conditionLabel = t.conditions[condition as keyof typeof t.conditions] || condition;

  return (
    <Link href={`/rackets/${id}`} className="card group block">
      <div className="relative aspect-square bg-white/5 overflow-hidden">
        {images.length > 0 ? (
          <Image src={images[0]} alt={title} fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-20 h-20 text-white/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
              <ellipse cx="12" cy="12" rx="5" ry="8" />
              <line x1="12" y1="4" x2="12" y2="20" />
            </svg>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {sold && (
          <div className="absolute inset-0 bg-black/65 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-white text-court-950 font-bold text-sm px-4 py-2 rounded-full uppercase tracking-wider">
              {t.sold}
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={`badge badge-condition-${condition}`}>{conditionLabel}</span>
          {certified && (
            <span className="badge badge-certified flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t.certified}
            </span>
          )}
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white/70 text-xs px-2 py-0.5 rounded-full border border-white/10">
            1/{images.length}
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-medium text-gold-400 uppercase tracking-wider mb-1">{brand}</p>
        <h3 className="font-semibold text-white group-hover:text-gold-300 transition-colors line-clamp-1">{title}</h3>
        <p className="mt-2 text-xl font-bold text-white">
          {price.toLocaleString("fr-MA")} <span className="text-sm font-normal text-white/40">MAD</span>
        </p>
      </div>
    </Link>
  );
}