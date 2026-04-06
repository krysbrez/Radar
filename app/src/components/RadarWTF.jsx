import { useState } from "react";
import { useTranslation } from "react-i18next";

const WTF_ITEMS = [
  {
    emoji: "🤯",
    headline: "Někdo prodal NFT svého selfie za 3 miliony Kč",
    context: "Tento týden anonymní umělec prodal JPG fotky vlastní tváře v sérii 10 kusů. Kupující je platil kreditkou. Aktuálně NFT kolekce stojí 0 Kč.",
    tag: "NFT / Digitální umění",
    tagColor: "bg-purple-100 text-purple-700",
    date: "Týden 14/2026",
  },
  {
    emoji: "🏠",
    headline: "Garsonka v Praze za 9 milionů — bez balkonu, bez parkování",
    context: "22 m² v Praze 2. Inzerát napsal: 'Exkluzivní lokalita'. Výnos z pronájmu by byl 1.8 %. Spořicí účet dá víc. Ale Prahu na špek nekoupíš.",
    tag: "Nemovitosti",
    tagColor: "bg-orange-100 text-orange-700",
    date: "Týden 13/2026",
  },
  {
    emoji: "🐕",
    headline: "Dogecoin vzrostl o 40 % poté, co ho Elon zmínil ve tweetu",
    context: "Jeden tweet. Čtyřicet procent. Přičemž Dogecoin stále nemá žádný use case. Takto fungují meme coins — a proč Radar vždy říká: spekuluj jen s tím, co klidně ztratíš.",
    tag: "Krypto",
    tagColor: "bg-yellow-100 text-yellow-700",
    date: "Týden 12/2026",
  },
  {
    emoji: "📱",
    headline: "Influencer prodal 'investiční masterclass' za 29 000 Kč",
    context: "Obsah? YouTube videa přelepená vlastní tváří. Recenze? Falešné. Výsledky absolventů? 'Pracuji na tom.' Mezitím autor koupil Ferrari. Vždy ověřuj, kdo ti dává rady.",
    tag: "Finanční vzdělání",
    tagColor: "bg-red-100 text-red-700",
    date: "Týden 11/2026",
  },
];

export default function RadarWTF() {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const item = WTF_ITEMS[idx];

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-8">
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-orange-200 rounded-3xl p-8 md:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left — label + nav */}
          <div className="flex-shrink-0 md:w-48">
            <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-3 py-1.5 mb-3">
              <span className="text-xs font-black text-red-700 uppercase tracking-widest font-headline">
                {t("wtf.badge")}
              </span>
            </div>
            <h2 className="text-3xl font-black text-primary font-headline mb-1">{t("wtf.title")}</h2>
            <p className="text-sm text-on-surface-variant mb-6">{t("wtf.subtitle")}</p>

            {/* Dot nav */}
            <div className="flex gap-1.5 mb-4">
              {WTF_ITEMS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`rounded-full transition-all ${i === idx ? "w-5 h-2 bg-red-500" : "w-2 h-2 bg-outline-variant"}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIdx((idx - 1 + WTF_ITEMS.length) % WTF_ITEMS.length)}
                className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
              >
                {t("wtf.prev")}
              </button>
              <button
                onClick={() => setIdx((idx + 1) % WTF_ITEMS.length)}
                className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
              >
                {t("wtf.next")}
              </button>
            </div>
          </div>

          {/* Right — content card */}
          <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-start justify-between gap-4 mb-4">
              <span className="text-4xl">{item.emoji}</span>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${item.tagColor}`}>{item.tag}</span>
            </div>
            <h3 className="text-xl font-black text-primary font-headline leading-tight mb-3">{item.headline}</h3>
            <p className="text-sm text-on-surface leading-relaxed mb-4">{item.context}</p>
            <p className="text-xs text-outline font-semibold">{item.date}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
