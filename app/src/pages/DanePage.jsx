import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "../components/Mascot";
import DidYouKnow from "../components/DidYouKnow";
import RadarSays from "../components/RadarSays";

const TAX_RATES = [
  { income: "Do 100 000 Kč zisk", rate: "0 % daň", note: "Osvobozeno — pod limitem", color: "bg-green-100 text-green-700", isGood: true },
  { income: "100 001 – 2 500 000 Kč", rate: "15 %", note: "Standardní sazba", color: "bg-yellow-100 text-yellow-700", isGood: false },
  { income: "Nad 2 500 000 Kč", rate: "23 %", note: "Solidární příplatek", color: "bg-red-100 text-red-700", isGood: false },
  { income: "Po 3 letech držení", rate: "0 % ✓", note: "Časový test splněn", color: "bg-emerald-100 text-emerald-700", isGood: true },
];

const WHEN_TO_FILE = [
  { scenario: "Prodáváš akcie/ETF pod 3 roky a zisk > 100 000 Kč", file: true, note: "Musíš podat daňové přiznání do 31. 3. (nebo 30. 6. s poradcem)." },
  { scenario: "Prodáváš akcie/ETF po 3+ letech", file: false, note: "Nemusíš podávat nic. Časový test tě osvobozuje." },
  { scenario: "Dostáváš dividendy ze zahraničí", file: true, note: "Zahraniční dividendy se daní vždy — bez výjimky." },
  { scenario: "Prodáváš krypto s ziskem > 100 000 Kč", file: true, note: "Krypto nemá (zatím) časový test. 15 % daň z každého zisku." },
  { scenario: "Investuješ přes DIP produkt", file: true, note: "Musíš doložit aby sis uplatnil/a odpočet." },
];

