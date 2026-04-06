import { useState } from "react";

export default function PriceWatcherForm({ category }) {
  const [watchEmail, setWatchEmail] = useState("");
  const [watchPrice, setWatchPrice] = useState("");
  const [watchSent, setWatchSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (watchEmail && watchPrice) setWatchSent(true);
  };

  if (watchSent) {
    return (
      <div className="bg-green-50 rounded-2xl p-5 border border-green-200 text-center">
        <p className="text-2xl mb-2">✅</p>
        <p className="font-black text-green-700 font-headline text-sm">Hlídač nastaven!</p>
        <p className="text-xs text-green-600 mt-1">
          Pošleme ti e-mail, jakmile cena klesne pod {Number(watchPrice).toLocaleString("cs-CZ")} Kč.
        </p>
        <button
          onClick={() => { setWatchSent(false); setWatchEmail(""); setWatchPrice(""); }}
          className="mt-3 text-xs text-green-700 underline underline-offset-2"
        >
          Nastavit další
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-outline-variant/10">
      <h3 className="font-black text-primary font-headline text-xs uppercase tracking-wider mb-1">
        🔔 Hlídač cen
      </h3>
      <p className="text-xs text-outline mb-4">{category} · Upozornění e-mailem</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-on-surface-variant block mb-1">Cílová cena (Kč)</label>
          <input
            type="number"
            placeholder="např. 280 000"
            value={watchPrice}
            onChange={(e) => setWatchPrice(e.target.value)}
            required
            className="w-full border-b-2 border-outline-variant/30 focus:border-primary outline-none py-2 text-sm bg-transparent transition-colors placeholder:text-outline/50"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-on-surface-variant block mb-1">Váš e-mail</label>
          <input
            type="email"
            placeholder="tvuj@email.cz"
            value={watchEmail}
            onChange={(e) => setWatchEmail(e.target.value)}
            required
            className="w-full border-b-2 border-outline-variant/30 focus:border-primary outline-none py-2 text-sm bg-transparent transition-colors placeholder:text-outline/50"
          />
        </div>
        <button
          type="submit"
          className="w-full gradient-primary text-white py-2.5 rounded-xl text-sm font-bold font-headline hover:opacity-90 active:scale-95 transition-all"
        >
          Nastavit hlídač →
        </button>
      </form>
    </div>
  );
}
