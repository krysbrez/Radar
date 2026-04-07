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

const WATCHLIST_POINTS = [
  "Analogové vozy s omezenou nabídkou a silným příběhem",
  "Kusy, kde ještě dává smysl vstup, ne jen obdiv v inzerátu",
  "Aukce, historie a pricing bez sběratelského cosplaye",
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
  const leadArticle = articles.find((article) => article.hot) ?? articles[0];
  const supportingArticles = articles.filter((article) => article.id !== leadArticle?.id).slice(0, 3);
  const watchingModels = YOUNGTIMER_INDEX.filter((item) => item.hot).slice(0, 3);

  return (
    <section id="auta" className="max-w-7xl mx-auto px-6 md:px-8 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-black tracking-widest uppercase text-outline mb-2 font-headline">Sektor</p>
          <h2 className="text-4xl md:text-5xl font-black text-primary font-headline tracking-tight leading-none">Auta</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
            Kategorie pro věci, které nejsou jen hezké na plakátu. Youngtimery, ikonické modely a situace, kde dává smysl dívat se dřív, než se z toho stane drahá nostalgie.
          </p>
        </div>
        <Link
          to="/auta"
          className="hidden md:flex items-center gap-1.5 text-sm font-bold text-primary font-headline border-b-2 border-primary-fixed-dim pb-0.5 hover:border-primary transition-colors"
        >
          Všechny články
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editorial preview */}
        <div className="lg:col-span-8 space-y-4">
          {leadArticle && (
            <Link
              to={`/clanek/${leadArticle.id}`}
              className="group relative block overflow-hidden rounded-[1.75rem] border border-outline-variant/10 bg-slate-950 min-h-[30rem]"
            >
              <div className="absolute inset-0">
                {leadArticle.image ? (
                  <img
                    src={leadArticle.image}
                    alt={leadArticle.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 to-primary" />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/88 to-slate-950/40" />
              <div className="relative flex h-full flex-col justify-between p-7 md:p-8">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-white font-headline">
                      Worth watching
                    </span>
                    <span className="rounded-full bg-tertiary-fixed px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-on-tertiary-fixed font-headline">
                      {watchingModels.length} modely na radaru
                    </span>
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/55 font-headline">
                    Kategorie preview
                  </p>
                  <h3 className="mt-4 text-3xl md:text-[2.4rem] font-black text-white font-headline leading-tight tracking-tight">
                    Auta, která stojí za pozornost dřív, než začnou být zbytečně drahá.
                  </h3>
                  <p className="mt-4 max-w-xl text-sm md:text-[0.98rem] leading-relaxed text-white/72">
                    Radar tady neřeší jen obsah o autech. Řeší, co má sběratelský tlak, kde je ještě rozumný vstup a jak neudělat drahý nákup jen proto, že to zní cool.
                  </p>

                  <div className="mt-6 grid gap-2">
                    {WATCHLIST_POINTS.map((point) => (
                      <div key={point} className="flex items-start gap-2.5 text-sm text-white/80">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-tertiary-fixed flex-shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {watchingModels.map((item) => (
                      <span
                        key={item.model}
                        className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-bold text-white/80"
                      >
                        {item.model}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr),auto] md:items-end">
                  <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${leadArticle.tagColor}`}>{leadArticle.tag}</span>
                      {leadArticle.hot && (
                        <span className="rounded-full bg-tertiary-fixed px-2 py-0.5 text-[11px] font-black text-on-tertiary-fixed font-headline">🔥 Hot</span>
                      )}
                      <span className="ml-auto text-xs text-white/55">{leadArticle.date}</span>
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50 font-headline">
                      Lead story
                    </p>
                    <h4 className="mt-2 text-xl font-black text-white font-headline leading-snug">
                      {leadArticle.title}
                    </h4>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/72">
                      {leadArticle.excerpt}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-2">
                    <span className="text-sm font-bold text-white font-headline group-hover:text-tertiary-fixed transition-colors">
                      Otevřít sekci Auta →
                    </span>
                    <span className="text-xs text-white/55">
                      {leadArticle.readTime} · {leadArticle.author}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supportingArticles.map((article) => (
              <Link
                key={article.id}
                to={`/clanek/${article.id}`}
                className="group rounded-2xl border border-outline-variant/10 bg-white p-5 transition-all hover:border-outline-variant/25 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${article.tagColor}`}>{article.tag}</span>
                  <span className="text-xs text-outline">{article.readTime}</span>
                </div>
                <h3 className="mt-4 text-lg font-black text-primary font-headline leading-snug group-hover:text-primary-container transition-colors">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary font-headline group-hover:text-primary-container transition-colors">
                    Číst dál →
                  </span>
                  <span className="text-xs text-outline">{article.date}</span>
                </div>
              </Link>
            ))}
          </div>
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
        <Link to="/auta" className="gradient-primary text-white px-6 py-2.5 rounded-full font-bold text-sm font-headline inline-block">
          Všechny auto-moto analýzy
        </Link>
      </div>
    </section>
  );
}
