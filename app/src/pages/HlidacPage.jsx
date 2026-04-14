import { useState } from "react";
import { Link } from "react-router-dom";
import Mascot from "../components/Mascot";

const TABS = [
  { id: "nemovitosti", label: "🏠 Nemovitosti" },
  { id: "auta", label: "🚗 Auta" },
  { id: "alt", label: "💎 Alt. investice" },
];

function SuccessBanner({ onReset }) {
  return (
    <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-2xl p-8 text-center">
      <p className="text-4xl mb-3">✅</p>
      <h3 className="text-xl font-black text-emerald-400 font-headline mb-2">Hlídání je zapnuté!</h3>
      <p className="text-emerald-400/70 text-sm mb-4">Radar tě upozorní, jakmile se cena pohne. Hlídáme nonstop.</p>
      <button
        onClick={onReset}
        className="text-sm font-bold text-emerald-400 underline underline-offset-2"
      >
        Nastavit další hlídání →
      </button>
    </div>
  );
}

const inputClass = "w-full bg-white/8 border border-white/10 focus:border-[#ffd700]/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/35 outline-none transition-colors";

function NemovitostiForm() {
  const [form, setForm] = useState({ typ: "byt", lokalita: "", maxCena: "", minPlocha: "", email: "" });
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) return <SuccessBanner onReset={() => setSent(false)} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Typ nemovitosti</label>
          <select value={form.typ} onChange={e => set("typ", e.target.value)} className={inputClass}>
            <option value="byt">Byt</option>
            <option value="dum">Rodinný dům</option>
            <option value="pozemek">Pozemek</option>
            <option value="komerc">Komerční prostor</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Lokalita</label>
          <input type="text" placeholder="Praha, Brno, Ostrava..." value={form.lokalita} onChange={e => set("lokalita", e.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Max. cena (Kč)</label>
          <input type="number" placeholder="5 000 000" value={form.maxCena} onChange={e => set("maxCena", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Min. plocha (m²)</label>
          <input type="number" placeholder="50" value={form.minPlocha} onChange={e => set("minPlocha", e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Tvůj email <span className="text-red-400">*</span></label>
        <input type="email" required placeholder="petr@email.cz" value={form.email} onChange={e => set("email", e.target.value)} className={inputClass} />
      </div>

      <div className="bg-sky-500/8 border border-sky-500/20 rounded-xl p-3 text-xs text-sky-300">
        📡 Radar hlídá <strong>Sreality, Bezrealitky, Reality.cz</strong> a 10 dalších portálů. Nové nabídky dostaneš do hodiny.
      </div>

      <button type="submit" className="w-full gradient-primary text-white py-3.5 rounded-xl font-black font-headline text-sm hover:opacity-90 active:scale-[0.99] transition-all">
        🔔 Zapnout hlídání →
      </button>
    </form>
  );
}

function AutaForm() {
  const [form, setForm] = useState({ znacka: "", model: "", maxCena: "", rokOd: "", email: "" });
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (sent) return <SuccessBanner onReset={() => setSent(false)} />;

  return (
    <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Značka</label>
          <input type="text" placeholder="Toyota, BMW, Porsche..." value={form.znacka} onChange={e => set("znacka", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Model</label>
          <input type="text" placeholder="Supra, E36 M3, 964..." value={form.model} onChange={e => set("model", e.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Max. cena (Kč)</label>
          <input type="number" placeholder="2 000 000" value={form.maxCena} onChange={e => set("maxCena", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Rok výroby od</label>
          <input type="number" placeholder="1990" min={1960} max={2010} value={form.rokOd} onChange={e => set("rokOd", e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Tvůj email <span className="text-red-400">*</span></label>
        <input type="email" required placeholder="petr@email.cz" value={form.email} onChange={e => set("email", e.target.value)} className={inputClass} />
      </div>

      <div className="bg-orange-500/8 border border-orange-500/20 rounded-xl p-3 text-xs text-orange-300">
        🚗 Radar hlídá <strong>Sauto.cz, TipCars, Autobazar.eu</strong> a 15 dalších webů. Japonské youngtimery, BMW M a Porsche 911 na jednom místě.
      </div>

      <button type="submit" className="w-full gradient-primary text-white py-3.5 rounded-xl font-black font-headline text-sm hover:opacity-90 active:scale-[0.99] transition-all">
        🔔 Zapnout hlídání →
      </button>
    </form>
  );
}

const ALT_CATEGORIES = [
  { value: "hodinky", label: "⌚ Hodinky (Rolex, Patek...)" },
  { value: "zlato", label: "✦ Zlato & stříbro" },
  { value: "pokemon", label: "🃏 Pokémon karty" },
  { value: "lego", label: "🧱 LEGO sety" },
  { value: "vino", label: "🍷 Víno & whisky" },
  { value: "sneakers", label: "👟 Sneakers" },
  { value: "umeni", label: "🖼️ Umění & sběratelství" },
  { value: "diamanty", label: "💎 Diamanty & drahokamy" },
];

function AltForm() {
  const [form, setForm] = useState({ kategorie: "hodinky", klic: "", maxCena: "", email: "" });
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (sent) return <SuccessBanner onReset={() => setSent(false)} />;

  return (
    <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-5">
      <div>
        <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Kategorie</label>
        <select value={form.kategorie} onChange={e => set("kategorie", e.target.value)} className={inputClass}>
          {ALT_CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Klíčové slovo / název</label>
        <input type="text" placeholder="Rolex Submariner, Charizard 1st Ed., Jordan 1..." value={form.klic} onChange={e => set("klic", e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Max. cena (Kč)</label>
        <input type="number" placeholder="100 000" value={form.maxCena} onChange={e => set("maxCena", e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Tvůj email <span className="text-red-400">*</span></label>
        <input type="email" required placeholder="petr@email.cz" value={form.email} onChange={e => set("email", e.target.value)} className={inputClass} />
      </div>

      <div className="bg-purple-500/8 border border-purple-500/20 rounded-xl p-3 text-xs text-purple-300">
        💎 Radar hlídá <strong>eBay, Vinted, bazaary a specializované weby</strong> pro každou kategorii. Včetně mezinárodních aukčních domů.
      </div>

      <button type="submit" className="w-full gradient-primary text-white py-3.5 rounded-xl font-black font-headline text-sm hover:opacity-90 active:scale-[0.99] transition-all">
        🔔 Zapnout hlídání →
      </button>
    </form>
  );
}

const STATS = [
  { value: "40+", label: "hlídaných webů" },
  { value: "24/7", label: "nepřetržitý monitoring" },
  { value: "<1h", label: "rychlost upozornění" },
];

export default function HlidacPage() {
  const [activeTab, setActiveTab] = useState("nemovitosti");

  return (
    <div className="min-h-screen bg-[#000d1f]">
      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-5xl mx-auto px-6 md:px-8 pt-10 pb-14">
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Radar</Link>
            <span>›</span>
            <span className="text-white/75">Hlídač cen</span>
          </nav>

          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
                <span className="w-2 h-2 bg-[#ffd700] rounded-full animate-pulse" />
                <span className="text-xs font-black text-white/75 uppercase tracking-widest font-headline">Nástroje · Hlídač</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-4 leading-tight">
                Nastav hlídání.<br />
                <span className="text-[#ffd700]">Radar hlídá za tebe.</span>
              </h1>
              <p className="text-white/75 text-lg leading-relaxed max-w-xl mb-8">
                Nemovitosti, auta, hodinky, LEGO — zadáš co hledáš a my tě upozorníme, jakmile se objeví nabídka. Bez scrollování. Bez promeškání.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                {STATS.map(s => (
                  <div key={s.label}>
                    <p className="text-2xl font-black text-white font-headline">{s.value}</p>
                    <p className="text-xs text-white/55">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:block flex-shrink-0 bg-white/10 rounded-3xl p-4">
              <Mascot size={120} mood="happy" variant="signal" trackMouse={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-10">

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-2xl mb-8">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-black font-headline transition-all ${
                activeTab === tab.id
                  ? "gradient-primary text-white shadow-sm"
                  : "text-white/65 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form container */}
        <div className="bg-white/5 rounded-2xl border border-white/8 shadow-sm p-6 md:p-8">
          {activeTab === "nemovitosti" && <NemovitostiForm />}
          {activeTab === "auta" && <AutaForm />}
          {activeTab === "alt" && <AltForm />}
        </div>

        {/* How it works */}
        <div className="mt-10">
          <p className="text-xs font-black text-white/55 uppercase tracking-widest font-headline mb-5 text-center">Jak to funguje</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { step: "1", emoji: "⚙️", title: "Nastav kritéria", desc: "Lokalita, cena, parametry. 30 sekund." },
              { step: "2", emoji: "🔍", title: "Radar hlídá", desc: "40+ webů nepřetržitě, každou hodinu." },
              { step: "3", emoji: "📧", title: "Ty dostaneš email", desc: "Ihned jakmile najdeme shodu." },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
                  {s.emoji}
                </div>
                <p className="font-black text-white font-headline text-sm mb-1">{s.title}</p>
                <p className="text-xs text-white/65 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Radar says */}
        <div className="gradient-primary rounded-2xl px-6 py-4 flex gap-4 items-start mt-8">
          <div className="flex-shrink-0">
            <Mascot size={40} mood="happy" variant="signal" trackMouse={false} />
          </div>
          <div>
            <p className="text-xs font-black text-white/55 uppercase tracking-widest font-headline mb-1">Radar říká:</p>
            <p className="text-sm text-white leading-relaxed">Nejlepší investice jsou ty, které stihnáš jako první. Alert ti dá náskok před ostatními kupci — a to je v dnešní době k nezaplacení.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
