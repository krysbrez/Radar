import { useTranslation } from "react-i18next";
import Hero from "../components/Hero";
import Mascot from "../components/Mascot";
import TydenVCislech from "../components/TydenVCislech";
import LivePrices from "../components/LivePrices";
import MainContent from "../components/MainContent";
import TipTydne from "../components/TipTydne";
import ZacinamOnboarding from "../components/ZacinamOnboarding";
import Nemovitosti from "../components/Nemovitosti";
import Auta from "../components/Auta";
import AlternativeInvestments from "../components/AlternativeInvestments";
import MemeTydne from "../components/MemeTydne";
import RadarScore from "../components/RadarScore";
import Newsletter from "../components/Newsletter";
import RealTalk from "../components/RealTalk";
import InvestorQuotes from "../components/InvestorQuotes";
import TrziTydne from "../components/TrziTydne";
import RadarovaMoudrost from "../components/RadarovaMoudrost";
import RadarWTF from "../components/RadarWTF";
import MytusWeek from "../components/MytusWeek";
import CisloTydne from "../components/CisloTydne";
import BiteSize from "../components/BiteSize";
import Reviews from "../components/Reviews";
import SocialCoverSection from "../components/SocialCoverSection";

const HOW_RADAR_WORKS = [
  {
    step: "01",
    title: "Radar hlídá trhy",
    text: "Akcie, krypto, reality, auta a alternativy na jednom místě. Bez přepínání mezi deseti weby.",
  },
  {
    step: "02",
    title: "Filtruje signál od šumu",
    text: "Vybereme to, co má opravdu dopad. Co se hýbe, proč na tom záleží a co sledovat dál.",
  },
  {
    step: "03",
    title: "Posílá jasný výstup",
    text: "V pondělí dostaneš přehled do inboxu. Mezitím můžeš sledovat alerty a živé ceny na webu.",
  },
];

const Divider = () => (
  <div className="max-w-7xl mx-auto px-6 md:px-8">
    <div className="h-px bg-outline-variant/10" />
  </div>
);

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <>
      <Hero />

      <SocialCoverSection />

      <section className="max-w-7xl mx-auto px-6 md:px-8 py-6">
        <div className="rounded-[1.75rem] border border-outline-variant/10 bg-surface-container-low px-6 py-7 md:px-8">
          <div className="mb-6 max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-outline font-headline mb-2">
              Jak Radar funguje
            </p>
            <h2 className="text-2xl md:text-[2rem] font-black tracking-tight text-primary font-headline">
              Jeden produkt. Tři jednoduché vrstvy.
            </h2>
            <p className="mt-2 text-sm md:text-base leading-relaxed text-on-surface-variant">
              Newsletter pro přehled, alerty pro timing, tržní pokrytí pro kontext.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HOW_RADAR_WORKS.map((item) => (
              <div key={item.step} className="rounded-2xl border border-outline-variant/10 bg-white px-5 py-5">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-outline font-headline">
                  {item.step}
                </p>
                <h3 className="mt-3 text-lg font-black text-primary font-headline">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrziTydne />

      <Divider />

      {/* Číslo týdne */}
      <CisloTydne />

      <Divider />

      {/* Bite-sized links */}
      <BiteSize />

      <Divider />

      <TydenVCislech />

      <Divider />

      {/* Live prices + Radar Score side by side */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LivePrices inline />
          </div>
          <div className="lg:col-span-1">
            <RadarScore />
          </div>
        </div>
      </section>

      <Divider />

      {/* Krypto + Forex anchor sections (for scrolling from nav) */}
      <div id="krypto" className="scroll-mt-32" />
      <div id="forex" className="scroll-mt-32" />
      <MainContent />
      <TipTydne />

      <Divider />

      {/* Radar maskot promo strip */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
        <div className="bg-surface-container rounded-2xl px-6 py-4 flex items-center gap-4">
          <Mascot size={48} mood="thinking" variant="signal" trackMouse={false} />
          <p className="text-sm text-on-surface-variant leading-relaxed flex-1">
            <span className="font-black text-primary">Radar právě analyzoval 500 článků.</span> Vybrali jsme pro tebe to nejdůležitější — nic zbytečného, žádný clickbait.
          </p>
        </div>
      </div>

      <Divider />

      {/* Radar WTF */}
      <RadarWTF />

      <Divider />

      {/* Mýtus týdne */}
      <MytusWeek />

      <Divider />

      <RealTalk />

      <Divider />

      {/* Reader reviews */}
      <Reviews />

      <Divider />

      <InvestorQuotes />

      <Divider />

      {/* Radar maskot — did you know strip */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-6 py-4 flex items-center gap-4">
          <Mascot size={44} mood="happy" variant="idle" trackMouse={false} />
          <p className="text-sm text-yellow-900 leading-relaxed flex-1">
            <span className="font-black text-yellow-800">💡 Věděl/a jsi?</span> Kdybys od roku 2010 investoval/a 1 000 Kč měsíčně do S&P 500 ETF, máš dnes přes <strong>2 400 000 Kč</strong>. Celkem jsi vložil/a 192 000 Kč.
          </p>
        </div>
      </div>

      <Divider />

      <RadarovaMoudrost />

      <Divider />

      <ZacinamOnboarding />

      <Divider />

      <div id="nemovitosti" className="scroll-mt-32" />
      <Nemovitosti />

      <Divider />

      <div id="auta" className="scroll-mt-32" />
      <Auta />

      <Divider />

      <AlternativeInvestments />

      {/* Radar maskot — newsletter teaser */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
        <div className="gradient-primary rounded-2xl px-6 py-4 flex items-center gap-4">
          <Mascot size={44} mood="signal" variant="signal" trackMouse={false} />
          <p className="text-sm text-primary-fixed-dim leading-relaxed flex-1">
            <span className="font-black text-white">{t("home.strip_monday")}</span> {t("home.strip_desc")}
          </p>
          <a href="#newsletter" className="bg-white text-primary text-xs font-black font-headline px-4 py-2 rounded-full whitespace-nowrap hover:bg-primary-fixed transition-colors flex-shrink-0">
            {t("home.strip_btn")}
          </a>
        </div>
      </div>

      {/* Meme + Newsletter row */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <MemeTydne />
          </div>
          <div className="md:col-span-2">
            <Newsletter inline />
          </div>
        </div>
      </section>
    </>
  );
}
