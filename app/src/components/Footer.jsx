import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  const LINKS = {
    [t("footer.content_section")]: [
      { label: t("nav.investing"), to: "/#investovani" },
      { label: t("nav.crypto"), to: "/krypto" },
      { label: t("nav.forex"), to: "/forex" },
      { label: t("nav.stocks"), to: "/akcie" },
      { label: t("nav.real_estate"), to: "/nemovitosti" },
      { label: t("nav.cars"), to: "/auta" },
      { label: t("nav.archive"), to: "/archiv" },
    ],
    [t("footer.alt_section")]: [
      { label: t("footer.watches"), to: "/kategorie/hodinky" },
      { label: t("footer.gold"), to: "/kategorie/zlato" },
      { label: t("footer.pokemon"), to: "/kategorie/pokemon" },
      { label: t("footer.wine"), to: "/kategorie/vino" },
      { label: t("footer.sneakers"), to: "/kategorie/sneakers" },
      { label: t("footer.art"), to: "/kategorie/umeni" },
      { label: t("footer.lego"), to: "/kategorie/lego" },
      { label: t("footer.diamonds"), to: "/kategorie/diamanty" },
    ],
    [t("footer.radar_section")]: [
      { label: t("footer.about"), to: "/o-nas" },
      { label: t("footer.team"), to: "/tym" },
      { label: t("footer.advertise"), to: "/inzerce" },
      { label: t("footer.newsletter_link"), to: "/#newsletter" },
      { label: t("footer.contact"), to: "/kontakt" },
    ],
    [t("footer.legal_section")]: [
      { label: t("footer.terms"), to: "/podminky" },
      { label: t("footer.privacy"), to: "/soukromi" },
      { label: t("footer.cookies"), to: "/cookies" },
      { label: t("footer.risks"), to: "/rizika" },
    ],
  };

  return (
    <footer className="bg-primary text-white mt-0">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white font-headline font-black text-sm">R</span>
              </div>
              <span className="text-2xl font-black tracking-tighter font-headline uppercase">RADAR</span>
            </div>
            <p className="text-primary-fixed-dim text-sm leading-relaxed mb-5 max-w-xs">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
              <span className="text-xs text-primary-fixed-dim font-semibold">47 238 {t("footer.active_readers")}</span>
            </div>

            {/* Contact */}
            <div className="space-y-2 mb-5">
              <a href="mailto:redakce@radar.cz" className="flex items-center gap-2 text-xs text-primary-fixed-dim hover:text-white transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                redakce@radar.cz
              </a>
              <a href="tel:+420222000000" className="flex items-center gap-2 text-xs text-primary-fixed-dim hover:text-white transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.39 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.08 6.08l1.95-1.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +420 222 000 000
              </a>
            </div>

            {/* Social */}
            <div className="flex gap-2.5">
              {[
                { label: "Twitter/X", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                { label: "Instagram", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
                { label: "LinkedIn", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-primary-fixed-dim hover:text-white transition-all">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section} className="md:col-span-2">
              <p className="text-xs font-black text-primary-fixed-dim/50 uppercase tracking-widest mb-4 font-headline">{section}</p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-primary-fixed-dim hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter CTA */}
          <div className="md:col-span-1">
            <p className="text-xs font-black text-primary-fixed-dim/50 uppercase tracking-widest mb-4 font-headline">{t("footer.subscribe_section")}</p>
            <p className="text-sm text-primary-fixed-dim mb-4 leading-relaxed">{t("footer.subscribe_desc")}</p>
            <Link to="/#newsletter" className="inline-block bg-white text-primary font-black text-sm font-headline px-5 py-2.5 rounded-xl hover:bg-primary-fixed transition-colors whitespace-nowrap">
              {t("footer.subscribe_btn")}
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-fixed-dim/50 text-center md:text-left">
            {t("footer.copyright")}
          </p>
          <p className="text-xs text-primary-fixed-dim/40 text-center max-w-md">
            {t("footer.disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
