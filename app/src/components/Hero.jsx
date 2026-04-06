import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "./Mascot";
import SignalCard from "./SignalCard";

export default function Hero() {
  const { t } = useTranslation();
  const [rotIdx, setRotIdx] = useState(0);

  const ROTATING = [
    t("hero.rotating_1"),
    t("hero.rotating_2"),
    t("hero.rotating_3"),
  ];

  useEffect(() => {
    const timer = setInterval(() => setRotIdx((i) => (i + 1) % ROTATING.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header id="investovani" className="pt-8 pb-14 max-w-7xl mx-auto px-6 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

        {/* LEFT: Mascot */}
        <div className="lg:col-span-3 flex justify-center lg:justify-end order-2 lg:order-1">
          <div className="bg-surface-container-low rounded-3xl p-4 flex-shrink-0">
            <Mascot size={160} mood="happy" variant="both" trackMouse={true} />
          </div>
        </div>

        {/* CENTER: Headline + CTAs */}
        <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 bg-surface-container rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-black text-outline uppercase tracking-widest font-headline">{t("hero.live_badge")}</span>
          </div>

          {/* Rotating headline */}
          <div className="h-14 md:h-16 mb-3 overflow-hidden">
            <p key={rotIdx} className="text-2xl md:text-3xl font-black text-primary font-headline tracking-tight leading-tight animate-fadeIn">
              {ROTATING[rotIdx]}
            </p>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-primary leading-[1.0] tracking-tighter font-headline mb-4">
            {t("hero.title_bored")}{" "}
            <span className="text-green-600">{t("hero.title_bored_accent")}</span>
            <br />
            {t("hero.title_us")}{" "}
            <span className="text-red-500">{t("hero.title_us_accent")}</span>
          </h1>

          <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed mb-8 max-w-xl">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <Link
              to="/#newsletter"
              className="gradient-primary text-white px-8 py-3.5 rounded-full font-black text-sm font-headline tracking-tight hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              {t("hero.cta_newsletter")}
            </Link>
            <Link
              to="/#nemovitosti"
              className="flex items-center gap-2 bg-white border border-outline-variant/20 text-primary px-6 py-3.5 rounded-full font-bold text-sm font-headline hover:border-outline-variant/40 hover:shadow-sm transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
              {t("hero.cta_prices")}
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex -space-x-2">
              {[
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&q=80",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&q=80",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&q=80",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&q=80",
              ].map((src, i) => (
                <img key={i} src={src} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container flex items-center justify-center">
                <span className="text-[9px] font-black text-outline">+47k</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-black text-primary font-headline">{t("hero.readers_count")}</p>
              <div className="flex gap-0.5 mt-0.5">
                {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-xs">★</span>)}
                <span className="text-xs text-outline ml-1">4.9/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Stats cards */}
        <div className="lg:col-span-3 order-3 grid grid-cols-2 lg:grid-cols-1 gap-3">
          <SignalCard
            eyebrow={t("hero.sp500_label")}
            value="+12.4%"
            note={t("hero.sp500_note")}
            tone="positive"
          />
          <SignalCard
            eyebrow={t("hero.btc_label")}
            value="$84k"
            note={`↓ -2.1% ${t("hero.btc_note")}`}
            tone="accent"
          />
          <div className="lg:block hidden">
            <SignalCard
              eyebrow={t("hero.czk_label")}
              value="25.10"
              note={t("hero.czk_note")}
              tone="neutral"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
