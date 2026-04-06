export default function SignalCard({
  eyebrow,
  value,
  note,
  tone = "neutral",
}) {
  const toneClass = {
    positive: "text-green-600",
    negative: "text-red-500",
    neutral: "text-primary",
    accent: "text-orange-500",
  }[tone] ?? "text-primary";

  return (
    <div className="bg-white rounded-2xl p-5 border border-outline-variant/10 shadow-sm">
      <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1 font-headline">
        {eyebrow}
      </p>
      <p className={`text-3xl font-black font-headline leading-none ${toneClass}`}>
        {value}
      </p>
      <p className="text-xs text-outline mt-1">
        {note}
      </p>
    </div>
  );
}
