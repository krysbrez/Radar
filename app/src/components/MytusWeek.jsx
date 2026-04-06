import { useState } from "react";
import { useTranslation } from "react-i18next";

const MYTHS = [
  {
    myth: "Musíš mít 100 000 Kč, aby ses mohl/a začít investovat.",
    reality: "XTB začíná od 1 Kč. Revolut také. Investovat lze od první výplaty, bez minima. Důležité je začít, ne kolik.",
    source: "XTB, Revolut, Trading 212",
    category: "Začínám",
  },
  {
    myth: "Krypto je pro hazardéry, ne investory.",
    reality: "Bitcoin za posledních 10 let překonal S&P 500, zlato i nemovitosti. Je volatilní — ale tak i akciony v roce 2000. Riziko ≠ hazard.",
    source: "CoinGecko, Yahoo Finance",
    category: "Krypto",
  },
  {
    myth: "Nemovitosti v ČR jsou přeceněné a investice do nich se nevyplatí.",
    reality: "Průměrný výnos z pronájmu v Brně je 4.1 % p.a. Plus zhodnocení 4-6 % ročně. Dohromady ~8-10 %. To S&P 500 jen těsně poráží.",
    source: "ČSÚ, Deloitte Real Estate Index 2025",
    category: "Nemovitosti",
  },
  {
    myth: "Zlaté hodinky jsou jen luxus, ne investice.",
    reality: "Rolex Submariner Date koupený v roce 2015 za 150 000 Kč stojí dnes 380 000 Kč. Nosil jsi ho každý den. Banker ti takovýhle výnos nenabídne.",
    source: "WatchCharts, Chrono24",
    category: "Alt. investice",
  },
  {
    myth: "Potřebuješ finančního poradce, aby sis dobře investoval/a.",
    reality: "80 % aktivně řízených fondů porazí pasivní ETF index za 10 let. Jednoduchý Vanguard S&P 500 ETF poráží většinu poradců. Bez poplatků navíc.",
    source: "SPIVA Scorecard 2025",
    category: "ETF / Fondy",
  },
];

export default function MytusWeek() {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const item = MYTHS[idx];

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-6">
      <div className="grid md:grid-cols-5 gap-6">
        {/* Header */}
        <div className="md:col-span-2 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-3 py-1.5 mb-3 w-fit">
            <span className="text-xs font-black text-red-700 uppercase tracking-widest font-headline">{t("myth.badge")}</span>
          </div>
          <h2 className="text-3xl font-black text-primary font-headline mb-2">{t("myth.title")}</h2>
          <p className="text-sm text-on-surface-variant mb-5">
            Každý týden vyvrátíme jeden finanční mýtus, který tě stojí peníze.
          </p>
          {/* Dot nav */}
          <div className="flex gap-1.5 mb-4">
            {MYTHS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`rounded-full transition-all ${i === idx ? "w-5 h-2 bg-primary" : "w-2 h-2 bg-outline-variant"}`}
              />
            ))}
          </div>
          <p className="text-xs text-outline">{idx + 1} / {MYTHS.length}</p>
        </div>

        {/* Cards */}
        <div className="md:col-span-3 space-y-3">
          {/* Myth */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black text-red-700 uppercase tracking-widest font-headline">{t("myth.myth_label")}</span>
              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{item.category}</span>
            </div>
            <p className="font-bold text-red-900 leading-relaxed">{item.myth}</p>
          </div>

          {/* Reality */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <p className="text-xs font-black text-green-700 uppercase tracking-widest font-headline mb-2">{t("myth.reality_label")}</p>
            <p className="text-on-surface leading-relaxed">{item.reality}</p>
            <p className="text-xs text-green-600 mt-3 font-semibold">{t("myth.source")}: {item.source}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
