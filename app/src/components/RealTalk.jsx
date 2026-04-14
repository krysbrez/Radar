const STORIES = [
  {
    name: "Tomáš K.",
    age: 26,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80",
    story: "Ve 22 jsem začal s 500 Kč měsíčně do ETF fondu. Říkal jsem si, že to je směšné. Dnes mám po 4 letech 38 000 Kč a poprvé v životě jsem koupil věc bez toho, abych šel do mínusu.",
    highlight: "+38 000 Kč",
    highlightLabel: "naspořeno za 4 roky",
    tag: "DCA strategie",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    name: "Markéta S.",
    age: 31,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80",
    story: "Koupila jsem byt v Brně v roce 2021 za 3.2M. Sousedi mi říkali, že jsem blázen. Dnes ho mám oceněný na 4.8M a nájem mi platí celou hypotéku plus 4 000 Kč měsíčně navíc.",
    highlight: "+1 600 000 Kč",
    highlightLabel: "nárůst hodnoty za 3 roky",
    tag: "Nemovitosti",
    tagColor: "bg-green-100 text-green-700",
  },
  {
    name: "Jakub M.",
    age: 24,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80",
    story: "Koupil jsem BMW E36 M3 za 280 000 Kč v roce 2022. Kamarádi mi smáli, že to je jen auto. Prodal jsem ho loni za 590 000 Kč. Celé léto jsem v tom aute jezdil a ještě vydělal víc než na spořáku.",
    highlight: "+310 000 Kč",
    highlightLabel: "zhodnocení za 2 roky",
    tag: "Youngtimery",
    tagColor: "bg-red-100 text-red-700",
  },
];

export default function RealTalk() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-black tracking-widest uppercase text-white/55 mb-2 font-headline">Real talk</p>
          <h2 className="text-4xl md:text-5xl font-black text-white font-headline tracking-tight leading-none">
            Příběhy ze života
          </h2>
        </div>
        <p className="hidden md:block text-sm text-white/65 max-w-xs text-right">
          Žádné teorie. Jen reální lidé a reálná čísla.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STORIES.map((s) => (
          <div
            key={s.name}
            className="bg-white rounded-2xl border border-white/12/10 p-6 hover:shadow-md hover:border-white/12/25 transition-all flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src={s.avatar}
                alt={s.name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                onError={(e) => { e.target.src = ""; e.target.className = "w-12 h-12 rounded-full bg-white/5 flex-shrink-0"; }}
              />
              <div>
                <p className="font-black text-white font-headline">{s.name}</p>
                <p className="text-xs text-white/55">{s.age} let · <span className={`font-bold px-1.5 py-0.5 rounded-full text-xs ${s.tagColor}`}>{s.tag}</span></p>
              </div>
            </div>

            <p className="text-sm text-white/85 leading-relaxed flex-1 mb-5 italic">
              "{s.story}"
            </p>

            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <p className="text-2xl font-black text-green-600 font-headline leading-none">{s.highlight}</p>
              <p className="text-xs text-green-700 font-semibold mt-1">{s.highlightLabel}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
