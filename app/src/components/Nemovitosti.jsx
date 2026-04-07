import { Link } from "react-router-dom";
import { getArticlesByCategory } from "../data/articles";
import PriceWatcherForm from "./PriceWatcherForm";

const REGIONS = [
  { name: "Praha", yield: "3.3 %", trend: "stable", x: 205, y: 155 },
  { name: "Brno", yield: "4.0 %", trend: "up", x: 255, y: 225 },
  { name: "Ostrava", yield: "5.3 %", trend: "up", x: 320, y: 120 },
  { name: "Plzeň", yield: "4.8 %", trend: "up", x: 110, y: 175 },
  { name: "Olomouc", yield: "4.6 %", trend: "up", x: 295, y: 195 },
  { name: "Liberec", yield: "4.2 %", trend: "stable", x: 185, y: 95 },
];

function RegionMap() {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-5">
      <h4 className="text-sm font-black text-primary font-headline uppercase tracking-wider mb-4">
        Výnosová mapa ČR
      </h4>
      <div className="relative bg-surface-container-low rounded-xl overflow-hidden" style={{ paddingBottom: "60%" }}>
        <svg
          viewBox="0 0 420 280"
          className="absolute inset-0 w-full h-full"
          fill="none"
        >
          {/* Simplified Czech Republic outline */}
          <path
            d="M 60 100 L 80 80 L 120 70 L 160 60 L 200 55 L 240 58 L 280 62 L 320 70 L 355 85 L 375 105 L 378 125 L 370 145 L 355 165 L 340 180 L 310 200 L 280 215 L 250 225 L 220 230 L 190 228 L 160 220 L 130 210 L 100 195 L 75 175 L 60 155 L 50 130 Z"
            fill="#e1e3e4"
            stroke="#c4c6cf"
            strokeWidth="1.5"
          />
          {/* Region dots */}
          {REGIONS.map((r) => (
            <g key={r.name}>
              <circle
                cx={r.x} cy={r.y} r="14"
                fill={r.trend === "up" ? "#dcfce7" : "#f3f4f5"}
                stroke={r.trend === "up" ? "#16a34a" : "#74777f"}
                strokeWidth="1.5"
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
              <text x={r.x} y={r.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="7" fontWeight="bold" fill={r.trend === "up" ? "#16a34a" : "#43474e"}>
                {r.yield}
              </text>
              <text x={r.x} y={r.y + 22} textAnchor="middle" fontSize="7" fill="#43474e" fontWeight="600">
                {r.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-100 border border-green-600" />
          <span className="text-xs text-on-surface-variant">Výnos roste</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-surface-container border border-outline" />
          <span className="text-xs text-on-surface-variant">Stabilní</span>
        </div>
        <span className="text-xs text-outline ml-auto">Hrubý nájemní výnos</span>
      </div>
    </div>
  );
}

export default function Nemovitosti() {
  const articles = getArticlesByCategory("nemovitosti");
  const featuredArticle = articles[0];
  const secondaryArticles = articles.slice(1, 4);

  return (
    <section id="nemovitosti" className="max-w-7xl mx-auto px-6 md:px-8 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-black tracking-widest uppercase text-outline mb-2 font-headline">Sektor</p>
          <h2 className="text-4xl md:text-5xl font-black text-primary font-headline tracking-tight leading-none">
            Nemovitosti
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-on-surface-variant">
            Nejen ceny bytů. Radar ukazuje, kde dává smysl sledovat výnos, tlak na nájem a momenty, kdy trh na chvíli povolí.
          </p>
        </div>
        <Link
          to="/clanek/najemni-vynosy-vs-sazby"
          className="hidden md:flex items-center gap-1.5 text-sm font-bold text-primary font-headline border-b-2 border-primary-fixed-dim pb-0.5 hover:border-primary transition-colors"
        >
          Všechny články
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Articles */}
        <div className="lg:col-span-8">
          {featuredArticle && (
            <Link
              to={`/clanek/${featuredArticle.id}`}
              className="group relative mb-5 block overflow-hidden rounded-[1.75rem] border border-outline-variant/10 bg-slate-900"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
              {featuredArticle.image ? (
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="h-[22rem] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <div className="h-[22rem] w-full bg-gradient-to-br from-slate-900 to-slate-950" />
              )}
              <div className="absolute inset-0 z-20 flex max-w-xl flex-col justify-end p-7">
                <div className="mb-4 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-white/12 px-3 py-1 font-black uppercase tracking-[0.18em] text-white font-headline">
                    Hlavní signál
                  </span>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 font-bold text-emerald-200">
                    {featuredArticle.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-black leading-tight text-white font-headline">
                  {featuredArticle.title}
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80">
                  {featuredArticle.excerpt}
                </p>
                <div className="mt-5 flex items-center gap-3 text-sm">
                  <span className="font-black text-white font-headline">Číst hlavní analýzu →</span>
                  <span className="text-white/50">{featuredArticle.readTime}</span>
                  <span className="text-white/40">·</span>
                  <span className="text-white/50">{featuredArticle.date}</span>
                </div>
              </div>
            </Link>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {secondaryArticles.map((article) => (
              <Link
                key={article.id}
                to={`/clanek/${article.id}`}
                className="group flex flex-col"
              >
                {/* Photo */}
                <div className="rounded-xl overflow-hidden mb-4 aspect-[16/10] relative bg-slate-800 group-hover:shadow-md transition-shadow">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950" />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-sm">{article.tag}</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm rounded-lg px-2.5 py-1.5 group-hover:bg-black/60 transition-colors">
                    <p className="text-white font-black text-sm font-headline">→</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-outline flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span className="text-xs text-outline">{article.date}</span>
                </div>
                <h3 className="text-base font-black text-primary font-headline leading-snug mb-1.5 group-hover:text-primary-container transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2 flex-1 mb-3">
                  {article.excerpt}
                </p>
                <span className="text-sm font-bold text-primary font-headline group-hover:text-primary-container transition-colors">
                  Číst více →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-5">
          <RegionMap />
          <PriceWatcherForm category="Nemovitosti" />

          {/* Quick stats */}
          <div className="bg-surface-container-highest rounded-xl p-5">
            <h4 className="text-xs font-black text-primary font-headline uppercase tracking-wider mb-4">
              Klíčové ukazatele Q1 2026
            </h4>
            {[
              { label: "Průměrná hypotéka", value: "5.45 %", note: "p.a. fixace 3Y" },
              { label: "Ceny Praha", value: "+2.1 %", note: "QoQ" },
              { label: "Průměrný výnos Praha", value: "3.3 %", note: "hrubý" },
              { label: "REIT výnosy", value: "5–7 %", note: "EUR fondy" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between py-2.5 border-b border-outline-variant/10 last:border-0">
                <span className="text-sm text-on-surface-variant">{s.label}</span>
                <div className="text-right">
                  <span className="font-black text-primary text-sm font-headline">{s.value}</span>
                  <span className="text-xs text-outline ml-1">{s.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 md:hidden text-center">
        <Link to="/clanek/najemni-vynosy-vs-sazby" className="gradient-primary text-white px-6 py-2.5 rounded-full font-bold text-sm font-headline inline-block">
          Všechny články o nemovitostech
        </Link>
      </div>
    </section>
  );
}
