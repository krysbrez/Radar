import { Link } from "react-router-dom";
import { ALT_CATEGORIES } from "../data/categories";

function ReturnBadge({ label, value }) {
  const isDown = value.startsWith("-");
  return (
    <div className="text-center">
      <p className="text-[10px] text-outline uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-xs font-black font-headline ${isDown ? "text-red-500" : "text-green-600"}`}>{value}</p>
    </div>
  );
}

function CategoryCard({ cat }) {
  const isDown = cat.stat.startsWith("-");
  return (
    <Link
      to={`/kategorie/${cat.id}`}
      className={`group bg-white rounded-2xl border ${cat.border} hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden flex flex-col`}
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden bg-surface-container">
        <img
          src={cat.image}
          alt={cat.imageAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
          <span className="text-xl">{cat.icon}</span>
          <span className="text-white text-sm font-black font-headline drop-shadow">{cat.label}</span>
        </div>
        <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${
          isDown ? "bg-red-500/90 text-white" : "bg-green-500/90 text-white"
        }`}>
          {cat.stat}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {cat.tagline ? (
          <p className="text-xs text-on-surface-variant italic mb-3 leading-snug">"{cat.tagline}"</p>
        ) : (
          <p className="text-xs text-outline mb-3">{cat.note}</p>
        )}

        {/* Returns CZ / EU / Global */}
        <div className="grid grid-cols-3 gap-1 bg-surface-container-low rounded-lg p-2 mb-3">
          <ReturnBadge label="CZ" value={cat.returns.cz} />
          <div className="w-px bg-outline-variant/20 self-stretch mx-auto" />
          <ReturnBadge label="EU" value={cat.returns.eu} />
          <div className="col-span-3 h-px bg-outline-variant/15 my-0.5" />
          <div className="col-span-3">
            <ReturnBadge label="Global" value={cat.returns.global} />
          </div>
        </div>

        {/* Where to buy preview */}
        <div className="flex flex-wrap gap-1 mb-3">
          {cat.whereToBuy.slice(0, 2).map((w) => (
            <span key={w.name} className="text-[10px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded font-semibold">
              {w.flag} {w.name}
            </span>
          ))}
          {cat.whereToBuy.length > 2 && (
            <span className="text-[10px] text-outline px-1 py-0.5">+{cat.whereToBuy.length - 2} další</span>
          )}
        </div>

        <span className={`mt-auto inline-flex items-center gap-1 text-xs font-bold ${cat.textColor} group-hover:gap-2 transition-all`}>
          Prozkoumat
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </div>
    </Link>
  );
}

export default function AlternativeInvestments() {
  return (
    <section id="alternativni" className="max-w-7xl mx-auto px-6 md:px-8 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-black tracking-widest uppercase text-outline mb-2 font-headline">
            Radar Alternativní Index
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-primary font-headline tracking-tight">
            Alternativní investice
          </h2>
          <p className="text-on-surface-variant mt-2 max-w-lg">
            Aktiva mimo mainstream — pro ty, co chtějí víc než akcie a dluhopisy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ALT_CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} cat={cat} />
        ))}
      </div>

      <p className="text-center text-xs text-outline mt-6 italic">
        Výnosy jsou historické průměry a neslouží jako investiční poradenství.
      </p>
    </section>
  );
}
