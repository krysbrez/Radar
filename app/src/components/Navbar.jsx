import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "cs", flag: "🇨🇿", label: "CS" },
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "de", flag: "🇩🇪", label: "DE" },
];

const MARKETS = [
  { label: "Akcie", path: "/akcie" },
  { label: "Krypto", path: "/krypto" },
  { label: "Forex", path: "/forex" },
  { label: "Nemovitosti", path: "/nemovitosti" },
  { label: "Auta", path: "/auta" },
];

const TOOLS = [
  { label: "Srovnávač brokerů", path: "/srovnavac-brokeru" },
  { label: "Kalkulačky", path: "/kalkulacky" },
  { label: "Jak začít", path: "/jak-zacit" },
  { label: "Hlídač cen", path: "/hlidac" },
  { label: "Slovník", path: "/slovnik" },
  { label: "Daně", path: "/dane" },
];

function useOutsideClick(ref, onClose) {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onClose]);
}

function Chevron({ open }) {
  return (
    <svg
      width="10" height="10" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function MarketsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = MARKETS.some((m) => location.pathname === m.path);

  useOutsideClick(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`relative flex items-center gap-1 px-3 py-2 text-sm font-semibold font-headline tracking-tight rounded-lg transition-colors ${
          isActive ? "text-white" : "text-white/50 hover:text-white"
        }`}
      >
        Trhy
        <Chevron open={open} />
        {isActive && (
          <span className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-[#ffd700] rounded-full" />
        )}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-[#000d1f] border border-white/8 rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.7)] py-1.5 min-w-[160px] z-50">
          {MARKETS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm font-semibold font-headline transition-colors hover:bg-white/5 flex items-center justify-between ${
                  active ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {item.label}
                {active && <span className="w-1.5 h-1.5 bg-[#ffd700] rounded-full flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ToolsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = TOOLS.some((t) => location.pathname === t.path);

  useOutsideClick(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`relative flex items-center gap-1 px-3 py-2 text-sm font-semibold font-headline tracking-tight rounded-lg transition-colors ${
          isActive ? "text-white" : "text-white/50 hover:text-white"
        }`}
      >
        Nástroje
        <Chevron open={open} />
        {isActive && (
          <span className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-[#ffd700] rounded-full" />
        )}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-[#000d1f] border border-white/8 rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.7)] py-1.5 min-w-[200px] z-50">
          {TOOLS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm font-semibold font-headline transition-colors hover:bg-white/5 flex items-center justify-between ${
                  active ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {item.label}
                {active && <span className="w-1.5 h-1.5 bg-[#ffd700] rounded-full flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`relative px-3 py-2 text-sm font-semibold font-headline tracking-tight rounded-lg transition-colors ${
        isActive ? "text-white" : "text-white/50 hover:text-white"
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-[#ffd700] rounded-full" />
      )}
    </Link>
  );
}

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  useOutsideClick(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold font-headline text-white/50 hover:text-white border border-white/8 hover:border-white/15 transition-colors"
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-[#000d1f] border border-white/8 rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.7)] py-1.5 min-w-[100px] z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold font-headline hover:bg-white/5 transition-colors ${
                i18n.language === lang.code ? "text-white" : "text-white/55 hover:text-white"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
              {i18n.language === lang.code && (
                <span className="ml-auto w-1.5 h-1.5 bg-[#ffd700] rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileSection({ title, items, closeMobile, location }) {
  return (
    <div className="px-6 pt-6">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/30 mb-1">{title}</p>
      {items.map((item) => {
        const active = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={closeMobile}
            className={`flex items-center justify-between py-3 text-sm font-semibold font-headline border-b border-white/4 last:border-0 transition-colors ${
              active ? "text-white" : "text-white/60 hover:text-white"
            }`}
          >
            {item.label}
            {active && <span className="w-1.5 h-1.5 bg-[#ffd700] rounded-full flex-shrink-0" />}
          </Link>
        );
      })}
    </div>
  );
}

export default function Navbar() {
  const { i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled
        ? "bg-[#000d1f]/95 backdrop-blur-xl border-b border-white/6"
        : "bg-[#000613]/70 backdrop-blur-xl"
    }`}>
      <div className="flex justify-between items-center px-6 md:px-8 py-3 max-w-7xl mx-auto">

        {/* Logo */}
        <Link to="/" onClick={closeMobile} className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-headline font-black text-xs">R</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase font-headline">RADAR</span>
        </Link>

        {/* Desktop center nav */}
        <div className="hidden md:flex items-center gap-0.5">
          <MarketsMenu />
          <NavLink to="/knowhow">Know How</NavLink>
          <NavLink to="/archiv">Archiv</NavLink>
          <ToolsMenu />
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            to="/muj-radar"
            className={`px-3 py-1.5 rounded-lg text-sm font-bold font-headline border transition-colors ${
              location.pathname === "/muj-radar"
                ? "border-white/15 bg-white/8 text-white"
                : "border-white/8 text-white/60 hover:text-white hover:border-white/15"
            }`}
          >
            Můj Radar
          </Link>
          <Link
            to="/#newsletter"
            className="gradient-primary text-white px-4 py-1.5 rounded-full font-bold text-sm font-headline hover:opacity-90 active:scale-95 transition-all"
          >
            Odebírat
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px]"
          aria-label={mobileOpen ? "Zavřít menu" : "Otevřít menu"}
        >
          <span className={`block w-5 h-[1.5px] bg-white/80 rounded-full transition-all duration-200 origin-center ${mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
          <span className={`block w-5 h-[1.5px] bg-white/80 rounded-full transition-all duration-200 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-5 h-[1.5px] bg-white/80 rounded-full transition-all duration-200 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu panel */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? "max-h-[90vh]" : "max-h-0"}`}>
        <div className="bg-[#000613] border-t border-white/6 overflow-y-auto max-h-[85vh]">

          <MobileSection
            title="Trhy"
            items={MARKETS}
            closeMobile={closeMobile}
            location={location}
          />

          <MobileSection
            title="Vzdělávání"
            items={[
              { label: "Know How", path: "/knowhow" },
              { label: "Archiv článků", path: "/archiv" },
            ]}
            closeMobile={closeMobile}
            location={location}
          />

          <MobileSection
            title="Nástroje"
            items={TOOLS}
            closeMobile={closeMobile}
            location={location}
          />

          {/* Bottom actions */}
          <div className="px-6 pt-6 pb-10">
            <Link
              to="/#newsletter"
              onClick={closeMobile}
              className="block w-full text-center gradient-primary text-white py-3 rounded-xl font-bold text-sm font-headline mb-3"
            >
              Odebírat zdarma
            </Link>
            <Link
              to="/muj-radar"
              onClick={closeMobile}
              className="block w-full text-center border border-white/8 text-white/60 py-3 rounded-xl font-bold text-sm font-headline hover:text-white hover:border-white/15 transition-colors mb-5"
            >
              Můj Radar
            </Link>
            <div className="flex justify-center gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-headline border transition-colors ${
                    i18n.language === lang.code
                      ? "border-[#ffd700]/30 text-[#ffd700] bg-[#ffd700]/8"
                      : "border-white/8 text-white/45 hover:text-white hover:border-white/15"
                  }`}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
