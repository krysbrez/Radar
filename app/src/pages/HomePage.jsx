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

const Divider = () => (
  <div className="max-w-7xl mx-auto px-6 md:px-8">
    <div className="h-px bg-outline-variant/10" />
  </div>
);

export default function HomePage() {
  return (
    <>
      <Hero />

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
            <span className="font-black text-white">Každé pondělí v 8:00</span> posíláme shrnutí týdne — co se stalo, proč to záleží a co dělat. Přes 47 000 čtenářů už ví proč.
          </p>
          <a href="#newsletter" className="bg-white text-primary text-xs font-black font-headline px-4 py-2 rounded-full whitespace-nowrap hover:bg-primary-fixed transition-colors flex-shrink-0">
            Odebírat →
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
