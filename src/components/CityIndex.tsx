import { TAXONOMY, LABELS, CategoryKey, isGig } from "@/lib/taxonomy";
import { getListingsByCity } from "@/utils/storage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

type Props = {
  city: string;
  lang?: "en" | "ti";
  onOpen: (opts: { category: CategoryKey; sub?: string }) => void;
};

const COLUMNS: CategoryKey[] = ["community", "housing", "jobs", "services"];

export default function CityIndex({ city, lang = "en", onOpen }: Props) {
  const listings = getListingsByCity(city);
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

      {/* Category and Subcategory Dropdowns */}
      <div className="mb-8 flex flex-col sm:flex-row gap-3">
        <Select value={selectedCategory} onValueChange={handleCategorySelect}>
          <SelectTrigger className="w-full sm:w-[200px] bg-card border-border/50">
            <SelectValue placeholder={lang === "ti" ? "ምርጫ ምድብ" : "Select Category"} />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-50">
            {COLUMNS.map((cat) => (
              <SelectItem key={cat} value={cat} className="hover:bg-accent">
                <span className="font-medium">
                  {TAXONOMY[cat].name[lang]} ({count(cat)})
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedCategory && (
          <Select onValueChange={(sub) => onOpen({ category: selectedCategory, sub })}>
            <SelectTrigger className="w-full sm:w-[200px] bg-card border-border/50">
              <SelectValue placeholder={lang === "ti" ? "ምርጫ ንኣብ ምድብ" : "Select Subcategory"} />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              {TAXONOMY[selectedCategory].sub.map((sub) => {
                const label = (LABELS[sub]?.[lang] ?? sub.replace(/_/g, " "));
                const c = count(selectedCategory, sub);
                return (
                  <SelectItem key={sub} value={sub} className="hover:bg-accent">
                    <span className="font-medium">{label} ({c})</span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
      </div>


      {/* Hints */}
      <div className="text-center text-sm text-muted-foreground">
        {lang === "ti"
          ? "ምድብ ምርጫ ድሕሪኡ ንኣብ ምድብ ንምርዳእ"
          : "Select a category, then choose a subcategory to see listings"}
      </div>
    </section>
  );
}

function cityLabel(city: string) {
  // Already normalized upstream; keep as-is for now.
  return city;
}
