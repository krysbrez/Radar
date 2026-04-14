import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "../components/Mascot";

const UPCOMING_IPOS = [
  { company: "Anthropic", sector: "AI / Tech", date: "Q3 2026", priceRange: "$35–45", status: "upcoming", flag: "🇺🇸" },
  { company: "Klarna", sector: "Fintech", date: "Q2 2026", priceRange: "$55–65", status: "upcoming", flag: "🇸🇪" },
  { company: "Bolt", sector: "Mobility / Tech", date: "Q4 2026", priceRange: "TBD", status: "upcoming", flag: "🇪🇪" },
  { company: "Shein", sector: "E-commerce / Fashion", date: "Q3 2026", priceRange: "$60–70", status: "upcoming", flag: "🇨🇳" },
];

const RECENT_IPOS = [
  { company: "Reddit", sector: "Social Media", date: "Březen 2024", change: "+78%", isUp: true, flag: "🇺🇸" },
  { company: "Arm Holdings", sector: "Chips / Semiconductors", date: "Září 2023", change: "+142%", isUp: true, flag: "🇬🇧" },
  { company: "Instacart", sector: "Delivery / Tech", date: "Září 2023", change: "-31%", isUp: false, flag: "🇺🇸" },
  { company: "Birkenstock", sector: "Fashion / Retail", date: "Říjen 2023", change: "+12%", isUp: true, flag: "🇩🇪" },
];

const HOW_TO = [
  { n: 1, t: "Otevři účet u brokera s přístupem k IPO", d: "Ne každý broker umožňuje nákup při IPO. XTB, Interactive Brokers nebo Revolut mají různé přístupy." },
  { n: 2, t: "Sleduj prospekt IPO", d: "Firma zveřejní S-1 dokument (v USA) nebo prospekt. Tam najdeš financials, rizika a plány." },
  { n: 3, t: "Zvaž cenu a valuaci", d: "Srovnej valuaci (P/E, P/S) s podobnými firmami. IPO cena je often premium — záleží na podkladové hodnotě." },
  { n: 4, t: "Zvol správné množství", d: "IPO může jít dolů i nahoru o 30 % první den. Nesázej vše — diversifikuj jako vždy." },
];

