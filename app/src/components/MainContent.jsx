import { Link } from "react-router-dom";
import { ARTICLES, getArticlesByCategory } from "../data/articles";
import RadarPulse from "./RadarPulse";

const INVESTOVANI = getArticlesByCategory("investovani");
const FEATURED = INVESTOVANI[0] || ARTICLES.find((a) => a.featured);
const REST = INVESTOVANI.slice(1, 5);

function HeroArticleCard({ article }) {
  if (!article) return null;
  return (
    <Link to={`/clanek/${article.id}`}
      className="group relative block overflow-hidden rounded-3xl border border-white/8 bg-[#000613] transition-all duration-500 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
      {/* Image or gradient bg */}
      {article.image ? (
        <div className="relative h-72 overflow-hidden md:h-80">
          <img src={article.image} alt={article.title} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000613] via-[#000613]/60 to-transparent" />
        </div>
      ) : (
        <div className="relative h-56 overflow-hidden">
          {/* Animated chart bg */}
          <svg viewBox="0 0 800 200" className="absolute inset-0 h-full w-full opacity-20" preserveAspectRatio="none">
            <polyline points="0,160 80,130 160,145 240,100 320,115 400,70 480,85 560,50 640,65 720,35 800,45"
              stroke="#ffd700" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
            <polyline points="0,175 80,155 160,165 240,135 320,148 400,110 480,125 560,90 640,105 720,75 800,82"
              stroke="#afc8f0" strokeWidth="1.5" fill="none" strokeLinejoin="round" opacity="0.5" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-[#000613] via-transparent to-transparent" />
        </div>
      )}

      {/* Content overlay */}
      <div className="p-6 md:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className={`font-headline rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest ${article.tagColor || "bg-[#ffd700]/15 text-[#ffd700]"}`}>
            {article.tag}
          </span>
          {article.featured && (
            <span className="font-headline rounded-full border border-[#ffd700]/30 bg-[#ffd700]/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[#ffd700]">
              ★ Výběr redakce
            </span>
          )}
          <span className="text-xs text-white/60">{article.date}</span>
        </div>

        <h2 className="font-headline mb-3 text-2xl font-black leading-tight tracking-tight text-white transition-colors group-hover:text-[#ffd700] md:text-3xl">
          {article.title}
        </h2>
        <p className="mb-5 line-clamp-2 leading-relaxed text-white/70">{article.excerpt}</p>

        <div className="flex items-center justify-between">
          <span className="font-headline inline-flex items-center gap-2 rounded-full bg-[#ffd700] px-5 py-2.5 text-sm font-black text-[#000613] transition-all group-hover:bg-[#ffe234] group-hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]">
            Číst analýzu
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
          <div className="flex items-center gap-1.5 text-xs text-white/70">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {article.readTime}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ article }) {
  return (
    <Link to={`/clanek/${article.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/4 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
      {article.image && (
        <div className="h-44 overflow-hidden">
          <img src={article.image} alt={article.title} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className={`font-headline rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${article.tagColor || "bg-indigo-500/20 text-indigo-300"}`}>
            {article.tag}
          </span>
          <span className="text-[11px] text-white/70">{article.date}</span>
        </div>
        <h3 className="font-headline mb-2 flex-1 text-base font-black leading-snug text-white transition-colors group-hover:text-[#ffd700] line-clamp-3">
          {article.title}
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-white/70 line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center justify-between border-t border-white/8 pt-3">
          <span className="font-headline text-sm font-bold text-[#ffd700]/80 transition-colors group-hover:text-[#ffd700]">
            Číst →
          </span>
          <div className="flex items-center gap-1 text-[11px] text-white/50">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {article.readTime}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function MainContent() {
  return (
    <section id="investovani" className="scroll-mt-20 mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-16">
      {/* Section header */}
      <div className="reveal mb-8 flex items-end justify-between">
        <div>
          <p className="font-headline mb-2 text-xs font-black uppercase tracking-[0.28em] text-white/70">Investování</p>
          <h2 className="font-headline text-3xl font-black tracking-tight text-white md:text-4xl">
            Analýzy a přehledy
          </h2>
        </div>
        <Link to="/archiv"
          className="font-headline hidden rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white/60 transition hover:border-[#ffd700]/20 hover:text-[#ffd700] sm:inline-block">
          Všechny články →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Featured hero card — full width left col */}
        <div className="reveal lg:col-span-2">
          <HeroArticleCard article={FEATURED} />
        </div>

        {/* Right col — RadarPulse + one card */}
        <div className="reveal reveal-delay-1 flex flex-col gap-5">
          <RadarPulse />
          {REST[0] && <ArticleCard article={REST[0]} />}
        </div>

        {/* Bottom row — remaining articles */}
        {REST.slice(1).map((a, i) => (
          <div key={a.id} className={`reveal reveal-delay-${i + 1}`}>
            <ArticleCard article={a} />
          </div>
        ))}
      </div>

      {/* Archive link mobile */}
      <div className="mt-6 text-center sm:hidden">
        <Link to="/archiv"
          className="font-headline inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-white/60 transition hover:border-[#ffd700]/20 hover:text-[#ffd700]">
          Všechny články
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
