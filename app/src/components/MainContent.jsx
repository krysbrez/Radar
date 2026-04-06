import { Link } from "react-router-dom";
import { ARTICLES } from "../data/articles";
import RadarPulse from "./RadarPulse";

const FEATURED = ARTICLES.find((a) => a.featured);
const SIDE_ARTICLES = ARTICLES.filter((a) => !a.featured).slice(0, 2);

function FeaturedCard({ article }) {
  return (
    <Link to={`/clanek/${article.id}`} className="group block lg:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-primary-container/10 to-primary/20 relative">
          <svg viewBox="0 0 300 225" className="w-full h-full opacity-30" fill="none">
            <polyline points="20,180 60,140 100,160 140,100 180,120 220,70 260,85 300,50" stroke="#001f3f" strokeWidth="3" fill="none"/>
            <polyline points="20,200 60,175 100,185 140,150 180,165 220,130 260,145 300,115" stroke="#6f88ad" strokeWidth="2" fill="none"/>
            {[60,100,140,180].map(y => <line key={y} x1="20" y1={y} x2="300" y2={y} stroke="#001f3f" strokeWidth="0.5" opacity="0.3"/>)}
          </svg>
          <div className="absolute inset-0 flex items-end p-5">
            <div className="gradient-primary rounded-xl p-4 text-white">
              <p className="text-xs text-primary-fixed-dim font-bold uppercase tracking-wider mb-1">Exkluzivní analýza</p>
              <p className="font-black text-xl font-headline leading-tight">ETF<br/>Deep Dive</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 w-fit ${article.tagColor}`}>
            {article.tag}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-primary font-headline leading-tight mb-3 group-hover:text-primary-container transition-colors">
            {article.title}
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-4">{article.excerpt}</p>
          <div className="flex items-center justify-between">
            <span className="text-primary font-bold text-sm font-headline border-b-2 border-primary-fixed-dim pb-0.5 group-hover:border-primary transition-colors">
              Číst celou analýzu →
            </span>
            <div className="flex items-center gap-1.5 text-xs text-outline">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {article.readTime}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SideCard({ article }) {
  return (
    <Link to={`/clanek/${article.id}`} className="group block">
      <div className="bg-white rounded-xl p-5 border border-outline-variant/10 hover:border-outline-variant/30 hover:shadow-sm transition-all h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${article.tagColor}`}>{article.tag}</span>
          <span className="text-xs text-outline">{article.date}</span>
        </div>
        <h3 className="text-lg font-black text-primary font-headline leading-snug mb-2 group-hover:text-primary-container transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-4 flex-1 line-clamp-3">{article.excerpt}</p>
        <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
          <span className="text-primary font-bold text-sm font-headline group-hover:text-primary-container transition-colors">Číst →</span>
          <div className="flex items-center gap-1 text-xs text-outline">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {article.readTime}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function MainContent() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {FEATURED && (
            <div className="grid grid-cols-1 gap-6">
              <FeaturedCard article={FEATURED} />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SIDE_ARTICLES.map((a) => <SideCard key={a.id} article={a} />)}
          </div>
          {/* Odkaz na archiv */}
          <div className="text-center pt-2">
            <Link
              to="/archiv"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary font-headline border border-outline-variant/20 px-5 py-2.5 rounded-full hover:bg-surface-container-low transition-colors"
            >
              Zobrazit všechny články
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
        <div className="lg:col-span-1">
          <RadarPulse />
        </div>
      </div>
    </section>
  );
}
