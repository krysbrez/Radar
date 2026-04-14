import { useState, useEffect } from "react";

export default function RotatingFacts({ facts, intervalMs = 6000 }) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % facts.length);
        setFading(false);
      }, 300);
    }, intervalMs);
    return () => clearInterval(t);
  }, [facts.length, intervalMs]);

  return (
    <div className="bg-tertiary-fixed/20 rounded-xl p-5 border border-tertiary-fixed/40">
      <p className="text-xs font-black text-on-tertiary-fixed uppercase tracking-wider mb-3 font-headline flex items-center gap-2">
        <span className="w-5 h-5 bg-tertiary-fixed rounded-full flex items-center justify-center text-[10px]">?</span>
        Věděli jste?
      </p>
      <p
        className="text-sm text-white/65 leading-relaxed transition-opacity duration-300"
        style={{ opacity: fading ? 0 : 1 }}
      >
        {facts[index]}
      </p>
      <div className="flex gap-1 mt-4">
        {facts.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === index ? "w-5 h-1.5 bg-on-tertiary-fixed" : "w-1.5 h-1.5 bg-on-tertiary-fixed/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
