import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "../components/Mascot";

const BROKERS = [
  {
    name: "XTB",
    logo: "XTB",
    color: "bg-red-600",
    fees: { label: "0 Kč", note: "ETF, akcie (do 100k€/měs)", isGood: true },
    minDeposit: { label: "0 Kč", note: "Bez minima", isGood: true },
    czech: { label: "✅ Ano", note: "Plná čeština + podpora", isGood: true },
    crypto: { label: "✅ Ano", note: "CFD krypto", isGood: true },
    etf: { label: "✅ Ano", note: "3500+ ETF", isGood: true },
    stocks: { label: "✅ Ano", note: "Akcie EU + USA", isGood: true },
    rating: 5,
    recommended: true,
    note: "Nejlepší volba pro začátečníky v ČR. Česká podpora, nulové poplatky, skvělá aplikace.",
  },
  {
    name: "Revolut",
    logo: "REV",
    color: "bg-slate-900",
    fees: { label: "0–0.25%", note: "Závisí na plánu", isGood: false },
    minDeposit: { label: "0 Kč", note: "Žádné minimum", isGood: true },
    czech: { label: "✅ Ano", note: "Česká lokalizace", isGood: true },
    crypto: { label: "✅ Ano", note: "Přímé krypto", isGood: true },
    etf: { label: "✅ Ano", note: "Omezený výběr", isGood: false },
    stocks: { label: "✅ Ano", note: "Omezené množství", isGood: false },
    rating: 3,
    recommended: false,
    note: "Skvělý jako platební aplikace. Jako broker je výběr omezený a poplatky závisí na tarifu.",
  },
  {
    name: "DEGIRO",
    logo: "DEG",
    color: "bg-orange-500",
    fees: { label: "2 € / obchod", note: "EU akcie; ETF Core zdarma", isGood: false },
    minDeposit: { label: "0 Kč", note: "Bez minima", isGood: true },
    czech: { label: "❌ Ne", note: "Angličtina/němčina", isGood: false },
    crypto: { label: "❌ Ne", note: "Bez krypta", isGood: false },
    etf: { label: "✅ Ano", note: "Core ETF zdarma", isGood: true },
    stocks: { label: "✅ Ano", note: "Velký výběr EU", isGood: true },
    rating: 3,
    recommended: false,
    note: "Dobrý pro zkušenější investory. Bez češtiny a bez krypta, ale Core ETF jsou zdarma.",
  },
  {
    name: "Trading 212",
    logo: "T212",
    color: "bg-green-600",
    fees: { label: "0 Kč", note: "Akcie i ETF zdarma", isGood: true },
    minDeposit: { label: "~25 Kč", note: "Min. 1 EUR", isGood: true },
    czech: { label: "❌ Ne", note: "Angličtina", isGood: false },
    crypto: { label: "✅ Ano", note: "CFD krypto", isGood: true },
    etf: { label: "✅ Ano", note: "Velký výběr", isGood: true },
    stocks: { label: "✅ Ano", note: "Akcie EU + USA", isGood: true },
    rating: 4,
    recommended: false,
    note: "Skvělé nulové poplatky a fractional shares. Chybí česká podpora — pro angličtináře ideální.",
  },
];

const FEATURES = [
  { key: "fees", label: "Poplatky za obchod" },
  { key: "minDeposit", label: "Min. vklad" },
  { key: "czech", label: "Čeština" },
  { key: "crypto", label: "Krypto" },
  { key: "etf", label: "ETF" },
  { key: "stocks", label: "Akcie" },
];

const STARTER_GUIDE = [
  {
    title: "Chci koupit ETF nebo akcie bez chaosu",
    text: "Začni u brokera. Je to nejjednodušší vstup pro dlouhodobé investování a nebudeš řešit deset věcí navíc hned první den.",
  },
  {
    title: "Chci řešit čistě krypto",
    text: "Tam už často dává smysl burza. Má víc krypto funkcí, ale i víc tlačítek, ve kterých se dá ztratit, když začínáš.",
  },
  {
    title: "Co je walletka",
    text: "Walletka není místo na objevování nových coinů. Je to místo, kde držíš kontrolu nad svým kryptem, když už víš, proč ho máš.",
  },
];

const FIRST_ACCOUNT_WARNINGS = [
  "Ověř poplatky. Ne jen za nákup, ale i za směnu měny, neaktivitu nebo výběr.",
  "Nezačínej pákou. Na první účet nepotřebuješ obchodovat na steroidech.",
  "Nejdřív si zkus ETF nebo jednu jednoduchou pozici. Cíl není být hrdina první týden.",
];

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <span key={i} className={`text-xs ${i <= count ? "text-yellow-400" : "text-white/55/30"}`}>★</span>
      ))}
    </div>
  );
}

