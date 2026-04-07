import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "../components/Mascot";
import DidYouKnow from "../components/DidYouKnow";
import RadarSays from "../components/RadarSays";
import { getArticlesByCategory } from "../data/articles";

const REGIONS = [
  { name: "Praha", yield: "3.2%", avgPrice: "138 000 Kč/m²", trend: "+4.1%", isUp: true, note: "Průměrný byt ~8 000 000 Kč" },
  { name: "Brno", yield: "4.1%", avgPrice: "96 000 Kč/m²", trend: "+5.8%", isUp: true, note: "Průměrný byt 2+1 ~5 760 000 Kč" },
  { name: "Ostrava", yield: "5.8%", avgPrice: "4 200 Kč/m²", trend: "+3.2%", isUp: true, note: "Nejdostupnější krajské město" },
  { name: "Plzeň", yield: "4.6%", avgPrice: "6 100 Kč/m²", trend: "+6.2%", isUp: true, note: "Rychlý růst cen" },
  { name: "Liberec", yield: "5.2%", avgPrice: "5 200 Kč/m²", trend: "+2.9%", isUp: true, note: "Dobrý výnos, klidnější trh" },
  { name: "Olomouc", yield: "4.9%", avgPrice: "5 600 Kč/m²", trend: "+4.4%", isUp: true, note: "Universitní město" },
  { name: "České Budějovice", yield: "4.7%", avgPrice: "5 900 Kč/m²", trend: "+3.8%", isUp: true, note: "Jihočeský hub" },
  { name: "Hradec Králové", yield: "4.4%", avgPrice: "6 400 Kč/m²", trend: "+5.1%", isUp: true, note: "Stabilní poptávka" },
];

const FACTS = [
  { label: "Průměrná hypotéka v ČR", value: "4.2M Kč", icon: "🏠" },
  { label: "Průměrný výnos z pronájmu", value: "4.5 % p.a.", icon: "📈" },
  { label: "Zdražení bytů za 10 let", value: "+148 %", icon: "🚀" },
  { label: "Podíl vlastníků bydlení v ČR", value: "78 %", icon: "🔑" },
];

