import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const STEPS_CONFIG = [
  { step: 1, emoji: "🧠", titleKey: "step1_title", descKey: "step1_desc", ctaKey: "step1_cta", to: "/#knowhow", color: "bg-blue-50 border-blue-200", textColor: "text-blue-700" },
  { step: 2, emoji: "💳", titleKey: "step2_title", descKey: "step2_desc", ctaKey: "step2_cta", to: "/knowhow/jak-vybrat-brokera", color: "bg-green-50 border-green-200", textColor: "text-green-700" },
  { step: 3, emoji: "🎯", titleKey: "step3_title", descKey: "step3_desc", ctaKey: "step3_cta", to: "/knowhow/dca-strategie", color: "bg-purple-50 border-purple-200", textColor: "text-purple-700" },
];

export default function ZacinamOnboarding() {
  const { t } = useTranslation();
  const [done, setDone] = useState([]);

  const toggle = (i) => setDone((d) => d.includes(i) ? d.filter((x) => x !== i) : [...d, i]);
  const allDone = done.length === STEPS_CONFIG.length;

  return (
    <section id="zacatecnik" className="max-w-7xl mx-auto px-6 md:px-8 py-10">
      <div className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-8 text-white overflow-hidden relative">
        {/* BG decoration */}
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
          <svg viewBox="0 0 200 200" width="200" height="200" fill="none">
            {[80,60,40,20].map(r => <circle key={r} cx="100" cy="100" r={r} stroke="white" strokeWidth="8"/>)}
            <circle cx="100" cy="100" r="5" fill="white"/>
          </svg>
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🚀</span>
            <div>
              <h2 className="text-2xl font-black font-headline tracking-tight">{t("onboarding.title")}</h2>
              <p className="text-white-fixed-dim text-sm">{t("onboarding.subtitle")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STEPS_CONFIG.map((s) => {
              const isDone = done.includes(s.step);
              return (
                <div
                  key={s.step}
                  className={`bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/15 hover:border-white/30 transition-all ${isDone ? "opacity-70" : ""}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-xs font-black font-headline">
                        {isDone ? "✓" : s.step}
                      </span>
                      <span className="text-xl">{s.emoji}</span>
                    </div>
                    <button
                      onClick={() => toggle(s.step)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        isDone ? "bg-white border-white" : "border-white/40 hover:border-white"
                      }`}
                      aria-label={t("onboarding." + s.titleKey)}
                    >
                      {isDone && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#001f3f" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                    </button>
                  </div>
                  <h3 className="font-black text-white font-headline mb-1.5">{t("onboarding." + s.titleKey)}</h3>
                  <p className="text-white-fixed-dim text-sm leading-relaxed mb-4">{t("onboarding." + s.descKey)}</p>
                  <Link
                    to={s.to}
                    className="inline-flex items-center gap-1 text-sm font-bold text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-all"
                  >
                    {t("onboarding." + s.ctaKey)}
                  </Link>
                </div>
              );
            })}
          </div>

          {allDone && (
            <div className="mt-5 p-4 bg-white/15 rounded-xl text-center animate-fade-in">
              <p className="font-black text-white font-headline">🎉 {t("onboarding.done_title")}</p>
              <p className="text-white-fixed-dim text-sm mt-1">
                {t("onboarding.done_desc")}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
