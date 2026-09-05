import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import RacketImageGallery from "@/components/RacketImageGallery";

export const revalidate = 30;

const CONDITIONS_FR: Record<string, string> = { new: "Neuf", like_new: "Comme Neuf", good: "Bon État", fair: "Correct" };
const SHAPES_FR: Record<string, string> = { round: "Ronde (Contrôle)", diamond: "Diamant (Puissance)", teardrop: "Goutte (Hybride)" };

interface Props { params: { id: string } }

async function getRacket(id: string) { return prisma.racket.findUnique({ where: { id } }); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const racket = await getRacket(id);
  if (!racket) return { title: "Raquette introuvable" };
  return {
    title: `${racket.title} — ${racket.price.toLocaleString("fr-MA")} MAD`,
    description: racket.description.slice(0, 160),
    openGraph: { title: racket.title, description: racket.description.slice(0, 160), images: racket.images[0] ? [racket.images[0]] : [] },
  };
}

export default async function RacketDetailPage({ params }: Props) {
  const { id } = await params;
  const racket = await getRacket(id);
  if (!racket) notFound();

  const conditionLabel = CONDITIONS_FR[racket.condition] || racket.condition;
  const shapeLabel = racket.shape ? (SHAPES_FR[racket.shape] || racket.shape) : null;
  const whatsappMsg = encodeURIComponent(`Bonjour! Je suis intéressé par ${racket.title} à ${racket.price.toLocaleString("fr-MA")} MAD sur Padel Ocaz.`);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-16">
      <nav className="mb-6 text-sm text-white/40">
        <Link href="/rackets" className="hover:text-gold-400 transition-colors">← Retour aux Raquettes</Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery — client component (fixes the bug) */}
        <div className="relative">
          <RacketImageGallery images={racket.images} title={racket.title} />
          {racket.sold && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm rounded-xl z-10">
              <span className="bg-white text-court-950 font-bold text-lg px-6 py-3 rounded-full uppercase tracking-wider">Vendu</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-gold-400 font-medium text-sm uppercase tracking-wider mb-2">{racket.brand}</p>
          <h1 className="font-display text-3xl md:text-4xl text-white mb-3">{racket.title}</h1>

          {(racket as any).certified && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500/10 border border-gold-500/30 rounded-full text-gold-400 text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Certifié par notre équipe
            </div>
          )}

          <p className="text-4xl font-bold text-white mb-6">
            {racket.price.toLocaleString("fr-MA")} <span className="text-xl text-white/40 font-normal">MAD</span>
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="card-glass p-3">
              <p className="text-xs text-white/40 mb-1">État</p>
              <span className={`badge badge-condition-${racket.condition}`}>{conditionLabel}</span>
            </div>
            <div className="card-glass p-3">
              <p className="text-xs text-white/40 mb-1">Marque</p>
              <p className="font-semibold text-sm text-white">{racket.brand}</p>
            </div>
            {racket.weight && (
              <div className="card-glass p-3">
                <p className="text-xs text-white/40 mb-1">Poids</p>
                <p className="font-semibold text-sm text-white">{racket.weight}</p>
              </div>
            )}
            {shapeLabel && (
              <div className="card-glass p-3">
                <p className="text-xs text-white/40 mb-1">Forme</p>
                <p className="font-semibold text-sm text-white">{shapeLabel}</p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="font-semibold text-white mb-2">Description</h2>
            <p className="text-white/50 leading-relaxed whitespace-pre-line">{racket.description}</p>
          </div>

          {!racket.sold && (
            <div className="space-y-3">
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || ""}?text=${whatsappMsg}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-primary w-full text-center py-4 text-base">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contacter via WhatsApp
              </a>
              <Link href={`/contact?racket=${racket.id}&title=${encodeURIComponent(racket.title)}`}
                className="btn-secondary w-full text-center py-4 text-base">
                Envoyer un message
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}