function YieldCalculator() {
  const { t } = useTranslation();
  const [price, setPrice] = useState(3000000);
  const [rent, setRent] = useState(12000);
  const [costs, setCosts] = useState(15000);

  const annualRent = rent * 12;
  const annualCosts = costs;
  const netIncome = annualRent - annualCosts;
  const grossYield = ((annualRent / price) * 100).toFixed(2);
  const netYield = ((netIncome / price) * 100).toFixed(2);
  const payback = Math.round(price / netIncome);

  return (
    <div className="bg-white rounded-2xl border border-outline-variant/10 p-6">
      <h3 className="font-black text-primary font-headline text-lg mb-5">{t("nemovitosti_page.calc_title")}</h3>
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">{t("nemovitosti_page.calc_label_price")}</label>
          <div className="flex items-center gap-3">
            <input
              type="range" min={500000} max={20000000} step={100000} value={price}
              onChange={e => setPrice(+e.target.value)}
              className="flex-1 accent-indigo-600"
            />
            <span className="text-sm font-black text-primary w-28 text-right font-mono">{(price / 1000000).toFixed(1)} mil Kč</span>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">{t("nemovitosti_page.calc_label_rent")}</label>
          <div className="flex items-center gap-3">
            <input
              type="range" min={3000} max={50000} step={500} value={rent}
              onChange={e => setRent(+e.target.value)}
              className="flex-1 accent-indigo-600"
            />
            <span className="text-sm font-black text-primary w-28 text-right font-mono">{rent.toLocaleString("cs")} Kč</span>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">{t("nemovitosti_page.calc_label_costs")}</label>
          <div className="flex items-center gap-3">
            <input
              type="range" min={0} max={200000} step={5000} value={costs}
              onChange={e => setCosts(+e.target.value)}
              className="flex-1 accent-indigo-600"
            />
            <span className="text-sm font-black text-primary w-28 text-right font-mono">{costs.toLocaleString("cs")} Kč</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-green-700 font-headline">{grossYield}%</p>
          <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider mt-0.5">{t("nemovitosti_page.calc_gross_yield")}</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-indigo-700 font-headline">{netYield}%</p>
          <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5">{t("nemovitosti_page.calc_net_yield")}</p>
        </div>
        <div className="bg-surface-container rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-primary font-headline">{payback}</p>
          <p className="text-[10px] text-outline font-bold uppercase tracking-wider mt-0.5">{t("nemovitosti_page.calc_payback")}</p>
        </div>
      </div>
      <p className="text-[11px] text-outline mt-3">{t("nemovitosti_page.calc_disclaimer")}</p>
    </div>
  );
}

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
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${article.tagColor || "bg-orange-100 text-orange-700"}`}>{article.tag}</span>
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

export default function NemovitostiPage() {
  const { t } = useTranslation();
  const articles = getArticlesByCategory("nemovitosti").slice(0, 5);
  const starterArticle = articles.find((article) => article.id === "hypoteka-vs-najem") ?? articles[0];
  const nextArticle = articles.find((article) => article.id === "najemni-vynosy-vs-sazby") ?? articles.find((article) => article.id !== starterArticle?.id);

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-5xl mx-auto px-6 md:px-8 pt-10 pb-12">
          <nav className="flex items-center gap-2 text-xs text-primary-fixed-dim/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">{t("common.breadcrumb_home")}</Link>
            <span>›</span>
            <span className="text-primary-fixed-dim">{t("nemovitosti_page.breadcrumb")}</span>
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
                <span className="text-xs font-black text-primary-fixed-dim uppercase tracking-widest font-headline">{t("nemovitosti_page.hero_badge")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-4">{t("nemovitosti_page.hero_title")}<br /><span className="text-tertiary-fixed">{t("nemovitosti_page.hero_title_accent")}</span></h1>
              <p className="text-primary-fixed-dim text-lg leading-relaxed max-w-xl">{t("nemovitosti_page.hero_subtitle")}</p>
              <div className="flex flex-wrap gap-3 mt-6">
                <a href="#regiony" className="bg-white text-primary font-black text-sm font-headline px-5 py-2.5 rounded-full hover:bg-primary-fixed transition-colors">
                  {t("nemovitosti_page.btn_regions")}
                </a>
                <a href="#kalkulator" className="bg-white/10 text-white font-bold text-sm font-headline px-5 py-2.5 rounded-full hover:bg-white/20 transition-colors">
                  {t("nemovitosti_page.btn_calc")}
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

        <DidYouKnow text="Průměrný byt v Praze stojí 8 000 000 Kč (138 000 Kč/m²). V Brně 5 760 000 Kč (96 000 Kč/m²). Před 10 lety bylo vše zhruba poloviční — a experti tehdy říkali, že je to drahé." />

        {/* Stats */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FACTS.map((f) => (
              <div key={f.label} className="bg-white rounded-2xl border border-outline-variant/10 p-5 text-center">
                <div className="text-2xl mb-2">{f.icon}</div>
                <p className="text-xl font-black text-primary font-headline">{f.value}</p>
                <p className="text-xs text-outline mt-1 leading-tight">{f.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Funny example */}
        <section>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 flex gap-4 items-start">
            <span className="text-3xl flex-shrink-0">👵</span>
            <div>
              <p className="font-black text-orange-800 font-headline mb-2">Příběh z reálného života: Babičin byt</p>
              <p className="text-sm text-orange-900 leading-relaxed">Babička koupila byt 2+1 v Brně-Žabovřeskách v roce 2005 za 1,2 milionu Kč. Dnes stejný byt stojí 5,8 milionu. Za 19 let přidala k tomu nájemné — celkem vybrala dalších ~2,4M Kč. Celkový výnos? Přes <strong>580 %</strong>. A to bez jednoho excelu.</p>
              <p className="text-xs text-orange-700 mt-2 font-bold">Ponaučení: Nemovitost se nevzdává v panice. Babička věděla.</p>
            </div>
          </div>
        </section>

        {/* Regiony */}
        <section id="regiony">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black font-headline text-primary mb-2">{t("nemovitosti_page.regions_title")}</h2>
            <p className="text-on-surface-variant text-sm">{t("nemovitosti_page.regions_subtitle")}</p>
          </div>

          <div className="bg-white rounded-2xl border border-outline-variant/10 overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-container text-xs text-outline uppercase tracking-wider font-headline">
                    <th className="text-left px-5 py-3">{t("nemovitosti_page.col_city")}</th>
                    <th className="text-right px-4 py-3">{t("nemovitosti_page.col_price_m2")}</th>
                    <th className="text-right px-4 py-3">{t("nemovitosti_page.col_yield")}</th>
                    <th className="text-right px-5 py-3">{t("nemovitosti_page.col_growth")}</th>
                  </tr>
                </thead>
                <tbody>
                  {REGIONS.map((r, i) => (
                    <tr key={r.name} className={`border-t border-outline-variant/5 hover:bg-surface-container/50 transition-colors ${i % 2 === 1 ? "bg-surface-container/20" : ""}`}>
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-primary">{r.name}</p>
                        <p className="text-xs text-on-surface-variant">{r.note}</p>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-primary">{r.avgPrice}</td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="font-black text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-sm">{r.yield}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`font-bold text-sm ${r.isUp ? "text-green-600" : "text-red-500"}`}>{r.trend}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile */}
            <div className="md:hidden divide-y divide-outline-variant/5">
              {REGIONS.map((r) => (
                <div key={r.name} className="px-4 py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-primary">{r.name}</p>
                      <p className="text-xs text-outline">{r.avgPrice}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-sm">{r.yield}</span>
                      <p className="text-xs text-green-600 mt-1">{r.trend} {t("nemovitosti_page.mobile_yoy")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-outline mt-2 text-center">{t("nemovitosti_page.regions_disclaimer")}</p>
        </section>

        {/* Calculator */}
        <section id="kalkulator">
          <YieldCalculator />
        </section>

        {/* Jak začít */}
        <section>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-white rounded-2xl border border-outline-variant/10 p-6">
              <h3 className="font-black text-primary font-headline text-lg mb-4">{t("nemovitosti_page.how_to_title")}</h3>
              <div className="space-y-4">
                {[
                  { n: 1, t: "Definuj strategii", d: "Chceš pronajímat (cashflow) nebo koupit a prodat (kapitálový výnos)? Oboje funguje, ale vyžaduje jiný přístup." },
                  { n: 2, t: "Spočítej si to", d: "Použij naši kalkulačku výše. Výnos pod 3 % čistého? Možná je lepší ETF. Nad 5 %? Zajímavé." },
                  { n: 3, t: "Zkontroluj lokalitu", d: "Universita / kanceláře / průmysl v okolí = stabilní poptávka po nájmu. Bez nich = riziko." },
                  { n: 4, t: "Zajisti financování", d: "Hypotéka zvyšuje výnos na vlastní kapitál (pákový efekt), ale zvyšuje i riziko. Kalkuluj konzervativně." },
                ].map((s) => (
                  <div key={s.n} className="flex gap-4">
                    <div className="w-7 h-7 bg-orange-500 text-white text-xs font-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{s.n}</div>
                    <div>
                      <p className="font-bold text-primary text-sm">{s.t}</p>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-orange-600 rounded-2xl p-5 text-white">
              <Mascot size={60} mood="happy" variant="signal" trackMouse={false} />
              <p className="font-black font-headline text-lg mt-3 mb-2">{t("nemovitosti_page.mascot_advice")}</p>
              <p className="text-orange-100 text-sm leading-relaxed">"Nemovitost v dobrý lokalitě se v ČR ještě nikdy dlouhodobě nezlevnila. Klíčové slovo je dlouhodobě."</p>
              <Link to="/kalkulacky" className="mt-4 bg-white text-orange-700 font-black text-xs font-headline px-4 py-2 rounded-full inline-block hover:bg-orange-50 transition-colors">
                {t("nemovitosti_page.more_calcs")}
              </Link>
            </div>
          </div>
        </section>

        {/* Články */}
        {articles.length > 0 && (
          <section>
            {starterArticle && (
              <div className="mb-5 rounded-2xl border border-orange-200 bg-orange-50 p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-700 font-headline">
                  Začni tady
                </p>
                <h3 className="mt-2 text-lg font-black text-primary font-headline">
                  Pokud řešíš bydlení nebo první investiční byt, začni tímhle.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  Nejdřív si ujasni, jestli ti v tuhle chvíli dává větší smysl hypotéka nebo nájem. Pak teprve řeš výnosy, lokality a které byty nejsou jen hezké na fotce.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to={`/clanek/${starterArticle.id}`}
                    className="rounded-full bg-orange-600 px-4 py-2 text-sm font-black text-white font-headline hover:bg-orange-500 transition-colors"
                  >
                    {starterArticle.title} →
                  </Link>
                  {nextArticle && (
                    <Link
                      to={`/clanek/${nextArticle.id}`}
                      className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-bold text-orange-700 font-headline hover:border-orange-300 hover:bg-orange-100/60 transition-colors"
                    >
                      Pak pokračuj: výnosy a reality
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black font-headline text-primary">{t("nemovitosti_page.articles_title")}</h2>
              <Link to="/archiv" className="text-sm font-bold text-outline hover:text-primary transition-colors">{t("nemovitosti_page.all_articles")}</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </section>
        )}

        {articles.length === 0 && (
          <section className="bg-white rounded-2xl border border-outline-variant/10 p-8 text-center">
            <p className="text-4xl mb-3">🏗️</p>
            <p className="font-black text-primary font-headline mb-1">{t("nemovitosti_page.empty_title")}</p>
            <p className="text-on-surface-variant text-sm">{t("nemovitosti_page.empty_desc")}</p>
          </section>
        )}

        <RadarSays text="Nemovitosti jsou skvělá investice — ale REIT ETF ti dá stejnou expozici bez hypotéky, bez oprav kotle a bez volání nájemníka o půlnoci. Pro začátek zvažuj oba přístupy." />

        {/* CTA */}
        <div className="gradient-primary rounded-2xl p-8 text-white text-center">
          <Mascot size={72} mood="happy" variant="signal" trackMouse={false} />
          <p className="text-2xl font-black font-headline mt-4 mb-2">{t("nemovitosti_page.cta_heading")}</p>
          <p className="text-primary-fixed-dim mb-6 max-w-md mx-auto">{t("nemovitosti_page.cta_desc")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/#newsletter" className="bg-white text-primary font-black text-sm font-headline px-6 py-2.5 rounded-full hover:bg-primary-fixed transition-colors">
              {t("nemovitosti_page.cta_newsletter")}
            </Link>
            <Link to="/kalkulacky" className="bg-white/10 text-white font-bold text-sm font-headline px-6 py-2.5 rounded-full hover:bg-white/20 transition-colors">
              {t("nemovitosti_page.cta_calcs")}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
