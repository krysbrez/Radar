const DEFAULT_ALERTS = [
  { label: "Akcie", signal: "NVDA pod $120", tone: "positive" },
  { label: "Reality", signal: "2+kk Praha do 5.5M", tone: "neutral" },
  { label: "Auta", signal: "BMW E36 do 750k", tone: "accent" },
  { label: "Alternativy", signal: "Zlato nad $2 400", tone: "positive" },
];

export default function AlertSignalPanel({
  title = "Radar Alerts",
  subtitle = "Ukázka hlídání napříč hlavními segmenty",
  alerts = DEFAULT_ALERTS,
}) {
  const toneClass = {
    positive: "bg-green-400",
    neutral: "bg-white/8",
    accent: "bg-tertiary-fixed",
    negative: "bg-red-400",
  };

  return (
    <div className="mt-5 rounded-[1.5rem] border border-white/12 bg-white/[0.08] backdrop-blur-sm p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-white text-sm font-black font-headline tracking-tight">{title}</p>
          <p className="text-white/72 text-xs">{subtitle}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/72">
          <span className="h-1.5 w-1.5 rounded-full bg-tertiary-fixed pulse-dot" />
          Live
        </span>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={`${alert.label}-${alert.signal}`}
            className="flex items-start gap-3 rounded-xl bg-black/18 px-3 py-2.5"
          >
            <span className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${toneClass[alert.tone] ?? toneClass.neutral}`} />
            <div className="min-w-0 flex-1">
              <p className="mb-1.5 text-[11px] font-black uppercase leading-tight tracking-[0.18em] text-white/72">
                {alert.label}
              </p>
              <p className="text-sm font-semibold leading-tight text-white/95">
                {alert.signal}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
