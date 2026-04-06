import { useState } from "react";
import { Link } from "react-router-dom";
import { getArticlesByCategory } from "../data/articles";
import PriceWatcherForm from "./PriceWatcherForm";
import RotatingFacts from "./RotatingFacts";

const YOUNGTIMER_INDEX = [
  { model: "Porsche 911 (964)", gain: "+41%", period: "3Y", price: "1 800 000 Kč", detail: "Vzdušný boxer, ikona. Ceny rostou každý rok.", hot: true, image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&h=130&fit=crop&q=80" },
  { model: "Toyota Supra MK4", gain: "+89%", period: "5Y", price: "2 200 000 Kč", detail: "Pop culture boom díky F&F. Japonský engineering.", hot: true, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=130&fit=crop&q=80" },
  { model: "BMW E36 M3", gain: "+114%", period: "5Y", price: "750 000 Kč", detail: "Nejdostupnější M3 s nejlepším poměrem cena/zhodnocení.", hot: true, image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=200&h=130&fit=crop&q=80" },
  { model: "Honda NSX (NA1)", gain: "+138%", period: "5Y", price: "1 900 000 Kč", detail: "Ayrton Senna pomáhal s vývojem. Japonský supercar.", hot: false, image: "https://images.unsplash.com/photo-1621321840460-2cf3c3e0e37f?w=200&h=130&fit=crop&q=80" },
  { model: "Mercedes W124 500E", gain: "+28%", period: "3Y", price: "380 000 Kč", detail: "Ručně montovaný v Porsche závodě. Podceněný kus.", hot: false, image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=200&h=130&fit=crop&q=80" },
  { model: "Ferrari F355", gain: "+65%", period: "5Y", price: "3 800 000 Kč", detail: "Poslední Ferrari s karburátory. Vizuálně dokonalý.", hot: false, image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=200&h=130&fit=crop&q=80" },
];

const CAR_FACTS = [
  "Toyota Supra MK4 stála v roce 2000 cca 800 000 Kč. Dnes za ni zaplatíte 2–4 miliony. To je lepší než leckterý pražský byt.",
  "Původní barva zvyšuje hodnotu vozu o 15–30 % oproti přelakovanému kusu. Vždy si ověř v CARFAX.",
  "Nejlepší investiční vozy mají jednoho majitele, kompletní servisní knížku a původní interiér. Tato trojice = premium.",
  "BMW E36 M3 bylo v ČR podceňováno 10 let. Pak přišla generace, která ho milovala z plakátů — a ceny vyletěly.",
  "Youngtimer není oldtimer. Oldtimer je před rokem 1980, youngimer je 1980–2005. Fiscální výhody se liší.",
  "Riziko č. 1 při nákupu auta na investici: emoce. Nákup srdcem = přeplacení. Vždy znáš ceiling price předem.",
];

function YoungtimerRow({ item, onClick, isOpen }) {
  return (
    <>
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-3 px-3 hover:bg-surface-container-low rounded-lg transition-colors text-left group"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {item.hot && <span className="w-1.5 h-1.5 bg-tertiary-fixed rounded-full flex-shrink-0" />}
          {!item.hot && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-0" />}
          <span className="text-sm font-semibold text-primary truncate">{item.model}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-2">
          <span className="text-sm font-black text-green-600 font-headline">{item.gain}</span>
          <span className="text-xs text-outline">/{item.period}</span>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            className={`text-outline transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="mx-3 mb-2 bg-surface-container-low rounded-lg border-l-2 border-primary-fixed-dim animate-fade-in overflow-hidden">
          {item.image && (
            <img
              src={item.image}
              alt={item.model}
              className="w-full h-28 object-cover"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          )}
          <div className="px-4 py-3">
            <p className="text-xs font-bold text-primary mb-1 font-headline">{item.model}</p>
            <p className="text-xs text-on-surface-variant mb-2 leading-relaxed">{item.detail}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary">Průměrná tržní cena: {item.price}</span>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${item.gain.startsWith("+") ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"}`}>
                {item.gain} / {item.period}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Auta() {
  const articles = getArticlesByCategory("auta");
  const [openRow, setOpenRow] = useState(null);

  return (
    <section id="auta" className="max-w-7xl mx-auto px-6 md:px-8 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-black tracking-widest uppercase text-outline mb-2 font-headline">Sektor</p>
          <h2 className="text-4xl md:text-5xl font-black text-primary font-headline tracking-tight leading-none">Auta</h2>
        </div>
        <Link
          to="/clanek/bmw-e36-youngtimer"
          className="hidden md:flex items-center gap-1.5 text-sm font-bold text-primary font-headline border-b-2 border-primary-fixed-dim pb-0.5 hover:border-primary transition-colors"
        >
          Všechny články
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Články */}
        <div className="lg:col-span-8 space-y-4">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/clanek/${article.id}`}
              className="group flex flex-col md:flex-row bg-white rounded-xl border border-outline-variant/10 hover:border-outline-variant/25 hover:shadow-md transition-all overflow-hidden"
            >
              {/* Car photo */}
              <div className="md:w-56 h-44 md:h-auto relative overflow-hidden flex-shrink-0 bg-slate-900">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 to-primary" />
                )}
                {article.hot && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-tertiary-fixed text-on-tertiary-fixed text-xs font-black px-2 py-0.5 rounded-full font-headline">🔥 Hot</span>
                  </div>
                )}
              </div>
              {/* Content */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${article.tagColor}`}>{article.tag}</span>
                    <span className="text-xs text-outline">{article.date}</span>
                    <span className="text-xs text-outline ml-auto flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-primary font-headline leading-snug mb-2 group-hover:text-primary-container transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">{article.excerpt}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-outline-variant/10 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary font-headline group-hover:text-primary-container transition-colors">
                    Číst analýzu →
                  </span>
                  <span className="text-xs text-outline">{article.author}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {/* Youngtimer Index */}
          <div className="bg-surface-container-highest rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-black text-primary font-headline uppercase tracking-wider">
                Radar Youngtimer Index
              </h4>
              <span className="text-xs text-outline">Klikni na model</span>
            </div>
            <div className="space-y-0.5">
              {YOUNGTIMER_INDEX.map((item) => (
                <YoungtimerRow
                  key={item.model}
                  item={item}
                  isOpen={openRow === item.model}
                  onClick={() => setOpenRow(openRow === item.model ? null : item.model)}
                />
              ))}
            </div>
          </div>

          {/* Hlídač cen */}
          <PriceWatcherForm category="Youngtimer" />

          {/* Věděli jste? */}
          <RotatingFacts facts={CAR_FACTS} intervalMs={7000} />
        </div>
      </div>

      <div className="mt-8 md:hidden text-center">
        <Link to="/clanek/bmw-e36-youngtimer" className="gradient-primary text-white px-6 py-2.5 rounded-full font-bold text-sm font-headline inline-block">
          Všechny auto-moto analýzy
        </Link>
      </div>
    </section>
  );
}
