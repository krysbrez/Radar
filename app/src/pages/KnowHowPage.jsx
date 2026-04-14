import { useParams, Link, useNavigate } from "react-router-dom";
import { getKnowHowArticle, KNOWHOW_ARTICLES } from "../data/knowhow";
import ArticleContent from "../components/ArticleContent";

export default function KnowHowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = getKnowHowArticle(id);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#000613] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-5xl mb-4">📡</p>
        <h1 className="text-2xl font-black text-white font-headline mb-4">Článek nenalezen</h1>
        <button onClick={() => navigate(-1)} className="gradient-primary text-white px-6 py-2.5 rounded-full font-bold font-headline text-sm">← Zpět</button>
      </div>
    );
  }

  const related = KNOWHOW_ARTICLES.filter((a) => a.id !== id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#000613]">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 pt-8 pb-3">
        <nav className="flex items-center gap-2 text-xs text-white/55">
          <Link to="/" className="hover:text-white transition-colors">Radar</Link>
          <span>›</span>
          <Link to="/#knowhow" className="hover:text-white transition-colors">Know How</Link>
          <span>›</span>
          <span className="text-white/65 truncate max-w-[180px]">{article.title}</span>
        </nav>
      </div>

      <header className="max-w-3xl mx-auto px-6 md:px-8 pb-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-4xl">{article.emoji}</span>
          <div>
            <span className="text-xs font-bold bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full">{article.level}</span>
            <span className="text-xs text-white/55 ml-2">{article.readTime}</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white font-headline leading-tight tracking-tight mb-5">
          {article.title}
        </h1>
        <p className="text-xl text-white/65 leading-relaxed border-l-4 border-white/20 pl-5">
          {article.excerpt}
        </p>
        <div className="mt-6 pb-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center text-white font-black text-xs font-headline">R</div>
          <div>
            <p className="font-bold text-white text-sm font-headline">Radar Editorial</p>
            <p className="text-xs text-white/55">Know How · Finanční gramotnost</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 md:px-8 pb-16 space-y-5">
        <ArticleContent body={article.body} />

        {/* Summary box */}
        <div className="mt-10 gradient-primary rounded-2xl p-6 text-white">
          <p className="text-xs font-black text-white/55 uppercase tracking-widest mb-3 font-headline">
            TL;DR — Co z toho vzít
          </p>
          <p className="text-white/85 leading-relaxed text-sm">
            Přečetl/a jsi článek na {article.readTime}. To je pár minut,
            které ti můžou ušetřit tisíce korun za špatná rozhodnutí. Teď to jen převést do praxe.
          </p>
        </div>
      </main>

      {/* Related */}
      <section className="bg-white/4 py-10">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <h2 className="text-lg font-black text-white font-headline mb-5">Další Know How články</h2>
          <div className="space-y-3">
            {related.map((a) => (
              <Link
                key={a.id}
                to={`/knowhow/${a.id}`}
                className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/8 hover:border-white/15 hover:shadow-sm transition-all group"
              >
                <span className="text-2xl flex-shrink-0">{a.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm font-headline group-hover:text-[#ffd700] transition-colors line-clamp-1">{a.title}</p>
                  <p className="text-xs text-white/55 mt-0.5">{a.level} · {a.readTime}</p>
                </div>
                <span className="text-white/55 flex-shrink-0 group-hover:text-white transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-8 flex flex-wrap items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-sm font-bold text-white font-headline hover:text-[#ffd700] transition-colors">← Zpět</button>
        <Link to="/knowhow" className="text-sm font-bold text-white font-headline border-b-2 border-white/20 pb-0.5 hover:border-[#ffd700]/50 transition-colors">Všechny články Know How →</Link>
        <Link to="/#newsletter" className="ml-auto gradient-primary text-white px-5 py-2 rounded-full text-sm font-bold font-headline hover:opacity-90 transition-opacity">Odebírat newsletter</Link>
      </div>
    </div>
  );
}
