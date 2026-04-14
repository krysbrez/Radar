import { useTranslation } from "react-i18next";
import { useMarketData } from "../hooks/useMarketData";

const SYMBOLS_CONFIG = [
  {
    symbol: "^GSPC",
    label: "S&P 500",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    unit: "",
    note: "Americké akcie",
  },
  {
    symbol: "BTC-USD",
    label: "Bitcoin",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <text x="2" y="18" fontSize="18" fontWeight="bold" fontFamily="monospace">₿</text>
      </svg>
    ),
    unit: " USD",
    note: "Krypto",
  },
  {
    symbol: "EURCZK=X",
    label: "EUR/CZK",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M14.31 8a6 6 0 1 0 0 8" />
      </svg>
    ),
    unit: " CZK",
    note: "Forex",
  },
  {
    symbol: "GC=F",
    label: "Zlato",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <text x="2" y="18" fontSize="16" fontWeight="bold">✦</text>
      </svg>
    ),
    unit: " USD/oz",
    note: "Komodity",
  },
];

function PriceCard({ config, item, loading }) {
  const { t } = useTranslation();
  const isUp = item?.change >= 0;

  return (
    <div className="bg-white/4-container-lowest rounded-xl p-5 border border-white/12/10 hover:border-white/12/30 transition-all hover:shadow-sm group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-bold text-white/55 uppercase tracking-wider mb-1 font-headline">
            {config.note}
          </p>
          <p className="font-bold text-white font-headline">{config.label}</p>
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            loading ? "bg-white/5" :
            isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
          }`}
        >
          {config.icon}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-7 bg-white/5 rounded w-3/4" />
          <div className="h-4 bg-white/5 rounded w-1/2" />
        </div>
      ) : (
        <>
          <p className="text-2xl font-black text-white font-headline leading-none mb-2">
            {item?.price}{config.unit}
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-sm font-bold px-2 py-0.5 rounded-full ${
                isUp
                  ? "text-green-700 bg-green-100"
                  : "text-red-600 bg-red-50"
              }`}
            >
              {isUp ? "↑" : "↓"}
              {isUp ? "+" : ""}
              {item?.change}%
            </span>
            <span className="text-xs text-white/55">{t("live_prices.today")}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function LivePrices({ inline = false }) {
  const { t } = useTranslation();
  const { data, loading, error, lastUpdated } = useMarketData();

  const formatTime = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <section className={inline ? "" : "max-w-7xl mx-auto px-6 md:px-8 py-8"}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full pulse-dot" />
            <span className="text-xs font-bold text-green-600 uppercase tracking-wider font-headline">
              {t("live_prices.live_badge")}
            </span>
          </div>
          {lastUpdated && (
            <span className="text-xs text-white/55">
              {t("live_prices.updated")} {formatTime(lastUpdated)}
            </span>
          )}
        </div>
        {error && (
          <span className="text-xs text-white/55 italic">{error}</span>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {SYMBOLS_CONFIG.map((config) => (
          <PriceCard
            key={config.symbol}
            config={config}
            item={data?.[config.symbol]}
            loading={loading && !data}
          />
        ))}
      </div>
    </section>
  );
}
