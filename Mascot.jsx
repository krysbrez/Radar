import { useState, useEffect } from "react";

const MascotNormal = () => (
  <svg viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="bodyN" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#1a3a5c"/>
        <stop offset="100%" stopColor="#001F3F"/>
      </radialGradient>
      <radialGradient id="eyeN" cx="35%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="100%" stopColor="#e0e8f0"/>
      </radialGradient>
    </defs>

    {/* Shadow */}
    <ellipse cx="100" cy="408" rx="62" ry="10" fill="#001F3F" opacity="0.15"/>

    {/* Legs */}
    <rect x="66" y="330" width="22" height="62" rx="11" fill="#001F3F"/>
    <rect x="112" y="330" width="22" height="62" rx="11" fill="#001F3F"/>
    <ellipse cx="77" cy="393" rx="26" ry="13" fill="#000a1a"/>
    <ellipse cx="123" cy="393" rx="26" ry="13" fill="#000a1a"/>
    <ellipse cx="70" cy="389" rx="8" ry="4" fill="#1a2a4a" opacity="0.5"/>
    <ellipse cx="116" cy="389" rx="8" ry="4" fill="#1a2a4a" opacity="0.5"/>

    {/* Body */}
    <ellipse cx="100" cy="265" rx="68" ry="75" fill="url(#bodyN)"/>
    <ellipse cx="78" cy="228" rx="22" ry="14" fill="#1a4a7a" opacity="0.35"/>

    {/* Belly screen */}
    <rect x="62" y="244" width="76" height="52" rx="12" fill="#000d1f"/>
    <rect x="65" y="247" width="70" height="46" rx="10" fill="#001428"/>
    <polyline points="70,282 80,267 90,275 102,257 112,267 122,251 130,259" fill="none" stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="130" cy="259" r="4" fill="#00ff88"/>
    <rect x="65" y="247" width="70" height="3" rx="1.5" fill="#0066cc" opacity="0.6"/>

    {/* Arms */}
    <ellipse cx="28" cy="242" rx="28" ry="13" fill="#001F3F" transform="rotate(-18 28 242)"/>
    <ellipse cx="172" cy="242" rx="28" ry="13" fill="#001F3F" transform="rotate(18 172 242)"/>
    <circle cx="16" cy="234" r="15" fill="#000d1f"/>
    <circle cx="184" cy="234" r="15" fill="#000d1f"/>
    <line x1="10" y1="230" x2="10" y2="240" stroke="#1a3a6a" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="16" y1="227" x2="16" y2="242" stroke="#1a3a6a" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="178" y1="230" x2="178" y2="240" stroke="#1a3a6a" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="184" y1="227" x2="184" y2="242" stroke="#1a3a6a" strokeWidth="1.5" strokeLinecap="round"/>

    {/* Neck */}
    <rect x="88" y="178" width="24" height="22" rx="8" fill="#001228"/>

    {/* Head */}
    <circle cx="100" cy="155" r="62" fill="url(#bodyN)"/>
    <ellipse cx="78" cy="122" rx="20" ry="13" fill="#1a4a7a" opacity="0.3"/>

    {/* Dish */}
    <ellipse cx="100" cy="100" rx="50" ry="13" fill="#000d1f"/>
    <path d="M50 95 Q100 42 150 95 Q125 80 100 77 Q75 80 50 95Z" fill="#002a5a" stroke="#0066cc" strokeWidth="1.5"/>
    <path d="M63 88 Q85 56 118 82" fill="none" stroke="#3a8ad4" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>

    {/* Antenna */}
    <rect x="97" y="40" width="6" height="40" rx="3" fill="#0066cc"/>
    <circle cx="100" cy="37" r="9" fill="#ffd700"/>
    <circle cx="97" cy="34" r="3" fill="#ffe866" opacity="0.7"/>

    {/* Signal wave */}
    <path d="M114 30 Q132 20 114 10" fill="none" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M120 26 Q145 12 120 0" fill="none" stroke="#ffd700" strokeWidth="2" opacity="0.6" strokeLinecap="round"/>

    {/* Eyes */}
    <circle cx="82" cy="150" r="22" fill="url(#eyeN)"/>
    <circle cx="118" cy="150" r="22" fill="url(#eyeN)"/>
    <circle cx="82" cy="150" r="22" fill="none" stroke="#001228" strokeWidth="1.5"/>
    <circle cx="118" cy="150" r="22" fill="none" stroke="#001228" strokeWidth="1.5"/>
    <circle cx="85" cy="152" r="12" fill="#001228"/>
    <circle cx="121" cy="152" r="12" fill="#001228"/>
    <circle cx="86" cy="152" r="7" fill="#0055cc"/>
    <circle cx="122" cy="152" r="7" fill="#0055cc"/>
    <circle cx="90" cy="147" r="4" fill="white"/>
    <circle cx="126" cy="147" r="4" fill="white"/>

    {/* Eyebrows */}
    <path d="M64 130 Q82 124 98 130" fill="none" stroke="#ffd700" strokeWidth="3" strokeLinecap="round"/>
    <path d="M103 130 Q118 124 135 130" fill="none" stroke="#ffd700" strokeWidth="3" strokeLinecap="round"/>

    {/* Nose */}
    <circle cx="100" cy="163" r="4" fill="#001228"/>

    {/* Smile */}
    <path d="M76 175 Q100 196 124 175" fill="#ffd700"/>
    <path d="M76 175 Q100 196 124 175" fill="none" stroke="#001228" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="88" y="175" width="10" height="8" rx="2" fill="white"/>
    <rect x="101" y="175" width="10" height="8" rx="2" fill="white"/>

    {/* Cheeks */}
    <ellipse cx="62" cy="170" rx="12" ry="8" fill="#ff6b9d" opacity="0.35"/>
    <ellipse cx="138" cy="170" rx="12" ry="8" fill="#ff6b9d" opacity="0.35"/>
  </svg>
);

