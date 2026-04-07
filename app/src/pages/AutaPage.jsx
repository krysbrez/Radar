import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "../components/Mascot";
import DidYouKnow from "../components/DidYouKnow";
import RadarSays from "../components/RadarSays";
import { getArticlesByCategory } from "../data/articles";

const YOUNGTIMER_INDEX = [
  {
    car: "Toyota Supra MK4 (A80)",
    year: "1993–2002",
    price2000: "800 000 Kč",
    priceNow: "2 800 000 Kč",
    change: "+250%",
    trend: "🚀 Explodující",
    note: "Fast & Furious efekt. Legendární 2JZ motor.",
    isHot: true,
  },
  {
    car: "BMW E36 M3",
    year: "1992–1999",
    price2000: "280 000 Kč",
    priceNow: "800 000 Kč",
    change: "+186%",
    trend: "📈 Stabilní růst",
    note: "Dostupný vstup do M-série. Kulový diferenciál standard.",
    isHot: false,
  },
  {
    car: "Mazda MX-5 NA (Mk1)",
    year: "1989–1998",
    price2000: "180 000 Kč",
    priceNow: "550 000 Kč",
    change: "+205%",
    trend: "📈 Stabilní růst",
    note: "Nejspolehlivější youngtimer. Easy maintenance.",
    isHot: false,
  },
  {
    car: "Porsche 911 (964)",
    year: "1989–1994",
    price2000: "900 000 Kč",
    priceNow: "2 200 000 Kč",
    change: "+144%",
    trend: "💎 Blue chip",
    note: "Aircooled klasika. Porsche nikdy neklesá.",
    isHot: true,
  },
  {
    car: "Volkswagen Golf GTI Mk2",
    year: "1984–1992",
    price2000: "80 000 Kč",
    priceNow: "380 000 Kč",
    change: "+375%",
    trend: "📈 Solidní výnos",
    note: "Dostupný vstupní bod do youngtimer světa.",
    isHot: false,
  },
  {
    car: "Honda NSX (NA1)",
    year: "1990–2001",
    price2000: "700 000 Kč",
    priceNow: "1 500 000 Kč",
    change: "+114%",
    trend: "🔥 Japonská legenda",
    note: "Ayrton Senna pomáhal s vývojem. Říká se.",
    isHot: true,
  },
  {
    car: "Ford Sierra RS Cosworth",
    year: "1986–1992",
    price2000: "250 000 Kč",
    priceNow: "800 000 Kč",
    change: "+220%",
    trend: "📈 Motorsport ikona",
    note: "Závodní legenda z rallye. Vzácné kusy.",
    isHot: false,
  },
  {
    car: "Lancia Delta Integrale",
    year: "1987–1994",
    price2000: "400 000 Kč",
    priceNow: "1 900 000 Kč",
    change: "+375%",
    trend: "💎 Rally ikona",
    note: "6× vítěz WRC. Jeden z nejlepších youngtimerů vůbec.",
    isHot: true,
  },
];

const TIPS = [
  { icon: "🔍", title: "Zkontroluj historii", desc: "VIN ověření, servisní záznamy, počet majitelů. Bez toho nekupuj." },
  { icon: "🔧", title: "Koukni na náhradní díly", desc: "Toyota a Honda = dostupné díly. Francouzská auta z 90. let = bolest." },
  { icon: "📜", title: "Zkontroluj původ", desc: "Import z Japonska může být výhoda (nízký nájezd) nebo past (jiná specifikace)." },
  { icon: "🏦", title: "Neskladuj s hypotékou", desc: "Youngtimer je investice, ne nutnost. Splácíš-li byt, auto počká." },
];

