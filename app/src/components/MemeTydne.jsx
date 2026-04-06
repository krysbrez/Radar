import { useState } from "react";

const MEMES = [
  {
    id: 1,
    text: "Já při pohledu na graf S&P 500 v lednu 2022",
    subtext: "vs. já, co nakupoval DCA každý měsíc bez koukání na ceny",
    topLabel: "😭 Panic seller",
    bottomLabel: "😎 DCA investor",
    emoji: "📉",
    bg: "from-red-50 to-orange-50",
    border: "border-orange-200",
  },
  {
    id: 2,
    text: "Kamarád: 'Krypto je mrtvé'",
    subtext: "Bitcoin dva týdny poté",
    topLabel: "💀 FUD",
    bottomLabel: "🚀 +40%",
    emoji: "₿",
    bg: "from-orange-50 to-yellow-50",
    border: "border-yellow-200",
  },
  {
    id: 3,
    text: "Spořicí účet mi dává 4 % a já jsem spokojený",
    subtext: "Inflace tiše:",
    topLabel: "😊 Nominální výnos",
    bottomLabel: "😤 Reálný výnos: +0.8%",
    emoji: "🏦",
    bg: "from-blue-50 to-cyan-50",
    border: "border-blue-200",
  },
  {
    id: 4,
    text: "Já při pohledu na portfolio po prvním měsíci investování",
    subtext: "Já po 10 letech složeného úročení",
    topLabel: "😕 -2 % tento měsíc",
    bottomLabel: "🤑 +340 % celkem",
    emoji: "📈",
    bg: "from-green-50 to-emerald-50",
    border: "border-green-200",
  },
];

export default function MemeTydne() {
  const [index, setIndex] = useState(0);
  const meme = MEMES[index];

  return (
    <div className={`bg-gradient-to-br ${meme.bg} rounded-2xl p-6 border ${meme.border} transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-black text-outline uppercase tracking-widest font-headline">
          Meme týdne 😂
        </p>
        <div className="flex gap-1">
          {MEMES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all ${
                i === index ? "w-5 h-2 bg-primary" : "w-2 h-2 bg-outline-variant"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Meme card */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        {/* Top panel */}
        <div className="p-4 border-b border-outline-variant/10">
          <span className="text-xs font-bold text-outline bg-surface-container px-2 py-0.5 rounded">{meme.topLabel}</span>
          <div className="flex items-center justify-center py-6">
            <span className="text-6xl">{meme.emoji}</span>
            <span className="text-4xl ml-2">😭</span>
          </div>
          <p className="text-sm font-bold text-primary text-center font-headline leading-snug">{meme.text}</p>
        </div>
        {/* Bottom panel */}
        <div className="p-4">
          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">{meme.bottomLabel}</span>
          <div className="flex items-center justify-center py-4">
            <span className="text-5xl">😎</span>
            <span className="text-4xl ml-2">💸</span>
          </div>
          <p className="text-sm text-on-surface-variant text-center italic">{meme.subtext}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <button
          onClick={() => setIndex((index - 1 + MEMES.length) % MEMES.length)}
          className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
        >
          ← Předchozí
        </button>
        <p className="text-xs text-outline">{index + 1} / {MEMES.length}</p>
        <button
          onClick={() => setIndex((index + 1) % MEMES.length)}
          className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
        >
          Další →
        </button>
      </div>
    </div>
  );
}
