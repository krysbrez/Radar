import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "../components/Mascot";

const STEPS = [
  {
    number: 1,
    emoji: "🏦",
    title: "Otevři si broker účet",
    subtitle: "Trvá 10 minut. Stačí občanka.",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    content: [
      {
        type: "text",
        value: "První krok je nejdůležitější — a nejjednodušší. Potřebuješ účet u brokera, přes kterého budeš kupovat ETF nebo akcie.",
      },
      {
        type: "recommendation",
        label: "Radarovo doporučení pro začátečníky",
        value: "XTB — nulové poplatky, plná čeština, regulovaný v ČR. Registrace trvá 10 minut online.",
        link: "https://xtb.com",
      },
      {
        type: "steps",
        items: [
          "Jdi na XTB.com a klikni na 'Otevřít účet'",
          "Vyplň osobní údaje a nahraj doklad totožnosti",
          "Počkej na ověření (většinou do 24 hodin)",
          "Vložíš peníze převodem z banky (min. 0 Kč)",
        ],
      },
      {
        type: "tip",
        value: "Nespěchej. Rozkoukat se pár dní na demo účtu je naprosto v pořádku.",
      },
    ],
  },
  {
    number: 2,
    emoji: "💶",
    title: "Vlož první peníze",
    subtitle: "I 500 Kč je start. Vážně.",
    color: "bg-green-500",
    lightColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    content: [
      {
        type: "text",
        value: "Kolik potřebuješ k začátku? Méně než si myslíš. S 500 Kč měsíčně to myslíme vážně — složené úročení pracuje za tebe i z malé částky.",
      },
      {
        type: "numbers",
        items: [
          { label: "Minimum u XTB", value: "0 Kč", note: "Žádné minimum" },
          { label: "Doporučený start", value: "1 000–5 000 Kč", note: "Jednorázově" },
          { label: "Pravidelná investice", value: "500–2 000 Kč/měs", note: "DCA strategie" },
        ],
      },
      {
        type: "steps",
        items: [
          "V XTB klikni na 'Vklad' v menu",
          "Zadej částku (zkus začít s 1 000–5 000 Kč)",
          "Vyber způsob platby (bankovní převod, karta)",
          "Peníze dorazí do pár minut až 2 pracovních dnů",
        ],
      },
      {
        type: "tip",
        value: "Neinvestuj peníze, které budeš potřebovat za méně než 5 let. Nejdřív si vytvoř nouzový fond (3–6 měsíců výdajů) na spořicím účtu.",
      },
    ],
  },
  {
    number: 3,
    emoji: "📈",
    title: "Kup první ETF",
    subtitle: "S&P 500 ETF = 500 firem za cenu jedné.",
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    content: [
      {
        type: "text",
        value: "Teď přichází ta zajímavá část. ETF (Exchange-Traded Fund) je jako nákupní košík plný akcií. Koupíš jeden ETF a vlastníš kousek stovek nebo tisíců firem.",
      },
      {
        type: "recommendation",
        label: "Konkrétní ETF pro začátečníky",
        value: "iShares Core S&P 500 ETF (CSPX) — kopíruje 500 největších amerických firem. TER 0.07 % ročně. Historický výnos ~10 % ročně.",
        link: null,
      },
      {
        type: "steps",
        items: [
          "V XTB vyhledej 'CSPX' nebo 'S&P 500 ETF'",
          "Klikni na 'Koupit' → zadej počet kusů nebo částku",
          "Zvol 'Tržní příkaz' pro okamžité provedení",
          "Potvrď nákup — gratuluji, jsi investor!",
        ],
      },
      {
        type: "tip",
        value: "Nastav si pravidelný příkaz (měsíční nákup stejné částky). DCA = Dollar-Cost Averaging = nejjednodušší strategie, která funguje.",
      },
    ],
  },
];

const TRADING_EXPLAINER = [
  {
    title: "Co je trading",
    text: "Trading je častější kupování a prodávání s cílem trefit kratší pohyby ceny. Není to kouzlo, spíš rychlejší hra s vyšší šancí, že se unavíš dřív než trh.",
  },
  {
    title: "Trading vs. investování",
    text: "Investor koupí rozumnou věc a dá jí čas. Trader řeší, co udělá cena dnes, zítra nebo příští týden. Obojí existuje, ale rozhodně to není totéž.",
  },
  {
    title: "Proč to na sítích vypadá tak easy",
    text: "Protože na sítích vidíš screenshot výhry, ne dvacet špatných obchodů vedle. Trading není easy money a začátečník kvůli němu fakt nemusí hned otevírat čtyři grafy najednou.",
  },
];

