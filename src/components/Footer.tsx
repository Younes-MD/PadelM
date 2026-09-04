import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center mb-4">
              <span className="font-display text-lg text-white">Padel Ocaz</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-md text-white/40">
              Votre marketplace de confiance pour les raquettes de padel d'occasion. Achetez et vendez en toute confiance au Maroc.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Liens Rapides</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/rackets" className="text-white/40 hover:text-gold-400 transition-colors">Parcourir les Raquettes</Link></li>
              <li><Link href="/sell" className="text-white/40 hover:text-gold-400 transition-colors">Vendre votre Raquette</Link></li>
              <li><Link href="/contact" className="text-white/40 hover:text-gold-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              {process.env.NEXT_PUBLIC_CONTACT_EMAIL && (
                <li><a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`} className="text-white/40 hover:text-gold-400 transition-colors">{process.env.NEXT_PUBLIC_CONTACT_EMAIL}</a></li>
              )}
              {process.env.NEXT_PUBLIC_WHATSAPP && (
                <li><a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-gold-400 transition-colors">WhatsApp</a></li>
              )}
            </ul>
          </div>
        </div>
        <div className="accent-line my-8" />
        <p className="text-center text-xs text-white/20">© {new Date().getFullYear()} Padel Ocaz. Tous droits réservés.</p>
        {/* Admin hidden — press Ctrl+Shift+A */}
      </div>
    </footer>
  );
}
