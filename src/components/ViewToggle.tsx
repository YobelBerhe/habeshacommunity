import { Grid3X3, List, Map, Images } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ViewMode = "list" | "grid" | "gallery" | "map" | "compact";
export type SortKey = "relevance" | "newest" | "oldest" | "price_asc" | "price_desc" | "upcoming" | "has_image";

interface ViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  const views = [
    { mode: "grid" as const, icon: Grid3X3, label: "Grid" },
    { mode: "map" as const, icon: Map, label: "Map" },
    { mode: "compact" as const, icon: List, label: "Compact" },
    { mode: "list" as const, icon: List, label: "List" },
    { mode: "gallery" as const, icon: Images, label: "Gallery" },
  ];

  return (
    <div className="flex items-center gap-1 border rounded-lg p-1">
      {views.map(({ mode, icon: Icon, label }) => (
        <Button
          key={mode}
          variant={viewMode === mode ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(mode)}
          className={`h-8 px-2 md:px-2 md:h-8 px-1.5 h-7 w-7 md:w-auto ${mode === 'map' ? 'md:hidden' : ''}`}
          aria-label={label}
        >
          <Icon className="w-4 h-4 md:w-4 md:h-4 w-3.5 h-3.5" />
        </Button>
      ))}
    </div>
  );
}