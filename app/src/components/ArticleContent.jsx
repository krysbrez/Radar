export function slugifyHeading(text) {
  return text
    .toLowerCase()
    .replace(/[áä]/g,"a").replace(/[éě]/g,"e").replace(/[íï]/g,"i")
    .replace(/[óö]/g,"o").replace(/[úůü]/g,"u").replace(/ý/g,"y")
    .replace(/č/g,"c").replace(/ď/g,"d").replace(/ň/g,"n")
    .replace(/ř/g,"r").replace(/š/g,"s").replace(/ť/g,"t").replace(/ž/g,"z")
    .replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}

function renderInline(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-white">$1</strong>')
    .replace(/==(.*?)==/g, '<span class="rounded px-1.5 py-0.5 font-semibold bg-[#ffd700]/15 text-[#ffd700]">$1</span>')
    .replace(/\*((?!\*)[^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#afc8f0] underline underline-offset-2 hover:text-white transition-colors">$1</a>')
    // Positive values — bright on dark
    .replace(/(\+\d[\d\s]*[,.]?\d*\s*%)/g, '<span class="font-black text-emerald-400">$1</span>')
    .replace(/(\+\d[\d\s]*[,.]?\d*\s*(?:Kč|USD|EUR|CZK))/g, '<span class="font-black text-emerald-400">$1</span>')
    // Negative values
    .replace(/(−\d[\d\s]*[,.]?\d*\s*%|(?<![a-zA-Z0-9])-\d[\d\s]*[,.]?\d*\s*%)/g, '<span class="font-black text-red-400">$1</span>');
}

function renderTable(block, key) {
  const rows = block.split("\n").filter((row) => row.trim());
  const cleaned = rows.filter((row) => !row.match(/^\|?[\s:-]+\|[\s|:-]*$/));
  if (cleaned.length === 0) return null;

  const header = cleaned[0].split("|").filter(Boolean).map((cell) => cell.trim());
  const body = cleaned.slice(1).map((row) => row.split("|").filter(Boolean).map((cell) => cell.trim()));

  return (
    <div key={key} className="my-7 overflow-x-auto rounded-2xl border border-white/8 bg-white/4">
      <table className="w-full min-w-[32rem] text-sm">
        <thead className="border-b border-white/8 bg-white/4">
          <tr>
            {header.map((cell, index) => (
              <th key={index} className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-[0.18em] text-white/60 font-headline">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-white/6 hover:bg-white/4 transition-colors">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-top text-white/85"
                  dangerouslySetInnerHTML={{ __html: renderInline(cell) }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderCallout(block, key) {
  const lines = block.split("\n");
  const header = lines[0].replace(/^:::/, "").trim();
  const body = lines.slice(1).join("\n").trim();
  const [kind, ...titleParts] = header.split(" ");
  const title = titleParts.join(" ").trim();

  const styles = {
    tip: {
      shell: "border-emerald-400/20 bg-emerald-400/6",
      badge: "text-emerald-300 bg-emerald-400/15",
      text: "text-white/85",
      icon: "💡",
      label: title || "Tip",
    },
    warning: {
      shell: "border-amber-400/20 bg-amber-400/6",
      badge: "text-amber-300 bg-amber-400/15",
      text: "text-white/85",
      icon: "⚠️",
      label: title || "Pozor",
    },
    example: {
      shell: "border-sky-400/20 bg-sky-400/6",
      badge: "text-sky-300 bg-sky-400/15",
      text: "text-white/85",
      icon: "🧪",
      label: title || "Příklad",
    },
    term: {
      shell: "border-violet-400/20 bg-violet-400/6",
      badge: "text-violet-300 bg-violet-400/15",
      text: "text-white/85",
      icon: "🔎",
      label: title || "Pojem",
    },
    takeaway: {
      shell: "border-[#ffd700]/20 bg-[#ffd700]/5",
      badge: "text-[#ffd700] bg-[#ffd700]/15",
      text: "text-white/85",
      icon: "📌",
      label: title || "Takeaway",
    },
  };

  const style = styles[kind];
  if (!style) return null;

  return (
    <div key={key} className={`my-7 rounded-2xl border px-5 py-5 ${style.shell}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{style.icon}</span>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.18em] font-headline ${style.badge}`}>
          {style.label}
        </span>
      </div>
      <div className="space-y-3">
        {body.split("\n").filter(Boolean).map((line, index) => (
          <p key={index} className={`text-sm leading-relaxed ${style.text}`}
            dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
        ))}
      </div>
    </div>
  );
}

function renderQuote(block, key) {
  const lines = block.split("\n").map((line) => line.replace(/^>\s?/, "").trim()).filter(Boolean);
  return (
    <blockquote key={key} className="my-7 rounded-2xl border border-white/10 bg-white/5 px-5 py-5">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffd700]/60 font-headline mb-3">
        Radar Note
      </p>
      {lines.map((line, index) => (
        <p key={index} className="text-[1.02rem] leading-relaxed text-white/85 italic"
          dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
      ))}
    </blockquote>
  );
}

function renderSignalRow(block, key) {
  const patterns = [
    { prefix: "Nejdůležitější:", label: "Nejdůležitější", shell: "border-l-[#ffd700] bg-[#ffd700]/5" },
    { prefix: "Co si odnést:", label: "Co si odnést", shell: "border-l-emerald-400 bg-emerald-400/6" },
    { prefix: "V jedné větě:", label: "V jedné větě", shell: "border-l-sky-400 bg-sky-400/6" },
  ];

  const pattern = patterns.find(({ prefix }) => block.startsWith(prefix));
  if (!pattern) return null;

  const text = block.slice(pattern.prefix.length).trim();

  return (
    <div key={key} className={`my-6 rounded-r-2xl border border-white/8 border-l-4 px-5 py-4 ${pattern.shell}`}>
      <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/50 font-headline">
        {pattern.label}
      </p>
      <p className="text-[1.02rem] leading-relaxed text-white/85"
        dangerouslySetInnerHTML={{ __html: renderInline(text) }} />
    </div>
  );
}

export default function ArticleContent({ body }) {
  const blocks = body.split("\n\n");

  return (
    <>
      {blocks.map((block, i) => {
        if (block.startsWith(":::")) return renderCallout(block, i);

        if (block.startsWith("|")) return renderTable(block, i);

        if (block.startsWith(">")) return renderQuote(block, i);

        const signalRow = renderSignalRow(block, i);
        if (signalRow) return signalRow;

        // Section heading: **text** alone on a line
        if (block.startsWith("**") && block.endsWith("**") && !block.slice(2, -2).includes("**")) {
          const headingText = block.replace(/\*\*/g, "");
          return (
            <h3 key={i} id={slugifyHeading(headingText)}
              className="mt-9 mb-3 scroll-mt-24 text-[1.35rem] font-black tracking-tight text-white font-headline">
              {headingText}
            </h3>
          );
        }

        // Bullet / numbered list
        if (block.match(/^[-•]\s|^\d+\.\s/m)) {
          const items = block.split("\n").filter(Boolean);
          return (
            <ul key={i} className="my-4 space-y-2.5">
              {items.map((item, ii) => (
                <li key={ii} className="flex items-start gap-2.5">
                  <span className="mt-1 flex-shrink-0 text-[#afc8f0]/70 text-sm leading-none">
                    {item.match(/^\d+\./) ? "→" : "·"}
                  </span>
                  <span className="leading-relaxed text-white/85"
                    dangerouslySetInnerHTML={{ __html: renderInline(item.replace(/^[-•]?\s*|^\d+\.\s*/, "")) }} />
                </li>
              ))}
            </ul>
          );
        }

        // Paragraph with inline markdown
        if (block.includes("**") || block.includes("*") || block.includes("[")) {
          return (
            <p key={i} className="text-[1.05rem] leading-relaxed text-white/85"
              dangerouslySetInnerHTML={{ __html: renderInline(block) }} />
          );
        }

        // Plain paragraph
        return (
          <p key={i} className="text-[1.05rem] leading-relaxed text-white/85">
            {block}
          </p>
        );
      })}
    </>
  );
}
