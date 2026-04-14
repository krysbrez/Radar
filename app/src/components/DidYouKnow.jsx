export default function DidYouKnow({ text }) {
  return (
    <div className="bg-[#ffd700]/8 border border-[#ffd700]/20 rounded-2xl px-6 py-4 flex gap-3 items-start my-6">
      <span className="text-2xl flex-shrink-0">💡</span>
      <div>
        <p className="text-xs font-black text-[#ffd700]/70 uppercase tracking-widest font-headline mb-1">Věděl/a jsi?</p>
        <p className="text-sm text-white/85 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
