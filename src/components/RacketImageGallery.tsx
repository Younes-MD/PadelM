"use client";
import { useState } from "react";
import Image from "next/image";

export default function RacketImageGallery({ images, title }: { images: string[]; title: string }) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
        <svg className="w-32 h-32 text-white/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={0.5}>
          <ellipse cx="12" cy="12" rx="5" ry="8" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      </div>
    );
  }

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-square bg-white/5 rounded-xl overflow-hidden mb-3 border border-white/10">
        <Image src={images[selected]} alt={`${title} ${selected + 1}`}
          fill priority sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-opacity duration-200" />

        {images.length > 1 && (
          <>
            <button onClick={() => setSelected(i => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/10 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={() => setSelected(i => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/10 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white/70 text-xs px-2.5 py-1 rounded-full border border-white/10">
              {selected + 1}/{images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button key={i} onClick={() => setSelected(i)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                i === selected
                  ? "border-gold-500 shadow-lg shadow-gold-500/30"
                  : "border-white/10 opacity-50 hover:opacity-100 hover:border-white/30"
              }`}>
              <Image src={img} alt={`${title} ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}