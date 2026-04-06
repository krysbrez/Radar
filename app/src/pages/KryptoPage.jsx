import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "../components/Mascot";
import { getArticlesByCategory } from "../data/articles";

const CRYPTO_DATA = [
  { rank: 1, name: "Bitcoin", symbol: "BTC", price: "$84 200", change: "-2.1%", cap: "$1.66T", isUp: false },
  { rank: 2, name: "Ethereum", symbol: "ETH", price: "$3 240", change: "+1.4%", cap: "$389B", isUp: true },
  { rank: 3, name: "BNB", symbol: "BNB", price: "$582", change: "+0.8%", cap: "$84B", isUp: true },
  { rank: 4, name: "Solana", symbol: "SOL", price: "$178", change: "+3.2%", cap: "$82B", isUp: true },
  { rank: 5, name: "XRP", symbol: "XRP", price: "$0.58", change: "-1.2%", cap: "$63B", isUp: false },
  { rank: 6, name: "USDC", symbol: "USDC", price: "$1.00", change: "0.0%", cap: "$44B", isUp: true },
  { rank: 7, name: "Avalanche", symbol: "AVAX", price: "$38.4", change: "+5.1%", cap: "$16B", isUp: true },
  { rank: 8, name: "Dogecoin", symbol: "DOGE", price: "$0.18", change: "-3.8%", cap: "$26B", isUp: false },
  { rank: 9, name: "Chainlink", symbol: "LINK", price: "$18.20", change: "+2.3%", cap: "$11B", isUp: true },
  { rank: 10, name: "Polkadot", symbol: "DOT", price: "$9.80", change: "-0.9%", cap: "$14B", isUp: false },
];

const GLOSSARY = [
  { term: "HODL", def: "Hold On for Dear Life — slankem pro 'neprodat i když to padá'. Původně překlep v bitcoinovém fóru." },
  { term: "Halving", def: "Každé 4 roky se odměna za těžbu Bitcoinu sníží na půl. Méně nových BTC = historicky pak rally." },
  { term: "DeFi", def: "Decentralizované finance. Finanční produkty (půjčky, swap) bez banky — jen kód na blockchainu." },
  { term: "NFT", def: "Non-fungible token. Digitální vlastnictví. V roce 2021 za miliony. Dnes... ehm. Poučení: hype ≠ hodnota." },
  { term: "Gas fees", def: "Poplatky za transakce na Ethereu. Když je síť přetížená, platíš jak za první třídu v letadle." },
  { term: "Altcoin", def: "Každá kryptoměna krom Bitcoinu. Některé jsou seriózní projekty, některé jsou exit scam. Opatrně." },
  { term: "Market cap", def: "Cena × počet coinů v oběhu. Lepší ukazatel než cena samotná — jeden SHIB je levný, ale jich jsou biliony." },
  { term: "Bull/Bear run", def: "Bull = ceny rostou, medvěd = ceny klesají. Trh má cykly. Panic sell v bear runu = chyba č. 1." },
  { term: "Whale", def: "Někdo kdo drží obrovské množství kryptoměny. Když whale prodává, cena jde dolů. Sleduj on-chain data." },
  { term: "FOMO", def: "Fear Of Missing Out. Ten moment kdy koupíš na vrcholu, protože 'to přece nemůže dál klesat'. Může." },
];

const FEAR_GREED = 62; // 0-100, 62 = Greed

