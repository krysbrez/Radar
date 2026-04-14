import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "../components/Mascot";

export default function ONasPage() {
  const { t } = useTranslation();

  const VALUES = [
    { icon: "🎯", title: t("o_nas.val_1_title"), desc: t("o_nas.val_1_desc") },
    { icon: "⚡", title: t("o_nas.val_2_title"), desc: t("o_nas.val_2_desc") },
    { icon: "🤖", title: t("o_nas.val_3_title"), desc: t("o_nas.val_3_desc") },
  ];

  const STATS = [
    { number: t("o_nas.stat_1_num"), label: t("o_nas.stat_1_label") },
    { number: t("o_nas.stat_2_num"), label: t("o_nas.stat_2_label") },
    { number: t("o_nas.stat_3_num"), label: t("o_nas.stat_3_label") },
  ];

  return (
    <div className="min-h-screen bg-white/4">

      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-8 pt-12 pb-14">
          <nav className="flex items-center gap-2 text-xs text-white-fixed-dim/60 mb-8">
            <Link to="/" className="hover:text-white transition-colors">Radar</Link>
            <span>›</span>
            <span className="text-white-fixed-dim">{t("footer.about")}</span>
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-5">
                <span className="text-xs font-black text-white-fixed-dim uppercase tracking-widest font-headline">{t("o_nas.badge")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-4 leading-tight">
                {t("o_nas.hero_title")}<br />
                <span className="text-tertiary-fixed">{t("o_nas.hero_title_accent")}</span>
              </h1>
              <p className="text-white-fixed-dim text-lg leading-relaxed max-w-xl">
                {t("o_nas.hero_subtitle")}
              </p>
            </div>
            <div className="hidden md:block flex-shrink-0 bg-white/10 rounded-3xl p-4">
              <Mascot size={120} mood="happy" variant="signal" trackMouse={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-white/12/10">
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-8 grid grid-cols-3 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl md:text-4xl font-black text-white font-headline">{s.number}</p>
              <p className="text-sm text-white/65 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12 space-y-14">

        {/* Proč Radar vznikl */}
        <section className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0 bg-white/5 rounded-2xl p-4 hidden md:block">
            <Mascot size={80} mood="thinking" variant="signal" trackMouse={false} />
          </div>
          <div>
            <h2 className="text-2xl font-black font-headline text-white mb-4">{t("o_nas.why_title")}</h2>
            <div className="bg-white/5 rounded-2xl p-6 border-l-4 border-primary mb-4">
              <p className="text-white/85 leading-relaxed italic">{t("o_nas.quote")}</p>
              <p className="text-sm font-black text-white font-headline mt-3">{t("o_nas.quote_author")}</p>
            </div>
            <p className="text-white/65 leading-relaxed">{t("o_nas.why_desc")}</p>
          </div>
        </section>

        {/* Naše hodnoty */}
        <section>
          <h2 className="text-2xl font-black font-headline text-white mb-6">{t("o_nas.values_title")}</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl border border-white/12/10 p-6 shadow-sm">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-black text-white font-headline text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mascot CTA */}
        <div className="gradient-primary rounded-2xl p-8 text-white text-center">
          <Mascot size={72} mood="happy" variant="signal" trackMouse={false} />
          <p className="text-2xl font-black font-headline mt-4 mb-2">{t("o_nas.cta_title")}</p>
          <p className="text-white-fixed-dim mb-5">{t("o_nas.cta_sub")}</p>
          <Link
            to="/#newsletter"
            className="inline-block bg-white text-white font-black text-sm font-headline px-8 py-3 rounded-full hover:bg-white/8 transition-colors"
          >
            {t("o_nas.cta_btn")}
          </Link>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link to="/tym" className="text-sm font-bold text-white font-headline border-b-2 border-primary-fixed-dim pb-0.5 hover:border-primary transition-colors">
            {t("o_nas.link_team")}
          </Link>
          <Link to="/kontakt" className="text-sm font-bold text-white font-headline border-b-2 border-primary-fixed-dim pb-0.5 hover:border-primary transition-colors">
            {t("o_nas.link_contact")}
          </Link>
          <Link to="/inzerce" className="text-sm font-bold text-white font-headline border-b-2 border-primary-fixed-dim pb-0.5 hover:border-primary transition-colors">
            {t("o_nas.link_ads")}
          </Link>
        </div>

      </div>
    </div>
  );
}