function TaxCalculator() {
  const { t } = useTranslation();
  const [profit, setProfit] = useState(200000);
  const [held, setHeld] = useState("under");

  const tax = held === "over" ? 0 : profit <= 100000 ? 0 : Math.round((profit - 100000) * 0.15);
  const isExempt = held === "over";
  const underLimit = profit <= 100000;

  return (
    <div className="bg-white rounded-2xl border border-outline-variant/10 p-6">
      <h3 className="font-black text-primary font-headline text-lg mb-5">{t("dane.calc_title")}</h3>
      <p className="text-sm text-on-surface-variant mb-5">{t("dane.calc_desc")}</p>

      <div className="space-y-5 mb-6">
        <div>
          <label className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">{t("dane.profit_label")}</label>
          <div className="flex items-center gap-3">
            <input
              type="range" min={0} max={2000000} step={10000} value={profit}
              onChange={e => setProfit(+e.target.value)}
              className="flex-1 accent-primary"
            />
            <span className="text-sm font-black text-primary w-32 text-right font-mono">{profit.toLocaleString("cs")} Kč</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-outline uppercase tracking-wider block mb-2">{t("dane.years_held_label")}</label>
          <div className="flex gap-3">
            <button
              onClick={() => setHeld("under")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors ${held === "under" ? "bg-red-50 border-red-300 text-red-700" : "bg-surface-container border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high"}`}
            >
              {t("dane.years_option_under")}
            </button>
            <button
              onClick={() => setHeld("over")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors ${held === "over" ? "bg-green-50 border-green-300 text-green-700" : "bg-surface-container border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high"}`}
            >
              {t("dane.years_option_over")}
            </button>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl p-5 text-center transition-all ${isExempt || underLimit ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
        <p className="text-xs font-black uppercase tracking-wider mb-2 font-headline text-outline">{t("dane.tax_result")}</p>
        {isExempt || underLimit ? (
          <p className="text-3xl font-black text-green-700 font-headline">{t("dane.tax_free")}</p>
        ) : (
          <>
            <p className="text-4xl font-black text-red-700 font-headline">{tax.toLocaleString("cs")} Kč</p>
            <p className="text-xs text-red-600 mt-1">15 % z ({profit.toLocaleString("cs")} − 100 000) Kč</p>
          </>
        )}
        {isExempt && <p className="text-xs text-green-600 mt-1 font-bold">Časový test splněn ✓</p>}
        {underLimit && !isExempt && <p className="text-xs text-green-600 mt-1 font-bold">Pod ročním limitem 100 000 Kč ✓</p>}
      </div>

      <p className="text-xs text-outline mt-3">* Zjednodušený výpočet. Nezohledňuje DIP, ztráty z minulých let ani zahraniční daně.</p>
    </div>
  );
}

export default function DanePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-5xl mx-auto px-6 md:px-8 pt-10 pb-12">
          <nav className="flex items-center gap-2 text-xs text-primary-fixed-dim/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">{t("common.breadcrumb_home")}</Link>
            <span>›</span>
            <span className="text-primary-fixed-dim">{t("nav.tools")}</span>
            <span>›</span>
            <span className="text-primary-fixed-dim">{t("tools.tax_title")}</span>
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
                <span className="text-xs font-black text-primary-fixed-dim uppercase tracking-widest font-headline">{t("dane.hero_badge")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-4">
                {t("dane.hero_title")}<br /><span className="text-tertiary-fixed">{t("dane.hero_title_accent")}</span>
              </h1>
              <p className="text-primary-fixed-dim text-lg leading-relaxed max-w-xl">{t("dane.hero_subtitle")}</p>
            </div>
            <div className="hidden md:block flex-shrink-0 bg-white/10 rounded-3xl p-4">
              <Mascot size={120} mood="thinking" variant="signal" trackMouse={false} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-10 space-y-12">

        <DidYouKnow text="DIP (Dlouhodobý investiční produkt) ti umožňuje odečíst až 48 000 Kč ročně ze základu daně. Při sazbě 15 % = úspora až 7 200 Kč. Zavedeno od 1. 1. 2024." />

        {/* Funny example callout */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex gap-3 items-start">
          <span className="text-2xl flex-shrink-0">😎</span>
          <div>
            <p className="font-black text-yellow-800 font-headline mb-2">{t("dane.funny_example")}</p>
            <p className="text-sm text-yellow-700 leading-relaxed">
              Prodal jsi Apple po roce? Platíš 15 % daň z každé koruny zisku nad 100 000 Kč. Čekal jsi 3 roky? <strong>Nula. Žádná daň.</strong> Stát ti dává bonus za trpělivost. Je to jeden z mála legálních způsobů, jak se dani vyhnout — a je zakotvený přímo v zákoně.
            </p>
          </div>
        </div>

        {/* Časový test */}
        <section>
          <h2 className="text-2xl font-black font-headline text-primary mb-2">{t("dane.time_test_title")}</h2>
          <p className="text-on-surface-variant mb-5">{t("dane.time_test_desc")}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="text-3xl mb-3">⏱️</div>
              <h3 className="font-black text-red-800 font-headline text-lg mb-2">{t("dane.under_3y")}</h3>
              <p className="text-sm text-red-700 leading-relaxed">{t("dane.under_3y_desc")}</p>
              <div className="mt-4 bg-red-100 rounded-xl p-3">
                <p className="text-xs font-bold text-red-600">Příklad: Koupil jsi Apple v lednu 2025 za 100 000 Kč. Prodal v červenci 2026 za 180 000 Kč. Zisk = 80 000 Kč → pod limitem, daň 0 Kč. Pokud bys ale měl/a zisk 150 000 Kč → platíš 15 % z 50 000 Kč = 7 500 Kč.</p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="font-black text-green-800 font-headline text-lg mb-2">{t("dane.over_3y")}</h3>
              <p className="text-sm text-green-700 leading-relaxed">{t("dane.over_3y_desc")}</p>
              <div className="mt-4 bg-green-100 rounded-xl p-3">
                <p className="text-xs font-bold text-green-600">Příklad: Koupil jsi Nvidia v lednu 2022. Prodáš v únoru 2025. Zisk 500 000 Kč → daň 0 Kč. Stát ti říká: Dobře jsi čekal/a. Gratulujeme.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sazby */}
        <section>
          <h2 className="text-xl font-black font-headline text-primary mb-5">{t("dane.rates_title")}</h2>
          <div className="bg-white rounded-2xl border border-outline-variant/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container text-xs text-outline uppercase tracking-wider font-headline">
                  <th className="text-left px-5 py-3">{t("dane.rates_col_income")}</th>
                  <th className="text-right px-4 py-3">{t("dane.rates_col_rate")}</th>
                  <th className="text-right px-5 py-3">{t("dane.rates_col_note")}</th>
                </tr>
              </thead>
              <tbody>
                {TAX_RATES.map((r, i) => (
                  <tr key={r.income} className={`border-t border-outline-variant/5 ${i % 2 === 1 ? "bg-surface-container/20" : ""}`}>
                    <td className="px-5 py-3.5 font-medium text-primary">{r.income}</td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={`text-sm font-black px-2 py-0.5 rounded-full ${r.color}`}>{r.rate}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-on-surface-variant">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* DIP */}
        <section>
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">💰</div>
              <div>
                <h3 className="font-black text-indigo-800 font-headline text-lg mb-2">{t("dane.dip_title")}</h3>
                <p className="text-sm text-indigo-700 leading-relaxed mb-3">{t("dane.dip_desc")}</p>
                <div className="bg-white rounded-xl p-4">
                  <p className="text-xs font-bold text-indigo-600 mb-1">Příklad úspory DIP:</p>
                  <p className="text-sm text-on-surface">Vložíš 48 000 Kč/rok do DIP → snížíš základ daně o 48 000 Kč → ušetříš 7 200 Kč na daních (při 15 % sazbě). Každý rok. Automaticky.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kdy podávat přiznání */}
        <section>
          <h2 className="text-xl font-black font-headline text-primary mb-5">{t("dane.when_file")}</h2>
          <div className="space-y-3">
            {WHEN_TO_FILE.map((item, i) => (
              <div key={i} className={`rounded-xl p-4 flex gap-3 items-start border ${item.file ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"}`}>
                <span className="text-lg flex-shrink-0">{item.file ? "📋" : "✅"}</span>
                <div>
                  <p className={`font-bold text-sm ${item.file ? "text-yellow-800" : "text-green-800"}`}>{item.scenario}</p>
                  <p className={`text-xs mt-0.5 leading-relaxed ${item.file ? "text-yellow-600" : "text-green-600"}`}>{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Kalkulačka */}
        <TaxCalculator />

        <RadarSays text="Časový test je tvůj nejlepší kamarád. Koupíš ETF, zapomeneš na 3 roky, prodáš — daň = 0 Kč. Je to legální, zakotvené v zákoně a funguje to. Buffett drží akcie desítky let. Ty jsi zvládneš 3 roky." />

        {/* Disclaimer */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-5 flex gap-3">
          <span className="text-xl flex-shrink-0">⚖️</span>
          <p className="text-sm text-gray-700 leading-relaxed">{t("dane.disclaimer")}</p>
        </div>

        {/* CTA */}
        <div className="gradient-primary rounded-2xl p-8 text-white text-center">
          <Mascot size={72} mood="happy" variant="signal" trackMouse={false} />
          <p className="text-2xl font-black font-headline mt-4 mb-2">{t("dane.cta_heading")}</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <Link to="/kalkulacky" className="bg-white text-primary font-black text-sm font-headline px-6 py-2.5 rounded-full hover:bg-primary-fixed transition-colors">
              {t("tools.calc_title")} →
            </Link>
            <Link to="/jak-zacit" className="bg-white/10 text-white font-bold text-sm font-headline px-6 py-2.5 rounded-full hover:bg-white/20 transition-colors">
              {t("tools.start_title")}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
