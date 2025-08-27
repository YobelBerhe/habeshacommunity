import { useEffect, useMemo, useState } from "react";
import { TAXONOMY, LABELS } from "@/lib/taxonomy";
import { t, Lang } from "@/lib/i18n";

type Props = {
  lang: Lang;
  value: string;
  onChange: (v: string) => void;
  onPickCategory: (slug: string) => void;      // e.g. "jobs"
  onPickSubcategory: (slug: string) => void;   // e.g. "transport"
  onPickTag: (tag: string) => void;
};

export default function SearchBox({ lang, value, onChange, onPickCategory, onPickSubcategory, onPickTag }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(value);

  useEffect(()=>{ setQ(value); }, [value]);

  const { catHits, subHits, tagHits } = useMemo(() => {
    const query = (q || "").toLowerCase().trim();
    if (!query) return { catHits: [], subHits: [], tagHits: [] };

    // categories
    const cats = Object.entries(TAXONOMY)
      .map(([k, v]) => ({ slug: k, label: v.name[lang.toLowerCase() as "en"|"ti"] }))
      .filter(c => c.label.toLowerCase().includes(query));

    // subcategories
    const subs: { slug: string; label: string }[] = [];
    for (const group of Object.values(TAXONOMY)) {
      for (const s of group.sub) {
        const label = LABELS[s]?.[lang.toLowerCase() as "en"|"ti"] ?? s.replace(/_/g," ");
        if (label.toLowerCase().includes(query)) subs.push({ slug: s, label });
      }
    }

    // simple tag suggestions
    const tagsBase = ["rent","room","apartment","driver","nurse","barista","gig","remote","furnished","wifi","parking"];
    const tags = tagsBase.filter(t => t.includes(query)).slice(0, 6).map(t => ({ tag: t }));

    return { catHits: cats.slice(0,5), subHits: subs.slice(0,8), tagHits: tags };
  }, [q, lang]);

  return (
    <div className="relative">
      <input
        className="field w-full"
        placeholder={t(lang,"search_placeholder")}
        value={q}
        onChange={(e)=>{ setQ(e.target.value); onChange(e.target.value); setOpen(true); }}
        onFocus={()=>setOpen(true)}
        onBlur={()=>setTimeout(()=>setOpen(false), 120)}
      />
      {open && (catHits.length || subHits.length || tagHits.length) ? (
        <div className="absolute z-30 mt-1 w-full rounded-lg border bg-popover shadow-md overflow-hidden">
          {catHits.length > 0 && (
            <Section title={t(lang,"hint_categories")}>
              {catHits.map(c => (
                <Item key={c.slug} label={c.label} onClick={()=>onPickCategory(c.slug)} />
              ))}
            </Section>
          )}
          {subHits.length > 0 && (
            <Section title={t(lang,"hint_subcategories")}>
              {subHits.map(s => (
                <Item key={s.slug} label={s.label} onClick={()=>onPickSubcategory(s.slug)} />
              ))}
            </Section>
          )}
          {tagHits.length > 0 && (
            <Section title={t(lang,"hint_tags")}>
              {tagHits.map(tg => (
                <Item key={tg.tag} label={`#${tg.tag}`} onClick={()=>onPickTag(tg.tag)} />
              ))}
            </Section>
          )}
        </div>
      ) : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-3 py-2 border-b last:border-0">
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{title}</div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function Item({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="text-left px-2 py-1.5 rounded hover:bg-muted" onClick={onClick}>
      {label}
    </button>
  );
}