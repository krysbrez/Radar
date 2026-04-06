import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "../components/Mascot";
import DidYouKnow from "../components/DidYouKnow";
import RadarSays from "../components/RadarSays";
import { getArticlesByCategory } from "../data/articles";

const CZ_STOCKS = [
  { name: "ČEZ", symbol: "CEZ", price: "900 Kč", change: "+1.2%", cap: "483 mld Kč", isUp: true, sector: "Energie" },
  { name: "Komerční banka", symbol: "KOMB", price: "863 Kč", change: "-0.4%", cap: "184 mld Kč", isUp: false, sector: "Finance" },
  { name: "O2 Czech Republic", symbol: "TELEC", price: "298 Kč", change: "+0.8%", cap: "97 mld Kč", isUp: true, sector: "Telekomunikace" },
  { name: "Moneta Money Bank", symbol: "MONET", price: "94 Kč", change: "+2.1%", cap: "42 mld Kč", isUp: true, sector: "Finance" },
  { name: "Kofola", symbol: "KOFOL", price: "312 Kč", change: "-1.1%", cap: "8 mld Kč", isUp: false, sector: "Spotřeba" },
];

const WORLD_STOCKS = [
  { name: "Apple", symbol: "AAPL", price: "$172", change: "+0.9%", cap: "$2.64T", isUp: true, sector: "Technologie" },
  { name: "Nvidia", symbol: "NVDA", price: "$880", change: "+3.4%", cap: "$2.17T", isUp: true, sector: "Technologie" },
  { name: "Microsoft", symbol: "MSFT", price: "$415", change: "+0.5%", cap: "$3.08T", isUp: true, sector: "Technologie" },
  { name: "Amazon", symbol: "AMZN", price: "$185", change: "-0.7%", cap: "$1.94T", isUp: false, sector: "E-commerce" },
  { name: "Alphabet (Google)", symbol: "GOOGL", price: "$165", change: "+1.1%", cap: "$2.03T", isUp: true, sector: "Technologie" },
];

const HOW_TO_BUY = [
  {
    number: 1,
    emoji: "🏦",
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-700",
    title: "Otevři účet u brokera",
    desc: "Potřebuješ platformu přes kterou akcie koupíš. XTB nebo Trading 212 jsou zdarma a česky.",
    tip: "Registrace trvá 10 minut, stačí občanka.",
  },
  {
    number: 2,
    emoji: "🔍",
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    title: "Najdi akcie podle tickeru",
    desc: "Apple = AAPL, Microsoft = MSFT. Zadáš ticker do vyhledávání brokera a máš ji.",
    tip: "Ticker je zkratka jako SPZ — každá akcie má unikátní.",
  },
  {
    number: 3,
    emoji: "✅",
    color: "bg-green-500",
    lightColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    title: "Zadej příkaz a kup",
    desc: "Klikni Koupit → zadej počet kusů nebo částku → Potvrdit. Hotovo, jsi akcionář.",
    tip: "Začni s částkou, o které neztrácíš spánek, když klesne o 20 %.",
  },
];

