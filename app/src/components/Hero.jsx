import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "./Mascot";
import SignalCard from "./SignalCard";

export default function Hero() {
  const { t } = useTranslation();
  const [rotIdx, setRotIdx] = useState(0);
  const HERO_PERKS = [
    t("newsletter.perk_monday"),
    t("newsletter.perk_nospam"),
    t("newsletter.perk_free"),
  ];

  const ROTATING = [
    t("hero.rotating_1"),
    t("hero.rotating_2"),
    t("hero.rotating_3"),
  ];

  useEffect(() => {
    const timer = setInterval(() => setRotIdx((i) => (i + 1) % ROTATING.length), 5000);
    return () => clearInterval(timer);
  }, [ROTATING.length]);

  return (
    <header id="investovani" className="max-w-7xl mx-auto px-6 md:px-8 pt-6 pb-10">
      <div className="relative overflow-hidden rounded-[2.2rem] border border-primary/10 bg-[linear-gradient(135deg,#091525_0%,#0f2238_46%,#132d47_100%)] px-6 py-7 shadow-[0_28px_90px_rgba(6,14,28,0.22)] md:px-8 md:py-8 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(92,146,255,0.22),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(242,99,87,0.16),transparent_26%),radial-gradient(circle_at_78%_72%,rgba(255,255,255,0.06),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.9)_1px,transparent_1px)] bg-[size:38px_38px]" />
        <div className="pointer-events-none absolute right-[-3rem] top-[-2rem] hidden h-40 w-40 rounded-full border border-white/10 bg-white/[0.04] blur-sm lg:block" />

        <div className="relative grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="order-1 flex flex-col items-start justify-center lg:col-span-7">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-headline text-xs font-black uppercase tracking-widest text-white-fixed-dim">
                {t("hero.live_badge")}
              </span>
            </div>

            <div className="mb-3 h-14 overflow-hidden md:h-16">
              <p key={rotIdx} className="animate-fadeIn font-headline text-2xl font-black leading-tight tracking-tight text-white md:text-3xl">
                {ROTATING[rotIdx]}
              </p>
            </div>

            <h1 className="mb-5 max-w-4xl font-headline text-[3.25rem] font-black leading-[0.92] tracking-tighter text-white md:text-[4.2rem] lg:text-[5.2rem]">
              {t("hero.title_bored")}{" "}
              <span className="text-sky-300">{t("hero.title_bored_accent")}</span>
              <br />
              {t("hero.title_us")}{" "}
              <span className="text-emerald-300">{t("hero.title_us_accent")}</span>
            </h1>

            <p className="mb-7 max-w-2xl text-lg leading-relaxed text-white-fixed-dim md:text-[1.15rem]">
              {t("hero.subtitle")}
            </p>

            <div className="mb-6 rounded-[1.65rem] border border-white/10 bg-white/[0.07] px-5 py-4 shadow-[0_12px_36px_rgba(8,17,32,0.18)] backdrop-blur-sm">
              <p className="font-headline text-xl font-black tracking-tight text-white">
                Kdo má čas projíždět pět webů denně?
              </p>
              <p className="mt-1 text-sm leading-relaxed text-white-fixed-dim">
                Radar ti pošle jen to důležité. Přehled, signály a kontext v jedné klidné vrstvě.
              </p>
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-4">
              <Link
                to="/#newsletter"
                className="rounded-full bg-white px-8 py-3.5 font-headline text-sm font-black tracking-tight text-white shadow-[0_14px_40px_rgba(255,255,255,0.15)] transition-all hover:bg-white/8"
              >
                {t("hero.cta_newsletter")}
              </Link>
              <Link
                to="/hlidac"
                className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-6 py-3.5 font-headline text-sm font-bold text-white transition-all hover:bg-white/[0.1]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                  <line x1="6" y1="1" x2="6" y2="4" />
                  <line x1="10" y1="1" x2="10" y2="4" />
                  <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
                {t("hero.cta_prices")}
              </Link>
            </div>

            <div className="mb-8 flex flex-wrap gap-x-3 gap-y-1.5">
              {HERO_PERKS.map((perk) => (
                <div key={perk} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  <span className="text-xs font-medium text-white-fixed-dim">{perk}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&q=80",
                ].map((src, i) => (
                  <img key={i} src={src} alt="" className="h-8 w-8 rounded-full border-2 border-[#132d47] object-cover" />
                ))}
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#132d47] bg-white/10">
                  <span className="text-[9px] font-black text-white">+47k</span>
                </div>
              </div>
              <div>
                <p className="font-headline text-sm font-black text-white">{t("hero.readers_count")}</p>
                <div className="mt-0.5 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-xs text-yellow-300">★</span>
                  ))}
                  <span className="ml-1 text-xs text-white-fixed-dim">4.9/5</span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-2 lg:col-span-5">
            <div className="relative rounded-[1.9rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.05))] p-4 shadow-[0_20px_60px_rgba(0,8,24,0.24)] backdrop-blur-sm md:p-5">
              <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-white/12 bg-black/22 px-4 py-3">
                <div>
                  <p className="font-headline text-[11px] font-black uppercase tracking-[0.2em] text-white/70">
                    Produktová vrstva
                  </p>
                  <p className="mt-1 font-headline text-lg font-black text-white">
                    Signály, brief a přehled v jedné ploše
                  </p>
                </div>
                <div className="hidden rounded-2xl bg-white/[0.06] p-2 md:flex">
                  <Mascot size={52} mood="happy" variant="signal" trackMouse={false} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SignalCard eyebrow={t("hero.sp500_label")} value="+12.4%" note={t("hero.sp500_note")} tone="positive" surface="dark" />
                <SignalCard eyebrow={t("hero.btc_label")} value="$84k" note={`↓ -2.1% ${t("hero.btc_note")}`} tone="accent" surface="dark" />
                <SignalCard eyebrow={t("hero.czk_label")} value="25.10" note={t("hero.czk_note")} tone="neutral" surface="dark" />
                <div className="rounded-2xl border border-white/12 bg-white/[0.08] p-5">
                  <p className="mb-1 font-headline text-xs font-bold uppercase tracking-wider text-white/72">
                    Týdenní brief
                  </p>
                  <p className="font-headline text-3xl font-black leading-none text-white">
                    3 vrstvy
                  </p>
                  <p className="mt-1 text-xs text-white/78">
                    Přehled, signály, kontext
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-[1.5rem] border border-white/12 bg-black/22 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-headline text-[11px] font-black uppercase tracking-[0.2em] text-white/70">
                      Můj Radar
                    </p>
                    <p className="mt-1 font-headline text-base font-black text-white">
                      Osobní vrstva, ne další obsahová stránka
                    </p>
                  </div>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-headline text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
                    Tracker
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/12 bg-white/[0.08] px-4 py-4">
                    <p className="font-headline text-[11px] font-black uppercase tracking-[0.18em] text-white/72">
                      Co držet na očích
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-white/92">
                      <li>Praha 7 / 2+kk do 7,2 mil.</li>
                      <li>BMW E46 M3 manuál</li>
                      <li>ETF / měsíční start</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-white/[0.08] px-4 py-4">
                    <p className="font-headline text-[11px] font-black uppercase tracking-[0.18em] text-white/72">
                      Proč to funguje
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/86">
                      Méně tabů, méně hluku, víc signálu. Přesně ta vrstva, která z Radaru dělá produkt, ne jen čtení.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[1.4rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] px-4 py-4">
                <p className="font-headline text-[11px] font-black uppercase tracking-[0.18em] text-white/72">
                  Signál týdne
                </p>
                <p className="mt-2 font-headline text-base font-black text-white">
                  „Důležitější než další feed je vědět, co máš vlastně sledovat.“
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/84">
                  Právě proto homepage teď víc ukazuje produktovou vrstvu, ne jen výpis obsahu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
