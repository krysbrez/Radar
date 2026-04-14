import { useState } from "react";

const RADAR_INSIGHTS = [
  {
    id: 1,
    label: "On The Radar",
    eyebrow: "Akcie / ETF",
    headline: "Korekce není automaticky problém. Někdy je to jen sleva bez reklamy.",
    note: "Když kvalitní ETF spadne o pár procent, ještě to neznamená, že se svět rozpadá. Často je to spíš moment, kdy šum zní hlasitěji než realita.",
    signal: "S&P 500 po korekci",
    takeaway: "Sleduj, co se změnilo ve firmách. Ne jen co se změnilo v titulcích.",
    accent: "from-sky-500/15 to-blue-500/5",
    ring: "border-sky-200",
    chip: "bg-sky-100 text-sky-700",
  },
  {
    id: 2,
    label: "On The Radar",
    eyebrow: "Reality",
    headline: "Levnější byt není automaticky deal. Někdy je levný z docela dobrého důvodu.",
    note: "U nemovitostí bývá nejdražší chyba ta, kterou nevidíš v inzerátu. Lokalita, dispozice a výnos rozhodují víc než hezká kuchyň na fotce.",
    signal: "2+kk pod trhem",
    takeaway: "Nejdřív počítej výnos a tlak na nájem. Teprve pak se zamiluj do podlahy.",
    accent: "from-orange-500/15 to-amber-500/5",
    ring: "border-orange-200",
    chip: "bg-orange-100 text-orange-700",
  },
  {
    id: 3,
    label: "On The Radar",
    eyebrow: "Auta",
    headline: "Youngtimer není jen auto. Je to směs rarity, stavu a toho, jestli ho všichni zrovna nezačali chtít ve stejný moment.",
    note: "Když kolem modelu vznikne hype, cenovka roste rychleji než rozum. Radar hledá kusy, kde ještě dává smysl vstup, ne jen nostalgie s drahým volantem.",
    signal: "BMW E46 M3",
    takeaway: "Servisní historie bývá cennější než hlasitý výfuk a cool caption.",
    accent: "from-slate-400/20 to-slate-300/5",
    ring: "border-slate-300",
    chip: "bg-slate-200 text-slate-700",
  },
  {
    id: 4,
    label: "On The Radar",
    eyebrow: "Alternativy",
    headline: "Když zlato letí nahoru, nemusí to být signál k panice. Často je to signál, že trh začíná být nervózní.",
    note: "Alternativy fungují jiným tempem než akcie. Smysl dávají hlavně tehdy, když víš, proč je sleduješ a co od nich vlastně chceš.",
    signal: "Zlato nad $2 400",
    takeaway: "Nekupuj alternativy jen proto, že vypadají dospěle. Kupuj je, když víš, co mají v portfoliu dělat.",
    accent: "from-amber-500/15 to-yellow-500/5",
    ring: "border-amber-200",
    chip: "bg-amber-100 text-amber-700",
  },
];

export default function MemeTydne() {
  const [index, setIndex] = useState(0);
  const insight = RADAR_INSIGHTS[index];

  return (
    <div className={`relative overflow-hidden rounded-[1.75rem] border ${insight.ring} bg-gradient-to-br ${insight.accent} p-6 transition-all duration-300`}>
      <div className="absolute inset-x-0 top-0 h-1 bg-primary" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/55 font-headline">
              {insight.label}
            </p>
            <p className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.18em] font-headline ${insight.chip}`}>
              {insight.eyebrow}
            </p>
          </div>
          <div className="flex gap-1">
            {RADAR_INSIGHTS.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setIndex(i)}
                className={`rounded-full transition-all ${i === index ? "h-2 w-5 bg-primary" : "h-2 w-2 bg-outline-variant"}`}
                aria-label={`Zobrazit insight ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-[0_18px_40px_rgba(12,23,46,0.06)] backdrop-blur-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55 font-headline">
            Týdenní insight
          </p>
          <h3 className="mt-3 text-xl font-black leading-tight text-white font-headline">
            {insight.headline}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            {insight.note}
          </p>

          <div className="mt-5 rounded-2xl border border-white/12/10 bg-white/5 px-4 py-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55 font-headline">
              Signál týdne
            </p>
            <p className="mt-2 text-base font-black text-white font-headline">
              {insight.signal}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              {insight.takeaway}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <button
            onClick={() => setIndex((index - 1 + RADAR_INSIGHTS.length) % RADAR_INSIGHTS.length)}
            className="font-bold text-white/65 hover:text-white transition-colors"
          >
            ← Předchozí
          </button>
          <p className="text-white/55">{index + 1} / {RADAR_INSIGHTS.length}</p>
          <button
            onClick={() => setIndex((index + 1) % RADAR_INSIGHTS.length)}
            className="font-bold text-white/65 hover:text-white transition-colors"
          >
            Další →
          </button>
        </div>
      </div>
    </div>
  );
}
