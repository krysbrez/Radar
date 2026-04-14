import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Mascot from "../components/Mascot";
import MainContent from "../components/MainContent";

// ─── DATA ────────────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  { label: "BTC",     value: "$70,241",   change: "+2.4%",  up: true  },
  { label: "S&P 500", value: "5,483",     change: "-0.8%",  up: false },
  { label: "EUR/CZK", value: "25.18",     change: "+0.1%",  up: true  },
  { label: "ZLATO",   value: "$2,340/oz", change: "+0.3%",  up: true  },
  { label: "ETH",     value: "$3,810",    change: "+1.7%",  up: true  },
  { label: "ČEZ",     value: "900 Kč",    change: "+1.2%",  up: true  },
  { label: "NASDAQ",  value: "19,240",    change: "-1.1%",  up: false },
  { label: "USD/CZK", value: "23.42",     change: "-0.2%",  up: false },
  { label: "NVIDIA",  value: "$880",      change: "+3.4%",  up: true  },
  { label: "APPLE",   value: "$172",      change: "+0.9%",  up: true  },
];

const HOW_STEPS = [
  {
    num: "01", icon: "📡",
    title: "Hlídá 40+ zdrojů denně",
    text: "Bloomberg, Reuters, ČNB, StockX — každý den.",
    delay: "reveal-delay-1",
  },
  {
    num: "02", icon: "🎯",
    title: "Filtruje signál od šumu",
    text: "90 % zpráv je hluk. Dostaneš jen to důležité.",
    delay: "reveal-delay-2",
  },
  {
    num: "03", icon: "📬",
    title: "Pondělí 8:00 — v e-mailu",
    text: "Pět minut čtení. Žádný clickbait. Žádný spam.",
    delay: "reveal-delay-3",
  },
];

const LIVE_SIGNALS = [
  {
    category: "Akcie / ETF", icon: "📊", signal: "S&P 500",
    value: "5 483", change: "-0.8%", up: false,
    accent: "from-sky-500/12 to-transparent", tag: "bg-sky-500/25 text-sky-200 border border-sky-500/20",
    href: "/akcie",
  },
  {
    category: "Krypto", icon: "₿", signal: "Bitcoin",
    value: "$70,241", change: "+2.4%", up: true,
    accent: "from-orange-500/12 to-transparent", tag: "bg-orange-500/25 text-orange-200 border border-orange-500/20",
    href: "/krypto",
  },
  {
    category: "Reality", icon: "🏠", signal: "Praha 2+kk",
    value: "pod 5.8M", change: "−14 nových", up: false,
    accent: "from-emerald-500/12 to-transparent", tag: "bg-emerald-500/25 text-emerald-200 border border-emerald-500/20",
    href: "/nemovitosti",
  },
  {
    category: "Alternativy", icon: "✦", signal: "Zlato",
    value: "$2,340/oz", change: "+0.3%", up: true,
    accent: "from-yellow-500/12 to-transparent", tag: "bg-yellow-500/25 text-yellow-200 border border-yellow-500/20",
    href: "/#investovani",
  },
];

const HOMEPAGE_REVIEWS = [
  {
    stars: 5, name: "Tomáš K.", age: 28, role: "Softwarový inženýr", avatar: "T", color: "bg-sky-500",
    text: "Konečně newsletter, který mi řekne co je důležité bez toho, abych musel číst 20 článků. Každé pondělí 5 minut a mám přehled.",
  },
  {
    stars: 5, name: "Markéta V.", age: 34, role: "Projektová manažerka", avatar: "M", color: "bg-violet-500",
    text: "Začala jsem investovat díky Radaru. Vysvětlují věci tak, aby je pochopil každý — bez zbytečného finančního žargonu.",
  },
  {
    stars: 5, name: "Jakub P.", age: 24, role: "Student ekonomie", avatar: "J", color: "bg-amber-500",
    text: "Mám Radarový signál na Rolex GMT a BMW E30. Ušetřil jsem 60 000 Kč, protože jsem věděl, kdy vstoupit.",
  },
];

