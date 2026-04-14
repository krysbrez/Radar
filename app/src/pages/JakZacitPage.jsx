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

const ETF_EXPLAINER = [
  {
    title: "Co je vlastně ETF",
    text: "ETF je jeden fond obchodovaný na burze, ve kterém máš najednou balík firem. Místo lovení jedné akcie kupuješ celý košík.",
  },
  {
    title: "Proč je to chytrý start",
    text: "Když jedna firma zklame, celý svět ti nespadne na hlavu. ETF ti hned od začátku dává větší rozložení rizika a méně prostoru pro začátečnické přestřely.",
  },
  {
    title: "Proč je nuda někdy super",
    text: "Na začátku je docela výhra, když tvoje investice není drama seriál. Nudné neznamená špatné. Často to znamená, že můžeš klidně spát a neřešit každý den další zázračný tip.",
  },
];

const CFD_EXPLAINER = [
  {
    title: "Co jsou vlastně CFD",
    text: "CFD je sázka na pohyb ceny, ne klasické vlastnictví aktiva. Neřešíš, že něco opravdu držíš. Řešíš hlavně to, jestli cena půjde nahoru nebo dolů.",
  },
  {
    title: "Proč v tom mají lidi zmatek",
    text: "V appce to často vypadá skoro stejně jako normální nákup. Jenže koupit akcii nebo ETF je něco jiného než spekulovat na její pohyb. Ten rozdíl je menší v designu a větší v riziku.",
  },
  {
    title: "Proč to není start pro začátečníky",
    text: "CFD umí působit jednoduše, ale ve skutečnosti bývá mnohem ostřejší. Malý pohyb ceny může bolet víc, než čekáš. Začátečník fakt nemusí začínat tam, kde se kliká rychleji než přemýšlí.",
  },
];

const DCA_PRACTICE = [
  {
    title: "500 Kč měsíčně je normální start",
    text: "Nemusíš čekat, až budeš mít deset tisíc navíc. Pro začátek úplně stačí menší pravidelná částka, která ti nerozbije rozpočet ani náladu.",
  },
  {
    title: "Nemusíš trefit dokonalý moment",
    text: "Nikdo spolehlivě neví, jestli je dnešek top nebo dip. DCA je fajn právě proto, že tě netlačí hrát si na věštce s grafem v ruce.",
  },
  {
    title: "Klidný start je pořád start",
    text: "1 000 Kč měsíčně poslaných pravidelně často udělá víc práce než velké hrdinské plány, které skončí po dvou týdnech. Nuda a konzistence umí být underrated duo.",
  },
];

