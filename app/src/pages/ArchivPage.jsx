import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ARTICLES } from "../data/articles";

const CATEGORIES = ["Vše", "Investování", "Krypto", "Forex", "Nemovitosti", "Auta"];

export default function ArchivPage() {
  const { t } = useTranslation();
  const [active, setActive] = useState("Vše");

  const filtered = active === "Vše"
    ? ARTICLES
    : ARTICLES.filter((a) => a.tag === active);

  return (
    <div className="min-h-screen bg-[#000613]">
      <div className="gradient-primary text-white py-12 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Radar</Link>
            <span>›</span>
            <span className="text-white/75">Archiv</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-3">{t("archiv.title")}</h1>
          <p className="text-white/75 text-lg">{t("archiv.subtitle")}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-10">
        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold font-headline transition-all ${
                active === cat
                  ? "gradient-primary text-white"
                  : "bg-white/5 text-white/65 hover:bg-white/8 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mb-8 rounded-2xl border border-white/8 bg-white/5 px-5 py-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55 font-headline">
            {active === "Vše" ? "Všechny signály" : active}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/65">
            {filtered.length} {filtered.length === 1 ? "článek" : filtered.length >= 2 && filtered.length <= 4 ? "články" : "článků"} v archivu.
            {" "}Vyber si sekci a otevři rovnou to nejdůležitější bez zbytečného procházení.
          </p>
        </div>

        <div className="space-y-3">
          {filtered.map((article) => (
            <Link
              key={article.id}
              to={`/clanek/${article.id}`}
              className="flex items-start gap-4 p-5 bg-white/5 rounded-xl border border-white/8 hover:border-white/15 hover:shadow-sm transition-all group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${article.tagColor}`}>{article.tag}</span>
                  <span className="text-xs text-white/55">{article.date}</span>
                  <span className="text-xs text-white/55 flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {article.readTime}
                  </span>
                </div>
                <h2 className="font-black text-white font-headline leading-snug mb-1 group-hover:text-[#ffd700] transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-white/65 line-clamp-2">{article.excerpt}</p>
              </div>
              <span className="text-white/55 mt-1 flex-shrink-0 group-hover:text-white transition-colors text-lg">→</span>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📡</p>
            <p className="text-white/65">{t("archiv.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
