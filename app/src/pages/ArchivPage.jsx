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
    <div className="min-h-screen bg-white">
      <div className="gradient-primary text-white py-12 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-primary-fixed-dim/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Radar</Link>
            <span>›</span>
            <span className="text-primary-fixed-dim">Archiv</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-3">{t("archiv.title")}</h1>
          <p className="text-primary-fixed-dim text-lg">{t("archiv.subtitle")}</p>
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
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((article) => (
            <Link
              key={article.id}
              to={`/clanek/${article.id}`}
              className="flex items-start gap-4 p-5 bg-white rounded-xl border border-outline-variant/10 hover:border-outline-variant/25 hover:shadow-sm transition-all group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${article.tagColor}`}>{article.tag}</span>
                  <span className="text-xs text-outline">{article.date}</span>
                  <span className="text-xs text-outline flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {article.readTime}
                  </span>
                </div>
                <h2 className="font-black text-primary font-headline leading-snug mb-1 group-hover:text-primary-container transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-on-surface-variant line-clamp-2">{article.excerpt}</p>
              </div>
              <span className="text-outline mt-1 flex-shrink-0 group-hover:text-primary transition-colors text-lg">→</span>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📡</p>
            <p className="text-on-surface-variant">{t("archiv.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
