import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "../components/Mascot";

const BILLIONAIRES = [
  {
    name: "Warren Buffett",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&q=80",
    netWorth: "$130 miliard",
    born: "1930, Omaha, Nebraska",
    firstInvestment: "Koupil 3 akcie Cities Service Preferred v 11 letech za $38. Prodal je za $40. Firma pak šla na $200. Lekce o trpělivosti číslo 1.",
    bestAdvice: "\"Pravidlo číslo 1: Nikdy neztrať peníze. Pravidlo číslo 2: Nikdy nezapomeň pravidlo číslo 1.\"",
    story: "Prodával žvýkačky dům od domu v 6 letech. Podal první daňové přiznání v 13 (odpočítal kolo jako pracovní výdaj). Milionář byl ve 30. Dnes je 93 let a stále chodí do práce.",
    tags: ["Value investing", "Berkshire Hathaway", "Patience"],
    color: "bg-amber-500",
    emoji: "🎩",
  },
  {
    name: "Elon Musk",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80",
    netWorth: "$180 miliard",
    born: "1971, Pretoria, Jihoafrická republika",
    firstInvestment: "Ve 12 naprogramoval hru Blastar a prodal ji za $500. Ve 24 spoluzaložil Zip2, prodal za $307M.",
    bestAdvice: "\"Snaž se být méně špatný každý den. Je to tak jednoduché.\"",
    story: "Přišel do USA s $2 000. Spal v kanceláři, sprchoval se v YMCA. Dnes provozuje rakety, auta, AI a sociální síť. Ne nutně v tomto pořadí.",
    tags: ["Tech", "Tesla", "SpaceX", "Risk-taking"],
    color: "bg-blue-500",
    emoji: "🚀",
  },
  {
    name: "Charlie Munger",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&q=80",
    netWorth: "$2.6 miliard",
    born: "1924, Omaha (†2023)",
    firstInvestment: "Pracoval v Buffettově obchodě s potravinami jako teenager. Pochopil složené úročení dříve než většina jeho vrstevníků.",
    bestAdvice: "\"Investuj do sebe. Tvůj mozek je nejlepší aktivum, které máš. Vzdělání se ti vrátí stonásobně.\"",
    story: "Právník, developer, investor. Buffettův partner 50 let. Zemřel ve 99 s portfoliem, které porazilo trh. Jeho obrovský vliv: říkej ne více věcem, říkej ano méně — ale velkým.",
    tags: ["Mental models", "Value", "Wisdom"],
    color: "bg-green-600",
    emoji: "🧠",
  },
  {
    name: "Ray Dalio",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80",
    netWorth: "$15.4 miliard",
    born: "1949, Jackson Heights, New York",
    firstInvestment: "Koupil akcie Northeast Airlines za $5 v 12 letech. Firma se sloučila a akcie ztrojnásobila. Říká, že ho to navnadilo — ale šlo jen o štěstí.",
    bestAdvice: "\"Bolest + reflexe = pokrok. Každá chyba, ze které se poučíš, je investicí do tvého budoucího úspěchu.\"",
    story: "Předpověděl finanční krizi 2008. Přišel o vše v roce 1982 a musel si půjčit $4 000 od otce. Znovu začal. Bridgewater dnes spravuje $125 miliard.",
    tags: ["Macro investing", "Principles", "Bridgewater"],
    color: "bg-purple-600",
    emoji: "🌊",
  },
  {
    name: "Peter Lynch",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&q=80",
    netWorth: "~$450 milionů",
    born: "1944, Newton, Massachusetts",
    firstInvestment: "Jako caddie (nosič holí na golfu) slyšel investiční rady od bohatých klientů. Ušetřil a investoval do Flying Tigers Airlines — zhodnocení 10×.",
    bestAdvice: "\"Investuj do toho, co znáš. Pokud ti připadá produkt skvělý a ostatní ho ignorují — přečti si výroční zprávu.\"",
    story: "Vedl Magellan Fund od 1977-1990. Průměrný roční výnos 29 %. $1 investovaný v 1977 → $28 v 1990. Nejlepší výkonnost mutual fund za 20 let.",
    tags: ["Stock picking", "Fidelity", "Consumer brands"],
    color: "bg-red-500",
    emoji: "📊",
  },
  {
    name: "Naval Ravikant",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&q=80",
    netWorth: "~$1 miliard",
    born: "1974, New Dillí, Indie",
    firstInvestment: "Jako přistěhovalec bez peněz investoval čas do učení se programování. První exit: AngelList.",
    bestAdvice: "\"Specifické znalosti, které nemůžeš získat tréninkem, jsou tvůj největší kapitál. Buduj leverage, ne jen práci.\"",
    story: "Přišel do USA jako přistěhovalec s málem. Studoval na Dartmouth. Spoluzaložil AngelList, investoval do Twitteru, Uber, Airbnb jako angel investor v seed fázi.",
    tags: ["Angel investing", "Tech", "Philosophy"],
    color: "bg-indigo-500",
    emoji: "💡",
  },
  {
    name: "Mark Cuban",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&q=80",
    netWorth: "$5.7 miliard",
    born: "1958, Pittsburgh, Pennsylvania",
    firstInvestment: "Prodával sáčky s odpadky v 12 letech, noviny, taneční lekce. Díky $1 000 od rodičů rozjel diskotékový byznys na koleji.",
    bestAdvice: "\"Pracuj tak tvrdě, jako by někdo 24 hodin denně pracoval na tom, aby tě vyřadil z byznysu.\"",
    story: "Spal na zemi s dalšími 5 lidmi v bytě. Prodal Broadcast.com Yahoo za $5.7 miliard v roce 1999. Koupil NBA Dallas Mavericks za $285M. Teď investuje v Shark Tank.",
    tags: ["Entrepreneurship", "NBA", "Shark Tank"],
    color: "bg-cyan-600",
    emoji: "🦈",
  },
  {
    name: "George Soros",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&q=80",
    netWorth: "$6.7 miliard",
    born: "1930, Budapešť, Maďarsko",
    firstInvestment: "Přežil nacistickou okupaci Maďarska. Utekl komunismu. V Londýně pracoval jako číšník a přesvědčil banku o pracovním místě.",
    bestAdvice: "\"Není důležité, jestli máš pravdu nebo ne. Důležité je, kolik vyděláš, když máš pravdu, a kolik ztratíš, když ji nemáš.\"",
    story: "\"Rozbil Bank of England\" v roce 1992 — vsadil $10 miliard proti libře a vydělal $1 miliardu za jeden den. Dnes je filantrop.",
    tags: ["Macro", "Currency trading", "Reflexivity"],
    color: "bg-gray-700",
    emoji: "💹",
  },
];

