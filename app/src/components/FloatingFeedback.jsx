import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function FloatingFeedback() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError(t("feedback.error_empty"));
      return;
    }
    setError("");
    const entry = { name, email, message, date: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem("radar_feedback") || "[]");
    localStorage.setItem("radar_feedback", JSON.stringify([...existing, entry]));
    setSubmitted(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setError("");
      setSubmitted(false);
    }, 300);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Zpětná vazba"
        className="fixed bottom-6 right-6 z-50 w-13 h-13 gradient-primary text-white rounded-full shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center"
        style={{ width: 52, height: 52 }}
      >
        <span className="text-xl">💬</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="gradient-primary text-white px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black font-headline">{t("feedback.title")}</h2>
                <p className="text-primary-fixed-dim text-sm">{t("feedback.subtitle")}</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Zavřít"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {submitted ? (
              <div className="p-8 text-center">
                <p className="text-5xl mb-4">🎉</p>
                <h3 className="text-xl font-black text-primary font-headline mb-2">{t("feedback.success_title")}</h3>
                <p className="text-on-surface-variant">{t("feedback.success_desc")}</p>
                <button
                  onClick={handleClose}
                  className="mt-6 gradient-primary text-white px-6 py-2.5 rounded-full font-bold font-headline text-sm"
                >
                  {t("feedback.close")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-outline uppercase tracking-wider mb-1.5 block font-headline">
                      {t("feedback.name_label")} <span className="text-outline/50 normal-case font-normal">({t("feedback.optional")})</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Petr"
                      className="w-full bg-surface-container border border-outline-variant/20 focus:border-primary/40 rounded-xl px-4 py-2.5 text-sm text-primary placeholder-outline outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-outline uppercase tracking-wider mb-1.5 block font-headline">
                      {t("feedback.email_label")} <span className="text-outline/50 normal-case font-normal">({t("feedback.optional")})</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="petr@email.cz"
                      className="w-full bg-surface-container border border-outline-variant/20 focus:border-primary/40 rounded-xl px-4 py-2.5 text-sm text-primary placeholder-outline outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-outline uppercase tracking-wider mb-1.5 block font-headline">
                    {t("feedback.message_label")} <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); if (error) setError(""); }}
                    placeholder={t("feedback.message_placeholder")}
                    rows={4}
                    className="w-full bg-surface-container border border-outline-variant/20 focus:border-primary/40 rounded-xl px-4 py-2.5 text-sm text-primary placeholder-outline outline-none transition-colors resize-none"
                  />
                  {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full gradient-primary text-white py-3 rounded-xl font-black font-headline text-sm hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  {t("feedback.submit")}
                </button>
                <p className="text-xs text-outline text-center">{t("feedback.privacy")}</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
