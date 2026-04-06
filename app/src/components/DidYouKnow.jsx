export default function DidYouKnow({ text }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-6 py-4 flex gap-3 items-start my-6">
      <span className="text-2xl flex-shrink-0">💡</span>
      <div>
        <p className="text-xs font-black text-yellow-700 uppercase tracking-widest font-headline mb-1">Věděl/a jsi?</p>
        <p className="text-sm text-yellow-900 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