export default function MilionariPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-5xl mx-auto px-6 md:px-8 pt-10 pb-12">
          <nav className="flex items-center gap-2 text-xs text-primary-fixed-dim/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">{t("common.breadcrumb_home")}</Link>
            <span>›</span>
            <Link to="/knowhow" className="hover:text-white transition-colors">Know How</Link>
            <span>›</span>
            <span className="text-primary-fixed-dim">{t("milionari.breadcrumb_label")}</span>
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
                <span className="text-xs font-black text-primary-fixed-dim uppercase tracking-widest font-headline">{t("milionari.hero_badge")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-4">
                {t("milionari.hero_title")}<br /><span className="text-tertiary-fixed">{t("milionari.hero_title_accent")}</span>
              </h1>
              <p className="text-primary-fixed-dim text-lg leading-relaxed max-w-xl">{t("milionari.hero_subtitle")}</p>
            </div>
            <div className="hidden md:block flex-shrink-0 bg-white/10 rounded-3xl p-4">
              <Mascot size={120} mood="happy" variant="signal" trackMouse={false} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-10 space-y-6">

        {/* Buffett note */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3 items-start">
          <span className="text-2xl">🎩</span>
          <p className="text-sm text-amber-900 leading-relaxed font-medium italic">
            "{t("milionari.buffett_note")}"
          </p>
        </div>

        {/* Cards */}
        {BILLIONAIRES.map((b, i) => (
          <div key={b.name} className="bg-white rounded-2xl border border-outline-variant/10 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar + basic info */}
                <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-3">
                  <div className={`w-16 h-16 ${b.color} rounded-2xl flex items-center justify-center text-2xl`}>{b.emoji}</div>
                  <div>
                    <p className="font-black text-primary font-headline text-lg">{b.name}</p>
                    <p className="text-xs text-outline">{b.born}</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-center">
                    <p className="text-xs text-green-600 font-bold uppercase tracking-wider">{t("milionari.net_worth")}</p>
                    <p className="font-black text-green-700 font-headline">{b.netWorth}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {b.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-surface-container px-2 py-0.5 rounded-full text-outline font-bold">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs font-black text-outline uppercase tracking-wider mb-1 font-headline">{t("milionari.first_stock")}</p>
                    <p className="text-sm text-on-surface leading-relaxed">{b.firstInvestment}</p>
                  </div>

                  <div className="bg-surface-container rounded-xl p-4">
                    <p className="text-xs font-black text-outline uppercase tracking-wider mb-1 font-headline">{t("milionari.best_advice")}</p>
                    <p className="text-sm font-bold text-primary leading-relaxed italic">{b.bestAdvice}</p>
                  </div>

                  <p className="text-sm text-on-surface-variant leading-relaxed">{b.story}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Radar tagline */}
        <div className="gradient-primary rounded-2xl p-8 text-white text-center">
          <Mascot size={72} mood="happy" variant="signal" trackMouse={false} />
          <p className="text-xl font-black font-headline mt-4 mb-2">{t("milionari.tagline")}</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <Link to="/knowhow" className="bg-white text-primary font-black text-sm font-headline px-6 py-2.5 rounded-full hover:bg-primary-fixed transition-colors">
              {t("milionari.back")}
            </Link>
            <Link to="/jak-zacit" className="bg-white/10 text-white font-bold text-sm font-headline px-6 py-2.5 rounded-full hover:bg-white/20 transition-colors">
              {t("tools.start_title")} →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
