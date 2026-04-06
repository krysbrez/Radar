import { useTranslation } from "react-i18next";
import Mascot from "./Mascot";

export default function TrziTydne() {
  const { t } = useTranslation();

  const NUMBERS = [
    { labelKey: "markets.sp500", value: "+2.8%", noteKey: "markets.sp500_note", isUp: true },
    { labelKey: "markets.btc", value: "-4.2%", noteKey: "markets.btc_note", isUp: false },
    { labelKey: "markets.czk", value: "25.10 CZK", noteKey: "markets.czk_note", isUp: true },
    { labelKey: "markets.gold", value: "+1.1%", noteKey: "markets.gold_note", isUp: true },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-8">
      <div className="bg-surface-container-highest rounded-3xl p-8 md:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Mascot */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="bg-white rounded-2xl p-3 shadow-sm">
              <Mascot size={80} mood="normal" variant="signal" trackMouse={false} />
            </div>
            <p className="text-xs font-bold text-outline text-center font-headline">{t("markets.watching")}</p>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-xs font-black text-outline uppercase tracking-widest font-headline">{t("markets.this_week")}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {NUMBERS.map((n) => (
                <div key={n.labelKey} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-outline font-semibold mb-1 leading-tight">{t(n.labelKey)}</p>
                  <p className={`text-2xl font-black font-headline leading-none ${n.isUp ? "text-green-600" : "text-red-500"}`}>
                    {n.value}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1.5 leading-tight">{t(n.noteKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
