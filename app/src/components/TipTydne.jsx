export default function TipTydne() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-8">
      <div className="bg-surface-container-low rounded-2xl px-8 md:px-16 py-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-primary/5 pointer-events-none" />
        <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-primary-fixed/20 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-4 py-2 mb-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xs font-black text-primary uppercase tracking-widest font-headline">
              Tip týdne
            </span>
          </div>

          <blockquote className="text-xl md:text-2xl text-on-surface-variant leading-relaxed font-medium italic mb-8">
            "Diverzifikace není jen o tom vlastnit hodně věcí. Je o tom vlastnit věci, které se{" "}
            <strong className="text-primary not-italic">v krizi nechovají stejně</strong>.
            Pokud vše ve vašem portfoliu roste ve stejnou chvíli, nejste diverzifikovaní —
            jste jen v riskantní jízdě nahoru."
          </blockquote>

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-white font-black text-xs font-headline flex-shrink-0">
              PN
            </div>
            <div className="text-left">
              <p className="font-bold text-primary font-headline">Petr Novák</p>
              <p className="text-sm text-outline">Hlavní analytik · Radar Editorial</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
