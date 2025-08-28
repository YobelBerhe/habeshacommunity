import { t, Lang } from "@/lib/i18n";

type Props = {
  lang: Lang;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  jobKind?: "regular"|"gig";
  onChange: (next: Partial<Props>) => void;
};

export default function QuickFilters({ lang, category, minPrice, maxPrice, jobKind, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span className="text-sm text-muted-foreground mr-2">{t(lang,"filters")}:</span>

      {category === "housing" && (
        <>
          <input
            className="field w-[110px]"
            placeholder={`${t(lang,"min")} ${t(lang,"price")}`}
            inputMode="decimal"
            value={minPrice ?? ""}
            onChange={(e)=>onChange({ minPrice: toNum(e.target.value) })}
          />
          <input
            className="field w-[110px]"
            placeholder={`${t(lang,"max")} ${t(lang,"price")}`}
            inputMode="decimal"
            value={maxPrice ?? ""}
            onChange={(e)=>onChange({ maxPrice: toNum(e.target.value) })}
          />
        </>
      )}

      {category === "jobs" && (
        <div className="flex items-center gap-2">
          <span className="text-sm">{t(lang,"job_kind")}:</span>
          <button
            className={`chip ${jobKind==='regular' ? 'chip-active':''}`}
            onClick={()=>onChange({ jobKind: 'regular' })}
          >{t(lang,"job_regular")}</button>
          <button
            className={`chip ${jobKind==='gig' ? 'chip-active':''}`}
            onClick={()=>onChange({ jobKind: 'gig' })}
          >{t(lang,"job_gig")}</button>
        </div>
      )}
    </div>
  );
}

function toNum(v: string){ const n = Number(v); return isNaN(n) ? undefined : n; }