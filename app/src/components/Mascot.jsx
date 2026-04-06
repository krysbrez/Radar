import { useState, useEffect, useRef } from "react";

/**
 * Radar — maskot.
 *
 * Props:
 *   size        — px, default 120
 *   variant     — "idle" | "signal" | "both"  (výchozí animace)
 *   mood        — "normal" | "happy" | "surprised" | "thinking"
 *   trackMouse  — bool, oči sledují kurzor
 *   className   — extra třídy
 *   onClick     — handler
 */
export default function Mascot({
  size = 120,
  variant = "both",
  mood: moodProp = "normal",
  trackMouse = true,
  className = "",
  onClick,
}) {
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [mood, setMood] = useState(moodProp);
  const ref = useRef(null);

  /* ── Sledování myši ── */
  useEffect(() => {
    if (!trackMouse) return;
    const onMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const strength = Math.min(dist / 80, 1) * 2.8;
      setEyeOffset({ x: (dx / dist) * strength, y: (dy / dist) * strength });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [trackMouse]);

  /* ── Mrkání ── */
  useEffect(() => {
    let t;
    const schedule = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); schedule(); }, 140);
      }, 2200 + Math.random() * 3500);
    };
    schedule();
    return () => clearTimeout(t);
  }, []);

  /* ── Nálada reaguje na prop ── */
  useEffect(() => setMood(moodProp), [moodProp]);

  /* ── Tvary podle nálady ── */
  const mouth = {
    normal:    "M 38 70 Q 50 79 62 70",
    happy:     "M 36 68 Q 50 82 64 68",
    surprised: "M 43 67 Q 50 76 57 67",
    thinking:  "M 40 72 Q 50 69 60 72",
  }[mood] ?? "M 38 70 Q 50 79 62 70";

  const eyeScaleY = blink ? 0.06 : mood === "surprised" ? 1.3 : 1;

  const showIdle   = variant === "idle"   || variant === "both";
  const showSignal = variant === "signal" || variant === "both";

  return (
    <>
      <style>{`
        @keyframes mascot-idle {
          0%,100% { transform: translateY(0) rotate(-1deg); }
          50%      { transform: translateY(-5px) rotate(1deg); }
        }
        @keyframes mascot-signal-1 {
          0%   { r: 2;  opacity: .9; }
          100% { r: 14; opacity: 0;  }
        }
        @keyframes mascot-signal-2 {
          0%   { r: 2;  opacity: .7; }
          100% { r: 22; opacity: 0;  }
        }
        @keyframes mascot-signal-3 {
          0%   { r: 2;  opacity: .5; }
          100% { r: 30; opacity: 0;  }
        }
        .mascot-root {
          display: inline-block;
          cursor: ${onClick ? "pointer" : "default"};
          ${showIdle ? "animation: mascot-idle 3.2s ease-in-out infinite;" : ""}
          transform-origin: bottom center;
        }
        .mascot-root:hover {
          animation-duration: 1.6s;
        }
      `}</style>

      <div
        ref={ref}
        className={`mascot-root select-none ${className}`}
        style={{ width: size, height: size * 1.15 }}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === "Enter" && onClick(e) : undefined}
        title="Radárek"
      >
        <svg
          viewBox="0 0 100 115"
          width={size}
          height={size * 1.15}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
        >
          <defs>
            {/* Glow filter pro zlatou anténu */}
            <filter id="gold-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            {/* Shadow pod tělem */}
            <radialGradient id="shadow-grad" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#000613" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#000613" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ── Stín pod postavičkou ── */}
          <ellipse cx="50" cy="112" rx="22" ry="4" fill="url(#shadow-grad)" />

          {/* ── Nožičky ── */}
          <rect x="40" y="96" width="8" height="13" rx="3" fill="#001838" />
          <rect x="52" y="96" width="8" height="13" rx="3" fill="#001838" />
          {/* Botičky */}
          <ellipse cx="44" cy="109" rx="7" ry="3.5" fill="#000d24" />
          <ellipse cx="56" cy="109" rx="7" ry="3.5" fill="#000d24" />

          {/* ── Tělo ── */}
          <rect x="28" y="74" width="44" height="28" rx="10" fill="#001f3f" />
          {/* Panel na těle */}
          <rect x="34" y="80" width="20" height="10" rx="3" fill="#001838" opacity="0.7" />
          <rect x="36" y="82" width="4" height="4" rx="1" fill="#ffdbce" opacity="0.5" />
          <rect x="42" y="82" width="4" height="4" rx="1" fill="#afc8f0" opacity="0.5" />
          <rect x="48" y="82" width="4" height="4" rx="1" fill="#afc8f0" opacity="0.3" />
          {/* Pulsující světýlko */}
          <circle cx="65" cy="84" r="3.5" fill="#ffdbce">
            <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
          </circle>

          {/* ── Hlavní kulatá hlava ── */}
          <circle cx="50" cy="52" r="33" fill="#001f3f" />
          {/* Tmavší "obrazovka" */}
          <circle cx="50" cy="52" r="28" fill="#00112b" />
          {/* Vnitřní záře */}
          <circle cx="50" cy="52" r="28" fill="#1a4a7a" opacity="0.08" />
          {/* Odlesk */}
          <ellipse cx="40" cy="36" rx="10" ry="6" fill="white" opacity="0.05" transform="rotate(-25 40 36)" />

          {/* Radarové kruhy na pozadí hlavy */}
          {[22, 16, 10].map((r, i) => (
            <circle key={r} cx="50" cy="52" r={r} stroke="#afc8f0" strokeWidth="0.5" opacity={0.05 + i * 0.03} />
          ))}

          {/* ── SIGNAL animace — zlaté vlny z antény ── */}
          {showSignal && (
            <g transform="translate(50, 18)">
              <circle cx="0" cy="0" r="2" fill="none" stroke="#f5c842" strokeWidth="1.5">
                <animate attributeName="r" values="2;14" dur="1.8s" repeatCount="indefinite" begin="0s" />
                <animate attributeName="opacity" values="0.9;0" dur="1.8s" repeatCount="indefinite" begin="0s" />
              </circle>
              <circle cx="0" cy="0" r="2" fill="none" stroke="#f5c842" strokeWidth="1.2">
                <animate attributeName="r" values="2;22" dur="1.8s" repeatCount="indefinite" begin="0.5s" />
                <animate attributeName="opacity" values="0.7;0" dur="1.8s" repeatCount="indefinite" begin="0.5s" />
              </circle>
              <circle cx="0" cy="0" r="2" fill="none" stroke="#f5c842" strokeWidth="1">
                <animate attributeName="r" values="2;30" dur="1.8s" repeatCount="indefinite" begin="1s" />
                <animate attributeName="opacity" values="0.5;0" dur="1.8s" repeatCount="indefinite" begin="1s" />
              </circle>
            </g>
          )}

          {/* ── Zlatá anténa ── */}
          {/* Tyčka */}
          <line x1="50" y1="20" x2="50" y2="8" stroke="#f5c842" strokeWidth="2" strokeLinecap="round" filter="url(#gold-glow)" />
          {/* Miska antény */}
          <path d="M 41 8 Q 50 2 59 8 Q 50 13 41 8 Z" fill="#f5c842" filter="url(#gold-glow)" />
          {/* Zlatý střed */}
          <circle cx="50" cy="8" r="2.5" fill="#fff3b0" filter="url(#gold-glow)" />
          {/* Lesk na misce */}
          <path d="M 43 7 Q 48 4 54 7" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />

          {/* ── Obočí ── */}
          <path
            d={mood === "surprised" ? "M 30 43 Q 37 37 44 43" : mood === "thinking" ? "M 30 46 Q 37 43 44 47" : "M 30 46 Q 37 43 44 46"}
            stroke="#afc8f0" strokeWidth="2" strokeLinecap="round"
            style={{ transition: "d 0.35s ease" }}
          />
          <path
            d={mood === "surprised" ? "M 56 43 Q 63 37 70 43" : mood === "thinking" ? "M 56 47 Q 63 43 70 46" : "M 56 46 Q 63 43 70 46"}
            stroke="#afc8f0" strokeWidth="2" strokeLinecap="round"
            style={{ transition: "d 0.35s ease" }}
          />

          {/* ── Levé oko ── */}
          <g style={{ transform: `translate(37px, 54px) scaleY(${eyeScaleY})`, transformOrigin: "37px 54px", transition: "transform 0.1s" }}>
            <circle cx="0" cy="0" r="8" fill="white" />
            <circle cx="0" cy="0" r="5.5" fill="#00112b" />
            <circle cx={eyeOffset.x} cy={eyeOffset.y} r="4" fill="white" style={{ transition: "cx 0.08s, cy 0.08s" }} />
            <circle cx={eyeOffset.x + 1.5} cy={eyeOffset.y - 1.8} r="1.2" fill="white" opacity="0.9" style={{ transition: "cx 0.08s, cy 0.08s" }} />
          </g>

          {/* ── Pravé oko ── */}
          <g style={{ transform: `translate(63px, 54px) scaleY(${eyeScaleY})`, transformOrigin: "63px 54px", transition: "transform 0.1s" }}>
            <circle cx="0" cy="0" r="8" fill="white" />
            <circle cx="0" cy="0" r="5.5" fill="#00112b" />
            <circle cx={eyeOffset.x} cy={eyeOffset.y} r="4" fill="white" style={{ transition: "cx 0.08s, cy 0.08s" }} />
            <circle cx={eyeOffset.x + 1.5} cy={eyeOffset.y - 1.8} r="1.2" fill="white" opacity="0.9" style={{ transition: "cx 0.08s, cy 0.08s" }} />
          </g>

          {/* ── Pusa ── */}
          <path d={mouth} stroke="#afc8f0" strokeWidth="2.5" strokeLinecap="round" fill="none" style={{ transition: "d 0.4s ease" }} />
          {/* Tvářičky */}
          {(mood === "happy" || mood === "normal") && (
            <>
              <ellipse cx="30" cy="63" rx="5" ry="3" fill="#ffdbce" opacity="0.35" />
              <ellipse cx="70" cy="63" rx="5" ry="3" fill="#ffdbce" opacity="0.35" />
            </>
          )}

          {/* ── Ručičky ── */}
          {/* Levá — mírně zvednutá */}
          <path d="M 28 82 Q 16 76 12 82" stroke="#001f3f" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="10" cy="80" r="3" fill="#001838" />
          <circle cx="12" cy="84" r="3" fill="#001838" />
          <circle cx="8" cy="85" r="3" fill="#001838" />

          {/* Pravá */}
          <path d="M 72 82 Q 84 76 88 82" stroke="#001f3f" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="90" cy="80" r="3" fill="#001838" />
          <circle cx="88" cy="84" r="3" fill="#001838" />
          <circle cx="92" cy="85" r="3" fill="#001838" />

          {/* ── Surprised hvězdičky ── */}
          {mood === "surprised" &&
            [0, 72, 144, 216, 288].map((deg) => {
              const r = (deg * Math.PI) / 180;
              return (
                <text key={deg} x={50 + Math.cos(r) * 38} y={52 + Math.sin(r) * 38}
                  fontSize="7" textAnchor="middle" dominantBaseline="middle" fill="#f5c842">
                  ✦
                  <animate attributeName="opacity" values="1;0.2;1" dur="0.7s" repeatCount="indefinite" begin={`${deg / 288}s`} />
                </text>
              );
            })}

          {/* ── Thinking tečky ── */}
          {mood === "thinking" &&
            [0, 1, 2].map((i) => (
              <circle key={i} cx={68 + i * 7} cy={40} r="2.5" fill="#afc8f0">
                <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
              </circle>
            ))}
        </svg>
      </div>
    </>
  );
}
