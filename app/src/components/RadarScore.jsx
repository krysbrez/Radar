import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMarketData } from "../hooks/useMarketData";

function computeScore(data) {
  if (!data) return { score: 50, label: "Neutrální", labelKey: "neutral", color: "orange", emoji: "😐" };

  const changes = [
    data["^GSPC"]?.change ?? 0,
    data["BTC-USD"]?.change ?? 0,
    data["GC=F"]?.change ?? 0,
  ];
  const avg = changes.reduce((a, b) => a + b, 0) / changes.length;
  const raw = Math.max(0, Math.min(100, 50 + avg * 10));
  const score = Math.round(raw);

  if (score >= 70) return { score, label: "Euforie", labelKey: "euphoria", color: "green", emoji: "🚀" };
  if (score >= 55) return { score, label: "Optimismus", labelKey: "optimism", color: "green", emoji: "😊" };
  if (score >= 45) return { score, label: "Neutrální", labelKey: "neutral", color: "orange", emoji: "😐" };
  if (score >= 30) return { score, label: "Strach", labelKey: "fear", color: "red", emoji: "😟" };
  return { score, label: "Panika", labelKey: "panic", color: "red", emoji: "😱" };
}

const COLOR_MAP = {
  green: { ring: "stroke-green-500", text: "text-green-600", bg: "bg-green-50", badge: "bg-green-100 text-green-700" },
  orange: { ring: "stroke-orange-400", text: "text-orange-500", bg: "bg-orange-50", badge: "bg-orange-100 text-orange-700" },
  red: { ring: "stroke-red-500", text: "text-red-600", bg: "bg-red-50", badge: "bg-red-100 text-red-700" },
};

export default function RadarScore() {
  const { t } = useTranslation();
  const { data } = useMarketData();
  const { score, labelKey, color, emoji } = computeScore(data);
  const c = COLOR_MAP[color];
  const [showTooltip, setShowTooltip] = useState(false);

  const circumference = 2 * Math.PI * 40;
  const dash = (score / 100) * circumference;

  const LEGEND = [
    { range: "70–100", labelKey: "euphoria", emoji: "🚀", active: score >= 70 },
    { range: "55–69", labelKey: "optimism", emoji: "😊", active: score >= 55 && score < 70 },
    { range: "45–54", labelKey: "neutral", emoji: "😐", active: score >= 45 && score < 55 },
    { range: "30–44", labelKey: "fear", emoji: "😟", active: score >= 30 && score < 45 },
    { range: "0–29", labelKey: "panic", emoji: "😱", active: score < 30 },
  ];

  return (
    <div className={`${c.bg} rounded-2xl p-6 border border-white/12/10 h-full`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-black text-white/55 uppercase tracking-widest font-headline">{t("radar_score.title")}</p>
            {/* Tooltip trigger */}
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                className="w-4 h-4 rounded-full bg-outline/20 text-white/55 flex items-center justify-center text-[10px] font-bold hover:bg-outline/30 transition-colors"
                aria-label="Info o Radar Score"
              >
                ?
              </button>
              {showTooltip && (
                <div className="absolute left-6 top-0 z-20 w-64 bg-primary text-white text-xs rounded-xl px-3 py-2.5 shadow-xl leading-relaxed">
                  {t("radar_score.tooltip")}
                  <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 bg-primary rotate-45" />
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-white/65 mt-0.5">{t("radar_score.subtitle")}</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.badge}`}>{t(`radar_score.${labelKey}`)}</span>
      </div>

      <div className="flex items-center gap-5">
        {/* Circular gauge */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="40" fill="none"
              className={c.ring}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference - dash}`}
              style={{ transition: "stroke-dasharray 1s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl">{emoji}</span>
            <span className={`text-lg font-black font-headline leading-none ${c.text}`}>{score}</span>
          </div>
        </div>

        {/* Legenda */}
        <div className="flex-1 space-y-1.5">
          {LEGEND.map((item) => (
            <div key={item.range} className={`flex items-center gap-2 text-xs ${item.active ? "font-bold text-white" : "text-white/55"}`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.active ? "bg-primary" : "bg-outline-variant"}`} />
              <span>{t(`radar_score.${item.labelKey}`)} {item.emoji}</span>
              <span className="ml-auto opacity-60">{item.range}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-white/55 mt-4 italic">{t("radar_score.note")}</p>
    </div>
  );
}
