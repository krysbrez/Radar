export default function SignalCard({
  eyebrow,
  value,
  note,
  tone = "neutral",
}) {
  const toneClass = {
    positive: "text-emerald-400",
    negative: "text-red-400",
    neutral: "text-white",
    accent: "text-[#ffd700]",
  }[tone] ?? "text-white";

  return (
    <div className="rounded-2xl p-5 border bg-white/8 border-white/8 shadow-none">
      <p className="text-xs font-bold uppercase tracking-wider mb-1 font-headline text-white/55">
        {eyebrow}
      </p>
      <p className={`text-3xl font-black font-headline leading-none ${toneClass}`}>
        {value}
      </p>
      <p className="text-xs mt-1 text-white/55">
        {note}
      </p>
    </div>
  );
}
