import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "../components/Mascot";

function formatCZK(n) {
  return Math.round(n).toLocaleString("cs-CZ") + " Kč";
}

/* ── Složené úročení ── */
function CompoundCalc() {
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(1000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(8);

  const result = (() => {
    let value = Number(initial);
    const r = Number(rate) / 100 / 12;
    const n = Number(years) * 12;
    for (let i = 0; i < n; i++) {
      value = value * (1 + r) + Number(monthly);
    }
    const invested = Number(initial) + Number(monthly) * n;
    return { value, invested, profit: value - invested };
  })();

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <label className="block">
          <span className="text-xs font-bold text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Počáteční vklad</span>
          <input type="number" value={initial} onChange={(e) => setInitial(e.target.value)} className="w-full bg-white/5 border border-white/12/20 rounded-xl px-4 py-2.5 text-sm text-white font-bold outline-none focus:border-[#ffd700]/40/40 transition-colors" />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Měsíční vklad</span>
          <input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="w-full bg-white/5 border border-white/12/20 rounded-xl px-4 py-2.5 text-sm text-white font-bold outline-none focus:border-[#ffd700]/40/40 transition-colors" />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Počet let</span>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} min="1" max="50" className="w-full bg-white/5 border border-white/12/20 rounded-xl px-4 py-2.5 text-sm text-white font-bold outline-none focus:border-[#ffd700]/40/40 transition-colors" />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Roční výnos (%)</span>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} min="0" max="50" step="0.1" className="w-full bg-white/5 border border-white/12/20 rounded-xl px-4 py-2.5 text-sm text-white font-bold outline-none focus:border-[#ffd700]/40/40 transition-colors" />
        </label>
      </div>
      <div className="gradient-primary rounded-2xl p-6 text-white">
        <p className="text-xs text-white-fixed-dim/70 font-bold uppercase tracking-wider mb-4 font-headline">Výsledek po {years} letech</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xl sm:text-2xl font-black font-headline leading-tight break-words">{formatCZK(result.value)}</p>
            <p className="text-xs text-white-fixed-dim mt-1">Celková hodnota</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black font-headline leading-tight break-words text-green-300">{formatCZK(result.profit)}</p>
            <p className="text-xs text-white-fixed-dim mt-1">Výnosy z investic</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black font-headline leading-tight break-words">{formatCZK(result.invested)}</p>
            <p className="text-xs text-white-fixed-dim mt-1">Celkem vloženo</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── DCA kalkulačka ── */
function DCACalc() {
  const [monthly, setMonthly] = useState(2000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(9);

  const result = (() => {
    let value = 0;
    const r = Number(rate) / 100 / 12;
    const n = Number(years) * 12;
    for (let i = 0; i < n; i++) {
      value = (value + Number(monthly)) * (1 + r);
    }
    const invested = Number(monthly) * n;
    return { value, invested, profit: value - invested, multiplier: value / invested };
  })();

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <label className="block">
          <span className="text-xs font-bold text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Měsíční částka (Kč)</span>
          <input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="w-full bg-white/5 border border-white/12/20 rounded-xl px-4 py-2.5 text-sm text-white font-bold outline-none focus:border-[#ffd700]/40/40 transition-colors" />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Počet let</span>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} min="1" max="50" className="w-full bg-white/5 border border-white/12/20 rounded-xl px-4 py-2.5 text-sm text-white font-bold outline-none focus:border-[#ffd700]/40/40 transition-colors" />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Průměrný výnos (%)</span>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} min="0" max="50" step="0.1" className="w-full bg-white/5 border border-white/12/20 rounded-xl px-4 py-2.5 text-sm text-white font-bold outline-none focus:border-[#ffd700]/40/40 transition-colors" />
        </label>
      </div>
      <div className="bg-white/4-container-highest rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4">
            <p className="text-2xl sm:text-3xl font-black text-green-600 font-headline leading-tight break-words">{formatCZK(result.value)}</p>
            <p className="text-xs text-white/55 mt-1">Hodnota portfolia za {years} let</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-3xl font-black text-white font-headline leading-none">{result.multiplier.toFixed(1)}×</p>
            <p className="text-xs text-white/55 mt-1">Zhodnocení vkladů</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-white/65">Celkem vloženo:</span>
          <span className="font-black text-white font-headline break-words">{formatCZK(result.invested)}</span>
        </div>
        <p className="text-xs text-white/55 mt-3 italic">Každý měsíc investuješ {Number(monthly).toLocaleString("cs-CZ")} Kč bez ohledu na stav trhu — to je DCA strategie.</p>
      </div>
    </div>
  );
}

