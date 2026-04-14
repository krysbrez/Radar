import { useState } from "react";
import { useTranslation } from "react-i18next";
import Mascot from "./Mascot";

function generateReferralId() {
  return "radar-" + Math.random().toString(36).substring(2, 9);
}

function getReferralId() {
  let id = localStorage.getItem("radar_referral_id");
  if (!id) {
    id = generateReferralId();
    localStorage.setItem("radar_referral_id", id);
  }
  return id;
}

export default function Newsletter({ inline = false }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError(t("newsletter.error_email"));
      return;
    }
    setError("");
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
  };

  const referralId = getReferralId();
  const referralLink = `${window.location.origin}?ref=${referralId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PERKS = [
    t("newsletter.perk_monday"),
    t("newsletter.perk_nospam"),
    t("newsletter.perk_free"),
  ];

  const shellClasses = inline
    ? "h-full px-8 md:px-10 py-10"
    : "px-8 md:px-16 py-14";

  const contentClasses = inline
    ? "relative grid gap-8 md:grid-cols-[minmax(0,1.45fr),18rem] md:items-center"
    : "relative max-w-2xl";

  return (
    <section
      id="newsletter"
      className={inline ? "h-full" : "max-w-7xl mx-auto px-6 md:px-8 py-8 pb-20"}
    >
      <div className={`gradient-primary rounded-2xl relative overflow-hidden ${shellClasses}`}>
        {!inline && (
          <div className="absolute right-6 md:right-16 bottom-0 pointer-events-none hidden sm:block">
            <Mascot size={160} mood="happy" variant="signal" trackMouse={false} />
          </div>
        )}

        <div className={contentClasses}>
          {!inline && (
            <>
              {/* Maskot vpravo */}
            </>
          )}
          {!inline ? null : (
            <div className="hidden md:flex md:order-2 flex-col rounded-[1.5rem] border border-white/12 bg-white/8 p-6 backdrop-blur-sm">
              <div className="mx-auto rounded-[1.5rem] bg-white/10 p-4">
                <Mascot size={108} mood="happy" variant="signal" trackMouse={false} />
              </div>
              <p className="mt-5 text-[11px] font-black uppercase tracking-[0.2em] text-white-fixed-dim/70 font-headline">
                Pondělní brief
              </p>
              <h3 className="mt-2 text-xl font-black text-white font-headline leading-tight">
                Jedna čistá dávka signálů.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white-fixed-dim">
                Přehled, co se změnilo, co má smysl hlídat a proč to není jen další mail do složky promo.
              </p>
              <div className="mt-5 space-y-2">
                {["5 min čtení", "bez spamu", "zdarma"].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-sm text-white-fixed-dim">
                    <span className="h-1.5 w-1.5 rounded-full bg-tertiary-fixed" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="relative max-w-2xl md:order-1">
            {/* Badge */}
            <div className="flex items-center gap-3 mb-6">
              {!inline && (
                <div className="sm:hidden">
                  <Mascot size={48} mood="normal" variant="signal" trackMouse={false} />
                </div>
              )}
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-tertiary-fixed rounded-full animate-pulse" />
                <span className="text-white-fixed-dim text-xs font-black uppercase tracking-widest font-headline">
                  {t("newsletter.badge")}
                </span>
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white font-headline tracking-tight leading-tight mb-4">
              {t("newsletter.title")}{" "}
              <span className="text-gradient">{t("newsletter.title_accent")}</span>
            </h2>
            <p className="text-white-fixed-dim text-lg mb-8 leading-relaxed">
              {t("newsletter.subtitle")}
            </p>

            {/* Perks */}
            <div className="flex flex-wrap gap-3 mb-8">
              {PERKS.map((perk) => (
                <div key={perk} className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-tertiary-fixed flex-shrink-0">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm text-white-fixed-dim font-medium">{perk}</span>
                </div>
              ))}
            </div>

            {/* Form or Success */}
            {status === "success" ? (
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="text-white font-black text-xl font-headline mb-2">{t("newsletter.success_title")}</h3>
                  <p className="text-white-fixed-dim">{t("newsletter.success_desc")}</p>
                </div>

                {/* Referral section */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <p className="text-white font-black font-headline mb-1">{t("newsletter.referral_title")}</p>
                  <p className="text-white-fixed-dim text-sm mb-4">{t("newsletter.referral_desc")}</p>

                  {/* Referral link */}
                  <p className="text-xs text-white-fixed-dim/60 uppercase tracking-wider font-bold mb-2">{t("newsletter.referral_link_label")}</p>
                  <div className="flex gap-2 mb-5">
                    <div className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white/80 font-mono truncate">
                      {referralLink}
                    </div>
                    <button
                      onClick={handleCopy}
                      className="bg-white text-white font-black text-xs font-headline px-4 py-2.5 rounded-xl hover:bg-white/8 transition-colors whitespace-nowrap"
                    >
                      {copied ? t("newsletter.referral_copied") : t("newsletter.referral_copy")}
                    </button>
                  </div>

                  {/* Reward tiers */}
                  <p className="text-xs text-white-fixed-dim/60 uppercase tracking-wider font-bold mb-3">Odměny za doporučení</p>
                  <div className="space-y-2">
                    {[
                      { count: 1, reward: "📄 Radar průvodce PDF — 10 kroků k prvnímu ETF", color: "bg-white/10 border-white/20" },
                      { count: 3, reward: "📊 Radar Excel šablona — sleduj portfolio jako profík", color: "bg-yellow-500/20 border-yellow-400/40" },
                      { count: 5, reward: "🏆 Radar Pro přístup — exkluzivní analýzy na měsíc", color: "bg-tertiary-fixed/20 border-tertiary-fixed/40" },
                    ].map(({ count, reward, color }) => (
                      <div key={count} className={`flex items-center gap-3 rounded-xl p-3 border ${color}`}>
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0">{count}</div>
                        <p className="text-xs text-white-fixed-dim leading-snug">{reward}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-white-fixed-dim/50 mt-3">
                    {t("newsletter.referral_share")}: Twitter, WhatsApp, email — cokoliv funguje.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                      placeholder={t("newsletter.placeholder")}
                      className="w-full bg-white/10 border border-white/20 focus:border-white/60 text-white placeholder-white/40 rounded-xl px-5 py-3.5 text-sm font-medium outline-none transition-colors backdrop-blur-sm"
                      disabled={status === "loading"}
                    />
                    {error && <p className="text-tertiary-fixed text-xs mt-1.5 ml-1">{error}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="bg-white text-white font-black text-sm font-headline px-7 py-3.5 rounded-xl hover:bg-white/8 transition-colors whitespace-nowrap disabled:opacity-70 active:scale-95 transition-all"
                  >
                    {status === "loading" ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="32" opacity="0.4" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        {t("newsletter.loading")}
                      </span>
                    ) : t("newsletter.submit")}
                  </button>
                </div>
                <p className="text-white/50 text-xs mt-3">{t("newsletter.unsubscribe")}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
