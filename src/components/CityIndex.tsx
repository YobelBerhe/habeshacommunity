// /components/CityIndex.tsx
import { TAXONOMY, LABELS, CategoryKey, isGig } from "@/lib/taxonomy";
import { getListingsByCity } from "@/utils/storage";

type Props = {
  city: string;
  lang?: "en" | "ti";
  onOpen: (opts: { category: CategoryKey; sub?: string }) => void;
};

const COLUMNS: CategoryKey[] = ["community", "housing", "jobs", "services"];

export default function CityIndex({ city, lang = "en", onOpen }: Props) {
  const listings = getListingsByCity(city);

  const count = (cat: CategoryKey, sub?: string) => {
    if (!sub) return listings.filter(l => l.category === cat).length;
    return listings.filter(l => l.category === cat && l.subcategory === sub).length;
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        {cityLabel(city)} — {lang === "ti" ? "መዝገብ ምድብታት" : "Browse by category"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {COLUMNS.map((cat) => (
          <div key={cat} className="rounded-xl border border-border/50 bg-gradient-card p-4">
            <h2 className="text-lg font-semibold mb-3">
              {TAXONOMY[cat].name[lang]}
              <span className="text-muted-foreground ml-2 text-sm">
                ({count(cat)})
              </span>
            </h2>

            <ul className="space-y-1">
              {TAXONOMY[cat].sub.map((sub) => {
                const label = (LABELS[sub]?.[lang] ?? sub.replace(/_/g, " "));
                const c = count(cat, sub);
                return (
                  <li key={sub}>
                    <button
                      onClick={() => onOpen({ category: cat, sub })}
                      className="w-full flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted transition"
                    >
                      <span className="text-left">{label}</span>
                      <span className="text-xs text-muted-foreground">{c}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Hints row */}
      <div className="mt-6 text-sm text-muted-foreground">
        {lang === "ti"
          ? "ጠቕላላ ምድብ ወይ ንኣብ ንምድብ ንምሕደራ ጠውቕ."
          : "Click a subcategory to open filtered results for this city."}
      </div>
    </section>
  );
}

function cityLabel(city: string) {
  // Already normalized upstream; keep as-is for now.
  return city;
}