const KNOWHOW_ITEMS = [
  {
    badge: "Začátečník", level: "beginner",
    title: "Složené úroky: Proč Einstein říkal, že je to osmý div světa",
    excerpt: "10 000 Kč při 7% ročním výnosu = přes 500 000 Kč za 30 let. Žádná magie — jen čas.",
    readTime: "4 min", href: "/clanek/slozene-uroky",
  },
  {
    badge: "Začátečník", level: "beginner",
    title: "ETF vs. Aktivně řízené fondy: Kdo vyhrál poslední dekádu?",
    excerpt: "90 % aktivně řízených fondů podstřelilo svůj benchmark. Data hovoří jasně.",
    readTime: "5 min", href: "/clanek/etf-vs-fondy",
  },
  {
    badge: "Pokročilý", level: "advanced",
    title: "Dollar-Cost Averaging: Investuj každý měsíc, nehleď na cenu",
    excerpt: "DCA eliminuje špatné načasování. Historická data ukazují, že funguje lépe než čekání.",
    readTime: "6 min", href: "/clanek/dollar-cost-averaging",
  },
];

// ─── HOOK ────────────────────────────────────────────────────────────────────

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in-view"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ─── STARFIELD ───────────────────────────────────────────────────────────────

// Seeded pseudo-random positions — stable across renders, no Math.random()
const STAR_DATA = Array.from({ length: 72 }, (_, i) => ({
  x: ((i * 127 + 43) % 97) + 1,
  y: ((i * 71  + 19) % 95) + 1,
  cls: ["star-a", "star-b", "star-c"][i % 3],
  big: (i * 11) % 9 === 0,
  delay: `${((i * 0.38) % 9).toFixed(2)}s`,
}));

