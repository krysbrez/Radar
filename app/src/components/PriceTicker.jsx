import { useTranslation } from "react-i18next";
import { useMarketData } from "../hooks/useMarketData";

const SYMBOLS_ORDER = ["^GSPC", "BTC-USD", "EURCZK=X", "GC=F"];

const SYMBOL_META = {
  "^GSPC": { label: "S&P 500", icon: "📈" },
  "BTC-USD": { label: "Bitcoin", icon: "₿" },
  "EURCZK=X": { label: "EUR/CZK", icon: "💱" },
  "GC=F": { label: "Zlato", icon: "✦" },
};

function TickerItem({ symbol, item }) {
  const meta = SYMBOL_META[symbol] || { label: symbol, icon: "•" };
  const isUp = item.change >= 0;

  return (
    <span className="inline-flex items-center gap-2 px-6 whitespace-nowrap">
      <span className="text-primary-fixed-dim text-xs font-bold tracking-wider uppercase opacity-60">
        {meta.icon}
      </span>
      <span className="text-primary-fixed-dim font-semibold text-sm font-headline">
        {meta.label}
      </span>
      <span className="text-white font-bold text-sm">
        {item.price}
        {symbol !== "EURCZK=X" && symbol !== "GC=F" && " USD"}
        {symbol === "EURCZK=X" && ""}
        {symbol === "GC=F" && " USD/oz"}
      </span>
      <span
        className={`text-xs font-bold px-1.5 py-0.5 rounded ${
          isUp
            ? "text-green-300 bg-green-900/30"
            : "text-red-300 bg-red-900/30"
        }`}
      >
        {isUp ? "+" : ""}
        {item.change}%
      </span>
      <span className="text-primary-container opacity-30 ml-2">|</span>
    </span>
  );
}

export default function PriceTicker() {
  const { t } = useTranslation();
  const { data, loading } = useMarketData();

  const items = SYMBOLS_ORDER.map((sym) => ({
    symbol: sym,
    item: data?.[sym] ?? null,
  })).filter((x) => x.item !== null);

  if (loading && !data) {
    return (
      <div className="gradient-primary h-8 flex items-center justify-center">
        <span className="text-primary-fixed-dim text-xs tracking-widest animate-pulse">
          {t("live_prices.loading")}
        </span>
      </div>
    );
  }

  // Duplicate items for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="gradient-primary h-8 overflow-hidden flex items-center">
      <div className="ticker-track">
        {doubled.map(({ symbol, item }, i) => (
          <TickerItem key={`${symbol}-${i}`} symbol={symbol} item={item} />
        ))}
      </div>
    </div>
  );
}
