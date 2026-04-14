import { useState, useEffect } from "react";

const QUOTES = [
  {
    name: "Warren Buffett",
    role: "CEO Berkshire Hathaway",
    quote: "Nejlepší čas na investování bylo včera. Druhý nejlepší čas je dnes.",
    initial: "W",
    color: "#10b981",
  },
  {
    name: "Charlie Munger",
    role: "Partner Berkshire Hathaway",
    quote: "Inverzní myšlení: místo 'jak uspět' se ptej 'co mě zničí' — a přesně to nedělej.",
    initial: "C",
    color: "#3b82f6",
  },
  {
    name: "Ray Dalio",
    role: "Zakladatel Bridgewater",
    quote: "Diverzifikace je jediný free lunch v investování. Využij ho.",
    initial: "R",
    color: "#ef4444",
  },
  {
    name: "Peter Lynch",
    role: "Fidelity Magellan Fund",
    quote: "Investuj do věcí, které chápeš. Pokud nechápeš, jak firma vydělává peníze, nekupuj ji.",
    initial: "P",
    color: "#ffd700",
  },
  {
    name: "Benjamin Graham",
    role: "Otec hodnotového investování",
    quote: "Trh je v krátkém horizontu hlasovací automat. V dlouhém horizontu je váha.",
    initial: "B",
    color: "#8b5cf6",
  },
];

export default function InvestorQuotes() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % QUOTES.length);
        setFading(false);
      }, 350);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  function goTo(i) {
    if (i === active) return;
    setFading(true);
    setTimeout(() => {
      setActive(i);
      setFading(false);
    }, 350);
  }

  const q = QUOTES[active];

  return (
    <section className="relative overflow-hidden bg-[#000613] py-24 md:py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-[120px]"
          style={{ background: `radial-gradient(circle, ${q.color} 0%, transparent 70%)`, transition: "background 1s ease" }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(175,200,240,1) 1px, transparent 1px), linear-gradient(90deg, rgba(175,200,240,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* Gold top line */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,215,0,0.4), transparent)" }} />

      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-8">
        {/* Label */}
        <p className="font-headline mb-10 text-xs font-black uppercase tracking-[0.3em] text-white/45">
          Moudrost investorů
        </p>

        {/* Quote */}
        <div
          className="transition-opacity duration-350"
          style={{ opacity: fading ? 0 : 1, transition: "opacity 0.35s ease" }}
        >
          {/* Quote marks */}
          <div className="font-headline mb-4 text-6xl font-black leading-none text-white/8 md:text-8xl">"</div>

          <blockquote className="font-headline text-2xl font-black leading-snug tracking-tight text-white md:text-3xl lg:text-4xl">
            {q.quote}
          </blockquote>

          {/* Author */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-black text-[#000613]"
              style={{ background: q.color }}>
              {q.initial}
            </div>
            <div className="text-left">
              <p className="font-headline font-black text-white">{q.name}</p>
              <p className="text-sm text-white/55">{q.role}</p>
            </div>
          </div>
        </div>

        {/* Dots navigation */}
        <div className="mt-12 flex items-center justify-center gap-2.5">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-300"
              style={{
                width: i === active ? "28px" : "8px",
                height: "8px",
                borderRadius: "999px",
                background: i === active ? q.color : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
