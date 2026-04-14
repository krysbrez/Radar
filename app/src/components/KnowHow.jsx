import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { KNOWHOW_ARTICLES } from "../data/knowhow";

const LEVEL_COLORS = {
  "Začátečník": "bg-green-100 text-green-700",
  "Mírně pokročilý": "bg-blue-100 text-blue-700",
};

export default function KnowHow() {
  const { t } = useTranslation();
  const featured = KNOWHOW_ARTICLES.slice(0, 5);
  const rest = KNOWHOW_ARTICLES.slice(5);

  return (
    <section id="knowhow" className="max-w-7xl mx-auto px-6 md:px-8 py-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-black tracking-widest uppercase text-white/55 mb-2 font-headline">{t("knowhow_section.label")}</p>
          <h2 className="text-4xl md:text-5xl font-black text-white font-headline tracking-tight leading-none">{t("knowhow_section.title")}</h2>
          <p className="text-white/65 mt-2 max-w-xl">
            {t("knowhow_section.subtitle")}
          </p>
        </div>
        <Link
          to="/archiv"
          className="hidden md:flex items-center gap-1.5 text-sm font-bold text-white font-headline border-b-2 border-primary-fixed-dim pb-0.5 hover:border-primary transition-colors"
        >
          {t("knowhow_section.all_articles")}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </div>

      {/* Featured grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {featured.map((article, i) => (
          <Link
            key={article.id}
            to={`/knowhow/${article.id}`}
            className={`group bg-white rounded-xl border border-white/12/10 hover:border-white/12/30 hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col ${
              i === 0 ? "md:col-span-2 lg:col-span-1" : ""
            }`}
          >
            {/* Color bar */}
            <div className="h-1.5 gradient-primary" />
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">{article.emoji}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[article.level] ?? "bg-gray-100 text-gray-600"}`}>
                  {article.level}
                </span>
                <span className="text-xs text-white/55 ml-auto">{article.readTime}</span>
              </div>
              <h3 className="font-black text-white font-headline leading-snug mb-2 group-hover:text-white-container transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-white/65 leading-relaxed flex-1 line-clamp-2">{article.excerpt}</p>
              <div className="mt-4 pt-3 border-t border-white/12/10 flex items-center justify-between">
                <span className="text-sm font-bold text-white font-headline group-hover:text-white-container transition-colors">
                  {t("knowhow_section.read")}
                </span>
                <span className="text-xs text-white/55">{article.tag}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Rest as compact list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rest.map((article) => (
          <Link
            key={article.id}
            to={`/knowhow/${article.id}`}
            className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-white/12/10 hover:border-white/12/30 hover:shadow-sm transition-all"
          >
            <span className="text-2xl flex-shrink-0">{article.emoji}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white text-sm font-headline line-clamp-1 group-hover:text-white-container transition-colors">
                {article.title}
              </h4>
              <p className="text-xs text-white/55 mt-0.5">{article.level} · {article.readTime}</p>
            </div>
            <span className="text-white/55 flex-shrink-0 group-hover:text-white transition-colors">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
