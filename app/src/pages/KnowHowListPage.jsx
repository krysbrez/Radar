import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { KNOWHOW_ARTICLES } from "../data/knowhow";

const INVESTOR_QUOTES = [
  { name: "Warren Buffett", role: "CEO Berkshire Hathaway", quote: "Pravidlo č. 1: Nikdy neztrácet peníze. Pravidlo č. 2: Nikdy nezapomenout pravidlo č. 1.", why: "Ochrana kapitálu je základ. Výnosy přijdou samy.", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&q=80", color: "border-green-500 bg-green-50" },
  { name: "Charlie Munger", role: "Berkshire Hathaway", quote: "Říkám ti, že kdybys studoval historii, byl bys víc znepokojený než kdokoli jiný.", why: "Historie trhů se opakuje. Učte se z ní.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&q=80", color: "border-blue-500 bg-blue-50" },
  { name: "Ray Dalio", role: "Bridgewater Associates", quote: "Největší nebezpečí nejsou velké šoky — je to pomalý úpadek, kterého si nevšimneš.", why: "Inflace, poplatky, daně — tyto věci tě ničí pomalu.", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&h=60&fit=crop&q=80", color: "border-red-500 bg-red-50" },
  { name: "Peter Lynch", role: "Fidelity Magellan", quote: "V tomhle byznyse, pokud jsi dobrý, máš pravdu šestkrát z deseti. Nemůžeš mít pravdu devětkrát z deseti.", why: "Chyby jsou součástí investování. Klíč je asymetrie — ztráty mít malé, výhry velké.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop&q=80", color: "border-yellow-500 bg-yellow-50" },
  { name: "Elon Musk", role: "CEO Tesla, SpaceX", quote: "Pokud riziko je přijatelné a výsledek by byl skvělý — přijmi to riziko.", why: "Největší riziko je neriskovat nic. Bezpečnost je iluze.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&q=80", color: "border-purple-500 bg-purple-50" },
  { name: "Mark Cuban", role: "Investor, Dallas Mavericks", quote: "Svou nejlepší investici uděláš do sebe. Každá hodina studia se znásobí ve tvém platu, podniku nebo portfoliu.", why: "Lidský kapitál je nejlepší ROI. Vzdělání na Radaru je start.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&q=80", color: "border-orange-500 bg-orange-50" },
  { name: "Naval Ravikant", role: "Investor, Angel List", quote: "Hledej bohatství, ne peníze. Bohatství jsou aktiva která vydělávají i když spíš.", why: "Pasivní příjem a aktiva = svoboda. Práce za hodinu = klec.", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop&q=80", color: "border-teal-500 bg-teal-50" },
  { name: "Robert Kiyosaki", role: "Autor Rich Dad Poor Dad", quote: "Bohatí lidé kupují aktiva. Chudí a střední třída kupují pasiva, která považují za aktiva.", why: "Auto, televize, nové telefony jsou pasiva. ETF, nájemní nemovitost jsou aktiva.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&q=80", color: "border-cyan-500 bg-cyan-50" },
];

const CATEGORIES = ["Vše", "Základy", "Investování", "Brokeři"];

export default function KnowHowListPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Vše");

  const filtered = useMemo(() => {
    return KNOWHOW_ARTICLES.filter((a) => {
      const matchCat = activeCategory === "Vše" || a.category === activeCategory;
      const q = query.toLowerCase();
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [query, activeCategory]);

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const starterPath = [
    "co-jsou-penize",
    "k-cemu-penize-slouzi",
    "co-je-inflace-pizza",
    "sporeni-vs-investovani",
    "co-je-riziko",
    "co-jsou-etf",
    "dca-strategie",
    "jak-zacit-investovat-jednoduse",
  ].map((id) => KNOWHOW_ARTICLES.find((article) => article.id === id)).filter(Boolean);

  return (
    <div className="min-h-screen bg-surface">
      {/* Page header */}
      <div className="gradient-primary text-white">
        <div className="max-w-5xl mx-auto px-6 md:px-8 pt-10 pb-12">
          <nav className="flex items-center gap-2 text-xs text-primary-fixed-dim/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Radar</Link>
            <span>›</span>
            <span className="text-primary-fixed-dim">Know How</span>
          </nav>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">🎓</div>
            <div>
              <p className="text-xs font-black text-primary-fixed-dim/60 uppercase tracking-widest font-headline">{t("knowhow_list.label")}</p>
              <h1 className="text-3xl md:text-4xl font-black font-headline tracking-tight">Know How</h1>
            </div>
          </div>
          <p className="text-primary-fixed-dim text-lg max-w-2xl">
            Finanční gramotnost bez keců. Základy investování, ETF, DCA, inflace — vysvětleno tak, aby to pochopil každý.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-8">
        <div className="mb-8 rounded-[1.75rem] border border-outline-variant/10 bg-white px-6 py-6 md:px-7">
          <div className="flex items-start justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-outline font-headline">
                Začni tady
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-primary font-headline">
                Nejlogičtější start, když jdeš od nuly a nechceš v tom mít guláš.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                Tohle není škola ani sylabus. Jen osm krátkých čtení v pořadí, které tě vezmou od úplných základů peněz přes riziko, ETF a DCA až k prvnímu klidnému investičnímu setupu.
              </p>
            </div>
            <div className="hidden md:block rounded-2xl border border-outline-variant/10 bg-surface-container-low px-4 py-3 text-right">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-outline font-headline">
                Starter path
              </p>
              <p className="mt-2 text-lg font-black text-primary font-headline">
                8 čtení
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">
                od základů k prvnímu klidnému startu
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
            {starterPath.map((article, index) => (
              <Link
                key={article.id}
                to={`/knowhow/${article.id}`}
                className="group rounded-2xl border border-outline-variant/10 bg-surface-container-low px-5 py-5 transition-all hover:border-outline-variant/25 hover:bg-white"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-black text-primary font-headline">
                    0{index + 1}
                  </span>
                  <span className="text-2xl">{article.emoji}</span>
                </div>
                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.18em] text-outline font-headline">
                  {article.category}
                </p>
                <h3 className="mt-2 text-base font-black leading-snug text-primary font-headline group-hover:text-primary-container transition-colors">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant line-clamp-2">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder={t("knowhow_list.search_placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-outline-variant/20 rounded-xl text-sm text-primary placeholder-outline focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold font-headline transition-all ${
                  activeCategory === cat
                    ? "gradient-primary text-white"
                    : "bg-white border border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-on-surface-variant">{t("knowhow_list.not_found")}</p>
          </div>
        ) : (
          <>
            {/* Featured article */}
            {featured && (
              <Link
                to={`/knowhow/${featured.id}`}
                className="group block bg-white rounded-2xl border border-outline-variant/10 hover:border-outline-variant/30 hover:shadow-md transition-all overflow-hidden mb-8"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="gradient-primary md:w-64 flex-shrink-0 flex items-center justify-center py-10 md:py-0">
                    <span className="text-7xl">{featured.emoji}</span>
                  </div>
                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">{featured.level}</span>
                      <span className="text-xs bg-surface-container text-outline px-2.5 py-1 rounded-full font-bold">{featured.category}</span>
                      <span className="text-xs text-outline ml-auto flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {featured.readTime}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-primary font-headline leading-snug mb-3 group-hover:text-primary-container transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-on-surface-variant leading-relaxed mb-4">{featured.excerpt}</p>
                    <span className="text-sm font-bold text-primary font-headline group-hover:text-primary-container transition-colors">
                      Číst článek →
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Rest grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rest.map((article) => (
                  <Link
                    key={article.id}
                    to={`/knowhow/${article.id}`}
                    className="group bg-white rounded-xl border border-outline-variant/10 hover:border-outline-variant/30 hover:shadow-sm transition-all p-5 flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-4xl">{article.emoji}</span>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{article.level}</span>
                        <span className="text-xs bg-surface-container text-outline px-2 py-0.5 rounded-full font-bold">{article.category}</span>
                      </div>
                    </div>
                    <h3 className="text-base font-black text-primary font-headline leading-snug mb-2 group-hover:text-primary-container transition-colors flex-1">
                      {article.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant/10">
                      <span className="text-xs text-outline flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {article.readTime}
                      </span>
                      <span className="text-sm font-bold text-primary font-headline group-hover:text-primary-container transition-colors">
                        Číst →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Investor quotes section */}
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-12 border-t border-outline-variant/10">
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-outline mb-2 font-headline">Moudrost</p>
          <h2 className="text-3xl font-black text-primary font-headline tracking-tight">{t("knowhow_list.quotes_title")}</h2>
          <p className="text-on-surface-variant mt-2">{t("knowhow_list.quotes_subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INVESTOR_QUOTES.map((q) => (
            <div key={q.name} className={`rounded-2xl border border-l-4 ${q.color} p-5`}>
              <p className="text-base font-black text-primary font-headline leading-snug mb-4">"{q.quote}"</p>
              <p className="text-xs text-on-surface-variant italic mb-4 leading-relaxed">
                <span className="font-bold text-primary not-italic">{t("knowhow_list.why_label")}:</span> {q.why}
              </p>
              <div className="flex items-center gap-2.5">
                <img src={q.avatar} alt={q.name} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" onError={(e) => { e.target.style.display="none"; }} />
                <div>
                  <p className="text-sm font-black text-primary font-headline leading-none">{q.name}</p>
                  <p className="text-xs text-outline mt-0.5">{q.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
