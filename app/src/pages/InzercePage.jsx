import { useState } from "react";
import { Link } from "react-router-dom";
import Mascot from "../components/Mascot";

const FORMATS = [
  {
    icon: "✉️",
    title: "Newsletter placement",
    price: "od 5 000 Kč",
    desc: "Exkluzivní zmínka v pondělním newsletteru. 50 000+ příjemců, průměrná open rate 42 %.",
    bullets: ["Dedikovaná sekce v newsletteru", "Vlastní text + odkaz + obrázek", "Výsledky: open rate, kliky, CTR"],
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    popular: false,
  },
  {
    icon: "📝",
    title: "Sponzorovaný článek",
    price: "od 8 000 Kč",
    desc: "Brandovaný obsah napsaný ve stylu Radaru. Čtenáři ho čtou, protože to není reklama — je to obsah.",
    bullets: ["800–1 200 slov ve stylu Radar Editorial", "Publikace na webu + zmínka v newsletteru", "SEO optimalizace, trvalý odkaz"],
    color: "bg-primary/5 border-primary/20",
    badge: "bg-primary text-white",
    popular: true,
  },
  {
    icon: "🖼️",
    title: "Banner na webu",
    price: "od 3 000 Kč/měsíc",
    desc: "Vizuální banner v klíčových sekcích webu. Cílení na čtenáře finančního obsahu.",
    bullets: ["Umístění v sidebar nebo between-content", "Měsíční reporting impresí a kliků", "Minimální délka: 1 měsíc"],
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
    popular: false,
  },
];

function ContactForm() {
  const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <p className="text-4xl mb-3">✅</p>
        <h3 className="text-xl font-black text-green-800 font-headline mb-2">Zpráva odeslána!</h3>
        <p className="text-green-700 text-sm">Ozveme se do 48 hodin. Na rychlé dotazy odpovídáme přes inzerce@radar.cz.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Jméno</label>
          <input
            required type="text" value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder="Jan Novák"
            className="w-full bg-white border border-white/12/20 focus:border-[#ffd700]/40/40 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Firma</label>
          <input
            type="text" value={form.company}
            onChange={e => set("company", e.target.value)}
            placeholder="Acme s.r.o."
            className="w-full bg-white border border-white/12/20 focus:border-[#ffd700]/40/40 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Email</label>
        <input
          required type="email" value={form.email}
          onChange={e => set("email", e.target.value)}
          placeholder="jan@firma.cz"
          className="w-full bg-white border border-white/12/20 focus:border-[#ffd700]/40/40 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors"
        />
      </div>
      <div>
        <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Zpráva</label>
        <textarea
          required value={form.message}
          onChange={e => set("message", e.target.value)}
          rows={4}
          placeholder="Popište svůj produkt, cílové publikum a preferovaný formát spolupráce..."
          className="w-full bg-white border border-white/12/20 focus:border-[#ffd700]/40/40 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full gradient-primary text-white font-black text-sm font-headline py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all"
      >
        Odeslat poptávku →
      </button>
    </form>
  );
}

export default function InzercePage() {
  return (
    <div className="min-h-screen bg-white/4">

      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-8 pt-12 pb-14">
          <nav className="flex items-center gap-2 text-xs text-white-fixed-dim/60 mb-8">
            <Link to="/" className="hover:text-white transition-colors">Radar</Link>
            <span>›</span>
            <span className="text-white-fixed-dim">Inzerce</span>
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-5">
                <span className="text-xs font-black text-white-fixed-dim uppercase tracking-widest font-headline">📣 Spolupráce</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-4 leading-tight">
                Oslovi investory.<br />
                <span className="text-tertiary-fixed">50 000 čtenářů čeká.</span>
              </h1>
              <p className="text-white-fixed-dim text-lg leading-relaxed max-w-xl">
                Radar čtou lidé, kteří aktivně investují a rozhodují se. Průměrná open rate 42 %. Žádné zbytečné klikání.
              </p>
            </div>
            <div className="hidden md:block flex-shrink-0 bg-white/10 rounded-3xl p-4">
              <Mascot size={100} mood="happy" variant="signal" trackMouse={false} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12 space-y-14">

        {/* Formáty */}
        <section>
          <h2 className="text-2xl font-black font-headline text-white mb-2">Formáty spolupráce</h2>
          <p className="text-white/65 mb-6">Vyberte formát, který odpovídá vašemu cíli.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {FORMATS.map((f) => (
              <div key={f.title} className={`rounded-2xl border p-6 relative ${f.color}`}>
                {f.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white text-xs font-black font-headline px-3 py-1 rounded-full">Nejpopulárnější</span>
                  </div>
                )}
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-black text-white font-headline text-lg mb-1">{f.title}</h3>
                <p className={`text-sm font-black mb-3 px-2 py-0.5 rounded-full inline-block ${f.badge}`}>{f.price}</p>
                <p className="text-sm text-white/65 leading-relaxed mb-4">{f.desc}</p>
                <ul className="space-y-1.5">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-xs text-white/65">
                      <span className="text-white flex-shrink-0">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Audience stats */}
        <section className="bg-white rounded-2xl border border-white/12/10 p-8">
          <h2 className="text-xl font-black font-headline text-white mb-6">Kdo jsou čtenáři Radaru</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "50 000+", label: "měsíční čtenáři" },
              { value: "42 %", label: "průměrná open rate" },
              { value: "28–42", label: "průměrný věk" },
              { value: "72 %", label: "čte pravidelně" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-white font-headline">{s.value}</p>
                <p className="text-xs text-white/65 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Formulář */}
        <section>
          <h2 className="text-2xl font-black font-headline text-white mb-2">Nezávazná poptávka</h2>
          <p className="text-white/65 mb-6">Ozveme se do 48 hodin s konkrétní nabídkou. Nebo napište přímo na <a href="mailto:inzerce@radar.cz" className="text-white font-bold">inzerce@radar.cz</a></p>
          <div className="bg-white rounded-2xl border border-white/12/10 p-6">
            <ContactForm />
          </div>
        </section>

      </div>
    </div>
  );
}