/* ── Hypoteční kalkulačka ── */
function MortgageCalc() {
  const [price, setPrice] = useState(5000000);
  const [downpayment, setDownpayment] = useState(20);
  const [rate, setRate] = useState(5.45);
  const [years, setYears] = useState(25);

  const result = (() => {
    const loan = Number(price) * (1 - Number(downpayment) / 100);
    const r = Number(rate) / 100 / 12;
    const n = Number(years) * 12;
    const payment = loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPaid = payment * n;
    return { loan, payment, totalPaid, totalInterest: totalPaid - loan };
  })();

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <label className="block col-span-2">
          <span className="text-xs font-bold text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Cena nemovitosti (Kč)</span>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-white/5 border border-white/12/20 rounded-xl px-4 py-2.5 text-sm text-white font-bold outline-none focus:border-[#ffd700]/40/40 transition-colors" />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Akontace (%)</span>
          <input type="number" value={downpayment} onChange={(e) => setDownpayment(e.target.value)} min="10" max="90" className="w-full bg-white/5 border border-white/12/20 rounded-xl px-4 py-2.5 text-sm text-white font-bold outline-none focus:border-[#ffd700]/40/40 transition-colors" />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Úroková sazba (%)</span>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} min="0.1" max="20" step="0.01" className="w-full bg-white/5 border border-white/12/20 rounded-xl px-4 py-2.5 text-sm text-white font-bold outline-none focus:border-[#ffd700]/40/40 transition-colors" />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-bold text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Splatnost (let)</span>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} min="5" max="40" className="w-full bg-white/5 border border-white/12/20 rounded-xl px-4 py-2.5 text-sm text-white font-bold outline-none focus:border-[#ffd700]/40/40 transition-colors" />
        </label>
      </div>
      <div className="space-y-3">
        <div className="bg-primary text-white rounded-2xl p-5 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-bold font-headline">Měsíční splátka</span>
          <span className="text-xl sm:text-2xl font-black font-headline leading-tight break-words">{formatCZK(result.payment)}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 border border-white/12/10">
            <p className="text-sm font-black text-white font-headline leading-tight break-words">{formatCZK(result.loan)}</p>
            <p className="text-xs text-white/55 mt-0.5">Výše úvěru</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-white/12/10">
            <p className="text-sm font-black text-red-500 font-headline leading-tight break-words">{formatCZK(result.totalInterest)}</p>
            <p className="text-xs text-white/55 mt-0.5">Celkem úroky</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-white/12/10">
            <p className="text-sm font-black text-white font-headline leading-tight break-words">{formatCZK(result.totalPaid)}</p>
            <p className="text-xs text-white/55 mt-0.5">Celkem zaplaceno</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Inflační kalkulačka ── */
