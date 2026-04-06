import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Mascot from "./Mascot";

const LANGUAGES = [
  { code: "cs", flag: "🇨🇿", label: "CS" },
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "de", flag: "🇩🇪", label: "DE" },
];

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors border border-outline-variant/20"
      >
        <span>{current.flag}</span>
        <span className="font-headline">{current.label}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white rounded-xl border border-outline-variant/15 shadow-lg py-1 min-w-[100px] z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold hover:bg-surface-container transition-colors ${i18n.language === lang.code ? "text-primary" : "text-on-surface-variant"}`}
            >
              <span>{lang.flag}</span>
              <span className="font-headline">{lang.label}</span>
              {i18n.language === lang.code && <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full"/>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileLangSwitcher() {
  const { i18n } = useTranslation();
  return (
    <div className="pt-2 flex gap-2">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${i18n.language === lang.code ? "border-primary text-primary bg-primary/5" : "border-outline-variant/20 text-on-surface-variant hover:bg-surface-container"}`}
        >
          {lang.flag} {lang.label}
        </button>
      ))}
    </div>
  );
}

function ToolsDropdown({ onClick }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const TOOL_LINKS = [
    { label: t("nav.tools_broker"), path: "/srovnavac-brokeru", icon: "⚖️" },
    { label: t("nav.tools_calc"), path: "/kalkulacky", icon: "🧮" },
    { label: t("nav.tools_glossary"), path: "/slovnik", icon: "📖" },
    { label: t("nav.tools_start"), path: "/jak-zacit", icon: "🚀" },
    { label: t("nav.tools_tax"), path: "/dane", icon: "🧾" },
    { label: t("nav.tools_milionari"), path: "/milionari", icon: "💎" },
  ];

  const isActive = ["/srovnavac-brokeru", "/kalkulacky", "/slovnik", "/jak-zacit", "/dane", "/milionari"].includes(location.pathname);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`relative px-3 py-2 text-sm font-semibold font-headline tracking-tight transition-colors rounded-lg flex items-center gap-1 ${
          isActive ? "text-primary" : "text-on-surface-variant hover:text-primary"
        }`}
      >
        {t("nav.tools")}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
        {isActive && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl border border-outline-variant/15 shadow-lg py-2 min-w-[220px] z-50">
          {TOOL_LINKS.map((link) => (
            <button
              key={link.path}
              onClick={() => { navigate(link.path); setOpen(false); onClick?.(); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-container transition-colors text-left ${location.pathname === link.path ? "text-primary font-bold" : "text-on-surface-variant"}`}
            >
              <span className="text-base">{link.icon}</span>
              <span className="font-semibold font-headline">{link.label}</span>
              {location.pathname === link.path && <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full"/>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NavItem({ link, onClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = (e) => {
    e.preventDefault();
    if (link.path) {
      navigate(link.path);
    } else {
      navigate({ pathname: "/", hash: `#${link.hash}` });
    }
    onClick?.();
  };

  const isActive = link.path
    ? location.pathname === link.path
    : location.pathname === "/" && location.hash === `#${link.hash}`;

  return (
    <button
      onClick={handleClick}
      className={`relative px-3 py-2 text-sm font-semibold font-headline tracking-tight transition-colors rounded-lg ${
        isActive ? "text-primary" : "text-on-surface-variant hover:text-primary"
      }`}
    >
      {link.label ?? t(link.tKey)}
      {isActive && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />}
    </button>
  );
}

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV_LINKS = [
    { label: t("nav.investing"), tKey: "nav.investing", hash: "investovani" },
    { label: t("nav.stocks"), tKey: "nav.stocks", path: "/akcie" },
    { label: t("nav.crypto"), tKey: "nav.crypto", path: "/krypto" },
    { label: t("nav.forex"), tKey: "nav.forex", path: "/forex" },
    { label: t("nav.real_estate"), tKey: "nav.real_estate", path: "/nemovitosti" },
    { label: t("nav.cars"), tKey: "nav.cars", path: "/auta" },
    { label: t("nav.know_how"), tKey: "nav.know_how", path: "/knowhow" },
    { label: t("nav.archive"), tKey: "nav.archive", path: "/archiv" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,6,19,0.08)]" : "bg-surface/80 backdrop-blur-xl"
    }`}>
      <div className="flex justify-between items-center px-6 md:px-8 py-2 max-w-7xl mx-auto">
        <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-headline font-black text-sm">R</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-primary uppercase font-headline">RADAR</span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <NavItem key={link.tKey} link={link} />
          ))}
          <ToolsDropdown />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <Link
              to="/#newsletter"
              aria-label="Hledat a procházet obsah"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </Link>
            <Link
              to="/#newsletter"
              className="gradient-primary text-white px-5 py-2 rounded-full font-bold text-sm font-headline tracking-tight hover:opacity-90 active:scale-95 transition-all"
            >
              {t("nav.subscribe_free")}
            </Link>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            aria-label={mobileOpen ? "Zavřít menu" : "Otevřít menu"}
          >
            <div className="bg-surface-container-low rounded-xl p-0.5">
              <Mascot size={42} mood={mobileOpen ? "surprised" : "normal"} trackMouse={false} variant="idle" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-screen" : "max-h-0"}`}>
        <div className="px-6 pb-5 pt-2 bg-white/97 backdrop-blur-xl border-t border-outline-variant/10 space-y-1">
          <div className="flex items-center gap-3 py-3 mb-1">
            <div className="bg-surface-container-low rounded-xl p-1">
              <Mascot size={44} mood="happy" trackMouse={false} variant="signal" />
            </div>
            <div>
              <p className="text-sm font-black text-primary font-headline">{t("nav.hi_im_radar")}</p>
              <p className="text-xs text-outline">{t("nav.where_today")}</p>
            </div>
          </div>
          {NAV_LINKS.map((link) => (
            <NavItem key={link.tKey} link={link} onClick={() => setMobileOpen(false)} />
          ))}
          {/* Mobile tools links */}
          <div className="pt-2 border-t border-outline-variant/10">
            <p className="text-xs font-black text-outline uppercase tracking-widest px-3 py-1 font-headline">{t("nav.tools")}</p>
            {[
              { label: t("nav.tools_broker"), path: "/srovnavac-brokeru" },
              { label: t("nav.tools_calc"), path: "/kalkulacky" },
              { label: t("nav.tools_glossary"), path: "/slovnik" },
              { label: t("nav.tools_start"), path: "/jak-zacit" },
            ].map((item) => (
              <NavItem key={item.path} link={{ tKey: "_", path: item.path, label: item.label }} onClick={() => setMobileOpen(false)} />
            ))}
          </div>
          {/* Language switcher mobile */}
          <MobileLangSwitcher />
          <div className="pt-2 block">
            <Link
              to="/#newsletter"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center gradient-primary text-white px-5 py-3 rounded-full font-bold text-sm font-headline"
            >
              {t("nav.subscribe_free")}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