function StepBlock({ step, isActive, onClick }) {
  return (
    <div
      className={`rounded-2xl border transition-all cursor-pointer ${isActive ? `${step.lightColor} ${step.borderColor} border-2` : "bg-white border-white/12/10 hover:border-white/12/25"}`}
      onClick={onClick}
    >
      <div className="p-5 flex items-center gap-4">
        <div className={`w-12 h-12 ${step.color} rounded-2xl flex items-center justify-center text-white font-black text-xl font-headline flex-shrink-0`}>
          {step.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-black uppercase tracking-wider font-headline ${isActive ? step.textColor : "text-white/55"}`}>Krok {step.number}</span>
          </div>
          <p className="font-black text-white font-headline text-base leading-tight">{step.title}</p>
          <p className="text-xs text-white/65 mt-0.5">{step.subtitle}</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`text-white/55 flex-shrink-0 transition-transform ${isActive ? "rotate-90" : ""}`}>
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>

      {isActive && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/12/10 pt-4">
          {step.content.map((block, i) => {
            if (block.type === "text") return <p key={i} className="text-sm text-white/85 leading-relaxed">{block.value}</p>;

            if (block.type === "recommendation") return (
              <div key={i} className={`${step.lightColor} border ${step.borderColor} rounded-xl p-4`}>
                <p className={`text-xs font-black uppercase tracking-wider mb-2 font-headline ${step.textColor}`}>{block.label}</p>
                <p className="text-sm text-white/85 leading-relaxed">{block.value}</p>
                {block.link && <a href={block.link} target="_blank" rel="noopener noreferrer" className={`text-xs font-bold mt-2 inline-block ${step.textColor}`}>Přejít na web →</a>}
              </div>
            );

            if (block.type === "steps") return (
              <ol key={i} className="space-y-2">
                {block.items.map((item, ii) => (
                  <li key={ii} className="flex items-start gap-3">
                    <span className={`w-5 h-5 ${step.color} text-white text-xs font-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>{ii + 1}</span>
                    <span className="text-sm text-white/85 leading-relaxed">{item}</span>
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
                  <div key={ii} className="bg-white rounded-xl p-3 border border-white/12/10">
                    <p className="text-sm font-black text-white font-headline">{num.value}</p>
                    <p className="text-[10px] text-white/55 mt-0.5">{num.label}</p>
                    <p className="text-[10px] text-white/65">{num.note}</p>
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
  const completedCount = completed.length;
  const signalProgress = Math.min(78, 28 + completedCount * 14);
  const currentStage = completedCount >= 2
    ? {
        name: "Tracker",
        description: "Už nejsi jen náhodný čtenář. Začínáš vědět, co chceš sledovat a proč to pro tebe má smysl.",
        next: "Reader",
        unlock: "Přehled watchlistu a rychlý návrat k signálům a tématům, která chceš mít na očích.",
        remaining: `${Math.max(0, 3 - completedCount)} dokončené kroky v Jak začít a 1 otevřený týdenní brief`,
      }
    : {
        name: "Observer",
        description: "Rozhlížíš se, skládáš si základ a učíš se rozeznat, co je šum a co už stojí za pozornost.",
        next: "Tracker",
        unlock: "Uložené signály a klidný přehled toho, co chceš dál sledovat bez lovení v archivu.",
        remaining: `${Math.max(0, 2 - completedCount)} dokončené kroky v Jak začít`,
      };
  const signalDrivers = [
    {
      title: "Praktické kroky",
      note: `${completedCount}/${STEPS.length} hotovo v Jak začít`,
      tone: completedCount > 0 ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-white/55 bg-white border-white/12/10",
    },
    {
      title: "Know How základy",
      note: "Krátké články, které ti poskládají kontext dřív, než začneš někam klikat",
      tone: "text-white bg-white border-white/12/10",
    },
    {
      title: "Týdenní brief",
      note: "První otevřený pondělní přehled jako signál, že se k produktu vracíš smysluplně",
      tone: "text-white bg-white border-white/12/10",
    },
  ];

  const toggleComplete = (stepNum) => {
    setCompleted((prev) =>
      prev.includes(stepNum) ? prev.filter((s) => s !== stepNum) : [...prev, stepNum]
    );
  };

  return (
    <div className="min-h-screen bg-white/4">
      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-8 pt-10 pb-12">
          <nav className="flex items-center gap-2 text-xs text-white-fixed-dim/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Radar</Link>
            <span>›</span>
            <span className="text-white-fixed-dim">{t("tools.start_title")}</span>
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
                <span className="text-xs font-black text-white-fixed-dim uppercase tracking-widest font-headline">Pro naprosté začátečníky</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-4">{t("tools.start_title")}</h1>
              <p className="text-white-fixed-dim text-lg leading-relaxed max-w-xl">{t("tools.start_subtitle")}</p>
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
            <p className="text-xs font-bold text-white/55 font-headline">{completedCount} / {STEPS.length} kroků dokončeno</p>
            {completedCount === STEPS.length && <span className="text-xs font-black text-green-600 bg-green-100 px-2.5 py-1 rounded-full">🎉 Jsi investor!</span>}
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / STEPS.length) * 100}%` }}
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
                  completed.includes(step.number) ? "bg-green-500 border-green-500" : "border-white/12/30 bg-white hover:border-green-300"
                }`}
              >
                {completed.includes(step.number) && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>
            </div>
          ))}
        </div>

        <section className="mb-10 rounded-2xl border border-white/12/10 bg-white p-6">
          <div className="max-w-3xl mb-5">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55 font-headline">
              Trading bez iluzí
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white font-headline">
              Trading není povinný start.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              Když jsi nový, je úplně v pohodě trading neřešit. Není to zkratka k bohatství, spíš těžší disciplína, která na internetu vypadá mnohem jednodušeji než ve skutečnosti.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TRADING_EXPLAINER.map((item) => (
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
        </section>

        <section className="mb-10 rounded-2xl border border-purple-200 bg-purple-50 p-6">
          <div className="max-w-3xl mb-5">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-700 font-headline">
              ETF bez pozlátka
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white font-headline">
              ETF: nuda v dobrém slova smyslu.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              Nemusíš začínat něčím flashy. Pro spoustu lidí je ETF chytřejší první krok než hon na jednotlivé akcie nebo snaha být trader dřív, než vůbec víš, co sleduješ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ETF_EXPLAINER.map((item) => (
              <div key={item.title} className="rounded-2xl border border-purple-200 bg-white/90 px-5 py-5">
                <h3 className="text-base font-black text-white font-headline">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="max-w-3xl mb-5">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-700 font-headline">
              CFD bez zbytečného chaosu
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white font-headline">
              CFD není totéž co normální investování.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              Spousta lidí si plete nákup aktiva s tím, že jen spekuluješ na jeho pohyb. U CFD je právě tenhle rozdíl důležitý. Vypadá to jednoduše, ale je to podstatně ostřejší hra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CFD_EXPLAINER.map((item) => (
              <div key={item.title} className="rounded-2xl border border-amber-200 bg-white/90 px-5 py-5">
                <h3 className="text-base font-black text-white font-headline">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-green-200 bg-green-50 p-6">
          <div className="max-w-3xl mb-5">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-green-700 font-headline">
              DCA v praxi
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white font-headline">
              DCA bez hero momentu.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              DCA už na stránce máš vysvětlené. Tohle je spíš připomínka, jak vypadá klidný start v reálu: malé částky, žádné čekání na perfektní chvíli a minimum zbytečného dramatu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DCA_PRACTICE.map((item) => (
              <div key={item.title} className="rounded-2xl border border-green-200 bg-white/90 px-5 py-5">
                <h3 className="text-base font-black text-white font-headline">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 hidden md:block">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/12/10 bg-white shadow-[0_18px_60px_rgba(12,23,46,0.06)]">
            <div className="grid grid-cols-[minmax(0,1.1fr),22rem]">
              <div className="px-7 py-7">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55 font-headline">
                  Signal Level
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white font-headline">
                  Progress, který působí jako produkt. Ne jako hra.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">
                  Malý koncept pro desktop, jak může Radar ukazovat postup bez zbytečné gamifikace.
                  Ne sbírání bodů za existenci, ale klidný přehled toho, v jaké fázi se uživatel nachází,
                  co se počítá jako smysluplný progres a co dává smysl otevřít jako další vrstvu produktu.
                </p>

                <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/12/10 bg-white/5">
                  <div className="grid grid-cols-[minmax(0,1fr),18rem]">
                    <div className="px-5 py-5">
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55 font-headline">
                            Aktuální fáze
                          </p>
                          <div className="mt-3 flex items-center gap-3">
                            <p className="text-2xl font-black text-white font-headline">
                              {currentStage.name}
                            </p>
                            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white/55 font-headline">
                              {signalProgress}% do {currentStage.next}
                            </span>
                          </div>
                          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">
                            {currentStage.description}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/12/10 bg-white px-4 py-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/55 font-headline">
                            Další vrstva
                          </p>
                          <p className="mt-2 text-base font-black text-white font-headline">
                            {currentStage.next}
                          </p>
                          <p className="mt-1 max-w-[14rem] text-xs leading-relaxed text-white/65">
                            {currentStage.unlock}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="font-black uppercase tracking-[0.18em] text-white/55 font-headline">
                            Postup v Signal Level
                          </span>
                          <span className="font-bold text-white">{signalProgress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary via-indigo-500 to-sky-400 transition-all duration-500"
                            style={{ width: `${signalProgress}%` }}
                          />
                        </div>
                        <p className="mt-3 text-sm text-white/65">
                          Chybí už jen: <span className="font-bold text-white">{currentStage.remaining}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-l border-white/12/10 bg-white/4 px-6 py-7">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55 font-headline">
                  Co dává progres
                </p>
                <div className="mt-5 space-y-3">
                  {signalDrivers.map((item) => (
                    <div key={item.title} className={`rounded-2xl border px-4 py-4 ${item.tone}`}>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] font-headline">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed">
                        {item.note}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-white/12/10 bg-white px-4 py-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55 font-headline">
                    Princip
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    Progress se váže na pochopení a návrat k důležitým věcem. Ne na náhodné proklikávání, refreshování cen nebo sbírání bodů za hluk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* After steps — next resources */}
        <div className="gradient-primary rounded-2xl p-8 text-white text-center">
          <Mascot size={72} mood="happy" variant="signal" trackMouse={false} />
          <p className="text-2xl font-black font-headline mt-4 mb-2">Hotovo! Co dál?</p>
          <p className="text-white-fixed-dim mb-6 max-w-md mx-auto">Teď, když máš základy, se můžeš ponořit hlouběji. Radar tě provede každý týden.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/knowhow" className="bg-white text-white font-black text-sm font-headline px-6 py-2.5 rounded-full hover:bg-white/8 transition-colors">
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