function InflationCalc() {
  const [amount, setAmount] = useState(100000);
  const [years, setYears] = useState(10);
  const [inflationRate, setInflationRate] = useState(3);

  const result = (() => {
    const futureValue = Number(amount) * Math.pow(1 + Number(inflationRate) / 100, Number(years));
    const loss = futureValue - Number(amount);
    const purchasingPower = Number(amount) / Math.pow(1 + Number(inflationRate) / 100, Number(years));
    return { futureValue, loss, purchasingPower };
  })();

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <label className="block">
          <span className="text-xs font-bold text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Částka dnes (Kč)</span>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-white/5 border border-white/12/20 rounded-xl px-4 py-2.5 text-sm text-white font-bold outline-none focus:border-[#ffd700]/40/40 transition-colors" />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Počet let</span>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} min="1" max="50" className="w-full bg-white/5 border border-white/12/20 rounded-xl px-4 py-2.5 text-sm text-white font-bold outline-none focus:border-[#ffd700]/40/40 transition-colors" />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-white/55 uppercase tracking-wider mb-1.5 block font-headline">Inflace (%/rok)</span>
          <input type="number" value={inflationRate} onChange={(e) => setInflationRate(e.target.value)} min="0" max="30" step="0.1" className="w-full bg-white/5 border border-white/12/20 rounded-xl px-4 py-2.5 text-sm text-white font-bold outline-none focus:border-[#ffd700]/40/40 transition-colors" />
        </label>
      </div>
      <div className="space-y-3">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <p className="text-xs font-black text-red-700 uppercase tracking-wider mb-3 font-headline">Za {years} let bude potřeba k nákupu stejných věcí</p>
          <p className="text-2xl sm:text-3xl font-black text-red-600 font-headline leading-tight break-words">{formatCZK(result.futureValue)}</p>
          <p className="text-sm text-red-600 mt-1">Ztráta kupní síly: <strong>{formatCZK(result.loss)}</strong></p>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-sm text-white/65 leading-relaxed">
            Tvých <strong>{formatCZK(Number(amount))}</strong> na spořicím účtu bude mít za {years} let kupní sílu jen <strong>{formatCZK(result.purchasingPower)}</strong> v dnešních cenách.
          </p>
        </div>
      </div>
    </div>
  );
}

const CALCS = [
  { id: "compound", label: "Složené úročení", emoji: "📈", desc: "Kolik budeš mít za X let při pravidelném investování?", component: CompoundCalc },
  { id: "dca", label: "DCA kalkulačka", emoji: "🔄", desc: "Pravidelné měsíční investování — výsledek za roky.", component: DCACalc },
  { id: "mortgage", label: "Hypoteční kalkulačka", emoji: "🏠", desc: "Měsíční splátka, celkové náklady a výše úvěru.", component: MortgageCalc },
  { id: "inflation", label: "Inflační kalkulačka", emoji: "📉", desc: "O kolik klesne kupní síla tvých peněz?", component: InflationCalc },
];

export default function KalkulackyPage() {
  const { t } = useTranslation();
  const [active, setActive] = useState("compound");

  const current = CALCS.find((c) => c.id === active);
  const CalcComponent = current?.component;

  return (
    <div className="min-h-screen bg-white/4">
      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-8 pt-10 pb-12">
          <nav className="flex items-center gap-2 text-xs text-white-fixed-dim/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Radar</Link>
            <span>›</span>
            <span className="text-white-fixed-dim">{t("tools.calc_title")}</span>
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-4">{t("tools.calc_title")}</h1>
              <p className="text-white-fixed-dim text-lg leading-relaxed max-w-xl">{t("tools.calc_subtitle")}</p>
            </div>
            <div className="hidden md:block flex-shrink-0 bg-white/10 rounded-3xl p-4">
              <Mascot size={100} mood="happy" variant="idle" trackMouse={false} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-8">
        {/* Tab selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {CALCS.map((calc) => (
            <button
              key={calc.id}
              onClick={() => setActive(calc.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all text-left ${
                active === calc.id
                  ? "gradient-primary text-white border-transparent shadow-lg"
                  : "bg-white border-white/12/10 hover:border-white/12/30 hover:shadow-sm text-white/65"
              }`}
            >
              <span className="text-2xl">{calc.emoji}</span>
              <span className={`text-xs font-black font-headline text-center leading-tight ${active === calc.id ? "text-white" : "text-white"}`}>{calc.label}</span>
            </button>
          ))}
        </div>

        {/* Active calculator */}
        {current && (
          <div className="bg-white/5 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white rounded-xl p-2.5 shadow-sm flex-shrink-0">
                <Mascot size={48} mood="normal" variant="idle" trackMouse={false} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white font-headline">{current.emoji} {current.label}</h2>
                <p className="text-sm text-white/65 mt-0.5">{current.desc}</p>
              </div>
            </div>
            <CalcComponent />
            <p className="text-xs text-white/55 mt-5 italic">* Kalkulačka je pouze orientační. Skutečné výnosy se mohou lišit. Minulá výkonnost nezaručuje budoucí výsledky.</p>
          </div>
        )}
      </div>
    </div>
  );
}
