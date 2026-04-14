import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "../components/Mascot";

const AGENTS = [
  {
    emoji: "🔍",
    name: "Analytik",
    role: "Research Agent",
    bio: "Přečte 500 článků za hodinu. Nikdy si nevezme sick day. Nikdy si nestěžuje na kávu v kanceláři. Protože kávu nepije. Jí data.",
    stats: ["500 článků/hod", "0 sick days", "24/7 online"],
    color: "bg-blue-500",
    light: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  {
    emoji: "📝",
    name: "Redaktor",
    role: "Content Agent",
    bio: "Píše rychleji než ty stihneš přečíst. Má rád přesná čísla, dobré nadpisy a věty které nespadnou do clickbaitu. Reuters meets TikTok — ale pro chytré lidi.",
    stats: ["50 článků/týden", "0 překlepů", "3min čtení"],
    color: "bg-purple-500",
    light: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
  },
  {
    emoji: "📱",
    name: "Markeťák",
    role: "Social Media Agent",
    bio: "Každý den vymyslí 10 postů. Nikdy mu nedojdou nápady. Trochu obsedantní ohledně hashtagů. Hodně obsedantní ohledně engagement rate.",
    stats: ["10 postů/den", "∞ nápadů", "0 krizí"],
    color: "bg-pink-500",
    light: "bg-pink-50",
    border: "border-pink-200",
    text: "text-pink-700",
  },
  {
    emoji: "🔔",
    name: "Hlídač",
    role: "Alert Agent",
    bio: "Nespí. Nikdy. Hlídá Sauto, Sreality a 40 dalších webů 24 hodin denně. Kdyby byl člověk, byl by nejlepší detektiv na světě. Nebo nejhorší parťák na výletě.",
    stats: ["40+ webů", "24/7 hlídání", "0 přestávek"],
    color: "bg-orange-500",
    light: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
  },
  {
    emoji: "📧",
    name: "Pošťák",
    role: "Newsletter Agent",
    bio: "Každé pondělí v 8:00 bez výjimky. Přesnější než švýcarské hodinky. Nesnáší spam. Miluje dobré předmětové řádky. A tebe, čtenáři. Vážně.",
    stats: ["Každé pondělí", "8:00 přesně", "0 spamu"],
    color: "bg-green-500",
    light: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
  },
];

export default function TymPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white/4">
      {/* Hero */}
      <div className="gradient-primary text-white">
        <div className="max-w-5xl mx-auto px-6 md:px-8 pt-10 pb-12">
          <nav className="flex items-center gap-2 text-xs text-white-fixed-dim/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">{t("common.breadcrumb_home")}</Link>
            <span>›</span>
            <span className="text-white-fixed-dim">{t("tym.breadcrumb")}</span>
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
                <span className="text-xs font-black text-white-fixed-dim uppercase tracking-widest font-headline">{t("tym.hero_badge")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-4">
                {t("tym.hero_title")}<br /><span className="text-tertiary-fixed">{t("tym.hero_title_accent")}</span>
              </h1>
              <p className="text-white-fixed-dim text-lg leading-relaxed max-w-xl">
                {t("tym.hero_subtitle")}
              </p>
            </div>
            <div className="hidden md:block flex-shrink-0 bg-white/10 rounded-3xl p-4">
              <Mascot size={120} mood="happy" variant="signal" trackMouse={false} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-10 space-y-14">

        {/* SEKCE 1 — CEO */}
        <section>
          <div className="bg-white rounded-3xl border border-white/12/10 overflow-hidden shadow-sm">
            <div className="flex flex-col md:flex-row">
              {/* Foto strana */}
              <div className="md:w-72 flex-shrink-0 bg-gradient-to-br from-primary to-primary-container flex items-center justify-center p-10">
                <div className="text-center">
                  <div className="mx-auto mb-5 flex h-40 w-40 items-center justify-center rounded-3xl border-4 border-white/20 bg-white/10 shadow-lg backdrop-blur-sm">
                    <span className="font-headline text-5xl font-black tracking-tight text-white">K.B.</span>
                  </div>
                  <p className="text-white font-black font-headline text-2xl">K.B.</p>
                  <div className="inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 mt-2">
                    <span className="text-xs font-black text-white/90 uppercase tracking-wider font-headline">Founder & CEO</span>
                  </div>
                </div>
              </div>

              {/* Bio strana */}
              <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                <p className="text-white/85 leading-relaxed text-lg mb-6">
                  "Jsem student, sportovec a zakladatel Radaru. Nevěřím, že finance jsou jen pro lidi v oblecích. Radar jsem založil proto, aby každý mladý člověk měl přístup k informacím, které dřív dostávali jen ti 'správní' lidé. Náš tým? Trochu neobvyklý. Ale funguje."
                </p>
                <div className="flex flex-wrap gap-2">
                  {["🎓 Student", "🏃 Sportovec", "📡 Founder Radaru", "💡 Finanční vzdělání pro každého"].map(tag => (
                    <span key={tag} className="text-xs bg-white/5 px-3 py-1.5 rounded-full text-white/55 font-bold">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEKCE 2 — Tým */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black font-headline text-white mb-2">
              {t("tym.team_section_title")}
            </h2>
            <p className="text-white/65 text-lg">
              {t("tym.team_section_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AGENTS.map((agent) => (
              <div key={agent.name} className={`${agent.light} border ${agent.border} rounded-2xl p-6 flex flex-col`}>
                {/* Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-14 h-14 ${agent.color} rounded-2xl flex items-center justify-center text-2xl shadow-sm`}>
                    {agent.emoji}
                  </div>
                  <div>
                    <p className={`font-black font-headline text-lg ${agent.text}`}>{agent.name}</p>
                    <p className="text-xs text-white/55 font-bold">{agent.role}</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-white/85 leading-relaxed flex-1 mb-5">{agent.bio}</p>

                {/* Stats */}
                <div className={`${agent.light} rounded-xl p-3 space-y-2`}>
                  {agent.stats.map(stat => (
                    <div key={stat} className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${agent.color} flex-shrink-0`}></span>
                      <span className={`text-xs font-black ${agent.text}`}>{stat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Mascot card */}
            <div className="gradient-primary rounded-2xl p-6 text-white flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
                  <Mascot size={40} mood="happy" variant="signal" trackMouse={false} />
                </div>
                <div>
                  <p className="font-black font-headline text-lg">Radar</p>
                  <p className="text-xs text-white-fixed-dim font-bold">Mascot & Brand Voice</p>
                </div>
              </div>
              <p className="text-sm text-white-fixed-dim leading-relaxed flex-1 mb-5">
                Tvář Radaru. Hlídá trhy. Nikdy nepanikuje. Mírně arogantní — ale má vždy pravdu.
              </p>
              <div className="space-y-2">
                {["Hlídač nálady trhů", "Průvodce začátečníků", "Never sells at bottom"].map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-tertiary-fixed rounded-full flex-shrink-0"></span>
                    <span className="text-xs font-black text-white-fixed-dim">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SEKCE 3 — Tagline */}
        <section>
          <div className="bg-gray-950 rounded-3xl p-10 md:p-14 text-center">
            <p className="text-2xl md:text-3xl font-black font-headline text-white mb-3 leading-snug">
              Transparentnost je náš základ.
            </p>
            <p className="text-2xl md:text-3xl font-black font-headline text-gray-300 mb-3 leading-snug">
              Víme, že AI mění svět.
            </p>
            <p className="text-2xl md:text-3xl font-black font-headline text-green-400 leading-snug">
              Rozhodli jsme se ji využít — a přiznat to.
            </p>
            <p className="text-gray-500 text-base mt-8 max-w-2xl mx-auto leading-relaxed">
              Automatizace nám dává superschopnost: zpracovat stovkrát více informací za zlomek ceny. To se přímo promítá do kvality obsahu, který dostáváš každé pondělí.
            </p>
          </div>
        </section>

        {/* Join CTA */}
        <section>
          <div className="gradient-primary rounded-2xl p-8 text-white text-center">
            <Mascot size={72} mood="happy" variant="signal" trackMouse={false} />
            <p className="text-2xl font-black font-headline mt-4 mb-2">{t("tym.join_title")}</p>
            <p className="text-white-fixed-dim mb-6 max-w-md mx-auto">
              {t("tym.join_desc")}
            </p>
            <Link to="/kontakt" className="bg-white text-white font-black text-sm font-headline px-6 py-2.5 rounded-full hover:bg-white/8 transition-colors">
              {t("tym.join_cta")}
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
