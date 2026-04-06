import { useTranslation } from "react-i18next";

const QUOTES = [
  {
    name: "Warren Buffett",
    role: "CEO Berkshire Hathaway",
    quote: "Nejlepší čas na investování bylo včera. Druhý nejlepší čas je dnes.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&q=80",
    accentColor: "border-green-500",
    textColor: "text-green-600",
  },
  {
    name: "Charlie Munger",
    role: "Partner Berkshire Hathaway",
    quote: "Inverzní myšlení: místo 'jak uspět' se ptej 'co mě zničí' — a přesně to nedělej.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&q=80",
    accentColor: "border-blue-500",
    textColor: "text-blue-600",
  },
  {
    name: "Ray Dalio",
    role: "Zakladatel Bridgewater",
    quote: "Diverzifikace je jediný free lunch v investování. Využij ho.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&q=80",
    accentColor: "border-red-500",
    textColor: "text-red-500",
  },
  {
    name: "Peter Lynch",
    role: "Fidelity Magellan Fund",
    quote: "Investuj do věcí, které chápeš. Pokud nechápeš, jak firma vydělává peníze, nekupuj ji.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&q=80",
    accentColor: "border-yellow-500",
    textColor: "text-yellow-600",
  },
];

export default function InvestorQuotes() {
  const { t } = useTranslation();
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-16">
      <div className="mb-10">
        <p className="text-xs font-black tracking-widest uppercase text-outline mb-2 font-headline">{t("investor_quotes.label")}</p>
        <h2 className="text-4xl md:text-5xl font-black text-primary font-headline tracking-tight leading-none">
          {t("investor_quotes.title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {QUOTES.map((q) => (
          <div
            key={q.name}
            className={`bg-white rounded-2xl border-l-4 ${q.accentColor} border border-outline-variant/10 p-6 hover:shadow-md transition-all`}
          >
            <p className="text-xl md:text-2xl font-black text-primary font-headline leading-snug mb-5">
              "{q.quote}"
            </p>
            <div className="flex items-center gap-3">
              <img
                src={q.avatar}
                alt={q.name}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-outline-variant/20"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div>
                <p className={`font-black text-sm font-headline ${q.textColor}`}>{q.name}</p>
                <p className="text-xs text-outline">{q.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