function StepBlock({ step, isActive, onClick }) {
  return (
    <div
      className={`rounded-2xl border transition-all cursor-pointer ${isActive ? `${step.lightColor} ${step.borderColor} border-2` : "bg-white border-outline-variant/10 hover:border-outline-variant/25"}`}
      onClick={onClick}
    >
      <div className="p-5 flex items-center gap-4">
        <div className={`w-12 h-12 ${step.color} rounded-2xl flex items-center justify-center text-white font-black text-xl font-headline flex-shrink-0`}>
          {step.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-black uppercase tracking-wider font-headline ${isActive ? step.textColor : "text-outline"}`}>Krok {step.number}</span>
          </div>
          <p className="font-black text-primary font-headline text-base leading-tight">{step.title}</p>
          <p className="text-xs text-on-surface-variant mt-0.5">{step.subtitle}</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`text-outline flex-shrink-0 transition-transform ${isActive ? "rotate-90" : ""}`}>
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>

      {isActive && (
        <div className="px-5 pb-5 space-y-4 border-t border-outline-variant/10 pt-4">
          {step.content.map((block, i) => {
            if (block.type === "text") return <p key={i} className="text-sm text-on-surface leading-relaxed">{block.value}</p>;

            if (block.type === "recommendation") return (
              <div key={i} className={`${step.lightColor} border ${step.borderColor} rounded-xl p-4`}>
                <p className={`text-xs font-black uppercase tracking-wider mb-2 font-headline ${step.textColor}`}>{block.label}</p>
                <p className="text-sm text-on-surface leading-relaxed">{block.value}</p>
                {block.link && <a href={block.link} target="_blank" rel="noopener noreferrer" className={`text-xs font-bold mt-2 inline-block ${step.textColor}`}>Přejít na web →</a>}
              </div>
            );

            if (block.type === "steps") return (
              <ol key={i} className="space-y-2">
                {block.items.map((item, ii) => (
                  <li key={ii} className="flex items-start gap-3">
                    <span className={`w-5 h-5 ${step.color} text-white text-xs font-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>{ii + 1}</span>
                    <span className="text-sm text-on-surface leading-relaxed">{item}</span>
                  </li>
                ))}
              </ol>
            );

            if (block.type === "tip") return (
              <div key={i} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-2">
                <span className="text-base flex-shrink-0">💡</span>
                <p className="text-sm text-yellow-800 leading-relaxed">{block.value}</p>
              </div>
            );

            if (block.type === "numbers") return (
              <div key={i} className="grid grid-cols-3 gap-3">
                {block.items.map((num, ii) => (
                  <div key={ii} className="bg-white rounded-xl p-3 border border-outline-variant/10">
                    <p className="text-sm font-black text-primary font-headline">{num.value}</p>
                    <p className="text-[10px] text-outline mt-0.5">{num.label}</p>
                    <p className="text-[10px] text-on-surface-variant">{num.note}</p>
                  </div>
                ))}
              </div>
            );
            return null;
          })}
        </div>
      )}
    </div>
  );
}

export default function JakZacitPage() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(1);
  const [completed, setCompleted] = useState([]);

  const toggleComplete = (stepNum) => {
    setCompleted((prev) =>
      prev.includes(stepNum) ? prev.filter((s) => s !== stepNum) : [...prev, stepNum]
    );
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-8 pt-10 pb-12">
          <nav className="flex items-center gap-2 text-xs text-primary-fixed-dim/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Radar</Link>
            <span>›</span>
            <span className="text-primary-fixed-dim">{t("tools.start_title")}</span>
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
                <span className="text-xs font-black text-primary-fixed-dim uppercase tracking-widest font-headline">Pro naprosté začátečníky</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-4">{t("tools.start_title")}</h1>
              <p className="text-primary-fixed-dim text-lg leading-relaxed max-w-xl">{t("tools.start_subtitle")}</p>
            </div>
            <div className="hidden md:block flex-shrink-0 bg-white/10 rounded-3xl p-4">
              <Mascot size={120} mood="happy" variant="signal" trackMouse={false} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-outline font-headline">{completed.length} / {STEPS.length} kroků dokončeno</p>
            {completed.length === STEPS.length && <span className="text-xs font-black text-green-600 bg-green-100 px-2.5 py-1 rounded-full">🎉 Jsi investor!</span>}
          </div>
          <div className="h-2 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${(completed.length / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-10">
          {STEPS.map((step) => (
            <div key={step.number} className="relative">
              <StepBlock
                step={step}
                isActive={activeStep === step.number}
                onClick={() => setActiveStep(activeStep === step.number ? null : step.number)}
              />
              <button
                onClick={() => toggleComplete(step.number)}
                className={`absolute top-4 right-12 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  completed.includes(step.number) ? "bg-green-500 border-green-500" : "border-outline-variant/30 bg-white hover:border-green-300"
                }`}
              >
                {completed.includes(step.number) && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>
            </div>
          ))}
        </div>

        <section className="mb-10 rounded-2xl border border-outline-variant/10 bg-white p-6">
          <div className="max-w-3xl mb-5">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-outline font-headline">
              Trading bez iluzí
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-primary font-headline">
              Trading není povinný start.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Když jsi nový, je úplně v pohodě trading neřešit. Není to zkratka k bohatství, spíš těžší disciplína, která na internetu vypadá mnohem jednodušeji než ve skutečnosti.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TRADING_EXPLAINER.map((item) => (
              <div key={item.title} className="rounded-2xl border border-outline-variant/10 bg-surface-container-low px-5 py-5">
                <h3 className="text-base font-black text-primary font-headline">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* After steps — next resources */}
        <div className="gradient-primary rounded-2xl p-8 text-white text-center">
          <Mascot size={72} mood="happy" variant="signal" trackMouse={false} />
          <p className="text-2xl font-black font-headline mt-4 mb-2">Hotovo! Co dál?</p>
          <p className="text-primary-fixed-dim mb-6 max-w-md mx-auto">Teď, když máš základy, se můžeš ponořit hlouběji. Radar tě provede každý týden.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/knowhow" className="bg-white text-primary font-black text-sm font-headline px-6 py-2.5 rounded-full hover:bg-primary-fixed transition-colors">
              Know How sekce →
            </Link>
            <Link to="/srovnavac-brokeru" className="bg-white/10 text-white font-bold text-sm font-headline px-6 py-2.5 rounded-full hover:bg-white/20 transition-colors">
              Srovnávač brokerů
            </Link>
            <Link to="/#newsletter" className="bg-white/10 text-white font-bold text-sm font-headline px-6 py-2.5 rounded-full hover:bg-white/20 transition-colors">
              Newsletter zdarma
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
