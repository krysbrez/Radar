import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Mascot from "../components/Mascot";
import { ARTICLES } from "../data/articles";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const SIGNALS = [
  {
    id: "s1",
    icon: "🏠",
    category: "Reality",
    categoryColor: "bg-emerald-500/15 text-emerald-400",
    title: "2+kk Praha pod 5.8M — Sreality",
    note: "Nabídka pod tržní cenou se ztenčuje. Nájmy dál rostou.",
    value: "pod 5.8M",
    change: "−14 nových",
    up: false,
    date: "3. 4. 2026",
  },
  {
    id: "s2",
    icon: "🚗",
    category: "Auta",
    categoryColor: "bg-orange-500/15 text-orange-400",
    title: "BMW E46 M3 do 900k — Sauto",
    note: "Čisté kusy bez přelakování mizí rychleji než před rokem.",
    value: "do 900 000 Kč",
    change: "+8% cena",
    up: true,
    date: "1. 4. 2026",
  },
  {
    id: "s3",
    icon: "₿",
    category: "Krypto",
    categoryColor: "bg-orange-400/15 text-orange-300",
    title: "BTC překonal $72 000",
    note: "Post-halving rally pokračuje. Historický vzor naznačuje další pohyb.",
    value: "$72 400",
    change: "+2.4%",
    up: true,
    date: "4. 4. 2026",
  },
  {
    id: "s4",
    icon: "📈",
    category: "Akcie",
    categoryColor: "bg-sky-500/15 text-sky-400",
    title: "S&P 500 korekce −6%",
    note: "Technická korekce po 6% poklesu. Historicky dobrý vstupní bod.",
    value: "5 483",
    change: "−6%",
    up: false,
    date: "2. 4. 2026",
  },
];

const ALERTS = [
  {
    id: "a1",
    icon: "🔔",
    title: "BMW E46 M3 do 150 000 Kč",
    status: "active",
    category: "Auta",
    date: "Spuštěno 1. 3. 2026",
  },
  {
    id: "a2",
    icon: "🔔",
    title: "Byt 2+1 Brno pod 4M",
    status: "active",
    category: "Reality",
    date: "Spuštěno 15. 3. 2026",
  },
  {
    id: "a3",
    icon: "🔔",
    title: "BTC pod $65 000",
    status: "done",
    category: "Krypto",
    date: "Splněno 28. 3. 2026",
  },
];

const PORTFOLIO = [
  { ticker: "AAPL", count: 5, buyPrice: 168.5, currentPrice: 172.0 },
  { ticker: "BTC", count: 0.15, buyPrice: 62000, currentPrice: 70241 },
  { ticker: "VOO", count: 10, buyPrice: 445.0, currentPrice: 461.8 },
];

const RECOMMENDED = ARTICLES.filter(
  (a) => ["nemovitosti", "krypto", "auta"].includes(a.category)
).slice(0, 3);

const ONBOARDING_STEPS = [
  { label: "Odebírat newsletter", done: true, href: "/newsletter" },
  { label: "Nastavit první alert", done: false, href: "/hlidac" },
  { label: "Přidat ticker do portfolia", done: false, href: "/muj-radar" },
];

// ─── SIGNAL LEVEL ─────────────────────────────────────────────────────────────

const LEVELS = [
  { id: "observer", label: "Observer",  desc: "Teprve začínáš sledovat trh",          min: 0,    max: 99,   color: "text-white/60",   barFrom: "from-white/20",   barTo: "to-white/30",   ring: "border-white/20"             },
  { id: "tracker",  label: "Tracker",   desc: "Aktivně sleduješ signály a příležitosti", min: 100, max: 249, color: "text-sky-300",    barFrom: "from-sky-400",    barTo: "to-sky-300",    ring: "border-sky-400/40"           },
  { id: "analyst",  label: "Analyst",   desc: "Čteš vzory dřív, než je vidí ostatní", min: 250,  max: 499,  color: "text-violet-300", barFrom: "from-violet-500", barTo: "to-violet-300", ring: "border-violet-400/40"        },
  { id: "insider",  label: "Insider",   desc: "Vidíš pohyb, když trh ještě spí",      min: 500,  max: 999,  color: "text-[#ffd700]",  barFrom: "from-[#ffd700]",  barTo: "to-[#ffe97a]",  ring: "border-[#ffd700]/40"         },
  { id: "radar",    label: "Radar Pro", desc: "Radar tě potřebuje víc než ty jej",    min: 1000, max: 9999, color: "text-[#ffd700]",  barFrom: "from-[#ffd700]",  barTo: "to-[#ffe97a]",  ring: "border-[#ffd700]/60"         },
];

