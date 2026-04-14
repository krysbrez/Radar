import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "../components/Mascot";

function ContactForm() {
  const { t } = useTranslation();
  const SUBJECTS = [
    t("kontakt_page.subject_1"),
    t("kontakt_page.subject_2"),
    t("kontakt_page.subject_3"),
    t("kontakt_page.subject_4"),
    t("kontakt_page.subject_5"),
  ];
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (sent) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
        <div className="flex justify-center mb-4">
          <Mascot size={72} mood="happy" variant="signal" trackMouse={false} />
        </div>
        <h3 className="text-2xl font-black text-green-800 font-headline mb-2">{t("kontakt_page.success_title")}</h3>
        <p className="text-green-700 text-sm">{t("kontakt_page.success_desc")}</p>
        <button
          onClick={() => setSent(false)}
          className="mt-5 text-sm font-bold text-green-700 underline underline-offset-2"
        >
          {t("kontakt_page.success_again")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">{t("kontakt_page.label_name")}</label>
          <input
            required type="text" value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder={t("kontakt_page.placeholder_name")}
            className="w-full bg-white border border-white/12/20 focus:border-[#ffd700]/40/40 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">{t("kontakt_page.label_email")}</label>
          <input
            required type="email" value={form.email}
            onChange={e => set("email", e.target.value)}
            placeholder={t("kontakt_page.placeholder_email")}
            className="w-full bg-white border border-white/12/20 focus:border-[#ffd700]/40/40 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">{t("kontakt_page.label_subject")}</label>
        <select
          value={form.subject}
          onChange={e => set("subject", e.target.value)}
          className="w-full bg-white border border-white/12/20 focus:border-[#ffd700]/40/40 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors"
        >
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-black text-white/55 uppercase tracking-wider mb-1.5 block font-headline">{t("kontakt_page.label_message")}</label>
        <textarea
          required value={form.message}
          onChange={e => set("message", e.target.value)}
          rows={5}
          placeholder={t("kontakt_page.placeholder_message")}
          className="w-full bg-white border border-white/12/20 focus:border-[#ffd700]/40/40 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full gradient-primary text-white font-black text-sm font-headline py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all"
      >
        {t("kontakt_page.btn_submit")}
      </button>
    </form>
  );
}

export default function KontaktPage() {
  const { t } = useTranslation();

  const CONTACTS = [
    { icon: "✉️", label: t("kontakt_page.contact_redakce_label"), value: "redakce@radar.cz", href: "mailto:redakce@radar.cz" },
    { icon: "📣", label: t("kontakt_page.contact_inzerce_label"), value: "inzerce@radar.cz", href: "mailto:inzerce@radar.cz" },
    { icon: "🔧", label: t("kontakt_page.contact_tech_label"), value: "tech@radar.cz", href: "mailto:tech@radar.cz" },
    { icon: "📍", label: t("kontakt_page.contact_adresa_label"), value: t("kontakt_page.contact_adresa_val"), href: null },
  ];

  return (
    <div className="min-h-screen bg-white/4">

      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-8 pt-12 pb-14">
          <nav className="flex items-center gap-2 text-xs text-white-fixed-dim/60 mb-8">
            <Link to="/" className="hover:text-white transition-colors">Radar</Link>
            <span>›</span>
            <span className="text-white-fixed-dim">{t("footer.contact")}</span>
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-4 leading-tight">
                {t("kontakt_page.hero_title")}<br />
                <span className="text-tertiary-fixed">{t("kontakt_page.hero_title_accent")}</span>
              </h1>
              <p className="text-white-fixed-dim text-lg leading-relaxed max-w-xl">
                {t("kontakt_page.hero_subtitle")}
              </p>
            </div>
            <div className="hidden md:block flex-shrink-0 bg-white/10 rounded-3xl p-4">
              <Mascot size={110} mood="happy" variant="signal" trackMouse={false} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
        <div className="grid md:grid-cols-5 gap-8">

          {/* Formulář */}
          <div className="md:col-span-3">
            <h2 className="text-xl font-black font-headline text-white mb-5">{t("kontakt_page.form_title")}</h2>
            <div className="bg-white rounded-2xl border border-white/12/10 p-6">
              <ContactForm />
            </div>
          </div>

          {/* Kontakty */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-black font-headline text-white mb-5">{t("kontakt_page.direct_title")}</h2>
            {CONTACTS.map((c) => (
              <div key={c.label} className="bg-white rounded-2xl border border-white/12/10 p-4 flex gap-3 items-start">
                <span className="text-xl flex-shrink-0">{c.icon}</span>
                <div>
                  <p className="text-xs font-black text-white/55 uppercase tracking-wider font-headline mb-0.5">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} className="text-sm text-white font-bold hover:underline">{c.value}</a>
                  ) : (
                    <p className="text-sm text-white/65 whitespace-pre-line">{c.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="bg-white/5 rounded-2xl p-5 border border-white/12/10">
              <p className="text-xs font-black text-white/55 uppercase tracking-wider font-headline mb-2">{t("kontakt_page.hours_title")}</p>
              <p className="text-sm text-white/65">{t("kontakt_page.hours_days")}</p>
              <p className="text-sm text-white/65">{t("kontakt_page.hours_email")}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