function FearGreedMeter({ value }) {
  const { t } = useTranslation();
  const getLabel = (v) => {
    if (v <= 20) return { label: t("krypto.fear_extreme_fear"), color: "text-red-600", bg: "bg-red-500" };
    if (v <= 40) return { label: t("krypto.fear_fear"), color: "text-orange-500", bg: "bg-orange-400" };
    if (v <= 60) return { label: t("krypto.fear_neutral"), color: "text-yellow-600", bg: "bg-yellow-400" };
    if (v <= 80) return { label: t("krypto.fear_greed"), color: "text-green-600", bg: "bg-green-500" };
    return { label: t("krypto.fear_extreme_greed"), color: "text-emerald-600", bg: "bg-emerald-500" };
  };
  const { label, color } = getLabel(value);
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/10 p-6">
      <h3 className="text-sm font-black text-primary font-headline uppercase tracking-wider mb-4">Fear & Greed Index</h3>
      <div className="flex items-center gap-5">
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg viewBox="0 0 100 60" className="w-full">
            <path d="M5 55 A45 45 0 0 1 95 55" fill="none" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round"/>
            <path
              d="M5 55 A45 45 0 0 1 95 55"
              fill="none"
              stroke={value <= 40 ? "#ef4444" : value <= 60 ? "#eab308" : "#22c55e"}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(value / 100) * 141} 141`}
            />
            <text x="50" y="52" textAnchor="middle" className="font-black" fontSize="22" fontWeight="900" fill="#000613">{value}</text>
          </svg>
        </div>
        <div>
          <p className={`text-2xl font-black font-headline ${color}`}>{label}</p>
          <p className="text-sm text-on-surface-variant mt-1">{t("krypto.market_sentiment")}</p>
          <p className="text-xs text-outline mt-2">{t("krypto.fear_greed_scale")}</p>
        </div>
      </div>
    </div>
  );
}

export default function KryptoPage() {
  const { t } = useTranslation();
  const articles = getArticlesByCategory("krypto");
  const [openGloss, setOpenGloss] = useState(null);

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8 pt-10 pb-14">
          <nav className="flex items-center gap-2 text-xs text-primary-fixed-dim/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Radar</Link>
            <span>›</span>
            <span className="text-primary-fixed-dim">Krypto</span>
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-5">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                <span className="text-xs font-black text-primary-fixed-dim uppercase tracking-widest font-headline">Live data</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tight leading-tight mb-4">
                Krypto bez keců.
              </h1>
              <p className="text-primary-fixed-dim text-xl leading-relaxed max-w-xl mb-6">
                Bitcoin, Ethereum, altcoiny — rozebereme ti co se děje, proč to záleží,
                a kdy je nejlepší čas koupit (spoiler: ne v pátek večer po třetím pivu).
              </p>
              <div className="flex gap-3">
                <Link to="/#newsletter" className="bg-white text-primary font-black text-sm font-headline px-6 py-3 rounded-full hover:bg-primary-fixed transition-colors">
                  Odebírat newsletter →
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0 hidden md:block">
              <div className="bg-white/10 rounded-3xl p-4">
                <Mascot size={140} mood="happy" variant="signal" trackMouse={false} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-10 space-y-12">

        {/* Top 10 tabulka */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h2 className="text-xl font-black text-primary font-headline">{t("krypto.top10_title")}</h2>
            <span className="text-xs text-outline bg-surface-container px-2 py-0.5 rounded-full">{t("common.placeholder_data")}</span>
          </div>
          <div className="bg-white rounded-2xl border border-outline-variant/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/10 bg-surface-container-low">
                    <th className="text-left py-3 px-4 text-xs font-black text-outline uppercase tracking-wider font-headline">#</th>
                    <th className="text-left py-3 px-4 text-xs font-black text-outline uppercase tracking-wider font-headline">{t("krypto.col_name")}</th>
                    <th className="text-right py-3 px-4 text-xs font-black text-outline uppercase tracking-wider font-headline">{t("krypto.col_price")}</th>
                    <th className="text-right py-3 px-4 text-xs font-black text-outline uppercase tracking-wider font-headline">24h</th>
                    <th className="text-right py-3 px-4 text-xs font-black text-outline uppercase tracking-wider font-headline hidden md:table-cell">{t("krypto.col_market_cap")}</th>
                  </tr>
                </thead>
                <tbody>
                  {CRYPTO_DATA.map((c) => (
                    <tr key={c.symbol} className="border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4 text-sm text-outline font-bold">{c.rank}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-surface-container rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-black text-primary">{c.symbol.slice(0, 2)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-primary">{c.name}</p>
                            <p className="text-xs text-outline">{c.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-primary font-headline text-sm">{c.price}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`text-sm font-black ${c.isUp ? "text-green-600" : "text-red-500"}`}>
                          {c.change}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-on-surface-variant hidden md:table-cell">{c.cap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Fear & Greed + Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-black text-primary font-headline mb-5">{t("krypto.analyses_title")}</h2>
            {articles.length > 0 ? articles.map((article) => (
              <Link
                key={article.id}
                to={`/clanek/${article.id}`}
                className="group flex gap-4 bg-white rounded-xl border border-outline-variant/10 hover:border-outline-variant/25 hover:shadow-sm transition-all p-4"
              >
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-3xl">
                  {article.image ? (
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display="none"; }} />
                  ) : "₿"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${article.tagColor}`}>{article.tag}</span>
                    <span className="text-xs text-outline">{article.date}</span>
                  </div>
                  <h3 className="text-base font-black text-primary font-headline leading-snug mb-1 group-hover:text-primary-container transition-colors line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-on-surface-variant line-clamp-1">{article.excerpt}</p>
                </div>
              </Link>
            )) : (
              <div className="bg-surface-container-low rounded-xl p-8 text-center">
                <p className="text-4xl mb-3">₿</p>
                <p className="text-on-surface-variant">{t("krypto.analyses_empty")}</p>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <FearGreedMeter value={FEAR_GREED} />

            {/* Mascot callout */}
            <div className="bg-surface-container-low rounded-2xl p-5 flex items-center gap-4">
              <div className="bg-white rounded-xl p-2 flex-shrink-0">
                <Mascot size={56} mood="thinking" variant="idle" trackMouse={false} />
              </div>
              <div>
                <p className="text-sm font-black text-primary font-headline mb-1">{t("krypto.radar_tip_title")}</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {t("krypto.radar_tip_text")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Krypto slovník */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xl">📖</span>
            <h2 className="text-xl font-black text-primary font-headline">{t("krypto.glossary_title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {GLOSSARY.map((item) => (
              <button
                key={item.term}
                onClick={() => setOpenGloss(openGloss === item.term ? null : item.term)}
                className="text-left bg-white rounded-xl border border-outline-variant/10 hover:border-outline-variant/30 transition-all overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-black text-primary font-headline text-sm">{item.term}</span>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    className={`text-outline flex-shrink-0 transition-transform ${openGloss === item.term ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
                {openGloss === item.term && (
                  <div className="px-4 pb-3 border-t border-outline-variant/10">
                    <p className="text-sm text-on-surface-variant leading-relaxed pt-3">{item.def}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="gradient-primary rounded-2xl p-8 text-white text-center">
          <Mascot size={64} mood="happy" variant="signal" trackMouse={false} />
          <p className="text-2xl font-black font-headline mt-4 mb-2">Každý pondelí krypto brief do inboxu.</p>
          <p className="text-primary-fixed-dim mb-5">Co se stalo, proč to záleží, co sledovat. Za 3 minuty.</p>
          <Link to="/#newsletter" className="inline-block bg-white text-primary font-black text-sm font-headline px-8 py-3 rounded-full hover:bg-primary-fixed transition-colors">
            Odebírat zdarma →
          </Link>
        </div>
      </div>
    </div>
  );
}