function ArticleCard({ article }) {
  return (
    <Link to={`/clanek/${article.id}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-outline-variant/10 bg-white transition-shadow hover:shadow-md">
      {article.image && (
        <div className="h-40 overflow-hidden">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex min-h-6 flex-wrap items-center gap-2">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${article.tagColor || "bg-gray-100 text-gray-700"}`}>{article.tag}</span>
          {article.hot && <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">🔥 HOT</span>}
        </div>
        <h3 className="mb-2 line-clamp-2 min-h-[2.75rem] text-sm font-black leading-snug text-primary transition-colors group-hover:text-primary-container font-headline">{article.title}</h3>
        <p className="flex-1 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-on-surface-variant">{article.excerpt}</p>
        <div className="mt-4 flex items-center gap-2 border-t border-outline-variant/10 pt-3 text-[10px] text-outline">
          <span>{article.readTime}</span>
          <span>·</span>
          <span>{article.date}</span>
        </div>
      </div>
    </Link>
  );
}

export default function AutaPage() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(null);
  const articles = getArticlesByCategory("auta").slice(0, 5);
  const starterArticle = articles.find((article) => article.id === "classic-car-pruvodce") ?? articles[0];
  const nextArticle = articles.find((article) => article.id === "aukce-autozberatele") ?? articles.find((article) => article.id !== starterArticle?.id);

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-5xl mx-auto px-6 md:px-8 pt-10 pb-12">
          <nav className="flex items-center gap-2 text-xs text-primary-fixed-dim/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">{t("common.breadcrumb_home")}</Link>
            <span>›</span>
            <span className="text-primary-fixed-dim">{t("auta.breadcrumb")}</span>
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
                <span className="text-xs font-black text-primary-fixed-dim uppercase tracking-widest font-headline">{t("auta.hero_badge")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-4">{t("auta.hero_title")}<br /><span className="text-tertiary-fixed">{t("auta.hero_title_accent")}</span></h1>
              <p className="text-primary-fixed-dim text-lg leading-relaxed max-w-xl">{t("auta.hero_subtitle")}</p>
              <div className="flex flex-wrap gap-3 mt-6">
                <a href="#index" className="bg-white text-primary font-black text-sm font-headline px-5 py-2.5 rounded-full hover:bg-primary-fixed transition-colors">
                  {t("auta.btn_index")}
                </a>
                <a href="#tipy" className="bg-white/10 text-white font-bold text-sm font-headline px-5 py-2.5 rounded-full hover:bg-white/20 transition-colors">
                  {t("auta.btn_tips")}
                </a>
              </div>
            </div>
            <div className="hidden md:block flex-shrink-0 bg-white/10 rounded-3xl p-4">
              <Mascot size={120} mood="happy" variant="signal" trackMouse={false} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-10 space-y-12">

        <DidYouKnow text="Toyota Supra MK4 s manuálem a originálním motorem 2JZ-GTE zdvojnásobila hodnotu každých 7 let od 2010. Lépe než průměrný akciový fond — a jedeš v ní na výlet." />

        {/* Funny example */}
        <section>
          <div className="bg-gray-900 text-white rounded-2xl p-6 flex gap-4 items-start">
            <span className="text-3xl flex-shrink-0">🏎️</span>
            <div>
              <p className="font-black font-headline text-lg mb-2">Toyota Supra: lepší investice než Tesla akcie</p>
              <p className="text-gray-300 text-sm leading-relaxed mb-2">Rok 2000. Youngster Honza koupí použitou Supru za 800 000 Kč. Kamarádi se smějí — proč ne pěkné nové Octavii?</p>
              <p className="text-gray-300 text-sm leading-relaxed mb-2">Rok 2024. Honza prodá Supru za 3 200 000 Kč — po 24 letech řízení zaplatil za "výpůjčku" <strong className="text-white">zápornou cenu</strong>. Ještě vydělal 2,4M.</p>
              <p className="text-yellow-400 text-xs font-bold mt-1">Ponaučení: Japonský sportovní vůz z 90. let + trpělivost = profit. 🤫</p>
            </div>
          </div>
        </section>

        {/* Co je youngtimer */}
        <section>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-black font-headline text-primary mb-4">Co je youngtimer?</h2>
              <p className="text-on-surface leading-relaxed mb-3">Youngtimer je auto ve věku 15–30 let, které ještě není plně klasické, ale už má šanci zestárnout do ceny, ne do zapomnění. Zlatá éra je přibližně <strong>1985–2005</strong>.</p>
              <p className="text-on-surface leading-relaxed mb-3">Klíčové jsou tři věci: <strong>ikoničnost</strong> (muselo být slavné nebo kultovní), <strong>vzácnost</strong> (málo kusů = vyšší cena) a <strong>stav</strong> (originál bez nehod vždy vyhraje).</p>
              <p className="text-on-surface leading-relaxed">Na rozdíl od oldtimerů (30+ let) ještě neplatíš historické pojistky a díly jsou relativně dostupné.</p>
            </div>
            <div className="space-y-3">
              <div className="bg-surface-container rounded-xl p-4 flex gap-3 items-start">
                <span className="text-xl">✅</span>
                <div>
                  <p className="font-bold text-primary text-sm">Dobré youngtimery</p>
                  <p className="text-xs text-on-surface-variant">Japonské sportovní vozy 90. let, BMW M série, Porsche 911, Lancia, Ford RS modely</p>
                </div>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3 items-start">
                <span className="text-xl">❌</span>
                <div>
                  <p className="font-bold text-red-700 text-sm">Rizikové volby</p>
                  <p className="text-xs text-red-600">Luxusní francouzská auta 90. let, americké vozy bez evropské historie, cokoliv s automatem z té doby</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Youngtimer Index */}
        <section id="index">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black font-headline text-primary mb-2">{t("auta.index_title")}</h2>
            <p className="text-on-surface-variant text-sm">{t("auta.index_subtitle")}</p>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl border border-outline-variant/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container text-xs text-outline uppercase tracking-wider font-headline">
                  <th className="text-left px-5 py-3">{t("auta.col_model")}</th>
                  <th className="text-left px-4 py-3">{t("auta.col_year")}</th>
                  <th className="text-right px-4 py-3">{t("auta.col_price2000")}</th>
                  <th className="text-right px-4 py-3">{t("auta.col_price_now")}</th>
                  <th className="text-right px-5 py-3">{t("auta.col_change")}</th>
                </tr>
              </thead>
              <tbody>
                {YOUNGTIMER_INDEX.map((car, i) => (
                  <tr
                    key={car.car}
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    className={`border-t border-outline-variant/5 cursor-pointer transition-colors ${expanded === i ? "bg-surface-container" : i % 2 === 1 ? "bg-surface-container/20 hover:bg-surface-container/40" : "hover:bg-surface-container/30"}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-primary">{car.car}</p>
                        {car.isHot && <span className="text-[10px] bg-red-100 text-red-600 font-black px-1.5 py-0.5 rounded-full">HOT</span>}
                      </div>
                      {expanded === i && <p className="text-xs text-on-surface-variant mt-1">{car.note}</p>}
                    </td>
                    <td className="px-4 py-3.5 text-on-surface-variant">{car.year}</td>
                    <td className="px-4 py-3.5 text-right font-mono text-outline">{car.price2000}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-primary">{car.priceNow}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-black text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-sm">{car.change}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile accordion */}
          <div className="md:hidden space-y-2">
            {YOUNGTIMER_INDEX.map((car, i) => (
              <div
                key={car.car}
                className={`bg-white rounded-xl border border-outline-variant/10 overflow-hidden cursor-pointer`}
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <div className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-primary text-sm">{car.car}</p>
                      {car.isHot && <span className="text-[10px] bg-red-100 text-red-600 font-black px-1.5 py-0.5 rounded-full">HOT</span>}
                    </div>
                    <p className="text-xs text-outline">{car.year}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-sm">{car.change}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`text-outline transition-transform ${expanded === i ? "rotate-90" : ""}`}>
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
                {expanded === i && (
                  <div className="px-4 pb-3 pt-1 border-t border-outline-variant/10 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-outline">{t("auta.mobile_price2000")}</span>
                      <span className="font-mono text-on-surface-variant">{car.price2000}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-outline">{t("auta.mobile_price_now")}</span>
                      <span className="font-mono font-bold text-primary">{car.priceNow}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant pt-1">{car.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-outline mt-3 text-center">{t("auta.disclaimer")}</p>
        </section>

        {/* Tips */}
        <section id="tipy">
          <h2 className="text-xl font-black font-headline text-primary mb-5">{t("auta.tips_title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TIPS.map((tip) => (
              <div key={tip.title} className="bg-white rounded-2xl border border-outline-variant/10 p-5 flex gap-4">
                <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                <div>
                  <p className="font-bold text-primary font-headline">{tip.title}</p>
                  <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mascot callout */}
        <section className="bg-gray-900 rounded-2xl p-6 text-white flex gap-5 items-center">
          <Mascot size={72} mood="thinking" variant="signal" trackMouse={false} />
          <div>
            <p className="font-black font-headline text-lg mb-1">{t("auta.mascot_callout_title")}</p>
            <p className="text-gray-300 text-sm leading-relaxed">"Auto, které miluješ a rozumíš mu, je lepší investice než auto, které kupuješ jen kvůli číslům. Nekupuj Lancia Integrale, pokud nevíš proč vyhrála 6× WRC."</p>
          </div>
        </section>

        {/* Články */}
        {articles.length > 0 && (
          <section>
            {starterArticle && (
              <div className="mb-5 rounded-2xl border border-gray-300 bg-gray-50 p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-700 font-headline">
                  Čti nejdřív
                </p>
                <h3 className="mt-2 text-lg font-black text-primary font-headline">
                  Pokud jsi v autech nový, začni tím, jak poznat rozumný kus.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  Nejdřív si srovnej, proč má tohle auto šanci držet cenu. Až potom řeš aukce, konkrétní modely a jestli ta cenovka není jen nostalgie po Fast & Furious.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to={`/clanek/${starterArticle.id}`}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-black text-white font-headline hover:bg-primary-container transition-colors"
                  >
                    {starterArticle.title} →
                  </Link>
                  {nextArticle && (
                    <Link
                      to={`/clanek/${nextArticle.id}`}
                      className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-on-surface-variant font-headline hover:border-gray-400 hover:bg-surface-container-low hover:text-primary transition-colors"
                    >
                      Pak pokračuj: aukce a nákup
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black font-headline text-primary">{t("auta.articles_title")}</h2>
              <Link to="/archiv" className="text-sm font-bold text-outline hover:text-primary transition-colors">{t("auta.all_articles")}</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </section>
        )}

        {articles.length === 0 && (
          <section className="bg-white rounded-2xl border border-outline-variant/10 p-8 text-center">
            <p className="text-4xl mb-3">🔧</p>
            <p className="font-black text-primary font-headline mb-1">{t("auta.empty_title")}</p>
            <p className="text-on-surface-variant text-sm">{t("auta.empty_desc")}</p>
          </section>
        )}

        <RadarSays text="Youngtimer není jen koníček — je to alternativní aktiva s nízkými poplatky, nulovou korelací s akciovým trhem a možností si ho užít. Ale pozor: bez servisní historie nekupuj nic." />

        {/* CTA */}
        <div className="gradient-primary rounded-2xl p-8 text-white text-center">
          <Mascot size={72} mood="happy" variant="signal" trackMouse={false} />
          <p className="text-2xl font-black font-headline mt-4 mb-2">{t("auta.cta_heading")}</p>
          <p className="text-primary-fixed-dim mb-6 max-w-md mx-auto">{t("auta.cta_desc")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/#newsletter" className="bg-white text-primary font-black text-sm font-headline px-6 py-2.5 rounded-full hover:bg-primary-fixed transition-colors">
              {t("auta.cta_newsletter")}
            </Link>
            <Link to="/nemovitosti" className="bg-white/10 text-white font-bold text-sm font-headline px-6 py-2.5 rounded-full hover:bg-white/20 transition-colors">
              {t("auta.cta_nemovitosti")}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
