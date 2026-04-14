import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "../components/Mascot";

const TERMS = [
  { term: "Akcie", def: "Podíl ve firmě. Koupíš akcii Applu = jsi spolumajitelem Applu (velmi malým). Firma roste → akcie roste. Firma zkrachuje → akcie jde na nulu.", example: "Jako kdybys koupil 0,0001 % pizzerie. Jde jim dobře → dostaneš podíl ze zisku." },
  { term: "Aktivní fond", def: "Fond řízený manažerem, který se snaží překonat trh výběrem akcií. 87 % aktivních fondů za 10 let za indexem zaostalo.", example: "Jako profesionál, co tipuje koně. Někdy vyhraje, ale provize žere výnosy." },
  { term: "Alokace aktiv", def: "Jak rozdělíš peníze mezi různé třídy aktiv (akcie, dluhopisy, hotovost). 60/40 portfolio = 60 % akcie, 40 % dluhopisy.", example: "Jako kdybys rozděloval jídlo na talíři: 60 % zelenina, 40 % maso." },
  { term: "Bear market", def: "Pokles trhu o více než 20 % od maxima. Trvá průměrně 9-14 měsíců. Historicky po každém medvědu přišel bull.", example: "Trh jde dolů a každý je v panice. Dobří investoři nakupují." },
  { term: "Benchmark", def: "Referenční index pro srovnání výkonnosti. S&P 500 je benchmark pro americké akciové fondy.", example: "Jako par v golfu. Pokud fond nehraje pod par (index), proč za něj platit?" },
  { term: "Bitcoin", def: "První a největší kryptoměna. Decentralizovaná digitální měna bez centrální banky. Maximální nabídka: 21 milionů.", example: "Digitální zlato. Někdo věří, že nahradí zlaté rezervy. Jiní si myslí, že je to poker." },
  { term: "Broker", def: "Zprostředkovatel, přes kterého nakupuješ a prodáváš cenné papíry. XTB, DEGIRO, Revolut jsou brokeři.", example: "Jako realitní makléř, jen pro akcie. Bere provizi (nebo ne, pokud je zadarmo)." },
  { term: "Bull market", def: "Růstový trh s nárůstem o více než 20 %. Historicky trvá déle než bear market a přináší větší zisky.", example: "Všichni jsou šťastní, akcie rostou, babičky kupují Tesla. Konec je blíž." },
  { term: "DCA", def: "Dollar-Cost Averaging. Pravidelné investování stejné částky bez ohledu na cenu. Koupíš drahé i levné — průměrná cena se vyrovná a eliminuješ timing risk. Nejjednodušší a nejefektivnější strategie pro začátečníky.", example: "Každý 1. v měsíci koupíš ETF za 1 000 Kč. V lednu za 100 Kč/kus (10 kusů), v únoru za 50 Kč (20 kusů). Průměr: 66 Kč. Trh ti pomohl — protože jsi nekoukal na ceny." },
  { term: "Deficit", def: "Když vládní výdaje převyšují příjmy. Vláda si půjčuje peníze vydáváním dluhopisů.", example: "Jako kdybys každý měsíc utrácel o 5000 Kč víc, než vyděláš, a záplatoval to kreditkou." },
  { term: "Derivát", def: "Finanční instrument odvozený od jiného aktiva (akcie, index, komodita). Opce, futures, CFD jsou deriváty.", example: "Sázka na to, co se stane s cenou aktiva, aniž bys ho vlastnil. Vysoce riskantní." },
  { term: "Diverzifikace", def: "Rozložení investic do různých aktiv, sektorů nebo regionů pro snížení rizika.", example: "Nedávej všechna vejce do jednoho košíku. Buffett radí ETF — automatická diverzifikace." },
  { term: "Dividenda", def: "Podíl ze zisku, který firma vyplatí akcionářům. Ne všechny firmy vyplácejí dividendy.", example: "Každý rok ti firma pošle část zisku. Jako nájem z pronájmu, ale z akcií." },
  { term: "Dluhopis", def: "Půjčuješ peníze firmě nebo státu. Za to dostáváš pravidelný úrok a na konci i jistinu zpět.", example: "Jako kdybys půjčil státu 10 000 Kč na 5 let za 3 % úrok ročně." },
  { term: "ETF", def: "Exchange-Traded Fund. Fond obchodovaný na burze, kopírující index jako S&P 500. Nízké poplatky, automatická diverzifikace.", example: "Koupíš jeden ETF = koupíš 500 amerických firem najednou. Levně a jednoduše." },
  { term: "Forex", def: "Foreign Exchange. Trh s měnami. Největší finanční trh světa — $7,5 bilionu denně.", example: "Měníš koruny na eura před dovolenou? Právě jsi byl na forexu." },
  { term: "Halving", def: "Bitcoinová událost každé 4 roky, kdy se sníží odměna těžařů na polovinu. Historicky předchází rally.", example: "Jako kdyby zlatý důl začal těžit polovinu zlata. Méně nabídky → potenciálně vyšší cena." },
  { term: "Hedge", def: "Zajišťovací strategie pro snížení rizika portfolia. Jako pojistka proti nepříznivému vývoji.", example: "Pojišťovna si pojistí sama sebe. Investor koupí opce jako pojistku proti pádu." },
  { term: "Hodnota", def: "Vnitřní hodnota aktiva na základě fundamentální analýzy. Odlišná od tržní ceny.", example: "Firma vydělává 100 Kč/rok. Nabízí se za 500 Kč. P/E = 5. Levná? Možná ano." },
  { term: "Inflace", def: "Nárůst cen v čase. Peníze ztrácejí kupní sílu. Cíl ČNB: 2 % ročně.", example: "Pizza za 100 Kč v 2014 = 180 Kč v 2024. Peníze musí vydělávat víc než inflace." },
  { term: "IPO", def: "Initial Public Offering. Vstup firmy na burzu. První den prodeje akcií veřejnosti.", example: "Jako nová restaurace, co se otevírá pro veřejnost. Hodně PR, ale výsledky až ukáže čas." },
  { term: "Kapitalizace", def: "Tržní hodnota firmy = počet akcií × cena akcie. Apple ~$3 biliony.", example: "Kolik by stálo koupit celou firmu za aktuální cenu akcií." },
  { term: "Komodita", def: "Fyzické suroviny — zlato, ropa, pšenice, měď. Obchodují se na komoditních burzách.", example: "Zlato ve trezoru nebo ETF na zlato — oba způsoby jsou investice do komodit." },
  { term: "Korekce", def: "Pokles trhu o 10–20 % od maxima. Zdravá součást každého bull marketu.", example: "Jako dech v závodě. Trh si odpočine, potom běží dál. Panikovat je chyba." },
  { term: "Kryptoměna", def: "Digitální měna na decentralizované blockchainu. Bitcoin, Ethereum a tisíce altcoinů.", example: "Digitální peníze bez centrální banky. Volatilní jako roller coaster, ale s potenciálem." },
  { term: "Leverage", def: "Páka. Investuješ víc, než máš — s půjčenými penězi. Násobí zisky i ztráty.", example: "Páka 10:1 = za 10 000 Kč kontroluješ 100 000 Kč. Ztráta 10 % = ztratíš vše." },
  { term: "Likvidita", def: "Jak snadno lze aktivum prodat za spravedlivou cenu. Akcie = vysoká likvidita. Nemovitost = nízká.", example: "Apple akcie prodáš za 1 sekundu. Byt prodáváš 3 měsíce." },
  { term: "MSCI World", def: "Index obsahující ~1 500 firem z 23 vyspělých zemí. Populární benchmark pro globální investory.", example: "Jako S&P 500, ale pro celý svět. ETF na MSCI World = automatická globální diverzifikace." },
  { term: "Opce", def: "Právo (ne povinnost) koupit nebo prodat aktivum za předem stanovenou cenu do určitého data.", example: "Záloha na byt. Máš právo koupit za 5M do konce roku. Cena vzroste → využiješ. Klesne → opci hodíš." },
  { term: "P/E ratio", def: "Price-to-Earnings. Cena akcie dělená ročním ziskem. Ukazuje, kolik platíš za korunu zisku.", example: "P/E 20 = za firmu platíš 20× roční zisk. Nízké P/E může znamenat levnou akcii." },
  { term: "Pasivní investování", def: "Strategie kopírování indexu místo výběru akcií. Nízké náklady, dlouhodobě překonává aktivní fondy.", example: "Koupíš ETF, necháš ho být 20 let. Jednoduchá strategie, která funguje." },
  { term: "Portfolio", def: "Soubor všech tvých investic. Akcie, ETF, dluhopisy, nemovitosti, krypto dohromady.", example: "Jako zásobník v lednici. Co tam máš dnes? To je tvoje portfolio." },
  { term: "REIT", def: "Real Estate Investment Trust. Akciový fond investující do nemovitostí. Dividendový výnos 4–7 %.", example: "Nemovitosti bez starostí s nájemníky. Koupíš ETF, dostáváš dividendy z pronájmů." },
  { term: "Rebalancování", def: "Úprava portfolia zpátky na cílovou alokaci. Akcie vzrostly na 70 %? Prodej část, dokup dluhopisy.", example: "Pravidelný servis auta. Jednou za rok zkontrolov a vylaď." },
  { term: "S&P 500", def: "Index 500 největších amerických firem. Historický výnos ~10 % ročně. Zlatý standard investování.", example: "Koupíš ETF na S&P 500 = vlastníš kousek Applu, Microsoftu, Amazonu a dalších 497 firem." },
  { term: "Spořicí účet", def: "Bankovní produkt s úrokem. V ČR aktuálně 3–4 %. Po inflaci reálný výnos ~0–1 %.", example: "Dobrý pro nouzový fond (3-6 měsíců výdajů). Jako investice dlouhodobě nestačí." },
  { term: "Technická analýza", def: "Předpovídání budoucích pohybů ceny z historických grafů a vzorců. Kontroverzní metoda.", example: "Čtení čajových lístků ve světě financí. Někdo věří, někdo ne." },
  { term: "TER", def: "Total Expense Ratio. Roční poplatek fondu. S&P 500 ETF má TER 0.07 %. Aktivní fond 1–2 %.", example: "Rozdíl 1 % ročně za 30 let = o 26 % méně peněz ve tvém portfoliu. Každý základ TER." },
  { term: "Tržní kapitalizace", def: "Celková hodnota firmy = počet akcií × cena. Apple přes $3 biliony USD.", example: "Kolik by tě stálo koupit celou firmu za aktuální cenu akcií." },
  { term: "Úrok", def: "Cena peněz v čase. Platíš úrok za půjčku, dostáváš úrok za vklad nebo dluhopis.", example: "Hypotéka 5 % ročně na 3M = platíš 150 000 Kč ročně za půjčení peněz." },
  { term: "Valuace", def: "Ocenění firmy nebo aktiva. Je akcie levná nebo drahá v porovnání se ziskem a růstem?", example: "Tesla P/E 60 vs. Ford P/E 7. Tesla je dražší — ale proč? Trh věří v rychlejší růst." },
  { term: "Volatilita", def: "Míra kolísání ceny aktiva. Krypto = vysoká volatilita. Státní dluhopisy = nízká volatilita.", example: "Bitcoin může v jeden den +10 %, druhý den -15 %. To je volatilita." },
  { term: "Výnos", def: "Zisk z investice vyjádřený jako procento z vloženého kapitálu. Nominální vs. reálný (po inflaci).", example: "Vložíš 100 000 Kč, za rok máš 110 000 Kč. Výnos = 10 %." },
  { term: "Whale", def: "Investor s obrovskou pozicí v kryptoměně. Když whale prodává, cena trhu může klesat.", example: "Jeden člověk drží 5 % všech Bitcoinů. Když prodá, trh to pocítí." },
  { term: "Yield", def: "Výnosnost aktiva, typicky vyjádřená ročně v procentech. Dividendový yield, výnos nemovitosti.", example: "Pronájem za 15 000 Kč/měs z bytu za 5M = yield 3.6 % ročně." },
  { term: "Zlato", def: "Tradiční uchovatel hodnoty a pojistka v krizích. Neplatí dividendy, ale drží hodnotu déle než tisíciletí.", example: "V době válek, inflace a krize zlato drží hodnotu. Proto ho centrální banky hromadí." },
  { term: "Složené úročení", def: "Úrok z úroku. Výnosy reinvestuješ → příští rok generuješ výnosy i z výnosů. Einstein prý říkal 8. div světa.", example: "10 000 Kč při 10 % ročně: 10 let = 25 937 Kč. 30 let = 174 494 Kč. Čas je tvůj přítel." },
  { term: "Index fund", def: "Fond kopírující složení konkrétního indexu (S&P 500, MSCI World). Pasivní strategie s nízkými náklady.", example: "Jako taxi do letiště vs. Uber. Přijede, kam chceš, ale s ETF platform platíš méně." },
  { term: "Kreditní rating", def: "Hodnocení schopnosti dlužníka splácet dluhy. AAA = nejlepší. Junk = riziková kategorie.", example: "Jako kreditní skóre v bance, ale pro státy a firmy." },
  { term: "Deflace", def: "Pokles cen. Zní hezky, ale pro ekonomiku je horší než inflace — lidé čekají s nákupy.", example: "Japonsko zažilo deflaci 30 let. Ekonomika stagnovala. Inflace 2 % > deflace." },
  { term: "FED", def: "Federal Reserve. Americká centrální banka. Rozhoduje o úrokových sazbách USA a tím ovlivňuje celý svět.", example: "Když FED zvýší sazby, drahé jsou půjčky po celém světě. Každý to pocítí." },
  { term: "Recese", def: "Ekonomický pokles — HDP klesá dvě čtvrtletí za sebou. Firmy propouštějí, spotřeba klesá, nálada je mizerná.", example: "Jako kocovina po velké párty. Chvíli to bolí, ale pak se ekonomika otřepe a jde dál." },
  { term: "HDP", def: "Hrubý domácí produkt. Celková hodnota všeho, co se v zemi vyrobí a poskytne za rok. Měří velikost ekonomiky.", example: "ČR HDP ~7 bilionů Kč. Roste o 2 % ročně? Daří se nám. Klesá? Problém." },
  { term: "Index", def: "Koš cenných papírů sledující výkon určitého trhu nebo sektoru. S&P 500, MSCI World, PX jsou indexy.", example: "Jako žebříček top 500 firem USA. Průměrná cena všech = hodnota indexu." },
  { term: "Short selling", def: "Sázka na pokles ceny. Půjčíš si akcie, prodáš je, koupíš zpět levněji a rozdíl je zisk. Riziko: neomezená ztráta.", example: "Shortuješ Gamestop za $20. Cena jde na $5. Zisk $15. Ale jde na $400? Bankrot." },
  { term: "Margin", def: "Obchodování s půjčenými penězi od brokera. Amplifikuje zisky i ztráty. Při velkém poklesu margin call = musíš doplatit.", example: "Máš 50 000 Kč, broker ti půjčí dalších 50 000 Kč. Teď obchoduješ za 100 000 Kč. Riskantní hra." },
  { term: "Futures", def: "Kontrakt na nákup/prodej aktiva za předem sjednanou cenu v budoucnosti. Využívají zemědělci, firmy i spekulanti.", example: "Pilot kupuje futures na kerosin — fixuje cenu nafty na příští rok. Farmer prodává futures na pšenici před sklizní." },
  { term: "Blue chip", def: "Akcie velké, zavedené a finančně stabilní firmy. Apple, Microsoft, Nestlé. Nižší riziko, stabilní dividendy.", example: "Jako Mercedes mezi auty. Nejedeš nejrychleji, ale nespadneš do příkopu." },
  { term: "Small cap", def: "Firma s tržní kapitalizací pod ~2 miliardy USD. Vyšší potenciál růstu, ale také vyšší riziko.", example: "Malá česká firma na burze. Může 10× narůst — nebo zkrachovat. Loterie s lepšími šancemi." },
  { term: "Mid cap", def: "Firma s tržní kapitalizací 2–10 miliard USD. Zlatá střední cesta mezi stabilitou blue chipů a růstem small caps.", example: "Firma, co už není startup, ale ještě není gigant. Zajímavá kombinace růstu a stability." },
  { term: "Penny stocks", def: "Akcie s cenou pod 5 USD (nebo 1 USD). Obrovské riziko, nízká likvidita, oblíbené místo podvodů.", example: "'Tato akcie za 0,01 Kč bude za rok 10 Kč!' — říká každý podvod. 99 % penny stocks jde na nulu." },
  { term: "Hedge fund", def: "Privátní investiční fond pro bohaté investory. Používá agresivní strategie — shorting, leverage, deriváty. Vstup od ~1M USD.", example: "Exkluzivní klub pro lidi, co mají víc peněz než ty a já. Někdy vydělají hodně, někdy prodělají víc." },
  { term: "Private equity", def: "Investice do soukromých (neburzovních) firem. PE fond koupí firmu, opraví ji a za 5–7 let prodá se ziskem.", example: "Koupíš pizzerii za 5M, dáš do ní 2M na renovaci, prodáš za 12M. To je private equity v malém." },
  { term: "Venture capital", def: "Rizikový kapitál pro startupy a raná stádia firem. VC fond investuje do 10 startupů a čeká, že 1 bude Uber.", example: "Investuješ do 10 kamarádů s nápady. 9 selže. Jeden udělá Spotify. Tohle je VC." },
  { term: "ROI", def: "Return on Investment. Výnosnost investice = (zisk / vložená částka) × 100 %. Univerzální měřítko efektivity.", example: "Koupíš kurz za 5 000 Kč, dostaneš práci s platem +3 000 Kč/měs. ROI za rok = 620 %." },
  { term: "ROE", def: "Return on Equity. Výnosnost vlastního kapitálu firmy. Jak efektivně firma využívá peníze akcionářů.", example: "Firma má 100M vlastního kapitálu a vydělá 20M. ROE = 20 %. Buffett chce min. 15 %." },
  { term: "EBITDA", def: "Zisk před úroky, zdaněním, odpisy a amortizací. Ukazuje provozní výkonnost firmy bez účetních triků.", example: "Jako plat před daněmi a před splátkou hypotéky. Co firma reálně vydělá ze svého byznysu." },
  { term: "Bid/Ask spread", def: "Rozdíl mezi nákupní (ask) a prodejní (bid) cenou aktiva. Výdělek brokera nebo market makera.", example: "Měníš eura: banka nakupuje za 24,50 Kč a prodává za 25,50 Kč. Ten 1 Kč rozdíl je spread." },
  { term: "Časový test", def: "Česká daňová výhoda: pokud držíš cenné papíry déle než 3 roky (nebo krypto 3 roky), zisk je od daně osvobozen. Jeden z nejlepších legálních daňových úniků.", example: "Koupíš ETF v lednu 2023. Prodáš v únoru 2026. Zisk 200 000 Kč — daň = 0 Kč. Trpělivost se vyplácí doslova." },
  { term: "DIP", def: "Dlouhodobý Investiční Produkt. Nový český daňový nástroj od 2024. Investuješ přes DIP → odečteš až 48 000 Kč/rok ze základu daně → ušetříš až 7 200 Kč na daních.", example: "Vyděláváš 50 000 Kč/měs. Vložíš 4 000 Kč/měs do DIP. Stát ti vrátí 7 200 Kč v daňovém přiznání. Lepší bonus než Tesco Club." },
  { term: "Dividendový výnos", def: "Roční dividenda vydělená cenou akcie, vyjádřená v %. Říká ti, kolik procent ceny akcie dostaneš ročně zpět jako dividendu.", example: "Akcie stojí 1 000 Kč a vyplácí 40 Kč dividendu ročně. Dividendový výnos = 4 %. Jako nájemní yield, ale z akcií." },
  { term: "Pasivní příjem", def: "Příjem, který přichází bez aktivní práce — dividendy, nájemné, úroky. Cíl každého dlouhodobého investora.", example: "Portfolio 5 000 000 Kč při 4% výnosu = 200 000 Kč/rok = 16 667 Kč/měsíc. Bez práce. Na to je složené úročení." },
  { term: "Finanční svoboda", def: "Stav, kdy pasivní příjem pokrývá tvé výdaje. Nemusíš pracovat pro peníze — pracuješ proto, že chceš. Cíl FIRE hnutí.", example: "Výdaje 30 000 Kč/měs = potřebuješ portfolio 9 000 000 Kč (pravidlo 4%). Každá koruna investovaná dnes tě tam přibližuje." },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁČĎÉĚÍŇÓŘŠŤÚŮŽÝ".split("").filter((c, i, arr) => arr.indexOf(c) === i);

export default function SlovnikPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState(null);
  const [openTerm, setOpenTerm] = useState(null);

  const filtered = useMemo(() => {
    return TERMS.filter((item) => {
      const matchSearch = !query || item.term.toLowerCase().includes(query.toLowerCase()) || item.def.toLowerCase().includes(query.toLowerCase());
      const matchLetter = !activeLetter || item.term.toUpperCase().startsWith(activeLetter);
      return matchSearch && matchLetter;
    }).sort((a, b) => a.term.localeCompare(b.term, "cs"));
  }, [query, activeLetter]);

  const availableLetters = [...new Set(TERMS.map((t) => t.term[0].toUpperCase()))].sort((a, b) => a.localeCompare(b, "cs"));

  return (
    <div className="min-h-screen bg-white/4">
      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-5xl mx-auto px-6 md:px-8 pt-10 pb-12">
          <nav className="flex items-center gap-2 text-xs text-white-fixed-dim/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Radar</Link>
            <span>›</span>
            <span className="text-white-fixed-dim">{t("tools.glossary_title")}</span>
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-4">
                {t("tools.glossary_title")}
              </h1>
              <p className="text-white-fixed-dim text-lg leading-relaxed max-w-xl">
                {t("tools.glossary_subtitle")}
              </p>
            </div>
            <div className="hidden md:block flex-shrink-0 bg-white/10 rounded-3xl p-4">
              <Mascot size={100} mood="thinking" variant="idle" trackMouse={false} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-8">
        {/* Search */}
        <div className="relative mb-5">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-white/55" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder={t("slovnik.placeholder")}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveLetter(null); }}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-white/12/20 rounded-xl text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#ffd700]/40/40 transition-colors shadow-sm"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/55 hover:text-white transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>

        {/* Alphabet filter */}
        <div className="flex flex-wrap gap-1 mb-8">
          <button
            onClick={() => setActiveLetter(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold font-headline transition-all ${!activeLetter ? "gradient-primary text-white" : "bg-white border border-white/12/20 text-white/65 hover:border-white/12/40"}`}
          >
            {t("slovnik.all_btn")}
          </button>
          {availableLetters.map((letter) => (
            <button
              key={letter}
              onClick={() => { setActiveLetter(activeLetter === letter ? null : letter); setQuery(""); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold font-headline transition-all ${activeLetter === letter ? "gradient-primary text-white" : "bg-white border border-white/12/20 text-white/65 hover:border-white/12/40"}`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-white/55 mb-4">{t("slovnik.count", { count: filtered.length })}</p>

        {/* Terms list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-white/65">{t("slovnik.not_found")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((item) => (
              <button
                key={item.term}
                onClick={() => setOpenTerm(openTerm === item.term ? null : item.term)}
                className="w-full text-left bg-white rounded-xl border border-white/12/10 hover:border-white/12/30 transition-all overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="font-black text-white font-headline">{item.term}</span>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    className={`text-white/55 flex-shrink-0 transition-transform ${openTerm === item.term ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
                {openTerm === item.term && (
                  <div className="px-5 pb-4 border-t border-white/12/10 pt-4 space-y-3">
                    <p className="text-sm text-white/85 leading-relaxed">{item.def}</p>
                    <div className="bg-white/5 rounded-lg px-4 py-2.5 flex gap-2">
                      <span className="text-xs font-black text-white/55 uppercase tracking-wider font-headline flex-shrink-0 pt-0.5">{t("slovnik.example_label")}</span>
                      <p className="text-xs text-white/65 leading-relaxed italic">{item.example}</p>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
