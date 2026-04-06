# 📡 RADAR — Projektové poznámky & TODO

*Poslední update: 4. dubna 2026*

---

## 🎯 Vize

Česko-slovenská finanční platforma pro mladé. Vše pod jednou střechou — newsletter, investice, hlídač cen, alternativní aktiva. Cíl: expandovat po EU, každá země má vlastní jazyk a lokální platformy.

**Claim:** *"Mapujeme chaos, tvoříme zisky."*
**Vibe:** Kamarád co rozumí penězům. Casual, vtipný, nikdy neříká co koupit.
**Inspirace:** Milk Road (USA) — začali jedním emailem, prodali za $2M

---

## 🏗️ Co stavíme

### Hlavní produkt — Web + App
```
RADAR
├── Newsletter (hlavní kotva)
├── Investování (akcie, krypto, forex)
├── Nemovitosti
├── Auta
├── Alternativní investice
├── Hlídač cen (killer feature)
└── Portfolio tracker
```

### Killer feature — Hlídač cen
- Uživatel nastaví alert: "BMW E46 do 150k na Sauto.cz"
- Agent hlídá 24/7, pošle notifikaci
- Nikdo jiný v CZ/SK tohle nedělá pořádně
- EU expanze: každá země = lokální platformy

---

## 📋 SEKCE WEBU

### ✅ Hotové (základ)
- [x] Základní React app od Claude Code
- [x] Maskot "Radárek" — cartoon radarová anténa
- [x] DESIGN.md — kompletní design systém
- [x] GitHub repo (krysbrez/radar)
- [x] Beehiiv účet (radarinvest.beehiiv.com)

### ❌ Nedodělané — WEB
- [ ] Navigace — klik na sekci = scroll
- [ ] Světlé pozadí (maskot mizí v tmavém)
- [ ] Každý článek rozkliknutelný (/clanek/[id])
- [ ] Archiv článků (/archiv)
- [ ] Detail článku stránka
- [ ] Mobile menu funkční
- [ ] Footer — všechny linky funkční
- [ ] Newsletter signup formulář
- [ ] Kontaktní stránka

### ❌ Nedodělané — SEKCE

**Investování:**
- [ ] 3+ články s obsahem
- [ ] Portfolio tracker (ticker, počet, cena)
- [ ] Live ceny (Yahoo Finance API)

**Krypto:**
- [ ] 3+ články
- [ ] Top 5 kryptoměn tabulka s % změnou

**Forex:**
- [ ] 3+ články
- [ ] Měnové páry EUR/CZK, USD/CZK, GBP/CZK

**Nemovitosti:**
- [ ] 3+ články rozkliknutelné
- [ ] Hlídač cen formulář (lokalita, typ, max cena)
- [ ] Sreality.cz scraping (fáze 2)

**Auta:**
- [ ] 3+ články rozkliknutelné
- [ ] Radar Youngtimer Index (interaktivní tabulka)
- [ ] Hlídač cen formulář (značka, model, rok, cena)
- [ ] "Věděli jste?" rotující fakta
- [ ] Sauto.cz scraping (fáze 2)

**Alternativní investice:**
- [ ] Každá kategorie rozkliknutelná na vlastní stránku
- [ ] Hodinky (Rolex & Patek indexy)
- [ ] Zlato & Stříbro (spot + ETF)
- [ ] Sneakers (StockX & GOAT data)
- [ ] Víno & Whisky (Liv-ex Fine Wine 100)
- [ ] Umění (Art Basel data)
- [ ] Diamanty (naturals vs. lab-grown)
- [ ] **Pokémoni** (PSA grading, Charizard, Pikachu ceny)
- [ ] Každá stránka: úvod, ceny, 3 články, tip pro začátečníky

---

## 🔔 Hlídač cen — detailní plán

### CZ/SK
| Kategorie | Platforma |
|---|---|
| Auta | Sauto.cz |
| Nemovitosti | Sreality.cz |
| Zboží | Heureka.cz |