export default function SrovnavacBrokeruPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white/4">
      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-5xl mx-auto px-6 md:px-8 pt-10 pb-12">
          <nav className="flex items-center gap-2 text-xs text-white-fixed-dim/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Radar</Link>
            <span>›</span>
            <Link to="/knowhow" className="hover:text-white transition-colors">{t("nav.tools")}</Link>
            <span>›</span>
            <span className="text-white-fixed-dim">{t("tools.broker_title")}</span>
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-4">
                {t("tools.broker_title")}
              </h1>
              <p className="text-white-fixed-dim text-lg leading-relaxed max-w-xl">
                {t("tools.broker_subtitle")}
              </p>
            </div>
            <div className="hidden md:block flex-shrink-0 bg-white/10 rounded-3xl p-4">
              <Mascot size={100} mood="normal" variant="idle" trackMouse={false} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-10">
        {/* Radar doporučení */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 flex items-start gap-4">
          <div className="bg-white rounded-xl p-2 flex-shrink-0">
            <Mascot size={48} mood="happy" variant="idle" trackMouse={false} />
          </div>
          <div>
            <p className="font-black text-green-800 font-headline mb-1">Radarovo doporučení pro začátečníky</p>
            <p className="text-sm text-green-700 leading-relaxed">
              <strong>XTB</strong> je pro většinu začínajících českých investorů nejsnazší start. Nulové poplatky, plná čeština, dobrá appka a podpora, která nemluví jak robot. Na první účet dává smysl právě tady.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-white/12/10 p-5 mb-8">
          <div className="max-w-3xl mb-5">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55 font-headline">
              Kde začít, když nechceš chaos
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white font-headline">
              Broker vs. burza: co řeší který nástroj
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              Pro většinu začátečníků je problém spíš v tom, že neví, kde začít, než v tom, že by neuměli investovat. Tohle je rychlá orientace bez finanční mlhy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STARTER_GUIDE.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/12/10 bg-white/5 px-5 py-5">
                <h3 className="text-base font-black text-white font-headline">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/12/10 p-5 mb-8">
          <div className="max-w-3xl mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55 font-headline">
              Na co si dát bacha při prvním účtu
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              První účet nemusí být dokonalý. Ale je fajn neudělat tři chyby, které pak zbytečně bolí.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FIRST_ACCOUNT_WARNINGS.map((item) => (
              <div key={item} className="rounded-2xl border border-white/12/10 bg-white px-5 py-5 text-sm leading-relaxed text-white/85">
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop tabulka */}
        <div className="hidden md:block bg-white rounded-2xl border border-white/12/10 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/12/10 bg-white/5">
                  <th className="text-left py-4 px-5 text-xs font-black text-white/55 uppercase tracking-wider font-headline">Funkce</th>
                  {BROKERS.map((b) => (
                    <th key={b.name} className="text-center py-4 px-4 min-w-[140px]">
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-10 h-10 ${b.color} rounded-xl flex items-center justify-center`}>
                          <span className="text-white text-xs font-black font-headline">{b.logo}</span>
                        </div>
                        <span className="font-black text-white font-headline text-sm">{b.name}</span>
                        <Stars count={b.rating} />
                        {b.recommended && (
                          <span className="text-[10px] bg-green-100 text-green-700 font-black px-2 py-0.5 rounded-full">Doporučujeme</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feat) => (
                  <tr key={feat.key} className="border-b border-white/12/5 hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-5 text-sm font-bold text-white">{feat.label}</td>
                    {BROKERS.map((b) => {
                      const cell = b[feat.key];
                      return (
                        <td key={b.name} className="py-3.5 px-4 text-center">
                          <div className={`inline-flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-bold ${cell.isGood ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                            <span>{cell.label}</span>
                            <span className="font-normal opacity-70 text-[10px]">{cell.note}</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="border-b border-white/12/5">
                  <td className="py-3.5 px-5 text-sm font-bold text-white">Radarovo hodnocení</td>
                  {BROKERS.map((b) => (
                    <td key={b.name} className="py-3.5 px-4 text-center">
                      <Stars count={b.rating} />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4 mb-8">
          {BROKERS.map((b) => (
            <div key={b.name} className={`bg-white rounded-2xl border ${b.recommended ? "border-green-300" : "border-white/12/10"} overflow-hidden`}>
              <div className={`${b.color} px-5 py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className="text-white font-black font-headline text-xl">{b.name}</span>
                  {b.recommended && <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full">Doporučujeme</span>}
                </div>
                <Stars count={b.rating} />
              </div>
              <div className="p-4 space-y-2">
                {FEATURES.map((feat) => {
                  const cell = b[feat.key];
                  return (
                    <div key={feat.key} className="flex items-center justify-between py-1.5 border-b border-white/12/5 last:border-0">
                      <span className="text-sm text-white/65">{feat.label}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cell.isGood ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"}`}>{cell.label}</span>
                    </div>
                  );
                })}
              </div>
              <div className="px-4 pb-4">
                <p className="text-xs text-white/65 italic">{b.note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Broker notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {BROKERS.map((b) => (
            <div key={b.name} className="bg-white rounded-xl border border-white/12/10 p-4 flex gap-3">
              <div className={`w-10 h-10 ${b.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-xs font-black font-headline">{b.logo}</span>
              </div>
              <div>
                <p className="font-black text-white font-headline text-sm mb-1">{b.name}</p>
                <p className="text-xs text-white/65 leading-relaxed">{b.note}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/55 italic text-center">* Informace jsou orientační. Poplatky se mohou měnit. Ověř aktuální podmínky na webu brokera.</p>
      </div>
    </div>
  );
}