const MascotExcited = () => (
  <svg viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="bodyE" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#1a3a5c"/>
        <stop offset="100%" stopColor="#001F3F"/>
      </radialGradient>
      <radialGradient id="eyeE" cx="35%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="100%" stopColor="#e0e8f0"/>
      </radialGradient>
    </defs>

    <ellipse cx="100" cy="408" rx="62" ry="10" fill="#001F3F" opacity="0.12"/>

    {/* Legs jumping */}
    <rect x="55" y="335" width="22" height="55" rx="11" fill="#001F3F" transform="rotate(-12 66 335)"/>
    <rect x="120" y="335" width="22" height="55" rx="11" fill="#001F3F" transform="rotate(12 131 335)"/>
    <ellipse cx="62" cy="390" rx="26" ry="13" fill="#000a1a" transform="rotate(-12 62 390)"/>
    <ellipse cx="138" cy="390" rx="26" ry="13" fill="#000a1a" transform="rotate(12 138 390)"/>

    {/* Body */}
    <ellipse cx="100" cy="260" rx="68" ry="75" fill="url(#bodyE)"/>
    <ellipse cx="78" cy="223" rx="22" ry="14" fill="#1a4a7a" opacity="0.35"/>

    {/* Belly green pumped */}
    <rect x="62" y="240" width="76" height="52" rx="12" fill="#000d1f"/>
    <rect x="65" y="243" width="70" height="46" rx="10" fill="#001428"/>
    <polyline points="70,275 78,255 86,265 96,242 106,254 116,234 126,243 134,229" fill="none" stroke="#00ff88" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="134" cy="229" r="5" fill="#00ff88"/>
    <rect x="65" y="243" width="70" height="3" rx="1.5" fill="#00cc44" opacity="0.8"/>

    {/* Arms raised */}
    <ellipse cx="22" cy="205" rx="28" ry="13" fill="#001F3F" transform="rotate(-55 22 205)"/>
    <ellipse cx="178" cy="205" rx="28" ry="13" fill="#001F3F" transform="rotate(55 178 205)"/>
    <circle cx="8" cy="188" r="15" fill="#000d1f"/>
    <circle cx="192" cy="188" r="15" fill="#000d1f"/>

    {/* Neck */}
    <rect x="88" y="173" width="24" height="22" rx="8" fill="#001228"/>

    {/* Head */}
    <circle cx="100" cy="150" r="62" fill="url(#bodyE)"/>
    <ellipse cx="78" cy="117" rx="20" ry="13" fill="#1a4a7a" opacity="0.3"/>

    {/* Dish */}
    <ellipse cx="100" cy="95" rx="50" ry="13" fill="#000d1f"/>
    <path d="M50 90 Q100 37 150 90 Q125 75 100 72 Q75 75 50 90Z" fill="#002a5a" stroke="#0066cc" strokeWidth="1.5"/>

    {/* Antenna */}
    <rect x="97" y="35" width="6" height="40" rx="3" fill="#0066cc"/>
    <circle cx="100" cy="32" r="9" fill="#ffd700"/>
    <circle cx="97" cy="29" r="3" fill="#ffe866" opacity="0.7"/>

    {/* Lots of signal waves */}
    <path d="M115 25 Q136 12 115 -1" fill="none" stroke="#ffd700" strokeWidth="3" strokeLinecap="round"/>
    <path d="M122 20 Q150 4 122 -12" fill="none" stroke="#ffd700" strokeWidth="2.5" opacity="0.7" strokeLinecap="round"/>
    <path d="M130 14 Q164 -4 130 -22" fill="none" stroke="#ffd700" strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
    <circle cx="158" cy="3" r="6" fill="#ffd700" opacity="0.7"/>
    <circle cx="172" cy="-7" r="4" fill="#ffd700" opacity="0.4"/>

    {/* Eyes huge */}
    <circle cx="82" cy="145" r="26" fill="url(#eyeE)"/>
    <circle cx="118" cy="145" r="26" fill="url(#eyeE)"/>
    <circle cx="82" cy="145" r="26" fill="none" stroke="#001228" strokeWidth="1.5"/>
    <circle cx="118" cy="145" r="26" fill="none" stroke="#001228" strokeWidth="1.5"/>
    <circle cx="83" cy="141" r="14" fill="#001228"/>
    <circle cx="119" cy="141" r="14" fill="#001228"/>
    <circle cx="84" cy="141" r="9" fill="#0055cc"/>
    <circle cx="120" cy="141" r="9" fill="#0055cc"/>
    <circle cx="89" cy="136" r="5" fill="white"/>
    <circle cx="125" cy="136" r="5" fill="white"/>

    {/* Eyebrows raised */}
    <path d="M60 116 Q82 106 102 116" fill="none" stroke="#ffd700" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M99 116 Q118 106 138 116" fill="none" stroke="#ffd700" strokeWidth="3.5" strokeLinecap="round"/>

    {/* Nose */}
    <circle cx="100" cy="158" r="4" fill="#001228"/>

    {/* Big open mouth */}
    <path d="M72 170 Q100 203 128 170" fill="#ffd700"/>
    <path d="M72 170 Q100 203 128 170" fill="none" stroke="#001228" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="100" cy="192" rx="12" ry="8" fill="#ff4466"/>
    <line x1="100" y1="186" x2="100" y2="198" stroke="#cc2244" strokeWidth="1.5"/>
    <rect x="83" y="170" width="11" height="9" rx="2" fill="white"/>
    <rect x="97" y="170" width="11" height="9" rx="2" fill="white"/>
    <rect x="111" y="170" width="11" height="9" rx="2" fill="white"/>

    {/* Cheeks */}
    <ellipse cx="58" cy="165" rx="14" ry="9" fill="#ff6b9d" opacity="0.45"/>
    <ellipse cx="142" cy="165" rx="14" ry="9" fill="#ff6b9d" opacity="0.45"/>

    {/* Sweat drop */}
    <path d="M148 118 Q151 110 154 118 Q154 124 151 124 Q148 124 148 118Z" fill="#66aaff" opacity="0.7"/>
  </svg>
);

export default function Mascot({ size = 120, autoExcite = false, className = "" }) {
  const [excited, setExcited] = useState(false);

  useEffect(() => {
    if (!autoExcite) return;
    const interval = setInterval(() => {
      setExcited(true);
      setTimeout(() => setExcited(false), 2000);
    }, 8000);
    return () => clearInterval(interval);
  }, [autoExcite]);

  return (
    <div
      className={`cursor-pointer select-none transition-transform duration-200 hover:scale-110 ${className}`}
      style={{ width: size, height: size * 2.1 }}
      onClick={() => {
        setExcited(true);
        setTimeout(() => setExcited(false), 2000);
      }}
      title="Klikni na mě!"
    >
      <div
        style={{
          animation: excited ? "none" : "mascotBob 3s ease-in-out infinite",
        }}
      >
        <style>{`
          @keyframes mascotBob {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes mascotJump {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-16px) scale(1.05); }
          }
        `}</style>
        <div style={{ animation: excited ? "mascotJump 0.4s ease-in-out infinite" : undefined }}>
          {excited ? <MascotExcited /> : <MascotNormal />}
        </div>
      </div>
    </div>
  );
}