### EU expanze
| Země | Auta | Nemovitosti |
|---|---|---|
| 🇩🇪 DE | Mobile.de | Immoscout24.de |
| 🇪🇸 ES | Coches.net | Idealista.es |
| 🇵🇱 PL | Otomoto.pl | Otodom.pl |
| 🇸🇰 SK | Autobazar.eu | Nehnutelnosti.sk |

### Jak funguje
```
Uživatel nastaví alert
↓
Python agent scrapeuje každých X hodin
↓
Pokud match → email/push notifikace
↓
Uživatel klikne → jde přímo na inzerát
```

---

## 📊 Portfolio Tracker
- Zadáš ticker, počet kusů, nákupní cenu
- Vidíš aktuální hodnotu (Yahoo Finance)
- Funguje pro akcie + krypto
- Importovat CSV z brokera (Revolut, XTB, Degiro)
- Vše na jednom místě bez přeskakování mezi brokery
- **Jen sledování, ne napojení přes API** (žádná regulace)

---

## 💰 Free vs Radar+

| Funkce | Free | Radar+ (99-149 Kč/měsíc) |
|---|---|---|
| Newsletter | ✅ | ✅ |
| Web + články | ✅ | ✅ |
| Live ceny | ✅ | ✅ |
| Portfolio tracker (5 položek) | ✅ | Neomezený |
| Hlídač cen (1 alert) | ✅ | Neomezených |
| Hlídač EU platforem | ❌ | ✅ |
| Hloubkové analýzy | ❌ | ✅ |
| Export portfolia | ❌ | ✅ |
| Bez reklam | ❌ | ✅ |

**Roční plán:** 799 Kč/rok

---

## 🤖 AI Agent tým

```
TY (CEO)
│
├── 📝 Content Agent "Redaktor"
│   Píše články a newsletter každý týden
│   Styl: casual, vtipný, bez finančního žargonu
│   Model: Claude API
│
├── 🔍 Research Agent "Analytik"
│   Scrapeuje zprávy, trhy, Sauto, Sreality denně
│   Hledá zajímavé příležitosti
│   Model: Claude + Python
│
├── 📱 Social Agent "Markeťák"
│   Z článků dělá posty na Instagram, TikTok, Twitter
│   Generuje hooks, captions, hashtagy
│   Inspirace: @investicni_skola_ styl ale jiné zaměření
│   Model: Claude API
│
├── 🔔 Alert Agent "Hlídač"
│   24/7 monitoruje ceny aut, bytů, zboží
│   Posílá notifikace uživatelům
│   Model: Python scraping + Claude
│
├── 📧 Newsletter Agent "Editor"
│   Formátuje a odesílá přes Beehiiv API
│   Model: Claude API
│
└── 📊 Analytics Agent "Reportér"
    Týdenní report — subscribers, otevřenost, revenue
    Model: Claude + Beehiiv API
```

**Komunikace:** Přes Telegram (stejný stack jako Trading Agent)

---

## 📱 Social Media strategie
- Instagram: krátké vzdělávací posty, memy o trzích
- TikTok: rychlé tipy, market updates
- Twitter/X: live komentář k trhům
- **Vše generuje Social Agent automaticky**
- Cíl: mladí 18-30 let, CZ/SK

---

## 🌍 EU Expanze — plán

```
Fáze 1: CZ + SK (teď)
Fáze 2: PL (největší trh ve V4)
Fáze 3: DE (největší EU ekonomika)
Fáze 4: ES (mladá populace, investiční zájem)
```

**Jak funguje lokalizace:**
- Web se automaticky přeloží podle země uživatele
- Hlídač cen scrapeuje lokální platformy
- Newsletter v lokálním jazyce
- Lokální sponzoři a affiliate partneři

---

## 💵 Monetizace

| Zdroj | Kdy | Odhad |
|---|---|---|
| Newsletter sponzoři | 1000+ subscribers | 3-8k Kč/email |
| Radar+ subscription | Měsíc 3-4 | 99-149 Kč/měsíc |
| Affiliate (brokeři) | Od začátku | % z registrace |
| B2B hlídač pro firmy | Měsíc 6+ | 499 Kč/měsíc/firma |