function StockTable({ stocks, title, flag, colCompany }) {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/10 overflow-hidden">
      <div className="px-5 py-4 border-b border-outline-variant/10 flex items-center gap-2">
        <span className="text-lg">{flag}</span>
        <h3 className="font-black text-primary font-headline text-base">{title}</h3>
      </div>
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-container text-xs text-outline uppercase tracking-wider font-headline">
              <th className="text-left px-5 py-3">{colCompany}</th>
              <th className="text-left px-4 py-3">Ticker</th>
              <th className="text-left px-4 py-3">Sektor</th>
              <th className="text-right px-4 py-3">Cena</th>
              <th className="text-right px-5 py-3">Změna</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s, i) => (
              <tr key={s.symbol} className={`border-t border-outline-variant/5 hover:bg-surface-container/50 transition-colors ${i % 2 === 1 ? "bg-surface-container/20" : ""}`}>
                <td className="px-5 py-3.5 font-bold text-primary">{s.name}</td>
                <td className="px-4 py-3.5">
                  <span className="bg-surface-container px-2 py-0.5 rounded font-mono text-xs text-outline font-bold">{s.symbol}</span>
                </td>
                <td className="px-4 py-3.5 text-on-surface-variant text-xs">{s.sector}</td>
                <td className="px-4 py-3.5 text-right font-bold text-primary font-mono">{s.price}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className={`font-black text-sm px-2 py-0.5 rounded-full ${s.isUp ? "text-green-700 bg-green-100" : "text-red-600 bg-red-100"}`}>{s.change}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile */}
      <div className="md:hidden divide-y divide-outline-variant/5">
        {stocks.map((s) => (
          <div key={s.symbol} className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-primary text-sm">{s.name}</p>
              <p className="text-xs text-outline font-mono">{s.symbol} · {s.sector}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary font-mono text-sm">{s.price}</p>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${s.isUp ? "text-green-700 bg-green-100" : "text-red-600 bg-red-100"}`}>{s.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArticleCard({ article }) {
  return (
    <Link to={`/clanek/${article.id}`} className="group bg-white rounded-2xl border border-outline-variant/10 overflow-hidden hover:shadow-md transition-shadow">
      {article.image && (
        <div className="h-40 overflow-hidden">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${article.tagColor || "bg-indigo-100 text-indigo-700"}`}>{article.tag}</span>
          {article.hot && <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">🔥 HOT</span>}
        </div>
        <h3 className="font-black text-primary font-headline text-sm leading-tight mb-1 group-hover:text-primary-container transition-colors">{article.title}</h3>
        <p className="text-xs text-on-surface-variant line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center gap-2 mt-3 text-[10px] text-outline">
          <span>{article.readTime}</span>
          <span>·</span>
          <span>{article.date}</span>
        </div>
      </div>
    </Link>
  );
}

export default function AkciePage() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(null);
  const articles = getArticlesByCategory("akcie").slice(0, 5);

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-5xl mx-auto px-6 md:px-8 pt-10 pb-12">
          <nav className="flex items-center gap-2 text-xs text-primary-fixed-dim/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Radar</Link>
            <span>›</span>
            <span className="text-primary-fixed-dim">Akcie</span>
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-black text-primary-fixed-dim uppercase tracking-widest font-headline">Live data · 5. 4. 2026</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-4">Akcie — kousky<br /><span className="text-tertiary-fixed">skutečných firem</span></h1>
              <p className="text-primary-fixed-dim text-lg leading-relaxed max-w-xl">Koupíš kousek Applu. Apple vydělá. Ty vydělíš. Tak jednoduché to je — a tak složité, jak si sám uděláš.</p>
              <div className="flex flex-wrap gap-3 mt-6">
                <a href="#tabulka" className="bg-white text-primary font-black text-sm font-headline px-5 py-2.5 rounded-full hover:bg-primary-fixed transition-colors">
                  Přehled akcií ↓
                </a>
                <a href="#jak-koupit" className="bg-white/10 text-white font-bold text-sm font-headline px-5 py-2.5 rounded-full hover:bg-white/20 transition-colors">
                  Jak koupit první akcii
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

        <DidYouKnow text="87 % aktivně řízených fondů za 10 let zaostalo za indexem S&P 500. Nejjednodušší strategie — koupit ETF a čekat — poráží většinu profesionálů." />

        {/* Co je akcie */}
        <section>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-100 rounded-full px-3 py-1 mb-3">
                <span className="text-xs font-black text-indigo-700 uppercase tracking-wider font-headline">Základy</span>
              </div>
              <h2 className="text-2xl font-black font-headline text-primary mb-4">Co je vlastně akcie?</h2>
              <p className="text-on-surface leading-relaxed mb-3">Firma potřebuje peníze na růst. Místo půjčky od banky vydá <strong>akcie</strong> — malé kousky vlastnictví. Ty je koupíš a staneš se spolumajitelem.</p>
              <p className="text-on-surface leading-relaxed mb-3">Pokud firma vydělává, roste i hodnota akcií. Některé firmy navíc vyplácejí <strong>dividendy</strong> — pravidelné platby akcionářům.</p>
              <p className="text-on-surface leading-relaxed">Riziko? Firma může i prodělat. Proto se vyplatí investovat do víc firem (nebo ETF), ne jen do jedné.</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
              <p className="text-xs font-black text-indigo-700 uppercase tracking-wider font-headline mb-3">Příklad z reálného života</p>
              <p className="text-on-surface text-sm leading-relaxed mb-3">
                <strong>Rok 2015:</strong> Koupíš 1 akcii Applu za $130. Nepřemýšlíš moc, prostě se ti líbí iPhone.
              </p>
              <p className="text-on-surface text-sm leading-relaxed mb-3">
                <strong>Dnes:</strong> Stejná akcie stojí ~$189. Plus za 10 let dostaneš v dividendách přes $10 na akcii.
              </p>
              <p className="text-sm font-black text-indigo-700">
                Výsledek: +45 % + dividendy. Za to, že jsi koupil a nekoukal na to každý den. 📱
              </p>
            </div>
          </div>
        </section>

        {/* Tabulky akcií */}
        <section id="tabulka" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-black font-headline text-primary mb-2">Přehled akcií</h2>
            <p className="text-on-surface-variant text-sm">{t("akcie.data_note")}</p>
          </div>

          <StockTable stocks={CZ_STOCKS} title={t("akcie.cz_stocks_title")} flag="🇨🇿" colCompany={t("akcie.col_company")} />
          <StockTable stocks={WORLD_STOCKS} title={t("akcie.world_stocks_title")} flag="🌍" colCompany={t("akcie.col_company")} />

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-2">
            <span className="text-base flex-shrink-0">⚠️</span>
            <p className="text-sm text-yellow-800 leading-relaxed">{t("akcie.disclaimer")}</p>
          </div>
        </section>

        {/* Jak koupit */}
        <section id="jak-koupit">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black font-headline text-primary mb-2">Jak koupit první akcii</h2>
            <p className="text-on-surface-variant text-sm">{t("akcie.steps_subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {HOW_TO_BUY.map((step) => (
              <div key={step.number} className={`${step.lightColor} border ${step.borderColor} rounded-2xl p-5`}>
                <div className={`w-10 h-10 ${step.color} rounded-xl flex items-center justify-center text-lg mb-4`}>{step.emoji}</div>
                <div className={`text-xs font-black uppercase tracking-wider font-headline ${step.textColor} mb-1`}>Krok {step.number}</div>
                <h3 className="font-black text-primary font-headline text-base mb-2">{step.title}</h3>
                <p className="text-sm text-on-surface leading-relaxed mb-3">{step.desc}</p>
                <div className="bg-white/60 rounded-xl px-3 py-2">
                  <p className="text-xs text-on-surface-variant">💡 {step.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Akcie vs ETF sidebar callout */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl border border-outline-variant/10 p-6">
            <h3 className="font-black text-primary font-headline text-lg mb-4">Akcie vs ETF — co vybrat?</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <p className="font-black text-indigo-700 font-headline mb-2">📊 Jednotlivé akcie</p>
                <ul className="space-y-1.5 text-on-surface">
                  <li className="flex gap-2"><span className="text-green-500">✓</span> Vyšší potenciál výnosu</li>
                  <li className="flex gap-2"><span className="text-green-500">✓</span> Vlastníš konkrétní firmu</li>
                  <li className="flex gap-2"><span className="text-red-400">✗</span> Vyšší riziko</li>
                  <li className="flex gap-2"><span className="text-red-400">✗</span> Potřebuješ sledovat firmu</li>
                </ul>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="font-black text-purple-700 font-headline mb-2">🧺 ETF (košík akcií)</p>
                <ul className="space-y-1.5 text-on-surface">
                  <li className="flex gap-2"><span className="text-green-500">✓</span> Automatická diverzifikace</li>
                  <li className="flex gap-2"><span className="text-green-500">✓</span> Nízké poplatky</li>
                  <li className="flex gap-2"><span className="text-green-500">✓</span> Méně práce</li>
                  <li className="flex gap-2"><span className="text-red-400">✗</span> Průměrný výnos trhu</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant mt-4">Pro začátečníky doporučujeme <strong className="text-primary">začít s ETF</strong> a jednotlivé akcie přidávat postupně, jak se orientuješ na trhu.</p>
          </div>
          <div className="bg-indigo-600 rounded-2xl p-5 text-white flex flex-col justify-between">
            <div>
              <Mascot size={60} mood="happy" variant="signal" trackMouse={false} />
              <p className="font-black font-headline text-lg mt-3 mb-2">Radova rada</p>
              <p className="text-indigo-100 text-sm leading-relaxed">"Nekupuj akcie, protože je vidíš v zprávách. Kupuj firmy, jejichž produkty používáš a rozumíš jim."</p>
            </div>
            <Link to="/jak-zacit" className="mt-4 bg-white text-indigo-700 font-black text-xs font-headline px-4 py-2 rounded-full inline-block hover:bg-indigo-50 transition-colors">
              Kompletní průvodce →
            </Link>
          </div>
        </section>

        {/* Články */}
        {articles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black font-headline text-primary">Akcie na Radaru</h2>
              <Link to="/archiv" className="text-sm font-bold text-outline hover:text-primary transition-colors">Všechny články →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </section>
        )}

        <RadarSays text="Nekupuj akcie firem, jejichž business nechápeš. iPhone chápeš? Apple koupíš. Jak funguje derivátový swap? To nech bankéřům. Buffett říká: investuj do toho, co vidíš v každodenním životě." />

        {/* CTA */}
        <div className="gradient-primary rounded-2xl p-8 text-white text-center">
          <Mascot size={72} mood="happy" variant="signal" trackMouse={false} />
          <p className="text-2xl font-black font-headline mt-4 mb-2">Chceš vědět víc o akciích?</p>
          <p className="text-primary-fixed-dim mb-6 max-w-md mx-auto">Každý týden přinášíme přehled trhu, analýzy a tipy pro začátečníky i pokročilé.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/knowhow" className="bg-white text-primary font-black text-sm font-headline px-6 py-2.5 rounded-full hover:bg-primary-fixed transition-colors">
              Know How sekce →
            </Link>
            <Link to="/srovnavac-brokeru" className="bg-white/10 text-white font-bold text-sm font-headline px-6 py-2.5 rounded-full hover:bg-white/20 transition-colors">
              Srovnávač brokerů
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