function Starfield({ count = 72, className = "" }) {
  const stars = STAR_DATA.slice(0, count);
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {stars.map((s, i) => (
        <span key={i} className={`${s.cls} absolute rounded-full bg-white`}
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width:  s.big ? "1.5px" : "1px",
            height: s.big ? "1.5px" : "1px",
            animationDelay: s.delay,
          }} />
      ))}
    </div>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function Stars({ n = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#ffd700">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

// ─── INLINE SECTIONS ─────────────────────────────────────────────────────────

function NemovitostiAutaSplit() {
  const SPLITS = [
    {
      id: "nemovitosti", label: "Reality", href: "/nemovitosti",
      title: "Byt nebo dům jako investice v roce 2026",
      stat: "+8.2 %", statLabel: "průměrný výnos Praha",
      note: "Nájmy rostou, hypotéky klesají. Příležitost nebo past?",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&h=600&fit=crop&q=85",
      color: "#10b981",
    },
    {
      id: "auta", label: "Auta", href: "/auta",
      title: "Youngtimer jako investice: Kdy vstoupit?",
      stat: "+114 %", statLabel: "BMW E36 M3 za 5 let",
      note: "Analogové vozy s omezenou nabídkou. Okno se zavírá.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=600&fit=crop&q=85",
      color: "#f97316",
    },
  ];

  return (
    <section className="py-10 md:py-14" style={{ background: "linear-gradient(180deg, #00101f 0%, #000d1f 100%)" }}>
    <div className="mx-auto max-w-7xl px-6 md:px-8">
      <div className="reveal mb-7 flex items-end justify-between">
        <div>
          <p className="font-headline mb-1 text-[11px] font-black uppercase tracking-[0.28em] text-white/70">Další kategorie</p>
          <h2 className="font-headline text-2xl font-black tracking-tight text-white md:text-3xl">Reality a sběratelská auta</h2>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {SPLITS.map((s, i) => (
          <Link key={s.id} to={s.href}
            className={`reveal reveal-delay-${i + 1} group relative block overflow-hidden rounded-2xl ring-1 ring-black/5 transition-all duration-500 hover:ring-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]`}>
            <div className="relative h-[280px] overflow-hidden">
              <img src={s.image} alt={s.label} loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              {/* Layered gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#000613] via-[#000613]/65 to-[#000613]/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#000613]/25 via-transparent to-transparent" />

              {/* Top labels */}
              <div className="absolute left-4 top-4 flex items-center gap-2">
                <span className="font-headline rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                  {s.label}
                </span>
              </div>
              <div className="absolute right-4 top-4 rounded-full border px-3 py-1 text-sm font-black backdrop-blur-md"
                style={{ background: `${s.color}20`, borderColor: `${s.color}40`, color: s.color }}>
                {s.stat}
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-8">
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{s.statLabel}</p>
                <h3 className="font-headline text-[1.3rem] font-black leading-snug text-white transition-colors duration-300 group-hover:text-[#ffd700]">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[13px] text-white/70">{s.note}</p>
                <span className="font-headline mt-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[13px] font-black text-white backdrop-blur-sm transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/14">
                  Prozkoumat
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </section>
  );
}

function KnowHowSection() {
  return (
    <section className="py-12 md:py-16" style={{ background: "linear-gradient(180deg, #000d1f 0%, #010c1c 100%)" }}>
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="reveal mb-7 flex items-end justify-between">
          <div>
            <p className="font-headline mb-1 text-[11px] font-black uppercase tracking-[0.28em] text-white/70">Know-How</p>
            <h2 className="font-headline text-2xl font-black tracking-tight text-white md:text-3xl">Základy, které se vyplatí</h2>
          </div>
          <Link to="/knowhow"
            className="font-headline hidden rounded-full border border-white/15 px-4 py-2 text-[13px] font-bold text-white/45 transition hover:border-[#ffd700]/20 hover:text-[#ffd700] sm:inline-block">
            Všechny →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {KNOWHOW_ITEMS.map((item, i) => (
            <Link key={item.href} to={item.href}
              className={`reveal reveal-delay-${i + 1} group flex flex-col rounded-2xl border border-white/8 bg-white/4 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ffd700]/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]`}>
              <span className={`font-headline mb-3 self-start rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border ${
                item.level === "advanced"
                  ? "bg-violet-500/15 text-violet-300 border-violet-500/20"
                  : "bg-emerald-500/15 text-emerald-300 border-emerald-500/20"
              }`}>
                {item.badge}
              </span>
              <h3 className="font-headline mb-4 flex-1 text-[0.9rem] font-black leading-snug text-white transition-colors group-hover:text-[#ffd700]">
                {item.title}
              </h3>
              <div className="flex items-center justify-between border-t border-white/8 pt-3">
                <span className="font-headline text-[13px] font-bold text-[#ffd700]/80 transition-colors group-hover:text-[#ffd700]">
                  Číst →
                </span>
                <div className="flex items-center gap-1 text-[11px] text-white/50">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  {item.readTime}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterCTA({ email, setEmail, subDone, onSubmit }) {
  return (
    <section className="relative overflow-hidden py-20 md:py-28"
      style={{ background: "linear-gradient(160deg, #000613 0%, #00122b 50%, #000613 100%)" }}>

      {/* Starfield */}
      <Starfield count={48} />

      {/* Gold top edge */}
      <div className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 5%, #ffd700 40%, #ffd700 60%, transparent 95%)" }} />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[500px] -translate-x-1/2 rounded-full opacity-10 blur-[100px]"
        style={{ background: "radial-gradient(circle, #ffd700 0%, transparent 70%)" }} />

      <div className="relative mx-auto max-w-2xl px-6 text-center md:px-8">
        <div className="reveal">
          <p className="font-headline mb-5 text-[11px] font-black uppercase tracking-[0.32em] text-[#ffd700]/45">Newsletter</p>
          <h2 className="font-headline text-4xl font-black leading-[1.08] tracking-tight text-white md:text-[3.25rem]">
            Každé pondělí.<br />
            <span className="text-shimmer-gold">Vše důležité.</span><br />
            Nic zbytečného.
          </h2>
        </div>

        <div className="reveal reveal-delay-2 mt-8">
          {subDone ? (
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-8 py-5">
              <p className="font-black text-emerald-400">✓ Přihlášení úspěšné!</p>
              <p className="mt-1 text-sm text-[#afc8f0]/60">Potvrď e-mail a uvidíme se v pondělí v 8:00.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-2.5 sm:flex-row">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="tvuj@email.cz"
                className="flex-1 rounded-full border border-white/12 bg-white/8 px-6 py-3.5 text-[15px] text-white placeholder-white/40 outline-none transition focus:border-[#ffd700]/45 focus:bg-white/12" />
              <button type="submit"
                className="font-headline flex-shrink-0 rounded-full bg-[#ffd700] px-7 py-3.5 text-[13px] font-black text-[#000613] shadow-[0_0_36px_rgba(255,215,0,0.18)] transition-all hover:bg-[#ffe234] hover:shadow-[0_0_56px_rgba(255,215,0,0.36)]">
                Odebírat zdarma
              </button>
            </form>
          )}
          <p className="mt-3 text-[11px] text-[#afc8f0]/45">47 238 čtenářů · Odhlásit jedním klikem · Žádný spam</p>
        </div>
      </div>
    </section>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [subDone, setSubDone] = useState(false);
  useScrollReveal();

  function handleSubscribe(e) {
    e.preventDefault();
    if (email.trim()) { setSubDone(true); setEmail(""); }
  }

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen flex-col overflow-hidden"
        style={{ background: "radial-gradient(ellipse 120% 80% at 50% -10%, #001530 0%, #000613 55%)" }}>

        {/* Starfield — the main luxury atmosphere layer */}
        <Starfield count={72} />

        {/* Ambient glow layers */}
        <div className="pointer-events-none absolute inset-0">
          {/* Deep blue top bloom */}
          <div className="absolute -top-24 left-1/2 h-[520px] w-[780px] -translate-x-1/2 rounded-full opacity-25 blur-[130px]"
            style={{ background: "radial-gradient(ellipse, #003070 0%, transparent 65%)" }} />
          {/* Subtle gold warmth — upper left */}
          <div className="absolute left-[10%] top-[25%] h-56 w-56 rounded-full opacity-6 blur-[90px]"
            style={{ background: "radial-gradient(circle, #ffd700 0%, transparent 70%)" }} />
          {/* Right-side cool accent */}
          <div className="absolute right-[12%] top-[40%] h-40 w-40 rounded-full opacity-5 blur-[70px]"
            style={{ background: "radial-gradient(circle, #afc8f0 0%, transparent 70%)" }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-1 items-center">
          <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-8 md:py-32">
            <div className="grid items-center gap-12 md:grid-cols-2">

              {/* Left — text */}
              <div>
                {/* Badge */}
                <div className="animate-fadeInUp mb-8 inline-flex items-center gap-2 rounded-full border border-[#ffd700]/20 bg-[#ffd700]/8 px-4 py-1.5"
                  style={{ animationDelay: "0s" }}>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ffd700]" />
                  <span className="font-headline text-[11px] font-black uppercase tracking-[0.22em] text-[#ffd700]">
                    Každé pondělí · 8:00 · Zdarma
                  </span>
                </div>

                {/* Headline */}
                <h1 className="font-headline">
                  <span className="animate-fadeInUp block text-[2.4rem] font-black leading-[1.06] tracking-[-0.02em] text-white sm:text-[3rem] md:text-[4rem] lg:text-[5rem]"
                    style={{ animationDelay: "0.1s" }}>Finanční chaos?</span>
                  <span className="animate-fadeInUp block text-[2.4rem] font-black leading-[1.06] tracking-[-0.02em] sm:text-[3rem] md:text-[4rem] lg:text-[5rem]"
                    style={{ animationDelay: "0.24s" }}>
                    <span className="text-shimmer-gold">My ho čteme</span>
                  </span>
                  <span className="animate-fadeInUp block text-[2.4rem] font-black leading-[1.06] tracking-[-0.02em] text-white sm:text-[3rem] md:text-[4rem] lg:text-[5rem]"
                    style={{ animationDelay: "0.38s" }}>za tebe.</span>
                </h1>

                {/* Sub-headline */}
                <p className="animate-fadeInUp mt-6 max-w-md text-[15px] leading-relaxed text-white/55"
                  style={{ animationDelay: "0.45s" }}>
                  Každé pondělí přehled trhů, signálů a investičních příležitostí — bez zbytečného hluku.
                </p>

                {/* CTAs */}
                <div className="animate-fadeInUp mt-8 flex flex-wrap items-center gap-3"
                  style={{ animationDelay: "0.58s" }}>
                  <Link to="/newsletter"
                    className="font-headline inline-flex items-center gap-2 rounded-full bg-[#ffd700] px-7 py-3.5 text-[14px] font-black text-[#000613] shadow-[0_0_40px_rgba(255,215,0,0.22)] transition-all hover:bg-[#ffe234] hover:shadow-[0_0_60px_rgba(255,215,0,0.42)]">
                    Odebírat zdarma
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <a href="#jak-funguje"
                    className="font-headline inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-7 py-3.5 text-[14px] font-bold text-white/85 transition-all hover:border-white/25 hover:bg-white/10 hover:text-white">
                    Jak to funguje ↓
                  </a>
                </div>

                {/* Social proof */}
                <div className="animate-fadeInUp mt-7 flex items-center gap-3"
                  style={{ animationDelay: "0.82s" }}>
                  <div className="flex -space-x-2">
                    {["T","M","J","A","K"].map((l, i) => (
                      <div key={i}
                        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#000613] text-[10px] font-black text-white"
                        style={{ background: ["#3b82f6","#8b5cf6","#f59e0b","#10b981","#ef4444"][i] }}>
                        {l}
                      </div>
                    ))}
                  </div>
                  <p className="text-[13px] text-[#afc8f0]/70">
                    <span className="font-black text-white">47 238</span> čtenářů tento týden
                  </p>
                </div>
              </div>

              {/* Right — mascot */}
              <div className="animate-fadeInUp hidden justify-center md:flex" style={{ animationDelay: "0.3s" }}>
                <div className="relative flex h-72 w-72 items-center justify-center lg:h-[340px] lg:w-[340px]">
                  {/* Controlled glow — two rings only */}
                  <div className="gold-ring" style={{ inset: "-12px", borderColor: "rgba(255,215,0,0.28)" }} />
                  <div className="gold-ring gold-ring-2" style={{ inset: "-12px", borderColor: "rgba(255,215,0,0.14)" }} />
                  {/* Soft background glow */}
                  <div className="absolute inset-0 rounded-full opacity-18 blur-3xl"
                    style={{ background: "radial-gradient(circle, rgba(255,215,0,0.35) 0%, transparent 65%)" }} />
                  <div className="animate-floatY relative z-10">
                    <Mascot size={200} mood="happy" variant="signal" trackMouse={false} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="relative z-10 overflow-hidden border-t border-white/6 bg-[#000613]/70 py-3 backdrop-blur-sm">
          <div className="ticker-dark-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <div key={i} className="mx-7 flex items-center gap-2 whitespace-nowrap">
                <span className="font-headline text-[10px] font-black uppercase tracking-[0.22em] text-white/45">{item.label}</span>
                <span className="font-mono text-[13px] font-black text-white">{item.value}</span>
                <span className={`font-mono text-[11px] font-black ${item.up ? "text-emerald-400" : "text-red-400"}`}>
                  {item.up ? "▲" : "▼"} {item.change}
                </span>
                <span className="mx-2 text-white/12">·</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. JAK FUNGUJE
      ══════════════════════════════════════════════════════════ */}
      <section id="jak-funguje" className="scroll-mt-20 py-14 md:py-20"
        style={{ background: "linear-gradient(180deg, #000613 0%, #000d1f 100%)" }}>
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="reveal mb-10 text-center">
            <p className="font-headline mb-2 text-[11px] font-black uppercase tracking-[0.28em] text-white/70">Jak Radar funguje</p>
            <h2 className="font-headline text-3xl font-black tracking-tight text-white md:text-4xl">
              Tři kroky. Jeden výsledek.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {HOW_STEPS.map((step, idx) => (
              <div key={step.num}
                className={`reveal ${step.delay} group relative overflow-hidden rounded-2xl border border-white/8 bg-white/4 p-7 transition-all duration-300 hover:border-[#ffd700]/20 hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)]`}>
                {/* Accent top line on hover */}
                <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 rounded-full bg-[#ffd700] transition-transform duration-500 group-hover:scale-x-100" />

                {/* Icon + step number inline */}
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                    style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.15)" }}>
                    {step.icon}
                  </div>
                  <span className="font-headline text-[11px] font-black uppercase tracking-[0.22em] text-white/50">{step.num}</span>
                </div>

                <h3 className="font-headline mb-2.5 text-[1.05rem] font-black leading-snug text-white">{step.title}</h3>
                <p className="text-[13px] leading-relaxed text-white/70">{step.text}</p>

                {idx < 2 && (
                  <div className="pointer-events-none absolute -right-3.5 top-1/2 z-10 hidden -translate-y-1/2 md:flex h-7 w-7 items-center justify-center rounded-full border border-white/12 bg-[#000d1f] text-xs text-white/70">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. LIVE SIGNÁLY
      ══════════════════════════════════════════════════════════ */}
      <section className="py-14 md:py-20"
        style={{ background: "linear-gradient(180deg, #00101f 0%, #000c18 100%)" }}>
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="reveal mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                <span className="font-headline text-[10px] font-black uppercase tracking-[0.22em] text-emerald-400">Live signály</span>
              </div>
              <h2 className="font-headline text-3xl font-black tracking-tight text-white md:text-4xl">
                Co Radar sleduje<span className="text-shimmer-gold"> právě teď</span>
              </h2>
            </div>
            <Link to="/hlidac"
              className="font-headline flex-shrink-0 self-start rounded-full border border-[#ffd700]/20 bg-[#ffd700]/6 px-5 py-2 text-[13px] font-black text-[#ffd700]/80 transition-all hover:border-[#ffd700]/35 hover:bg-[#ffd700]/12 hover:text-[#ffd700]">
              Nastavit alert →
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {LIVE_SIGNALS.map((sig, i) => (
              <Link key={sig.category} to={sig.href}
                className={`reveal reveal-delay-${i + 1} group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b ${sig.accent} p-5 transition-all duration-300 hover:border-white/18 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]`}>

                {/* Live dot */}
                <div className="absolute right-4 top-4 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-bold text-white/70">live</span>
                </div>

                <span className={`font-headline inline-block rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${sig.tag}`}>
                  {sig.category}
                </span>

                <div className="mt-5 text-2xl leading-none">{sig.icon}</div>

                <p className="font-headline mt-2 text-[15px] font-black text-white">{sig.signal}</p>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-mono text-[1.4rem] font-black tracking-tight text-white">{sig.value}</span>
                  <span className={`font-mono text-xs font-black ${sig.up ? "text-emerald-300" : "text-red-300"}`}>
                    {sig.up ? "▲" : "▼"} {sig.change}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. EDITORIAL — Investování
      ══════════════════════════════════════════════════════════ */}
      <div id="investovani" className="scroll-mt-20" style={{ background: "#000d1f" }}>
        <MainContent />
      </div>

      {/* ══════════════════════════════════════════════════════════
          5. REALITY + AUTA
      ══════════════════════════════════════════════════════════ */}
      <NemovitostiAutaSplit />

      {/* ══════════════════════════════════════════════════════════
          6. KNOW-HOW
      ══════════════════════════════════════════════════════════ */}
      <KnowHowSection />

      {/* ══════════════════════════════════════════════════════════
          7. CO ŘÍKAJÍ ČTENÁŘI
      ══════════════════════════════════════════════════════════ */}
      <section className="py-14 md:py-20" style={{ background: "linear-gradient(180deg, #010c1c 0%, #000d1f 100%)" }}>
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="reveal mb-8 text-center">
            <p className="font-headline mb-2 text-[11px] font-black uppercase tracking-[0.28em] text-white/70">Co říkají čtenáři</p>
            <h2 className="font-headline text-3xl font-black tracking-tight text-white md:text-4xl">
              Nejsme sami, kdo to říká.
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0"
            style={{ scrollSnapType: "x mandatory" }}>
            {HOMEPAGE_REVIEWS.map((r, i) => (
              <div key={r.name}
                className={`reveal reveal-delay-${i + 1} w-72 flex-shrink-0 rounded-2xl border border-white/8 bg-white/4 p-6 transition-all hover:border-white/14 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:w-auto`}
                style={{ scrollSnapAlign: "start" }}>
                <Stars n={r.stars} />
                <blockquote className="mt-4 text-[13.5px] leading-relaxed text-white/75">
                  "{r.text}"
                </blockquote>
                <div className="mt-5 flex items-center gap-3">
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white ${r.color}`}>
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-white">{r.name}, {r.age}</p>
                    <p className="text-[11px] text-white/70">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          8. FOOTER CTA
      ══════════════════════════════════════════════════════════ */}
      <FooterCTA email={email} setEmail={setEmail} subDone={subDone} onSubmit={handleSubscribe} />
    </>
  );
}
