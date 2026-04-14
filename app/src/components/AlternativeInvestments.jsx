import { Link } from "react-router-dom";
import { ALT_CATEGORIES } from "../data/categories";

function StatBadge({ value, period }) {
  const isDown = value.startsWith("-");
  return (
    <span className={`font-headline inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black ${
      isDown ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
    }`}>
      {isDown ? "▼" : "▲"} {value}
      {period && <span className="font-normal opacity-70">/{period}</span>}
    </span>
  );
}

function CategoryCardDark({ cat, size = "normal" }) {
  const isDown = cat.stat.startsWith("-");
  const isFeatured = size === "featured";

  return (
    <Link
      to={`/kategorie/${cat.id}`}
      className={`group relative overflow-hidden rounded-3xl border border-white/8 bg-[#000d20] transition-all duration-500 hover:border-white/15 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:-translate-y-1 ${
        isFeatured ? "md:row-span-2" : ""
      }`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${isFeatured ? "h-64 md:h-80" : "h-44"}`}>
        <img
          src={cat.image}
          alt={cat.imageAlt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000d20] via-[#000d20]/50 to-transparent" />

        {/* Stat badge top right */}
        <div className="absolute right-3 top-3">
          <StatBadge value={cat.stat} />
        </div>

        {/* Icon + label bottom left */}
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <span className="text-2xl">{cat.icon}</span>
          <span className="font-headline font-black text-white drop-shadow-lg">{cat.label}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {cat.tagline && (
          <p className="mb-3 text-sm italic leading-relaxed text-white/70">"{cat.tagline}"</p>
        )}

        {/* Returns row */}
        <div className="mb-4 flex items-center gap-3">
          {[
            { label: "CZ", val: cat.returns.cz },
            { label: "EU", val: cat.returns.eu },
            { label: "Globálně", val: cat.returns.global },
          ].map((r) => {
            const down = r.val.startsWith("-");
            return (
              <div key={r.label} className="text-center">
                <p className="text-[10px] font-black uppercase tracking-wider text-white/70">{r.label}</p>
                <p className={`font-headline text-xs font-black ${down ? "text-red-400" : "text-emerald-400"}`}>{r.val}</p>
              </div>
            );
          })}
        </div>

        {/* Where to buy pills */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {cat.whereToBuy.slice(0, 3).map((w) => (
            <span key={w.name} className="rounded-full border border-white/10 bg-white/6 px-2 py-0.5 text-[10px] font-semibold text-white/65">
              {w.flag} {w.name}
            </span>
          ))}
        </div>

        <span className={`font-headline inline-flex items-center gap-1.5 text-xs font-black ${cat.textColor} group-hover:gap-2.5 transition-all`}>
          Prozkoumat
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </div>
    </Link>
  );
}

export default function AlternativeInvestments() {
  const featured = ALT_CATEGORIES.slice(0, 1);
  const rest = ALT_CATEGORIES.slice(1);

  return (
    <section id="alternativni" className="bg-[#000613] py-20 md:py-28">
      {/* Gold top border */}
      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,215,0,0.3), transparent)" }} />

      <div className="mx-auto max-w-7xl px-6 md:px-8 pt-16">
        {/* Header */}
        <div className="reveal mb-12 flex items-end justify-between">
          <div>
            <p className="font-headline mb-2 text-xs font-black uppercase tracking-[0.28em] text-white/70">
              Radar Alternativní Index
            </p>
            <h2 className="font-headline text-3xl font-black tracking-tight text-white md:text-4xl">
              Alternativní <span className="text-shimmer-gold">investice</span>
            </h2>
            <p className="mt-2 max-w-lg text-sm text-white/70">
              Aktiva mimo mainstream — pro ty, co chtějí víc než akcie a dluhopisy.
            </p>
          </div>
        </div>

        {/* Masonry grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {/* Featured large card */}
          {featured.map((cat) => (
            <div key={cat.id} className="col-span-2 reveal">
              <CategoryCardDark cat={cat} size="featured" />
            </div>
          ))}

          {/* Regular cards */}
          {rest.map((cat, i) => (
            <div key={cat.id} className={`reveal reveal-delay-${(i % 3) + 1}`}>
              <CategoryCardDark cat={cat} />
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs italic text-white/50">
          Výnosy jsou historické průměry a neslouží jako investiční poradenství.
        </p>
      </div>
    </section>
  );
}
