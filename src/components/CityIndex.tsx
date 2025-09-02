import { TAXONOMY, LABELS, CategoryKey, isGig } from "@/lib/taxonomy";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import type { Listing } from "@/types";

type Props = {
  city: string;
  lang?: "en" | "ti";
  listings: Listing[];
  onOpen: (opts: { category: CategoryKey; sub?: string }) => void;
};

const COLUMNS: CategoryKey[] = ["community", "housing", "jobs", "services"];

export default function CityIndex({ city, lang = "en", listings, onOpen }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | "">("");

  const count = (cat: CategoryKey, sub?: string) => {
    if (!sub) return listings.filter(l => l.category === cat).length;
    return listings.filter(l => l.category === cat && l.subcategory === sub).length;
  };

  const handleCategorySelect = (category: string) => {
    if (category === selectedCategory) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category as CategoryKey);
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
        {cityLabel(city)} — {lang === "ti" ? "መዝገብ ምድብታት" : "Browse by category"}
      </h1>

      {/* Category Toggle Selection */}
      <div className="mb-8">
        <ToggleGroup 
          type="single" 
          value={selectedCategory} 
          onValueChange={handleCategorySelect}
          className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full"
        >
          {COLUMNS.map((cat) => (
            <ToggleGroupItem
              key={cat}
              value={cat}
              className="flex flex-col items-center justify-center p-4 h-auto border border-border/50 bg-card hover:bg-accent data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-lg transition-all"
            >
              <span className="font-semibold text-sm">
                {TAXONOMY[cat].name[lang]}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                ({count(cat)})
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Subcategory Grid - only show when category is selected */}
      {selectedCategory && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-center">
            {TAXONOMY[selectedCategory].name[lang]} {lang === "ti" ? "ንኣብ ምድብታት" : "Subcategories"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TAXONOMY[selectedCategory].sub.map((sub) => {
              const label = (LABELS[sub]?.[lang] ?? sub.replace(/_/g, " "));
              const c = count(selectedCategory, sub);
              return (
                <button
                  key={sub}
                  onClick={() => onOpen({ category: selectedCategory, sub })}
                  className="flex items-center justify-between rounded-lg px-4 py-3 border border-border/50 bg-card hover:bg-accent transition-colors"
                >
                  <span className="text-left font-medium">{label}</span>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">{c}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Hints */}
      <div className="text-center text-sm text-muted-foreground">
        {lang === "ti"
          ? "ምድብ ምርጫ ድሕሪኡ ንኣብ ምድብ ንምርዳእ"
          : "Select a category above, then choose a subcategory to see listings"}
      </div>
    </section>
  );
}

function cityLabel(city: string) {
  // Already normalized upstream; keep as-is for now.
  return city;
}
