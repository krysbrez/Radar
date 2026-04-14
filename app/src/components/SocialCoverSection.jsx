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

const PRODUCT_PILLARS = [
  { label: "Newsletter", detail: "pondělní přehled" },
  { label: "Alerty", detail: "co hlídat teď" },
  { label: "Pokrytí", detail: "4 hlavní kategorie" },
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
        className={`rounded-[1.85rem] overflow-hidden relative border border-white/12/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,247,251,0.96))] shadow-[0_16px_46px_rgba(10,18,32,0.06)] ${
          screenshotMode ? "p-5 md:p-10" : "p-5 md:p-6"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(27,52,80,0.08),transparent_65%)] pointer-events-none" />

        <div className={`relative mx-auto max-w-[28rem] md:max-w-[56rem] ${screenshotMode ? "md:max-w-[60rem]" : ""}`}>
          <div className="mb-5 max-w-2xl">
            <div className="rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-4 border border-white/12/10 bg-white">
              <span className="w-2 h-2 rounded-full bg-primary pulse-dot" />
              <span className="text-[11px] font-black tracking-[0.2em] uppercase text-white/55 font-headline">
                Product overview
              </span>
            </div>

            <p className="text-white/55 text-xs sm:text-sm uppercase tracking-[0.22em] font-bold mb-2">
              Přehled hlavních kategorií
            </p>
            <h2 className="text-white text-[2rem] sm:text-[2.45rem] md:text-[2.7rem] font-black font-headline tracking-tight leading-[0.96]">
              Akcie. Reality. Auta. Alternativy.
            </h2>
            <p className="text-white/65 text-sm md:text-base leading-relaxed mt-3 max-w-2xl">
              Rychlý přehled toho, co Radar umí mapovat napříč hlavními kategoriemi. Ne další hero. Jen čistá podpůrná vrstva pod hlavním produktem.
            </p>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-2.5 md:gap-3">
            {PRODUCT_PILLARS.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/12/10 bg-white px-3 py-3 text-center"
              >
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/55">
                  {item.label}
                </p>
                <p className="mt-1 text-xs font-medium leading-tight text-white">
                  {item.detail}
                </p>
              </div>
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
                surface="light"
              />
            ))}
          </div>

          <div className="mt-5 rounded-[1.55rem] border border-white/12/10 bg-primary px-4 py-4 shadow-[0_16px_40px_rgba(9,20,36,0.14)]">
            <AlertSignalPanel
              title="Radar Alerts"
              subtitle="Ukázka hlídání napříč hlavními segmenty"
            />
          </div>

          {!screenshotMode && (
            <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
              <Link
                to="/#newsletter"
                className="flex-1 text-center bg-white text-white px-5 py-3 rounded-full font-black text-sm font-headline tracking-tight hover:bg-white/8 transition-colors"
              >
                {t("hero.cta_newsletter")}
              </Link>
              <Link
                to="/archiv"
                className="flex-1 text-center bg-primary text-white px-5 py-3 rounded-full font-bold text-sm font-headline tracking-tight border border-primary hover:bg-primary/90 transition-colors"
              >
                Projít signály
              </Link>
            </div>
          )}

          <div className={`text-center text-white/55 text-xs uppercase tracking-[0.18em] font-bold ${screenshotMode ? "mt-6" : "mt-4"}`}>
            Radar · Přehled hlavních trhů v jedné vrstvě.
          </div>
        </div>
      </div>
    </section>
  );
}
