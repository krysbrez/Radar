import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getArticle, getArticlesByCategory } from "../data/articles";
import ArticleContent, { slugifyHeading } from "../components/ArticleContent";
import Mascot from "../components/Mascot";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function extractHeadings(body) {
  if (!body || typeof body !== "string") return [];
  return body
    .split("\n\n")
    .filter((b) => b.startsWith("**") && b.endsWith("**") && !b.slice(2, -2).includes("**"))
    .map((b) => b.replace(/\*\*/g, "").trim())
    .slice(0, 7);
}

const CATEGORY_HERO = {
  akcie:      { from: "#020b1a", to: "#061428", accent: "#3b82f6" },
  krypto:     { from: "#0d0810", to: "#180d20", accent: "#f97316" },
  forex:      { from: "#06030f", to: "#0d0a1a", accent: "#8b5cf6" },
  nemovitosti:{ from: "#020c06", to: "#051409", accent: "#10b981" },
  auta:       { from: "#120404", to: "#1e0606", accent: "#ef4444" },
  investovani:{ from: "#000613", to: "#001428", accent: "#ffd700" },
};

const CATEGORY_TAG_DARK = {
  "Investování": "border-yellow-400/30 bg-yellow-400/15 text-yellow-300",
  "Krypto":      "border-orange-400/30 bg-orange-400/15 text-orange-300",
  "Forex":       "border-violet-400/30 bg-violet-400/15 text-violet-300",
  "Nemovitosti": "border-emerald-400/30 bg-emerald-400/15 text-emerald-300",
  "Auta":        "border-red-400/30 bg-red-400/15 text-red-300",
  "Akcie":       "border-blue-400/30 bg-blue-400/15 text-blue-300",
};

const SIDEBAR_SIGNALS = {
  akcie:      [{ l:"S&P 500",value:"5 483",chg:"-0.8%",up:false},{l:"ČEZ",value:"900 Kč",chg:"+1.2%",up:true}],
  krypto:     [{ l:"BTC",value:"$70 241",chg:"+2.4%",up:true},{l:"ETH",value:"$3 810",chg:"+1.7%",up:true}],
  forex:      [{ l:"EUR/CZK",value:"25.18",chg:"+0.1%",up:true},{l:"USD/CZK",value:"23.42",chg:"-0.2%",up:false}],
  nemovitosti:[{ l:"Praha m²",value:"118 000 Kč",chg:"+2.3%",up:true},{l:"Výnos",value:"3.8 %",chg:"-0.2%",up:false}],
  auta:       [{ l:"BMW E30",value:"350 tis.",chg:"+15%",up:true},{l:"GTI Mk1",value:"280 tis.",chg:"+8%",up:true}],
  investovani:[{ l:"MSCI World",value:"3 420",chg:"+7.2%",up:true},{l:"Inflace CZ",value:"2.8 %",chg:"-0.4%",up:false}],
};

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? Math.min((scrolled / total) * 100, 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return pct;
}

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────

function ShareButtons({ title }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/50 mr-1">Sdílet:</span>
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs font-bold text-white/70 transition hover:border-white/20 hover:text-white">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.766l7.74-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        X / Twitter
      </a>
      <button onClick={copyLink}
        className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs font-bold text-white/70 transition hover:border-[#ffd700]/20 hover:text-[#ffd700]">
        {copied ? (
          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Zkopírováno!</>
        ) : (
          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Kopírovat odkaz</>
        )}
      </button>
    </div>
  );
}

