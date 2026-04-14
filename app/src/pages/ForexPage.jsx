import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Mascot from "../components/Mascot";
import { getArticlesByCategory } from "../data/articles";
import SignalCard from "../components/SignalCard";

const EUR_CZK_DATA = [
  { date: "7.3", rate: 25.48 }, { date: "8.3", rate: 25.42 }, { date: "9.3", rate: 25.51 },
  { date: "10.3", rate: 25.39 }, { date: "11.3", rate: 25.35 }, { date: "12.3", rate: 25.29 },
  { date: "13.3", rate: 25.33 }, { date: "14.3", rate: 25.28 }, { date: "15.3", rate: 25.22 },
  { date: "16.3", rate: 25.19 }, { date: "17.3", rate: 25.25 }, { date: "18.3", rate: 25.21 },
  { date: "19.3", rate: 25.14 }, { date: "20.3", rate: 25.08 }, { date: "21.3", rate: 25.12 },
  { date: "22.3", rate: 25.05 }, { date: "23.3", rate: 25.10 }, { date: "24.3", rate: 25.03 },
  { date: "25.3", rate: 24.98 }, { date: "26.3", rate: 25.01 }, { date: "27.3", rate: 25.06 },
  { date: "28.3", rate: 25.09 }, { date: "29.3", rate: 25.04 }, { date: "30.3", rate: 25.11 },
  { date: "31.3", rate: 25.15 }, { date: "1.4", rate: 25.09 }, { date: "2.4", rate: 25.03 },
  { date: "3.4", rate: 25.12 }, { date: "4.4", rate: 25.16 }, { date: "5.4", rate: 25.18 },
];