const SIGNAL_ACTIONS = [
  { id: "newsletter",  label: "Odebírat Radar newsletter",  desc: "Souhrn každé pondělí ráno",   pts: 30, icon: "📡", done: true  },
  { id: "first_alert", label: "Nastavit cenový alert",      desc: "Trh hlídá za tebe",           pts: 20, icon: "🔔", done: false },
  { id: "read_3",      label: "Přečíst 3 analýzy",          desc: "Z alespoň 2 různých kategorií", pts: 25, icon: "📖", done: false },
  { id: "portfolio",   label: "Přidat pozici do portfolia", desc: "Sleduj svůj reálný P/L",      pts: 20, icon: "📊", done: false },
  { id: "weekly",      label: "Otevřít týdenní brief",      desc: "Každé pondělí nový souhrn",   pts: 15, icon: "📋", done: false },
];

function getCurrentLevel(score) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].min) return { level: LEVELS[i], idx: i };
  }
  return { level: LEVELS[0], idx: 0 };
}

function useSignalLevel() {
  const [score, setScore] = useState(() => {
    const v = localStorage.getItem("radar_score");
    return v ? parseInt(v, 10) : 30; // start at 30 (newsletter done)
  });
  function trackAction(actionId, pts) {
    const key = `radar_action_${actionId}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
    const next = score + pts;
    localStorage.setItem("radar_score", String(next));
    setScore(next);
  }
  return { score, trackAction };
}

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in-view");
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (now) => {
            const p = Math.min((now - t0) / duration, 1);
            const e = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(e * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  return [count, ref];
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function plCompute(item) {
  const cost = item.count * item.buyPrice;
  const current = item.count * item.currentPrice;
  const diff = current - cost;
  const pct = ((diff / cost) * 100).toFixed(1);
  return { cost, current, diff, pct };
}

function fmtCzk(n) {
  if (n > 1000) return `${(n / 1000).toFixed(1)}K Kč`;
  return `${n.toLocaleString("cs")} Kč`;
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function MujRadarPage() {
  useScrollReveal();

  const [alertCount] = useCountUp(3, 1200);
  const [signalCount] = useCountUp(12, 1400);
  const alertRef = useRef(null);
  const signalRef = useRef(null);
  const { score, trackAction } = useSignalLevel();

  // Onboarding dismiss from localStorage
  const [onboardingDismissed, setOnboardingDismissed] = useState(
    () => localStorage.getItem("radar_onboarding_dismissed") === "1"
  );
  function dismissOnboarding() {
    localStorage.setItem("radar_onboarding_dismissed", "1");
    setOnboardingDismissed(true);
  }

  const { level: currentLevel, idx: levelIdx } = getCurrentLevel(score);
  const nextLevel = LEVELS[levelIdx + 1] || currentLevel;
  const levelProgress = levelIdx < LEVELS.length - 1
    ? Math.round(((score - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100)
    : 100;

  const onboardingDone = ONBOARDING_STEPS.filter((s) => s.done).length;
  const portfolioTotal = PORTFOLIO.reduce((acc, item) => {
    const { current } = plCompute(item);
    return acc + current;
  }, 0);
  const portfolioCost = PORTFOLIO.reduce((acc, item) => {
    const { cost } = plCompute(item);
    return acc + cost;
  }, 0);
  const portfolioDiff = portfolioTotal - portfolioCost;
  const portfolioUp = portfolioDiff >= 0;

  return (
    <div className="min-h-screen" style={{ background: "#000d1f" }}>

      {/* ══════════════════════════════════════════════════════════
          DARK HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#000613] pb-16 pt-20 md:pb-24 md:pt-28">

        {/* BG glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-15 blur-[120px]"
            style={{ background: "radial-gradient(circle, #001f3f 0%, transparent 70%)" }} />
          <div className="absolute top-1/3 right-1/4 h-48 w-48 rounded-full opacity-10 blur-[80px]"
            style={{ background: "radial-gradient(circle, #ffd700 0%, transparent 70%)" }} />
          <div className="absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: "linear-gradient(rgba(175,200,240,1) 1px, transparent 1px), linear-gradient(90deg, rgba(175,200,240,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid items-center gap-12 md:grid-cols-[1fr_auto]">

            {/* Left */}
            <div>
              {/* Signal Level chip */}
              <div className="animate-fadeInUp mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#ffd700]/30 bg-[#ffd700]/8 px-4 py-2 backdrop-blur-sm"
                style={{ animationDelay: "0s" }}>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ffd700]" />
                <span className="font-headline text-[11px] font-black uppercase tracking-widest text-[#ffd700]/70">Signal Level</span>
                <span className="h-3 w-px bg-[#ffd700]/20" />
                <span className={`font-headline text-[11px] font-black uppercase tracking-widest ${currentLevel.color}`}>
                  {currentLevel.label}
                </span>
              </div>

              <h1 className="font-headline animate-fadeInUp text-5xl font-black leading-[1.04] tracking-tight text-white md:text-[4.5rem]"
                style={{ animationDelay: "0.1s" }}>
                Tvůj Radar.
              </h1>
              <p className="animate-fadeInUp mt-4 max-w-lg text-lg leading-relaxed text-[#afc8f0]/75"
                style={{ animationDelay: "0.22s" }}>
                Signály, alerty a přehled na jednom místě.
              </p>

              {/* Stats row */}
              <div className="animate-fadeInUp mt-8 grid grid-cols-3 gap-3 sm:gap-5"
                style={{ animationDelay: "0.38s" }}>
                {[
                  { label: "Aktivní alerty", value: alertCount, suffix: "", ref: alertRef },
                  { label: "Uložené signály", value: signalCount, suffix: "", ref: signalRef },
                  { label: "Člen od", value: "dubna 2026", suffix: "", isText: true },
                ].map((stat, i) => (
                  <div key={i} ref={stat.ref}
                    className="rounded-2xl border border-white/8 bg-white/5 px-4 py-4 backdrop-blur-sm">
                    <p className="font-headline text-2xl font-black text-white md:text-3xl">
                      {stat.isText ? stat.value : stat.value}
                    </p>
                    <p className="mt-1 text-xs text-white/50">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mascot 1 */}
            <div className="animate-fadeInUp hidden md:block" style={{ animationDelay: "0.3s" }}>
              <div className="relative flex h-56 w-56 items-center justify-center">
                <div className="absolute inset-0 rounded-full opacity-20 blur-2xl"
                  style={{ background: "radial-gradient(circle, rgba(255,215,0,0.5) 0%, transparent 70%)" }} />
                <div className="gold-ring" />
                <div className="gold-ring gold-ring-2" />
                <div className="animate-floatY relative z-10">
                  <Mascot size={160} mood="signal" variant="signal" trackMouse={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ONBOARDING BANNER
      ══════════════════════════════════════════════════════════ */}
      {!onboardingDismissed && (
        <div className="border-b border-white/6 px-6 py-4 md:px-8" style={{ background: "#000d1f" }}>
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 rounded-2xl border border-[#ffd700]/20 bg-[#ffd700]/5 px-5 py-5 sm:flex-row sm:items-center">
              <div className="flex-1">
                <p className="font-headline mb-3 text-sm font-black text-white">
                  Vítej v Radaru! 3 kroky k prvnímu signálu:
                </p>
                <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-[#ffd700] transition-all duration-700"
                    style={{ width: `${(onboardingDone / ONBOARDING_STEPS.length) * 100}%` }} />
                </div>
                <p className="mb-3 text-[11px] text-white/50">{onboardingDone}/{ONBOARDING_STEPS.length} dokončeno</p>
                <div className="flex flex-wrap gap-3">
                  {ONBOARDING_STEPS.map((step) => (
                    <Link key={step.label} to={step.href}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all hover:-translate-y-0.5 ${
                        step.done
                          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                          : "border-white/12 bg-white/5 text-white/70 hover:border-[#ffd700]/20 hover:text-[#ffd700]"
                      }`}>
                      <span>{step.done ? "✓" : "○"}</span>
                      {step.label}
                    </Link>
                  ))}
                </div>
              </div>
              <button onClick={dismissOnboarding}
                className="flex-shrink-0 rounded-full border border-white/12 px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-white/20 hover:text-white/70">
                Zavřít
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* ── LEFT COLUMN ── */}
          <div className="order-2 space-y-8 lg:order-1">

            {/* ULOŽENÉ SIGNÁLY */}
            <div className="reveal rounded-3xl border border-white/8 bg-white/4">
              <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
                <div>
                  <p className="font-headline text-[11px] font-black uppercase tracking-[0.22em] text-white/70">Uložené signály</p>
                  <h2 className="font-headline mt-1 text-xl font-black tracking-tight text-white">Sledované příležitosti</h2>
                </div>
                <button className="font-headline flex items-center gap-1.5 rounded-full bg-[#ffd700] px-4 py-2 text-xs font-black text-[#000613] transition-all hover:bg-[#ffe234] hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                  + Přidat signál
                </button>
              </div>

              <div className="divide-y divide-white/6">
                {SIGNALS.map((sig) => (
                  <div key={sig.id}
                    className="group flex items-start gap-4 px-6 py-5 transition-colors hover:bg-white/4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-lg">
                      {sig.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`font-headline rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${sig.categoryColor}`}>
                          {sig.category}
                        </span>
                        <span className="text-xs text-white/50">{sig.date}</span>
                      </div>
                      <p className="font-headline text-sm font-black text-white">{sig.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-white/65">{sig.note}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-mono text-sm font-black text-white">{sig.value}</p>
                      <p className={`font-mono text-xs font-black ${sig.up ? "text-emerald-400" : "text-red-400"}`}>
                        {sig.up ? "▲" : "▼"} {sig.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/6 px-6 py-4 text-center">
                <p className="text-xs text-white/65">Přidej vlastní signály pro sledování trhů, které tě zajímají.</p>
              </div>
            </div>

            {/* PORTFOLIO SNAPSHOT */}
            <div className="reveal reveal-delay-1 rounded-3xl border border-white/8 bg-white/4">
              <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
                <div>
                  <p className="font-headline text-[11px] font-black uppercase tracking-[0.22em] text-white/70">Portfolio Snapshot</p>
                  <h2 className="font-headline mt-1 text-xl font-black tracking-tight text-white">Orientační přehled</h2>
                </div>
                <div className="text-right">
                  <p className={`font-headline text-lg font-black ${portfolioUp ? "text-emerald-400" : "text-red-400"}`}>
                    {portfolioUp ? "+" : "−"} {Math.abs(portfolioDiff).toLocaleString("cs", { maximumFractionDigits: 0 })} Kč
                  </p>
                  <p className="text-xs text-white/50">celkový P/L</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8 bg-white/4">
                      {["Ticker", "Počet", "Nák. cena", "Akt. cena", "P/L"].map((h) => (
                        <th key={h} className="font-headline px-5 py-3 text-left text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PORTFOLIO.map((item) => {
                      const { diff, pct } = plCompute(item);
                      const up = diff >= 0;
                      return (
                        <tr key={item.ticker} className="border-b border-white/5 hover:bg-white/4 transition-colors">
                          <td className="font-headline px-5 py-3.5 font-black text-white">{item.ticker}</td>
                          <td className="px-5 py-3.5 text-white/75">{item.count}</td>
                          <td className="font-mono px-5 py-3.5 text-white/75">{item.buyPrice.toLocaleString("cs")}</td>
                          <td className="font-mono px-5 py-3.5 text-white/75">{item.currentPrice.toLocaleString("cs")}</td>
                          <td className={`font-mono px-5 py-3.5 font-black ${up ? "text-emerald-400" : "text-red-400"}`}>
                            {up ? "+" : ""}{pct}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-white/4">
                      <td colSpan={3} className="px-5 py-3 text-xs text-white/50">Celková hodnota portfolia</td>
                      <td colSpan={2} className={`font-headline px-5 py-3 font-black text-base ${portfolioUp ? "text-emerald-400" : "text-red-400"}`}>
                        {portfolioTotal.toLocaleString("cs", { maximumFractionDigits: 0 })} Kč
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-white/8 px-6 py-4">
                <p className="text-xs italic text-white/70">Data jsou orientační. Radar není broker ani investiční poradce.</p>
                <button className="font-headline rounded-full border border-white/12 px-4 py-2 text-xs font-bold text-white/70 transition hover:border-[#ffd700]/20 hover:text-[#ffd700]">
                  Upravit portfolio →
                </button>
              </div>
            </div>

            {/* DOPORUČENO */}
            <div className="reveal reveal-delay-2">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="font-headline text-[11px] font-black uppercase tracking-[0.22em] text-white/70">Doporučeno pro tebe</p>
                  <h2 className="font-headline mt-1 text-xl font-black tracking-tight text-white">Na základě tvých zájmů</h2>
                </div>
                <Link to="/archiv"
                  className="font-headline rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/70 transition hover:border-[#ffd700]/20 hover:text-[#ffd700]">
                  Všechny →
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {RECOMMENDED.map((article) => (
                  <Link key={article.id} to={`/clanek/${article.id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/4 transition-all duration-300 hover:-translate-y-1 hover:border-white/14 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                    {article.image && (
                      <div className="h-36 overflow-hidden">
                        <img src={article.image} alt={article.title} loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-4">
                      <span className={`font-headline mb-3 self-start rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${article.tagColor || "bg-indigo-500/20 text-indigo-300"}`}>
                        {article.tag}
                      </span>
                      <h3 className="font-headline flex-1 text-sm font-black leading-snug text-white line-clamp-3 transition-colors group-hover:text-[#ffd700]">
                        {article.title}
                      </h3>
                      <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-3">
                        <span className="font-headline text-xs font-bold text-[#ffd700]/70">Číst →</span>
                        <span className="text-[11px] text-white/50">{article.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="order-1 space-y-6 lg:order-2">

            {/* SIGNAL LEVEL */}
            <div className={`reveal overflow-hidden rounded-3xl border bg-[#000c1e] ${currentLevel.ring}`}>

              {/* ── Header: identity + score ── */}
              <div className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #000613 0%, #001228 100%)" }}>
                <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  style={{ backgroundImage: "linear-gradient(rgba(175,200,240,1) 1px, transparent 1px), linear-gradient(90deg, rgba(175,200,240,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                {levelIdx >= 1 && (
                  <div className="pointer-events-none absolute -top-10 right-4 h-32 w-32 rounded-full blur-2xl"
                    style={{ opacity: 0.18, background: levelIdx >= 3 ? "radial-gradient(circle,#ffd700,transparent)" : levelIdx >= 2 ? "radial-gradient(circle,#a78bfa,transparent)" : "radial-gradient(circle,#38bdf8,transparent)" }} />
                )}

                <div className="relative px-5 pb-5 pt-5">
                  {/* Overline */}
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ffd700]" />
                    <p className="font-headline text-[10px] font-black uppercase tracking-[0.28em] text-[#ffd700]/65">Signal Level</p>
                  </div>

                  {/* Level name ↔ score */}
                  <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <p className={`font-headline text-[2rem] font-black leading-none tracking-tight ${currentLevel.color}`}>
                        {currentLevel.label}
                      </p>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-white/65">{currentLevel.desc}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-headline text-2xl font-black text-white">{score}</p>
                      <p className="text-[10px] font-semibold text-white/50">bodů celkem</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5">
                    <div className="relative h-2 overflow-hidden rounded-full bg-white/8">
                      <div className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r transition-all duration-1000 ${currentLevel.barFrom} ${currentLevel.barTo}`}
                        style={{ width: `${levelProgress}%` }} />
                    </div>
                    {levelIdx < LEVELS.length - 1 ? (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-white/45">
                          {score - currentLevel.min} / {nextLevel.min - currentLevel.min} bodů
                        </span>
                        <span className={`text-[10px] font-semibold ${(nextLevel.min - score) <= 30 ? "text-[#ffd700]" : "text-white/60"}`}>
                          {nextLevel.min - score} bodů → {nextLevel.label}
                        </span>
                      </div>
                    ) : (
                      <p className="mt-2 text-[11px] font-semibold text-[#ffd700]/75">★ Nejvyšší úroveň dosažena</p>
                    )}
                  </div>

                  {/* Near-level callout */}
                  {levelIdx < LEVELS.length - 1 && (nextLevel.min - score) <= 30 && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#ffd700]/25 bg-[#ffd700]/8 px-3 py-2.5">
                      <span className="text-sm">⚡</span>
                      <p className="text-[11px] font-semibold text-[#ffd700]/90">
                        Jen <strong className="font-black">{nextLevel.min - score} bodů</strong> do {nextLevel.label}
                      </p>
                    </div>
                  )}

                  {/* Level path */}
                  <div className="mt-4">
                    <div className="flex items-center gap-1.5">
                      {LEVELS.map((lv, i) => (
                        <div key={lv.id} className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                          i < levelIdx ? `bg-gradient-to-r ${lv.barFrom} ${lv.barTo} opacity-55`
                          : i === levelIdx ? `bg-gradient-to-r ${lv.barFrom} ${lv.barTo}`
                          : "bg-white/8"
                        }`} />
                      ))}
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      {LEVELS.map((lv, i) => (
                        <span key={lv.id} className={`text-[9px] font-black uppercase tracking-wide ${
                          i === levelIdx ? lv.color : i < levelIdx ? "text-white/40" : "text-white/20"
                        }`}>{lv.id === "radar" ? "Pro" : lv.label}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Missions ── */}
              <div className="px-5 pb-5 pt-4">
                {(() => {
                  const completedCount = SIGNAL_ACTIONS.filter(a => a.done || localStorage.getItem(`radar_action_${a.id}`)).length;
                  const allDone = completedCount === SIGNAL_ACTIONS.length;
                  const remaining = SIGNAL_ACTIONS.filter(a => !a.done && !localStorage.getItem(`radar_action_${a.id}`));
                  const remainingPts = remaining.reduce((s, a) => s + a.pts, 0);
                  return (
                    <>
                      <div className="mb-3 flex items-center justify-between">
                        <p className="font-headline text-[10px] font-black uppercase tracking-[0.25em] text-white/60">Mise</p>
                        <span className={`font-headline rounded-full px-2 py-0.5 text-[10px] font-black ${
                          allDone ? "bg-emerald-500/15 text-emerald-400" : "bg-white/6 text-white/55"
                        }`}>
                          {completedCount} / {SIGNAL_ACTIONS.length}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {SIGNAL_ACTIONS.map((action) => {
                          const completed = action.done || !!localStorage.getItem(`radar_action_${action.id}`);
                          return (
                            <div key={action.id}
                              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                                completed
                                  ? "border border-emerald-500/15 bg-emerald-500/5"
                                  : "border border-white/7 bg-white/3 hover:border-white/12 hover:bg-white/5"
                              }`}>
                              {/* Status circle */}
                              <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-black transition-all ${
                                completed
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "border border-white/15 text-transparent"
                              }`}>
                                {completed ? "✓" : ""}
                              </div>
                              {/* Text */}
                              <div className="min-w-0 flex-1">
                                <p className={`text-[12px] font-semibold leading-snug ${
                                  completed ? "text-white/50 line-through decoration-white/25" : "text-white/88"
                                }`}>
                                  {action.label}
                                </p>
                                {!completed && (
                                  <p className="mt-0.5 text-[10px] text-white/50">{action.desc}</p>
                                )}
                              </div>
                              {/* Points */}
                              <span className={`flex-shrink-0 font-headline rounded-full px-2 py-0.5 text-[10px] font-black ${
                                completed
                                  ? "bg-emerald-500/12 text-emerald-400/80"
                                  : "bg-white/7 text-white/55 group-hover:text-white/80"
                              }`}>
                                +{action.pts}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer */}
                      <div className={`mt-4 rounded-xl px-4 py-3 ${
                        allDone
                          ? "border border-emerald-500/15 bg-emerald-500/5"
                          : "border border-white/6 bg-white/3"
                      }`}>
                        <p className={`text-[11px] leading-relaxed ${allDone ? "text-emerald-300/80" : "text-white/65"}`}>
                          {allDone
                            ? "Všechny mise splněny. Nové aktivity přibydou každý týden."
                            : levelIdx < LEVELS.length - 1
                              ? `${remaining.length} ${remaining.length === 1 ? "mise zbývá" : "mise zbývají"} — dalších ${remainingPts} bodů → blíže k ${nextLevel.label}.`
                              : "Pokračuj ve sledování signálů a čtení analýz."
                          }
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* AKTIVNÍ ALERTY */}
            <div className="reveal rounded-3xl border border-white/8 bg-white/4">
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-5">
                <div>
                  <p className="font-headline text-[11px] font-black uppercase tracking-[0.22em] text-white/70">Aktivní alerty</p>
                  <h2 className="font-headline mt-1 text-lg font-black tracking-tight text-white">Hlídači trhu</h2>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  <span className="font-headline text-[10px] font-black text-emerald-400">2 aktivní</span>
                </div>
              </div>

              <div className="divide-y divide-white/6 px-2 py-1">
                {ALERTS.map((alert) => {
                  const isActive = alert.status === "active";
                  return (
                    <div key={alert.id} className="flex items-start gap-3 px-3 py-4">
                      <div className="mt-0.5 flex-shrink-0">
                        {isActive ? (
                          <span className="relative flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                          </span>
                        ) : (
                          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-white/10 text-[8px] text-emerald-400">✓</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-headline text-sm font-black text-white leading-snug">{alert.title}</p>
                        <p className="mt-0.5 text-[11px] text-white/50">{alert.date}</p>
                      </div>
                      <span className={`flex-shrink-0 font-headline rounded-full px-2 py-0.5 text-[10px] font-black ${
                        isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-white/8 text-white/50"
                      }`}>
                        {isActive ? "Aktivní" : "Splněno"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-white/8 px-5 py-4">
                <Link to="/hlidac"
                  className="font-headline flex items-center justify-center gap-2 rounded-xl border border-white/12 py-2.5 text-sm font-bold text-white/70 transition-all hover:border-[#ffd700]/20 hover:text-[#ffd700]">
                  Spravovat alerty →
                </Link>
              </div>
            </div>

            {/* TÝDENNÍ BRIEF */}
            <div className="reveal reveal-delay-1 overflow-hidden rounded-3xl border border-white/8">
              <div className="relative overflow-hidden px-5 py-6" style={{ background: "linear-gradient(135deg, #000d1f 0%, #001020 100%)" }}>
                <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
                  style={{ backgroundImage: "linear-gradient(rgba(175,200,240,1) 1px, transparent 1px), linear-gradient(90deg, rgba(175,200,240,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="relative">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    <span className="font-headline text-[10px] font-black uppercase tracking-widest text-emerald-400">Aktuální brief</span>
                  </div>
                  <p className="font-headline text-[11px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">7. 4. 2026</p>
                  <h3 className="font-headline text-lg font-black leading-snug text-white">
                    Trhů se dotkl závan nejistoty. Ale Radar ví, co sledovat.
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    S&P 500 zkorigoval o 6 %, BTC překonal $72k a pražský trh bytů zůstává pod tlakem.
                  </p>
                </div>
              </div>
              <div className="border-t border-white/8 bg-white/3 px-5 py-4">
                <Link to="/clanek/etf-vs-fondy"
                  className="font-headline flex w-full items-center justify-center gap-2 rounded-xl bg-[#ffd700] py-3 text-sm font-black text-[#000613] transition-all hover:bg-[#ffe234]">
                  Číst tento týden →
                </Link>
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#ffd700]/12 bg-[#ffd700]/5 px-3 py-2.5">
                  <span className="text-sm">⏰</span>
                  <p className="text-xs text-white/70">
                    <span className="font-black text-white">Příští brief:</span> pondělí 14. 4. v 8:00
                  </p>
                </div>
              </div>
            </div>

            {/* MASCOT */}
            <div className="reveal reveal-delay-2 flex items-center gap-4 rounded-3xl border border-[#ffd700]/15 bg-[#ffd700]/5 px-5 py-5">
              <Mascot size={56} mood="happy" variant="idle" trackMouse={false} />
              <div>
                <p className="font-headline text-sm font-black text-white">Radar tě má v oku.</p>
                <p className="mt-1 text-xs leading-relaxed text-white/70">
                  2 alerty aktivní, 4 signály uloženy. Jdeš správně.
                </p>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className="reveal reveal-delay-3 rounded-3xl border border-white/8 bg-white/4 p-5">
              <p className="font-headline mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-white/70">Rychlé odkazy</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Akcie", href: "/akcie", icon: "📊" },
                  { label: "Krypto", href: "/krypto", icon: "₿" },
                  { label: "Reality", href: "/nemovitosti", icon: "🏠" },
                  { label: "Auta", href: "/auta", icon: "🚗" },
                  { label: "Hlídač", href: "/hlidac", icon: "🔔" },
                  { label: "Archiv", href: "/archiv", icon: "📰" },
                ].map((l) => (
                  <Link key={l.href} to={l.href}
                    className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/4 px-3 py-2.5 text-sm font-semibold text-white/70 transition-all hover:border-white/14 hover:text-white">
                    <span>{l.icon}</span>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
