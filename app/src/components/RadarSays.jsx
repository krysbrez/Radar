import Mascot from "./Mascot";

export default function RadarSays({ text }) {
  return (
    <div className="gradient-primary rounded-2xl px-6 py-4 flex gap-4 items-start my-6">
      <div className="flex-shrink-0">
        <Mascot size={40} mood="happy" variant="signal" trackMouse={false} />
      </div>
      <div>
        <p className="text-xs font-black text-primary-fixed-dim/70 uppercase tracking-widest font-headline mb-1">Radar říká:</p>
        <p className="text-sm text-white leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
