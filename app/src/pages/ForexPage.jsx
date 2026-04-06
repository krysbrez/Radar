import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "../components/Mascot";
import { getArticlesByCategory } from "../data/articles";

const CURRENCY_PAIRS = [
  { pair: "EUR/CZK", rate: "25.10", change: "-0.42%", note: "Koruna nejsilnější za 5 let", isUp: false },
  { pair: "USD/CZK", rate: "23.18", change: "+0.21%", note: "Dolar mírně posílil", isUp: true },
  { pair: "EUR/USD", rate: "1.083", change: "-0.18%", note: "Klíčový globální pár", isUp: false },
  { pair: "GBP/CZK", rate: "29.45", change: "+0.35%", note: "Britská libra", isUp: true },
  { pair: "CHF/CZK", rate: "26.20", change: "-0.12%", note: "Švýcarský frank, bezpečný přístav", isUp: false },
  { pair: "JPY/CZK", rate: "0.155", change: "-0.55%", note: "Japonský jen", isUp: false },
];

const FOREX_EXPLAINERS = [
  {
    emoji: "🏖️",
    title: "Jel jsi na dovolenou do Řecka?",
    text: "Měnil jsi koruny na eura. Kurs byl třeba 25.10. Za 25 100 Kč jsi dostal 1 000 eur. O rok dřív, při kurzu 27.50, by ti za stejné eura chybělo skoro 2 400 Kč. Forex ti buď dává, nebo bere — bez jakéhokoliv varování.",
  },
  {
    emoji: "🛍️",
    title: "Nakupuješ z AliExpressu?",
    text: "Produkty jsou v USD, platíš v CZK. Silnější koruna = levnější nákupy ze zahraničí. Slabší koruna = zaplatíš víc za stejnou věc. Tohle je forex v praxi — každý den, u každého online nákupu.",
  },
  {
    emoji: "🏭️",
    title: "Proč firmy sledují EUR/CZK každý ráno?",
    text: "Škoda Auto prodává auta za eura, ale platy platí v korunách. Silnější koruna snižuje jejich zisk v CZK. Slabší koruna = víc korun za každé euro. Forex není jen pro spekulanty — je to realita každé exportní firmy.",
  },
];

export default function ForexPage() {
  const { t } = useTranslation();
  const articles = getArticlesByCategory("forex");

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8 pt-10 pb-14">
          <nav className="flex items-center gap-2 text-xs text-primary-fixed-dim/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Radar</Link>
            <span>›</span>
            <span className="text-primary-fixed-dim">Forex</span>
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-5">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-xs font-black text-primary-fixed-dim uppercase tracking-widest font-headline">{t("forex.live_badge")}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tight leading-tight mb-4">
                Forex?<br />Není to sci-fi.
              </h1>
              <p className="text-primary-fixed-dim text-xl leading-relaxed max-w-xl mb-6">
                Měnové kurzy ovlivňují tvoje nákupy, dovolenou i hypotéku.
                Radar ti každý týden vysvětlí co se děje — bez grafu plného čárek a šipek.
              </p>
              <div className="flex gap-3">
                <Link to="/#newsletter" className="bg-white text-primary font-black text-sm font-headline px-6 py-3 rounded-full hover:bg-primary-fixed transition-colors">
                  Odebírat newsletter →
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0 hidden md:block">
              <div className="bg-white/10 rounded-3xl p-4">
                <Mascot size={140} mood="normal" variant="signal" trackMouse={false} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-10 space-y-12">

        {/* Měnové páry tabulka */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h2 className="text-xl font-black text-primary font-headline">{t("forex.pairs_title")}</h2>
            <span className="text-xs text-outline bg-surface-container px-2 py-0.5 rounded-full">{t("common.placeholder_data")}</span>
          </div>
          <div className="bg-white rounded-2xl border border-outline-variant/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/10 bg-surface-container-low">
                    <th className="text-left py-3 px-4 text-xs font-black text-outline uppercase tracking-wider font-headline">{t("forex.col_pair")}</th>
                    <th className="text-right py-3 px-4 text-xs font-black text-outline uppercase tracking-wider font-headline">{t("forex.col_rate")}</th>
                    <th className="text-right py-3 px-4 text-xs font-black text-outline uppercase tracking-wider font-headline">24h</th>
                    <th className="text-left py-3 px-4 text-xs font-black text-outline uppercase tracking-wider font-headline hidden md:table-cell">{t("forex.col_note")}</th>
                  </tr>
                </thead>
                <tbody>
                  {CURRENCY_PAIRS.map((c) => (
                    <tr key={c.pair} className="border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-black text-primary font-headline">{c.pair}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-primary font-headline text-sm">{c.rate}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`text-sm font-black ${c.isUp ? "text-green-600" : "text-red-500"}`}>
                          {c.change}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-on-surface-variant hidden md:table-cell">{c.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Proč kurzy záleží + Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-black text-primary font-headline mb-5">{t("forex.analyses_title")}</h2>
            {articles.length > 0 ? articles.map((article) => (
              <Link
                key={article.id}
                to={`/clanek/${article.id}`}
                className="group flex gap-4 bg-white rounded-xl border border-outline-variant/10 hover:border-outline-variant/25 hover:shadow-sm transition-all p-4"
              >
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-3xl">
                  {article.image ? (
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display="none"; }} />
                  ) : "💱"}
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
                <p className="text-4xl mb-3">💱</p>
                <p className="text-on-surface-variant">{t("forex.analyses_empty")}</p>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {/* Radarův tip */}
            <div className="bg-surface-container-low rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white rounded-xl p-2">
                  <Mascot size={48} mood="normal" variant="idle" trackMouse={false} />
                </div>
                <p className="text-sm font-black text-primary font-headline">{t("forex.radar_tip_title")}</p>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {t("forex.radar_tip_text")}
              </p>
            </div>

            {/* Zajímavé číslo */}
            <div className="bg-white rounded-2xl border border-outline-variant/10 p-5">
              <p className="text-xs font-black text-outline uppercase tracking-wider mb-1 font-headline">{t("common.did_you_know")}</p>
              <p className="text-3xl font-black text-primary font-headline leading-none">$7.5T</p>
              <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                {t("forex.daily_volume_note")}
              </p>
            </div>
          </div>
        </div>

        {/* Proč kurzy záleží - funny příklady */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xl">💡</span>
            <h2 className="text-xl font-black text-primary font-headline">{t("forex.why_rates_matter_title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FOREX_EXPLAINERS.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-outline-variant/10 p-5">
                <span className="text-3xl block mb-3">{item.emoji}</span>
                <h3 className="text-base font-black text-primary font-headline mb-2">{item.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="gradient-primary rounded-2xl p-8 text-white text-center">
          <p className="text-2xl font-black font-headline mb-2">Forex brief každý týden.</p>
          <p className="text-primary-fixed-dim mb-5">Kurzy, co se změnilo a co to znamená pro tvoji peněženku.</p>
          <Link to="/#newsletter" className="inline-block bg-white text-primary font-black text-sm font-headline px-8 py-3 rounded-full hover:bg-primary-fixed transition-colors">
            Odebírat zdarma →
          </Link>
        </div>
      </div>
    </div>
  );
}
