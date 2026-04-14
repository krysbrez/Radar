import { useState } from "react";
import { useTranslation } from "react-i18next";

const NUMBERS = [
  {
    number: "8 000 000 Kč",
    emoji: "🏙️",
    headline: "Průměrná cena bytu v Praze",
    context: "138 000 Kč/m² v Praze, 96 000 Kč/m² v Brně (5 760 000 Kč za 2+1). Kdo koupil pražský byt v 2015 za 4M má dnes dvojnásobek. Praha nepřestává růst.",
    tag: "Nemovitosti",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    number: "~$70 000",
    emoji: "₿",
    headline: "Cena Bitcoinu dnes",
    context: "Kdo koupil BTC v březnu 2020 za $5 000 má dnes +1 300 %. Kdo koupil v listopadu 2021 za $69 000 — právě se dostal zpátky. Načasování je těžké, čas na trhu funguje.",
    tag: "Krypto",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  {
    number: "26 let",
    emoji: "⏰",
    headline: "Průměrný věk prvního investora v ČR",
    context: "V USA je to 18 let. Ve Velké Británii 22 let. Česká republika dohání, ale stále zaostává. Kdybys začal/a v 18, máš o 8 let složeného úročení více.",
    tag: "Statistika",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  {
    number: "12 %",
    emoji: "📊",
    headline: "Průměrný roční výnos S&P 500 za 30 let",
    context: "Investuješ 2 000 Kč měsíčně po 30 let? Při 10 % p.a. máš 4 500 000 Kč. Vložíš celkem 720 000 Kč. Zbytek je složené úročení.",
    tag: "S&P 500",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
];

export default function CisloTydne() {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const item = NUMBERS[idx];
  const hasCzkSuffix = item.number.endsWith(" Kč");
  const compactMainNumber = hasCzkSuffix ? item.number.replace(/\s*Kč$/, "") : item.number;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-6">
      <div className={`${item.bg} border ${item.border} rounded-3xl p-8 transition-all duration-500`}>
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
          {/* Number */}
          <div className="flex-shrink-0 text-center md:text-left w-full md:w-auto">
            <div className="inline-flex items-center gap-2 bg-white/60 rounded-full px-3 py-1 mb-3">
              <span className="text-xs font-black text-white/55 uppercase tracking-widest font-headline">{t("number_week.badge")}</span>
            </div>
            <div className="flex flex-col items-center gap-2 mb-2 sm:flex-row sm:justify-center md:justify-start md:items-center md:gap-3">
              <span className="text-4xl">{item.emoji}</span>
              {hasCzkSuffix ? (
                <div className={`max-w-[10ch] ${item.color}`}>
                  <p className="text-balance text-[clamp(2.25rem,10vw,4rem)] font-black font-headline leading-[0.92]">
                    {compactMainNumber}
                  </p>
                  <p className="mt-1 text-lg sm:text-xl font-black font-headline leading-none">Kč</p>
                </div>
              ) : (
                <p className={`max-w-[11ch] text-balance text-[clamp(2.3rem,11vw,4rem)] font-black font-headline leading-[0.92] ${item.color}`}>
                  {item.number}
                </p>
              )}
            </div>
            <p className="text-base sm:text-lg font-black text-white font-headline">{item.headline}</p>
          </div>

          {/* Context */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-black text-white/55 uppercase tracking-widest font-headline mb-2">{t("number_week.context_label")}</p>
            <p className="text-white/85 leading-relaxed text-sm sm:text-base">{item.context}</p>
            <span className={`inline-block mt-3 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/60 ${item.color}`}>{item.tag}</span>
          </div>

          {/* Nav */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            {NUMBERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`rounded-full transition-all ${i === idx ? "h-5 w-2 bg-primary" : "h-2 w-2 bg-outline-variant"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
