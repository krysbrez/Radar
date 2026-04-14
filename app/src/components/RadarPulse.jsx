import { useState, useEffect } from "react";

const NEWS_ITEMS = [
  {
    id: 1,
    time: "09:42",
    tag: "Akcie",
    text: "ECB potvrzuje stabilitu úrokových sazeb na 3,25 % — trhy reagují mírným růstem",
    tagColor: "bg-sky-500/20 text-sky-300",
  },
  {
    id: 2,
    time: "09:15",
    tag: "Krypto",
    text: "Bitcoin překonává $70k intraday, avšak uzavírá pod klíčovým odporem",
    tagColor: "bg-orange-500/20 text-orange-300",
  },
  {
    id: 3,
    time: "08:50",
    tag: "Forex",
    text: "EUR/CZK klesá k 25.10 po silnějším než očekávaném průmyslovém indexu ČR",
    tagColor: "bg-purple-500/20 text-purple-300",
  },
  {
    id: 4,
    time: "08:30",
    tag: "Zlato",
    text: "Zlato atakuje historická maxima — bezpečné přístavy v kurzu před Powell projevem",
    tagColor: "bg-[#ffd700]/15 text-[#ffd700]",
  },
  {
    id: 5,
    time: "08:05",
    tag: "Nemovitosti",
    text: "Hypoteční sazby v ČR klesají pod 5,5 % — první pokles od Q2 2024",
    tagColor: "bg-emerald-500/20 text-emerald-300",
  },
  {
    id: 6,
    time: "07:45",
    tag: "S&P 500",
    text: "Tech sektor vede rally — NVDA a MSFT na nových maximech po AI earnings sezóně",
    tagColor: "bg-sky-500/20 text-sky-300",
  },
];

export default function RadarPulse() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex((i) => (i + 1) % NEWS_ITEMS.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const active = NEWS_ITEMS[activeIndex];

  return (
    <div className="gradient-primary text-white rounded-2xl p-6 relative overflow-hidden border border-white/8">
      {/* Background decoration */}
      <div className="absolute -right-6 -bottom-6 opacity-5">
        <svg viewBox="0 0 120 120" width="120" height="120" fill="none">
          <circle cx="60" cy="60" r="50" stroke="white" strokeWidth="8" />
          <circle cx="60" cy="60" r="35" stroke="white" strokeWidth="5" />
          <circle cx="60" cy="60" r="20" stroke="white" strokeWidth="3" />
          <circle cx="60" cy="60" r="5" fill="white" />
          <line x1="60" y1="10" x2="60" y2="110" stroke="white" strokeWidth="1" opacity="0.5" />
          <line x1="10" y1="60" x2="110" y2="60" stroke="white" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[#ffd700] rounded-full animate-pulse" />
              <h3 className="text-lg font-black font-headline tracking-tight">Radar Pulse</h3>
            </div>
            <p className="text-white/65 text-xs font-semibold tracking-wide uppercase">
              Živé aktualizace z trhů
            </p>
          </div>
          <div className="text-xs text-white/40 font-mono">
            {active.time}
          </div>
        </div>

        {/* Active news item */}
        <div
          className={`transition-all duration-300 mb-5 ${
            isAnimating ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
          }`}
        >
          <span
            className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-3 ${active.tagColor}`}
          >
            {active.tag}
          </span>
          <p className="text-sm leading-relaxed text-white/90 font-medium">
            {active.text}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {NEWS_ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`transition-all duration-300 rounded-full ${
                i === activeIndex
                  ? "w-6 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Novinka ${i + 1}`}
            />
          ))}
        </div>

        {/* All items preview */}
        <div className="mt-5 space-y-2.5 border-t border-white/10 pt-5">
          {NEWS_ITEMS.slice(0, 3).map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(i)}
              className={`w-full text-left flex items-start gap-2.5 rounded-lg p-2 -mx-2 transition-colors ${
                i === activeIndex ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <span className="text-white/65 text-xs font-mono mt-0.5 flex-shrink-0 opacity-70">
                {item.time}
              </span>
              <p className="text-xs text-white/75 leading-relaxed line-clamp-2">
                {item.text}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