function EurCzkChart() {
  const first = EUR_CZK_DATA[0].rate;
  const last = EUR_CZK_DATA[EUR_CZK_DATA.length - 1].rate;
  const isUp = last >= first;
  const color = isUp ? "#16a34a" : "#dc2626";
  const diff = (last - first).toFixed(2);
  const diffPct = (((last - first) / first) * 100).toFixed(2);

  return (
    <div className={`rounded-2xl border p-6 ${isUp ? "bg-red-500/8 border-red-500/20" : "bg-emerald-500/8 border-emerald-500/20"}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-black text-white/55 uppercase tracking-wider font-headline mb-1">EUR/CZK · 30 dní</p>
          <p className="text-3xl font-black text-white font-headline">{last.toFixed(2)}</p>
        </div>
        <div className={`text-right px-3 py-2 rounded-xl ${isUp ? "bg-red-500/15" : "bg-emerald-500/15"}`}>
          <p className={`text-lg font-black ${isUp ? "text-red-400" : "text-emerald-400"}`}>
            {isUp ? "▲" : "▼"} {Math.abs(diffPct)}%
          </p>
          <p className={`text-xs font-bold ${isUp ? "text-red-400/70" : "text-emerald-400/70"}`}>
            {isUp ? "+" : ""}{diff} za 30 dní
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={EUR_CZK_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} interval={4} />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "#000d1f", fontSize: 12 }}
            formatter={(v) => [`${v.toFixed(3)} CZK`, "EUR/CZK"]}
            labelStyle={{ fontWeight: 700, color: "rgba(255,255,255,0.85)" }}
          />
          <Line
            type="monotone"
            dataKey="rate"
            stroke={color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-white/55 mt-3 text-center">Nižší hodnota = silnější koruna · Placeholder data · Zdroj: ČNB (fáze 2)</p>
    </div>
  );
}

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
    text: "Škoda Auto prodává auta za eura, ale platy platí v korunách. Silnější koruna snižuje jejich zisk v CZK. Slabší koruna = víc korun za každé euro. Forex není jen hra pro grafové nadšence, ale realita každé exportní firmy.",
  },
];

const FOREX_STARTER_POINTS = [
  {
    title: "Kupuješ něco ze zahraničí",
    text: "iPhone, sneakers nebo letenka nejsou dražší jen tak. Často za to může kurz, ne tvoje smůla.",
  },
  {
    title: "Řešíš dovolenou nebo Erasmus",
    text: "Když koruna oslabí, stejné euro tě stojí víc. A najednou je brunch v Lisabonu trochu moc premium.",
  },
  {
    title: "Nevíš, kde začít",
    text: "Úplně stačí sledovat EUR/CZK a USD/CZK. To je pro začátek víc než dost, žádný trader starter pack nepotřebuješ.",
  },
];

export default function ForexPage() {
  const { t } = useTranslation();
  const articles = getArticlesByCategory("forex");

  return (
    <div className="min-h-screen bg-[#000d1f]">
      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8 pt-10 pb-14">
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Radar</Link>
            <span>›</span>
            <span className="text-white/75">Forex</span>
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-5">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-xs font-black text-white/75 uppercase tracking-widest font-headline">{t("forex.live_badge")}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tight leading-tight mb-4">
                Forex?<br />Není to sci-fi.
              </h1>
              <p className="text-white/75 text-xl leading-relaxed max-w-xl mb-6">
                Měnové kurzy ovlivňují tvoje nákupy, dovolenou i hypotéku.
                Radar ti každý týden vysvětlí, co se děje, bez pocitu, že musíš být trader v obleku.
              </p>
              <div className="flex gap-3">
                <Link to="/#newsletter" className="bg-white text-[#000613] font-black text-sm font-headline px-6 py-3 rounded-full hover:bg-white/90 transition-colors">
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

      {/* SignalCard strip */}
      <div className="bg-white/4 border-b border-white/8">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <SignalCard eyebrow="EUR/CZK" value="25.18" note="↑ +0.1% dnes" tone="positive" />
          <SignalCard eyebrow="USD/CZK" value="23.42" note="↓ -0.2% dnes" tone="negative" />
          <SignalCard eyebrow="GBP/CZK" value="29.65" note="↑ +0.3% dnes" tone="positive" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-10 space-y-12">

        <section className="bg-white/5 rounded-3xl border border-white/8 p-6 md:p-7">
          <div className="max-w-3xl mb-5">
            <p className="text-xs font-black text-white/55 uppercase tracking-[0.22em] font-headline mb-2">Proč řešit kurz, i když netraduješ</p>
            <h2 className="text-2xl font-black text-white font-headline mb-2">Forex bez dramatu.</h2>
            <p className="text-sm text-white/65 leading-relaxed">
              Nemusíš sedět u grafu celý den. Stačí vědět, že kurz se propisuje do normálních věcí:
              nákupů, cestování a toho, kolik tě reálně stojí věci ze světa venku.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FOREX_STARTER_POINTS.map((item) => (
              <div key={item.title} className="bg-white/5 rounded-2xl border border-white/8 p-5">
                <h3 className="text-base font-black text-white font-headline mb-2">{item.title}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* EUR/CZK Chart */}
        <EurCzkChart />

        {/* Měnové páry tabulka */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h2 className="text-xl font-black text-white font-headline">{t("forex.pairs_title")}</h2>
            <span className="text-xs text-white/55 bg-white/5 px-2 py-0.5 rounded-full">{t("common.placeholder_data")}</span>
          </div>
          <div className="bg-white/5 rounded-2xl border border-white/8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8 bg-white/5">
                    <th className="text-left py-3 px-4 text-xs font-black text-white/55 uppercase tracking-wider font-headline">{t("forex.col_pair")}</th>
                    <th className="text-right py-3 px-4 text-xs font-black text-white/55 uppercase tracking-wider font-headline">{t("forex.col_rate")}</th>
                    <th className="text-right py-3 px-4 text-xs font-black text-white/55 uppercase tracking-wider font-headline">24h</th>
                    <th className="text-left py-3 px-4 text-xs font-black text-white/55 uppercase tracking-wider font-headline hidden md:table-cell">{t("forex.col_note")}</th>
                  </tr>
                </thead>
                <tbody>
                  {CURRENCY_PAIRS.map((c) => (
                    <tr key={c.pair} className="border-b border-white/6 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-black text-white font-headline">{c.pair}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-white font-headline text-sm">{c.rate}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`text-sm font-black ${c.isUp ? "text-emerald-400" : "text-red-400"}`}>
                          {c.change}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-white/65 hidden md:table-cell">{c.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Analyses + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-black text-white font-headline mb-5">{t("forex.analyses_title")}</h2>
            {articles.length > 0 ? articles.map((article) => (
              <Link
                key={article.id}
                to={`/clanek/${article.id}`}
                className="group flex gap-4 bg-white/5 rounded-xl border border-white/8 hover:border-white/15 hover:shadow-sm transition-all p-4"
              >
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-900/50 to-blue-800/50 flex items-center justify-center text-3xl">
                  {article.image ? (
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display="none"; }} />
                  ) : "💱"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${article.tagColor}`}>{article.tag}</span>
                    <span className="text-xs text-white/55">{article.date}</span>
                  </div>
                  <h3 className="text-base font-black text-white font-headline leading-snug mb-1 group-hover:text-[#ffd700] transition-colors line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-white/65 line-clamp-1">{article.excerpt}</p>
                </div>
              </Link>
            )) : (
              <div className="bg-white/5 rounded-xl p-8 text-center">
                <p className="text-4xl mb-3">💱</p>
                <p className="text-white/65">{t("forex.analyses_empty")}</p>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {/* Radarův tip */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/8">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/8 rounded-xl p-2">
                  <Mascot size={48} mood="normal" variant="idle" trackMouse={false} />
                </div>
                <p className="text-sm font-black text-white font-headline">{t("forex.radar_tip_title")}</p>
              </div>
              <p className="text-sm text-white/65 leading-relaxed">
                {t("forex.radar_tip_text")}
              </p>
            </div>

            {/* Zajímavé číslo */}
            <div className="bg-white/5 rounded-2xl border border-white/8 p-5">
              <p className="text-xs font-black text-white/55 uppercase tracking-wider mb-1 font-headline">{t("common.did_you_know")}</p>
              <p className="text-3xl font-black text-white font-headline leading-none">$7.5T</p>
              <p className="text-sm text-white/65 mt-2 leading-relaxed">
                {t("forex.daily_volume_note")}
              </p>
            </div>
          </div>
        </div>

        {/* Proč kurzy záleží - funny příklady */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xl">💡</span>
            <h2 className="text-xl font-black text-white font-headline">{t("forex.why_rates_matter_title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FOREX_EXPLAINERS.map((item) => (
              <div key={item.title} className="bg-white/5 rounded-2xl border border-white/8 p-5">
                <span className="text-3xl block mb-3">{item.emoji}</span>
                <h3 className="text-base font-black text-white font-headline mb-2">{item.title}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="gradient-primary rounded-2xl p-8 text-white text-center">
          <p className="text-2xl font-black font-headline mb-2">Forex brief každý týden.</p>
          <p className="text-white/75 mb-5">Kurzy, co se změnilo a co to znamená pro tvoji peněženku.</p>
          <Link to="/#newsletter" className="inline-block bg-white text-[#000613] font-black text-sm font-headline px-8 py-3 rounded-full hover:bg-white/90 transition-colors">
            Odebírat zdarma →
          </Link>
        </div>
      </div>
    </div>
  );
}
