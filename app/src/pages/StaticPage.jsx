import { Link } from "react-router-dom";
import Mascot from "../components/Mascot";

const PAGES = {
  "o-nas": {
    title: "O nás",
    emoji: "📡",
    subtitle: "Jsme parta novinářů a analytiků, kteří věří, že finanční vzdělání by mělo být dostupné každému.",
    content: [
      "Radar vznikl v roce 2023 jako reakce na přehlcení zbytečně složitými finančními zprávami. Náš cíl je jednoduchý: přinést ti přehled o financích tak, aby to pochopil každý — bez bankovního žargonu, bez keců.",
      "Každé pondělí ráno analyzujeme trhy, filtujeme signal od šumu a píšeme newsletter pro 47 000+ čtenářů po celé České republice.",
      "Věříme, že finanční gramotnost je základ svobody. A svoboda začíná tím, že rozumíš svým penězům.",
    ],
    done: false,
  },
  "tym": {
    title: "Tým",
    emoji: "👥",
    subtitle: "Lidé za Radarem.",
    content: [
      "Petr Novák — Hlavní analytik, 12 let v investičním bankovnictví.",
      "Jana Horáčková — Krypto specialistka, bývalá DeFi researcher.",
      "Martin Veselý — Nemovitosti & makroekonomika.",
      "Tomáš Kratochvíl — Alternativní investice, youngtimery, sběratelské předměty.",
    ],
    done: false,
  },
  "inzerce": {
    title: "Inzerce",
    emoji: "📣",
    subtitle: "Dostupné formáty spolupráce s newsletterem pro 47k+ čtenářů.",
    content: [
      "Newsletter sponzoring — Exkluzivní zmínka v pondělním vydání (47k+ otevření).",
      "Branded content — Psaný článek nebo analýza ve stylu Radaru.",
      "Banner v digitálním vydání — Vizuální formát s přímým odkazem.",
      "Pro nabídky spolupráce piš na: inzerce@radar.cz",
    ],
    done: false,
  },
  "newsletter": {
    title: "Newsletter",
    emoji: "✉️",
    subtitle: "Finanční přehled každé pondělí ráno. Zdarma.",
    content: [
      "Každý týden dostaneš přehledný souhrn toho nejdůležitějšího z finančního světa.",
      "Co zahrnujeme: aktuální dění na trzích, analýza trendů, tipy pro investory, alternativní investice a vždy jeden praktický tip do života.",
      "Přes 47 000 čtenářů. Žádný spam. Odhlásit se lze jedním klikem.",
    ],
    done: false,
    cta: { label: "Přihlásit se k newsletteru →", to: "/#newsletter" },
  },
  "kontakt": {
    title: "Kontakt",
    emoji: "📬",
    subtitle: "Napiš nám. Odpovídáme do 24 hodin.",
    content: [
      "Redakce: redakce@radar.cz",
      "Inzerce & spolupráce: inzerce@radar.cz",
      "Technické problémy: tech@radar.cz",
      "Adresa: Radar Editorial Intelligence s.r.o., Na Příkopě 1, 110 00 Praha 1",
    ],
    done: false,
  },
  "podminky": {
    title: "Podmínky užití",
    emoji: "📋",
    subtitle: "Pravidla používání platformy Radar.",
    content: [
      "Radar.cz je informační platforma. Veškerý obsah slouží pouze pro vzdělávací a informační účely.",
      "Používáním tohoto webu souhlasíš s tím, že obsah nepředstavuje investiční poradenství.",
      "Reprodukce obsahu bez písemného souhlasu redakce je zakázána.",
      "Plné podmínky budou doplněny. Stránka se dokončuje.",
    ],
    done: false,
  },
  "soukromi": {
    title: "Ochrana soukromí",
    emoji: "🔒",
    subtitle: "Jak nakládáme s tvými daty.",
    content: [
      "Sbíráme pouze e-mailovou adresu pro zasílání newsletteru.",
      "Tvá data neprodáváme třetím stranám.",
      "Ke zpracování dat používáme platformy v souladu s GDPR.",
      "Svá data můžeš kdykoli smazat — stačí napsat na redakce@radar.cz.",
      "Plná Privacy Policy bude doplněna. Stránka se dokončuje.",
    ],
    done: false,
  },
  "cookies": {
    title: "Cookies",
    emoji: "🍪",
    subtitle: "Ano, máme cookies. Ne, nejsou k jídlu.",
    content: [
      "Používáme nezbytné cookies pro funkci webu (session management).",
      "Analytické cookies (anonymizovaná data pro Google Analytics).",
      "Marketingové cookies — pouze se souhlasem.",
      "Cookies nastavení lze kdykoli změnit v prohlížeči.",
      "Plná Cookie Policy bude doplněna. Stránka se dokončuje.",
    ],
    done: false,
  },
  "rizika": {
    title: "Rizika investic",
    emoji: "⚠️",
    subtitle: "Přečti si tohle, než investuješ. Vážně.",
    content: [
      "Obsah Radaru slouží pouze pro informační účely. Nejsme investiční poradci ve smyslu zákona č. 256/2004 Sb. o podnikání na kapitálovém trhu.",
      "Každá investice nese riziko ztráty — včetně ztráty celého vloženého kapitálu. Historická výkonnost nezaručuje výsledky v budoucnosti.",
      "Kryptoměny jsou extrémně volatilní aktiva. Hodnota může klesnout na nulu. Neinvestuj víc, než si můžeš dovolit ztratit.",
      "Alternativní investice (hodinky, umění, LEGO) jsou nelikvidní a regulatorně nechráněné. Trhy mohou být manipulovány.",
      "Vždy se poraď s licencovaným finančním poradcem před jakýmkoli investičním rozhodnutím. Radar je vzdělávací platforma, ne investiční doporučení.",
      "Daňové dopady investic se liší. Konzultuj s daňovým poradcem.",
    ],
    done: false,
    important: true,
  },
};

