import { useParams, Link, useNavigate } from "react-router-dom";
import { getCategoryById } from "../data/categories";

export default function CategoryArticlePage() {
  const { catId, articleId } = useParams();
  const navigate = useNavigate();
  const cat = getCategoryById(catId);
  const article = cat?.articles.find((a) => a.id === articleId);

  if (!cat || !article) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <p className="text-6xl mb-4">📡</p>
        <h1 className="text-2xl font-black text-primary font-headline mb-2">Článek nenalezen</h1>
        <button onClick={() => navigate(-1)} className="gradient-primary text-white px-6 py-2.5 rounded-full font-bold font-headline text-sm mt-4">
          ← Zpět
        </button>
      </div>
    );
  }

  const relatedArticles = cat.articles.filter((a) => a.id !== articleId);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 pt-8 pb-4">
        <nav className="flex items-center gap-2 text-xs text-outline flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">Radar</Link>
          <span>›</span>
          <Link to="/#alternativni" className="hover:text-primary transition-colors">Alternativní investice</Link>
          <span>›</span>
          <Link to={`/kategorie/${catId}`} className="hover:text-primary transition-colors">{cat.label}</Link>
          <span>›</span>
          <span className="text-on-surface-variant truncate max-w-[160px]">{article.title}</span>
        </nav>
      </div>

      {/* Header */}
      <header className="max-w-3xl mx-auto px-6 md:px-8 pb-10">
        <div className="flex items-center gap-3 mb-5">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cat.color} ${cat.textColor}`}>
            {cat.label}
          </span>
          <span className="text-xs text-outline">Radar Editorial</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-primary font-headline leading-tight tracking-tight mb-5">
          {article.title}
        </h1>
        <p className="text-xl text-on-surface-variant leading-relaxed mb-8 border-l-4 border-primary-fixed-dim pl-5">
          {article.excerpt}
        </p>
        <div className="pb-8 border-b border-outline-variant/15">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center text-white font-black text-xs font-headline">
              RA
            </div>
            <div>
              <p className="font-bold text-primary text-sm font-headline">Radar Editorial</p>
              <p className="text-xs text-outline">Alternativní investice · 2026</p>
            </div>
          </div>
        </div>
      </header>

      {/* Body — placeholder obsah */}
      <main className="max-w-3xl mx-auto px-6 md:px-8 pb-16 space-y-6 text-on-surface leading-relaxed">
        <p>
          Toto je ukázkový obsah článku <strong>{article.title}</strong>. V plné verzi by zde byl kompletní analytický text
          připravený redakcí Radar Editorial.
        </p>

        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
          <h3 className="text-lg font-black text-primary font-headline mb-3">Co se dozvíte v tomto článku</h3>
          <ul className="space-y-2">
            {[
              "Aktuální stav trhu a klíčová čísla",
              "Jak funguje hodnocení a oceňování",
              "Kde a jak bezpečně nakoupit či prodat",
              "Nejčastější chyby začínajících investorů",
              "Výhled a doporučení od Radar Editorial",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-on-surface-variant">
                <span className="text-primary flex-shrink-0">✓</span>
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

        <p>
          Radar Editorial pravidelně sleduje klíčové indexy a aukční výsledky, aby vám přinášel
          aktuální a přesné informace. Tento sektor je součástí naší sekce Alternativní investice,
          která pokrývá aktiva mimo mainstream akciových a dluhopisových trhů.
        </p>

        <div className="bg-primary text-white rounded-2xl p-6">
          <p className="text-xs font-black text-primary-fixed-dim uppercase tracking-widest mb-3 font-headline">
            Doporučení Radar Editorial
          </p>
          <p className="text-primary-fixed-dim leading-relaxed">
            Alternativní investice by měly tvořit maximálně <strong className="text-white">5–15 % portfolia</strong>.
            Jsou vhodné pro investory, kteří již mají solidní základ v tradičních aktivech a hledají diverzifikaci
            s potenciálně vyšším výnosem.
          </p>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
          <p className="text-xs font-black text-outline uppercase tracking-widest mb-2 font-headline">Tip od Radárka</p>
          <p className="text-on-surface-variant leading-relaxed text-sm">{cat.tip}</p>
        </div>
      </main>

      {/* Related */}
      {relatedArticles.length > 0 && (
        <section className="bg-surface-container-low py-10">
          <div className="max-w-3xl mx-auto px-6 md:px-8">
            <h2 className="text-lg font-black text-primary font-headline mb-5">Další ze sekce {cat.label}</h2>
            <div className="space-y-3">
              {relatedArticles.map((a) => (
                <Link
                  key={a.id}
                  to={`/kategorie/${catId}/clanek/${a.id}`}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-outline-variant/10 hover:border-outline-variant/30 hover:shadow-sm transition-all group"
                >
                  <div className="flex-1">
                    <p className="font-bold text-primary font-headline group-hover:text-primary-container transition-colors line-clamp-2 text-sm">{a.title}</p>
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">{a.excerpt}</p>
                  </div>
                  <span className="text-outline mt-0.5 flex-shrink-0">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-8 flex flex-wrap items-center gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-primary font-headline hover:text-primary-container transition-colors">
          ← Zpět
        </button>
        <Link to={`/kategorie/${catId}`} className="text-sm font-bold text-primary font-headline border-b-2 border-primary-fixed-dim pb-0.5 hover:border-primary transition-colors">
          Všechny články: {cat.label}
        </Link>
        <Link to="/#newsletter" className="ml-auto gradient-primary text-white px-5 py-2 rounded-full text-sm font-bold font-headline hover:opacity-90 transition-opacity">
          Odebírat newsletter
        </Link>
      </div>
    </div>
  );
}
