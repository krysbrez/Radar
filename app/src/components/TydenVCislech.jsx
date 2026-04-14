const NUMBERS = [
  {
    value: "$2 345",
    unit: "USD/oz",
    label: "Zlato na novém maximu",
    note: "Poprvé od Q3 2025",
    up: true,
    emoji: "✦",
  },
  {
    value: "47 238",
    unit: "čtenářů",
    label: "Radar newsletter roste",
    note: "+320 tento týden",
    up: true,
    emoji: "📬",
  },
  {
    value: "5,45 %",
    unit: "p.a.",
    label: "Průměrná hypotéka v ČR",
    note: "Pokles o 0,2 % od února",
    up: false,
    emoji: "🏠",
  },
  {
    value: "11 %",
    unit: "ročně",
    label: "LEGO retired sets avg.",
    note: "Překonává průměrný fond",
    up: true,
    emoji: "🧱",
  },
];

export default function TydenVCislech() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-8">
      <div className="flex items-center gap-3 mb-5">
        <p className="text-xs font-black tracking-widest uppercase text-white/55 font-headline">
          Tento týden v číslech
        </p>
        <div className="h-px flex-1 bg-outline-variant/15" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {NUMBERS.map((n) => (
          <div
            key={n.label}
            className="bg-white rounded-xl p-4 border border-white/12/10 hover:border-white/12/25 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{n.emoji}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                n.up ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"
              }`}>
                {n.up ? "↑" : "↓"}
              </span>
            </div>
            <p className="text-2xl font-black text-white font-headline leading-none">
              {n.value}
              <span className="text-sm font-semibold text-white/55 ml-1">{n.unit}</span>
            </p>
            <p className="text-xs font-semibold text-white/65 mt-1">{n.label}</p>
            <p className="text-[10px] text-white/55 mt-0.5">{n.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
