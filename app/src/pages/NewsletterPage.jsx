import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "../components/Mascot";

function SignupForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="text-center py-6">
        <div className="flex justify-center mb-4">
          <Mascot size={72} mood="happy" variant="signal" trackMouse={false} />
        </div>
        <p className="text-2xl font-black text-white font-headline mb-2">{t("newsletter_page.success_title")}</p>
        <p className="text-white/65 text-sm">{t("newsletter_page.success_desc")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="flex flex-col sm:flex-row gap-3">
      <input
        required type="email" value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder={t("newsletter_page.placeholder")}
        className="flex-1 bg-white border border-white/12/20 focus:border-[#ffd700]/40/40 rounded-xl px-5 py-3.5 text-sm text-white outline-none transition-colors"
      />
      <button
        type="submit"
        className="gradient-primary text-white font-black text-sm font-headline px-7 py-3.5 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all whitespace-nowrap"
      >
        {t("newsletter_page.btn_subscribe")}
      </button>
    </form>
  );
}

export default function NewsletterPage() {
  const { t } = useTranslation();

  const REASONS = [
    { icon: "⏱️", title: t("newsletter_page.reason_1_title"), desc: t("newsletter_page.reason_1_desc") },
    { icon: "🧠", title: t("newsletter_page.reason_2_title"), desc: t("newsletter_page.reason_2_desc") },
    { icon: "🎯", title: t("newsletter_page.reason_3_title"), desc: t("newsletter_page.reason_3_desc") },
  ];

  const STRUCTURE = [
    { emoji: "📡", title: "Radar Signal", desc: t("newsletter_page.struct_1_desc") },
    { emoji: "📊", title: t("newsletter_page.struct_2_title"), desc: t("newsletter_page.struct_2_desc") },
    { emoji: "🔍", title: t("newsletter_page.struct_3_title"), desc: t("newsletter_page.struct_3_desc") },
    { emoji: "💡", title: t("newsletter_page.struct_4_title"), desc: t("newsletter_page.struct_4_desc") },
    { emoji: "😄", title: "Radar WTF", desc: t("newsletter_page.struct_5_desc") },
  ];

  return (
    <div className="min-h-screen bg-white/4">

      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-3xl mx-auto px-6 md:px-8 pt-14 pb-16 text-center">
          <nav className="flex items-center justify-center gap-2 text-xs text-white-fixed-dim/60 mb-10">
            <Link to="/" className="hover:text-white transition-colors">Radar</Link>
            <span>›</span>
            <span className="text-white-fixed-dim">{t("newsletter_page.breadcrumb")}</span>
          </nav>

          <div className="flex justify-center mb-6">
            <Mascot size={90} mood="happy" variant="signal" trackMouse={false} />
          </div>

          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs font-black text-white-fixed-dim uppercase tracking-widest font-headline">{t("newsletter_page.badge_readers")}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tight mb-4 leading-tight">
            {t("newsletter_page.hero_title")}<br />
            <span className="text-tertiary-fixed">{t("newsletter_page.hero_title_accent")}</span>
          </h1>
          <p className="text-xl text-white-fixed-dim mb-10">
            {t("newsletter_page.hero_subtitle")} <strong className="text-white">{t("newsletter_page.hero_free")}</strong>
          </p>

          {/* Signup */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 max-w-xl mx-auto">
            <SignupForm />
            <p className="text-xs text-white-fixed-dim/60 mt-3 text-center">
              {t("newsletter_page.disclaimer")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-14 space-y-14">

        {/* 3 důvody */}
        <section>
          <h2 className="text-2xl font-black font-headline text-white mb-2 text-center">{t("newsletter_page.why_title")}</h2>
          <p className="text-white/65 text-center mb-8">{t("newsletter_page.why_subtitle")}</p>
          <div className="grid md:grid-cols-3 gap-5">
            {REASONS.map((r) => (
              <div key={r.title} className="bg-white rounded-2xl border border-white/12/10 p-6 text-center shadow-sm">
                <div className="text-3xl mb-3">{r.icon}</div>
                <h3 className="font-black text-white font-headline text-lg mb-2">{r.title}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Struktura newsletteru */}
        <section>
          <h2 className="text-2xl font-black font-headline text-white mb-2">{t("newsletter_page.struct_title")}</h2>
          <p className="text-white/65 mb-6">{t("newsletter_page.struct_sub")}</p>
          <div className="bg-white rounded-2xl border border-white/12/10 overflow-hidden">
            {STRUCTURE.map((s, i) => (
              <div
                key={s.title}
                className={`flex items-center gap-4 px-6 py-4 ${i < STRUCTURE.length - 1 ? "border-b border-white/12/10" : ""}`}
              >
                <span className="text-2xl flex-shrink-0">{s.emoji}</span>
                <div className="flex-1">
                  <p className="font-black text-white font-headline text-sm">{s.title}</p>
                  <p className="text-xs text-white/65 mt-0.5">{s.desc}</p>
                </div>
                <span className="text-xs text-white/55 bg-white/5 px-2 py-0.5 rounded-full font-bold">{t("newsletter_page.struct_weekly")}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA repeat */}
        <div className="gradient-primary rounded-2xl p-8 text-white text-center">
          <p className="text-2xl font-black font-headline mb-2">{t("newsletter_page.cta_title")}</p>
          <p className="text-white-fixed-dim mb-6 text-sm">{t("newsletter_page.cta_sub")}</p>
          <div className="max-w-md mx-auto">
            <SignupForm />
          </div>
        </div>

      </div>
    </div>
  );
}
