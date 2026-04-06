import { useTranslation } from "react-i18next";

const REVIEWS = [
  {
    name: "Adéla M.",
    age: 18,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&q=80",
    text: "Začala jsem číst Radar v září. Do Vánoc jsem si otevřela první broker účet. Říkala jsem si, že finance jsou pro dospělé — Radar mi ukázal, že to je pro každého.",
    stars: 5,
    highlight: "První broker účet za 3 měsíce",
  },
  {
    name: "Tomáš R.",
    age: 21,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&q=80",
    text: "Student VŠE a přesto jsem nerozuměl základům investování. Radar to vysvětluje lépe než přednášky. A je to zábavnější. Tedy... hodně víc zábavnější.",
    stars: 5,
    highlight: "Lepší než VŠE přednášky 🎓",
  },
  {
    name: "Michaela K.",
    age: 25,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80",
    text: "Po roce čtení Radaru jsem přestala platit poplatek finančnímu poradci. Sama si spravuji ETF portfolio. Ušetřím 12 000 Kč ročně na poplatcích. Díky Radar.",
    stars: 5,
    highlight: "Ušetřeno 12 000 Kč/rok na poplatcích",
  },
];

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`text-sm ${i <= count ? "text-yellow-400" : "text-outline-variant"}`}>★</span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { t } = useTranslation();

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-1.5 mb-3">
          <span className="text-xs font-black text-yellow-700 uppercase tracking-widest font-headline">{t("reviews.badge")}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-primary font-headline mb-2">{t("reviews.title")}</h2>
        <p className="text-on-surface-variant">{t("reviews.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((r) => (
          <div key={r.name} className="bg-white rounded-2xl border border-outline-variant/10 p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={r.avatar}
                alt={r.name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <div>
                <p className="font-black text-primary font-headline">{r.name}</p>
                <p className="text-xs text-outline">{r.age} {t("freedom.years_label")}</p>
              </div>
              <div className="ml-auto">
                <Stars count={r.stars} />
              </div>
            </div>

            <p className="text-sm text-on-surface leading-relaxed flex-1 italic mb-4">
              "{r.text}"
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2">
              <p className="text-xs font-black text-yellow-700">⭐ {r.highlight}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
