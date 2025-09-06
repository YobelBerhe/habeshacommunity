import { useEffect, useMemo, useState } from "react";
import { TAXONOMY, LABELS, CategoryKey } from "@/lib/taxonomy";
import { t, Lang } from "@/lib/i18n";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Props = {
  lang: Lang;
  value: string;
  onChange: (v: string) => void;
  onPickCategory: (slug: string) => void;      // e.g. "jobs"
  onPickSubcategory: (slug: string) => void;   // e.g. "transport"
  onPickTag: (tag: string) => void;
  selectedCategory?: CategoryKey | null;       // current category to show subcategories for
};

export default function SearchBox({ lang, value, onChange, onPickCategory, onPickSubcategory, onPickTag, selectedCategory }: Props) {
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  const subcategories = useMemo(() => {
    if (!selectedCategory || !TAXONOMY[selectedCategory]) return [];
    
    return TAXONOMY[selectedCategory].sub.map(sub => ({
      slug: sub,
      label: LABELS[sub]?.[lang.toLowerCase() as "en"|"ti"] ?? sub.replace(/_/g, " ")
    }));
  }, [selectedCategory, lang]);

  const handleSubcategoryToggle = (subcategory: string) => {
    const newSelected = selectedSubcategories.includes(subcategory)
      ? selectedSubcategories.filter(s => s !== subcategory)
      : [...selectedSubcategories, subcategory];
    
    setSelectedSubcategories(newSelected);
    onPickSubcategory(subcategory);
  };

  if (!selectedCategory || subcategories.length === 0) {
    return (
      <div className="field w-full min-h-[40px] flex items-center text-muted-foreground">
        Select a category to see subcategories
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-sm font-medium mb-2 text-foreground">
        {TAXONOMY[selectedCategory].name[lang.toLowerCase() as "en"|"ti"]} Subcategories
      </div>
      <ToggleGroup 
        type="multiple" 
        value={selectedSubcategories}
        onValueChange={setSelectedSubcategories}
        className="flex flex-wrap gap-2 justify-start"
      >
        {subcategories.map(sub => (
          <ToggleGroupItem
            key={sub.slug}
            value={sub.slug}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => handleSubcategoryToggle(sub.slug)}
          >
            {sub.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
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