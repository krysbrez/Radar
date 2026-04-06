import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LINKS = [
  {
    emoji: "📈",
    title: "Proč S&P 500 porazil 90 % aktivních fondů letos",
    desc: "Data z SPIVA Scorecard 2026 jsou brutálně jasná. Pasivní investice vyhrává.",
    path: "/clanek/etf-vs-fondy",
    readTime: 5,
    tag: "ETF",
    tagColor: "bg-blue-100 text-blue-700",
    hot: true,
  },
  {
    emoji: "₿",
    title: "Bitcoin halving: co se stane příště a proč to záleží",
    desc: "Každé 4 roky se odměna za těžbu sníží na půl. Historicky to předcházelo rally.",
    path: "/clanek/bitcoin-halving-rok-pote",
    readTime: 6,
    tag: "Krypto",
    tagColor: "bg-orange-100 text-orange-700",
    hot: false,
  },
  {
    emoji: "🏠",
    title: "Nejlepší cities pro investiční nemovitost v ČR 2026",
    desc: "Brno vede. Praha zklamává výnosem. Ostrava překvapuje. Kompletní analýza.",
    path: "/nemovitosti",
    readTime: 4,
    tag: "Nemovitosti",
    tagColor: "bg-green-100 text-green-700",
    hot: false,
  },
];

export default function BiteSize() {
  const { t } = useTranslation();

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-3 py-1 mb-2">
            <span className="text-xs font-black text-primary uppercase tracking-widest font-headline">{t("bitesize.badge")}</span>
          </div>
          <h2 className="text-2xl font-black text-primary font-headline">{t("bitesize.title")}</h2>
        </div>
        <span className="text-xs text-outline hidden md:block">{t("bitesize.this_week")}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {LINKS.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className="group bg-white rounded-2xl border border-outline-variant/10 p-5 hover:shadow-md hover:border-outline-variant/25 transition-all flex flex-col"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${item.tagColor}`}>{item.tag}</span>
                {item.hot && <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">🔥</span>}
              </div>
              <span className="text-xs text-outline">{item.readTime} {t("bitesize.read_min")}</span>
            </div>
            <div className="text-2xl mb-2">{item.emoji}</div>
            <p className="font-black text-primary font-headline text-sm leading-tight mb-2 group-hover:text-primary-container transition-colors flex-1">{item.title}</p>
            <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
              {t("common.read")} <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