export default function StaticPage({ pageKey }) {
  const page = PAGES[pageKey];
  if (!page) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-outline mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Radar</Link>
          <span>›</span>
          <span>{page.title}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start gap-6 mb-10">
          <div className="flex-1">
            <span className="text-4xl block mb-3">{page.emoji}</span>
            <h1 className="text-3xl md:text-4xl font-black text-primary font-headline tracking-tight mb-3">{page.title}</h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">{page.subtitle}</p>
          </div>
          <div className="hidden md:block flex-shrink-0">
            <div className="bg-surface-container-low rounded-2xl p-3">
              <Mascot size={80} mood="normal" variant="idle" trackMouse={false} />
            </div>
          </div>
        </div>

        {/* Important warning banner */}
        {page.important && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8 flex gap-3">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div>
              <p className="font-black text-red-700 font-headline mb-1">Důležité upozornění</p>
              <p className="text-sm text-red-600">Obsah Radaru slouží pouze pro informační účely. Nejsme investiční poradci. Vždy se poraď s odborníkem.</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-4 mb-10">
          {page.content.map((para, i) => (
            <p key={i} className={`leading-relaxed ${page.important ? "text-on-surface" : "text-on-surface-variant"}`}>
              {page.important && i < 6 ? (
                <span className="flex gap-3">
                  <span className="text-red-400 flex-shrink-0 font-bold mt-0.5">→</span>
                  <span>{para}</span>
                </span>
              ) : para}
            </p>
          ))}
        </div>

        {/* CTA */}
        {page.cta && (
          <Link to={page.cta.to} className="inline-block gradient-primary text-white px-6 py-3 rounded-full font-bold font-headline text-sm hover:opacity-90 transition-opacity mb-10">
            {page.cta.label}
          </Link>
        )}

        {/* "Stránka se dokončuje" badge */}
        {!page.done && (
          <div className="bg-surface-container-low rounded-2xl p-6 flex items-center gap-4 mt-8">
            <div className="bg-white rounded-xl p-2 flex-shrink-0">
              <Mascot size={48} mood="happy" variant="signal" trackMouse={false} />
            </div>
            <div>
              <p className="font-black text-primary font-headline text-sm">Radar pracuje na obsahu</p>
              <p className="text-xs text-on-surface-variant mt-0.5">Tato stránka se dokončuje. Brzy tu bude plný obsah!</p>
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link to="/" className="text-sm font-bold text-primary font-headline border-b-2 border-primary-fixed-dim pb-0.5 hover:border-primary transition-colors">← Zpět na hlavní stránku</Link>
        </div>
      </div>
    </div>
  );
}

export { PAGES };
