import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCategoryById, ALT_CATEGORIES } from "../data/categories";
import PriceWatcherForm from "../components/PriceWatcherForm";

export default function CategoryPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const cat = getCategoryById(id);

  if (!cat) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <p className="text-6xl mb-4">📡</p>
        <h1 className="text-2xl font-black text-primary font-headline mb-2">Kategorie nenalezena</h1>
        <p className="text-on-surface-variant mb-6">{t("category.not_found")}</p>
        <button onClick={() => navigate(-1)} className="gradient-primary text-white px-6 py-2.5 rounded-full font-bold font-headline text-sm">
          ← Zpět
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero header */}
      <div className="gradient-primary text-white">
        <div className="max-w-5xl mx-auto px-6 md:px-8 pt-8 pb-12">
          <nav className="flex items-center gap-2 text-xs text-primary-fixed-dim/60 mb-8">
            <Link to="/" className="hover:text-white transition-colors">Radar</Link>
            <span>›</span>
            <Link to="/#alternativni" className="hover:text-white transition-colors">{t("category.alt_inv")}</Link>
            <span>›</span>
            <span className="text-primary-fixed-dim">{cat.label}</span>
          </nav>

          <div className="flex items-start gap-6">
            <div className={`w-20 h-20 ${cat.color} rounded-2xl flex items-center justify-center text-4xl flex-shrink-0`}>
              {cat.icon}
            </div>
            <div>
              <p className="text-xs font-black text-primary-fixed-dim/60 uppercase tracking-widest mb-2 font-headline">
                {t("category.alt_inv")}
              </p>
              <h1 className="text-3xl md:text-5xl font-black font-headline tracking-tight leading-tight mb-3">
                {cat.label}
              </h1>
              {cat.tagline && (
                <p className="text-sm font-bold text-white/60 italic mb-2">"{cat.tagline}"</p>
              )}
              <p className="text-primary-fixed-dim text-lg leading-relaxed max-w-2xl">
                {cat.intro}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div>
                <p className="text-xs text-primary-fixed-dim/60 font-semibold uppercase tracking-wider">{cat.indexLabel}</p>
                <p className="text-2xl font-black font-headline">{cat.indexValue}</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div>
                <p className="text-xs text-primary-fixed-dim/60 font-semibold uppercase tracking-wider">Sentiment</p>
                <p className={`text-2xl font-black font-headline ${cat.stat.startsWith("-") ? "text-red-300" : "text-green-300"}`}>
                  {cat.stat}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Aktuální ceny */}
            <section>
              <h2 className="text-xl font-black text-primary font-headline mb-5 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Aktuální ceny & indexy
              </h2>
              <div className="space-y-2">
                {cat.prices.map((p) => {
                  const isUp = p.change.startsWith("+");
                  return (
                    <div key={p.name} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-outline-variant/10 hover:border-outline-variant/25 transition-all">
                      {p.image && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.parentElement.style.display = "none"; }}
                          />
                        </div>
                      )}
                      <p className="font-semibold text-primary text-sm flex-1 min-w-0">{p.name}</p>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="font-black text-primary font-headline text-sm">{p.price}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isUp ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"}`}>
                          {p.change}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-outline mt-3 italic">* {t("category.price_disclaimer")}</p>
            </section>

            {/* Kde koupit / prodat */}
            {cat.whereToBuy && (
              <section>
                <h2 className="text-xl font-black text-primary font-headline mb-5">Kde koupit & prodat</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cat.whereToBuy.map((w) => (
                    <a
                      key={w.name}
                      href={w.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-4 bg-white rounded-xl border border-outline-variant/10 hover:border-outline-variant/30 hover:shadow-sm transition-all group"
                    >
                      <span className="text-xl flex-shrink-0 mt-0.5">{w.flag}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-primary text-sm font-headline group-hover:text-primary-container transition-colors">{w.name}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{w.note}</p>
                      </div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-outline flex-shrink-0 mt-1 group-hover:text-primary transition-colors"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Výnosy CZ vs EU vs Global */}
            {cat.returns && (
              <section>
                <h2 className="text-xl font-black text-primary font-headline mb-5">Výnosy: CZ vs EU vs Global</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "🇨🇿 Česká republika", value: cat.returns.cz },
                    { label: "🇪🇺 Evropa", value: cat.returns.eu },
                    { label: "🌍 Globálně", value: cat.returns.global },
                  ].map((r) => {
                    const isDown = r.value.startsWith("-");
                    return (
                      <div key={r.label} className={`rounded-xl p-4 text-center border ${isDown ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"}`}>
                        <p className="text-xs text-on-surface-variant mb-2 leading-tight">{r.label}</p>
                        <p className={`text-2xl font-black font-headline ${isDown ? "text-red-600" : "text-green-600"}`}>{r.value}</p>
                        <p className="text-[10px] text-outline mt-1">{t("category.annual_avg")}</p>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-outline mt-2 italic">* {t("category.returns_disclaimer")}</p>
              </section>
            )}

            {/* Články */}
            <section>
              <h2 className="text-xl font-black text-primary font-headline mb-5">{t("category.guides_title")}</h2>
              <div className="space-y-4">
                {cat.articles.map((a, i) => (
                  <Link
                    key={a.id}
                    to={`/kategorie/${cat.id}/clanek/${a.id}`}
                    className="block p-5 bg-white rounded-xl border border-outline-variant/10 hover:border-outline-variant/30 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cat.color} ${cat.textColor}`}>
                            {cat.label}
                          </span>
                          <span className="text-xs text-outline">Analýza {i + 1}</span>
                        </div>
                        <h3 className="font-black text-primary font-headline leading-snug mb-1.5 group-hover:text-primary-container transition-colors">
                          {a.title}
                        </h3>
                        <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">{a.excerpt}</p>
                      </div>
                      <span className="text-outline mt-1 flex-shrink-0 group-hover:text-primary transition-colors text-lg">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">💡</span>
                <h3 className="font-black text-primary font-headline text-sm uppercase tracking-wider">
                  Tip pro začátečníky
                </h3>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">{cat.tip}</p>
            </div>

            <PriceWatcherForm category={cat.label} />

            <div className="bg-white rounded-2xl p-5 border border-outline-variant/10">
              <h3 className="font-black text-primary font-headline text-xs uppercase tracking-wider mb-4">
                Další kategorie
              </h3>
              <div className="space-y-1">
                {ALT_CATEGORIES.filter((c) => c.id !== id).slice(0, 6).map((c) => (
                  <Link
                    key={c.id}
                    to={`/kategorie/${c.id}`}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-surface-container-low transition-colors group"
                  >
                    <span className="text-base">{c.icon}</span>
                    <span className="text-sm font-semibold text-on-surface-variant group-hover:text-primary transition-colors">{c.label}</span>
                    <span className="ml-auto text-outline text-xs">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-8 pb-12 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-primary font-headline hover:text-primary-container transition-colors">
          ← Zpět
        </button>
        <Link to="/#newsletter" className="gradient-primary text-white px-5 py-2 rounded-full text-sm font-bold font-headline hover:opacity-90 transition-opacity">
          Odebírat newsletter
        </Link>
      </div>
    </div>
  );
}