**Cíl rok 1:** 5000 subscribers → 250 platících → 25 000 Kč/měsíc pasivně

---

## 🛠️ Tech Stack

| Co | Nástroj |
|---|---|
| Frontend | React + Tailwind |
| Backend | Python (stejný stack jako Trading Agent) |
| Databáze | Supabase (free tier) |
| Newsletter | Beehiiv API |
| Hosting | Vercel (free) |
| Design | Google Stitch + DESIGN.md |
| Live ceny | Yahoo Finance API |
| Scraping | Python (BeautifulSoup/Playwright) |
| AI mozek | Claude API přes OpenRouter |
| Automatizace | Cowork + Claude Code + ChatGPT Codex |
| Notifikace | Telegram Bot (znáš z Trading Agenta) |
| Verzování | GitHub (krysbrez/radar) |

---

## 📅 Roadmap

```
TÝDEN 1-2 (TEĎ)
→ Web funguje základně — všechny sekce, vše klikatelné
→ Světlý design, maskot viditelný
→ Newsletter #1 odeslaný

MĚSÍC 1
→ Hlídač cen MVP (Sauto + Sreality)
→ Portfolio tracker základní
→ Live ceny na webu
→ Nasazení na Vercel (radar.cz nebo radar.app)

MĚSÍC 2
→ Content Agent automatizuje newsletter
→ Social Agent — Instagram posty
→ Alert notifikace emailem

MĚSÍC 3
→ Radar+ spuštění (placená verze)
→ Analytics Agent
→ První sponzoři v newsletteru

MĚSÍC 4-6
→ SK verze
→ B2B hlídač pro firmy
→ EU expanze příprava

MĚSÍC 6+
→ PL, DE, ES verze
→ Plný AI agent tým
→ Cílení 50 000+ subscribers
```

---

## 🎨 Design

- **Barvy:** #001F3F (tmavá modrá), #f8f9fa (světlé pozadí), #ffd700 (zlatá akcent)
- **Font:** Manrope (headlines) + Inter (body)
- **Maskot:** "Radárek" — cartoon radarová anténa, velké oči, zlatá anténa
  - Normal: houpání, sleduje myš, mrkání
  - Excited: vyskakuje, jazyk ven (našel příležitost)
  - Thinking: tečky (načítání dat)
  - Surprised: hvězdičky (breaking news)
- **Styl:** Světlé pozadí, žádné tmavé plochy kde maskot mizí
- **Vibe:** Milk Road — casual, vtipný, ne jako kurzy.cz nebo Bulios

---

## 📝 Newsletter

- **Platforma:** Beehiiv (radarinvest.beehiiv.com)
- **Frekvence:** Každé pondělí ráno
- **Struktura:**
  ```
  👋 Úvod (2-3 věty, casual)
  📊 Číslo týdne
  ₿ Krypto
  📈 Akcie & Forex
  🏠 Nemovitosti nebo 🚗 Auta
  💡 Tip týdne
  Footer: "Radar není investiční poradce."
  ```
- **První číslo:** Připraveno, čeká na odeslání

---

## ⚠️ Důležité poznámky

1. **Radar NENÍ investiční poradce** — jen informace, žádná doporučení
2. **Nejdřív validace, pak automatizace** — stejná logika jako Trading Agent
3. **Newsletter první, složité featury druhé**
4. **Nedělat vše najednou** — lépe jedna věc hotová než deset napůl
5. **Registrace bez bolesti** — Google/Apple sign-in, žádné formuláře
6. **Mladá audience** — 18-30 let, casual jazyk, žádný bankovní žargon

---

## 🔗 Důležité linky

- GitHub: https://github.com/krysbrez/radar
- Beehiiv: radarinvest.beehiiv.com
- Dev server: http://localhost:5173
- Design tool: stitch.withgoogle.com
- Trading Agent: ~/Desktop/TradingAgent/

---

*Poznámka pro AI asistenty: Krystof je středoškolský student v CZ, sportovec, má rozjetý Python Trading Agent. Preferuje casual češtinu, krátké odpovědi. Python stack zná dobře.*