export default function IpoPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white/4">
      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-5xl mx-auto px-6 md:px-8 pt-10 pb-12">
          <nav className="flex items-center gap-2 text-xs text-white-fixed-dim/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">{t("common.breadcrumb_home")}</Link>
            <span>›</span>
            <Link to="/akcie" className="hover:text-white transition-colors">{t("nav.stocks")}</Link>
            <span>›</span>
            <span className="text-white-fixed-dim">IPO</span>
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
                <span className="text-xs font-black text-white-fixed-dim uppercase tracking-widest font-headline">{t("ipo.hero_badge")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-4">
                {t("ipo.hero_title")}<br /><span className="text-tertiary-fixed">{t("ipo.hero_title_accent")}</span>
              </h1>
              <p className="text-white-fixed-dim text-lg leading-relaxed max-w-xl">{t("ipo.hero_subtitle")}</p>
            </div>
            <div className="hidden md:block flex-shrink-0 bg-white/10 rounded-3xl p-4">
              <Mascot size={120} mood="happy" variant="signal" trackMouse={false} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-10 space-y-12">

        {/* Co je IPO */}
        <section className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-2xl font-black font-headline text-white mb-4">{t("ipo.what_is")}</h2>
            <p className="text-white/85 leading-relaxed mb-3">
              <strong>IPO</strong> (Initial Public Offering) je chvíle, kdy soukromá firma poprvé prodá své akcie veřejnosti na burze. Je to jako když kapela vydá první album — najednou ji může slyšet každý.
            </p>
            <p className="text-white/85 leading-relaxed mb-3">
              Firma tím získá kapitál na rozvoj. Ty jako investor získáš možnost koupit kousek firmy — často dříve, než ji "všichni" znají.
            </p>
            <p className="text-white/85 leading-relaxed">
              Riziko je vyšší než u zavedených akcií — firma nemá historii na burze a cena může být přestřelená.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { icon: "💰", t: "Firma získá kapitál", d: "Peníze jdou do firmy na rozvoj, R&D nebo splacení dluhů." },
              { icon: "📈", t: "Investoři získají akcie", d: "Můžeš koupit při IPO ceně nebo na druhý den na burze." },
              { icon: "⚠️", t: "Riziko lock-up periody", d: "Insideři nemůžou prodávat 90-180 dní. Po lock-upu cena often klesá." },
            ].map(item => (
              <div key={item.t} className="bg-white rounded-xl border border-white/12/10 p-4 flex gap-3">
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-bold text-white text-sm">{item.t}</p>
                  <p className="text-xs text-white/65">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nadcházející IPO */}
        <section>
          <h2 className="text-xl font-black font-headline text-white mb-5">{t("ipo.upcoming")}</h2>
          <div className="bg-white rounded-2xl border border-white/12/10 overflow-hidden">
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 text-xs text-white/55 uppercase tracking-wider font-headline">
                    <th className="text-left px-5 py-3">{t("ipo.company")}</th>
                    <th className="text-left px-4 py-3">{t("ipo.sector")}</th>
                    <th className="text-left px-4 py-3">{t("ipo.date")}</th>
                    <th className="text-right px-4 py-3">{t("ipo.price_range")}</th>
                    <th className="text-right px-5 py-3">{t("ipo.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {UPCOMING_IPOS.map((ipo, i) => (
                    <tr key={ipo.company} className={`border-t border-white/12/5 ${i % 2 === 1 ? "bg-white/5/20" : ""}`}>
                      <td className="px-5 py-3.5 font-bold text-white">{ipo.flag} {ipo.company}</td>
                      <td className="px-4 py-3.5 text-white/65 text-xs">{ipo.sector}</td>
                      <td className="px-4 py-3.5 font-mono text-sm">{ipo.date}</td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold">{ipo.priceRange}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-xs font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{t("ipo.status_upcoming")}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-outline-variant/5">
              {UPCOMING_IPOS.map(ipo => (
                <div key={ipo.company} className="px-4 py-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white text-sm">{ipo.flag} {ipo.company}</p>
                    <p className="text-xs text-white/55">{ipo.sector} · {ipo.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-sm">{ipo.priceRange}</p>
                    <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">{t("ipo.status_upcoming")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-white/55 mt-2">{t("ipo.disclaimer")}</p>
        </section>

        {/* Nedávné IPO */}
        <section>
          <h2 className="text-xl font-black font-headline text-white mb-5">{t("ipo.recent")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {RECENT_IPOS.map(ipo => (
              <div key={ipo.company} className="bg-white rounded-2xl border border-white/12/10 p-4 text-center">
                <p className="text-lg mb-1">{ipo.flag}</p>
                <p className="font-black text-white font-headline text-sm">{ipo.company}</p>
                <p className="text-xs text-white/55 mb-2">{ipo.date}</p>
                <span className={`text-lg font-black font-headline ${ipo.isUp ? "text-green-600" : "text-red-500"}`}>{ipo.change}</span>
                <p className="text-xs text-white/55 mt-1">{t("ipo.since_ipo")}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Jak koupit IPO */}
        <section>
          <h2 className="text-xl font-black font-headline text-white mb-5">{t("ipo.how_to")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {HOW_TO.map(step => (
              <div key={step.n} className="bg-white rounded-2xl border border-white/12/10 p-5 flex gap-4">
                <div className="w-8 h-8 gradient-primary text-white rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0">{step.n}</div>
                <div>
                  <p className="font-bold text-white font-headline">{step.t}</p>
                  <p className="text-sm text-white/65 mt-1 leading-relaxed">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex gap-3 items-start">
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div>
            <p className="font-bold text-yellow-800 font-headline mb-1">{t("ipo.risks")}</p>
            <p className="text-sm text-yellow-700 leading-relaxed">{t("ipo.warning")}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="gradient-primary rounded-2xl p-8 text-white text-center">
          <Mascot size={72} mood="happy" variant="signal" trackMouse={false} />
          <p className="text-2xl font-black font-headline mt-4 mb-2">{t("ipo.cta_heading")}</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <Link to="/akcie" className="bg-white text-white font-black text-sm font-headline px-6 py-2.5 rounded-full hover:bg-white/8 transition-colors">
              {t("ipo.cta_stocks")}
            </Link>
            <Link to="/srovnavac-brokeru" className="bg-white/10 text-white font-bold text-sm font-headline px-6 py-2.5 rounded-full hover:bg-white/20 transition-colors">
              {t("ipo.cta_brokers")}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
