import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getArticle, getArticlesByCategory } from "../data/articles";

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const article = getArticle(id);

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <p className="text-6xl mb-4">📡</p>
        <h1 className="text-2xl font-black text-primary font-headline mb-2">{t("article.not_found")}</h1>
        <p className="text-on-surface-variant mb-6">{t("article.not_found_desc")}</p>
        <button onClick={() => navigate(-1)} className="gradient-primary text-white px-6 py-2.5 rounded-full font-bold font-headline text-sm">
          {t("article.back")}
        </button>
      </div>
    );
  }

  const related = getArticlesByCategory(article.category)
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  const categoryLabel = t(`article.category_${article.category}`, { defaultValue: article.category });

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 pt-8 pb-4">
        <nav className="flex items-center gap-2 text-xs text-outline">
          <Link to="/" className="hover:text-primary transition-colors">{t("common.breadcrumb_home")}</Link>
          <span>›</span>
          <Link to={`/#${article.category}`} className="hover:text-primary transition-colors">{categoryLabel}</Link>
          <span>›</span>
          <span className="text-on-surface-variant truncate max-w-[200px]">{article.title}</span>
        </nav>
      </div>

      {/* Article header */}
      <header className="max-w-3xl mx-auto px-6 md:px-8 pb-10">
        <div className="flex items-center gap-3 mb-5">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${article.tagColor}`}>
            {article.tag}
          </span>
          <span className="text-xs text-outline">{article.date}</span>
          <span className="text-xs text-outline">·</span>
          <span className="text-xs text-outline flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {article.readTime}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-primary font-headline leading-tight tracking-tight mb-6">
          {article.title}
        </h1>

        <p className="text-xl text-on-surface-variant leading-relaxed mb-8 border-l-4 border-primary-fixed-dim pl-5">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-3 pb-8 border-b border-outline-variant/15">
          <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-white font-black text-xs font-headline">
            {article.author.split(" ").map((w) => w[0]).join("")}
          </div>
          <div>
            <p className="font-bold text-primary text-sm font-headline">{article.author}</p>
            <p className="text-xs text-outline">{t("article.editorial")}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => navigator.share?.({ title: article.title, url: window.location.href }) || navigator.clipboard.writeText(window.location.href)}
              className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5 border border-outline-variant/20 px-3 py-1.5 rounded-full"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              {t("article.share")}
            </button>
          </div>
        </div>
      </header>

      {/* Article body */}
      <main className="max-w-3xl mx-auto px-6 md:px-8 pb-16">
        <div className="prose prose-lg max-w-none text-on-surface leading-relaxed space-y-5">
          {article.body.split("\n\n").map((block, i) => {
            if (block.startsWith("**") && block.endsWith("**")) {
              return <h3 key={i} className="text-xl font-black text-primary font-headline mt-8 mb-3">{block.replace(/\*\*/g, "")}</h3>;
            }
            if (block.includes("**")) {
              return (
                <p key={i} className="text-on-surface leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
                />
              );
            }
            if (block.startsWith("|")) {
              const rows = block.split("\n").filter((r) => !r.match(/^[|\s-]+$/));
              return (
                <div key={i} className="overflow-x-auto my-6">
                  <table className="w-full text-sm border-collapse">
                    {rows.map((row, ri) => {
                      const cells = row.split("|").filter(Boolean).map((c) => c.trim());
                      return (
                        <tr key={ri} className={ri === 0 ? "bg-surface-container-high font-bold" : "border-b border-outline-variant/10 hover:bg-surface-container-low"}>
                          {cells.map((cell, ci) => (
                            <td key={ci} className="px-4 py-2.5 text-left">{cell}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </table>
                </div>
              );
            }
            if (block.match(/^\d+\. |^- /m)) {
              const items = block.split("\n").filter(Boolean);
              return (
                <ul key={i} className="space-y-2 my-4">
                  {items.map((item, ii) => (
                    <li key={ii} className="flex items-start gap-2.5 text-on-surface">
                      <span className="text-primary-container mt-0.5 flex-shrink-0">
                        {item.match(/^\d+\./) ? "→" : "·"}
                      </span>
                      <span dangerouslySetInnerHTML={{ __html: item.replace(/^\d+\.\s*|- /, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                    </li>
                  ))}
                </ul>
              );
            }
            return <p key={i} className="text-on-surface leading-relaxed">{block}</p>;
          })}
        </div>

        {/* Why it matters box */}
        <div className="mt-10 bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
          <p className="text-xs font-black text-indigo-700 uppercase tracking-widest mb-2 font-headline">{t("article.why_matters")}</p>
          <p className="text-on-surface leading-relaxed text-sm">
            {article.whyMatters || t("article.tip_desc")}
          </p>
        </div>

        {/* Tip box */}
        <div className="mt-4 bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
          <p className="text-xs font-black text-outline uppercase tracking-widest mb-2 font-headline">{t("article.tip_title")}</p>
          <p className="text-on-surface-variant leading-relaxed">
            {t("article.tip_desc").split("redakce@radar.cz")[0]}
            <a href="mailto:redakce@radar.cz" className="text-primary font-semibold underline underline-offset-2">redakce@radar.cz</a>
            {t("article.tip_desc").split("redakce@radar.cz")[1]}
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-outline-variant/10 bg-white p-6">
          <p className="text-xs font-black uppercase tracking-widest text-outline font-headline mb-2">
            Pokračuj v Radaru
          </p>
          <p className="text-sm leading-relaxed text-on-surface-variant mb-4">
            Chceš navázat na tohle téma? Otevři další články ze stejné sekce nebo si projdi celý archiv signálů.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/#${article.category}`}
              className="rounded-full border border-outline-variant/20 px-4 py-2 text-sm font-bold text-primary font-headline hover:border-outline-variant/40 hover:bg-surface-container-low transition-all"
            >
              Další z {categoryLabel}
            </Link>
            <Link
              to="/archiv"
              className="rounded-full border border-outline-variant/20 px-4 py-2 text-sm font-bold text-on-surface-variant font-headline hover:border-outline-variant/40 hover:bg-surface-container-low hover:text-primary transition-all"
            >
              Otevřít archiv
            </Link>
          </div>
        </div>
      </main>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="bg-surface-container-low py-12">
          <div className="max-w-3xl mx-auto px-6 md:px-8">
            <h2 className="text-xl font-black text-primary font-headline mb-6">{t("article.related_section")} {categoryLabel}</h2>
            <div className="space-y-4">
              {related.map((a) => (
                <Link
                  key={a.id}
                  to={`/clanek/${a.id}`}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-outline-variant/10 hover:border-outline-variant/30 hover:shadow-sm transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-2 inline-block ${a.tagColor}`}>{a.tag}</span>
                    <p className="font-bold text-primary font-headline group-hover:text-primary-container transition-colors line-clamp-2">{a.title}</p>
                    <p className="text-sm text-on-surface-variant mt-1 line-clamp-1">{a.excerpt}</p>
                  </div>
                  <span className="text-outline mt-1 flex-shrink-0">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back nav */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-8 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-primary font-headline hover:text-primary-container transition-colors">
          {t("article.back")}
        </button>
        <Link to="/#newsletter" className="gradient-primary text-white px-5 py-2 rounded-full text-sm font-bold font-headline hover:opacity-90 transition-opacity">
          {t("article.subscribe_newsletter")}
        </Link>
      </div>
    </div>
  );
}
