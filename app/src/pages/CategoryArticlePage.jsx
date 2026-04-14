import { useParams, Link, useNavigate } from "react-router-dom";
import { getCategoryById } from "../data/categories";

function ArticleBody({ blocks }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.type === "p") {
          return <p key={i} className="leading-relaxed text-white/85">{block.text}</p>;
        }
        if (block.type === "h2") {
          return <h2 key={i} className="text-xl font-black text-white font-headline mt-8 mb-1">{block.text}</h2>;
        }
        if (block.type === "callout") {
          const colors = {
            amber: "bg-amber-500/8 border-amber-500/20 text-amber-300",
            blue: "bg-sky-500/8 border-sky-500/20 text-sky-300",
            green: "bg-emerald-500/8 border-emerald-500/20 text-emerald-300",
          };
          return (
            <div key={i} className={`rounded-2xl p-6 border ${colors[block.color] ?? "bg-white/5 border-white/8 text-white/85"}`}>
              <p className="text-xs font-black uppercase tracking-widest mb-2 font-headline opacity-70">{block.icon} {block.title}</p>
              <p className="text-sm leading-relaxed text-white/85">{block.text}</p>
            </div>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={i} className="space-y-3">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3 text-sm text-white/85 leading-relaxed">
                  <span className="text-white flex-shrink-0 font-bold mt-0.5">→</span>
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "table") {
          return (
            <div key={i} className="bg-white/5 rounded-2xl border border-white/8 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {block.rows.map((row, j) => (
                    <tr key={j} className={`border-t border-white/6 ${j % 2 === 1 ? "bg-white/4" : ""}`}>
                      <td className="px-5 py-3 font-medium text-white">{row.label}</td>
                      <td className="px-5 py-3 text-right text-white/65 text-xs">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.type === "warning") {
          return (
            <div key={i} className="bg-red-500/8 border border-red-500/20 rounded-2xl p-5 flex gap-3">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <p className="text-sm text-red-400 leading-relaxed">{block.text}</p>
            </div>
          );
        }
        if (block.type === "tip") {
          return (
            <div key={i} className="bg-white/5 rounded-2xl p-5 border border-white/8 flex gap-3">
              <span className="text-xl flex-shrink-0">💡</span>
              <p className="text-sm text-white/65 leading-relaxed">{block.text}</p>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default function CategoryArticlePage() {
  const { catId, articleId } = useParams();
  const navigate = useNavigate();
  const cat = getCategoryById(catId);
  const article = cat?.articles.find((a) => a.id === articleId);

  if (!cat || !article) {
    return (
      <div className="min-h-screen bg-[#000613] flex flex-col items-center justify-center px-6">
        <p className="text-6xl mb-4">📡</p>
        <h1 className="text-2xl font-black text-white font-headline mb-2">Článek nenalezen</h1>
        <button onClick={() => navigate(-1)} className="gradient-primary text-white px-6 py-2.5 rounded-full font-bold font-headline text-sm mt-4">
          ← Zpět
        </button>
      </div>
    );
  }

  const relatedArticles = cat.articles.filter((a) => a.id !== articleId);

  return (
    <div className="min-h-screen bg-[#000613]">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 pt-8 pb-4">
        <nav className="flex items-center gap-2 text-xs text-white/55 flex-wrap">
          <Link to="/" className="hover:text-white transition-colors">Radar</Link>
          <span>›</span>
          <Link to="/#alternativni" className="hover:text-white transition-colors">Alternativní investice</Link>
          <span>›</span>
          <Link to={`/kategorie/${catId}`} className="hover:text-white transition-colors">{cat.label}</Link>
          <span>›</span>
          <span className="text-white/65 truncate max-w-[160px]">{article.title}</span>
        </nav>
      </div>

      {/* Header */}
      <header className="max-w-3xl mx-auto px-6 md:px-8 pb-10">
        <div className="flex items-center gap-3 mb-5">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cat.color} ${cat.textColor}`}>
            {cat.label}
          </span>
          <span className="text-xs text-white/55">Radar Editorial</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white font-headline leading-tight tracking-tight mb-5">
          {article.title}
        </h1>
        <p className="text-xl text-white/65 leading-relaxed mb-8 border-l-4 border-white/20 pl-5">
          {article.excerpt}
        </p>
        <div className="pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center text-white font-black text-xs font-headline">
              RA
            </div>
            <div>
              <p className="font-bold text-white text-sm font-headline">Radar Editorial</p>
              <p className="text-xs text-white/55">Alternativní investice · 2026</p>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-3xl mx-auto px-6 md:px-8 pb-16">
        {article.body ? (
          <ArticleBody blocks={article.body} />
        ) : (
          <div className="space-y-6 text-white/85 leading-relaxed">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/8">
              <h3 className="text-lg font-black text-white font-headline mb-3">Co se dozvíte v tomto článku</h3>
              <ul className="space-y-2">
                {[
                  "Aktuální stav trhu a klíčová čísla",
                  "Jak funguje hodnocení a oceňování",
                  "Kde a jak bezpečně nakoupit či prodat",
                  "Nejčastější chyby začínajících investorů",
                  "Výhled a doporučení od Radar Editorial",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-white/65">
                    <span className="text-emerald-400 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p>
              Trh s aktivem <strong>{cat.label}</strong> prošel v posledních letech dramatickými změnami.
              Kombinace globálních makroekonomických faktorů, rostoucí poptávky ze strany retailových investorů
              a měnící se regulatorní prostředí vytvořily nové příležitosti — ale i rizika.
            </p>
            <div className="gradient-primary rounded-2xl p-6">
              <p className="text-xs font-black text-white/55 uppercase tracking-widest mb-3 font-headline">
                Doporučení Radar Editorial
              </p>
              <p className="text-white/85 leading-relaxed">
                Alternativní investice by měly tvořit maximálně <strong className="text-white">5–15 % portfolia</strong>.
                Jsou vhodné pro investory, kteří již mají solidní základ v tradičních aktivech a hledají diverzifikaci
                s potenciálně vyšším výnosem.
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/8">
              <p className="text-xs font-black text-white/55 uppercase tracking-widest mb-2 font-headline">Tip od Radárka</p>
              <p className="text-white/65 leading-relaxed text-sm">{cat.tip}</p>
            </div>
          </div>
        )}
      </main>

      {/* Related */}
      {relatedArticles.length > 0 && (
        <section className="bg-white/4 py-10">
          <div className="max-w-3xl mx-auto px-6 md:px-8">
            <h2 className="text-lg font-black text-white font-headline mb-5">Další ze sekce {cat.label}</h2>
            <div className="space-y-3">
              {relatedArticles.map((a) => (
                <Link
                  key={a.id}
                  to={`/kategorie/${catId}/clanek/${a.id}`}
                  className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/8 hover:border-white/15 hover:shadow-sm transition-all group"
                >
                  <div className="flex-1">
                    <p className="font-bold text-white font-headline group-hover:text-[#ffd700] transition-colors line-clamp-2 text-sm">{a.title}</p>
                    <p className="text-xs text-white/65 mt-1 line-clamp-1">{a.excerpt}</p>
                  </div>
                  <span className="text-white/55 mt-0.5 flex-shrink-0">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-8 flex flex-wrap items-center gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-white font-headline hover:text-[#ffd700] transition-colors">
          ← Zpět
        </button>
        <Link to={`/kategorie/${catId}`} className="text-sm font-bold text-white font-headline border-b-2 border-white/20 pb-0.5 hover:border-[#ffd700]/50 transition-colors">
          Všechny články: {cat.label}
        </Link>
        <Link to="/#newsletter" className="ml-auto gradient-primary text-white px-5 py-2 rounded-full text-sm font-bold font-headline hover:opacity-90 transition-opacity">
          Odebírat newsletter
        </Link>
      </div>
    </div>
  );
}
