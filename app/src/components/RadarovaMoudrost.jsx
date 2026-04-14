import { useState, useEffect } from "react";

const TIPS = [
  {
    text: "Každá koruna investovaná dnes vydělá za 20 let víc než tisícovka vložená za rok. Čas je tvůj největší majetek — a ty ho právě čteš.",
    emoji: "⏰",
    author: "Radar tip #1",
  },
  {
    text: "Spořicí účet s 4% úrokem a inflací 3% = reálný výnos 1%. To nestačí ani na jednu pořádnou kebabku ročně navíc.",
    emoji: "🥙",
    author: "Radar tip #2",
  },
  {
    text: "Diverzifikace není to, že máš Teslu, Apple i Google. Tři tech akcie nejsou diverzifikace — to je trojitá sázka na jeden sektor.",
    emoji: "🎯",
    author: "Radar tip #3",
  },
];

export default function RadarovaMoudrost() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % TIPS.length);
        setFade(true);
      }, 300);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const tip = TIPS[idx];

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-6">
      <div className="gradient-primary rounded-2xl px-8 py-8 text-white">
        <p className="text-xs font-black text-white-fixed-dim/60 uppercase tracking-widest mb-5 font-headline">
          Radarova moudrost
        </p>
        <div
          className="transition-opacity duration-300"
          style={{ opacity: fade ? 1 : 0 }}
        >
          <span className="text-4xl mb-4 block">{tip.emoji}</span>
          <p className="text-xl md:text-2xl font-black font-headline leading-snug text-white mb-4 max-w-3xl">
            "{tip.text}"
          </p>
          <p className="text-xs text-white-fixed-dim/60 font-semibold">{tip.author}</p>
        </div>
        <div className="flex gap-2 mt-6">
          {TIPS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setFade(false); setTimeout(() => { setIdx(i); setFade(true); }, 200); }}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-1.5 bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
