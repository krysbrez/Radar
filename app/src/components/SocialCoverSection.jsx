import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AlertSignalPanel from "./AlertSignalPanel";
import SignalCard from "./SignalCard";

const SIGNALS = [
  {
    eyebrow: "Akcie",
    value: "+12.4%",
    note: "Lidri trhu",
    tone: "positive",
  },
  {
    eyebrow: "Reality",
    value: "5.3 %",
    note: "Vynos Ostrava",
    tone: "neutral",
  },
  {
    eyebrow: "Auta",
    value: "+114%",
    note: "BMW E36 M3 / 5Y",
    tone: "positive",
  },
  {
    eyebrow: "Alternativy",
    value: "+12.1%",
    note: "Zlato, hodinky, vino",
    tone: "accent",
  },
];

export default function SocialCoverSection() {
  const { t } = useTranslation();
  const location = useLocation();
  const screenshotMode = new URLSearchParams(location.search).get("view") === "cover";

  return (
    <section
      id="teaser-cover"
      className={`max-w-7xl mx-auto px-6 md:px-8 py-8 scroll-mt-32 ${
        screenshotMode ? "md:py-16" : ""
      }`}
    >
      <div
        className={`gradient-primary rounded-[2rem] overflow-hidden relative border border-primary-container/40 shadow-[0_20px_60px_rgba(0,6,19,0.18)] ${
          screenshotMode ? "p-5 md:p-10" : "p-5 md:p-7"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(212,227,255,0.18),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.9)_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className={`relative mx-auto max-w-[28rem] md:max-w-[52rem] ${screenshotMode ? "md:max-w-[56rem]" : ""}`}>
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-4 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed pulse-dot" />
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-primary-fixed-dim font-headline">
              Radar Signals
            </span>
          </div>

          <div className="mb-6">
            <p className="text-primary-fixed-dim text-xs sm:text-sm uppercase tracking-[0.22em] font-bold mb-2">
              Premium signal product
            </p>
            <h2 className="text-white text-[2.6rem] sm:text-5xl md:text-[3.4rem] font-black font-headline tracking-tight leading-[0.92]">
              Akcie. Reality.
              <br />
              Auta. Alternativy.
            </h2>
            <p className="text-primary-fixed-dim text-sm md:text-base leading-relaxed mt-3 max-w-sm">
              Čistý přehled toho, co se hýbe napříč hlavními kategoriemi RADARu.
            </p>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {["Newsletter", "Alerty", "Kontext"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-primary-fixed-dim"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {SIGNALS.map((signal) => (
              <SignalCard
                key={signal.eyebrow}
                eyebrow={signal.eyebrow}
                value={signal.value}
                note={signal.note}
                tone={signal.tone}
              />
            ))}
          </div>

          <AlertSignalPanel />

          {!screenshotMode && (
            <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
              <Link
                to="/#newsletter"
                className="flex-1 text-center bg-white text-primary px-5 py-3 rounded-full font-black text-sm font-headline tracking-tight hover:bg-primary-fixed transition-colors"
              >
                {t("hero.cta_newsletter")}
              </Link>
              <Link
                to="/archiv"
                className="flex-1 text-center bg-white/10 text-white px-5 py-3 rounded-full font-bold text-sm font-headline tracking-tight border border-white/10 hover:bg-white/15 transition-colors"
              >
                Projít signály
              </Link>
            </div>
          )}

          <div className={`text-center text-primary-fixed-dim/80 text-xs uppercase tracking-[0.18em] font-bold ${screenshotMode ? "mt-6" : "mt-4"}`}>
            Radar · Mapujeme chaos, tvoříme zisky.
          </div>
        </div>
      </div>
    </section>
  );
}