function MiniNewsletterSidebar() {
  const [em, setEm] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div className="rounded-2xl border border-white/12/10 bg-[#000613] p-5">
      <div className="mb-1 flex items-center gap-2">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ffd700]" />
        <p className="font-headline text-[10px] font-black uppercase tracking-widest text-[#ffd700]">Newsletter</p>
      </div>
      <p className="font-headline mt-2 text-sm font-black leading-snug text-white">Každé pondělí v 8:00.</p>
      <p className="mt-1 text-xs leading-relaxed text-white/70">Signály, přehledy, analýzy. Zdarma.</p>
      {done ? (
        <p className="mt-3 text-xs font-black text-emerald-400">✓ Přihlášení úspěšné!</p>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); em && setDone(true); }} className="mt-3 flex flex-col gap-2">
          <input type="email" value={em} onChange={(e) => setEm(e.target.value)} required placeholder="tvuj@email.cz"
            className="w-full rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs text-white placeholder-white/25 outline-none focus:border-[#ffd700]/40" />
          <button type="submit" className="font-headline w-full rounded-full bg-[#ffd700] py-2 text-xs font-black text-[#000613] transition hover:bg-[#ffe234]">
            Odebírat zdarma
          </button>
        </form>
      )}
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const progress = useReadingProgress();
  const article = getArticle(id);

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6" style={{ background: "#000d1f" }}>
        <p className="mb-4 text-6xl">📡</p>
        <h1 className="font-headline mb-2 text-2xl font-black text-white">{t("article.not_found")}</h1>
        <p className="mb-6 text-white/50">{t("article.not_found_desc")}</p>
        <button onClick={() => navigate(-1)} className="font-headline rounded-full bg-[#ffd700] px-6 py-2.5 text-sm font-bold text-[#000613]">
          {t("article.back")}
        </button>
      </div>
    );
  }

  const related = getArticlesByCategory(article.category).filter((a) => a.id !== article.id).slice(0, 3);
  const headings = extractHeadings(article.body);
  const keyPoints = headings.slice(0, 3);
  const heroColors = CATEGORY_HERO[article.category] || CATEGORY_HERO.investovani;
  const tagDark = CATEGORY_TAG_DARK[article.tag] || "border-white/20 bg-white/10 text-white/80";
  const sidebarSignals = SIDEBAR_SIGNALS[article.category] || SIDEBAR_SIGNALS.investovani;
  const categoryLabel = t(`article.category_${article.category}`, { defaultValue: article.category });

  return (
    <div className="min-h-screen" style={{ background: "#000d1f" }}>
      {/* ── Reading progress bar ────────────────────────────────── */}
      <div className="fixed top-0 left-0 z-[100] h-[3px] w-full bg-outline-variant/10">
        <div className="h-full bg-[#ffd700] transition-[width] duration-100 ease-linear"
          style={{ width: `${progress}%` }} />
      </div>

      {/* ── HERO — dark ─────────────────────────────────────────── */}
      <header className="relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${heroColors.from} 0%, ${heroColors.to} 100%)` }}>
        {/* Grid texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(175,200,240,1) 1px, transparent 1px), linear-gradient(90deg, rgba(175,200,240,1) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        {/* Accent glow */}
        <div className="pointer-events-none absolute -top-20 right-1/4 h-72 w-72 rounded-full blur-[100px] opacity-15"
          style={{ background: heroColors.accent }} />

        <div className="relative z-10 mx-auto max-w-5xl px-6 py-14 md:px-8 md:py-20">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-xs text-white/50">
            <Link to="/" className="transition hover:text-white/70">Radar</Link>
            <span>›</span>
            <Link to={`/#${article.category}`} className="transition hover:text-white/70">{categoryLabel}</Link>
            <span>›</span>
            <span className="max-w-[220px] truncate text-white/50">{article.title}</span>
          </nav>

          {/* Tag + meta row */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className={`font-headline rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-widest ${tagDark}`}>
              {article.tag}
            </span>
            <span className="text-xs text-white/50">{article.date}</span>
            <span className="text-white/15">·</span>
            <span className="flex items-center gap-1 text-xs text-white/50">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {article.readTime}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-headline animate-fadeIn mb-6 text-4xl font-black leading-[1.06] tracking-tight text-white md:text-6xl lg:text-7xl" style={{ animationDelay: "0.05s" }}>
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="animate-fadeIn mb-10 max-w-2xl border-l-4 pl-5 text-xl leading-relaxed text-white/70" style={{ animationDelay: "0.15s", borderColor: heroColors.accent }}>
            {article.excerpt}
          </p>

          {/* Author + share */}
          <div className="animate-fadeIn flex flex-wrap items-center justify-between gap-4" style={{ animationDelay: "0.25s" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10">
                <Mascot size={32} mood="normal" variant="idle" trackMouse={false} />
              </div>
              <div>
                <p className="font-headline text-sm font-black text-white">{article.author || "Radar Editorial"}</p>
                <p className="text-[11px] text-white/50">{t("article.editorial", { defaultValue: "Radar redakce" })}</p>
              </div>
            </div>
            <ShareButtons title={article.title} />
          </div>
        </div>
      </header>

      {/* ── Hero image ──────────────────────────────────────────── */}
      {article.image && (
        <div className="relative h-64 w-full overflow-hidden md:h-96">
          <img src={article.image} alt={article.title} loading="lazy"
            className="h-full w-full object-cover" />
          {/* Gradient fade to page bg */}
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom, ${heroColors.to} 0%, transparent 30%, transparent 70%, #000d1f 100%)` }} />
        </div>
      )}

      {/* ── CONTENT + SIDEBAR ───────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 lg:grid lg:grid-cols-[1fr_300px] lg:gap-12 lg:py-14">

        {/* ── Main content ── */}
        <main className="min-w-0 animate-fadeIn" style={{ animationDelay: "0.1s" }}>

          {/* Key points box */}
          {keyPoints.length > 0 && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-[#ffd700]/30 bg-[#000613]">
              <div className="flex items-center gap-2 border-b border-white/8 px-5 py-3">
                <span className="h-2 w-2 rounded-full bg-[#ffd700]" />
                <p className="font-headline text-[11px] font-black uppercase tracking-[0.25em] text-[#ffd700]">Klíčové body</p>
              </div>
              <ul className="divide-y divide-white/5">
                {keyPoints.map((pt, i) => (
                  <li key={i}>
                    <a href={`#${slugifyHeading(pt)}`}
                      className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-white/5">
                      <span className="font-headline flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-black text-[#000613]"
                        style={{ background: "#ffd700" }}>{i + 1}</span>
                      <span className="text-sm text-white/85">{pt}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article body */}
          <div className="rounded-2xl border border-white/8 bg-white/4 p-6 md:p-10">
            <div className="max-w-none space-y-5 leading-relaxed">
              <ArticleContent body={article.body} />
            </div>

            {/* Why it matters */}
            <div className="mt-10 rounded-2xl border border-[#ffd700]/15 bg-[#ffd700]/5 p-6">
              <p className="font-headline mb-2 text-[11px] font-black uppercase tracking-widest text-[#ffd700]/70">{t("article.why_matters", { defaultValue: "Proč na tom záleží" })}</p>
              <p className="text-sm leading-relaxed text-white/90">{article.whyMatters || t("article.tip_desc")}</p>
            </div>

            {/* Tip / send us tip */}
            <div className="mt-4 rounded-2xl border border-white/8 bg-white/3 p-6">
              <p className="font-headline mb-2 text-[11px] font-black uppercase tracking-widest text-white/60">{t("article.tip_title", { defaultValue: "Máš tip pro Radar?" })}</p>
              <p className="text-sm leading-relaxed text-white/65">
                {t("article.tip_desc", { defaultValue: "Pošli nám zajímavý signal nebo korekci na " }).split("redakce@radar.cz")[0]}
                <a href="mailto:redakce@radar.cz" className="font-semibold text-[#ffd700]/70 underline underline-offset-2">redakce@radar.cz</a>
              </p>
            </div>
          </div>

          {/* Bottom share row */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/4 px-5 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="font-headline flex items-center gap-2 text-sm font-bold text-white/60 transition hover:text-white">
                ← {t("article.back", { defaultValue: "Zpět" })}
              </button>
              <span className="text-white/15">·</span>
              <Link to="/archiv" className="text-sm text-white/70 transition hover:text-white">Archiv →</Link>
            </div>
            <ShareButtons title={article.title} />
          </div>
        </main>

        {/* ── Sticky sidebar ── */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">

            {/* Table of contents */}
            {headings.length > 0 && (
              <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
                <p className="font-headline mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-white/50">Obsah článku</p>
                <nav className="space-y-1">
                  {headings.map((h, i) => (
                    <a key={i} href={`#${slugifyHeading(h)}`}
                      className="flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white">
                      <span className="font-headline mt-0.5 flex-shrink-0 text-[10px] font-black text-white/70">{String(i + 1).padStart(2, "0")}</span>
                      <span className="line-clamp-2 leading-snug">{h}</span>
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Radar sleduje */}
            <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                <p className="font-headline text-[11px] font-black uppercase tracking-[0.22em] text-white/50">Radar sleduje</p>
              </div>
              <div className="space-y-3">
                {sidebarSignals.map((s) => (
                  <div key={s.l} className="flex items-center justify-between rounded-xl border border-white/6 bg-white/4 px-3 py-2.5">
                    <span className="font-headline text-xs font-black text-white/70">{s.l}</span>
                    <div className="text-right">
                      <p className="font-mono text-sm font-black text-white">{s.value}</p>
                      <p className={`font-mono text-[11px] font-black ${s.up ? "text-emerald-400" : "text-red-400"}`}>
                        {s.up ? "▲" : "▼"} {s.chg}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to={`/${article.category}`}
                className="font-headline mt-4 flex items-center justify-center gap-1 rounded-full border border-white/12 py-2 text-xs font-bold text-white/70 transition hover:border-[#ffd700]/20 hover:text-[#ffd700]">
                Celá sekce →
              </Link>
            </div>

            {/* Mini newsletter */}
            <MiniNewsletterSidebar />
          </div>
        </aside>
      </div>

      {/* ── RELATED ARTICLES ────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-14 md:py-16" style={{ background: "linear-gradient(180deg, #000d1f 0%, #010c1c 100%)" }}>
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="font-headline mb-1 text-[11px] font-black uppercase tracking-[0.25em] text-white/70">Další čtení</p>
                <h2 className="font-headline text-2xl font-black text-white">Ze sekce {categoryLabel}</h2>
              </div>
              <Link to="/archiv" className="font-headline rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white/70 transition hover:border-[#ffd700]/20 hover:text-[#ffd700]">
                Archiv →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <Link key={a.id} to={`/clanek/${a.id}`}
                  className="group overflow-hidden rounded-2xl border border-white/8 bg-white/4 transition-all hover:-translate-y-1 hover:border-white/14 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                  {a.image && (
                    <div className="h-40 overflow-hidden">
                      <img src={a.image} alt={a.title} loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-5">
                    <span className={`font-headline inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider mb-3 ${a.tagColor || "bg-indigo-500/20 text-indigo-300"}`}>
                      {a.tag}
                    </span>
                    <h3 className="font-headline mb-2 text-base font-black leading-snug text-white transition group-hover:text-[#ffd700] line-clamp-2">{a.title}</h3>
                    <p className="text-sm leading-relaxed text-white/70 line-clamp-2">{a.excerpt}</p>
                    <div className="mt-4 flex items-center gap-2 text-[11px] text-white/50">
                      <span>{a.readTime}</span>
                      <span>·</span>
                      <span>{a.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NEWSLETTER CTA ──────────────────────────────────────── */}
      <NewsletterCTAEnd />
    </div>
  );
}

function NewsletterCTAEnd() {
  const [em, setEm] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#000613] py-20 md:py-28">
      <div className="pointer-events-none absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #ffd700, transparent)" }} />
      <div className="pointer-events-none absolute top-0 left-1/2 h-48 w-[500px] -translate-x-1/2 rounded-full blur-[80px] opacity-15"
        style={{ background: "radial-gradient(circle, #ffd700 0%, transparent 70%)" }} />

      <div className="relative mx-auto max-w-2xl px-6 text-center md:px-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#ffd700]/20 bg-[#ffd700]/8 px-4 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ffd700]" />
          <span className="font-headline text-[11px] font-black uppercase tracking-widest text-[#ffd700]">Newsletter</span>
        </div>
        <h2 className="font-headline mb-4 text-3xl font-black leading-tight text-white md:text-4xl">
          Každé pondělí.<br />
          <span className="text-shimmer-gold">Vše důležité. Nic zbytečného.</span>
        </h2>
        <p className="mb-8 text-base leading-relaxed text-white/70">
          Signály, přehledy a analýzy přímo do schránky. 47 238 čtenářů. Zdarma.
        </p>
        {done ? (
          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-8 py-5">
            <p className="text-lg font-black text-emerald-400">✓ Přihlášení úspěšné!</p>
            <p className="mt-1 text-sm text-white/70">Uvidíme se v pondělí v 8:00.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); em && setDone(true); }} className="flex flex-col gap-3 sm:flex-row">
            <input type="email" value={em} onChange={(e) => setEm(e.target.value)} required placeholder="tvuj@email.cz"
              className="flex-1 rounded-full border border-white/10 bg-white/8 px-6 py-4 text-base text-white placeholder-white/25 outline-none transition focus:border-[#ffd700]/40 focus:bg-white/12" />
            <button type="submit"
              className="font-headline flex-shrink-0 rounded-full bg-[#ffd700] px-8 py-4 text-sm font-black text-[#000613] transition hover:bg-[#ffe234] hover:shadow-[0_0_40px_rgba(255,215,0,0.3)]">
              Odebírat zdarma
            </button>
          </form>
        )}
        <p className="mt-4 text-xs text-white/50">Odhlásit se jedním klikem. Žádný spam.</p>
      </div>
    </section>
  );
}
