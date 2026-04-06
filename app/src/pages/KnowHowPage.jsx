import { useParams, Link, useNavigate } from "react-router-dom";
import { getKnowHowArticle, KNOWHOW_ARTICLES } from "../data/knowhow";

export default function KnowHowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = getKnowHowArticle(id);

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <p className="text-5xl mb-4">📡</p>
        <h1 className="text-2xl font-black text-primary font-headline mb-4">Článek nenalezen</h1>
        <button onClick={() => navigate(-1)} className="gradient-primary text-white px-6 py-2.5 rounded-full font-bold font-headline text-sm">← Zpět</button>
      </div>
    );
  }

  const related = KNOWHOW_ARTICLES.filter((a) => a.id !== id).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 pt-8 pb-3">
        <nav className="flex items-center gap-2 text-xs text-outline">
          <Link to="/" className="hover:text-primary transition-colors">Radar</Link>
          <span>›</span>
          <Link to="/#knowhow" className="hover:text-primary transition-colors">Know How</Link>
          <span>›</span>
          <span className="text-on-surface-variant truncate max-w-[180px]">{article.title}</span>
        </nav>
      </div>

      <header className="max-w-3xl mx-auto px-6 md:px-8 pb-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-4xl">{article.emoji}</span>
          <div>
            <span className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">{article.level}</span>
            <span className="text-xs text-outline ml-2">{article.readTime}</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-primary font-headline leading-tight tracking-tight mb-5">
          {article.title}
        </h1>
        <p className="text-xl text-on-surface-variant leading-relaxed border-l-4 border-primary-fixed-dim pl-5">
          {article.excerpt}
        </p>
        <div className="mt-6 pb-6 border-b border-outline-variant/15 flex items-center gap-3">
          <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center text-white font-black text-xs font-headline">R</div>
          <div>
            <p className="font-bold text-primary text-sm font-headline">Radar Editorial</p>
            <p className="text-xs text-outline">Know How · Finanční gramotnost</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 md:px-8 pb-16 space-y-5">
        {article.body.split("\n\n").map((block, i) => {
          if (block.startsWith("**") && block.endsWith("**") && !block.slice(2, -2).includes("**")) {
            return <h3 key={i} className="text-xl font-black text-primary font-headline mt-8 mb-3">{block.replace(/\*\*/g, "")}</h3>;
          }
          if (block.includes("**")) {
            return (
              <p key={i} className="text-on-surface leading-relaxed"
                dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
              />
            );
          }
          if (block.match(/^[-•]\s|^\d+\.\s/m)) {
            const items = block.split("\n").filter(Boolean);
            return (
              <ul key={i} className="space-y-2.5 my-3">
                {items.map((item, ii) => (
                  <li key={ii} className="flex items-start gap-2.5 text-on-surface">
                    <span className="text-primary-container mt-0.5 flex-shrink-0">{item.match(/^\d+\./) ? "→" : "·"}</span>
                    <span dangerouslySetInnerHTML={{ __html: item.replace(/^[-•\d.]\s*/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                  </li>
                ))}
              </ul>
            );
          }
          return <p key={i} className="text-on-surface leading-relaxed text-[1.05rem]">{block}</p>;
        })}

        {/* Summary box */}
        <div className="mt-10 gradient-primary rounded-2xl p-6 text-white">
          <p className="text-xs font-black text-primary-fixed-dim uppercase tracking-widest mb-3 font-headline">
            TL;DR — Co z toho vzít
          </p>
          <p className="text-primary-fixed-dim leading-relaxed text-sm">
            Přečetl jsi {article.readTime} článku. To je {article.readTime.replace(" min", "")} minut,
            které ti mohou ušetřit tisíce korun špatných rozhodnutí. Teď jdi to aplikovat.
          </p>
        </div>
      </main>

      {/* Related */}
      <section className="bg-surface-container-low py-10">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <h2 className="text-lg font-black text-primary font-headline mb-5">Další Know How články</h2>
          <div className="space-y-3">
            {related.map((a) => (
              <Link
                key={a.id}
                to={`/knowhow/${a.id}`}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-outline-variant/10 hover:border-outline-variant/25 hover:shadow-sm transition-all group"
              >
                <span className="text-2xl flex-shrink-0">{a.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-primary text-sm font-headline group-hover:text-primary-container transition-colors line-clamp-1">{a.title}</p>
                  <p className="text-xs text-outline mt-0.5">{a.level} · {a.readTime}</p>
                </div>
                <span className="text-outline flex-shrink-0 group-hover:text-primary transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-8 flex flex-wrap items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-sm font-bold text-primary font-headline hover:text-primary-container transition-colors">← Zpět</button>
        <Link to="/#knowhow" className="text-sm font-bold text-primary font-headline border-b-2 border-primary-fixed-dim pb-0.5 hover:border-primary transition-colors">Všechny Know How →</Link>
        <Link to="/#newsletter" className="ml-auto gradient-primary text-white px-5 py-2 rounded-full text-sm font-bold font-headline hover:opacity-90 transition-opacity">Odebírat newsletter</Link>
      </div>
    </div>
  );
}
